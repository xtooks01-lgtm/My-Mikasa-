
import React, { useState, useEffect } from 'react';
import { TabType, ActivityEvent } from '../types';
import { HomeTab } from './HomeTab';
import { ChatTab } from './ChatTab';
import { VisionTab } from './VisionTab';
import { JournalTab } from './JournalTab';
import { SyncTab } from './SyncTab';

export const MainDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  // Initialize with some dummy history
  useEffect(() => {
    const saved = localStorage.getItem('sanctuary_activities');
    if (saved) setActivities(JSON.parse(saved));
  }, []);

  const logActivity = (type: ActivityEvent['type'], detail: string) => {
    const newEvent: ActivityEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      detail,
      timestamp: Date.now(),
    };
    const updated = [newEvent, ...activities].slice(0, 20);
    setActivities(updated);
    localStorage.setItem('sanctuary_activities', JSON.stringify(updated));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab activities={activities} />;
      case 'chat': return <ChatTab onAction={(d) => logActivity('chat', d)} />;
      case 'vision': return <VisionTab onAction={(d) => logActivity('vision', d)} />;
      case 'journal': return <JournalTab onAction={(d) => logActivity('mood', d)} />;
      case 'sync': return <SyncTab activities={activities} onPulse={() => logActivity('pulse', 'Sent a heartbeat pulse')} />;
      default: return <HomeTab activities={activities} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto relative bg-white/60 backdrop-blur-2xl shadow-2xl rounded-t-[3.5rem] overflow-hidden border-x border-t border-pink-100/50">
      <div className="flex-1 overflow-y-auto pb-28 px-6 pt-10">
        {renderTab()}
      </div>

      {/* Elegant Floating Navigation Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-white/90 backdrop-blur-xl border border-pink-100 rounded-full flex items-center justify-around px-4 z-30 shadow-lg shadow-pink-100/50">
        <NavIcon active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="Home" />
        <NavIcon active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon="💬" label="Talk" />
        <NavIcon active={activeTab === 'vision'} onClick={() => setActiveTab('vision')} icon="✨" label="Vision" />
        <NavIcon active={activeTab === 'journal'} onClick={() => setActiveTab('journal')} icon="📖" label="Diary" />
        <NavIcon active={activeTab === 'sync'} onClick={() => setActiveTab('sync')} icon="💞" label="Sync" />
      </div>
    </div>
  );
};

const NavIcon: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center transition-all duration-300 ${active ? 'scale-110 -translate-y-1' : 'opacity-40 hover:opacity-70'}`}
  >
    <span className="text-xl mb-0.5">{icon}</span>
    <span className={`text-[8px] font-bold uppercase tracking-widest ${active ? 'text-pink-500' : 'text-gray-400'}`}>{label}</span>
    {active && <div className="w-1 h-1 bg-pink-400 rounded-full mt-0.5" />}
  </button>
);
