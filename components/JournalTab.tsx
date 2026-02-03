
import React, { useState } from 'react';

interface JournalTabProps {
  onAction: (detail: string) => void;
}

export const JournalTab: React.FC<JournalTabProps> = ({ onAction }) => {
  const [mood, setMood] = useState('Happy');
  const [entry, setEntry] = useState('');
  const [saved, setSaved] = useState(false);

  const moods = [
    { label: 'Peaceful', icon: '🕊️' },
    { label: 'Happy', icon: '✨' },
    { label: 'Tired', icon: '☁️' },
    { label: 'Dreamy', icon: '🌙' },
    { label: 'Loved', icon: '💖' },
  ];

  const handleSave = () => {
    if (!entry.trim()) return;
    onAction(`Set mood to ${mood} & wrote a letter`);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEntry('');
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="text-[10px] font-bold text-pink-300 uppercase tracking-[0.3em]">Diary</h2>
        <h1 className="text-2xl text-gray-800 font-semibold">Heart's Letter</h1>
      </header>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold px-2">Current Vibe</p>
          <div className="flex justify-between px-2">
            {moods.map((m) => (
              <button 
                key={m.label}
                onClick={() => setMood(m.label)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all ${mood === m.label ? 'bg-pink-100 scale-110 shadow-sm' : 'opacity-40 grayscale hover:grayscale-0'}`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-[8px] font-bold uppercase tracking-tighter">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <textarea 
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write a letter to the sanctuary..."
            className="w-full h-64 bg-white/70 border border-pink-100 rounded-[2.5rem] p-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all shadow-inner leading-relaxed poetic-text text-lg"
          />
          {saved && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center space-y-2 animate-in fade-in scale-in">
              <span className="text-4xl animate-bounce">💌</span>
              <p className="text-pink-600 font-bold uppercase tracking-widest text-xs">Letter Sent to Heart</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleSave}
          disabled={!entry.trim() || saved}
          className="w-full bg-pink-100 text-pink-600 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-md active:scale-95 transition-all disabled:opacity-40"
        >
          Fold & Tuck Away
        </button>
      </div>
    </div>
  );
};
