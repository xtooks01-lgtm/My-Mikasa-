
import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface AdminSettings {
  overrideQuote: string;
  chatWhisper: string;
  loveStorm: boolean;
  goldenMode: boolean;
}

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [settings, setSettings] = useState<AdminSettings>({
    overrideQuote: '',
    chatWhisper: '',
    loveStorm: false,
    goldenMode: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('sanctuary_admin');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const save = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    localStorage.setItem('sanctuary_admin', JSON.stringify(newSettings));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-6 text-white overflow-y-auto">
      <div className="w-full max-w-md space-y-8">
        <header className="flex justify-between items-center border-b border-white/10 pb-4">
          <h1 className="text-xl font-bold tracking-tighter uppercase">Guardian Control</h1>
          <button onClick={onClose} className="text-pink-400 font-bold text-sm underline">Hide Panel</button>
        </header>

        <section className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-pink-300 uppercase">Override Daily Quote</label>
            <textarea 
              value={settings.overrideQuote}
              onChange={(e) => save({...settings, overrideQuote: e.target.value})}
              placeholder="Leave empty for AI default..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <p className="text-[10px] text-gray-500">This replaces the AI quote on the home screen.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-pink-300 uppercase">Chat Whisper (AI Hint)</label>
            <input 
              value={settings.chatWhisper}
              onChange={(e) => save({...settings, chatWhisper: e.target.value})}
              placeholder="e.g. mention the stars tonight..."
              className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            <p className="text-[10px] text-gray-500">The AI will try to include this in its next response to her.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => save({...settings, loveStorm: !settings.loveStorm})}
              className={`p-4 rounded-2xl border transition-all text-sm font-bold ${settings.loveStorm ? 'bg-pink-600 border-pink-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
            >
              {settings.loveStorm ? '💖 Storm Active' : 'Enable Love Storm'}
            </button>
            <button 
              onClick={() => save({...settings, goldenMode: !settings.goldenMode})}
              className={`p-4 rounded-2xl border transition-all text-sm font-bold ${settings.goldenMode ? 'bg-yellow-600 border-yellow-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
            >
              {settings.goldenMode ? '☀️ Golden Mode' : 'Enable Golden Mode'}
            </button>
          </div>
        </section>

        <footer className="pt-4 text-center">
          <p className="text-[10px] text-gray-500 italic">"Interfere gently. Surprises should feel like magic."</p>
        </footer>
      </div>
    </div>
  );
};
