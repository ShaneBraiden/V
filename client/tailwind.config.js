export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0E1A',
        'bg-card': '#111827',
        'bg-elevated': '#1A2035',
        'neon-cyan': '#00F5D4',
        'neon-magenta': '#F72585',
        'neon-blue': '#4361EE',
        'neon-gold': '#FFD60A',
        'neon-orange': '#FF6B35',
        'neon-purple': '#7B2FF7',
        'border-dim': '#1E293B',
      },
      boxShadow: {
        'neon': '0 0 10px #00F5D4, 0 0 20px #00F5D450',
        'neon-purple': '0 0 10px #7B2FF7, 0 0 20px #7B2FF750',
        'neon-gold': '0 0 10px #FFD60A, 0 0 20px #FFD60A50',
        'neon-pink': '0 0 10px #F72585, 0 0 20px #F7258550',
      },
      fontFamily: {
        heading: ['Bricolage Grotesque', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        accent: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
