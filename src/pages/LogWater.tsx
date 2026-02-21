import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_CUP_SIZES, DEFAULT_DRINK_TYPES, formatVolume } from '@/lib/hydration';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Mascot from '@/components/Mascot';

interface LogWaterProps {
  onLog: (ml: number, drinkType: string) => void;
  unit: 'ml' | 'oz';
}

const LogWater = ({ onLog, unit }: LogWaterProps) => {
  const [selectedDrink, setSelectedDrink] = useState('water');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [customMl, setCustomMl] = useState(250);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLog = (ml: number) => {
    onLog(ml, selectedDrink);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setSelectedSize(null);
  };

  return (
    <div className="p-6 pb-24 space-y-6 max-w-sm mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold">Log Drink</h1>
        <p className="text-muted-foreground">What did you drink?</p>
      </div>

      {/* Drink type */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-sm text-muted-foreground">Drink Type</h3>
        <div className="grid grid-cols-3 gap-2">
          {DEFAULT_DRINK_TYPES.map(drink => (
            <Card
              key={drink.id}
              onClick={() => setSelectedDrink(drink.id)}
              className={`p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                selectedDrink === drink.id ? 'ring-2 ring-primary bg-secondary' : 'hover:bg-muted'
              }`}
            >
              <span className="text-2xl">{drink.icon}</span>
              <p className="text-xs mt-1 font-medium">{drink.name}</p>
              <p className="text-[10px] text-muted-foreground">{drink.hydrationPercent}%</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Cup sizes */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-sm text-muted-foreground">Quick Add</h3>
        <div className="grid grid-cols-3 gap-2">
          {DEFAULT_CUP_SIZES.map(cup => (
            <motion.div key={cup.id} whileTap={{ scale: 0.95 }}>
              <Button
                variant={selectedSize === cup.id ? "default" : "outline"}
                className="w-full h-auto py-4 flex flex-col gap-1 rounded-xl"
                onClick={() => {
                  setSelectedSize(cup.id);
                  handleLog(cup.ml);
                }}
              >
                <span className="text-lg">🥤</span>
                <span className="text-xs font-bold">{cup.label}</span>
                <span className="text-[10px] opacity-80">{formatVolume(cup.ml, unit)}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-sm text-muted-foreground">Custom Amount</h3>
        <div className="text-center">
          <span className="text-3xl font-display font-bold text-primary">{formatVolume(customMl, unit)}</span>
        </div>
        <input
          type="range"
          min={50}
          max={1000}
          step={25}
          value={customMl}
          onChange={e => setCustomMl(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none bg-secondary accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatVolume(50, unit)}</span>
          <span>{formatVolume(1000, unit)}</span>
        </div>
        <Button
          onClick={() => handleLog(customMl)}
          className="w-full rounded-full gap-2"
          size="lg"
        >
          <Plus className="w-5 h-5" /> Add {formatVolume(customMl, unit)}
        </Button>
      </div>

      {/* Success overlay with mascot */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 30 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <Mascot state="encouraging" size="lg" showMessage />
              {/* Confetti-like particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: '50%',
                      backgroundColor: [
                        'hsl(var(--primary))',
                        'hsl(var(--success))',
                        'hsl(var(--streak))',
                        'hsl(var(--accent))',
                      ][i % 4],
                    }}
                    initial={{ y: 0, opacity: 1, scale: 0 }}
                    animate={{
                      y: -120 - Math.random() * 80,
                      x: (Math.random() - 0.5) * 100,
                      opacity: 0,
                      scale: 1,
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 1.2, delay: i * 0.08, ease: 'easeOut' }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogWater;
