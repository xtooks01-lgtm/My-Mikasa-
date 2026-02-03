
import React, { useState, useEffect, useRef } from 'react';
import { JournalEntry, UserType } from '../types';

interface JournalTabProps {
  onAction: (detail: string) => void;
}

export const JournalTab: React.FC<JournalTabProps> = ({ onAction }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [currentUser, setCurrentUser] = useState<UserType>('Eren Yeager');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = (localStorage.getItem('sanctuary_user') as UserType) || 'Eren Yeager';
    setCurrentUser(user);

    const saved = localStorage.getItem('sanctuary_journal');
    if (saved) {
      let parsed = JSON.parse(saved) as JournalEntry[];
      // Mark other person's entries as seen because the current user is viewing them now
      const marked = parsed.map(e => e.author !== user ? { ...e, seen: true } : e);
      setEntries(marked);
      localStorage.setItem('sanctuary_journal', JSON.stringify(marked));
    } else {
      const initial: JournalEntry[] = [{
        id: '1',
        author: 'Ann Mariya',
        content: "I'm so glad we have this space. Every word here feels closer to home. 🌸",
        timestamp: Date.now() - 100000,
        seen: true
      }];
      setEntries(initial);
      localStorage.setItem('sanctuary_journal', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const handleShare = () => {
    if (!newEntry.trim()) return;
    
    const entry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser,
      content: newEntry.trim(),
      timestamp: Date.now(),
      seen: false
    };

    const updated = [...entries, entry];
    setEntries(updated);
    localStorage.setItem('sanctuary_journal', JSON.stringify(updated));
    onAction(`Shared a moment: "${newEntry.substring(0, 20)}..."`);
    setNewEntry('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] animate-in fade-in duration-500">
      <header className="space-y-1 mb-6">
        <h2 className="text-[10px] font-bold text-pink-300 uppercase tracking-[0.3em]">Our Words</h2>
        <h1 className="text-3xl text-gray-800 font-semibold poetic-text">Moments</h1>
        <p className="text-[11px] text-pink-400 font-medium italic opacity-80">
          Every word here is for both of us. Read kindly.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto space-y-8 pr-1 custom-scrollbar pb-4">
        {entries.map((entry, index) => (
          <div key={entry.id} className="relative">
            {index !== 0 && (
              <div className="flex justify-center my-6 opacity-20">
                <span className="text-xs">🌸</span>
              </div>
            )}
            <div className={`flex flex-col ${entry.author === currentUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-2 mb-1 px-2">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${entry.author === 'Ann Mariya' ? 'text-pink-400' : 'text-purple-400'}`}>
                  {entry.author === currentUser ? 'You' : entry.author}
                </span>
                <span className="text-[8px] text-gray-300 font-medium flex items-center">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {entry.author === currentUser && entry.seen && (
                    <span className="ml-1.5 text-pink-400 text-[9px] animate-in zoom-in fade-in duration-700" title="Read by them">❤️</span>
                  )}
                </span>
              </div>
              
              <div className={`max-w-[90%] p-5 rounded-[2rem] text-[15px] leading-relaxed shadow-sm border transition-all duration-500 ${
                entry.author === currentUser 
                  ? 'bg-white border-pink-50 text-gray-700 rounded-tr-none' 
                  : 'bg-pink-50/50 border-white text-gray-800 rounded-tl-none font-medium'
              }`}>
                {entry.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="mt-4 space-y-3 bg-white/40 p-3 rounded-[2.5rem] border border-white shadow-inner">
        <textarea 
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Add to our story..."
          className="w-full h-20 bg-transparent border-none p-4 text-sm focus:outline-none resize-none text-gray-800 placeholder:text-pink-200"
        />
        <div className="flex justify-end">
          <button 
            onClick={handleShare}
            disabled={!newEntry.trim()}
            className="bg-pink-100 text-pink-600 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[9px] shadow-sm active:scale-95 transition-all disabled:opacity-40"
          >
            Share with Us
          </button>
        </div>
      </div>
    </div>
  );
};
