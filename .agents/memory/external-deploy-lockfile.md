---
name: External deploy lockfile firewall URLs
description: package-lock.json gets Replit-internal mirror URLs that break npm ci on external CI/CD (AWS Amplify, Vercel, etc.)
---

# Replit npm mirror URLs break external deploys

When packages are installed inside the Replit environment, `package-lock.json`
`resolved` fields can point to Replit's internal package mirror:
`http://package-firewall.replit.local/npm/<pkg>/-/<pkg>-<ver>.tgz`.

On any build host **outside** Replit (AWS Amplify, Vercel, GitHub Actions, etc.)
`npm ci` fails with:
`ENOTFOUND ... package-firewall.replit.local` because that host is only
resolvable inside Replit's network.

**Why:** Replit proxies npm through an internal firewall mirror; the mirror
hostname leaks into the committed lockfile.

**How to apply:** Rewrite the resolved URLs to the public registry — the
`integrity` (sha512 of tarball contents) stays valid because content is identical:

```
sed -i 's#http://package-firewall.replit.local/npm/#https://registry.npmjs.org/#g' package-lock.json
```

Then validate JSON. Do NOT run `npm install`/`npm ci` inside Replit afterward —
it can rewrite the firewall URLs back. The committed lockfile is what the
external build consumes, so the fix only needs to live in the commit.
