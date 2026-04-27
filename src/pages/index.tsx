import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useI18n } from '@/lib/i18n';
import { landingT, type LandingLang } from '@/components/landing/landingTranslations';
import {
  IconCheck, IconCross, AmazonPartnerBadge,
  FloatingParticles, BackgroundGrid, featureIcons, aiIcons,
} from '@/components/landing/LandingIcons';


export default function Landing() {
  const { lang: appLang } = useI18n();
  const [langOverride, setLangOverride] = useState<LandingLang | null>(null);

  const lang: LandingLang = langOverride ?? (appLang === 'ar' ? 'ar' : 'en');
  const tx = landingT[lang];
  const isAr = lang === 'ar';

  const toggleLang = () => setLangOverride(lang === 'en' ? 'ar' : 'en');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>{tx.hero.metaTitle}</title>
        <meta name="description" content={tx.hero.metaDesc} />
      </Head>

      <div className="landing-page" dir={isAr ? 'rtl' : 'ltr'}>
        <header className="lp-header">
          <div className="nav-container">
            <div className="logo-area">
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                <Image src="/m20-logo.png" alt="M20 Autopilot" width={140} height={48}
                  style={{ height: 44, width: 'auto', display: 'block' }} priority />
              </Link>
              <AmazonPartnerBadge />
            </div>
            <nav className="lp-nav">
              <ul>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>{tx.nav.features}</a></li>
                <li><a href="#process" onClick={(e) => { e.preventDefault(); scrollTo('process'); }}>{tx.nav.howItWorks}</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>{tx.nav.faq}</a></li>
              </ul>
            </nav>
            <div className="nav-actions">
              <button className="lang-btn" onClick={toggleLang}>{tx.nav.langBtn}</button>
              <Link href="/login" className="login-link">{tx.nav.login}</Link>
              <Link href="/login" className="btn-primary btn-sm">{tx.nav.cta}</Link>
            </div>
          </div>
        </header>

        <main>
          <section className="hero lp-section">
            <BackgroundGrid />
            <FloatingParticles />
            <div className="container-w">
              <div className="hero-content">
                <div className="hero-text">
                  <div className="hero-badge">
                    <span className="badge-dot" />
                    {tx.hero.badge}
                  </div>
                  <h1 className="hero-title">m20 Autopilot</h1>
                  <h2 className="hero-subtitle-main">{tx.hero.subtitle}</h2>
                  <p className="hero-description">{tx.hero.desc}</p>
                  <div className="hero-buttons">
                    <Link href="/login" className="btn-primary">{tx.hero.btnPrimary}</Link>
                    <Link href="/dashboard" className="btn-secondary">{tx.hero.btnSecondary}</Link>
                  </div>
                  <div className="hero-stats">
                    <div className="stat-mini">
                      <span className="stat-value-mini">-32%</span>
                      <span className="stat-label-mini">{tx.hero.stat1Label}</span>
                    </div>
                    <div className="stat-mini">
                      <span className="stat-value-mini">+47%</span>
                      <span className="stat-label-mini">{tx.hero.stat2Label}</span>
                    </div>
                    <div className="stat-mini">
                      <span className="stat-value-mini">+$12K</span>
                      <span className="stat-label-mini">{tx.hero.stat3Label}</span>
                    </div>
                  </div>
                </div>

                <div className="hero-visual">
                  <div className="robot-visual-wrapper">
                    <Image
                      src="/robot-skull.jpeg"
                      alt="m20 Autopilot AI"
                      className="robot-image"
                      width={600}
                      height={320}
                      priority
                    />
                    <div className="robot-overlay-glow" />
                    <div className="robot-stats-floating">
                      <div className="floating-stat fs-1">
                        <span className="fs-value">-32%</span>
                        <span className="fs-label">ACOS</span>
                      </div>
                      <div className="floating-stat fs-2">
                        <span className="fs-value">+47%</span>
                        <span className="fs-label">ROAS</span>
                      </div>
                      <div className="floating-stat fs-3">
                        <span className="fs-value">89%</span>
                        <span className="fs-label">{tx.hero.optimized}</span>
                      </div>
                    </div>
                  </div>

                  <div className="hero-chart-card">
                    <div className="chart-card-header">
                      <span className="chart-card-title">{tx.hero.chartTitle}</span>
                      <span className="chart-card-period">{tx.hero.chartPeriod}</span>
                    </div>
                    <svg viewBox="0 0 380 100" preserveAspectRatio="none" className="mock-chart-svg">
                      <defs>
                        <linearGradient id="lp-area-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#00d9ff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 95 C40 80,80 85,120 55 C160 25,200 65,240 35 C280 5,320 45,360 15 L380 8 L380 100 L0 100Z" fill="url(#lp-area-gradient)" />
                      <path d="M0 95 C40 80,80 85,120 55 C160 25,200 65,240 35 C280 5,320 45,360 15 L380 8" fill="none" stroke="#00d9ff" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="120" cy="55" r="3.5" fill="#00d9ff" className="point-glow" />
                      <circle cx="240" cy="35" r="3.5" fill="#00d9ff" className="point-glow" style={{animationDelay:'1s'}} />
                      <circle cx="360" cy="15" r="3.5" fill="#00d9ff" className="point-glow" style={{animationDelay:'2s'}} />
                    </svg>
                    <div className="chart-mini-stats">
                      <div className="chart-mini-stat"><span className="cms-val positive">+47%</span><span className="cms-lbl">ROAS</span></div>
                      <div className="chart-mini-stat"><span className="cms-val">-32%</span><span className="cms-lbl">ACOS</span></div>
                      <div className="chart-mini-stat"><span className="cms-val positive">+$12K</span><span className="cms-lbl">{tx.hero.sales}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lp-section" id="features" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <div className="container-w">
              <h2 className="font-display">{tx.features.title}</h2>
              <p className="section-subtitle">{tx.features.subtitle}</p>
              <div className="icon-cards-grid">
                {tx.features.cards.map((card, i) => (
                  <div className="icon-card" key={i}>
                    <div className="icon-card-bg-gradient" />
                    <div className="icon-card-emoji">{featureIcons[i]}</div>
                    <div className="icon-card-title">{card.title}</div>
                    <div className="icon-card-desc">{card.desc}</div>
                  </div>
                ))}
              </div>
              <div className="trust-grid">
                {tx.features.trust.map((item, i) => (
                  <div className="trust-card" key={i}><div className="trust-card-text">{item}</div></div>
                ))}
              </div>
            </div>
          </section>

          <section className="lp-section" id="process">
            <div className="container-w">
              <h2 className="font-display">{tx.process.title}</h2>
              <p className="section-subtitle">{tx.process.subtitle}</p>
              <div className="process-grid">
                {tx.process.steps.map((step, i) => (
                  <div className="process-item" key={i}>
                    <div className="process-number">
                      <span>{i + 1}</span>
                      <div className="process-number-glow" />
                    </div>
                    <div className="process-title">{step.title}</div>
                    <div className="process-description">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lp-section" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <div className="container-w">
              <h2 className="font-display" style={{ textAlign: 'center' }}>{tx.comparison.title}</h2>
              <div className="split-comparison">
                <div className="comparison-half before-half">
                  <h3><IconCross /> {tx.comparison.beforeTitle}</h3>
                  <div className="comparison-items">
                    {tx.comparison.before.map((item, i) => (
                      <div className="comparison-item" key={i}>
                        <span className="comparison-icon"><IconCross /></span> {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="comparison-half after-half">
                  <h3><IconCheck /> {tx.comparison.afterTitle}</h3>
                  <div className="comparison-items">
                    {tx.comparison.after.map((item, i) => (
                      <div className="comparison-item" key={i}>
                        <span className="comparison-icon"><IconCheck /></span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lp-section">
            <div className="container-w">
              <h2 className="font-display">{tx.ai.title}</h2>
              <p className="section-subtitle">{tx.ai.subtitle}</p>
              <div className="icon-cards-grid">
                {tx.ai.cards.map((card, i) => (
                  <div className="icon-card" key={i}>
                    <div className="icon-card-bg-gradient" />
                    <div className="icon-card-emoji">{aiIcons[i]}</div>
                    <div className="icon-card-title">{card.title}</div>
                    <div className="icon-card-desc">{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lp-section" id="faq">
            <div className="container-w">
              <h2 className="font-display" style={{ textAlign: 'center' }}>{tx.faq.title}</h2>
              <div className="faq-grid">
                {tx.faq.items.map((item, i) => (
                  <div className="faq-item" key={i}>
                    <div className="faq-item-title">{item.q}</div>
                    <div className="faq-item-text">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lp-section">
            <div className="container-w">
              <div className="cta-final">
                <h2 className="font-display">{tx.cta.title}</h2>
                <p>{tx.cta.desc}</p>
                <div className="cta-buttons">
                  <Link href="/login" className="btn-primary">{tx.cta.btnPrimary}</Link>
                  <Link href="/login" className="btn-secondary">{tx.cta.btnSecondary}</Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="lp-footer">
          <div className="footer-grid">
            <div className="footer-section">
              <Image src="/m20-logo.png" alt="M20 Autopilot" width={160} height={56}
                style={{ height: 50, width: 'auto', display: 'block', marginBottom: 12 }} />
              <p className="footer-desc">{tx.footer.desc}</p>
              <AmazonPartnerBadge />
            </div>
            <div className="footer-section">
              <h4>{tx.footer.col1}</h4>
              <ul>
                <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>{tx.footer.links1[0]}</a></li>
                <li><Link href="/login">{tx.footer.links1[2]}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{tx.footer.col2}</h4>
              <ul>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>{tx.footer.links2[0]}</a></li>
                <li><a href="mailto:m20.m.devlet@gmail.com">{tx.footer.links2[1]}</a></li>
                <li><a href="mailto:m20.m.devlet@gmail.com">{tx.footer.links2[2]}</a></li>
                <li><Link href="/terms">{isAr ? 'شروط الاستخدام' : 'Terms of Service'}</Link></li>
                <li><Link href="/privacy">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{tx.footer.col3}</h4>
              <ul>
                <li><a href="mailto:m20.m.devlet@gmail.com" style={{ color: '#00d9ff', fontSize: '0.88rem', lineHeight: '2.2', fontWeight: 600 }}>m20.m.devlet@gmail.com</a></li>
                {tx.footer.links3.slice(1).map((l, i) => <li key={i}><span style={{ color: '#8a94a6', fontSize: '0.88rem', lineHeight: '2.2' }}>{l}</span></li>)}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{tx.footer.copyright}</p>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button className="lang-btn" onClick={toggleLang} style={{ fontSize: '0.75rem', padding: '5px 12px' }}>{tx.nav.langBtn}</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
