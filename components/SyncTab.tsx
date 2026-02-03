
import React, { useState } from 'react';
import { ActivityEvent } from '../types';

interface SyncTabProps {
  activities: ActivityEvent[];
  onPulse: () => void;
}

export const SyncTab: React.FC<SyncTabProps> = ({ activities, onPulse }) => {
  const [pulsing, setPulsing] = useState(false);
  const currentUser = localStorage.getItem('sanctuary_user');

  const triggerPulse = () => {
    if (pulsing) return;
    setPulsing(true);
    onPulse();
    setTimeout(() => setPulsing(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="text-[10px] font-bold text-pink-300 uppercase tracking-[0.3em]">Connection</h2>
        <h1 className="text-2xl text-gray-800 font-semibold">Shared Heartbeat</h1>
      </header>

      <div className="flex flex-col items-center justify-center py-10 space-y-8">
        <div className="relative">
          <div className={`absolute inset-0 bg-pink-400 rounded-full opacity-20 scale-100 ${pulsing ? 'animate-ping' : ''}`}></div>
          <div className={`absolute inset-0 bg-pink-200 rounded-full opacity-40 scale-125 transition-all duration-1000 ${pulsing ? 'opacity-0 scale-150' : ''}`}></div>
          
          <button 
            onClick={triggerPulse}
            className={`relative w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-4xl transition-transform active:scale-90 ${pulsing ? 'scale-110' : ''}`}
          >
            💓
          </button>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-gray-700 font-medium italic">"Sending warmth your way..."</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Tap to send a heartbeat</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Quiet Signals</h3>
        <div className="bg-white/40 rounded-[2rem] border border-pink-100 p-2 overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto space-y-2 p-2 scroll-smooth">
            {activities.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[10px] text-pink-200 uppercase tracking-widest">Awaiting the first beat...</p>
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex justify-between items-center p-3 hover:bg-white/40 rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs">{act.type === 'pulse' ? '💓' : '🔘'}</span>
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold uppercase tracking-tighter ${act.author === 'Ann Mariya' ? 'text-pink-500' : 'text-purple-500'}`}>
                        {act.author === currentUser ? 'You' : act.author}
                      </span>
                      <span className="text-[12px] text-gray-500 font-medium leading-none mt-0.5">{act.detail}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-pink-300 font-bold">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {act.seen && (
                      <span className="text-[7px] text-pink-400 font-black uppercase tracking-tighter">Seen</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
