import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb, supabase } from '@/lib/supabaseClient';
import { rateLimit, RateLimits } from '@/lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!rateLimit(req, res, { ...RateLimits.authStrict, keyPrefix: 'register' })) return;

    const { email, password, full_name } = req.body;
    const checkUnconfirmed = req.body._checkUnconfirmed === true;

    if (checkUnconfirmed) {
        return res.status(200).json({ confirmed: true, noAccount: false });
    }

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 12) {
        return res.status(400).json({ error: 'Password must be at least 12 characters' });
    }
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const complexity = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
    if (complexity < 3) {
        return res.status(400).json({
            error: 'Password must include at least 3 of: uppercase, lowercase, digit, symbol',
        });
    }

    const emailNorm = email.toLowerCase().trim();

    try {
        const { data: authData, error: createError } = await adminDb.auth.admin.createUser({
            email: emailNorm,
            password,
            email_confirm: true,
            user_metadata: { full_name: full_name ?? '' },
        });

        if (createError) {
            if (
                createError.message?.toLowerCase().includes('already registered') ||
                createError.message?.toLowerCase().includes('already exists') ||
                createError.message?.toLowerCase().includes('already been registered')
            ) {
                return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
            }
            return res.status(400).json({ error: createError.message || 'Registration failed' });
        }

        if (!authData?.user) {
            return res.status(400).json({ error: 'Registration failed' });
        }

        const userId = authData.user.id;

        await adminDb.from('profiles').upsert({
            id: userId,
            email: emailNorm,
            full_name: full_name?.trim() ?? null,
            bot_mode: 'safe',
            role: 'user',
            email_notifications: true,
        });

        const { data: signInData } = await supabase.auth.signInWithPassword({
            email: emailNorm,
            password,
        });

        if (signInData?.session) {
            return res.status(200).json({
                success: true,
                directLogin: true,
                access_token: signInData.session.access_token,
                refresh_token: signInData.session.refresh_token,
                user: { id: userId, email: emailNorm },
            });
        }

        return res.status(200).json({ success: true, userId, requiresOtp: false });

    } catch (err: any) {
        return res.status(500).json({ error: err?.message || 'Registration failed' });
    }
}
