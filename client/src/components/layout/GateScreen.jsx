/** @fileoverview Full-screen daily typing gate with countdown timer and typing test */
import { useState, useCallback, useEffect } from 'react';
import { Zap, SkipForward, X } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';
import useTypingSession from '../../hooks/useTypingSession';
import { saveSession } from '../../api/typing';
import { addXP } from '../../api/progress';
import { updateProfile } from '../../api/auth';
import { formatTime, getTodayString, getGateDayMode } from '../../utils/dateUtils';
import { getFingerForKey, FINGER_NAMES } from '../../utils/fingerMap';
import { TYPING_LEVELS } from '../../utils/typingGeminiPrompt';

const GATE_TEXTS = {
  words: 'the quick brown fox jumps over the lazy dog a fast typist can handle any challenge with grace and precision every keystroke matters when you are building speed and accuracy keep your fingers on the home row and type with purpose',
  code: 'function add(a, b) { return a + b; } const result = add(5, 3); console.log(result); if (result > 0) { print("positive"); } else { print("negative"); }',
  sentences: 'Practice makes perfect. Every expert was once a beginner. The journey of a thousand miles begins with a single step. Code is poetry written for machines to execute and humans to understand.',
};

function getGateText(mode, lessonLevel) {
  if (lessonLevel <= 1) return 'asdf jkl; asdf jkl; asdf asdf jkl; jkl; asdf jkl; fjdk slaj fdks lajf dksl ajfd ksla jfdk slaj';
  if (lessonLevel <= 2) return 'add fall lads salad flask jails glad dash flags shall half glass jazz';
  if (lessonLevel <= 5) return GATE_TEXTS[mode] || GATE_TEXTS.words;
  return GATE_TEXTS[mode] || GATE_TEXTS.words;
}

export default function GateScreen({ onComplete }) {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState(null);

  const durationSecs = (user?.gateDurationMinutes || 5) * 60;
  const mode = getGateDayMode();
  const text = getGateText(mode, user?.level || 1);

  const handleComplete = useCallback(async (data) => {
    setResultData(data);
    setShowResults(true);

    try {
      await saveSession({
        date: getTodayString(),
        mode,
        durationSecs: data.durationSecs,
        wpm: data.wpm,
        accuracy: data.accuracy,
        isGate: true,
        wasSkipped: false,
        keypresses: data.keypresses,
        backspaces: data.backspaces,
      });

      await addXP('gate_complete', 50);
      await updateProfile({ lastGateDate: getTodayString() });
      updateUser({ lastGateDate: getTodayString() });
    } catch (e) {
      console.error('Gate save error:', e);
    }

    setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
  }, [mode, onComplete, updateUser]);

  const session = useTypingSession({ text, duration: durationSecs, onComplete: handleComplete });

  useEffect(() => {
    if (!session.isActive && !session.isComplete) {
      session.startSession();
    }
  }, []);

  const handleSkip = async () => {
    try {
      await updateProfile({
        lastGateDate: getTodayString(),
        gateSkipCount: (user?.gateSkipCount || 0) + 1,
      });
      updateUser({
        lastGateDate: getTodayString(),
        gateSkipCount: (user?.gateSkipCount || 0) + 1,
      });
    } catch (e) {
      console.error('Gate skip error:', e);
    }
    if (onComplete) onComplete();
  };

  const nextKey = text[session.currentIndex] || '';
  const fingerInfo = getFingerForKey(nextKey);

  if (showResults && resultData) {
    return (
      <div className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <Zap className="w-16 h-16 text-neon-cyan mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Gate Complete!</h2>
          <div className="flex gap-8 justify-center">
            <div>
              <p className="text-3xl font-mono text-neon-cyan">{resultData.wpm}</p>
              <p className="text-xs text-gray-500">WPM</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-neon-gold">{resultData.accuracy}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-neon-purple">+50</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <Zap className="w-10 h-10 text-neon-cyan mx-auto mb-2" />
        <h1 className="text-xl font-heading font-bold text-white">Daily Training Gate</h1>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{mode} mode</span>
      </div>

      {/* Timer */}
      <div className="text-4xl font-mono text-neon-cyan mb-6 animate-pulse">
        {formatTime(session.timeLeft)}
      </div>

      {/* Typing area */}
      <div className="max-w-2xl w-full bg-bg-card border border-border-dim rounded-xl p-6 mb-4">
        <div className="font-mono text-lg leading-relaxed select-none">
          {text.split('').map((char, i) => {
            let className = 'text-gray-600';
            if (i < session.currentIndex) {
              const kp = session.keypresses[i];
              className = kp?.isCorrect !== false ? 'text-green-400' : 'text-red-400 bg-red-400/10';
            } else if (i === session.currentIndex) {
              className = 'text-white bg-neon-cyan/20 border-b-2 border-neon-cyan';
            }
            return <span key={i} className={className}>{char === ' ' ? '\u00A0' : char}</span>;
          })}
        </div>
      </div>

      {/* Live stats */}
      <div className="flex gap-8 mb-4 text-sm">
        <div><span className="text-gray-500">WPM</span> <span className="font-mono text-neon-cyan ml-1">{session.wpm}</span></div>
        <div><span className="text-gray-500">Accuracy</span> <span className="font-mono text-neon-gold ml-1">{session.accuracy}%</span></div>
        <div><span className="text-gray-500">Chars</span> <span className="font-mono text-gray-300 ml-1">{session.currentIndex}/{text.length}</span></div>
      </div>

      {/* Finger hint */}
      <div className="text-sm text-gray-500 mb-6">
        {nextKey && (
          <span>Next: <span className="text-neon-cyan font-mono">{nextKey === ' ' ? 'SPACE' : nextKey}</span> — USE: {FINGER_NAMES[fingerInfo.finger] || fingerInfo.finger}</span>
        )}
      </div>

      {/* Skip button */}
      <button
        onClick={() => setShowSkipConfirm(true)}
        className="text-gray-600 text-xs hover:text-gray-400 transition-colors flex items-center gap-1"
      >
        <SkipForward size={12} /> Skip gate
      </button>

      {/* Skip confirmation modal */}
      {showSkipConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-bg-card border border-border-dim rounded-xl p-6 max-w-sm">
            <h3 className="text-white font-heading mb-2">Are you sure?</h3>
            <p className="text-gray-400 text-sm mb-4">Typing practice is what builds speed. Skip anyway?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 px-4 py-2 border border-border-dim rounded-lg text-gray-400 text-sm hover:bg-bg-elevated"
              >
                Keep typing
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
