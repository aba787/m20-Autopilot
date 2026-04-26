import { useState, useEffect, useCallback, useContext } from 'react';
import { createContext as rc } from 'react';
import { supabase } from './supabaseClient';

async function getFreshToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  bot_mode: 'safe' | 'semi' | 'auto';
  target_acos: number;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ error?: string; user?: User; requiresOtp?: boolean; userId?: string; email?: string }>;
  register: (email: string, password: string, full_name?: string) => Promise<{ error?: string; user?: User; requiresOtp?: boolean; userId?: string; email?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export type AuthContext = AuthState & AuthActions;

export const AuthCtx = rc<AuthContext | null>(null);

export function useAuth(): AuthContext {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name ?? null,
    bot_mode: data.bot_mode || 'safe',
    target_acos: data.target_acos ?? 30,
    role: data.role ?? 'user',
  } as User;
}

export function useAuthState(): AuthContext {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setToken(session.access_token);
        const profile = await fetchProfile(session.user.id);
        if (profile) setUser(profile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setToken(session.access_token);
          const profile = await fetchProfile(session.user.id);
          if (profile) setUser(profile);
        } else {
          setToken(null);
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      fetch('/api/auth/login-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, success: false, failure_reason: error.message }),
      }).catch(() => {});

      if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('credentials')) {
        const checkRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase().trim(), password, _checkUnconfirmed: true }),
        });
        const checkData = await checkRes.json();
        if (checkData.requiresOtp && checkData.userId) {
          return { requiresOtp: true, userId: checkData.userId, email: email.toLowerCase().trim() };
        }
      }

      return { error: error.message };
    }

    const authUser = data.user;
    setToken(data.session.access_token);

    fetch('/api/auth/login-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, success: true }),
    }).catch(() => {});

    const profile = await fetchProfile(authUser.id);
    if (profile) {
      setUser(profile);
      return { user: profile };
    }

    return { error: 'Profile not found' };
  }, []);

  const register = useCallback(async (email: string, password: string, full_name?: string) => {
    const emailNorm = email.toLowerCase().trim();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailNorm, password, full_name: full_name?.trim() ?? '' }),
    });
    const data = await res.json();

    if (!res.ok) return { error: data.error || 'Registration failed' };

    if (data.requiresOtp && data.userId) {
      return { requiresOtp: true, userId: data.userId, email: emailNorm };
    }

    return { error: 'Registration failed' };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return { user, token, loading, login, register, logout, updateUser };
}

export function authFetch(token: string | null) {
  return async (url: string, opts: RequestInit = {}) => {
    const freshToken = await getFreshToken();
    const activeToken = freshToken ?? token;
    return fetch(url, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        ...(opts.headers ?? {}),
      },
    });
  };
}
