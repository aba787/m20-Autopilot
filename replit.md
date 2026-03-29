# M20 Autopilot

Amazon Advertising Optimization SaaS Dashboard — full English, LTR layout, Cyber/Dark theme.

## Tech Stack
- **Framework**: Next.js (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + inline styles (cyber design system)
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4o mini (via `OPENAI_API_KEY` env secret)
- **Port**: 5000

## Design System
- **Background**: #0a0612 (deep purple-black)
- **Card BG**: rgba(0,217,255,0.04) with rgba(0,217,255,0.12) border — glassmorphism
- **Accent**: #00d9ff (cyan) / #00f0ff (light cyan)
- **Success**: #10b981 | **Error**: #ef4444 | **Warning**: #f59e0b
- **Direction**: LTR (`dir="ltr"`) — sidebar on left, all text left-aligned
- **Fonts**: Inter (body) via Google Fonts in `_document.tsx`

## Architecture
- `src/pages/` — All page routes (Next.js Pages Router)
- `src/components/Layout.tsx` — App shell: left sidebar + header + floating AI button
- `src/components/ThemeProvider.tsx` — Dark mode context (defaults to dark)
- `src/data/mock.ts` — All English mock data (campaigns, products, alerts, news, etc.)
- `src/lib/campaignBot.ts` — Rules engine + GPT-4o mini AI analysis
- `src/pages/api/bot-analyze.ts` — API route for AI campaign analysis
- `src/styles/globals.css` — Tailwind v4 with @theme, glassmorphism utilities

## Pages (15 total)
1. `/` — Landing page (hero, features, CTA — no pricing)
2. `/login` — Sign-in (split panel: brand left, form right)
3. `/dashboard` — KPI cards, line/donut charts, alerts, product performance
4. `/campaigns` — Sortable/filterable campaigns table
5. `/products` — Products + keywords, with detail panel, blacklist action
6. `/blacklist` — Excluded products list, manual add/remove
7. `/ai-engine` — AI + rules engine analysis per campaign (GPT-4o mini)
8. `/accounting` — Revenue, costs, profit (overview/daily/by-product)
9. `/alerts` — Alert list with severity filter + read/dismiss
10. `/reports` — Daily/weekly/monthly performance + CSV export
11. `/amazon-news` — Amazon seller news feed
12. `/integration` — Amazon account connection, sync history
13. `/audit` — Full change log (AI vs manual actions)
14. `/support` — AI chat assistant with quick-reply buttons
15. `/help` — FAQ accordion with search
16. `/settings` — Account, currency, performance goals, notifications
17. `/subscriptions` — Redirects to /dashboard (subscriptions removed)

## Key Features
- Full English UI with LTR layout throughout
- Dark Cyber theme (no light mode used in practice — ThemeProvider defaults to dark)
- Responsive sidebar (collapses on mobile)
- Notification bell with unread count + mark-read
- Floating AI bot button (links to /support)
- Real AI analysis via OpenAI GPT-4o mini (rules engine + GPT hybrid)
- All mock data — no backend database needed
- Subscriptions section completely removed from navigation and landing page
