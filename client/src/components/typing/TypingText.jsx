/** @fileoverview Styled typing text display - typed chars colored green/red, current char highlighted */

export default function TypingText({ text = '', currentIndex = 0, keypresses = [] }) {
  return (
    <div className="font-mono text-lg leading-relaxed select-none whitespace-pre-wrap break-words w-full overflow-hidden">
      {text.split('').map((char, i) => {
        let cls = 'text-gray-600';
        if (i < currentIndex) {
          const kp = keypresses[i];
          cls = kp?.isCorrect !== false ? 'text-green-400' : 'text-red-400 bg-red-400/10 rounded';
        } else if (i === currentIndex) {
          cls = 'text-white bg-neon-cyan/20 border-b-2 border-neon-cyan animate-pulse';
        }
        return (
          <span key={i} className={cls}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
}
