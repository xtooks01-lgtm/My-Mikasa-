
import React, { useState } from 'react';
import { ActivityEvent } from '../types';

interface SyncTabProps {
  activities: ActivityEvent[];
  onPulse: () => void;
}

export const SyncTab: React.FC<SyncTabProps> = ({ activities, onPulse }) => {
  const [pulsing, setPulsing] = useState(false);

  const triggerPulse = () => {
    if (pulsing) return;
    setPulsing(true);
    onPulse();
    setTimeout(() => setPulsing(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h2 className="text-[10px] font-bold text-pink-300 uppercase tracking-[0.3em]">Connection Center</h2>
        <h1 className="text-2xl text-gray-800 font-semibold">Shared Heartbeat</h1>
      </header>

      <div className="flex flex-col items-center justify-center py-10 space-y-8">
        <div className="relative">
          {/* Animated concentric circles */}
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
          <p className="text-gray-700 font-medium">Tap to send a Pulse</p>
          <p className="text-xs text-gray-400 max-w-[200px] mx-auto">It lets Ann Mariya know you're thinking of her right this second.</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Detailed Log</h3>
        <div className="bg-white/40 rounded-[2rem] border border-pink-100 p-2 overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto space-y-2 p-2">
            {activities.map((act) => (
              <div key={act.id} className="flex justify-between items-center p-3 hover:bg-white/40 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-xs">{act.type === 'pulse' ? '💓' : '🔘'}</span>
                  <span className="text-[12px] text-gray-600 font-medium">{act.detail}</span>
                </div>
                <span className="text-[9px] text-pink-300 font-bold whitespace-nowrap">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
