export const IconDashboard = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <rect x="10" y="30" width="10" height="20" rx="3" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.2)" />
    <rect x="25" y="15" width="10" height="35" rx="3" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.2)" />
    <rect x="40" y="25" width="10" height="25" rx="3" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.2)" />
    <path d="M5 50H55" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconLightning = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <path d="M35 10L15 35H30L25 50L45 25H30L35 10Z" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.2)" strokeLinejoin="round" />
  </svg>
);

export const IconBell = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <path d="M30 10C22.268 10 16 16.268 16 24V36L12 42H48L44 36V24C44 16.268 37.732 10 30 10Z" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.1)" strokeLinejoin="round" />
    <path d="M25 46C25 48.7614 27.2386 51 30 51C32.7614 51 35 48.7614 35 46" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" />
    <circle cx="30" cy="10" r="3" fill="#00d9ff" />
  </svg>
);

export const IconTarget = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <circle cx="30" cy="30" r="22" stroke="#00d9ff" strokeWidth="2" strokeDasharray="6 6" />
    <circle cx="30" cy="30" r="14" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.1)" />
    <circle cx="30" cy="30" r="4" fill="#00d9ff" />
    <path d="M30 4V10M30 50V56M4 30H10M50 30H56" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconEye = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <path d="M30 20C18 20 8 30 8 30C8 30 18 40 30 40C42 40 52 30 52 30C52 30 42 20 30 20Z" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.1)" strokeLinejoin="round" />
    <circle cx="30" cy="30" r="6" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.3)" />
    <circle cx="30" cy="30" r="2" fill="#00d9ff" />
  </svg>
);

export const IconTrend = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <path d="M8 48L22 34L32 44L52 18" stroke="#00d9ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 18H52V30" stroke="#00d9ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="trend-grad" x1="30" y1="18" x2="30" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00d9ff" /><stop offset="1" stopColor="#00d9ff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M8 48L22 34L32 44L52 18V50H8V48Z" fill="url(#trend-grad)" opacity="0.3" />
  </svg>
);

export const IconSearch = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <circle cx="26" cy="26" r="14" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.1)" />
    <path d="M37 37L48 48" stroke="#00d9ff" strokeWidth="3" strokeLinecap="round" />
    <circle cx="26" cy="26" r="6" stroke="#00d9ff" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

export const IconWarning = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <path d="M30 10L10 46H50L30 10Z" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.1)" strokeLinejoin="round" />
    <path d="M30 24V34" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" />
    <circle cx="30" cy="40" r="1.5" fill="#00d9ff" />
  </svg>
);

export const IconAccounting = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-icon">
    <rect x="10" y="8" width="40" height="44" rx="4" stroke="#00d9ff" strokeWidth="2" fill="rgba(0,217,255,0.05)" />
    <path d="M20 20H40M20 28H40M20 36H32" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" />
    <circle cx="40" cy="42" r="8" fill="rgba(0,217,255,0.2)" stroke="#00d9ff" strokeWidth="2" />
    <path d="M37 42H43M40 39V45" stroke="#00d9ff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="status-icon">
    <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="rgba(16,185,129,0.15)" />
    <path d="M8 12.5L11 15.5L16 9.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCross = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="status-icon">
    <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="rgba(239,68,68,0.15)" />
    <path d="M9 9L15 15M15 9L9 15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const AmazonPartnerBadge = () => (
  <div className="amazon-partner-badge">
    <svg viewBox="0 0 24 24" fill="none" className="amazon-icon" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="rgba(255,153,0,0.15)" stroke="#FF9900" strokeWidth="1.5"/>
      <path d="M7 13.5C9.5 15.5 14.5 15.5 17 13.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15.5 12L17 13.5L15.5 15" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div className="amazon-badge-text">
      <span className="amazon-badge-title">Amazon Ads</span>
      <span className="amazon-badge-sub">Advanced Partner</span>
    </div>
  </div>
);

export const FloatingParticles = () => (
  <div className="particles-container">
    {[...Array(15)].map((_, i) => (
      <div key={i} className={`particle p-${i}`} />
    ))}
  </div>
);

export const BackgroundGrid = () => <div className="bg-grid" />;

export const featureIcons = [
  <IconDashboard key="d" />, <IconLightning key="l" />, <IconBell key="b" />,
  <IconTarget key="t" />, <IconEye key="e" />, <IconTrend key="tr" />, <IconAccounting key="a" />,
];

export const aiIcons = [
  <IconTarget key="t" />, <IconSearch key="s" />, <IconTrend key="tr" />, <IconWarning key="w" />, <IconAccounting key="a" />,
];
