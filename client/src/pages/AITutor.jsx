/** @fileoverview AI Tutor page - Gemini-powered chat with suggested prompts */
import { useState, useEffect, useRef } from 'react';
import useGemini from '../hooks/useGemini';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import { getTutorHistory } from '../api/learning';
import ChatMessage from '../components/tutor/ChatMessage';
import ChatInput from '../components/tutor/ChatInput';
import NeonCard from '../components/ui/NeonCard';
import { TUTOR_PROMPTS } from '../utils/geminiPrompts';
import { Bot, Trash2, Sparkles } from 'lucide-react';

export default function AITutor() {
  const activeTech = useAppStore((s) => s.activeTech);
  const user = useAuthStore((s) => s.user);
  const { sendTutorMessage, loading } = useGemini();
  const [messages, setMessages] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTutorHistory();
        const history = data.messages || data.history || data || [];
        if (Array.isArray(history) && history.length > 0) {
          setMessages(history);
        }
      } catch (e) {
        /* no history yet */
      }
      setHistoryLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const data = await sendTutorMessage(text);
      // Server returns { response, reply, messages } — read whichever exists
      const reply = data.response || data.reply || data.message || data.content || 'No response received.';
      setMessages((prev) => [...prev, { role: 'model', content: reply }]);
    } catch (e) {
      const errText = e.message || 'Failed to get response.';
      setMessages((prev) => [...prev, {
        role: 'model',
        content: `⚠️ **AI Error:** ${errText}\n\nMake sure the server is running and \`GEMINI_API_KEY\` is set in \`server/.env\`.`,
      }]);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  const suggestedPrompts = TUTOR_PROMPTS[activeTech] || TUTOR_PROMPTS.python || [];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-heading text-white flex items-center gap-2">
          <Bot className="text-neon-purple" size={22} /> AI Tutor
          <span className="text-sm text-gray-500 font-normal">
            — Powered by Gemini
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{messages.length} messages</span>
          {messages.length > 0 && (
            <button onClick={handleClear}
              className="px-3 py-1.5 text-xs border border-border-dim rounded-lg text-gray-500 hover:text-red-400 hover:border-red-400 flex items-center gap-1">
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-bg-card border border-border-dim rounded-xl p-4 mb-4 space-y-1">
        {messages.length === 0 && historyLoaded && (
          <div className="text-center py-16">
            <Sparkles size={32} className="mx-auto text-neon-purple/40 mb-4" />
            <h3 className="text-gray-400 font-heading mb-2">Welcome to your AI Tutor</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Ask questions about {activeTech || 'any technology'}, get explanations, debug code, or explore concepts. Your tutor adapts to your current learning context.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-neon-purple/10 border border-neon-purple/30 rounded-xl px-4 py-3 rounded-bl-sm">
              <div className="text-xs text-neon-purple mb-1">V Tutor</div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        loading={loading}
        suggestedPrompts={messages.length === 0 ? suggestedPrompts.slice(0, 4) : []}
      />
    </div>
  );
}
