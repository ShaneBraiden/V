/** @fileoverview Code Playground - Monaco editor with Python (Pyodide) and JS execution */
import { useState, useCallback } from 'react';
import usePyodide from '../hooks/usePyodide';
import useGemini from '../hooks/useGemini';
import { saveSnippet, getSnippets } from '../api/learning';
import EditorPanel from '../components/code/EditorPanel';
import OutputPanel from '../components/code/OutputPanel';
import LanguagePicker from '../components/code/LanguagePicker';
import NeonCard from '../components/ui/NeonCard';
import { Code2, Save, FolderOpen } from 'lucide-react';

const DEFAULT_CODE = {
  python: '# Python playground\nprint("Hello from VANTA!")\n\nfor i in range(5):\n    print(f"Step {i + 1}")\n',
  javascript: '// JavaScript playground\nconsole.log("Hello from VANTA!");\n\nfor (let i = 0; i < 5; i++) {\n  console.log("Step", i + 1);\n}\n',
  cpp: '// C++ via Piston API\n#include <iostream>\n#include <vector>\n\nint main() {\n    std::cout << "Hello from VANTA!" << std::endl;\n\n    std::vector<int> v = {1, 2, 3, 4, 5};\n    for (int x : v) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}\n',
};

export default function CodePlayground() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [showSnippets, setShowSnippets] = useState(false);
  const [aiReview, setAiReview] = useState('');

  const { runPython, loading: pyLoading } = usePyodide();
  const { sendTutorMessage, loading: aiLoading } = useGemini();

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || '');
    setOutput('');
    setError('');
    setAiReview('');
  };

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput('');
    setError('');

    try {
      if (language === 'python') {
        const result = await runPython(code);
        setOutput(result.output || '');
        if (result.error) setError(result.error);
      } else if (language === 'javascript') {
        const logs = [];
        const mockConsole = {
          log: (...args) => logs.push(args.map(String).join(' ')),
          error: (...args) => logs.push('ERROR: ' + args.map(String).join(' ')),
          warn: (...args) => logs.push('WARN: ' + args.map(String).join(' ')),
        };
        try {
          const fn = new Function('console', code);
          fn(mockConsole);
          setOutput(logs.join('\n'));
        } catch (e) {
          setError(e.message);
        }
      } else if (language === 'cpp') {
        // Compile & run via Piston (free, no auth needed)
        const res = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: 'c++',
            version: '*',
            files: [{ name: 'main.cpp', content: code }],
          }),
        });
        if (!res.ok) throw new Error('Piston API request failed');
        const data = await res.json();
        const run = data.run || {};
        const compile = data.compile || {};
        if (compile.stderr) {
          setError('Compile error:\n' + compile.stderr);
        } else if (run.stderr) {
          setError(run.stderr);
          if (run.stdout) setOutput(run.stdout);
        } else {
          setOutput(run.stdout || '(no output)');
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  }, [language, code, runPython]);

  const handleSave = async () => {
    try {
      await saveSnippet({ language, code, title: language + ' snippet' });
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const handleLoadSnippets = async () => {
    try {
      const data = await getSnippets();
      setSnippets(data.snippets || data || []);
      setShowSnippets(true);
    } catch (e) {
      console.error('Load snippets error:', e);
    }
  };

  const handleAIReview = async () => {
    setAiReview('');
    try {
      const data = await sendTutorMessage('Review this ' + language + ' code and suggest improvements:\n\n' + code);
      setAiReview(data.reply || data.message || JSON.stringify(data));
    } catch (e) {
      setAiReview('AI review failed: ' + e.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-white flex items-center gap-2">
          <Code2 className="text-neon-cyan" size={22} /> Code Playground
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={handleLoadSnippets}
            className="px-3 py-1.5 text-xs border border-border-dim rounded-lg text-gray-400 hover:border-neon-cyan hover:text-neon-cyan flex items-center gap-1">
            <FolderOpen size={12} /> Snippets
          </button>
        </div>
      </div>

      <LanguagePicker active={language} onChange={handleLanguageChange} />

      <div className="grid lg:grid-cols-2 gap-4">
        <NeonCard className="p-0 overflow-hidden">
          <EditorPanel
            code={code}
            language={language}
            onChange={setCode}
            onRun={handleRun}
            onSave={handleSave}
            onAIReview={handleAIReview}
          />
        </NeonCard>

        <div className="space-y-4">
          <OutputPanel output={output} error={error} loading={running || pyLoading} />

          {aiReview && (
            <NeonCard color="purple">
              <h3 className="text-sm text-neon-purple mb-2">AI Review</h3>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{aiReview}</p>
            </NeonCard>
          )}
        </div>
      </div>

      {/* Snippet drawer */}
      {showSnippets && (
        <NeonCard>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-gray-400">Saved Snippets</h3>
            <button onClick={() => setShowSnippets(false)} className="text-xs text-gray-600 hover:text-gray-400">Close</button>
          </div>
          {snippets.length === 0 ? (
            <p className="text-xs text-gray-600">No saved snippets yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {snippets.map((s, i) => (
                <button key={s._id || i} onClick={() => { setLanguage(s.language); setCode(s.code); setShowSnippets(false); }}
                  className="w-full text-left px-3 py-2 bg-bg-elevated rounded-lg text-xs text-gray-400 hover:text-neon-cyan hover:border-neon-cyan border border-border-dim transition-colors">
                  <span className="font-mono">{s.language}</span> — {s.title || 'Untitled'}
                </button>
              ))}
            </div>
          )}
        </NeonCard>
      )}

      {language === 'python' && pyLoading && (
        <p className="text-xs text-neon-cyan animate-pulse text-center">Loading Python runtime (Pyodide)...</p>
      )}
    </div>
  );
}
