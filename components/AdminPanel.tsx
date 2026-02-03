
import React, { useState, useEffect } from 'react';
import { ActivityEvent, ThemeType } from '../types';

interface AdminSettings {
  overrideQuote: string;
  loveStorm: boolean;
  theme: ThemeType;
}

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [settings, setSettings] = useState<AdminSettings>({
    overrideQuote: '',
    loveStorm: false,
    theme: 'pink',
  });
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('sanctuary_admin');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({
        overrideQuote: parsed.overrideQuote || '',
        loveStorm: !!parsed.loveStorm,
        theme: parsed.theme || 'pink',
      });
    }

    const loadLogs = () => {
      const savedLogs = localStorage.getItem('sanctuary_activities');
      if (savedLogs) setActivities(JSON.parse(savedLogs));
    };

    loadLogs();
    const interval = setInterval(loadLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const save = (newSettings: AdminSettings) => {
    setSettings(newSettings);
    localStorage.setItem('sanctuary_admin', JSON.stringify(newSettings));
    window.dispatchEvent(new Event('storage'));
  };

  const clearLogs = () => {
    if (window.confirm("Are you sure you want to erase all history?")) {
      localStorage.removeItem('sanctuary_activities');
      localStorage.removeItem('sanctuary_journal');
      setActivities([]);
      window.location.reload();
    }
  };

  const resetUser = () => {
    if (window.confirm("Switch users? This will take you back to identity selection.")) {
      localStorage.removeItem('sanctuary_user');
      window.location.reload();
    }
  };

  const themes: { id: ThemeType; label: string; color: string }[] = [
    { id: 'pink', label: 'Petal Pink', color: 'bg-pink-400' },
    { id: 'lavender', label: 'Lavender', color: 'bg-purple-400' },
    { id: 'mint', label: 'Fresh Mint', color: 'bg-emerald-400' },
    { id: 'sky', label: 'Sky Blue', color: 'bg-sky-400' },
    { id: 'peach', label: 'Soft Peach', color: 'bg-orange-400' },
    { id: 'golden', label: 'Golden Hour', color: 'bg-yellow-500' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-xl flex items-center justify-center p-4 text-white overflow-hidden">
      <div className="w-full max-w-lg h-[90vh] flex flex-col space-y-6">
        <header className="flex justify-between items-center border-b border-white/10 pb-4 shrink-0">
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase text-pink-500">Guardian Control</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Secret Surveillance & Interference</p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          <section className="space-y-6 bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <h2 className="text-xs font-black text-pink-400 uppercase tracking-widest border-b border-pink-400/20 pb-2">Atmosphere Settings</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={resetUser} className="p-3 bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                  Switch Identity
                </button>
                <button onClick={clearLogs} className="p-3 bg-red-500/20 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500/40 transition-all text-red-400">
                  Reset Sanctuary
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Override Daily Quote</label>
                <textarea 
                  value={settings.overrideQuote}
                  onChange={(e) => save({...settings, overrideQuote: e.target.value})}
                  placeholder="Show your text on the home screen..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all min-h-[80px] text-white"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Sanctuary Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => save({...settings, theme: t.id})}
                      className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${settings.theme === t.id ? 'bg-white/20 border-white/40 shadow-lg' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}`}
                    >
                      <div className={`w-6 h-6 rounded-full mb-2 ${t.color}`} />
                      <span className="text-[9px] font-bold uppercase tracking-tighter">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => save({...settings, loveStorm: !settings.loveStorm})}
                className={`w-full p-4 rounded-2xl border transition-all text-[11px] font-black uppercase tracking-widest ${settings.loveStorm ? 'bg-pink-600 border-pink-400 text-white shadow-lg shadow-pink-900/40' : 'bg-white/5 border-white/10 text-gray-500'}`}
              >
                {settings.loveStorm ? '💖 Love Storm Active' : 'Activate Love Storm'}
              </button>
            </div>
          </section>

          <section className="space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <h2 className="text-xs font-black text-pink-400 uppercase tracking-widest border-b border-pink-400/20 pb-2">Activity Monitor</h2>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-gray-600 italic text-sm text-center py-4">Quiet signals only...</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex items-start space-x-4 p-3 bg-black/20 rounded-xl border border-white/5">
                    <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">
                      {act.type === 'pulse' ? '💓' : '📖'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] font-black text-pink-300 uppercase tracking-tighter">{act.author} • {act.type}</p>
                        <p className="text-[9px] text-gray-500">{new Date(act.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <p className="text-xs text-gray-200 mt-1 line-clamp-2">{act.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <footer className="shrink-0 text-center py-4 border-t border-white/10">
          <p className="text-[10px] text-gray-500 font-medium italic">"Every shared heartbeat matters."</p>
        </footer>
      </div>
    </div>
  );
};
