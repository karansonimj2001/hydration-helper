import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, Droplets } from 'lucide-react';
import Mascot from '@/components/Mascot';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ok = isSignup ? await signup(email.trim(), password) : await login(email.trim(), password);
      if (ok) {
        navigate('/');
      } else {
        setError('Authentication failed. Check your credentials or verify your email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      setLoading(true);
      await signInWithProvider('google');
    } catch (e) {
      setError('Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mascot state="greeting" size="md" showMessage={false} />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            HydroBuddy
          </h1>
          <p className="text-muted-foreground text-lg">Stay hydrated, stay healthy</p>
        </div>

        {/* Auth Card */}
        <Card className="p-8 shadow-lg border-0">
          {/* Form Title */}
          <motion.div
            key={isSignup ? 'signup' : 'signin'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold mb-1">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isSignup 
                ? 'Join Droppy on your hydration journey' 
                : 'Sign in to continue your hydration goals'}
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          {/* Email Input */}
          <form onSubmit={onSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-2.5 text-base font-semibold mt-6 gap-2"
              size="lg"
            >
              {loading ? 'Loading...' : (isSignup ? 'Create account' : 'Sign in')}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Button */}
          <Button
            onClick={onGoogle}
            disabled={loading}
            variant="outline"
            className="w-full rounded-full py-2.5 text-base font-semibold gap-2"
            size="lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Toggle Auth Mode */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError(null);
                  setEmail('');
                  setPassword('');
                }}
                className="text-primary font-semibold hover:underline transition-colors"
              >
                {isSignup ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-2">
            <Droplets className="w-4 h-4 text-primary" />
            Track your daily water intake with Droppy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
