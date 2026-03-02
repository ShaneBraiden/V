/** @fileoverview SVG keyboard with finger color-coding and live next-key highlight */
import { useState } from 'react';
import { KEYBOARD_LAYOUT, getColorForKey, getFingerForKey, FINGER_NAMES, FINGER_COLORS } from '../../utils/fingerMap';

const KEY_WIDTHS = {
  Backspace: 90, Tab: 70, Caps: 80, Enter: 90, Shift: 110, Space: 340,
};

export default function LiveKeyboard({ nextKey = '', mode = 'finger' }) {
  const [hoveredKey, setHoveredKey] = useState(null);
  const defaultWidth = 44;
  const keyHeight = 40;
  const gap = 4;
  const rowOffsets = [0, 10, 15, 25, 100];

  return (
    <div className="w-full">
      <svg viewBox="0 0 700 260" className="w-full max-w-2xl mx-auto">
        {KEYBOARD_LAYOUT.map(({ row, keys }) => {
          let x = rowOffsets[row] || 0;
          return keys.map((key) => {
            const w = KEY_WIDTHS[key] || defaultWidth;
            const color = getColorForKey(key);
            const isNext = nextKey && key.toLowerCase() === nextKey.toLowerCase();
            const isHovered = hoveredKey === key;
            const fingerInfo = getFingerForKey(key);

            const rect = (
              <g
                key={`${row}-${key}-${x}`}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y={row * (keyHeight + gap) + 10}
                  width={w - 2}
                  height={keyHeight - 2}
                  rx={6}
                  fill={isNext ? color : '#111827'}
                  fillOpacity={isNext ? 0.3 : 0.8}
                  stroke={isNext ? color : color}
                  strokeOpacity={isNext ? 1 : 0.3}
                  strokeWidth={isNext ? 2.5 : 1}
                  style={isNext ? { filter: `drop-shadow(0 0 6px ${color})` } : {}}
                />
                <text
                  x={x + (w - 2) / 2}
                  y={row * (keyHeight + gap) + 10 + (keyHeight - 2) / 2 + 4}
                  textAnchor="middle"
                  fill={isNext ? '#FFFFFF' : color}
                  fillOpacity={isNext ? 1 : 0.7}
                  fontSize={key.length > 1 ? 9 : 13}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={isNext ? 'bold' : 'normal'}
                >
                  {key.length > 5 ? key.slice(0, 3) : key}
                </text>
                {isNext && (
                  <rect
                    x={x}
                    y={row * (keyHeight + gap) + 10}
                    width={w - 2}
                    height={keyHeight - 2}
                    rx={6}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    className="animate-pulse"
                  />
                )}
              </g>
            );
            x += w + gap;
            return rect;
          });
        })}
      </svg>

      {/* Finger hint for next key */}
      {nextKey && (
        <div className="text-center mt-2 text-sm">
          <span className="text-gray-500">Next: </span>
          <span className="text-neon-cyan font-mono font-bold">{nextKey === ' ' ? 'SPACE' : nextKey.toUpperCase()}</span>
          <span className="text-gray-500 ml-2">USE: </span>
          <span style={{ color: getColorForKey(nextKey) }} className="font-semibold">
            {FINGER_NAMES[getFingerForKey(nextKey).finger] || 'Unknown'}
          </span>
        </div>
      )}

      {/* Hover tooltip */}
      {hoveredKey && (
        <div className="text-center mt-1 text-xs text-gray-500">
          <span className="font-mono">{hoveredKey}</span> — {FINGER_NAMES[getFingerForKey(hoveredKey).finger]}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs">
        {Object.entries(FINGER_COLORS).map(([finger, color]) => (
          <div key={finger} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color, opacity: 0.6 }} />
            <span className="text-gray-500">{FINGER_NAMES[finger]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
