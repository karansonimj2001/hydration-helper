import { NotificationSettings, formatVolume, calculateDailyGoal } from '@/lib/hydration';
import { UserProfile } from '@/lib/hydration';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Moon, Ruler, User, RotateCcw, Droplets } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface SettingsProps {
  profile: UserProfile;
  notifSettings: NotificationSettings;
  onNotifChange: (s: NotificationSettings) => void;
  unit: 'ml' | 'oz';
  onUnitChange: (u: 'ml' | 'oz') => void;
  onReset: () => void;
  onResetProfile: () => void;
}

const Settings = ({ profile, notifSettings, onNotifChange, unit, onUnitChange, onReset, onResetProfile }: SettingsProps) => {
  const goal = calculateDailyGoal(profile);

  return (
    <div className="p-6 pb-24 space-y-6 max-w-sm mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      {/* Profile */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Profile</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Sex</div>
          <div className="capitalize font-medium">{profile.sex}</div>
          <div className="text-muted-foreground">Weight</div>
          <div className="font-medium">{profile.weight} kg</div>
          <div className="text-muted-foreground">Age</div>
          <div className="font-medium">{profile.age}</div>
          <div className="text-muted-foreground">Activity</div>
          <div className="capitalize font-medium">{profile.activityLevel.replace('_', ' ')}</div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t">
          <Droplets className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Daily Goal:</span>
          <span className="font-display font-bold">{formatVolume(goal, unit)}</span>
        </div>
        <Button variant="outline" size="sm" className="w-full rounded-full" onClick={onResetProfile}>
          Re-do Onboarding
        </Button>
      </Card>

      {/* Notifications */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Reminders</h3>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notif-enabled">Enable Reminders</Label>
          <Switch
            id="notif-enabled"
            checked={notifSettings.enabled}
            onCheckedChange={(checked) => onNotifChange({ ...notifSettings, enabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Reminder Interval</Label>
          <Select
            value={String(notifSettings.intervalMinutes)}
            onValueChange={(v) => onNotifChange({ ...notifSettings, intervalMinutes: Number(v) })}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Every 30 min</SelectItem>
              <SelectItem value="45">Every 45 min</SelectItem>
              <SelectItem value="60">Every hour</SelectItem>
              <SelectItem value="90">Every 1.5 hours</SelectItem>
              <SelectItem value="120">Every 2 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Moon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Bedtime Mode</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Sleep at</Label>
            <input
              type="time"
              value={notifSettings.bedtimeStart}
              onChange={e => onNotifChange({ ...notifSettings, bedtimeStart: e.target.value })}
              className="w-full mt-1 p-2 rounded-lg border bg-background text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Wake at</Label>
            <input
              type="time"
              value={notifSettings.bedtimeEnd}
              onChange={e => onNotifChange({ ...notifSettings, bedtimeEnd: e.target.value })}
              className="w-full mt-1 p-2 rounded-lg border bg-background text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Units */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Ruler className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Units</h3>
        </div>
        <div className="flex gap-2">
          {(['ml', 'oz'] as const).map(u => (
            <Button
              key={u}
              variant={unit === u ? 'default' : 'outline'}
              className="flex-1 rounded-full"
              onClick={() => onUnitChange(u)}
            >
              {u === 'ml' ? 'Milliliters (ml)' : 'Ounces (oz)'}
            </Button>
          ))}
        </div>
      </Card>

      {/* Reset */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw className="w-5 h-5 text-destructive" />
          <h3 className="font-display font-semibold">Reset</h3>
        </div>
        <Button
          variant="destructive"
          className="w-full rounded-full"
          onClick={onReset}
        >
          Reset Today's Log
        </Button>
      </Card>

      {/* Account */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-5 h-5" />
          <h3 className="font-display font-semibold">Account</h3>
        </div>
        <AccountActions />
      </Card>
    </div>
  );
};

const AccountActions = () => {
  const { logout, user } = useAuth();

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">Signed in as</div>
      <div className="font-medium">{user?.email || '—'}</div>
      <div className="pt-2">
        <Button variant="outline" className="w-full" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
