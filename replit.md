# M20 Autopilot

Amazon Advertising Optimization SaaS Dashboard — Multi-language (7 languages), LTR/RTL layout, Cyber/Dark theme.

## Tech Stack
- **Framework**: Next.js 16 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + inline styles (cyber design system)
- **Charts**: Recharts (Line, Bar, Pie)
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
- **Server-side verification**: `requireAuth(req, res)` in `src/lib/auth.ts` uses `adminDb.auth.getUser(token)` to verify Supabase JWT
- **Optional auth**: `optionalAuth(req)` — same as requireAuth but returns null silently without sending 401
- **Profile fetch**: After auth, role fetched from `profiles` table: `supabase.from('profiles').select('role').eq('id', user.id).single()`
- **Role redirect**: Admin → `/admin`, User → `/dashboard`
- **Auto profile creation**: Trigger `on_auth_user_created` on `auth.users` auto-creates profiles row on signup
- **Password reset**: POST `/api/auth/forgot-password` — generates token, stores in `password_reset_tokens` table

## Design System (CSS Custom Properties Theme)
- **Theme Toggle**: Dark (default) / Light mode via `.light` class on `<html>`; persisted to localStorage
- **All colors**: Defined as CSS custom properties in `src/styles/globals.css` (`:root` = dark, `.light` = overrides)
- **Dark mode**: `--bg-primary: #0a0612`, `--accent: #00d9ff`, `--card-bg: rgba(0,217,255,0.04)`
- **Light mode**: `--bg-primary: #f8fafc`, `--accent: #0891b2`, `--card-bg: #ffffff`
- **Inline styles**: Use `var(--token)` (e.g. `background: 'var(--card-bg)'`); no hardcoded hex in pages
- **CARD constant**: `{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.875rem', boxShadow: 'var(--card-shadow)' }`
- **Direction**: LTR/RTL — dynamically switches based on selected language (sidebar adjusts accordingly)
- **Metric Colors**: Each KPI card has a unique color tag for quick visual differentiation

## i18n System
- **File**: `src/lib/i18n.tsx` — React context-based, scalable translation system
- **Dynamic languages**: `supportedLanguages` array with `LangConfig` (code, label, nativeLabel, dir). Use `addLanguage()` to add new languages without refactoring
- **Currently supported**: English (LTR), Arabic (RTL), Spanish (LTR), French (LTR), German (LTR), Turkish (LTR), Chinese (LTR)
- **270+ translation keys** covering all pages
- **`addTranslations()`** API for adding new translation keys at runtime
- **Language persistence**: localStorage (`m20_prefs` key) + database (`profiles.language`)
- **Instant switching**: Client-side, no page reload. Layout direction flips automatically
- **Language selector**: In the top bar header, next to dark/light mode toggle (Globe icon + dropdown)
- **Bot language auto-detection**: via `detectLanguage()` in `campaignBot.ts`

## Architecture
- `src/pages/` — All page routes (Next.js Pages Router)
- `src/components/Layout.tsx` — App shell: left sidebar + header (with language selector) + embedded chatbot widget (24-message memory)
- `src/components/ThemeProvider.tsx` — Dark mode context
- `src/lib/i18n.tsx` — i18n context (language, tone, automation state, translations, addLanguage)
- `src/data/mock.ts` — Fallback mock data with product images, TACoS, spend, dailyBudget
- `src/lib/campaignBot.ts` — Rules engine + GPT-4o mini (CAMPAIGN_BOT_PROMPT, MASTER_SYSTEM_PROMPT)
- `src/lib/amazonApi.ts` — Amazon Ads API client (OAuth, token refresh, campaign sync, bid management)
- `src/lib/supabaseAdmin.ts` — Untyped Supabase admin client (exported as `db`, used in all API routes)
- `src/lib/supabaseClient.ts` — Client-side Supabase client (used for auth in browser)
- `src/lib/auth.ts` — requireAuth(req, res), optionalAuth(req), requireAdmin(), logAction(), createNotification()
- `src/lib/useAuth.ts` — React auth context + useAuth() hook + authFetch() helper (uses Supabase Auth)
- `src/pages/api/` — All backend routes (see list below)
- `supabase/fix-and-seed.sql` — Full DB schema + triggers + RLS policies to run in Supabase SQL Editor

## Chatbot Widget
- **Embedded widget**: Floating button (bottom corner) opens a full chat window overlay — NOT a separate page
- **Available on all pages**: Chat stays accessible across the entire app
- **FAQ system**: Local FAQ matching for instant answers (no API call needed)
- **GPT fallback**: Calls `/api/support-chat` for non-FAQ questions
- **Memory**: 24-message rolling history for context-rich conversations
- **Persistence**: Messages saved to localStorage per user (key: `m20_chat_{userId}`), survives page refreshes
- **Bilingual**: Auto-detects Arabic/English input, responds in the same language

## Database Schema (Supabase)
Run `supabase/fix-and-seed.sql` in Supabase SQL Editor to create all tables:
- **profiles** — users linked to auth.users(id), bot_mode, target_acos, role (admin/user)
- **amazon_connections** — per-user Amazon API tokens (access/refresh)
- **campaigns** — campaign metrics per day (user_id FK)
- **keywords** — keyword bids/performance (user_id FK)
- **ad_groups** — campaign ad groups with targeting type, bid, status
- **ads** — individual ads within ad groups
- **search_terms** — search term reports with spend/sales/acos
- **negative_keywords** — negative keyword targeting (campaign/ad group level)
- **rules** — automation rules (bid adjustments, budget changes, pause conditions)
- **subscriptions** — user subscription plans (free/pro/enterprise)
- **login_attempts** — security logging for login attempts
- **password_reset_tokens** — secure password reset flow
- **action_logs** — all AI + user actions with status (pending/approved/rejected/executed/failed)
- **notifications** — per-user alerts (info/warning/error/success)
- **ad_generations** — saved Ad Generator outputs
- **products** — per-user product catalog with performance metrics
- **accounting_snapshots** — daily revenue/spend/profit snapshots
- **job_runs** — background job execution history
- **RLS policies**: All tables have Row Level Security enabled

## API Routes
### Auth
- `GET  /api/auth/me` — Validate Supabase token, return user profile
- `POST /api/auth/forgot-password` — Password reset request (generates token)

### Campaigns
- `GET  /api/campaigns` — List campaigns (auth required, supports ?from=&to=&status=)
- `POST /api/campaigns` — Create campaign
- `GET/PATCH /api/campaigns/[id]` — Get or update single campaign (PATCH whitelisted: budget, status only)
- `POST /api/campaigns/bulk` — Bulk actions (pause/enable/delete/update_budget)

### Ad Groups, Search Terms, Keywords
- `GET/POST /api/ad-groups` — List and create ad groups (filter by campaign_id, status)
- `GET  /api/search-terms` — Search term reports (filter by campaign_id, ad_group_id, is_negated)
- `GET/POST /api/negative-keywords` — Manage negative keywords
- `GET/POST/PUT/DELETE /api/rules` — Automation rules CRUD

### AI
- `POST /api/ai/keyword-analysis` — AI keyword intelligence (analyzes performance, recommends actions)
- `POST /api/support-chat` — AI customer support (strict platform-only scope)
- `POST /api/bot-analyze` — Campaign analysis (rule engine + GPT)
- `POST /api/ad-generator` — Generate ad content via GPT-4o mini (auth required)

### Amazon Integration
- `POST /api/amazon/callback` — OAuth code exchange for tokens
- `POST /api/amazon/sync` — Sync campaigns from Amazon Ads API
- `GET/POST /api/amazon-connection` — Amazon account connections

### Subscriptions
- `GET  /api/subscriptions` — List plans + current user plan (optional auth)
- `POST /api/subscriptions` — Upgrade/change plan (auth required)

### Dashboard & Data
- `GET  /api/dashboard/stats` — KPIs with period comparison, chart data, pending actions, budget warning
- `GET  /api/accounting` — Revenue/spend/profit snapshots with totals
- `POST /api/accounting` — Upsert daily snapshot
- `GET  /api/notifications` — List notifications + unread count
- `POST /api/notifications/[id]/read` — Mark single or "all" as read
- `GET  /api/action-logs` — Full audit log with campaign names
- `POST /api/action-logs/[id]/approve` — Approve or reject pending AI action
- `GET/PATCH /api/settings` — User profile settings
- `GET  /api/budget-check` — Budget threshold check
- `GET/POST /api/products` — Product catalog
- `GET/PATCH/DELETE /api/products/[id]` — Single product operations
- `POST /api/seed` — Create test accounts

### Admin
- `GET  /api/admin/stats` — Admin stats (total users, campaigns, actions)
- `GET  /api/admin/users` — List users with search/filter/pagination (admin only)
- `PATCH/DELETE /api/admin/users/[id]` — Toggle role or delete user (admin only)

### Email
- `POST /api/email/welcome` — Send welcome email to authenticated user (called after signup)
- `POST /api/email/send` — Send bulk email to users (admin only, respects email_notifications preference)

### Background Jobs
- `POST /api/jobs/optimize-campaigns` — Background campaign optimization
- `POST /api/jobs/optimize-keywords` — Background keyword optimization

## Email System
- **Service**: Resend (`RESEND_API_KEY`)
- **Library**: `src/lib/email.ts` — sendEmail(), sendWelcomeEmail(), sendPasswordResetEmail(), sendVerificationEmail(), sendBulkEmail()
- **Templates**: HTML emails with M20 Autopilot branding (dark theme, mobile-friendly, cyan accent)
- **Transactional**: Welcome email (auto on signup), password reset, email verification
- **Marketing**: Announcements/updates via admin bulk send (`POST /api/email/send`)
- **User preferences**: `email_notifications` boolean in profiles table (opt-in/out from Settings page)
- **From address**: Configured via `EMAIL_FROM` env var or defaults to `M20 Autopilot <onboarding@resend.dev>`
- **Welcome email flow**: After client-side signup → fire-and-forget POST to `/api/email/welcome`

## Backend Logic
- **Budget check**: `daily_budget < 40 SAR` → `budget_warning: true` returned from dashboard/settings
- **Automation gate**: `automation_enabled = false` → optimization jobs skip processing for that user
- **Currency**: All monetary values are in SAR (Saudi Riyal)
- **Subscription plans**: Free (5 campaigns, 100 kw, 20 AI queries), Pro ($49, 50 campaigns, 2000 kw), Enterprise ($199, unlimited)

## Bot Modes (per user in profiles.bot_mode)
- **safe** — AI suggests only, no auto-execution (rule engine only, no GPT cost)
- **semi** — AI generates suggestion, status=pending, user must approve in audit log
- **auto** — AI executes immediately (status=executed)

## Pages
1. `/` — Landing page
2. `/login` — Sign in + Create Account + Forgot Password flow (tab toggle, Supabase Auth)
3. `/dashboard` — KPIs with colored metric cards, editable daily budget (pencil icon, min 10 SAR), charts with type switcher
4. `/campaigns` — Sortable campaigns table with checkbox selection and bulk actions (pause/enable/delete)
5. `/products` — Product cards layout with detail sidebar, search and filters
6. `/blacklist` — Excluded products
7. `/ai-engine` — AI + rules analysis (GPT-4o mini)
8. `/ads-generator` — Ad content generator
9. `/accounting` — Revenue/cost/profit
10. `/alerts` — Alert list
11. `/reports` — Performance reports
12. `/amazon-news` — Seller news
13. `/integration` — Amazon account connection with OAuth flow and sync history
14. `/audit` — Full change log
15. `/support` — Full-page AI chat assistant (bilingual, FAQ system, GPT fallback, 24-msg memory)
16. `/help` — FAQ
17. `/settings` — Account settings (language, tone, automation, bot mode, ACOS target)
18. `/subscriptions` — Plan cards (Free/Pro/Enterprise) with upgrade flow
19. `/admin` — Admin dashboard (stats, user management) — admin role only
20. `/stores` — Store management
21. `/keywords` — Keyword management
22. `/recommendations` — AI recommendations

## Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
- `OPENAI_API_KEY` — OpenAI API key for AI features
- `RESEND_API_KEY` — Resend API key for email sending
- `EMAIL_FROM` — Email sender address (optional, defaults to `M20 Autopilot <onboarding@resend.dev>`)
- `AMAZON_CLIENT_ID` — Amazon Ads API client ID (optional, for Amazon integration)
- `AMAZON_CLIENT_SECRET` — Amazon Ads API client secret (optional)
- `AMAZON_REDIRECT_URI` — Amazon OAuth redirect URI (optional)

## Setup Required
1. Run `supabase/fix-and-seed.sql` in Supabase SQL Editor (creates tables, RLS policies, triggers)
2. Set secrets: SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
3. Set env var: NEXT_PUBLIC_SUPABASE_URL
4. Call `POST /api/seed` to create test accounts:
   - `admin@test.com` / `Admin1234!` (admin role)
   - `test@example.com` / `Test1234!` (user role)
   - `user@test.com` / `User1234!` (user role)
5. Or register at /login — auto-creates profile via trigger

## Deployment
- **Build**: `next build` (Turbopack)
- **Start**: `next start -p 5000 -H 0.0.0.0`
