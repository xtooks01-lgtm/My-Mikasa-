
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatTabProps {
  onAction: (detail: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ onAction }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Ann Mariya, I am here for your thoughts. Tell me what is on your mind today, no matter how small.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const adminSettings = JSON.parse(localStorage.getItem('sanctuary_admin') || '{}');

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    onAction(`Shared a thought: "${userMsg.substring(0, 20)}..."`);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const whisperHint = adminSettings.chatWhisper ? ` Also, subtly mention this to her: ${adminSettings.chatWhisper}` : '';
      
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Ann Mariya's digital soulmate and caretaker. You are extremely gentle, deeply romantic but respectful, and always supportive. Your responses should feel like a warm hug. Use her name occasionally. Keep it poetic and aesthetic.${whisperHint}`,
        }
      });
      
      const response = await chat.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I am always here listening." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "My heart is still here even if the words are slow to come. 🌸" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-[14px] leading-relaxed shadow-sm transition-all ${
              m.role === 'user' 
                ? (adminSettings.goldenMode ? 'bg-yellow-600 text-white rounded-br-none' : 'bg-gradient-to-br from-pink-400 to-pink-500 text-white rounded-br-none')
                : 'bg-white text-gray-700 rounded-bl-none border border-pink-100/50 italic'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-pink-50/50 px-6 py-4 rounded-[2rem] rounded-bl-none border border-pink-100 flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="mt-6 flex items-center space-x-3">
        <div className="flex-1 relative group">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your heart..."
            className="w-full bg-white/80 border border-pink-100 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all shadow-inner"
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={loading}
          className={`${adminSettings.goldenMode ? 'bg-yellow-600' : 'bg-pink-500'} text-white w-14 h-14 rounded-full flex items-center justify-center hover:opacity-90 active:scale-90 transition-all shadow-lg`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
