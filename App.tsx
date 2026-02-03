
import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import { FloatingElements } from './components/FloatingElements';
import { Button } from './components/Button';
import { MainDashboard } from './components/MainDashboard';
import { AdminPanel } from './components/AdminPanel';

const App: React.FC = () => {
  const [step, setStep] = useState<AppState>(AppState.SPLASH);
  const [visible, setVisible] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [footerTaps, setFooterTaps] = useState(0);

  useEffect(() => {
    setVisible(true);
  }, [step]);

  const handleNext = (nextStep: AppState) => {
    setVisible(false);
    setTimeout(() => {
      setStep(nextStep);
    }, 400); // Wait for fade-out
  };

  const handleFooterTap = () => {
    const next = footerTaps + 1;
    if (next >= 3) {
      setShowAdmin(true);
      setFooterTaps(0);
    } else {
      setFooterTaps(next);
      // Reset taps after 2 seconds of inactivity
      setTimeout(() => setFooterTaps(0), 2000);
    }
  };

  // Check for visual overrides
  const adminSettings = JSON.parse(localStorage.getItem('sanctuary_admin') || '{}');

  const renderContent = () => {
    switch (step) {
      case AppState.SPLASH:
        return (
          <div className={`transition-opacity duration-700 space-y-8 text-center max-w-sm px-6 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-4">
              <h1 className={`text-4xl font-semibold poetic-text ${adminSettings.goldenMode ? 'text-yellow-600' : 'text-pink-500'}`}>Hi Ann Mariya 🌸</h1>
              <p className="text-gray-500 text-lg leading-relaxed">
                A private sanctuary built just for you.<br />
                Every corner of this space is safe.
              </p>
            </div>
            <Button onClick={() => handleNext(AppState.PROPOSAL)}>Enter Sanctuary</Button>
          </div>
        );

      case AppState.PROPOSAL:
        return (
          <div className={`transition-opacity duration-700 space-y-12 text-center max-w-lg px-8 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`poetic-text text-2xl sm:text-3xl leading-relaxed whitespace-pre-line ${adminSettings.goldenMode ? 'text-yellow-800' : 'text-pink-700'}`}>
              {`Ann Mariya,
you already know how I feel —
so this isn’t a surprise, just honesty.

I’m not here to rush you or corner your heart.
I just wanted to ask once, sincerely.`}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => handleNext(AppState.ROMANTIC_ACCEPT)} variant="primary" className="w-full sm:w-auto">
                🩷 Let’s try… slowly
              </Button>
              <Button onClick={() => handleNext(AppState.BESTIE_CONFIRM)} variant="secondary" className="w-full sm:w-auto">
                🌸 Besties, always
              </Button>
            </div>
          </div>
        );

      case AppState.ROMANTIC_ACCEPT:
        return (
          <div className={`transition-opacity duration-700 space-y-8 text-center max-w-sm px-6 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-4xl">🕊️</div>
            <p className="text-xl text-gray-700 leading-relaxed">
              My heart is full.<br />
              Let’s move at your pace, always.<br /><br />
              <span className="text-pink-500 font-medium">Welcome to our shared space.</span>
            </p>
            <Button onClick={() => handleNext(AppState.DASHBOARD)}>Enter</Button>
          </div>
        );

      case AppState.BESTIE_CONFIRM:
        return (
          <div className={`transition-opacity duration-700 space-y-8 text-center max-w-sm px-6 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed">
                That’s completely okay 🌸<br />
                I value our bond more than anything.<br /><br />
                So… besties for life?
              </p>
              <div className="space-y-3">
                <Button onClick={() => handleNext(AppState.DASHBOARD)}>
                  💗 Yes, forever
                </Button>
              </div>
            </div>
          </div>
        );

      case AppState.DASHBOARD:
        return <MainDashboard />;

      default:
        return null;
    }
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden select-none transition-colors duration-1000 ${adminSettings.goldenMode ? 'bg-gradient-to-br from-yellow-50 via-white to-orange-50' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
      <FloatingElements intensity={adminSettings.loveStorm ? 40 : 15} />
      <main className="relative z-10 w-full h-full flex flex-col items-center">
        {renderContent()}
      </main>
      
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      <footer 
        onClick={handleFooterTap}
        className="absolute bottom-8 w-full text-center text-pink-200 cursor-pointer text-xs tracking-widest uppercase active:text-pink-400"
      >
        Built with care for Ann Mariya
      </footer>
    </div>
  );
};

export default App;
