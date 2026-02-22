import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import Mascot from '@/components/Mascot';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithProvider } = useAuth();

  const onGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithProvider('google');
    } catch {
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm text-center"
      >
        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <Mascot state="greeting" size="lg" showMessage={false} />
        </div>

        {/* Branding */}
        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          HydroBuddy
        </h1>
        <p className="text-muted-foreground text-lg mb-10">
          Stay hydrated, stay healthy
        </p>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        {/* Single CTA: Google */}
        <Button
          onClick={onGoogle}
          disabled={loading}
          size="lg"
          className="w-full rounded-full py-6 text-base font-semibold gap-3 shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-sm text-muted-foreground flex items-center justify-center gap-2"
        >
          <Droplets className="w-4 h-4 text-primary" />
          Track your daily water intake with Droppy
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
