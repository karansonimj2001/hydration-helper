import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
interface User {
  id: string;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signInWithProvider: (provider: 'google') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) {
          const u = data.user;
          setUser(u ? { id: u.id, email: u.email } : null);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUser(u ? { id: u.id, email: u.email } : null);
      setLoading(false);
    });

    // On native, listen for deep link callbacks and let Supabase process the URL
    let appUrlListener: any | null = null;
    const isNative =
      typeof window !== "undefined" &&
      (window as any).Capacitor &&
      typeof (window as any).Capacitor.isNativePlatform === "function" &&
      (window as any).Capacitor.isNativePlatform();

    if (isNative) {
      (async () => {
        try {
          const { App: CapacitorApp } = await import("@capacitor/app");
          appUrlListener = CapacitorApp.addListener("appUrlOpen", async () => {
            await supabase.auth.getSessionFromUrl({ storeSession: true });
          });
        } catch (err) {
          console.warn("Native listener failed", err);
        }
      })();
    }

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
      if (appUrlListener && typeof appUrlListener.remove === 'function') {
        appUrlListener.remove();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        const { data } = await supabase.auth.getUser();
        const u = data.user;
        setUser(u ? { id: u.id, email: u.email } : null);
        navigate('/');
      }
      return !error;
    } catch (e) {
      return false;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (!error) {
        // Try to fetch user (may not exist until email confirmation). If present, set and navigate.
        try {
          const { data } = await supabase.auth.getUser();
          const u = data.user;
          setUser(u ? { id: u.id, email: u.email } : null);
        } catch (e) {
          // ignore
        }
        navigate('/');
      }
      return !error;
    } catch (e) {
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ✅ FIXED GOOGLE LOGIN
  const signInWithProvider = async (provider: 'google') => {
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.() === true;
    const redirectTo = isNative
      ? 'com.karansonimj.hydrationhelper://auth-callback'
      : window.location.origin;

    // For web, this will redirect the browser. For native, request the provider URL
    // then open it in the Capacitor Browser so the OAuth flow can return via deep link.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo }
    });

    // Log the provider URL and any error so we can verify the redirect parameter
    console.log('oauth url:', (data as any)?.url, 'error:', error);

    if (isNative) {
      const url = (data as any)?.url;
      if (url) {
        try {
          const { Browser } = await import('@capacitor/browser');
          await Browser.open({ url });
        } catch (err) {
          console.warn('failed to open capacitor browser', err);
          // fallback: open in window
          window.open(url, '_blank');
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, signInWithProvider }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return null;
  return children;
};

export default AuthContext;