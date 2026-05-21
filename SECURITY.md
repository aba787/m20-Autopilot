# Security Policy — M20 Autopilot

## Reporting a Vulnerability

If you discover a security vulnerability in M20 Autopilot, please report it responsibly.

**Email:** `support@m20autopilot.com`
**Subject line:** `SECURITY — <short description>`

Please **do not** open public GitHub issues for security vulnerabilities.

We aim to:
- Acknowledge your report within **2 business days**.
- Provide an initial assessment within **5 business days**.
- Release a fix or mitigation within **30 calendar days** for high/critical issues.

When reporting, please include:
- A description of the vulnerability and its potential impact.
- Steps to reproduce (URLs, payloads, account roles required, etc.).
- Any proof-of-concept code or screenshots.
- Your name/handle if you would like public credit (optional).

## Scope

In scope:
- The M20 Autopilot web platform (`*.m20autopilot.com`).
- The M20 REST API (`/api/*`).
- The M20 mobile applications (when published).

Out of scope:
- Third-party services we depend on (Supabase, OpenAI, Resend, Amazon Advertising) — please report directly to those vendors.
- Social engineering, physical attacks, or denial-of-service tests against production.

## Supported Versions

Only the latest production release is supported. Self-hosted or forked versions are the responsibility of the operator.

## Handling Compromised Credentials

If you suspect your M20 account is compromised:

1. **Immediately** sign in and change your password from `Settings → Security`.
2. Revoke the Amazon Advertising connection from `Integration → Amazon` and reconnect.
3. Review recent `action_logs` in your dashboard for unfamiliar activity.
4. Email `support@m20autopilot.com` with the timeframe of suspected compromise so we can review server-side logs.

If we detect suspicious activity on your account, we will:
- Lock the account and force a password reset.
- Invalidate all active sessions.
- Notify you via the email on file within 24 hours.
- Provide a summary of what we observed and what data may have been affected.

## Incident Response Process

When a security incident is confirmed, the M20 team follows these steps:

1. **Detection** (Hour 0)
   - Continuous monitoring of `login_attempts`, `action_logs`, deployment logs, and rate-limit `429` spikes.
   - Triggers include: anomalous failed-login bursts, unauthorized admin-endpoint access, unexpected token-refresh failures, abnormal Amazon API error rates, or any third-party security report.
2. **Triage & Escalation** (Hour 0–2)
   - On-call engineer confirms the incident and assigns a severity (Low / Medium / High / Critical).
   - High/Critical incidents escalate immediately to the security lead and CTO; an incident channel is opened and a single Incident Commander is appointed.
3. **Containment** (Hour 0–24)
   - Revoke compromised tokens, force-logout affected users, disable affected endpoints (via feature flag or hotfix), and isolate affected systems.
   - Block offending IPs at the WAF / hosting platform layer.
4. **Logging & Evidence Preservation** (Hour 0–24)
   - Snapshot relevant logs (`login_attempts`, `action_logs`, deployment logs, Supabase audit logs) before any rotation or cleanup.
   - Record a timeline of actions taken.
5. **Eradication** (Day 1–3)
   - Patch the underlying vulnerability and verify the fix in staging before deploying to production.
6. **Recovery** (Day 1–7)
   - Restore service, rotate all relevant secrets (`ENCRYPTION_KEY`, `SESSION_SECRET`, Supabase service-role key, OAuth credentials, database credentials).
   - Re-issue Amazon Advertising OAuth grants if Amazon tokens were exposed.
7. **Notification** (within legal & contractual deadlines)
   - **Amazon Ads API:** If the incident involves Amazon Advertising information (tokens, profile data, campaign data, or any data retrieved via the Amazon Ads API), M20 will notify Amazon within **24 hours** of confirmed detection by emailing **`security@amazon.com`** (and `3p-security@amazon.com` for third-party developer incidents). The notification will include incident summary, affected data categories, timeline, containment actions, and a point of contact.
   - **Saudi PDPL:** Notify the Saudi Data & Artificial Intelligence Authority (SDAIA) and affected data subjects within **72 hours**.
   - **Affected users:** Direct email to the address on file with a plain-language summary and recommended actions.
8. **Post-Mortem** (within 14 days)
   - Publish an internal RCA, list root causes, and add preventive controls (tests, monitoring, code-review checklist).

## Network Protection

- **Hosting:** M20 Autopilot runs on Replit Deployments, which uses isolated containerized infrastructure behind Cloudflare. Only `443/TCP` (HTTPS) is publicly exposed; all other ports are firewalled at the platform edge.
- **Database:** Supabase-managed PostgreSQL sits behind an API gateway. There is no direct, internet-routable Postgres port; all access is mediated by Supabase's PostgREST layer and authenticated via JWT.
- **Internal traffic:** API → database traffic is TLS-encrypted end-to-end. Service-to-service authentication uses scoped JWT tokens, not shared network trust.
- **Custom domains:** When configured, the hosting platform automatically issues and renews TLS certificates and enforces HTTPS via HSTS.
- **DDoS / WAF:** Mitigated at the Cloudflare layer of the hosting platform.
- **Self-hosted / AWS deployments (operator responsibility):** When self-hosting, deploy the app inside a VPC, expose only ports 80/443 via an Application Load Balancer, place the database in a private subnet, and restrict outbound traffic via Security Groups to the required external endpoints only (Supabase, OpenAI, Resend, Amazon Ads API).

## Account Protection

- **Account lockout (account-wide, defense in depth):** After **5** consecutive failed login attempts within **15** minutes, the account is locked for **15** minutes. Enforcement is layered:
  1. **Authoritative boundary — Supabase Before-Sign-In Auth Hook** (`supabase/auth-hooks.sql`, function `public.auth_hook_before_signin`). Runs inside Supabase Auth (gotrue) before any password is checked, so direct API calls cannot bypass it. **Must be enabled once in the Supabase dashboard at Authentication → Hooks → Before User Sign In.**
  2. **Server-side gate** in `/api/auth/login` (`src/lib/lockout.ts`) — fails closed (`503`) if the lockout query errors.
  3. **Pre-flight UX check** at `/api/auth/check-lockout` so the UI can warn users before they submit.
- **Operational verification:** admins can call `GET /api/admin/security-status` to confirm the lockout hook function exists in the database and required secrets are present. Hook enablement in the Supabase dashboard must still be confirmed manually after deployment.
- **Rate limiting:** IP-based limits on every authentication and AI endpoint (see `src/lib/rateLimit.ts`).
- **No shared accounts:** Each user has a unique Supabase Auth identity (UUID); the platform does not support shared sessions.
- **Periodic access review:** Admin users should review the `profiles` table quarterly and remove inactive accounts.

## Data Subject Rights

- **Self-deletion:** Users may permanently delete their account and all associated data by calling `DELETE /api/auth/me` with header `X-Confirm-Delete: DELETE_MY_ACCOUNT`. This cascades through every user-owned table (campaigns, keywords, Amazon connections, subscriptions, notifications, action logs, etc.), anonymizes `login_attempts` rows, and removes the underlying Supabase Auth identity.
- **Data export:** Available on request via `support@m20autopilot.com`.
- **Retention:** We retain only data necessary to operate the Service. Audit logs are retained for **12 months**; failed-login records are retained for **30 days** then purged.

## Security Practices in Place

- **Transport security:** TLS 1.2+ enforced via the hosting platform; HSTS header set.
- **Authentication:** Supabase Auth with bcrypt password hashing and JWT bearer tokens.
- **Authorization:** Row-Level Security policies on every Supabase table (`auth.uid() = user_id`); admin endpoints gated by `requireAdmin()`.
- **Secrets management:** All API keys, OAuth credentials, and the database connection string live in environment variables — never in source.
- **Token encryption at rest:** Amazon `access_token` and `refresh_token` are encrypted with AES-256-GCM using `ENCRYPTION_KEY` before being stored.
- **Rate limiting:** IP-based limits on `/api/auth/*` and `/api/ai/*` endpoints to mitigate brute-force and abuse.
- **Audit logging:** `login_attempts` and `action_logs` tables record authentication events and user actions.
- **Security headers:** HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and CSP set in `next.config.js`.
- **No third-party data sharing:** Amazon Advertising data is used solely to operate the Service. We do not sell or share it.

## Operator Checklist (before production deployment)

- [ ] All required env vars set: `ENCRYPTION_KEY`, `SESSION_SECRET`, `SUPABASE_*`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `AMAZON_*`.
- [ ] `ENCRYPTION_KEY` is a fresh 32+ character random value (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
- [ ] `/api/seed` is disabled or protected by `SESSION_SECRET` in production (`ENABLE_SEED=false`).
- [ ] Supabase project has RLS enabled on every table.
- [ ] Custom domain has a valid TLS certificate.
- [ ] Hosting platform's WAF / DDoS protection is enabled (Vercel/Cloudflare).
- [ ] Database backups are scheduled.

---

Last updated: 2026-05-05
