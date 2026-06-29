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
  login: (email: string, password: string) => Promise<{ error?: string; user?: User }>;
  register: (email: string, password: string, full_name?: string) => Promise<{ error?: string; user?: User }>;
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

function buildUser(raw: any): User {
  return {
    id: raw.id,
    email: raw.email,
    full_name: raw.full_name ?? null,
    bot_mode: raw.bot_mode || 'safe',
    target_acos: raw.target_acos ?? 30,
    role: raw.role ?? 'user',
  };
}

export function useAuthState(): AuthContext {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session on mount (non-blocking for the UI)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    // Listen for external auth changes (e.g. token refresh, sign out from another tab)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setToken(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    let loginRes: Response;
    try {
      loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      return { error: 'Network error. Please check your connection and try again.' };
    }

    if (loginRes.status === 423) {
      const body = await loginRes.json().catch(() => ({}));
      return { error: body.message || 'Account temporarily locked due to repeated failed attempts.' };
    }

    if (!loginRes.ok) {
      const body = await loginRes.json().catch(() => ({}));
      return { error: body.error || 'Invalid email or password' };
    }

    const sessionData = await loginRes.json();

    // Set state immediately from API response - no client-side Supabase calls needed
    setToken(sessionData.access_token);
    const profile = buildUser(sessionData.user);
    setUser(profile);

    // Store session in Supabase client fire-and-forget (for token refresh later)
    supabase.auth.setSession({
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
    }).catch(() => {});

    return { user: profile };
  }, []);

  const register = useCallback(async (email: string, password: string, full_name?: string) => {
    const emailNorm = email.toLowerCase().trim();
    let res: Response;
    let data: any = {};
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailNorm, password, full_name: full_name?.trim() ?? '' }),
      });
      const txt = await res.text();
      data = txt ? JSON.parse(txt) : {};
    } catch (err: any) {
      return { error: err?.message || 'Network error during registration. Please try again.' };
    }

    if (!res.ok) return { error: data.error || 'Registration failed' };

    if (data.directLogin && data.access_token) {
      // Set state immediately from API response - no client-side Supabase calls needed
      setToken(data.access_token);
      const profile = buildUser(data.user);
      setUser(profile);

      // Store session in Supabase client fire-and-forget (for token refresh later)
      supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }).catch(() => {});

      return { user: profile };
    }

    return { error: 'Registration failed' };
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    try { await supabase.auth.signOut(); } catch {}
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('sb-') || k.includes('supabase')) localStorage.removeItem(k);
      });
    } catch {}
    window.location.replace('/login');
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
