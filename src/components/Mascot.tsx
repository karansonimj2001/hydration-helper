import { motion, AnimatePresence } from 'framer-motion';
import { MascotState, MASCOT_CONFIG, getMascotMessage } from '@/lib/mascot';
import { useState, useEffect, useMemo } from 'react';

interface MascotProps {
  state: MascotState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showMessage?: boolean;
  className?: string;
}

const SIZES = { sm: 60, md: 90, lg: 130, xl: 180 };

const Mascot = ({ state, size = 'md', showMessage = true, className = '' }: MascotProps) => {
  const config = MASCOT_CONFIG[state];
  const px = SIZES[size];
  const [message, setMessage] = useState('');

  // Refresh message when state changes
  useEffect(() => {
    setMessage(getMascotMessage(state));
  }, [state]);

  // SVG elements based on expression
  const eyes = useMemo(() => {
    switch (config.eyeStyle) {
      case 'open':
        return (
          <>
            <ellipse cx="37" cy="42" rx="4" ry="5" fill="hsl(var(--foreground))" />
            <ellipse cx="63" cy="42" rx="4" ry="5" fill="hsl(var(--foreground))" />
            <circle cx="39" cy="40" r="1.5" fill="white" />
            <circle cx="65" cy="40" r="1.5" fill="white" />
          </>
        );
      case 'happy':
        return (
          <>
            <path d="M33 42 Q37 37 41 42" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M59 42 Q63 37 67 42" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'sad':
        return (
          <>
            <ellipse cx="37" cy="44" rx="4" ry="5.5" fill="hsl(var(--foreground))" />
            <ellipse cx="63" cy="44" rx="4" ry="5.5" fill="hsl(var(--foreground))" />
            <circle cx="39" cy="42" r="1.5" fill="white" />
            <circle cx="65" cy="42" r="1.5" fill="white" />
            {/* Tear */}
            <motion.ellipse
              cx="42" cy="52" rx="2" ry="3"
              fill="hsl(var(--primary) / 0.6)"
              animate={{ cy: [50, 58, 50], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </>
        );
      case 'closed':
        return (
          <>
            <path d="M33 43 Q37 46 41 43" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M59 43 Q63 46 67 43" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'sparkle':
        return (
          <>
            <motion.g animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <circle cx="37" cy="42" r="5" fill="hsl(var(--foreground))" />
              <circle cx="63" cy="42" r="5" fill="hsl(var(--foreground))" />
              <circle cx="39" cy="40" r="2" fill="white" />
              <circle cx="65" cy="40" r="2" fill="white" />
              <circle cx="36" cy="44" r="1" fill="white" />
              <circle cx="62" cy="44" r="1" fill="white" />
            </motion.g>
          </>
        );
    }
  }, [config.eyeStyle]);

  const mouth = useMemo(() => {
    switch (config.mouthStyle) {
      case 'smile':
        return <path d="M42 56 Q50 63 58 56" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
      case 'grin':
        return <path d="M40 55 Q50 66 60 55" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
      case 'worried':
        return <path d="M43 59 Q50 54 57 59" stroke="hsl(var(--foreground))" strokeWidth="2.5" fill="none" strokeLinecap="round" />;
      case 'open-smile':
        return (
          <>
            <ellipse cx="50" cy="59" rx="8" ry="6" fill="hsl(var(--foreground))" />
            <ellipse cx="50" cy="57" rx="6" ry="3" fill="hsl(var(--primary) / 0.3)" />
          </>
        );
      case 'sleeping':
        return <path d="M44 57 Q50 60 56 57" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />;
    }
  }, [config.mouthStyle]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showMessage && message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-card border border-border rounded-2xl px-4 py-2 max-w-[220px] text-center shadow-lg"
          >
            <p className="text-sm font-medium text-foreground leading-tight">{message}</p>
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card border-r border-b border-border" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot body */}
      <motion.div
        animate={config.bodyBounce ? { y: [0, -6, 0] } : { y: 0 }}
        transition={config.bodyBounce ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : {}}
        style={{ width: px, height: px }}
        className="relative"
      >
        {/* Accessory */}
        {config.accessory && (
          <motion.span
            className="absolute -top-1 -right-1 text-lg z-10"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            style={{ fontSize: px * 0.22 }}
          >
            {config.accessory}
          </motion.span>
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Water droplet body */}
          <defs>
            <linearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--water-dark))" />
            </linearGradient>
            <linearGradient id="dropShine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.35" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Drop shape: pointed top, round bottom */}
          <path
            d="M50 8 C50 8 20 45 20 62 C20 80 33 92 50 92 C67 92 80 80 80 62 C80 45 50 8 50 8Z"
            fill="url(#dropGrad)"
          />
          {/* Shine highlight */}
          <ellipse cx="38" cy="50" rx="10" ry="18" fill="url(#dropShine)" transform="rotate(-15 38 50)" />

          {/* Blush */}
          {config.blush && (
            <>
              <circle cx="28" cy="52" r="5" fill="hsl(var(--streak))" opacity="0.25" />
              <circle cx="72" cy="52" r="5" fill="hsl(var(--streak))" opacity="0.25" />
            </>
          )}

          {/* Eyes */}
          {eyes}

          {/* Mouth */}
          {mouth}
        </svg>
      </motion.div>
    </div>
  );
};

export default Mascot;
