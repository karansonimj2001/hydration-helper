import { useState, useCallback, useEffect } from 'react';
import {
  UserProfile, WaterEntry, DayLog, NotificationSettings,
  loadProfile, saveProfile, loadLogs, saveLogs,
  loadNotificationSettings, saveNotificationSettings,
  loadUnit, saveUnit, calculateDailyGoal, todayKey,
  computeHydration, calculateStreak,
} from '@/lib/hydration';

export function useHydration() {
  const [profile, setProfileState] = useState<UserProfile | null>(loadProfile);
  const [logs, setLogsState] = useState<Record<string, DayLog>>(loadLogs);
  const [notifSettings, setNotifState] = useState<NotificationSettings>(loadNotificationSettings);
  const [unit, setUnitState] = useState<'ml' | 'oz'>(loadUnit);

  const setProfile = useCallback((p: UserProfile) => {
    setProfileState(p);
    saveProfile(p);
  }, []);

  const setUnit = useCallback((u: 'ml' | 'oz') => {
    setUnitState(u);
    saveUnit(u);
  }, []);

  const setNotifSettings = useCallback((s: NotificationSettings) => {
    setNotifState(s);
    saveNotificationSettings(s);
  }, []);

  const todayLog: DayLog = logs[todayKey()] || {
    date: todayKey(),
    entries: [],
    goalMl: profile ? calculateDailyGoal(profile) : 2500,
  };

  const todayHydration = computeHydration(todayLog.entries);
  const todayPercent = todayLog.goalMl > 0 ? Math.min(100, Math.round((todayHydration / todayLog.goalMl) * 100)) : 0;
  const streak = calculateStreak(logs);

  const addEntry = useCallback((ml: number, drinkType: string) => {
    const key = todayKey();
    const updated = { ...logs };
    if (!updated[key]) {
      updated[key] = {
        date: key,
        entries: [],
        goalMl: profile ? calculateDailyGoal(profile) : 2500,
      };
    }
    updated[key].entries.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ml,
      drinkType,
    });
    setLogsState(updated);
    saveLogs(updated);
  }, [logs, profile]);

  const removeEntry = useCallback((entryId: string) => {
    const key = todayKey();
    const updated = { ...logs };
    if (updated[key]) {
      updated[key].entries = updated[key].entries.filter(e => e.id !== entryId);
      setLogsState(updated);
      saveLogs(updated);
    }
  }, [logs]);

  const resetToday = useCallback(() => {
    const key = todayKey();
    const updated = { ...logs };
    if (updated[key]) {
      updated[key].entries = [];
      setLogsState(updated);
      saveLogs(updated);
    }
  }, [logs]);

  return {
    profile, setProfile,
    logs, todayLog, todayHydration, todayPercent, streak,
    addEntry, removeEntry, resetToday,
    notifSettings, setNotifSettings,
    unit, setUnit,
  };
}
