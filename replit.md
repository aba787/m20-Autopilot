# AdFlow Arabia - أدفلو

Arabic SaaS dashboard prototype for Amazon advertising optimization platform.

## Tech Stack
- **Framework**: Next.js 16 (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Port**: 5000

## Architecture
- `src/pages/` - All page routes (Next.js Pages Router)
- `src/components/` - Layout, ThemeProvider
- `src/data/mock.ts` - All mock data for the prototype
- `src/styles/globals.css` - Global styles with Tailwind v4 custom utilities

## Pages
1. `/` - Login page
2. `/dashboard` - Main dashboard with KPIs, charts, alerts
3. `/campaigns` - Campaigns table with search/filter/modal
4. `/keywords` - Keywords table with recommendations
5. `/recommendations` - AI recommendation cards with apply/ignore
6. `/alerts` - Alerts list with severity filtering and detail panel
7. `/reports` - Reports with daily/weekly/monthly tabs and charts
8. `/stores` - Multi-store management
9. `/integration` - Amazon account connection management
10. `/subscriptions` - Pricing plans with monthly/yearly toggle
11. `/settings` - Settings with multiple tabs (profile, targets, notifications, stores, billing, security)
12. `/audit` - Audit log / activity history
13. `/support` - AI customer support chat interface
14. `/help` - Help center with FAQ accordion

## Features
- Full Arabic RTL layout
- Dark mode toggle (persisted in localStorage)
- Responsive design with mobile sidebar
- Notification dropdown in topbar
- User profile dropdown
- All mock data - no backend needed
- Custom brand colors via Tailwind v4 @theme
