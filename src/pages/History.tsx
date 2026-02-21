import { useState, useMemo } from 'react';
import { DayLog, computeHydration, formatVolume } from '@/lib/hydration';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

interface HistoryProps {
  logs: Record<string, DayLog>;
  unit: 'ml' | 'oz';
}

const History = ({ logs, unit }: HistoryProps) => {
  const [range, setRange] = useState<7 | 30>(7);

  const chartData = useMemo(() => {
    const data: { date: string; label: string; value: number; goal: number; met: boolean }[] = [];
    const today = new Date();
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const log = logs[key];
      const hydration = log ? computeHydration(log.entries) : 0;
      const goal = log?.goalMl || 2500;
      data.push({
        date: key,
        label: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
        value: Math.round(hydration),
        goal,
        met: hydration >= goal,
      });
    }
    return data;
  }, [logs, range]);

  const avgIntake = chartData.reduce((s, d) => s + d.value, 0) / chartData.length;
  const daysMetGoal = chartData.filter(d => d.met).length;
  const avgGoal = chartData.reduce((s, d) => s + d.goal, 0) / chartData.length;

  return (
    <div className="p-6 pb-24 space-y-6 max-w-sm mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold">History</h1>
        <p className="text-muted-foreground">Your hydration journey</p>
      </div>

      {/* Range selector */}
      <div className="flex gap-2 justify-center">
        {([7, 30] as const).map(r => (
          <Button
            key={r}
            variant={range === r ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setRange(r)}
          >
            {r} Days
          </Button>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barCategoryGap="20%">
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <ReferenceLine y={avgGoal} stroke="hsl(var(--primary))" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.met ? 'hsl(var(--success))' : 'hsl(var(--primary))'}
                  opacity={entry.value > 0 ? 1 : 0.2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Dashed line = average goal
        </p>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Days Goal Met</p>
          <p className="text-xl font-display font-bold">{daysMetGoal}/{range}</p>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Avg Intake</p>
          <p className="text-xl font-display font-bold">{formatVolume(avgIntake, unit)}</p>
        </Card>
      </div>

      {/* Recent days list */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-sm text-muted-foreground">Daily Breakdown</h3>
        {chartData.slice().reverse().slice(0, 7).map(day => (
          <Card key={day.date} className="p-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{day.label}</p>
              <p className="text-xs text-muted-foreground">{formatVolume(day.goal, unit)} goal</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="font-display font-bold text-sm">{formatVolume(day.value, unit)}</span>
              {day.met && <span className="text-success">✓</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;
