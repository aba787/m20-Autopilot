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
- **Auth**: Supabase Auth (client-side `signInWithPassword` / `signUp` / `signOut`)
- **Port**: 5000

## Auth System (Supabase Auth)
- **Client-side**: `src/lib/supabaseClient.ts` — browser Supabase client using `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Login**: `supabase.auth.signInWithPassword({ email, password })` — handled in `useAuth` hook
- **Register**: `supabase.auth.signUp({ email, password })` — creates auth.users entry + profiles row
- **Logout**: `supabase.auth.signOut()`
- **Session**: Supabase manages tokens automatically, stored via `useAuth` hook
- **Server-side verification**: `requireAuth()` in `src/lib/auth.ts` uses `adminDb.auth.getUser(token)` to verify Supabase JWT
- **Profile fetch**: After auth, role fetched from `profiles` table: `supabase.from('profiles').select('role').eq('id', user.id).single()`
- **Role redirect**: Admin → `/admin`, User → `/dashboard`
- **Auto profile creation**: Trigger `on_auth_user_created` on `auth.users` auto-creates profiles row on signup

## Design System (CSS Custom Properties Theme)
- **Theme Toggle**: Dark (default) / Light mode via `.light` class on `<html>`; persisted to localStorage
- **All colors**: Defined as CSS custom properties in `src/styles/globals.css` (`:root` = dark, `.light` = overrides)
- **Dark mode**: `--bg-primary: #0a0612`, `--accent: #00d9ff`, `--card-bg: rgba(0,217,255,0.04)`
- **Light mode**: `--bg-primary: #f8fafc`, `--accent: #0891b2`, `--card-bg: #ffffff`
- **Inline styles**: Use `var(--token)` (e.g. `background: 'var(--card-bg)'`); no hardcoded hex in pages
- **CARD constant**: `{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' }`
- **Direction**: LTR (`dir="ltr"`) — sidebar on left

## Architecture
- `src/pages/` — All page routes (Next.js Pages Router)
- `src/components/Layout.tsx` — App shell: left sidebar + header + floating AI button; uses real auth
- `src/components/ThemeProvider.tsx` — Dark mode context
- `src/data/mock.ts` — Fallback mock data (pages still work without DB entries)
- `src/lib/campaignBot.ts` — Rules engine + GPT-4o mini (CAMPAIGN_BOT_PROMPT, MASTER_SYSTEM_PROMPT)
- `src/lib/supabaseAdmin.ts` — Untyped Supabase admin client (used in all API routes)
- `src/lib/supabaseClient.ts` — Client-side Supabase client (used for auth in browser)
- `src/lib/auth.ts` — requireAuth() (Supabase JWT verify), requireAdmin(), logAction(), createNotification()
- `src/lib/useAuth.ts` — React auth context + useAuth() hook + authFetch() helper (uses Supabase Auth)
- `src/pages/api/` — All backend routes (see list below)
- `supabase/fix-and-seed.sql` — Full DB schema + triggers to run in Supabase SQL Editor

## Database Schema (Supabase)
Run `supabase/fix-and-seed.sql` in Supabase SQL Editor to create all tables:
- **profiles** — users linked to auth.users(id), bot_mode, target_acos, role (admin/user)
- **amazon_connections** — per-user Amazon API tokens (access/refresh)
- **campaigns** — campaign metrics per day (user_id FK)
- **keywords** — keyword bids/performance (user_id FK)
- **action_logs** — all AI + user actions with status (pending/approved/rejected/executed/failed)
- **notifications** — per-user alerts (info/warning/error/success)
- **ad_generations** — saved Ad Generator outputs
- **accounting_snapshots** — daily revenue/spend/profit snapshots
- **job_runs** — background job execution history

## API Routes
- `GET  /api/auth/me` — Validate Supabase token, return user profile
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
- `GET  /api/admin/stats` — Admin stats (total users, admins, campaigns, actions)
- `GET  /api/admin/users` — List users with search/filter/pagination (admin only)
- `PATCH/DELETE /api/admin/users/[id]` — Toggle role or delete user (admin only)
- `POST /api/jobs/optimize-campaigns` — Background job (X-Job-Secret header required)
- `POST /api/jobs/optimize-keywords` — Background job (X-Job-Secret header required)

## Bot Modes (per user in profiles.bot_mode)
- **safe** — AI suggests only, no auto-execution (rule engine only, no GPT cost)
- **semi** — AI generates suggestion, status=pending, user must approve in audit log
- **auto** — AI executes immediately (status=executed)

## Pages (18 total)
1. `/` — Landing page
2. `/login` — Sign in + Create Account (tab toggle, Supabase Auth)
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
18. `/admin` — Admin dashboard (stats, user management, role toggle, delete) — admin role only

## Setup Required
1. Run `supabase/fix-and-seed.sql` in Supabase SQL Editor (creates tables, RLS policies, triggers)
2. Set secrets: SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
3. Set env var: NEXT_PUBLIC_SUPABASE_URL (anon key is exposed via next.config.js env mapping)
4. Call `POST /api/seed` to create test accounts (optionally set SEED_SECRET env var and pass x-seed-secret header):
   - `admin@test.com` / `Admin1234!` (admin role)
   - `test@example.com` / `Test1234!` (user role)
   - `user@test.com` / `User1234!` (user role)
5. Or register at /login — auto-creates profile via trigger

## Auth Architecture
- **Client-side**: `supabaseClient.ts` uses `@supabase/supabase-js` with `signInWithPassword`/`signUp`/`signOut`
- **Server-side**: `requireAuth` in `auth.ts` extracts Bearer token → `adminDb.auth.getUser(token)` → profile lookup
- **Role-based**: `requireAdmin` checks `profile.role === 'admin'`; admin pages redirect non-admins
- **DB resilience**: All profile queries use `select('*')` to avoid failures when optional columns are missing
