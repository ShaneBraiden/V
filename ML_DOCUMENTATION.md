# CODEC ML Pipeline — Technical Documentation

## Overview

CODEC uses a **machine learning pipeline** to analyze users' typing patterns and provide personalized insights. The ML system consists of **4 models** — 2 pre-trained on a keystroke biometrics dataset, and 2 session-based models that run in real-time on the user's own typing data.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  WEBAPP (React)                                                     │
│  MlAnalysisPanel.jsx  ──→  useTypingAnalysis hook                   │
│       │                          │                                  │
│       ▼                          ▼                                  │
│  POST /api/ml/analyze     POST /api/ml/gemini-overview              │
└────────────┬──────────────────────┬─────────────────────────────────┘
             │                      │
             ▼                      ▼
┌────────────────────────┐  ┌───────────────────┐
│  Express Server        │  │  Gemini API       │
│  routes/ml.js          │  │  (AI coaching)    │
│  services/mlBridge.js  │  │                   │
└────────┬───────────────┘  └───────────────────┘
         │
         ▼  stdin → JSON sessions → stdout
┌────────────────────────────────────────────────┐
│  Python ML Script                              │
│  ml/codec_typing_ml.py                         │
│                                                │
│  Session-based models:                         │
│    1. Weak Key Classifier (Random Forest)      │
│    2. WPM Growth Predictor (Linear Regression) │
│                                                │
│  Pre-trained models (loaded from .joblib):     │
│    3. Typing Proficiency (Gradient Boosting)   │
│    4. Speed Prediction (Random Forest Reg.)    │
│                                                │
│  Loads: ml/models/*.joblib                     │
└────────────────────────────────────────────────┘
```

---

## Dataset

### Source
The models are trained on the **Keystroke Dynamics Dataset** located in `keystrokes_dataset/`. It contains typing data from **3 different users**:

| Folder | User  | Files | Description          |
|--------|-------|-------|----------------------|
| `s0/`  | User 0| 75    | 75 typing sessions   |
| `s1/`  | User 1| 75    | 75 typing sessions   |
| `s3/`  | User 2| 75    | 75 typing sessions   |

**Total: 225 sessions** across 3 users.

### CSV Format
Each CSV file represents one typing session and contains word-level keystroke timing data:

| Column       | Description                                         |
|-------------|------------------------------------------------------|
| `word`       | The typed word (uppercase)                           |
| `word_hold`  | Total time to type the word (milliseconds)           |
| `avg_flight1`| Average time between consecutive key releases & presses |
| `avg_flight2`| Median flight time variant                           |
| `avg_flight3`| Mean flight time variant                             |
| `avg_flight4`| Sum of avg_flight1 + avg_flight2                     |
| `avg_word`   | Average time per keystroke in the word (ms)          |

### Example Data
```csv
word,word_hold,avg_flight1,avg_flight2,avg_flight3,avg_flight4,avg_word
I,2168,0,0,0,0,125.0
HAVE,858,12.0,50.5,54.8,109.2,82.0
CHOSEN,1732,39.0,93.5,88.5,184.7,114.5
WORK,468,3.8,89.8,78.0,164.0,105.5
```

---

## Feature Engineering

Each session (CSV file) is aggregated into **72 features** using statistical summaries:

### Per-Column Statistics (7 numeric columns × 9 stats = 63 features)
For each of `word_hold`, `avg_flight1-4`, `avg_word`, `word_length`:
- `mean` — Average value
- `std` — Standard deviation  
- `median` — Median value
- `p25` — 25th percentile
- `p75` — 75th percentile
- `iqr` — Interquartile range (p75 - p25)
- `max` — Maximum value
- `min` — Minimum value
- `cv` — Coefficient of variation (std/mean)

### Derived Features (9 additional)
| Feature             | Formula                                    | Purpose                              |
|--------------------|--------------------------------------------|--------------------------------------|
| `total_words`       | Count of words in session                  | Session length indicator             |
| `avg_hold_per_char` | word_hold_mean / word_length_mean          | Speed normalized by word length      |
| `flight_consistency`| avg_flight1_std / avg_flight1_mean         | How consistent transition timing is  |
| `speed_ratio`       | avg_word_mean / word_hold_mean             | Per-key speed vs total word time     |
| `hold_flight_ratio` | word_hold_mean / avg_flight1_mean          | Ratio of hold to transition time     |
| `hold_autocorr`     | Correlation between consecutive hold times | Typing rhythm consistency            |
| `hold_trend`        | Linear slope of hold times over session    | Fatigue detection (increasing = tired)|
| `chars_per_sec`     | 1000 / mean(word_hold / word_length)       | Raw typing speed                     |
| `estimated_wpm`     | chars_per_sec × 60 / 5                     | Words per minute estimate            |

---

## Model 1: Typing Proficiency (Pre-trained)

### Algorithm
**Gradient Boosting Classifier** (`sklearn.ensemble.GradientBoostingClassifier`)

### Purpose
Classifies a user's typing skill level into one of 3 tiers: **Beginner**, **Intermediate**, or **Expert**.

### How It Works
1. Takes all 72 session features as input
2. Scales features using `StandardScaler` (zero mean, unit variance)
3. Classifies into 3 proficiency levels using absolute WPM thresholds

### Training Labels
Labels are assigned using **absolute WPM thresholds** (not percentiles):

| Level        | WPM Range     | Description              |
|-------------|---------------|--------------------------|
| Beginner     | < 20 WPM      | Hunt-and-peck typists    |
| Intermediate | 20 – 35 WPM   | Casual / improving       |
| Expert       | ≥ 35 WPM      | Fast / touch-typing      |

**Why absolute thresholds?** The previous implementation used percentile-based labels (top 33% = Expert, etc.), which meant the model always predicted based on relative position in the training data. With only dataset users, everyone appeared as "Expert" when compared to the dataset average. Absolute thresholds match real-world typing speed benchmarks.

### Hyperparameters
```python
GradientBoostingClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.05,
    min_samples_split=5,
    subsample=0.8,
    random_state=42
)
```

### Training Results
| Metric          | Value  |
|----------------|--------|
| Train Accuracy  | 1.000  |
| Test Accuracy   | 1.000  |
| CV Accuracy     | 0.987 ± 0.018 |

**Label Distribution:**
- Beginner: 39 sessions
- Intermediate: 156 sessions
- Expert: 30 sessions

### Output
```json
{
  "level": "Intermediate",
  "confidence": 92.3,
  "scores": {
    "Beginner": 3.2,
    "Intermediate": 92.3,
    "Expert": 4.5
  },
  "modelAccuracy": 0.987
}
```

### Files
- `ml/models/proficiency_gb.joblib` — Trained model
- `ml/models/proficiency_scaler.joblib` — Feature scaler

---

## Model 2: Speed Prediction (Pre-trained)

### Algorithm
**Random Forest Regressor** (`sklearn.ensemble.RandomForestRegressor`)

### Purpose
Predicts the user's typing speed (WPM) from raw keystroke timing features alone, without using the derived WPM fields.

### How It Works
1. Takes 70 features (all 72 minus `estimated_wpm` and `chars_per_sec` to prevent data leakage)
2. Scales features using `StandardScaler`
3. Predicts continuous WPM value using ensemble of 300 decision trees

### Data Leakage Prevention
The target variable `estimated_wpm` is derived from `word_hold` and `word_length`. If included as a feature, the model would trivially predict it. Both `estimated_wpm` and `chars_per_sec` are excluded from the feature set, forcing the model to learn speed from raw timing patterns.

### Hyperparameters
```python
RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    min_samples_split=5,
    min_samples_leaf=2,
    max_features='sqrt',
    random_state=42,
    n_jobs=-1
)
```

### Training Results
| Metric      | Value      |
|------------|------------|
| Train MAE   | 1.50 WPM  |
| Test MAE    | 2.80 WPM  |
| Train R²    | 0.920      |
| Test R²     | 0.715      |
| WPM Range   | 10.5 – 52.0|

### Top Features (by importance)
1. `avg_hold_per_char` (0.147) — Speed normalized by word length
2. `word_hold_mean` (0.116) — Average word hold time
3. `word_hold_iqr` (0.083) — Hold time variability
4. `word_hold_p75` (0.073) — 75th percentile hold time
5. `word_hold_median` (0.048) — Median hold time

### Output
```json
{
  "predictedWpm": 28.4,
  "actualEstimatedWpm": 26.1,
  "difference": 2.3,
  "wpmRange": [10.5, 52.0],
  "modelMAE": 2.80
}
```

### Files
- `ml/models/speed_rfr.joblib` — Trained model
- `ml/models/speed_scaler.joblib` — Feature scaler

---

## Model 3: Weak Key Classifier (Session-based)

### Algorithm
**Random Forest Classifier** (`sklearn.ensemble.RandomForestClassifier`)

### Purpose
Identifies which keyboard keys the user is strongest and weakest at, based on their typing sessions.

### How It Works
1. Aggregates per-key statistics across all user sessions:
   - Average latency (time between consecutive key presses)
   - Error rate (incorrect key presses / total presses)
   - Hold duration variance
   - Backspace rate (corrections per key)
   - Total press count
2. Creates a combined score: `latency × 0.5 + error_rate × 100 × 0.5`
3. Labels keys using percentile splits (33rd/66th): Strong / Average / Weak
4. Trains a Random Forest on-the-fly and classifies each key

### Output
```json
{
  "weakKeys": [
    { "key": "q", "avgLatencyMs": 340.2, "errorRate": 0.15, "totalPresses": 42 }
  ],
  "strongKeys": [
    { "key": "e", "avgLatencyMs": 85.1, "errorRate": 0.01, "totalPresses": 180 }
  ],
  "averageKeys": [...]
}
```

**Note:** This model is NOT pre-trained. It trains on the user's own session data each time analysis is run.

---

## Model 4: WPM Growth Predictor (Session-based)

### Algorithm
**Linear Regression** with `PolynomialFeatures(degree=1)` via scikit-learn

### Purpose
Predicts the user's future WPM trajectory based on their practice history, answering: "If I keep practicing, what will my WPM be in 30/60/90 sessions?"

### How It Works
1. Extracts WPM values from all user sessions (ordered chronologically)
2. Fits a linear regression: `WPM = a × session_number + b`
3. Projects forward to +30, +60, +90 sessions
4. Caps predictions at reasonable bounds (max 3× current WPM or 200)
5. Calculates improvement rate using windowed averaging (early vs late sessions)

### Why Linear (not Polynomial)?
The previous implementation used degree-2 polynomial regression, which produced wildly unrealistic long-range predictions (e.g., 500+ WPM after 90 sessions due to the quadratic term exploding). Linear regression provides stable, realistic growth projections.

### Prediction Clamping
All predictions are clamped to `[0, min(current_wpm × 3, 200)]` to prevent:
- Negative WPM predictions (from negative slopes)
- Absurd values from polynomial extrapolation

### Output
```json
{
  "currentWpm": 32.5,
  "predictedWpm30": 38.2,
  "predictedWpm60": 43.9,
  "predictedWpm90": 49.6,
  "daysTo60Wpm": 142,
  "trajectory": [
    { "session": 1, "actual": 25.0, "predicted": 25.3 },
    { "session": 2, "actual": 27.1, "predicted": 25.5 }
  ],
  "improvementRate": 0.19,
  "totalSessions": 15
}
```

---

## Web App Integration

### Data Flow

1. **User completes typing sessions** → Session data (keypresses, WPM, accuracy, timestamps) stored in MongoDB via Express API

2. **User clicks "Run Analysis"** in the ML Analysis Panel (React)

3. **Frontend** calls `POST /api/ml/analyze` with auth token

4. **Server** (`routes/ml.js`) fetches the user's last 100 sessions from MongoDB

5. **Server** (`services/mlBridge.js`) spawns the Python script:
   ```
   python ml/codec_typing_ml.py < session_data.json > report.json
   ```

6. **Python script** (`codec_typing_ml.py`) runs all 4 models:
   - Loads session JSON from stdin
   - Runs session-based models (Weak Key + WPM Growth)
   - Loads pre-trained models from `ml/models/*.joblib`
   - Extracts features from sessions to match training format
   - Runs pre-trained models (Proficiency + Speed Prediction)
   - Outputs JSON report to stdout

7. **Server** stores the report in MongoDB (`MlAnalysis` collection) and returns it

8. **Frontend** renders results in `MlAnalysisPanel.jsx` with collapsible sections

### API Endpoints

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| POST   | `/api/ml/analyze`      | Run ML analysis on user's sessions   |
| GET    | `/api/ml/report`       | Get latest ML analysis report        |
| POST   | `/api/ml/gemini-overview` | Get AI coaching overview from Gemini |

### Feature Transformation (App → Training Format)

The app stores keypresses differently than the training dataset CSV. The bridge code in `codec_typing_ml.py` converts:

**App format** (per-keypress):
```json
{ "key": "h", "expectedKey": "h", "isCorrect": true, "timestampMs": 1234567, "holdMs": 85, "interKeyMs": 120 }
```

**Training format** (per-word):
```csv
word,word_hold,avg_flight1,avg_flight2,avg_flight3,avg_flight4,avg_word
HELLO,1200,45.5,50.0,47.2,95.5,80.0
```

The conversion:
1. Groups keypresses into words (split on space)
2. Calculates `word_hold` from first-to-last keypress timestamp
3. Computes flight times from inter-key delays
4. Aggregates per-word features into session-level statistics (same 72 features as training)

---

## Training the Models

### Prerequisites
```bash
pip install scikit-learn pandas numpy joblib
```

### Running Training
```bash
cd /path/to/Codec
python ml/train_models.py
```

### Output
```
ml/models/
├── proficiency_gb.joblib      # Typing Proficiency classifier
├── proficiency_scaler.joblib  # StandardScaler for proficiency
├── speed_rfr.joblib           # Speed Prediction regressor
├── speed_scaler.joblib        # StandardScaler for speed
└── metadata.json              # Feature names, metrics, config
```

### metadata.json
Contains:
- `feature_columns` — Ordered list of all 72 feature names
- `speed_feature_columns` — 70 features used for speed prediction (minus leakage)
- `proficiency_labels` — `["Beginner", "Intermediate", "Expert"]`
- `wpm_thresholds` — `{"beginner_max": 20.0, "intermediate_max": 35.0}`
- `models` — Per-model file paths, types, and evaluation metrics
- `dataset_info` — Session count, user list, files per user

---

## Key Design Decisions

### 1. Absolute vs Percentile Proficiency Labels
**Problem:** Old percentile-based labels (top 33% = Expert) meant the model learned relative rankings within the 3 training users. When a new user typed at any reasonable speed, they'd appear as "Expert" because the dataset's average was low.

**Solution:** Use absolute WPM thresholds (Beginner < 20, Intermediate < 35, Expert ≥ 35) based on real typing benchmarks.

### 2. Random Forest Regressor vs SVR for Speed
**Problem:** SVR with RBF kernel had a test R² of 0.58 and test MAE of 3.36 WPM.

**Solution:** Random Forest Regressor achieves test R² of 0.72 and MAE of 2.80 WPM — better at capturing non-linear relationships in keystroke timing data.

### 3. Linear vs Polynomial WPM Growth Prediction
**Problem:** Degree-2 polynomial regression produced wildly unrealistic predictions (e.g., 500+ WPM) for sessions far in the future because the quadratic term dominates.

**Solution:** Linear regression with prediction clamping gives stable, reasonable growth projections.

### 4. Removed Models
The following models were removed because they didn't provide actionable value for the user:
- **User Identification** (Random Forest) — Identified which of the 3 training users typed most similarly. Not useful for an individual user.
- **Anomaly Detection** (Isolation Forest) — Flagged "unusual" patterns vs the 3 training users. Too noisy and not actionable.
- **Typing Fingerprint** (K-Means Clustering) — Clustered typing patterns into profiles ("Burst Typist", etc.). Labels were arbitrary and non-actionable.

---

## Dependencies

```
scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0
joblib>=1.3.0
```
