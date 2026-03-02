/** @fileoverview Streak flame badge with tier-based colors and animation */
import { Flame } from 'lucide-react';

const TIERS = {
  bronze: { color: 'text-orange-400', glow: 'drop-shadow-[0_0_6px_#fb923c]', label: 'Bronze' },
  silver: { color: 'text-gray-300', glow: 'drop-shadow-[0_0_6px_#d1d5db]', label: 'Silver' },
  gold: { color: 'text-neon-gold', glow: 'drop-shadow-[0_0_6px_#FFD60A]', label: 'Gold' },
  diamond: { color: 'text-neon-cyan', glow: 'drop-shadow-[0_0_8px_#00F5D4]', label: 'Diamond' },
};

function getStreakTier(count) {
  if (count >= 30) return 'diamond';
  if (count >= 14) return 'gold';
  if (count >= 7) return 'silver';
  if (count >= 1) return 'bronze';
  return null;
}

export default function StreakBadge({ count = 0, type = '', compact = false }) {
  const tier = getStreakTier(count);

  if (!tier) {
    return (
      <div className="flex items-center gap-1.5 text-gray-600">
        <Flame size={compact ? 16 : 20} />
        <span className="font-mono text-sm">0</span>
      </div>
    );
  }

  const { color, glow, label } = TIERS[tier];

  return (
    <div className={`flex items-center gap-1.5 ${color}`}>
      <Flame
        size={compact ? 16 : 22}
        className={`${glow} ${count > 0 ? 'animate-pulse' : ''}`}
        fill="currentColor"
      />
      <span className="font-mono text-sm font-bold">{count}</span>
      {!compact && (
        <span className="text-xs text-gray-500 ml-1">{label} streak</span>
      )}
    </div>
  );
}
