/** @fileoverview XP display badge showing current XP, level, rank, and progress */
import { getXPForNextLevel, getRankFromXP, RANK_EMOJIS, getLevelFromXP } from '../../utils/xpCalc';

export default function XPBadge({ xp = 0, compact = false }) {
  const { current, needed, progress, level } = getXPForNextLevel(xp);
  const rank = getRankFromXP(xp);
  const emoji = RANK_EMOJIS[level - 1];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className="text-neon-gold font-mono text-sm font-semibold">{xp.toLocaleString()} XP</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-body text-gray-300 truncate">
            Lvl {level} — {rank}
          </span>
          <span className="text-xs font-mono text-neon-gold ml-2">
            {current.toLocaleString()} / {needed.toLocaleString()} XP
          </span>
        </div>
        <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_8px_#00F5D480] transition-all duration-700"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
