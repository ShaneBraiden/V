/** @fileoverview Animated progress bar with label and percentage display */

const colorMap = {
  cyan: 'bg-neon-cyan',
  purple: 'bg-neon-purple',
  gold: 'bg-neon-gold',
  blue: 'bg-neon-blue',
  green: 'bg-green-500',
  orange: 'bg-neon-orange',
  magenta: 'bg-neon-magenta',
};

const glowMap = {
  cyan: 'shadow-[0_0_8px_#00F5D4]',
  purple: 'shadow-[0_0_8px_#7B2FF7]',
  gold: 'shadow-[0_0_8px_#FFD60A]',
  blue: 'shadow-[0_0_8px_#4361EE]',
  green: 'shadow-[0_0_8px_#22c55e]',
  orange: 'shadow-[0_0_8px_#FF6B35]',
  magenta: 'shadow-[0_0_8px_#F72585]',
};

export default function ProgressBar({ value = 0, label, showPercent = true, color = 'cyan', className = '', height = 'h-2' }) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-400 font-body">{label}</span>}
          {showPercent && <span className="text-sm text-gray-300 font-mono">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-bg-elevated rounded-full overflow-hidden`}>
        <div
          className={`${height} rounded-full ${colorMap[color] || colorMap.cyan} ${glowMap[color] || ''} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
