import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, calculateDailyGoal, formatVolume } from '@/lib/hydration';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import Mascot from '@/components/Mascot';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  unit: 'ml' | 'oz';
}

const steps = ['welcome', 'sex', 'weight', 'age', 'activity', 'goal'] as const;

const Onboarding = ({ onComplete, unit }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [activity, setActivity] = useState<UserProfile['activityLevel']>('moderate');

  const profile: UserProfile = { sex, weight, age, activityLevel: activity, onboarded: true };
  const goal = calculateDailyGoal(profile);

  const next = () => step < steps.length - 1 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const activityOptions: { value: UserProfile['activityLevel']; label: string; desc: string }[] = [
    { value: 'sedentary', label: '🪑 Sedentary', desc: 'Little or no exercise' },
    { value: 'light', label: '🚶 Light', desc: '1-3 days/week' },
    { value: 'moderate', label: '🏃 Moderate', desc: '3-5 days/week' },
    { value: 'active', label: '💪 Active', desc: '6-7 days/week' },
    { value: 'very_active', label: '🔥 Very Active', desc: 'Intense daily exercise' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          {steps[step] === 'welcome' && (
            <div className="text-center space-y-6">
              <Mascot state="greeting" size="xl" showMessage />
              <h1 className="text-3xl font-display font-bold text-foreground">HydroBuddy</h1>
              <p className="text-muted-foreground text-lg">Meet Droppy, your personal hydration companion! 💦</p>
              <Button onClick={next} size="lg" className="w-full rounded-full text-lg gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {steps[step] === 'sex' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Mascot state="idle" size="sm" showMessage={false} />
              </div>
              <h2 className="text-2xl font-display font-bold text-center">What's your sex?</h2>
              <p className="text-muted-foreground text-center">This helps calculate your hydration needs</p>
              <div className="grid grid-cols-2 gap-4">
                {(['male', 'female'] as const).map(s => (
                  <Card
                    key={s}
                    onClick={() => setSex(s)}
                    className={`p-6 text-center cursor-pointer transition-all hover:scale-105 ${
                      sex === s ? 'ring-2 ring-primary bg-secondary' : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-4xl">{s === 'male' ? '👨' : '👩'}</span>
                    <p className="mt-2 font-semibold capitalize">{s}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {steps[step] === 'weight' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Mascot state="encouraging" size="sm" showMessage={false} />
              </div>
              <h2 className="text-2xl font-display font-bold text-center">Your weight</h2>
              <p className="text-muted-foreground text-center">Used to calculate your daily goal</p>
              <div className="text-center">
                <span className="text-6xl font-display font-bold text-primary">{weight}</span>
                <span className="text-2xl text-muted-foreground ml-2">kg</span>
              </div>
              <input
                type="range"
                min={30}
                max={200}
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none bg-secondary accent-primary"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>30 kg</span>
                <span>200 kg</span>
              </div>
            </div>
          )}

          {steps[step] === 'age' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <Mascot state="encouraging" size="sm" showMessage={false} />
              </div>
              <h2 className="text-2xl font-display font-bold text-center">Your age</h2>
              <div className="text-center">
                <span className="text-6xl font-display font-bold text-primary">{age}</span>
                <span className="text-2xl text-muted-foreground ml-2">years</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none bg-secondary accent-primary"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10</span>
                <span>90</span>
              </div>
            </div>
          )}

          {steps[step] === 'activity' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Mascot state="encouraging" size="sm" showMessage={false} />
              </div>
              <h2 className="text-2xl font-display font-bold text-center">Activity level</h2>
              <div className="space-y-3">
                {activityOptions.map(opt => (
                  <Card
                    key={opt.value}
                    onClick={() => setActivity(opt.value)}
                    className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                      activity === opt.value ? 'ring-2 ring-primary bg-secondary' : 'hover:bg-muted'
                    }`}
                  >
                    <p className="font-semibold">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {steps[step] === 'goal' && (
            <div className="text-center space-y-6">
              <Mascot state="celebrating" size="lg" showMessage />
              <h2 className="text-2xl font-display font-bold">Your daily goal</h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="text-6xl font-display font-bold text-primary">
                  {formatVolume(goal, unit)}
                </div>
              </motion.div>
              <p className="text-muted-foreground">Based on your profile, Droppy recommends this daily intake.</p>
              <Button
                onClick={() => onComplete(profile)}
                size="lg"
                className="w-full rounded-full text-lg gap-2"
              >
                Let's Go! 💧
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && step < steps.length - 1 && (
        <div className="flex gap-4 mt-8 w-full max-w-sm">
          <Button variant="outline" onClick={prev} className="flex-1 rounded-full gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={next} className="flex-1 rounded-full gap-1">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex gap-2 mt-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === step ? 'bg-primary w-8' : i < step ? 'bg-primary/50' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
