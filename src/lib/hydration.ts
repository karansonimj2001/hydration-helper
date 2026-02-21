// Types
export interface UserProfile {
  sex: 'male' | 'female';
  weight: number; // kg
  age: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  onboarded: boolean;
}

export interface DrinkType {
  id: string;
  name: string;
  icon: string;
  hydrationPercent: number; // e.g. water = 100, coffee = 80
}

export interface CupSize {
  id: string;
  label: string;
  ml: number;
}

export interface WaterEntry {
  id: string;
  timestamp: string; // ISO
  ml: number;
  drinkType: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  entries: WaterEntry[];
  goalMl: number;
}

export interface NotificationSettings {
  enabled: boolean;
  intervalMinutes: number;
  bedtimeStart: string; // HH:mm
  bedtimeEnd: string; // HH:mm
}

export const DEFAULT_DRINK_TYPES: DrinkType[] = [
  { id: 'water', name: 'Water', icon: '💧', hydrationPercent: 100 },
  { id: 'tea', name: 'Tea', icon: '🍵', hydrationPercent: 90 },
  { id: 'coffee', name: 'Coffee', icon: '☕', hydrationPercent: 80 },
  { id: 'juice', name: 'Juice', icon: '🧃', hydrationPercent: 85 },
  { id: 'milk', name: 'Milk', icon: '🥛', hydrationPercent: 90 },
  { id: 'soda', name: 'Soda', icon: '🥤', hydrationPercent: 70 },
];

export const DEFAULT_CUP_SIZES: CupSize[] = [
  { id: 'small', label: 'Small', ml: 150 },
  { id: 'medium', label: 'Medium', ml: 250 },
  { id: 'large', label: 'Large', ml: 350 },
  { id: 'bottle', label: 'Bottle', ml: 500 },
  { id: 'big_bottle', label: 'Big Bottle', ml: 750 },
];

// Calculate daily water goal in ml based on profile
export function calculateDailyGoal(profile: UserProfile): number {
  // Base: 30-35ml per kg of body weight
  let base = profile.weight * 33;

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    active: 1.35,
    very_active: 1.5,
  };
  base *= activityMultipliers[profile.activityLevel] || 1.0;

  // Sex adjustment
  if (profile.sex === 'male') base *= 1.05;

  // Round to nearest 50ml
  return Math.round(base / 50) * 50;
}

// Compute effective hydration from entries
export function computeHydration(entries: WaterEntry[]): number {
  return entries.reduce((sum, e) => {
    const drink = DEFAULT_DRINK_TYPES.find(d => d.id === e.drinkType);
    const factor = drink ? drink.hydrationPercent / 100 : 1;
    return sum + e.ml * factor;
  }, 0);
}

// Get today's date string
export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

// Storage helpers
const PROFILE_KEY = 'hydro_profile';
const LOGS_KEY = 'hydro_logs';
const NOTIF_KEY = 'hydro_notifications';
const UNIT_KEY = 'hydro_unit';

export function loadProfile(): UserProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(p: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function loadLogs(): Record<string, DayLog> {
  const raw = localStorage.getItem(LOGS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function saveLogs(logs: Record<string, DayLog>) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function loadNotificationSettings(): NotificationSettings {
  const raw = localStorage.getItem(NOTIF_KEY);
  return raw ? JSON.parse(raw) : {
    enabled: true,
    intervalMinutes: 60,
    bedtimeStart: '22:00',
    bedtimeEnd: '07:00',
  };
}

export function saveNotificationSettings(s: NotificationSettings) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(s));
}

export function loadUnit(): 'ml' | 'oz' {
  return (localStorage.getItem(UNIT_KEY) as 'ml' | 'oz') || 'ml';
}

export function saveUnit(u: 'ml' | 'oz') {
  localStorage.setItem(UNIT_KEY, u);
}

export function mlToOz(ml: number): number {
  return Math.round(ml * 0.033814 * 10) / 10;
}

export function formatVolume(ml: number, unit: 'ml' | 'oz'): string {
  if (unit === 'oz') return `${mlToOz(ml)} oz`;
  return `${Math.round(ml)} ml`;
}

// Streak calculation
export function calculateStreak(logs: Record<string, DayLog>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const log = logs[key];
    if (log && computeHydration(log.entries) >= log.goalMl) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}
