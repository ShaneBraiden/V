const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Get typing coaching advice from Gemini based on ML analysis report
 */
const getTypingAdvice = async (analysisReport, userState) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a typing coach analyzing an ML report. Return ONLY valid JSON with no extra text or markdown.
Report: ${JSON.stringify(analysisReport)}
User WPM: ${userState.wpm}, Goal: 70+ WPM
Return exactly this JSON structure:
{
  "summary": "2 sentence summary of their typing profile",
  "improvements": [
    {"priority": 1, "action": "specific action", "reason": "why this helps"},
    {"priority": 2, "action": "specific action", "reason": "why this helps"},
    {"priority": 3, "action": "specific action", "reason": "why this helps"}
  ],
  "bonus_drills": [
    {"id": "drill-1", "title": "drill name", "description": "what to practice", "duration_secs": 120, "target": "target keys or pattern"},
    {"id": "drill-2", "title": "drill name", "description": "what to practice", "duration_secs": 120, "target": "target keys or pattern"},
    {"id": "drill-3", "title": "drill name", "description": "what to practice", "duration_secs": 120, "target": "target keys or pattern"}
  ],
  "motivation": "1 sentence motivational message"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
};

/**
 * Chat with the AI Tutor using Gemini
 */
const chatWithTutor = async (messages, userState) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const systemPrompt = `You are the AI Tutor inside V — a personal learning app for developers.
Student's active technology: ${userState.activeTech}
Current total study hours: ${userState.totalHours}
XP Level: ${userState.level} (${userState.rank})
Rules: Connect answers to their learning context. Be specific and practical. Use code examples when relevant. Keep responses under 400 words. Format with markdown for readability.`;

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history,
    systemInstruction: { parts: [{ text: systemPrompt }] },
  });
  const result = await chat.sendMessage(messages.at(-1).content);
  return result.response.text();
};

module.exports = { getTypingAdvice, chatWithTutor };
