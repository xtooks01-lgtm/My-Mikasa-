
import React, { useState, useEffect } from 'react';
import { TabType, ActivityEvent, ThemeType, UserType } from '../types';
import { HomeTab } from './HomeTab';
import { JournalTab } from './JournalTab';
import { SyncTab } from './SyncTab';

export const MainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [theme, setTheme] = useState<ThemeType>('pink');
  const [currentUser, setCurrentUser] = useState<UserType>('Eren Yeager');

  const updateTheme = () => {
    const saved = JSON.parse(localStorage.getItem('sanctuary_admin') || '{"theme":"pink"}');
    setTheme(saved.theme);
  };

  useEffect(() => {
    updateTheme();
    const user = (localStorage.getItem('sanctuary_user') as UserType) || 'Eren Yeager';
    setCurrentUser(user);

    const saved = localStorage.getItem('sanctuary_activities');
    if (saved) {
      let parsed = JSON.parse(saved) as ActivityEvent[];
      // If we see entries from the OTHER person, mark them as seen
      const marked = parsed.map(a => a.author !== user ? { ...a, seen: true } : a);
      setActivities(marked);
      localStorage.setItem('sanctuary_activities', JSON.stringify(marked));
    }
    
    window.addEventListener('storage', updateTheme);
    return () => window.removeEventListener('storage', updateTheme);
  }, [activeTab]);

  const logActivity = (type: ActivityEvent['type'], detail: string) => {
    const newEvent: ActivityEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      author: currentUser,
      detail,
      timestamp: Date.now(),
      seen: false
    };
    const updated = [newEvent, ...activities].slice(0, 20);
    setActivities(updated);
    localStorage.setItem('sanctuary_activities', JSON.stringify(updated));
  };

  const getThemeColors = (t: ThemeType) => {
    switch (t) {
      case 'lavender': return 'text-purple-500 bg-purple-400';
      case 'mint': return 'text-emerald-500 bg-emerald-400';
      case 'sky': return 'text-sky-500 bg-sky-400';
      case 'peach': return 'text-orange-500 bg-orange-400';
      case 'golden': return 'text-yellow-600 bg-yellow-500';
      default: return 'text-pink-500 bg-pink-400';
    }
  };

  const themeColors = getThemeColors(theme);

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab activities={activities} />;
      case 'journal': return <JournalTab onAction={(d) => logActivity('mood', d)} />;
      case 'sync': return <SyncTab activities={activities} onPulse={() => logActivity('pulse', 'Shared a heartbeat')} />;
      default: return <HomeTab activities={activities} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto relative bg-white/60 backdrop-blur-2xl shadow-2xl rounded-t-[3.5rem] overflow-hidden border-x border-t border-white/50">
      <div className="flex-1 overflow-y-auto pb-28 px-6 pt-10">
        {renderTab()}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-white/95 backdrop-blur-xl border border-white/50 rounded-full flex items-center justify-around px-2 z-30 shadow-2xl">
        <NavIcon active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="Home" themeClass={themeColors} />
        <NavIcon active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon="📖" label="Moments" themeClass={themeColors} />
        <NavIcon active={activeTab === 'sync'} onClick={() => setActiveTab('sync')} icon="💞" label="Heart" themeClass={themeColors} />
      </div>
    </div>
  );
};

const NavIcon: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string, themeClass: string }> = ({ active, onClick, icon, label, themeClass }) => {
  const [activeText, activeDot] = themeClass.split(' ');
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center transition-all duration-300 flex-1 h-full ${active ? 'scale-110 -translate-y-1' : 'opacity-30 hover:opacity-50'}`}
    >
      <span className="text-xl mb-0.5">{icon}</span>
      <span className={`text-[8px] font-bold uppercase tracking-[0.2em] ${active ? activeText : 'text-gray-400'}`}>{label}</span>
      {active && <div className={`w-1 h-1 rounded-full mt-1 ${activeDot}`} />}
    </button>
  );
};
