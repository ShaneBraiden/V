/** @fileoverview Reusable card with cyberpunk hover glow effect */
import { forwardRef } from 'react';

const NeonCard = forwardRef(({ children, className = '', color = 'cyan', onClick, ...props }, ref) => {
  const glowMap = {
    cyan: 'hover:border-neon-cyan hover:shadow-neon',
    purple: 'hover:border-neon-purple hover:shadow-neon-purple',
    gold: 'hover:border-neon-gold hover:shadow-neon-gold',
    pink: 'hover:border-neon-magenta hover:shadow-neon-pink',
    none: '',
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-bg-card border border-border-dim rounded-xl p-5 transition-all duration-300 ${glowMap[color] || glowMap.cyan} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

NeonCard.displayName = 'NeonCard';
export default NeonCard;
