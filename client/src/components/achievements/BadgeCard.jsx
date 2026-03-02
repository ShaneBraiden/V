import { Lock, Unlock } from 'lucide-react';

/** Individual achievement badge card */
export default function BadgeCard({ badge, onClick }) {
  const categoryColors = {
    typing: 'border-neon-cyan/30 text-neon-cyan',
    learning: 'border-neon-blue/30 text-neon-blue',
    codec: 'border-neon-gold/30 text-neon-gold',
  };

  const colorClass = categoryColors[badge.category] || categoryColors.typing;

  return (
    <div
      onClick={() => onClick?.(badge)}
      className={`neon-card p-4 cursor-pointer transition-all ${
        badge.unlocked
          ? `${colorClass} shadow-lg`
          : 'opacity-40 grayscale'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{badge.emoji || (badge.unlocked ? '🏆' : '🔒')}</span>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-200">{badge.name}</h4>
          <span className={`text-xs ${colorClass.split(' ')[1]}`}>{badge.category}</span>
        </div>
        {badge.unlocked ? (
          <Unlock size={14} className="text-neon-cyan" />
        ) : (
          <Lock size={14} className="text-gray-600" />
        )}
      </div>
      <p className="text-xs text-gray-500">{badge.description}</p>
      {badge.unlocked && badge.unlockedAt && (
        <p className="text-xs text-gray-600 mt-1">
          Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
        </p>
      )}
      {badge.xpBonus && (
        <span className="text-xs text-neon-gold">+{badge.xpBonus} XP bonus</span>
      )}
    </div>
  );
}
