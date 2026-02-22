import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mascot from '@/components/Mascot';
import { Droplets } from 'lucide-react';

interface SplashProps {
  onFinish: () => void;
}

const Splash = ({ onFinish }: SplashProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 500); // wait for exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-primary/20 via-background to-primary/10 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
          >
            <Mascot state="greeting" size="xl" showMessage={false} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              HydroBuddy
            </h1>
            <p className="text-muted-foreground mt-2 text-lg flex items-center justify-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Your hydration companion
            </p>
          </motion.div>

          {/* Animated water drops */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-primary/20"
                initial={{ 
                  x: Math.random() * 400 - 200 + window.innerWidth / 2, 
                  y: -20, 
                  scale: Math.random() * 0.5 + 0.5 
                }}
                animate={{ y: window.innerHeight + 20 }}
                transition={{ 
                  duration: Math.random() * 2 + 2, 
                  delay: Math.random() * 1.5,
                  ease: 'easeIn' 
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Splash;
