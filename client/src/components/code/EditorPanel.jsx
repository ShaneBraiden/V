import Editor from '@monaco-editor/react';

/** Monaco code editor panel with language selection */
export default function EditorPanel({ code, language, onChange, onRun, onSave, onAIReview }) {
  const langConfig = {
    python: { monacoLang: 'python', color: 'text-neon-cyan' },
    javascript: { monacoLang: 'javascript', color: 'text-neon-gold' },
    cpp: { monacoLang: 'cpp', color: 'text-neon-blue' },
  };

  const config = langConfig[language] || langConfig.python;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 bg-bg-elevated border-b border-border-dim">
        <span className={`text-sm font-mono font-medium ${config.color}`}>{language}</span>
        <div className="flex gap-2">
          <button onClick={onRun} className="btn-neon text-xs px-3 py-1">▶ Run</button>
          <button onClick={onAIReview} className="btn-neon-purple text-xs px-3 py-1">AI Review</button>
          <button onClick={onSave} className="text-xs px-3 py-1 text-gray-400 border border-border-dim rounded hover:border-neon-cyan hover:text-neon-cyan transition-colors">Save</button>
        </div>
      </div>
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          language={config.monacoLang}
          value={code}
          onChange={onChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12 },
          }}
        />
      </div>
    </div>
  );
}
