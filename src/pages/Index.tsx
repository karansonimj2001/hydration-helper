import { useState } from 'react';
import { useHydration } from '@/hooks/useHydration';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import LogWater from './LogWater';
import History from './History';
import Settings from './Settings';
import { UserProfile } from '@/lib/hydration';
import { Droplets, Plus, BarChart3, Settings as SettingsIcon, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'home' | 'log' | 'history' | 'settings';

const Index = () => {
  const {
    profile, setProfile,
    logs, todayLog, todayHydration, todayPercent, streak,
    addEntry, resetToday,
    notifSettings, setNotifSettings,
    unit, setUnit,
  } = useHydration();

  const [tab, setTab] = useState<Tab>('home');

  // Show onboarding if not completed
  if (!profile?.onboarded) {
    return (
      <Onboarding
        onComplete={(p: UserProfile) => setProfile(p)}
        unit={unit}
      />
    );
  }

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: 'log', icon: <Plus className="w-5 h-5" />, label: 'Log' },
    { id: 'history', icon: <BarChart3 className="w-5 h-5" />, label: 'Stats' },
    { id: 'settings', icon: <SettingsIcon className="w-5 h-5" />, label: 'Settings' },
  ];

  const handleResetProfile = () => {
    localStorage.removeItem('hydro_profile');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'home' && (
            <Dashboard
              todayLog={todayLog}
              todayHydration={todayHydration}
              todayPercent={todayPercent}
              streak={streak}
              unit={unit}
            />
          )}
          {tab === 'log' && (
            <LogWater onLog={addEntry} unit={unit} />
          )}
          {tab === 'history' && (
            <History logs={logs} unit={unit} />
          )}
          {tab === 'settings' && (
            <Settings
              profile={profile}
              notifSettings={notifSettings}
              onNotifChange={setNotifSettings}
              unit={unit}
              onUnitChange={setUnit}
              onReset={resetToday}
              onResetProfile={handleResetProfile}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-lg mx-auto bg-card/95 backdrop-blur-lg border-t shadow-lg">
          <div className="flex items-center justify-around py-2 px-2">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
                  tab === t.id
                    ? 'text-primary bg-secondary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.id === 'log' ? (
                  <div className={`p-2 rounded-full ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {t.icon}
                  </div>
                ) : (
                  t.icon
                )}
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Index;
