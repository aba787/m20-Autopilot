import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useI18n } from '@/lib/i18n';
import { landingT, type LandingLang } from '@/components/landing/landingTranslations';
import { AmazonPartnerBadge } from '@/components/landing/LandingIcons';

export default function Landing() {
  const { lang: appLang } = useI18n();
  const [langOverride, setLangOverride] = useState<LandingLang | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const lang: LandingLang = langOverride ?? (appLang === 'ar' ? 'ar' : 'en');
  const tx = landingT[lang];
  const isAr = lang === 'ar';
  const toggleLang = () => setLangOverride(lang === 'en' ? 'ar' : 'en');
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let mx = 0, my = 0, sy = 0;
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const onMouse = (e: MouseEvent) => { mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5; };
    const onScroll = () => { sy = window.scrollY; };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll', onScroll);

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.1 + 0.3, a: Math.random(), speed: Math.random() * 0.003 + 0.001,
    }));
    const rings = [
      { rx: 0, ry: 0, rz: 0, drx: 0.003, dry: 0.005, drz: 0.002, radius: 88 },
      { rx: 1, ry: 0.5, rz: 0, drx: 0.002, dry: -0.003, drz: 0.004, radius: 108 },
      { rx: 0.5, ry: 1, rz: 0.3, drx: 0.004, dry: 0.002, drz: -0.003, radius: 128 },
    ];
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grd.addColorStop(0, 'rgba(10,30,60,0.35)'); grd.addColorStop(1, 'rgba(3,7,18,0)');
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h);
      stars.forEach(s => {
        s.a += s.speed;
        ctx.beginPath(); ctx.arc(s.x + mx * 18, s.y + my * 9, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,210,255,${0.3 + Math.abs(Math.sin(s.a)) * 0.45})`; ctx.fill();
      });
      const cx = w / 2 + mx * 36, cy = h / 2 + my * 18 - sy * 0.08;
      rings.forEach(ring => {
        ring.rx += ring.drx; ring.ry += ring.dry; ring.rz += ring.drz;
        const sy2 = Math.abs(Math.sin(ring.rx)) * 0.38 + 0.14;
        ctx.beginPath(); ctx.ellipse(cx, cy, ring.radius, ring.radius * sy2, ring.rz, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(34,211,238,0.22)'; ctx.lineWidth = 1.5; ctx.stroke();
      });
      const cr = 34 + Math.sin(t * 2) * 3;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
      cg.addColorStop(0, 'rgba(94,234,255,0.88)'); cg.addColorStop(0.4, 'rgba(34,211,238,0.45)'); cg.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2); ctx.fillStyle = '#0a2a44'; ctx.fill();
      ctx.strokeStyle = 'rgba(34,211,238,0.55)'; ctx.lineWidth = 2; ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const angle = t * 0.8 + (i * Math.PI * 2) / 5;
        const pr = 52 + i * 5;
        ctx.beginPath(); ctx.arc(cx + Math.cos(angle) * pr, cy + Math.sin(angle) * pr * 0.34, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94,234,255,${0.55 + Math.sin(t + i) * 0.3})`; ctx.fill();
      }
      const gy = cy + 175 - sy * 0.04;
      ctx.strokeStyle = 'rgba(34,211,238,0.05)'; ctx.lineWidth = 1;
      for (let gx = -550; gx < 550; gx += 40) { ctx.beginPath(); ctx.moveTo(cx + gx, gy); ctx.lineTo(cx + gx, gy + 180); ctx.stroke(); }
      for (let gyo = 0; gyo < 180; gyo += 40) { ctx.beginPath(); ctx.moveTo(cx - 550, gy + gyo); ctx.lineTo(cx + 550, gy + gyo); ctx.stroke(); }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const agentLog = [
    '[PPC Agent] Scanning 248 campaigns across SA / AE / EG...',
    'OK  Raised bid on "wireless earbuds" → +14% impressions',
    'OK  Harvested 7 converting search terms → exact-match',
    'OK  Added 12 negative keywords — cut wasted PPC spend',
    'OK  Reallocated 1,275 SAR budget to ROAS 6.2x campaign',
    '[PPC Agent] ACoS 19% / TACoS 8% — optimizing...',
  ];

  const kpis = [
    { v: '248', l: isAr ? 'حملة نشطة' : 'Active Campaigns' },
    { v: '6.2x', l: isAr ? 'متوسط ROAS' : 'Avg ROAS' },
    { v: '-32%', l: isAr ? 'توفير ACOS' : 'ACOS Saved' },
    { v: '+$12K', l: isAr ? 'إيرادات إضافية' : 'Revenue Added' },
  ];

  const features = [
    { ico: '📊', t: isAr ? 'تحليل الحملات' : 'Campaign Analysis', d: isAr ? 'CTR وCPC وACoS وROAS — يحسبها النظام ويتخذ القرار' : 'CTR, CPC, ACoS, ROAS — computed and actioned automatically.' },
    { ico: '🔑', t: isAr ? 'ذكاء الكلمات' : 'Keyword Intelligence', d: isAr ? 'حصاد تلقائي وكلمات سلبية وتعديل المزايدة' : 'Auto-harvest, negative keywords, real-time bid adjustment.' },
    { ico: '🕐', t: isAr ? 'ميزانية بالساعة' : 'Hourly Budgeting', d: isAr ? 'رفع الميزانية في الساعات المربحة وتخفيضها في الخاسرة' : 'Boost budget in peak hours, cut in losing hours.' },
    { ico: '🧠', t: isAr ? 'تعلم تكيّفي' : 'Adaptive Learning', d: isAr ? 'يسجّل القرارات ويضبط العتبات كل 7 أيام' : 'Logs every decision, auto-adjusts thresholds every 7 days.' },
    { ico: '🚨', t: isAr ? 'تنبيهات ذكية' : 'Smart Alerts', d: isAr ? 'إشعار فوري عند تجاوز ACoS أو إنفاق غير مبرر' : 'Instant alerts when ACoS spikes or unjustified spend is detected.' },
    { ico: '📝', t: isAr ? 'توليد الإعلانات' : 'Ad Generation', d: isAr ? 'GPT-4o يولد عناوين وأوصاف محسّنة لأمازون' : 'GPT-4o generates optimized Amazon titles and descriptions.' },
  ];

  const plans = [
    { name: isAr ? 'مجاني' : 'Free', price: isAr ? 'مجاناً' : 'Free', period: '', popular: false,
      desc: isAr ? 'للبدء والتجربة' : 'Get started and explore',
      feats: isAr ? ['5 حملات', '100 كلمة مفتاحية', '20 استفساراً/شهر', 'تحليلات أساسية'] : ['5 campaigns', '100 keywords', '20 AI queries/mo', 'Basic analytics'] },
    { name: isAr ? 'احترافي' : 'Pro', price: '49', period: isAr ? ' ر.س/شهر' : ' SAR/mo', popular: true,
      desc: isAr ? 'للبائعين الجادين' : 'For serious sellers',
      feats: isAr ? ['50 حملة', '2,000 كلمة مفتاحية', '500 استفساراً/شهر', 'أتمتة متقدمة', 'دعم أولوية'] : ['50 campaigns', '2,000 keywords', '500 AI queries/mo', 'Advanced automation', 'Priority support'] },
    { name: isAr ? 'المؤسسات' : 'Enterprise', price: '199', period: isAr ? ' ر.س/شهر' : ' SAR/mo', popular: false,
      desc: isAr ? 'للوكالات والكبار' : 'For agencies & large sellers',
      feats: isAr ? ['غير محدود', 'API access', 'تقارير مخصصة', 'مدير حساب مخصص', 'دعم هاتفي'] : ['Unlimited everything', 'API access', 'White-label reports', 'Dedicated manager', 'Phone support'] },
  ];

  return (
    <>
      <Head>
        <title>{tx.hero.metaTitle}</title>
        <meta name="description" content={tx.hero.metaDesc} />
      </Head>

      <style>{`
        .lp{background:#030712;color:#dbeafe;font-family:'Inter','Segoe UI',system-ui,sans-serif;overflow-x:hidden;line-height:1.6;min-height:100vh;}
        #lp-cv{position:fixed;inset:0;z-index:0;pointer-events:none;}
        .lp-z{position:relative;z-index:2;}
        .lp-nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(18px);background:rgba(3,7,18,.72);border-bottom:1px solid rgba(56,189,248,.18);}
        .lp-nav-i{max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:14px 24px;}
        .lp-logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;color:#fff;text-decoration:none;}
        .lp-logo .d{width:10px;height:10px;border-radius:50%;background:#22D3EE;box-shadow:0 0 14px #5eeaff;}
        .lp-logo b{background:linear-gradient(90deg,#fff,#7dd3fc);-webkit-background-clip:text;background-clip:text;color:transparent;}
        .lp-nlinks{display:flex;gap:22px;font-size:14px;}
        .lp-nlinks a{color:#7b93b8;text-decoration:none;transition:.2s;cursor:pointer;}
        .lp-nlinks a:hover{color:#22D3EE;}
        .lp-nav-btns{display:flex;align-items:center;gap:10px;}
        .lp-ghost{padding:7px 15px;border-radius:8px;border:1px solid rgba(120,200,235,.35);color:#dceefa;font-size:13px;font-weight:600;background:transparent;cursor:pointer;text-decoration:none;transition:.2s;}
        .lp-ghost:hover{border-color:#22D3EE;color:#22D3EE;}
        .lp-primary{padding:9px 20px;border-radius:30px;background:linear-gradient(90deg,#38BDF8,#22D3EE);color:#04121f;font-weight:700;font-size:14px;text-decoration:none;border:none;cursor:pointer;transition:.2s;display:inline-block;}
        .lp-primary:hover{opacity:.9;transform:translateY(-1px);}
        .lp-langbtn{padding:7px 13px;border-radius:20px;border:1px solid rgba(56,189,248,.18);background:rgba(34,211,238,.06);color:#dbeafe;font-size:13px;font-weight:600;cursor:pointer;}
        .lp-hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center;max-width:1240px;margin:0 auto;padding:80px 24px 60px;}
        .lp-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;letter-spacing:3px;color:#22D3EE;border:1px solid rgba(56,189,248,.18);padding:7px 18px;border-radius:30px;background:rgba(34,211,238,.06);margin-bottom:18px;font-weight:700;}
        .lp-dot{width:7px;height:7px;border-radius:50%;background:#22D3EE;animation:lpPulse 2s ease-in-out infinite;}
        @keyframes lpPulse{0%,100%{opacity:.6;}50%{opacity:1;box-shadow:0 0 10px #5eeaff;}}
        .lp-h1{font-size:clamp(32px,4.5vw,60px);font-weight:800;line-height:1.14;background:linear-gradient(120deg,#fff 30%,#7dd3fc);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:10px;}
        .lp-lead{color:#7b93b8;font-size:clamp(15px,2vw,17px);margin-bottom:26px;max-width:480px;}
        .lp-cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px;}
        .lp-btn-ghost{padding:12px 24px;border-radius:30px;border:1px solid rgba(56,189,248,.18);color:#dbeafe;font-size:15px;font-weight:600;background:transparent;cursor:pointer;text-decoration:none;transition:.2s;}
        .lp-btn-ghost:hover{border-color:#22D3EE;color:#22D3EE;}
        .lp-pills{display:flex;gap:9px;flex-wrap:wrap;}
        .lp-pill{padding:5px 13px;border-radius:30px;border:1px solid rgba(56,189,248,.18);background:rgba(34,211,238,.05);font-size:12.5px;color:#cdeafe;}
        .lp-dash{background:linear-gradient(160deg,rgba(15,25,45,.95),rgba(9,14,26,.97));border:1px solid rgba(120,200,235,.18);border-radius:16px;box-shadow:0 30px 80px -20px rgba(0,0,0,.7);overflow:hidden;}
        .lp-dash-hdr{display:flex;align-items:center;gap:7px;padding:11px 15px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.2);}
        .lp-dash-dot{width:10px;height:10px;border-radius:50%;}
        .lp-dash-ttl{font-size:11px;color:rgba(200,220,255,.45);font-weight:600;margin-left:auto;font-family:monospace;}
        .lp-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06);}
        .lp-kpi{padding:13px 14px;text-align:center;}
        .lp-kpi-v{font-size:19px;font-weight:800;color:#22D3EE;display:block;}
        .lp-kpi-l{font-size:11px;color:#7b93b8;margin-top:2px;display:block;}
        .lp-log{padding:14px 16px;font-family:'Courier New',monospace;font-size:12px;line-height:2;min-height:150px;direction:ltr;}
        .lp-ln{color:#7dd3fc;opacity:0;animation:lpFI .4s forwards;}
        .lp-ln.ok{color:#34d399;}
        @keyframes lpFI{to{opacity:1;}}
        .lp-sec{padding:90px 24px;}
        .lp-sec-i{max-width:1160px;margin:0 auto;}
        .lp-sec-h{text-align:center;margin-bottom:48px;}
        .lp-sec-h h2{font-size:clamp(24px,4vw,42px);font-weight:700;background:linear-gradient(120deg,#fff 30%,#7dd3fc);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:10px;}
        .lp-sec-h p{color:#7b93b8;font-size:15px;max-width:560px;margin:0 auto;}
        .lp-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;}
        .lp-card{background:rgba(14,24,48,.45);border:1px solid rgba(56,189,248,.18);border-radius:16px;padding:24px;backdrop-filter:blur(10px);position:relative;overflow:hidden;transition:.2s;}
        .lp-card:hover{transform:translateY(-4px);border-color:rgba(34,211,238,.35);}
        .lp-card::before{content:"";position:absolute;top:0;right:0;width:90px;height:90px;background:radial-gradient(circle at top right,rgba(34,211,238,.09),transparent 70%);pointer-events:none;}
        .lp-card .ic{font-size:26px;margin-bottom:12px;}
        .lp-card h3{font-size:16px;font-weight:700;color:#e0f2fe;margin-bottom:6px;}
        .lp-card p{font-size:13.5px;color:#b8cce8;line-height:1.7;}
        .lp-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;}
        .lp-step{display:flex;gap:14px;align-items:flex-start;padding:18px;border:1px solid rgba(56,189,248,.18);border-radius:14px;background:rgba(56,189,248,.03);}
        .lp-step-n{flex:none;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-weight:800;background:linear-gradient(135deg,#38BDF8,#22D3EE);color:#04121f;font-size:15px;}
        .lp-step h3{font-size:15px;font-weight:600;color:#e0f2fe;margin-bottom:4px;}
        .lp-step p{font-size:13px;color:#b8cce8;}
        .lp-globe-sec{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center;}
        .lp-globe-box{height:340px;border-radius:18px;border:1px solid rgba(56,189,248,.18);background:rgba(14,24,48,.4);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;}
        .lp-globe-info h3{font-size:12px;letter-spacing:2px;color:#22D3EE;text-transform:uppercase;font-weight:700;margin-bottom:12px;}
        .lp-globe-info h2{font-size:clamp(22px,3vw,36px);font-weight:700;color:#f0f9ff;margin-bottom:14px;}
        .lp-globe-info p{color:#b8cce8;margin-bottom:18px;line-height:1.8;font-size:15px;}
        .lp-markets{display:flex;flex-wrap:wrap;gap:8px;}
        .lp-market{padding:5px 13px;border-radius:30px;border:1px solid rgba(56,189,248,.18);background:rgba(34,211,238,.06);font-size:13px;color:#cdeafe;font-weight:600;}
        .lp-plans{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        .lp-plan{background:rgba(14,24,48,.45);border:1px solid rgba(56,189,248,.18);border-radius:18px;padding:26px;backdrop-filter:blur(10px);position:relative;}
        .lp-plan.pop{border-color:rgba(34,211,238,.5);box-shadow:0 0 40px rgba(34,211,238,.1);}
        .lp-plan-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);padding:4px 16px;border-radius:30px;background:linear-gradient(90deg,#38BDF8,#22D3EE);color:#04121f;font-size:12px;font-weight:800;white-space:nowrap;}
        .lp-plan h3{font-size:16px;font-weight:700;color:#e0f2fe;margin-bottom:5px;}
        .lp-plan-price{font-size:34px;font-weight:800;color:#fff;}
        .lp-plan-price span{font-size:14px;color:#7b93b8;font-weight:400;}
        .lp-plan-desc{font-size:13px;color:#7b93b8;margin:8px 0 16px;}
        .lp-plan-feats{list-style:none;padding:0;margin:0 0 22px;display:grid;gap:7px;}
        .lp-plan-feats li{font-size:13.5px;color:#b8cce8;display:flex;gap:7px;align-items:flex-start;}
        .lp-plan-feats li::before{content:"◆";color:#22D3EE;font-size:10px;margin-top:4px;flex-shrink:0;}
        .lp-plan-cta{width:100%;padding:12px;border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;transition:.2s;text-decoration:none;display:block;text-align:center;box-sizing:border-box;}
        .lp-plan-cta.f{background:linear-gradient(90deg,#38BDF8,#22D3EE);color:#04121f;border:none;}
        .lp-plan-cta.f:hover{opacity:.9;transform:translateY(-2px);}
        .lp-plan-cta.o{background:transparent;border:1px solid rgba(56,189,248,.18);color:#dbeafe;}
        .lp-plan-cta.o:hover{border-color:#22D3EE;color:#22D3EE;}
        .lp-faq-item{padding:18px 22px;border:1px solid rgba(56,189,248,.18);border-radius:14px;background:rgba(56,189,248,.03);margin-bottom:12px;}
        .lp-faq-item h3{font-size:15px;font-weight:600;color:#e0f2fe;margin-bottom:7px;}
        .lp-faq-item p{font-size:14px;color:#b8cce8;line-height:1.7;}
        .lp-cta-box{text-align:center;padding:72px 24px;background:linear-gradient(135deg,rgba(34,211,238,.06),rgba(56,189,248,.02));border:1px solid rgba(56,189,248,.18);border-radius:22px;}
        .lp-cta-box h2{font-size:clamp(24px,4vw,40px);font-weight:700;color:#f0f9ff;margin-bottom:12px;}
        .lp-cta-box p{color:#7b93b8;margin-bottom:26px;font-size:16px;}
        .lp-cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        .lp-footer{border-top:1px solid rgba(56,189,248,.18);background:rgba(3,7,18,.7);padding:48px 24px 26px;}
        .lp-footer-i{max-width:1160px;margin:0 auto;}
        .lp-footer-g{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:28px;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,.07);}
        .lp-footer-g h4{font-size:13px;font-weight:700;color:#e0f2fe;margin-bottom:12px;}
        .lp-footer-g ul{list-style:none;padding:0;margin:0;display:grid;gap:7px;}
        .lp-footer-g ul li a,.lp-footer-g ul li{font-size:13.5px;color:#7b93b8;text-decoration:none;cursor:pointer;transition:.2s;}
        .lp-footer-g ul li a:hover{color:#22D3EE;}
        .lp-footer-b{display:flex;align-items:center;justify-content:space-between;padding-top:22px;font-size:13px;color:#7b93b8;flex-wrap:wrap;gap:10px;}
        [dir="rtl"] .lp-lead{max-width:none;}
        [dir="rtl"] .lp-pills,[dir="rtl"] .lp-cta-row{justify-content:flex-end;}
        [dir="rtl"] .lp-dash-ttl{margin-left:0;margin-right:auto;}
        @media(max-width:900px){
          .lp-hero{grid-template-columns:1fr;min-height:auto;padding:80px 24px 40px;}
          .lp-globe-sec{grid-template-columns:1fr;}
          .lp-plans{grid-template-columns:1fr;}
          .lp-footer-g{grid-template-columns:1fr 1fr;}
          .lp-nlinks{display:none;}
        }
        @media(max-width:580px){.lp-footer-g{grid-template-columns:1fr;}.lp-kpis{grid-template-columns:repeat(2,1fr);}}
      `}</style>

      <div className="lp" dir={isAr ? 'rtl' : 'ltr'}>
        <canvas id="lp-cv" ref={canvasRef} />

        <div className="lp-z">
          <nav className="lp-nav">
            <div className="lp-nav-i">
              <a href="/" className="lp-logo">
                <span className="d" /><b>M20 <span style={{ color: '#22D3EE' }}>Autopilot</span></b>
              </a>
              <div className="lp-nlinks">
                <a onClick={() => scrollTo('features')}>{tx.nav.features}</a>
                <a onClick={() => scrollTo('process')}>{tx.nav.howItWorks}</a>
                <a onClick={() => scrollTo('pricing')}>{isAr ? 'الأسعار' : 'Pricing'}</a>
                <a onClick={() => scrollTo('faq')}>{tx.nav.faq}</a>
              </div>
              <div className="lp-nav-btns">
                <button className="lp-langbtn" onClick={toggleLang}>{tx.nav.langBtn}</button>
                <Link href="/login" className="lp-ghost">{tx.nav.login}</Link>
                <Link href="/login" className="lp-primary">{tx.nav.cta}</Link>
              </div>
            </div>
          </nav>

          <section style={{ padding: 0 }}>
            <div className="lp-hero">
              <div>
                <div className="lp-eyebrow"><span className="lp-dot" />{tx.hero.badge}</div>
                <h1 className="lp-h1">
                  {isAr ? 'أتمتة إعلانات أمازون' : 'AI-Powered Amazon'}
                  <br />{isAr ? 'بالذكاء الاصطناعي' : 'PPC Management'}
                </h1>
                <p className="lp-lead">{tx.hero.desc}</p>
                <div className="lp-cta-row">
                  <Link href="/login" className="lp-primary" style={{ padding: '13px 26px', fontSize: 15 }}>{tx.hero.btnPrimary}</Link>
                  <Link href="/dashboard" className="lp-btn-ghost" style={{ padding: '13px 26px', fontSize: 15 }}>{tx.hero.btnSecondary}</Link>
                </div>
                <div className="lp-pills">
                  {[
                    isAr ? '✓ بدون بطاقة ائتمان' : '✓ No credit card',
                    isAr ? '✓ إلغاء في أي وقت' : '✓ Cancel anytime',
                    isAr ? '✓ إعداد في دقيقتين' : '✓ 2-min setup',
                  ].map((p, i) => <span key={i} className="lp-pill">{p}</span>)}
                </div>
              </div>

              <div>
                <div className="lp-dash">
                  <div className="lp-dash-hdr">
                    <span className="lp-dash-dot" style={{ background: '#ff5f57' }} />
                    <span className="lp-dash-dot" style={{ background: '#ffbd2e' }} />
                    <span className="lp-dash-dot" style={{ background: '#28c840' }} />
                    <span className="lp-dash-ttl">M20 Autopilot — PPC Dashboard</span>
                  </div>
                  <div className="lp-kpis">
                    {kpis.map((k, i) => (
                      <div key={i} className="lp-kpi">
                        <span className="lp-kpi-v">{k.v}</span>
                        <span className="lp-kpi-l">{k.l}</span>
                      </div>
                    ))}
                  </div>
                  <div className="lp-log">
                    {agentLog.map((line, i) => (
                      <div key={i} className={`lp-ln${line.startsWith('OK') ? ' ok' : ''}`} style={{ animationDelay: `${i * 0.45}s` }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lp-sec" id="features" style={{ background: 'rgba(255,255,255,.01)' }}>
            <div className="lp-sec-i">
              <div className="lp-sec-h"><h2>{tx.features.title}</h2><p>{tx.features.subtitle}</p></div>
              <div className="lp-cards">
                {features.map((f, i) => (
                  <div key={i} className="lp-card">
                    <div className="ic">{f.ico}</div><h3>{f.t}</h3><p>{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lp-sec" id="process">
            <div className="lp-sec-i">
              <div className="lp-sec-h"><h2>{tx.process.title}</h2><p>{tx.process.subtitle}</p></div>
              <div className="lp-steps">
                {tx.process.steps.map((step, i) => (
                  <div key={i} className="lp-step">
                    <div className="lp-step-n">{i + 1}</div>
                    <div><h3>{step.title}</h3><p>{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lp-sec" style={{ background: 'rgba(255,255,255,.01)' }}>
            <div className="lp-sec-i">
              <div className="lp-globe-sec">
                <div className="lp-globe-info">
                  <h3>{isAr ? 'شبكة عالمية' : 'GLOBAL NETWORK'}</h3>
                  <h2>{isAr ? 'يعمل في جميع أسواق أمازون الخليجية' : 'Covers All Gulf Amazon Markets'}</h2>
                  <p>{isAr ? 'يتصل M20 Autopilot مباشرةً بأسواق أمازون في السعودية والإمارات ومصر والكويت والبحرين وقطر والأردن، مع مزامنة فورية للبيانات.' : 'M20 Autopilot connects directly to Amazon marketplaces across Saudi Arabia, UAE, Egypt, Kuwait, Bahrain, Qatar, and Jordan — with real-time data sync.'}</p>
                  <div className="lp-markets">
                    {['🇸🇦 SA', '🇦🇪 AE', '🇪🇬 EG', '🇰🇼 KW', '🇧🇭 BH', '🇶🇦 QA', '🇯🇴 JO'].map(m => (
                      <span key={m} className="lp-market">{m}</span>
                    ))}
                  </div>
                </div>
                <div className="lp-globe-box">
                  <div style={{ fontSize: 68, animation: 'lpPulse 3s ease-in-out infinite' }}>🌐</div>
                  <p style={{ color: '#22D3EE', fontWeight: 700 }}>7 {isAr ? 'أسواق نشطة' : 'Active Markets'}</p>
                  <p style={{ color: '#7b93b8', fontSize: 13 }}>{isAr ? 'مزامنة فورية للبيانات' : 'Real-time data sync'}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="lp-sec" id="pricing">
            <div className="lp-sec-i">
              <div className="lp-sec-h">
                <h2>{isAr ? 'خطط بسيطة وشفافة' : 'Simple, Transparent Pricing'}</h2>
                <p>{isAr ? 'ابدأ مجاناً، وقم بالترقية عندما تكون مستعداً' : "Start free, upgrade when you're ready"}</p>
              </div>
              <div className="lp-plans">
                {plans.map((plan, i) => (
                  <div key={i} className={`lp-plan${plan.popular ? ' pop' : ''}`}>
                    {plan.popular && <div className="lp-plan-badge">{isAr ? 'الأكثر شيوعاً' : 'Most Popular'}</div>}
                    <h3>{plan.name}</h3>
                    <div className="lp-plan-price">{plan.price}<span>{plan.period}</span></div>
                    <p className="lp-plan-desc">{plan.desc}</p>
                    <ul className="lp-plan-feats">{plan.feats.map((f, fi) => <li key={fi}>{f}</li>)}</ul>
                    <Link href="/login" className={`lp-plan-cta ${plan.popular ? 'f' : 'o'}`}>
                      {isAr ? (i === 0 ? 'ابدأ مجاناً' : 'الترقية الآن') : (i === 0 ? 'Get Started Free' : 'Upgrade Now')}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lp-sec" id="faq">
            <div className="lp-sec-i">
              <div className="lp-sec-h"><h2>{tx.faq.title}</h2></div>
              <div style={{ maxWidth: 740, margin: '0 auto' }}>
                {tx.faq.items.map((item, i) => (
                  <div key={i} className="lp-faq-item"><h3>{item.q}</h3><p>{item.a}</p></div>
                ))}
              </div>
            </div>
          </section>

          <section className="lp-sec">
            <div className="lp-sec-i">
              <div className="lp-cta-box">
                <h2>{tx.cta.title}</h2>
                <p>{tx.cta.desc}</p>
                <div className="lp-cta-btns">
                  <Link href="/login" className="lp-primary" style={{ padding: '14px 30px', fontSize: 16 }}>{tx.cta.btnPrimary}</Link>
                  <Link href="/login" className="lp-btn-ghost" style={{ padding: '14px 30px', fontSize: 16 }}>{tx.cta.btnSecondary}</Link>
                </div>
              </div>
            </div>
          </section>

          <footer className="lp-footer">
            <div className="lp-footer-i">
              <div className="lp-footer-g">
                <div>
                  <div className="lp-logo" style={{ marginBottom: 12 }}>
                    <span className="d" /><b>M20 <span style={{ color: '#22D3EE' }}>Autopilot</span></b>
                  </div>
                  <p style={{ fontSize: 13.5, color: '#7b93b8', marginBottom: 14 }}>{tx.footer.desc}</p>
                  <AmazonPartnerBadge />
                </div>
                <div>
                  <h4>{tx.footer.col1}</h4>
                  <ul>
                    <li><a onClick={() => scrollTo('features')}>{tx.footer.links1[0]}</a></li>
                    <li><a onClick={() => scrollTo('pricing')}>{isAr ? 'الأسعار' : 'Pricing'}</a></li>
                    <li><Link href="/login">{tx.footer.links1[2]}</Link></li>
                  </ul>
                </div>
                <div>
                  <h4>{tx.footer.col2}</h4>
                  <ul>
                    <li><a onClick={() => scrollTo('faq')}>{tx.footer.links2[0]}</a></li>
                    <li><a href="mailto:support@m20autopilot.com">{tx.footer.links2[1]}</a></li>
                    <li><Link href="/terms">{isAr ? 'شروط الاستخدام' : 'Terms of Service'}</Link></li>
                    <li><Link href="/privacy">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
                  </ul>
                </div>
                <div>
                  <h4>{tx.footer.col3}</h4>
                  <ul>
                    <li><a href="mailto:support@m20autopilot.com" style={{ color: '#22D3EE', fontWeight: 600 }}>support@m20autopilot.com</a></li>
                    {tx.footer.links3.slice(1).map((l, i) => <li key={i}><span>{l}</span></li>)}
                  </ul>
                </div>
              </div>
              <div className="lp-footer-b">
                <p>{tx.footer.copyright}</p>
                <button className="lp-langbtn" onClick={toggleLang} style={{ fontSize: 12, padding: '5px 11px' }}>{tx.nav.langBtn}</button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
