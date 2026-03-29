# M20 Autopilot

Amazon Advertising Optimization SaaS Dashboard — full English, LTR layout, Cyber/Dark theme.

## Tech Stack
- **Framework**: Next.js (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + inline styles (cyber design system)
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4o mini (via `OPENAI_API_KEY`)
- **Database**: Supabase PostgreSQL (`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`)
- **Auth**: JWT (via `SESSION_SECRET`) stored in HTTP-only cookies + localStorage
- **Port**: 5000

## Design System
- **Background**: #0a0612 (deep purple-black)
- **Card BG**: rgba(0,217,255,0.04) with rgba(0,217,255,0.12) border — glassmorphism
- **Accent**: #00d9ff (cyan)
- **Direction**: LTR (`dir="ltr"`) — sidebar on left

## Architecture
- `src/pages/` — All page routes (Next.js Pages Router)
- `src/components/Layout.tsx` — App shell: left sidebar + header + floating AI button; uses real auth
- `src/components/ThemeProvider.tsx` — Dark mode context
- `src/data/mock.ts` — Fallback mock data (pages still work without DB entries)
- `src/lib/campaignBot.ts` — Rules engine + GPT-4o mini (CAMPAIGN_BOT_PROMPT, MASTER_SYSTEM_PROMPT)
- `src/lib/supabaseAdmin.ts` — Untyped Supabase admin client (used in all API routes)
- `src/lib/auth.ts` — JWT sign/verify, requireAuth(), logAction(), createNotification()
- `src/lib/useAuth.ts` — React auth context + useAuth() hook + authFetch() helper
- `src/pages/api/` — All backend routes (see list below)
- `supabase/schema.sql` — Full DB schema to run in Supabase SQL Editor

## Database Schema (Supabase)
Run `supabase/schema.sql` in Supabase SQL Editor to create all tables:
- **profiles** — users, password_hash, bot_mode, target_acos
- **amazon_connections** — per-user Amazon API tokens (access/refresh)
- **campaigns** — campaign metrics per day (user_id FK)
- **keywords** — keyword bids/performance (user_id FK)
- **action_logs** — all AI + user actions with status (pending/approved/rejected/executed/failed)
- **notifications** — per-user alerts (info/warning/error/success)
- **ad_generations** — saved Ad Generator outputs
- **accounting_snapshots** — daily revenue/spend/profit snapshots
- **job_runs** — background job execution history

## API Routes
- `POST /api/auth/register` — Create account (email, password, full_name)
- `POST /api/auth/login` — Sign in
- `POST /api/auth/logout` — Clear cookie
- `GET  /api/auth/me` — Validate token, return user profile
- `GET  /api/campaigns` — List campaigns (auth required, supports ?from=&to=&status=)
- `POST /api/campaigns` — Create campaign
- `GET/PATCH /api/campaigns/[id]` — Get or update single campaign
- `GET  /api/dashboard/stats` — KPIs with period comparison, chart data, pending actions
- `GET  /api/accounting` — Revenue/spend/profit snapshots with totals
- `POST /api/accounting` — Upsert daily snapshot
- `GET  /api/notifications` — List notifications + unread count
- `POST /api/notifications/[id]/read` — Mark single or "all" as read
- `GET  /api/action-logs` — Full audit log with campaign names
- `POST /api/action-logs/[id]/approve` — Approve or reject pending AI action
- `GET/POST /api/amazon-connection` — Amazon account connections
- `GET/PATCH /api/settings` — User profile (bot_mode, target_acos, full_name)
- `POST /api/ad-generator` — Generate ad content via GPT-4o mini, saves to DB if auth'd
- `POST /api/support-chat` — AI customer support (strict platform-only scope)
- `POST /api/bot-analyze` — Campaign analysis (rule engine + GPT)
- `POST /api/jobs/optimize-campaigns` — Background job (X-Job-Secret header required)
- `POST /api/jobs/optimize-keywords` — Background job (X-Job-Secret header required)

## Bot Modes (per user in profiles.bot_mode)
- **safe** — AI suggests only, no auto-execution (rule engine only, no GPT cost)
- **semi** — AI generates suggestion, status=pending, user must approve in audit log
- **auto** — AI executes immediately (status=executed)

## Pages (16 total)
1. `/` — Landing page
2. `/login` — Sign in + Create Account (tab toggle, real auth)
3. `/dashboard` — KPIs, charts, alerts
4. `/campaigns` — Sortable campaigns table
5. `/products` — Products + keywords
6. `/blacklist` — Excluded products
7. `/ai-engine` — AI + rules analysis (GPT-4o mini)
8. `/ads-generator` — Ad content generator (keywords, headlines, description, targeting)
9. `/accounting` — Revenue/cost/profit
10. `/alerts` — Alert list
11. `/reports` — Performance reports
12. `/amazon-news` — Seller news
13. `/integration` — Amazon account connection
14. `/audit` — Full change log
15. `/support` — AI chat assistant (real GPT, strict scope)
16. `/help` — FAQ
17. `/settings` — Account settings (bot mode, ACOS target)

## Setup Required
1. Run `supabase/schema.sql` in Supabase SQL Editor
2. Set secrets: SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
3. Set env var: NEXT_PUBLIC_SUPABASE_URL
4. Register an account at /login → will create a profile row in Supabase
