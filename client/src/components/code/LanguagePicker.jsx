/** Language picker tabs for code playground */
export default function LanguagePicker({ active, onChange }) {
  const langs = [
    { id: 'python', label: 'Python', color: 'text-neon-cyan border-neon-cyan' },
    { id: 'javascript', label: 'JavaScript', color: 'text-neon-gold border-neon-gold' },
    { id: 'cpp', label: 'C++', color: 'text-neon-blue border-neon-blue' },
  ];

  return (
    <div className="flex gap-1 bg-bg-card rounded-lg p-1 border border-border-dim">
      {langs.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onChange(lang.id)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
            active === lang.id
              ? `${lang.color} bg-bg-elevated border`
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
