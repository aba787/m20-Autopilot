import { useState, useEffect, useCallback, createContext, useContext } from 'react';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  bot_mode: 'safe' | 'semi' | 'auto';
  target_acos: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthActions {
  login:  (email: string, password: string)                         => Promise<{ error?: string }>;
  register: (email: string, password: string, full_name?: string)  => Promise<{ error?: string }>;
  logout: ()                                                        => Promise<void>;
  updateUser: (updates: Partial<User>)                             => void;
}

export type AuthContext = AuthState & AuthActions;

// ── Context (created externally in _app.tsx) ──────────────────────────────────
import { createContext as rc } from 'react';
export const AuthCtx = rc<AuthContext | null>(null);

export function useAuth(): AuthContext {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ── Hook implementation used in AuthProvider ──────────────────────────────────
export function useAuthState(): AuthContext {
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('m20_token') : null;
    if (stored) {
      setToken(stored);
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${stored}` } })
        .then(r => r.json())
        .then(d => { if (d.user) setUser(d.user); else { localStorage.removeItem('m20_token'); setToken(null); } })
        .catch(() => { localStorage.removeItem('m20_token'); setToken(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res  = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'Login failed' };
    localStorage.setItem('m20_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return {};
  }, []);

  const register = useCallback(async (email: string, password: string, full_name?: string) => {
    const res  = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'Registration failed' };
    localStorage.setItem('m20_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return {};
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('m20_token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return { user, token, loading, login, register, logout, updateUser };
}

// ── Authenticated fetch helper ────────────────────────────────────────────────
export function authFetch(token: string | null) {
  return (url: string, opts: RequestInit = {}) =>
    fetch(url, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers ?? {}),
      },
    });
}
