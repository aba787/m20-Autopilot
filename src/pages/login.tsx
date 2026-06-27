import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabaseClient';
import Head from 'next/head';

type Tab = 'login' | 'register' | 'forgot' | 'otp' | 'reset';

const T = {
  en: {
    sub: 'Amazon Ad Automation',
    tabSignin: 'Sign In', tabSignup: 'Create Account',
    wcIn: 'Welcome back', wcsIn: 'Enter your credentials to access your account',
    wcUp: 'Create your account', wcsUp: 'Start your free trial — no credit card required',
    email: 'Email', emailPh: 'you@example.com',
    pass: 'Password', passPh: 'Enter password',
    name: 'Full name', namePh: 'Ahmed M.',
    remember: 'Remember me', forgot: 'Forgot password?',
    btnIn: 'Sign In', btnUp: 'Create Account',
    footIn: "Don't have an account?", footInLink: 'Start free trial',
    footUp: 'Already have an account?', footUpLink: 'Sign in',
    langBtn: 'العربية',
    forgotTitle: 'Reset password', forgotSub: "Enter your email and we'll send you a verification code",
    sendCode: 'Send Reset Code', sending: 'Sending...',
    backToLogin: 'Back to Sign In',
    otpTitle: 'Verify your email', otpTitleReset: 'Enter reset code',
    otpSub: 'We sent a verification code to', otpSubEnd: '. Enter it below.',
    verify: 'Verify Code', verifying: 'Verifying...',
    resend: 'Resend code', noCode: "Didn't receive the code?",
    resetTitle: 'Set new password', resetSub: 'Enter your new password below',
    newPass: 'New Password', confirmPass: 'Confirm Password',
    update: 'Update Password', updating: 'Updating...',
    minChars: 'Minimum 12 characters',
    agree: 'I agree to the <a href="/terms" class="__lnk">Terms</a> and <a href="/privacy" class="__lnk">Privacy Policy</a>',
  },
  ar: {
    sub: 'أتمتة إعلانات أمازون',
    tabSignin: 'تسجيل الدخول', tabSignup: 'إنشاء حساب',
    wcIn: 'مرحباً بعودتك', wcsIn: 'أدخل بياناتك للوصول إلى حسابك',
    wcUp: 'أنشئ حسابك', wcsUp: 'ابدأ تجربتك المجانية — بدون بطاقة ائتمان',
    email: 'البريد الإلكتروني', emailPh: 'you@example.com',
    pass: 'كلمة المرور', passPh: 'أدخل كلمة المرور',
    name: 'الاسم الكامل', namePh: 'أحمد م.',
    remember: 'تذكّرني', forgot: 'نسيت كلمة المرور؟',
    btnIn: 'تسجيل الدخول', btnUp: 'إنشاء حساب',
    footIn: 'ليس لديك حساب؟', footInLink: 'ابدأ تجربة مجانية',
    footUp: 'لديك حساب بالفعل؟', footUpLink: 'تسجيل الدخول',
    langBtn: 'English',
    forgotTitle: 'إعادة تعيين كلمة المرور', forgotSub: 'أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق',
    sendCode: 'إرسال رمز إعادة التعيين', sending: 'جارٍ الإرسال...',
    backToLogin: 'العودة لتسجيل الدخول',
    otpTitle: 'تحقق من بريدك الإلكتروني', otpTitleReset: 'أدخل رمز إعادة التعيين',
    otpSub: 'أرسلنا رمز التحقق إلى', otpSubEnd: '. أدخله أدناه.',
    verify: 'تحقق من الرمز', verifying: 'جارٍ التحقق...',
    resend: 'إعادة إرسال الرمز', noCode: 'لم تستلم الرمز؟',
    resetTitle: 'تعيين كلمة مرور جديدة', resetSub: 'أدخل كلمة مرورك الجديدة أدناه',
    newPass: 'كلمة المرور الجديدة', confirmPass: 'تأكيد كلمة المرور',
    update: 'تحديث كلمة المرور', updating: 'جارٍ التحديث...',
    minChars: 'الحد الأدنى 12 حرفاً',
    agree: 'أوافق على <a href="/terms" class="__lnk">الشروط</a> و<a href="/privacy" class="__lnk">سياسة الخصوصية</a>',
  },
};

export default function Login() {
  const [tab,             setTab]             = useState<Tab>('login');
  const [lang,            setLang]            = useState<'en' | 'ar'>('en');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name,            setName]            = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState('');
  const [agreed,          setAgreed]          = useState(false);

  const [otpDigits,   setOtpDigits]   = useState(['', '', '', '', '', '', '', '']);
  const [otpType,     setOtpType]     = useState<'signup' | 'recovery'>('recovery');
  const [otpEmail,    setOtpEmail]    = useState('');
  const [otpResendAt, setOtpResendAt] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router  = useRouter();
  const { login, register } = useAuth();
  const tx = T[lang];
  const isAr = lang === 'ar';

  useEffect(() => {
    if (router.query.reset === 'true' && router.query.token) setTab('reset');
  }, [router.query]);

  const goToOtp = (type: 'signup' | 'recovery', userId: string, emailVal: string) => {
    setOtpType(type); setOtpEmail(emailVal);
    setOtpDigits(['', '', '', '', '', '', '', '']);
    setOtpResendAt(Date.now() + 60000);
    setError(''); setSuccess(''); setTab('otp');
  };

  const handleOtpInput = (i: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits]; next[i] = digit; setOtpDigits(next);
    if (digit && i < 7) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (text.length >= 6) {
      const arr = text.split('').concat(['', '', '', '', '', '', '', '']).slice(0, 8);
      setOtpDigits(arr); otpRefs.current[Math.min(text.length, 7)]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length < 6) { setError('Please enter the complete verification code'); return; }
    setLoading(true); setError('');
    try {
      const primaryType  = otpType === 'signup' ? 'signup' : 'email';
      const fallbackType = otpType === 'signup' ? 'email'  : 'signup';
      let verifyData: any = null; let verifyError: any = null;
      const r1 = await supabase.auth.verifyOtp({ email: otpEmail, token: otp, type: primaryType as any });
      if (r1.data?.session) { verifyData = r1.data; }
      else {
        const r2 = await supabase.auth.verifyOtp({ email: otpEmail, token: otp, type: fallbackType as any });
        if (r2.data?.session) { verifyData = r2.data; } else { verifyError = r1.error || r2.error; }
      }
      if (!verifyData?.session) { setError(verifyError?.message || 'Invalid or expired code.'); return; }
      if (otpType === 'signup') {
        fetch('/api/email/welcome', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${verifyData.session.access_token}` } }).catch(() => {});
        router.push('/dashboard');
      } else { setPassword(''); setConfirmPassword(''); setSuccess(''); setTab('reset'); }
    } finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    if (Date.now() < otpResendAt) return;
    setLoading(true); setError('');
    try {
      const { error: otpErr } = await supabase.auth.signInWithOtp({ email: otpEmail });
      if (otpErr) { setError(otpErr.message); return; }
      setOtpResendAt(Date.now() + 60000);
      setSuccess('A new code has been sent');
      setOtpDigits(['', '', '', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess('');
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (tab === 'reset') {
      if (!password || password.length < 12) { setError('Password must be at least 12 characters'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match'); return; }
      setLoading(true);
      try {
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw new Error(updateError.message);
        await supabase.auth.signOut();
        setSuccess('Password updated successfully! Please sign in.');
        setPassword(''); setConfirmPassword('');
        setTimeout(() => { setTab('login'); setSuccess(''); }, 3000);
      } catch (err: any) { setError(err.message || 'Failed to reset password'); }
      finally { setLoading(false); }
      return;
    }
    if (tab === 'forgot') {
      if (!emailTrimmed || !emailRegex.test(emailTrimmed)) { setError('Please enter a valid email address'); return; }
      setLoading(true);
      try {
        const { error: otpErr } = await supabase.auth.signInWithOtp({ email: emailTrimmed });
        if (otpErr) { setError(otpErr.message); return; }
        goToOtp('recovery', '', emailTrimmed);
      } catch { goToOtp('recovery', '', emailTrimmed); }
      finally { setLoading(false); }
      return;
    }
    if (tab === 'register' && !name.trim()) { setError('Full name is required'); return; }
    if (!emailTrimmed) { setError('Email is required'); return; }
    if (!emailRegex.test(emailTrimmed)) { setError('Invalid email format'); return; }
    if (!password) { setError('Password is required'); return; }
    if (tab === 'register' && password.length < 12) { setError('Password must be at least 12 characters'); return; }

    setLoading(true);
    try {
      if (tab === 'login') {
        const result = await login(emailTrimmed, password);
        if (result.requiresOtp && result.userId) {
          await supabase.auth.signInWithOtp({ email: result.email || emailTrimmed });
          goToOtp('signup', result.userId, result.email || emailTrimmed);
        } else if (result.error) { setError(result.error); }
        else { router.push(result.user?.role === 'admin' ? '/admin' : '/dashboard'); }
      } else {
        const result = await register(emailTrimmed, password, name.trim());
        if (result.error) { setError(result.error); }
        else if (result.requiresOtp && result.userId) { goToOtp('signup', result.userId, result.email || emailTrimmed); }
        else if (result.user) { router.push(result.user.role === 'admin' ? '/admin' : '/dashboard'); }
      }
    } finally { setLoading(false); }
  };

  const switchTab = (t: 'login' | 'register') => { setTab(t); setError(''); setSuccess(''); };

  return (
    <>
      <Head><title>Sign In — M20 Autopilot</title></Head>
      <style>{`
        .__signin{font-family:'Inter','Segoe UI',system-ui,sans-serif;min-height:100vh;color:#eef4fb;background:#05080f;overflow-x:hidden;}
        .__bg-fallback{position:fixed;inset:0;z-index:0;background:url('https://i.ibb.co/p6Qhh95X/Whats-App-Image-2026-06-26-at-10-53-02-PM.jpg') center/cover no-repeat;background-color:#05080f;}
        #__comets{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;}
        .__comet{position:absolute;width:160px;height:2px;background:linear-gradient(90deg,rgba(180,235,255,0) 0%,rgba(180,235,255,.22) 55%,rgba(220,245,255,.85) 92%,#fff 100%);border-radius:50%;filter:drop-shadow(0 0 6px rgba(150,225,255,.65));opacity:0;}
        .__comet::after{content:"";position:absolute;right:-3px;top:50%;transform:translateY(-50%);width:6px;height:6px;border-radius:50%;background:radial-gradient(circle,#fff 0%,#bdecff 45%,rgba(150,220,255,0) 75%);box-shadow:0 0 12px 3px rgba(160,225,255,.8);}
        @keyframes __shoot{0%{opacity:0;transform:rotate(38deg) translateX(-80px) scale(.85);}6%{opacity:1;}78%{opacity:1;}100%{opacity:0;transform:rotate(38deg) translateX(900px) scale(1.05);}}
        .__comet.__c1{top:4%;left:14%;width:175px;animation:__shoot 30s linear infinite;animation-delay:2s;}
        .__comet.__c2{top:2%;left:46%;width:150px;animation:__shoot 30s linear infinite;animation-delay:12s;}
        .__comet.__c3{top:6%;left:30%;width:200px;animation:__shoot 30s linear infinite;animation-delay:22s;}
        @media(prefers-reduced-motion:reduce){.__comet{animation:none!important;opacity:0!important;}}
        .__tint{position:fixed;inset:0;z-index:1;background:linear-gradient(160deg,rgba(3,10,25,.62) 0%,rgba(5,14,35,.70) 50%,rgba(2,8,20,.58) 100%);}
        .__center{position:relative;z-index:2;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px;}
        .__glass{width:100%;max-width:440px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:28px;padding:44px 40px;backdrop-filter:blur(26px) saturate(140%);-webkit-backdrop-filter:blur(26px) saturate(140%);box-shadow:0 40px 90px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.25),inset 0 -1px 0 rgba(255,255,255,.05);}
        .__brand{display:flex;flex-direction:column;align-items:center;gap:14px;margin-bottom:26px;}
        .__logo{width:58px;height:58px;border-radius:16px;background:linear-gradient(135deg,#22d3ee,#06b6d4);display:flex;align-items:center;justify-content:center;box-shadow:0 10px 34px rgba(34,211,238,.45);}
        .__bn{font-size:21px;font-weight:700;}
        .__bs{font-size:12.5px;color:#22d3ee;font-weight:600;letter-spacing:.3px;}
        .__tabs{display:flex;background:rgba(255,255,255,.08);border-radius:14px;padding:5px;margin-bottom:26px;border:1px solid rgba(255,255,255,.08);}
        .__tab{flex:1;text-align:center;padding:11px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;color:#aebccf;border:none;background:none;transition:.25s;}
        .__tab.__act{background:linear-gradient(135deg,#22d3ee,#06b6d4);color:#04222b;box-shadow:0 6px 20px rgba(34,211,238,.4);}
        .__wc{font-size:25px;font-weight:800;text-align:center;margin-bottom:7px;}
        .__wcs{color:#aebccf;font-size:14px;text-align:center;margin-bottom:28px;}
        .__fld{margin-bottom:18px;}
        .__fld label{display:block;font-size:13px;font-weight:600;margin-bottom:9px;}
        .__iw{position:relative;}
        .__iw input{width:100%;padding:14px 16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:12px;color:#eef4fb;font-size:14px;transition:.2s;box-sizing:border-box;}
        .__iw input::placeholder{color:rgba(255,255,255,.45);}
        .__iw input:focus{outline:none;border-color:#22d3ee;background:rgba(34,211,238,.1);box-shadow:0 0 0 3px rgba(34,211,238,.18);}
        .__iw input:-webkit-autofill,.__iw input:-webkit-autofill:hover,.__iw input:-webkit-autofill:focus{-webkit-text-fill-color:#eef4fb!important;transition:background-color 9999s ease-in-out 0s!important;-webkit-box-shadow:0 0 0 1000px rgba(255,255,255,.10) inset!important;}
        .__eye{position:absolute;right:14px;top:50%;transform:translateY(-50%);cursor:pointer;color:#aebccf;background:none;border:none;display:flex;align-items:center;}
        .__row{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
        .__rm{display:flex;align-items:center;gap:9px;font-size:13px;color:#aebccf;cursor:pointer;}
        .__rm input{width:16px;height:16px;accent-color:#22d3ee;}
        .__fp{font-size:13px;color:#22d3ee;font-weight:600;background:none;border:none;cursor:pointer;}
        .__btn{width:100%;padding:15px;border:none;border-radius:12px;cursor:pointer;background:linear-gradient(135deg,#22d3ee,#06b6d4);color:#04222b;font-size:15px;font-weight:700;box-shadow:0 12px 34px rgba(34,211,238,.45);transition:.25s;}
        .__btn:hover{transform:translateY(-2px);box-shadow:0 16px 44px rgba(34,211,238,.6);}
        .__btn:disabled{opacity:.65;cursor:not-allowed;transform:none;}
        .__foot{text-align:center;margin-top:22px;font-size:14px;color:#aebccf;}
        .__foot button{color:#22d3ee;font-weight:700;background:none;border:none;cursor:pointer;font-size:14px;}
        .__lang{position:fixed;top:24px;left:30px;z-index:6;padding:9px 16px;border-radius:12px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);color:#eef4fb;font-size:14px;font-weight:600;cursor:pointer;backdrop-filter:blur(10px);}
        .__err{display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:12px;margin-bottom:16px;font-size:13px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#fca5a5;}
        .__suc{display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:12px;margin-bottom:16px;font-size:13px;background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);color:#6ee7b7;}
        .__otp-row{display:flex;justify-content:center;gap:8px;margin-bottom:24px;}
        .__otp-row input{width:44px;height:56px;text-align:center;font-size:20px;font-weight:700;background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.14);border-radius:12px;color:#eef4fb;outline:none;transition:.2s;}
        .__otp-row input:focus{border-color:#22d3ee;background:rgba(34,211,238,.1);}
        .__agree{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:#aebccf;margin-bottom:18px;}
        .__agree input{width:16px;height:16px;accent-color:#22d3ee;margin-top:2px;flex-shrink:0;}
        .__lnk{color:#22d3ee!important;font-weight:600;text-decoration:none;}
        [dir="rtl"] .__eye{right:auto;left:14px;}
        [dir="rtl"] .__lang{left:auto;right:30px;}
        [dir="rtl"] .__fld label,[dir="rtl"] .__wc,[dir="rtl"] .__wcs{text-align:right;}
        [dir="rtl"] .__row{flex-direction:row-reverse;}
        @keyframes __spin{to{transform:rotate(360deg)}}
        @media(max-width:480px){.__glass{padding:32px 22px;}}
      `}</style>

      <div className="__signin" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="__bg-fallback" />
        <div id="__comets">
          <div className="__comet __c1" /><div className="__comet __c2" /><div className="__comet __c3" />
        </div>
        <div className="__tint" />

        <button className="__lang" onClick={() => setLang(isAr ? 'en' : 'ar')}>{tx.langBtn}</button>

        <div className="__center">
          <div className="__glass">
            <div className="__brand">
              <div className="__logo">
                <svg viewBox="0 0 24 24" fill="#04222b" width="30" height="30">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="__bn">M20 Autopilot</div>
                <div className="__bs">{tx.sub}</div>
              </div>
            </div>

            {tab === 'otp' ? (
              <form onSubmit={handleOtpSubmit}>
                <button type="button" onClick={() => { setTab(otpType === 'signup' ? 'register' : 'forgot'); setError(''); setSuccess(''); }}
                  style={{ display:'flex', alignItems:'center', gap:6, color:'#22d3ee', background:'none', border:'none', cursor:'pointer', fontSize:14, marginBottom:20 }}>
                  <ArrowLeft size={16} /> {tx.backToLogin}
                </button>
                <div className="__wc">{otpType === 'signup' ? tx.otpTitle : tx.otpTitleReset}</div>
                <div className="__wcs">{tx.otpSub} <strong>{otpEmail}</strong>{tx.otpSubEnd}</div>
                {error && <div className="__err"><AlertCircle size={15} />{error}</div>}
                {success && <div className="__suc"><Mail size={15} />{success}</div>}
                <div className="__otp-row">
                  {otpDigits.map((d, i) => (
                    <input key={i} ref={el => { otpRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={d}
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      style={d ? { borderColor: '#22d3ee' } : {}} />
                  ))}
                </div>
                <button type="submit" className="__btn" disabled={loading || otpDigits.join('').length < 6}>
                  {loading ? <Spinner label={tx.verifying} /> : tx.verify}
                </button>
                <div className="__foot" style={{ marginTop: 16 }}>
                  {tx.noCode}{' '}
                  <button type="button" onClick={handleResendOtp} disabled={loading || Date.now() < otpResendAt}
                    style={{ color: Date.now() < otpResendAt ? 'rgba(174,188,207,.5)' : '#22d3ee', background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:14 }}>
                    {tx.resend}
                  </button>
                </div>
              </form>

            ) : tab === 'reset' ? (
              <>
                <button onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                  style={{ display:'flex', alignItems:'center', gap:6, color:'#22d3ee', background:'none', border:'none', cursor:'pointer', fontSize:14, marginBottom:20 }}>
                  <ArrowLeft size={16} /> {tx.backToLogin}
                </button>
                <div className="__wc" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                  <ShieldCheck size={24} color="#22d3ee" /> {tx.resetTitle}
                </div>
                <div className="__wcs">{tx.resetSub}</div>
                {error && <div className="__err"><AlertCircle size={15} />{error}</div>}
                {success && <div className="__suc"><Mail size={15} />{success}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="__fld">
                    <label>{tx.newPass}</label>
                    <div className="__iw">
                      <input type={showPass ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                        style={{ paddingRight: isAr ? 16 : 46, paddingLeft: isAr ? 46 : 16 }} />
                      <button type="button" className="__eye" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p style={{ fontSize:12, color:'rgba(174,188,207,.7)', marginTop:6 }}>{tx.minChars}</p>
                  </div>
                  <div className="__fld">
                    <label>{tx.confirmPass}</label>
                    <div className="__iw">
                      <input type={showPass ? 'text' : 'password'} value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                  </div>
                  <button type="submit" className="__btn" disabled={loading || !password || !confirmPassword}>
                    {loading ? <Spinner label={tx.updating} /> : tx.update}
                  </button>
                </form>
              </>

            ) : tab === 'forgot' ? (
              <>
                <button onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                  style={{ display:'flex', alignItems:'center', gap:6, color:'#22d3ee', background:'none', border:'none', cursor:'pointer', fontSize:14, marginBottom:20 }}>
                  <ArrowLeft size={16} /> {tx.backToLogin}
                </button>
                <div className="__wc" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                  <Lock size={22} color="#22d3ee" /> {tx.forgotTitle}
                </div>
                <div className="__wcs">{tx.forgotSub}</div>
                {error && <div className="__err"><AlertCircle size={15} />{error}</div>}
                {success && <div className="__suc"><Mail size={15} />{success}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="__fld">
                    <label>{tx.email}</label>
                    <div className="__iw">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder={tx.emailPh} required />
                    </div>
                  </div>
                  <button type="submit" className="__btn" disabled={loading || !email}>
                    {loading ? <Spinner label={tx.sending} /> : tx.sendCode}
                  </button>
                </form>
                <div className="__foot">
                  <button onClick={() => { setTab('login'); setError(''); setSuccess(''); }}>{tx.backToLogin}</button>
                </div>
              </>

            ) : (
              <>
                <div className="__tabs">
                  <button className={`__tab${tab === 'login' ? ' __act' : ''}`} onClick={() => switchTab('login')}>{tx.tabSignin}</button>
                  <button className={`__tab${tab === 'register' ? ' __act' : ''}`} onClick={() => switchTab('register')}>{tx.tabSignup}</button>
                </div>
                <div className="__wc">{tab === 'login' ? tx.wcIn : tx.wcUp}</div>
                <div className="__wcs">{tab === 'login' ? tx.wcsIn : tx.wcsUp}</div>
                {error && <div className="__err"><AlertCircle size={15} />{error}</div>}
                {success && <div className="__suc"><Mail size={15} />{success}</div>}
                <form onSubmit={handleSubmit}>
                  {tab === 'register' && (
                    <div className="__fld">
                      <label>{tx.name}</label>
                      <div className="__iw">
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={tx.namePh} />
                      </div>
                    </div>
                  )}
                  <div className="__fld">
                    <label>{tx.email}</label>
                    <div className="__iw">
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder={tx.emailPh} required />
                    </div>
                  </div>
                  <div className="__fld">
                    <label>{tx.pass}</label>
                    <div className="__iw">
                      <input type={showPass ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)} placeholder={tx.passPh} required
                        style={{ paddingRight: isAr ? 16 : 46, paddingLeft: isAr ? 46 : 16 }} />
                      <button type="button" className="__eye" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  {tab === 'login' && (
                    <div className="__row">
                      <label className="__rm"><input type="checkbox" />{tx.remember}</label>
                      <button type="button" className="__fp"
                        onClick={() => { setTab('forgot'); setError(''); setSuccess(''); }}>{tx.forgot}</button>
                    </div>
                  )}
                  {tab === 'register' && (
                    <div className="__agree">
                      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                      <span dangerouslySetInnerHTML={{ __html: tx.agree }} />
                    </div>
                  )}
                  <button type="submit" className="__btn" disabled={loading || (tab === 'register' && !agreed)}>
                    {loading ? <Spinner label={isAr ? 'جارٍ...' : 'Loading...'} /> : (tab === 'login' ? tx.btnIn : tx.btnUp)}
                  </button>
                </form>
                <div className="__foot">
                  {tab === 'login' ? tx.footIn : tx.footUp}{' '}
                  <button onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}>
                    {tab === 'login' ? tx.footInLink : tx.footUpLink}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
      <span style={{ width:15, height:15, border:'2px solid rgba(4,34,43,.3)', borderTopColor:'#04222b', borderRadius:'50%', display:'inline-block', animation:'__spin .7s linear infinite' }} />
      {label}
    </span>
  );
}
