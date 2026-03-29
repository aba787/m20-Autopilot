// Theme tokens — reference CSS custom properties for consistent theming
// Usage: const t = useT()  or  import { T } from '@/lib/theme'

import { useTheme } from '@/components/ThemeProvider';

export const T = {
  bgPrimary:      'var(--bg-primary)',
  bgSecondary:    'var(--bg-secondary)',
  bgTertiary:     'var(--bg-tertiary)',
  bgElevated:     'var(--bg-elevated)',
  textPrimary:    'var(--text-primary)',
  textSecondary:  'var(--text-secondary)',
  textMuted:      'var(--text-muted)',
  textDim:        'var(--text-dim)',
  borderPrimary:  'var(--border-primary)',
  borderSubtle:   'var(--border-subtle)',
  cardBg:         'var(--card-bg)',
  cardBorder:     'var(--card-border)',
  cardShadow:     'var(--card-shadow)',
  inputBg:        'var(--input-bg)',
  inputBorder:    'var(--input-border)',
  hoverBg:        'var(--hover-bg)',
  accent:         'var(--accent)',
  accentLight:    'var(--accent-light)',
  accentBg:       'var(--accent-bg)',
  accentBgStrong: 'var(--accent-bg-strong)',
  accentBorder:   'var(--accent-border)',
  accentGlow:     'var(--accent-glow)',
  btnText:        'var(--btn-text)',
  navBg:          'var(--nav-bg)',
  error:          'var(--error)',
  errorBg:        'var(--error-bg)',
  errorBorder:    'var(--error-border)',
  success:        'var(--success)',
  successBg:      'var(--success-bg)',
  successBorder:  'var(--success-border)',
  warning:        'var(--warning)',
  warningBg:      'var(--warning-bg)',
  warningBorder:  'var(--warning-border)',
} as const;

export const CARD = {
  background: T.cardBg,
  border: `1px solid ${T.cardBorder}`,
  borderRadius: '0.875rem',
  boxShadow: T.cardShadow,
} as const;

export const INPUT: React.CSSProperties = {
  background: T.inputBg,
  border: `1px solid ${T.inputBorder}`,
  borderRadius: '0.5rem',
  color: T.textPrimary,
  padding: '0.5rem 0.75rem',
  outline: 'none',
  fontSize: '0.875rem',
  width: '100%',
};

export function useT() {
  const { dark } = useTheme();
  return { ...T, dark };
}
