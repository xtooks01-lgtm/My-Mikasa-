
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ActivityEvent } from '../types';

interface HomeTabProps {
  activities: ActivityEvent[];
}

export const HomeTab: React.FC<HomeTabProps> = ({ activities }) => {
  const [quote, setQuote] = useState<string>("Loading a warm thought...");
  const adminSettings = JSON.parse(localStorage.getItem('sanctuary_admin') || '{}');

  useEffect(() => {
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
  }, [adminSettings.overrideQuote]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${adminSettings.goldenMode ? 'text-yellow-600' : 'text-pink-300'}`}>Sanctuary</h2>
          <h1 className="text-3xl text-gray-800 font-semibold poetic-text">Hello, My Dear</h1>
        </div>
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-white bg-pink-200 flex items-center justify-center text-[10px] shadow-sm">AM</div>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-200 flex items-center justify-center text-[10px] shadow-sm">❤️</div>
        </div>
      </header>

      <div className={`relative p-8 rounded-[2.5rem] border border-white shadow-xl overflow-hidden transition-colors ${adminSettings.goldenMode ? 'bg-gradient-to-br from-yellow-50 to-orange-100' : 'bg-gradient-to-br from-pink-50/80 to-purple-50/80'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">{adminSettings.goldenMode ? '☀️' : '🌸'}</div>
        <p className={`poetic-text text-2xl leading-relaxed italic relative z-10 ${adminSettings.goldenMode ? 'text-yellow-900' : 'text-pink-700'}`}>
          "{quote}"
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shared Activity</h3>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-tighter ${adminSettings.goldenMode ? 'bg-yellow-100 text-yellow-600' : 'bg-pink-50 text-pink-300'}`}>Live Connection</span>
        </div>
        
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="p-6 bg-white/40 rounded-3xl border border-dashed border-pink-100 text-center">
              <p className="text-xs text-pink-200 italic font-medium">No moments recorded yet...</p>
            </div>
          ) : (
            activities.slice(0, 3).map((act) => (
              <div key={act.id} className="flex items-center p-4 bg-white/60 rounded-2xl border border-pink-50/50 shadow-sm transition-transform hover:scale-[1.02]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mr-4 ${adminSettings.goldenMode ? 'bg-yellow-50' : 'bg-pink-50'}`}>
                  {act.type === 'vision' ? '🎨' : act.type === 'chat' ? '💌' : act.type === 'pulse' ? '💓' : '💭'}
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
