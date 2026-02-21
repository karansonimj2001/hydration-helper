import { motion } from 'framer-motion';
import { formatVolume, computeHydration } from '@/lib/hydration';
import { DayLog } from '@/lib/hydration';
import { Flame, TrendingUp, Droplets } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Mascot from '@/components/Mascot';
import { determineMascotState } from '@/lib/mascot';

interface DashboardProps {
  todayLog: DayLog;
  todayHydration: number;
  todayPercent: number;
  streak: number;
  unit: 'ml' | 'oz';
}

const Dashboard = ({ todayLog, todayHydration, todayPercent, streak, unit }: DashboardProps) => {
  const goalReached = todayPercent >= 100;
  const remaining = Math.max(0, todayLog.goalMl - todayHydration);

  // Determine mascot state
  const lastEntry = todayLog.entries.length > 0
    ? todayLog.entries[todayLog.entries.length - 1]
    : null;
  const lastEntryMinutesAgo = lastEntry
    ? Math.floor((Date.now() - new Date(lastEntry.timestamp).getTime()) / 60000)
    : null;
  const hour = new Date().getHours();

  const mascotState = determineMascotState({
    percent: todayPercent,
    lastEntryMinutesAgo,
    hour,
    bedtimeStart: 22,
    bedtimeEnd: 7,
    justLogged: false,
    isFirstVisit: todayLog.entries.length === 0,
  });

  return (
    <div className="p-6 pb-24 space-y-5 max-w-sm mx-auto">
      {/* Mascot greeting */}
      <div className="flex justify-center pt-2">
        <Mascot state={mascotState} size="lg" showMessage />
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="8"
            />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={goalReached ? "hsl(var(--success))" : "hsl(var(--primary))"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 42 * (1 - Math.min(todayPercent, 100) / 100),
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={todayPercent}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <span className="text-3xl font-display font-bold">{todayPercent}%</span>
              <p className="text-sm text-muted-foreground mt-1">
                {formatVolume(todayHydration, unit)}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <Droplets className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Goal</p>
          <p className="font-bold font-display text-sm">{formatVolume(todayLog.goalMl, unit)}</p>
        </Card>
        <Card className="p-3 text-center">
          <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Remaining</p>
          <p className="font-bold font-display text-sm">{formatVolume(remaining, unit)}</p>
        </Card>
        <Card className="p-3 text-center">
          <Flame className="w-5 h-5 text-streak mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="font-bold font-display text-sm">{streak} day{streak !== 1 ? 's' : ''}</p>
        </Card>
      </div>

      {/* Today's entries */}
      {todayLog.entries.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-display font-semibold text-sm text-muted-foreground">Today's Log</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {todayLog.entries.slice().reverse().map(entry => (
              <Card key={entry.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {entry.drinkType === 'water' ? '💧' :
                     entry.drinkType === 'tea' ? '🍵' :
                     entry.drinkType === 'coffee' ? '☕' :
                     entry.drinkType === 'juice' ? '🧃' :
                     entry.drinkType === 'milk' ? '🥛' : '🥤'}
                  </span>
                  <div>
                    <p className="font-medium text-sm capitalize">{entry.drinkType}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className="font-display font-bold text-sm">{formatVolume(entry.ml, unit)}</span>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Goal celebration with mascot */}
      {goalReached && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-4 rounded-2xl bg-success/10 border border-success/20"
        >
          <Mascot state="celebrating" size="sm" showMessage={false} />
          <p className="font-display font-bold text-success mt-2">Goal Reached!</p>
          <p className="text-sm text-muted-foreground">You're properly hydrated today!</p>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
