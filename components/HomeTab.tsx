
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ActivityEvent, ThemeType } from '../types';

interface HomeTabProps {
  activities: ActivityEvent[];
}

export const HomeTab: React.FC<HomeTabProps> = ({ activities }) => {
  const [quote, setQuote] = useState<string>("Loading a warm thought...");
  const [theme, setTheme] = useState<ThemeType>('pink');
  const adminSettings = JSON.parse(localStorage.getItem('sanctuary_admin') || '{}');

  useEffect(() => {
    setTheme(adminSettings.theme || 'pink');
    
    if (adminSettings.overrideQuote) {
      setQuote(adminSettings.overrideQuote);
      return;
    }

    const fetchQuote = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Write a short, intimate, and supportive one-sentence message for Ann Mariya. Make it feel like it's coming from someone who cares deeply about her. Mention her name.",
        });
        setQuote(response.text || "You make the world softer, Ann Mariya.");
      } catch (e) {
        setQuote("Thinking of you and your beautiful heart, Ann Mariya.");
      }
    };
    fetchQuote();
  }, [adminSettings.overrideQuote, adminSettings.theme]);

  const getThemeConfig = (t: ThemeType) => {
    switch (t) {
      case 'lavender': return { label: 'text-purple-400', poetic: 'text-purple-700', card: 'from-purple-50/80 to-indigo-50/80', icon: '✨', accent: 'bg-purple-50 text-purple-400' };
      case 'mint': return { label: 'text-emerald-400', poetic: 'text-emerald-700', card: 'from-emerald-50/80 to-teal-50/80', icon: '🌿', accent: 'bg-emerald-50 text-emerald-400' };
      case 'sky': return { label: 'text-sky-400', poetic: 'text-sky-700', card: 'from-sky-50/80 to-blue-50/80', icon: '☁️', accent: 'bg-sky-50 text-sky-400' };
      case 'peach': return { label: 'text-orange-400', poetic: 'text-orange-700', card: 'from-orange-50/80 to-rose-50/80', icon: '🍑', accent: 'bg-orange-50 text-orange-400' };
      case 'golden': return { label: 'text-yellow-600', poetic: 'text-yellow-800', card: 'from-yellow-50 to-orange-100', icon: '☀️', accent: 'bg-yellow-100 text-yellow-600' };
      default: return { label: 'text-pink-300', poetic: 'text-pink-700', card: 'from-pink-50/80 to-purple-50/80', icon: '🌸', accent: 'bg-pink-50 text-pink-300' };
    }
  };

  const config = getThemeConfig(theme);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${config.label}`}>Sanctuary</h2>
          <h1 className="text-3xl text-gray-800 font-semibold poetic-text">Hello, My Dear</h1>
        </div>
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center text-[10px] shadow-sm font-bold">AM</div>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] shadow-sm">❤️</div>
        </div>
      </header>

      <div className={`relative p-8 rounded-[2.5rem] border border-white shadow-xl overflow-hidden transition-all duration-1000 bg-gradient-to-br ${config.card}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">{config.icon}</div>
        <p className={`poetic-text text-2xl leading-relaxed italic relative z-10 ${config.poetic}`}>
          "{quote}"
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shared Moments</h3>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-tighter ${config.accent}`}>Live Connection</span>
        </div>
        
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="p-6 bg-white/40 rounded-3xl border border-dashed border-gray-100 text-center">
              <p className="text-xs text-gray-300 italic font-medium">No moments recorded yet...</p>
            </div>
          ) : (
            activities.slice(0, 3).map((act) => (
              <div key={act.id} className="flex items-center p-4 bg-white/60 rounded-2xl border border-white shadow-sm transition-transform hover:scale-[1.02]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mr-4 ${config.accent.split(' ')[0]}`}>
                  {act.type === 'pulse' ? '💓' : '📖'}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-gray-700 font-medium">{act.detail}</p>
                  <p className="text-[10px] text-gray-400">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
