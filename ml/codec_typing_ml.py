"""
V Typing ML Analysis Pipeline
Three models trained on user's typing session data:
  1. Weak Key Classifier (Random Forest)
  2. WPM Growth Predictor (Polynomial Regression)
  3. Typing Fingerprint (K-Means Clustering)

Reads JSON session data from stdin, outputs analysis report JSON to stdout.
"""

import sys
import json
import numpy as np
import pandas as pd
from collections import defaultdict

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.preprocessing import PolynomialFeatures
    from sklearn.linear_model import LinearRegression
    from sklearn.cluster import KMeans
    from sklearn.preprocessing import StandardScaler
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False


def parse_sessions(raw_sessions):
    """Parse raw session data into structured format."""
    sessions = []
    for s in raw_sessions:
        sessions.append({
            'date': s.get('date', ''),
            'mode': s.get('mode', 'words'),
            'durationSecs': s.get('durationSecs', 0),
            'wpm': s.get('wpm', 0),
            'accuracy': s.get('accuracy', 0),
            'keypresses': s.get('keypresses', []),
            'backspaces': s.get('backspaces', []),
        })
    return sessions


def model1_weak_key_classifier(sessions):
    """
    Model 1: Random Forest Weak Key Classifier
    Classifies each key as Strong / Average / Weak based on typing metrics.
    """
    key_stats = defaultdict(lambda: {
        'latencies': [], 'errors': 0, 'total': 0,
        'hold_durations': [], 'backspace_count': 0
    })

    for session in sessions:
        for kp in session['keypresses']:
            key = kp.get('key', '').lower()
            if not key or len(key) != 1:
                continue
            stats = key_stats[key]
            stats['total'] += 1
            if kp.get('interKeyMs', 0) > 0:
                stats['latencies'].append(kp['interKeyMs'])
            if not kp.get('isCorrect', True):
                stats['errors'] += 1
            if kp.get('holdMs', 0) > 0:
                stats['hold_durations'].append(kp['holdMs'])

        for bs in session['backspaces']:
            error_key = bs.get('errorKey', '').lower()
            if error_key and len(error_key) == 1:
                key_stats[error_key]['backspace_count'] += 1

    if not key_stats:
        return {'weakKeys': [], 'strongKeys': [], 'averageKeys': []}

    # Build feature matrix
    keys = []
    features = []
    for key, stats in key_stats.items():
        if stats['total'] < 3:
            continue
        avg_latency = np.mean(stats['latencies']) if stats['latencies'] else 500
        error_rate = stats['errors'] / stats['total']
        hold_var = np.var(stats['hold_durations']) if len(stats['hold_durations']) > 1 else 0
        bs_rate = stats['backspace_count'] / stats['total']
        keys.append(key)
        features.append([avg_latency, error_rate, hold_var, bs_rate, stats['total']])

    if len(keys) < 3:
        return {'weakKeys': [], 'strongKeys': [], 'averageKeys': list(key_stats.keys())}

    X = np.array(features)

    if HAS_SKLEARN and len(keys) >= 5:
        # Create labels based on percentiles
        latency_scores = X[:, 0]
        error_scores = X[:, 1]
        combined = latency_scores * 0.5 + error_scores * 100 * 0.5

        labels = []
        p33 = np.percentile(combined, 33)
        p66 = np.percentile(combined, 66)
        for score in combined:
            if score <= p33:
                labels.append(0)  # Strong
            elif score <= p66:
                labels.append(1)  # Average
            else:
                labels.append(2)  # Weak

        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        clf.fit(X, labels)
        predictions = clf.predict(X)
    else:
        # Fallback: simple threshold-based classification
        latencies = X[:, 0]
        error_rates = X[:, 1]
        combined = latencies / np.max(latencies) * 0.5 + error_rates * 0.5
        predictions = []
        for score in combined:
            if score < 0.33:
                predictions.append(0)
            elif score < 0.66:
                predictions.append(1)
            else:
                predictions.append(2)

    label_names = ['Strong', 'Average', 'Weak']
    result = {'weakKeys': [], 'strongKeys': [], 'averageKeys': []}

    for i, key in enumerate(keys):
        label = label_names[predictions[i]]
        entry = {
            'key': key,
            'avgLatencyMs': round(float(features[i][0]), 1),
            'errorRate': round(float(features[i][1]), 3),
            'totalPresses': int(features[i][4]),
        }
        if label == 'Weak':
            result['weakKeys'].append(entry)
        elif label == 'Strong':
            result['strongKeys'].append(entry)
        else:
            result['averageKeys'].append(entry)

    result['weakKeys'].sort(key=lambda x: x['errorRate'], reverse=True)
    result['strongKeys'].sort(key=lambda x: x['avgLatencyMs'])

    return result


def model2_wpm_predictor(sessions):
    """
    Model 2: Polynomial Regression WPM Growth Predictor
    Predicts future WPM trajectory based on practice history.
    """
    if len(sessions) < 3:
        return {
            'currentWpm': 0,
            'predictedWpm30': 0, 'predictedWpm60': 0, 'predictedWpm90': 0,
            'daysTo60Wpm': None,
            'trajectory': [],
        }

    wpms = [s['wpm'] for s in sessions if s['wpm'] and s['wpm'] > 0]
    if len(wpms) < 3:
        return {
            'currentWpm': wpms[-1] if wpms else 0,
            'predictedWpm30': 0, 'predictedWpm60': 0, 'predictedWpm90': 0,
            'daysTo60Wpm': None,
            'trajectory': [],
        }

    X_raw = np.arange(1, len(wpms) + 1).reshape(-1, 1)
    y = np.array(wpms)

    if HAS_SKLEARN:
        poly = PolynomialFeatures(degree=2)
        X_poly = poly.fit_transform(X_raw)
        reg = LinearRegression()
        reg.fit(X_poly, y)

        trajectory = []
        for i in range(1, len(wpms) + 1):
            trajectory.append({
                'session': i,
                'actual': round(float(wpms[i - 1]), 1),
                'predicted': round(float(reg.predict(poly.transform([[i]]))[0]), 1),
            })

        pred_30 = max(0, float(reg.predict(poly.transform([[len(wpms) + 30]]))[0]))
        pred_60 = max(0, float(reg.predict(poly.transform([[len(wpms) + 60]]))[0]))
        pred_90 = max(0, float(reg.predict(poly.transform([[len(wpms) + 90]]))[0]))
    else:
        coeffs = np.polyfit(X_raw.flatten(), y, 2)
        poly_fn = np.poly1d(coeffs)
        trajectory = [{'session': i + 1, 'actual': round(float(wpms[i]), 1), 'predicted': round(float(poly_fn(i + 1)), 1)} for i in range(len(wpms))]
        pred_30 = max(0, float(poly_fn(len(wpms) + 30)))
        pred_60 = max(0, float(poly_fn(len(wpms) + 60)))
        pred_90 = max(0, float(poly_fn(len(wpms) + 90)))

    # Estimate days to 60 WPM
    days_to_60 = None
    current = wpms[-1]
    if current < 60:
        for future_session in range(1, 500):
            if HAS_SKLEARN:
                future_wpm = reg.predict(poly.transform([[len(wpms) + future_session]]))[0]
            else:
                future_wpm = poly_fn(len(wpms) + future_session)
            if future_wpm >= 60:
                days_to_60 = future_session
                break

    return {
        'currentWpm': round(float(wpms[-1]), 1),
        'predictedWpm30': round(pred_30, 1),
        'predictedWpm60': round(pred_60, 1),
        'predictedWpm90': round(pred_90, 1),
        'daysTo60Wpm': days_to_60,
        'trajectory': trajectory,
        'totalSessions': len(wpms),
    }


def model3_typing_fingerprint(sessions):
    """
    Model 3: K-Means Typing Fingerprint Clustering
    Profiles the user's typing pattern into one of 4 types.
    """
    profiles = ['Burst Typist', 'Steady Rhythm', 'Hesitant Typist', 'Fatiguing Typist']

    # Collect inter-key latencies and bigrams
    all_latencies = []
    bigram_latencies = defaultdict(list)

    for session in sessions:
        session_latencies = []
        for kp in session['keypresses']:
            ik = kp.get('interKeyMs', 0)
            if 0 < ik < 5000:
                session_latencies.append(ik)
                prev = kp.get('prevKey', '')
                if prev and len(prev) == 1:
                    bigram = prev.lower() + kp.get('key', '').lower()
                    bigram_latencies[bigram].append(ik)
        all_latencies.extend(session_latencies)

    if len(all_latencies) < 20:
        return {
            'profile': 'Unknown',
            'slowestBigrams': [],
            'fatigueOnsetMinutes': None,
            'avgLatencyMs': 0,
        }

    latency_array = np.array(all_latencies)
    avg_latency = float(np.mean(latency_array))
    std_latency = float(np.std(latency_array))
    cv = std_latency / avg_latency if avg_latency > 0 else 0

    # Detect burst patterns
    short_ratio = np.sum(latency_array < avg_latency * 0.5) / len(latency_array)
    long_ratio = np.sum(latency_array > avg_latency * 2) / len(latency_array)

    # Detect fatigue (latency increase over session)
    fatigue_onset = None
    if len(all_latencies) > 50:
        thirds = np.array_split(latency_array, 3)
        means = [np.mean(t) for t in thirds]
        if means[2] > means[0] * 1.2:
            fatigue_onset = round(len(all_latencies) / 3 * avg_latency / 60000, 1)

    # Classify based on features
    if HAS_SKLEARN and len(all_latencies) >= 50:
        # Create per-session features for clustering
        session_features = []
        for session in sessions:
            lats = [kp.get('interKeyMs', 0) for kp in session['keypresses'] if 0 < kp.get('interKeyMs', 0) < 5000]
            if len(lats) >= 5:
                session_features.append([
                    np.mean(lats),
                    np.std(lats),
                    np.std(lats) / np.mean(lats) if np.mean(lats) > 0 else 0,
                    np.sum(np.array(lats) < np.mean(lats) * 0.5) / len(lats),
                ])

        if len(session_features) >= 4:
            X = np.array(session_features)
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            k = min(4, len(X_scaled))
            kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
            kmeans.fit(X_scaled)
            cluster = int(kmeans.predict(X_scaled[-1:])[0])
            profile = profiles[cluster % 4]
        else:
            profile = _classify_simple(cv, short_ratio, long_ratio)
    else:
        profile = _classify_simple(cv, short_ratio, long_ratio)

    # Top 20 slowest bigrams
    bigram_avgs = {bg: np.mean(lats) for bg, lats in bigram_latencies.items() if len(lats) >= 3}
    slowest = sorted(bigram_avgs.items(), key=lambda x: x[1], reverse=True)[:20]
    slowest_bigrams = [{'bigram': bg, 'avgMs': round(float(ms), 1)} for bg, ms in slowest]

    return {
        'profile': profile,
        'slowestBigrams': slowest_bigrams,
        'fatigueOnsetMinutes': fatigue_onset,
        'avgLatencyMs': round(avg_latency, 1),
        'stdLatencyMs': round(std_latency, 1),
        'coefficientOfVariation': round(cv, 3),
    }


def _classify_simple(cv, short_ratio, long_ratio):
    """Simple rule-based typing profile classification."""
    if cv > 0.8 and short_ratio > 0.3:
        return 'Burst Typist'
    elif cv < 0.4:
        return 'Steady Rhythm'
    elif long_ratio > 0.2:
        return 'Hesitant Typist'
    else:
        return 'Fatiguing Typist'


def main():
    """Read session data from stdin, run 3 models, output JSON to stdout."""
    try:
        raw_input = sys.stdin.read()
        raw_sessions = json.loads(raw_input)
    except (json.JSONDecodeError, Exception) as e:
        print(json.dumps({'error': f'Failed to parse input: {str(e)}'}))
        sys.exit(1)

    sessions = parse_sessions(raw_sessions)

    if len(sessions) < 3:
        print(json.dumps({'error': 'Need at least 3 sessions for analysis'}))
        sys.exit(1)

    report = {
        'keyAnalysis': model1_weak_key_classifier(sessions),
        'wpmPrediction': model2_wpm_predictor(sessions),
        'typingFingerprint': model3_typing_fingerprint(sessions),
        'sessionCount': len(sessions),
        'currentWpm': sessions[0]['wpm'] if sessions else 0,
    }

    print(json.dumps(report))


if __name__ == '__main__':
    main()
