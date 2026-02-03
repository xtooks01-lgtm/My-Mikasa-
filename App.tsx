
import React, { useState, useEffect } from 'react';
import { AppState, ThemeType, UserType } from './types';
import { FloatingElements } from './components/FloatingElements';
import { Button } from './components/Button';
import { MainDashboard } from './components/MainDashboard';
import { AdminPanel } from './components/AdminPanel';

const App: React.FC = () => {
  const [step, setStep] = useState<AppState>(AppState.IDENTITY);
  const [visible, setVisible] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [footerTaps, setFooterTaps] = useState(0);
  const [adminSettings, setAdminSettings] = useState<any>({ theme: 'pink', loveStorm: false });
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sanctuary_user') as UserType;
    const savedSettings = JSON.parse(localStorage.getItem('sanctuary_admin') || '{"theme":"pink"}');
    
    setAdminSettings(savedSettings);
    
    if (savedUser) {
      setCurrentUser(savedUser);
      setStep(AppState.SPLASH);
    } else {
      setStep(AppState.IDENTITY);
    }
    
    setVisible(true);
    
    const onStorage = () => {
      setAdminSettings(JSON.parse(localStorage.getItem('sanctuary_admin') || '{"theme":"pink"}'));
    };
    
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleIdentitySelection = (user: UserType) => {
    localStorage.setItem('sanctuary_user', user);
    setCurrentUser(user);
    handleNext(AppState.SPLASH);
  };

  const handleNext = (nextStep: AppState) => {
    setVisible(false);
    setTimeout(() => {
      setStep(nextStep);
      setVisible(true);
    }, 400);
  };

  const handleFooterTap = () => {
    const next = footerTaps + 1;
    if (next >= 3) {
      setShowAdmin(true);
      setFooterTaps(0);
    } else {
      setFooterTaps(next);
      setTimeout(() => setFooterTaps(0), 2000);
    }
  };

  const getThemeStyles = (theme: ThemeType) => {
    switch (theme) {
      case 'lavender': return { bg: 'bg-gradient-to-br from-purple-50 via-white to-indigo-50', text: 'text-purple-600', poetic: 'text-purple-700' };
      case 'mint': return { bg: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50', text: 'text-emerald-600', poetic: 'text-emerald-700' };
      case 'sky': return { bg: 'bg-gradient-to-br from-sky-50 via-white to-blue-50', text: 'text-sky-600', poetic: 'text-sky-700' };
      case 'peach': return { bg: 'bg-gradient-to-br from-orange-50 via-white to-rose-50', text: 'text-orange-600', poetic: 'text-orange-700' };
      case 'golden': return { bg: 'bg-gradient-to-br from-yellow-50 via-white to-orange-100', text: 'text-yellow-600', poetic: 'text-yellow-800' };
      default: return { bg: 'bg-gradient-to-br from-pink-50 via-white to-purple-50', text: 'text-pink-600', poetic: 'text-pink-500' };
    }
  };

  const styles = getThemeStyles(adminSettings.theme || 'pink');

  const renderContent = () => {
    switch (step) {
      case AppState.IDENTITY:
        return (
          <div className={`transition-opacity duration-700 space-y-12 text-center max-w-sm px-6 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-4">
              <h1 className={`text-3xl font-semibold poetic-text ${styles.poetic}`}>Welcome home.</h1>
              <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">Who is using this device?</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button onClick={() => handleIdentitySelection('Eren Yeager')} variant="outline" className="py-6 border-2 border-pink-100 text-gray-700 text-lg">
                Eren Yeager
              </Button>
              <Button onClick={() => handleIdentitySelection('Ann Mariya')} variant="outline" className="py-6 border-2 border-pink-100 text-gray-700 text-lg">
                Ann Mariya
              </Button>
            </div>
          </div>
        );

      case AppState.SPLASH:
        return (
          <div className={`transition-opacity duration-700 space-y-8 text-center max-w-sm px-6 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="space-y-4">
              <h1 className={`text-4xl font-semibold poetic-text ${styles.poetic}`}>Hi {currentUser} 🌸</h1>
              <p className="text-gray-500 text-lg leading-relaxed">
                A private sanctuary built for us.<br />
                Every corner of this space is safe.
              </p>
            </div>
            <Button onClick={() => handleNext(currentUser === 'Ann Mariya' ? AppState.PROPOSAL : AppState.DASHBOARD)}>
              Enter Sanctuary
            </Button>
          </div>
        );

      case AppState.PROPOSAL:
        return (
          <div className={`transition-opacity duration-700 space-y-12 text-center max-w-lg px-8 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`poetic-text text-2xl sm:text-3xl leading-relaxed whitespace-pre-line ${styles.poetic}`}>
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
              <span className={`${styles.text} font-medium`}>Welcome to our shared space.</span>
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
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-1000 ${styles.bg}`}>
      <FloatingElements intensity={adminSettings.loveStorm ? 40 : 15} />
      <main className="relative z-10 w-full h-full flex flex-col items-center">
        {renderContent()}
      </main>
      
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      <footer 
        onClick={handleFooterTap}
        className="absolute bottom-8 w-full text-center text-gray-300 cursor-pointer text-xs tracking-widest uppercase active:text-gray-500 transition-colors"
      >
        Built with care for Ann Mariya & Eren
      </footer>
    </div>
  );
};

export default App;
