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

1. **Detection & Triage** (Hour 0–2)
   - Confirm the incident, classify severity (Low / Medium / High / Critical), and assemble the response team.
2. **Containment** (Hour 0–24)
   - Revoke compromised tokens, disable affected endpoints, and isolate affected systems.
3. **Eradication** (Day 1–3)
   - Patch the underlying vulnerability and verify the fix in staging.
4. **Recovery** (Day 1–7)
   - Restore service, rotate all relevant secrets (`ENCRYPTION_KEY`, OAuth credentials, database keys).
5. **Notification** (within legal deadlines)
   - Notify affected users and the relevant data-protection authority (Saudi PDPL — within **72 hours** when applicable).
6. **Post-Mortem** (within 14 days)
   - Publish an internal RCA, list root causes, and add preventive controls (tests, monitoring, code review checklist).

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
