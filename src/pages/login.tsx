import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, Eye, EyeOff, Moon, Sun, Bot, TrendingUp, Shield, BarChart3, AlertCircle, ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabaseClient';

const FEATURES = [
  { icon: BarChart3,  text: 'Daily AI-powered analysis'     },
  { icon: TrendingUp, text: 'Keyword recommendations'        },
  { icon: Bot,        text: 'Integrated accounting system'   },
  { icon: Shield,     text: 'Smart product blacklisting'     },
];

type Tab = 'login' | 'register' | 'forgot' | 'otp' | 'reset';

export default function Login() {
  const [tab,             setTab]             = useState<Tab>('login');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken,      setResetToken]      = useState('');
  const [name,            setName]            = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState('');

  const [otpDigits,   setOtpDigits]   = useState(['', '', '', '', '', '']);
  const [otpType,     setOtpType]     = useState<'signup' | 'recovery'>('recovery');
  const [otpUserId,   setOtpUserId]   = useState('');
  const [otpEmail,    setOtpEmail]    = useState('');
  const [otpResendAt, setOtpResendAt] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const { dark, toggle } = useTheme();
  const { login, register } = useAuth();

  useEffect(() => {
    if (router.query.reset === 'true' && router.query.token) {
      setResetToken(router.query.token as string);
      setTab('reset');
    }
  }, [router.query]);

  const goToOtp = (type: 'signup' | 'recovery', userId: string, emailVal: string) => {
    setOtpType(type);
    setOtpUserId(userId);
    setOtpEmail(emailVal);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpResendAt(Date.now() + 60000);
    setError('');
    setSuccess('');
    setTab('otp');
  };

  const handleOtpInput = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[i] = digit;
    setOtpDigits(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtpDigits(text.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length !== 6) { setError('Please enter the full 6-digit code'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          otpType === 'signup'
            ? { otp, userId: otpUserId, type: otpType }
            : { otp, email: otpEmail, type: otpType }
        ),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid code'); return; }

      if (otpType === 'signup') {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: otpEmail,
          password,
        });
        if (signInError || !signInData.session) {
          setSuccess('Email verified! Please sign in.');
          setTab('login');
          setEmail(otpEmail);
          return;
        }
        await fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${signInData.session.access_token}` },
        }).catch(() => {});
        router.push('/dashboard');
      } else {
        setResetToken(data.token);
        setPassword('');
        setConfirmPassword('');
        setSuccess('');
        setTab('reset');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (Date.now() < otpResendAt) return;
    setLoading(true);
    setError('');
    try {
      if (otpType === 'signup') {
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: otpEmail, userId: otpUserId }),
        });
      } else {
        await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: otpEmail }),
        });
      }
      setOtpResendAt(Date.now() + 60000);
      setSuccess('A new code has been sent');
      setOtpDigits(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (tab === 'reset') {
      if (!password || password.length < 8) { setError('Password must be at least 8 characters'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match'); return; }
      setLoading(true);
      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: resetToken, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');
        setSuccess('Password updated successfully! You can now sign in.');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => { setTab('login'); setSuccess(''); }, 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (tab === 'forgot') {
      if (!emailTrimmed || !emailRegex.test(emailTrimmed)) { setError('Please enter a valid email address'); return; }
      setLoading(true);
      try {
        await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailTrimmed }),
        });
        goToOtp('recovery', '', emailTrimmed);
      } catch {
        goToOtp('recovery', '', emailTrimmed);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (tab === 'register' && !name.trim()) { setError('Full name is required'); return; }
    if (!emailTrimmed) { setError('Email is required'); return; }
    if (!emailRegex.test(emailTrimmed)) { setError('Invalid email format'); return; }
    if (!password) { setError('Password is required'); return; }
    if (tab === 'register' && password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      if (tab === 'login') {
        const result = await login(emailTrimmed, password);
        if (result.requiresOtp && result.userId) {
          goToOtp('signup', result.userId, result.email || emailTrimmed);
        } else if (result.error) {
          setError(result.error);
        } else {
          router.push(result.user?.role === 'admin' ? '/admin' : '/dashboard');
        }
      } else {
        const result = await register(emailTrimmed, password, name.trim());
        if (result.error) { setError(result.error); }
        else if (result.requiresOtp && result.userId) {
          goToOtp('signup', result.userId, result.email || emailTrimmed);
        } else if (result.user) {
          router.push(result.user.role === 'admin' ? '/admin' : '/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '0.5rem',
    color: 'var(--text-secondary)',
    padding: '0.625rem 0.75rem',
    outline: 'none',
    fontSize: '0.875rem',
  };

  return (
    <div className="min-h-screen flex" dir="ltr">

      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-14 relative overflow-hidden"
        style={{ background: 'var(--bg-tertiary)', borderRight: '1px solid var(--border-primary)' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, var(--border-subtle) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', boxShadow: 'var(--accent-glow)' }}>
              <Zap className="w-5 h-5" style={{ color: 'var(--btn-text)' }} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>M20 Autopilot</h1>
              <p className="text-xs" style={{ color: 'var(--accent)' }}>Amazon Ad Automation</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 leading-snug" style={{ color: 'var(--text-primary)' }}>
            Transform Your Ads<br />with AI
          </h2>
          <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
            An intelligent platform to optimize Amazon advertising and grow sales while reducing ACOS.
          </p>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-bg-strong)' }}>
                  <f.icon className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-6">
            {[{ v: '500+', l: 'Sellers' }, { v: '-32%', l: 'ACOS' }, { v: '5.2x', l: 'ROAS' }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{s.v}</p>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative" style={{ background: 'var(--bg-primary)' }}>

        <button onClick={toggle}
          className="absolute top-4 right-4 p-2 rounded-lg"
          style={{ color: 'var(--text-muted)', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
              <Zap className="w-4 h-4" style={{ color: 'var(--btn-text)' }} />
            </div>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>M20 Autopilot</span>
          </div>

          {tab === 'otp' ? (
            <form onSubmit={handleOtpSubmit}>
              <button type="button"
                onClick={() => { setTab(otpType === 'signup' ? 'register' : 'forgot'); setError(''); setSuccess(''); }}
                className="flex items-center gap-1 text-sm mb-6" style={{ color: 'var(--accent)' }}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-bg-strong)' }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {otpType === 'signup' ? 'Verify your email' : 'Enter reset code'}
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {otpType === 'signup' ? 'Account verification' : 'Password reset'}
                  </p>
                </div>
              </div>

              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                We sent a 6-digit code to <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{otpEmail}</span>. Enter it below.
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <div className="flex justify-center gap-2 mb-6">
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpInput(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className="w-11 h-14 text-center text-xl font-bold rounded-xl transition-all"
                    style={{
                      background: 'var(--input-bg)',
                      border: `2px solid ${d ? 'var(--accent)' : 'var(--input-border)'}`,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                ))}
              </div>

              <button type="submit" disabled={loading || otpDigits.join('').length !== 6}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mb-4"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                  color: 'var(--btn-text)',
                  boxShadow: 'var(--accent-glow)',
                  opacity: (loading || otpDigits.join('').length !== 6) ? 0.7 : 1,
                }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Verifying...</>
                  : 'Verify Code'}
              </button>

              <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Didn&apos;t receive the code?{' '}
                <button type="button" onClick={handleResendOtp}
                  disabled={loading || Date.now() < otpResendAt}
                  className="font-semibold"
                  style={{ color: Date.now() < otpResendAt ? 'var(--text-dim)' : 'var(--accent)' }}>
                  Resend code
                </button>
              </p>
            </form>
          ) : tab === 'reset' ? (
            <>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--accent-bg-strong)' }}>
                  <Lock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Set new password</h1>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enter your new password below</p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>New Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      required minLength={8} placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: '2.5rem' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }}>
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Minimum 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
                  <input type={showPass ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required minLength={8} placeholder="••••••••" style={inputStyle} />
                </div>
                <button type="submit" disabled={loading || !password || !confirmPassword}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                    color: 'var(--btn-text)',
                    boxShadow: 'var(--accent-glow)',
                    opacity: (loading || !password || !confirmPassword) ? 0.7 : 1,
                  }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Updating...</>
                    : 'Update Password'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
                <button onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                  className="font-semibold" style={{ color: 'var(--accent)' }}>
                  Back to Sign In
                </button>
              </p>
            </>
          ) : tab === 'forgot' ? (
            <>
              <button onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                className="flex items-center gap-1 text-sm mb-4" style={{ color: 'var(--accent)' }}>
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Reset password</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Enter your email and we&apos;ll send you a 6-digit reset code
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="you@example.com" style={inputStyle} />
                </div>
                <button type="submit" disabled={loading || !email}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                    color: 'var(--btn-text)',
                    boxShadow: 'var(--accent-glow)',
                    opacity: (loading || !email) ? 0.7 : 1,
                  }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Sending...</>
                    : 'Send Reset Code'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
                <button onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                  className="font-semibold" style={{ color: 'var(--accent)' }}>
                  Back to Sign In
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="flex rounded-xl overflow-hidden mb-6" style={{ border: '1px solid var(--input-border)' }}>
                {(['login', 'register'] as const).map(t => (
                  <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                    className="flex-1 py-2.5 text-sm font-semibold transition-all capitalize"
                    style={tab === t
                      ? { background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', color: 'var(--btn-text)' }
                      : { color: 'var(--text-muted)', background: 'transparent' }}>
                    {t === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {tab === 'login' ? 'Welcome back' : 'Get started free'}
              </h1>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                {tab === 'login' ? 'Enter your credentials to access your account' : '14-day free trial · No credit card required'}
              </p>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'register' && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Ahmed M." style={inputStyle} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="you@example.com" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      required minLength={8} placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: '2.5rem' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }}>
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {tab === 'register' && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Minimum 8 characters</p>
                  )}
                </div>

                {tab === 'login' && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-muted)' }}>
                      <input type="checkbox" className="rounded" style={{ accentColor: 'var(--accent)' }} /> Remember me
                    </label>
                    <button type="button" onClick={() => { setTab('forgot'); setError(''); setSuccess(''); }}
                      className="text-sm" style={{ color: 'var(--accent)' }}>Forgot password?</button>
                  </div>
                )}

                <button type="submit" disabled={loading || !email || !password}
                  className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                    color: 'var(--btn-text)',
                    boxShadow: 'var(--accent-glow)',
                    opacity: (loading || !email || !password) ? 0.7 : 1,
                  }}>
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> {tab === 'login' ? 'Signing in...' : 'Creating account...'}</>
                    : tab === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
                  className="font-semibold" style={{ color: 'var(--accent)' }}>
                  {tab === 'login' ? 'Start free trial' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
