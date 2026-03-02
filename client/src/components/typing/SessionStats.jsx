/** @fileoverview Post-session results display: WPM, accuracy, duration, weak keys, XP earned */
import NeonCard from '../ui/NeonCard';
import { Keyboard, Target, Clock, AlertTriangle, Zap } from 'lucide-react';

export default function SessionStats({ wpm = 0, accuracy = 0, durationSecs = 0, errors = 0, totalChars = 0, xpEarned = 0, weakKeys = [] }) {
  const mins = Math.floor(durationSecs / 60);
  const secs = durationSecs % 60;

  return (
    <div className="animate-fadeIn">
      <h3 className="text-lg font-heading text-white mb-4 flex items-center gap-2">
        <Zap className="text-neon-gold" size={20} /> Session Complete
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <NeonCard color="cyan" className="text-center p-4">
          <Keyboard size={20} className="mx-auto text-neon-cyan mb-1" />
          <p className="text-2xl font-mono text-neon-cyan">{wpm}</p>
          <p className="text-xs text-gray-500">WPM</p>
        </NeonCard>
        <NeonCard color="gold" className="text-center p-4">
          <Target size={20} className="mx-auto text-neon-gold mb-1" />
          <p className="text-2xl font-mono text-neon-gold">{accuracy}%</p>
          <p className="text-xs text-gray-500">Accuracy</p>
        </NeonCard>
        <NeonCard color="purple" className="text-center p-4">
          <Clock size={20} className="mx-auto text-neon-purple mb-1" />
          <p className="text-2xl font-mono text-neon-purple">{mins}:{secs.toString().padStart(2, '0')}</p>
          <p className="text-xs text-gray-500">Duration</p>
        </NeonCard>
        <NeonCard color="gold" className="text-center p-4">
          <Zap size={20} className="mx-auto text-neon-gold mb-1" />
          <p className="text-2xl font-mono text-neon-gold">+{xpEarned}</p>
          <p className="text-xs text-gray-500">XP</p>
        </NeonCard>
      </div>

      {weakKeys.length > 0 && (
        <div className="bg-bg-elevated rounded-lg p-3">
          <p className="text-sm text-gray-400 flex items-center gap-1 mb-2">
            <AlertTriangle size={14} className="text-neon-orange" /> Weak Keys
          </p>
          <div className="flex flex-wrap gap-2">
            {weakKeys.slice(0, 10).map((k) => (
              <span key={k} className="px-2 py-1 bg-bg-card border border-neon-orange/30 rounded text-neon-orange font-mono text-sm">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
