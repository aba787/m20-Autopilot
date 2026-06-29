import type { NextApiRequest, NextApiResponse } from 'next';
import { db as adminDb, supabase } from '@/lib/supabaseClient';
import { rateLimit, RateLimits } from '@/lib/rateLimit';

async function findAuthUserByEmail(emailNorm: string) {
    const perPage = 200;
    for (let page = 1; page <= 50; page++) {
          const { data, error } = await adminDb.auth.admin.listUsers({ page, perPage });
          if (error) throw error;
          const users = data?.users ?? [];
          const match = users.find((u: any) => u.email?.toLowerCase() === emailNorm);
          if (match) return match;
          if (users.length < perPage) break;
    }
    return null;
}

async function signInAndReturnSession(emailNorm: string, password: string, userId: string) {
    const { data: signInData } = await supabase.auth.signInWithPassword({
        email: emailNorm,
        password,
    });
    if (signInData?.session) {
        return {
            success: true,
            directLogin: true,
            access_token: signInData.session.access_token,
            refresh_token: signInData.session.refresh_token,
            user: { id: userId, email: emailNorm },
        };
    }
    return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    if (!rateLimit(req, res, { ...RateLimits.authStrict, keyPrefix: 'register' })) return;

    const { email, password, full_name } = req.body;

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
    const checkUnconfirmed = req.body._checkUnconfirmed === true;

    try {
        const existingAuthUser = await findAuthUserByEmail(emailNorm);

        if (existingAuthUser) {
            if (checkUnconfirmed) {
                return res.status(200).json({
                    confirmed: !!existingAuthUser.email_confirmed_at,
                    requiresOtp: !existingAuthUser.email_confirmed_at,
                    userId: existingAuthUser.id,
                });
            }

            if (existingAuthUser.email_confirmed_at) {
                return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
            }

            await adminDb.auth.admin.updateUserById(existingAuthUser.id, {
                password,
                email_confirm: true,
            });

            await adminDb.from('profiles').upsert({
                id: existingAuthUser.id,
                email: emailNorm,
                full_name: full_name?.trim() ?? null,
                bot_mode: 'safe',
                role: 'user',
                email_notifications: true,
            });

            const session = await signInAndReturnSession(emailNorm, password, existingAuthUser.id);
            if (session) return res.status(200).json(session);
            return res.status(200).json({ success: true, userId: existingAuthUser.id, requiresOtp: false });
        }

        if (checkUnconfirmed) return res.status(200).json({ confirmed: false, noAccount: true });

        const { data: authData, error: createError } = await adminDb.auth.admin.createUser({
            email: emailNorm,
            password,
            email_confirm: true,
            user_metadata: { full_name: full_name ?? '' },
        });

        if (createError || !authData.user) {
            return res.status(400).json({ error: createError?.message || 'Registration failed' });
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

        const session = await signInAndReturnSession(emailNorm, password, userId);
        if (session) return res.status(200).json(session);
        return res.status(200).json({ success: true, userId, requiresOtp: false });

    } catch (err: any) {
        return res.status(500).json({ error: err?.message || 'Registration failed' });
    }
}
