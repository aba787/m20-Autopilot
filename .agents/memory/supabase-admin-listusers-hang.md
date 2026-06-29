---
name: Supabase admin listUsers hang
description: adminDb.auth.admin.listUsers() takes 14+ seconds in this project's Replit env — breaks any auth flow that calls it.
---

## Rule
Never call `adminDb.auth.admin.listUsers()` in any API route.

**Why:** Confirmed timing test showed `real 0m15.701s` — every call to this function hangs for 14+ seconds in this environment. It was being called in both the register API (`findAuthUserByEmail`) and the login flow (`_checkUnconfirmed` probe), freezing both Sign In and Create Account buttons.

**How to apply:**
- To check if an email is already registered: call `adminDb.auth.admin.createUser({ email_confirm: true, ... })` and handle the "already registered" error from Supabase.
- For `_checkUnconfirmed` probes: return immediately with `{ confirmed: true }` — all new accounts are auto-confirmed so this probe is obsolete.
- For login failure (401): return `{ error: 'Invalid email or password' }` directly — no secondary probe needed.
