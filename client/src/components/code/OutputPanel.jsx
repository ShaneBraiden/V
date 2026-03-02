/** Code execution output panel */
export default function OutputPanel({ output, error, loading }) {
  return (
    <div className="bg-bg-primary border border-border-dim rounded-lg p-4 font-mono text-sm min-h-[120px]">
      <div className="text-xs text-gray-500 mb-2">OUTPUT</div>
      {loading && (
        <div className="text-neon-cyan animate-pulse">Running...</div>
      )}
      {!loading && !output && !error && (
        <div className="text-gray-600">Run your code to see output here.</div>
      )}
      {output && (
        <pre className="text-neon-cyan whitespace-pre-wrap">{output}</pre>
      )}
      {error && (
        <pre className="text-neon-magenta whitespace-pre-wrap">{error}</pre>
      )}
    </div>
  );
}
