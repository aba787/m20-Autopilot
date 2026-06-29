# M20 Autopilot

## Overview

M20 Autopilot is an Amazon Advertising Optimization SaaS Dashboard designed to help businesses manage and optimize their Amazon ad campaigns. It offers multi-language support (7 languages, LTR/RTL layouts), a cyber/dark theme, and leverages AI for advanced analytics and ad generation. The platform aims to provide comprehensive tools for campaign management, keyword analysis, budget optimization, and performance tracking, with robust data isolation for multi-user environments and a flexible subscription system.

## User Preferences

I want iterative development.
I prefer detailed explanations.
I want to be asked before any major changes are made to the codebase.
I like getting a high-level overview of the changes before diving into the specifics.
I prefer clear and concise communication.
Do not make changes to the `supabase/fix-and-seed.sql` file.
Do not make changes to the `public/` folder.

## System Architecture

The M20 Autopilot is built with Next.js 16 (Pages Router) and TypeScript, utilizing Tailwind CSS for styling with a custom CSS-in-JS design system supporting dark/light themes and LTR/RTL layouts. Data fetching is centralized through API endpoints, with no mock data in production.

**Key Architectural Decisions:**
- **UI/UX**: Features a consistent cyber design theme with a toggle for dark/light mode, and dynamic LTR/RTL layout switching based on selected language. Components like the embedded chatbot widget are available across all pages.
- **Authentication**: Implemented via Supabase Auth for client-side and server-side JWT verification, including robust user management, role-based redirection, and logging of login attempts.
- **Data Isolation**: Achieved through Row Level Security (RLS) policies on all 17 Supabase tables, ensuring users can only access their own data (`auth.uid() = user_id`).
- **Subscription & Feature Gating**: A middleware-driven system (`src/lib/subscriptionGuard.ts`) manages feature access, AI query limits, and resource limits based on user subscription plans (Free, Pro, Enterprise).
- **Internationalization (i18n)**: A scalable, context-based system supports dynamic language loading and persistence, offering instant client-side switching and layout direction changes.
- **AI Integration**: Uses OpenAI GPT-4o mini for campaign analysis, ad generation, keyword intelligence, and customer support. AI responses adhere to a mandatory 4-section markdown structure (Summary, Analysis, Recommendations, Notes), with specific endpoints returning JSON.
- **Chatbot Widget**: An embedded, bilingual chatbot with a 24-message rolling memory and local FAQ system, accessible on all pages. Messages are user-persistent via localStorage.
- **Amazon API Integration**: Handles OAuth, token refresh, and synchronization of campaign data, bid management, and keyword operations.
- **Database Schema**: Managed by Supabase PostgreSQL with `fix-and-seed.sql` defining tables, RLS policies, and triggers for profiles, campaigns, connections, subscriptions, and logs.
- **Backend Logic**: Includes budget checks, automation gates, and supports multiple AI bot modes (safe, semi, auto) for varying levels of autonomous action. All monetary values are in SAR.

## External Dependencies

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4o mini (via `OPENAI_API_KEY`)
- **Database**: Supabase PostgreSQL (`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`)
- **Authentication**: Supabase Auth
- **Email Service**: Resend (`RESEND_API_KEY`)
- **Amazon Ads API**: For campaign and advertising data integration (`AMAZON_CLIENT_ID`, `AMAZON_CLIENT_SECRET`, `AMAZON_REDIRECT_URI`)