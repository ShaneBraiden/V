import { TrendingUp } from 'lucide-react';

/** Stat card for dashboard quick stats row */
export default function StatCard({ label, value, icon: Icon = TrendingUp, color = 'cyan', subtitle }) {
  const colorMap = {
    cyan: 'text-neon-cyan border-neon-cyan/30 shadow-neon',
    purple: 'text-neon-purple border-neon-purple/30 shadow-neon-purple',
    gold: 'text-neon-gold border-neon-gold/30 shadow-neon-gold',
    orange: 'text-neon-orange border-neon-orange/30',
    magenta: 'text-neon-magenta border-neon-magenta/30 shadow-neon-pink',
  };

  return (
    <div className={`neon-card p-4 flex flex-col gap-1 ${colorMap[color] || ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <Icon size={18} className={colorMap[color]?.split(' ')[0] || 'text-neon-cyan'} />
      </div>
      <div className={`text-2xl font-bold font-mono ${colorMap[color]?.split(' ')[0] || 'text-neon-cyan'}`}>
        {value}
      </div>
      {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
    </div>
  );
}
