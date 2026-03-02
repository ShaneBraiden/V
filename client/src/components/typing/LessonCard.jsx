/** @fileoverview Lesson card for L1-L8 curriculum with progress and lock/unlock state */
import { Lock, Check, Play } from 'lucide-react';

export default function LessonCard({ lesson, isUnlocked = false, isComplete = false, isCurrent = false, onStart }) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isComplete
          ? 'bg-green-500/5 border-green-500/30'
          : isCurrent
          ? 'bg-neon-cyan/5 border-neon-cyan/30 shadow-neon'
          : isUnlocked
          ? 'bg-bg-card border-border-dim hover:border-gray-600 cursor-pointer'
          : 'bg-bg-card/50 border-border-dim opacity-60'
      }`}
      onClick={() => isUnlocked && !isComplete && onStart && onStart(lesson)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isComplete ? 'bg-green-500/20' : isCurrent ? 'bg-neon-cyan/20' : 'bg-bg-elevated'
          }`}>
            {isComplete ? (
              <Check size={16} className="text-green-400" />
            ) : !isUnlocked ? (
              <Lock size={14} className="text-gray-600" />
            ) : (
              <Play size={14} className={`${isCurrent ? 'text-neon-cyan' : 'text-gray-400'}`} />
            )}
          </div>
          <div>
            <h4 className={`text-sm font-semibold ${isComplete ? 'text-green-400' : isCurrent ? 'text-neon-cyan' : 'text-gray-300'}`}>
              {lesson.name}
            </h4>
            <p className="text-xs text-gray-500">{lesson.keys} — {lesson.wpmTarget} WPM target</p>
          </div>
        </div>
        {isUnlocked && !isComplete && (
          <span className="text-xs text-neon-cyan">+75 XP</span>
        )}
      </div>
    </div>
  );
}
