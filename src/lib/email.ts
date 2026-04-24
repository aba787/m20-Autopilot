import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'M20 Autopilot <onboarding@resend.dev>';

export type EmailTemplate = 'welcome' | 'password_reset' | 'email_verification' | 'update' | 'announcement';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  tags?: { name: string; value: string }[];
}

export async function sendEmail(options: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set, skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      tags: options.tags,
    });

    if (error) {
      console.error('[Email] Send failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[Email] Exception:', err);
    return { success: false, error: err.message };
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: 'Welcome to M20 Autopilot! 🚀',
    html: welcomeTemplate(name),
    tags: [{ name: 'type', value: 'welcome' }],
  });
}

export async function sendPasswordResetEmail(to: string, name: string, resetLink: string) {
  return sendEmail({
    to,
    subject: 'Reset Your Password — M20 Autopilot',
    html: passwordResetTemplate(name, resetLink),
    tags: [{ name: 'type', value: 'password_reset' }],
  });
}

export async function sendVerificationEmail(to: string, name: string, verifyLink: string) {
  return sendEmail({
    to,
    subject: 'Verify Your Email — M20 Autopilot',
    html: verificationTemplate(name, verifyLink),
    tags: [{ name: 'type', value: 'email_verification' }],
  });
}

export async function sendOtpEmail(to: string, name: string, otp: string, type: 'signup' | 'recovery') {
  const subject = type === 'signup'
    ? 'Verify Your Email — M20 Autopilot'
    : 'Password Reset Code — M20 Autopilot';
  return sendEmail({
    to,
    subject,
    html: otpTemplate(name, otp, type),
    tags: [{ name: 'type', value: type === 'signup' ? 'email_verification' : 'password_reset' }],
  });
}

export async function sendBulkEmail(recipients: { email: string; name: string }[], subject: string, contentHtml: string) {
  const results = [];
  for (const r of recipients) {
    const result = await sendEmail({
      to: r.email,
      subject,
      html: announcementTemplate(r.name, subject, contentHtml),
      tags: [{ name: 'type', value: 'announcement' }],
    });
    results.push({ email: r.email, ...result });
  }
  return results;
}

function baseLayout(content: string, preheader: string = '') {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>M20 Autopilot</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0a0612; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #0f0a1a; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0e7490, #00d9ff); padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; color: #0a0612; font-size: 24px; font-weight: 800; }
    .header p { margin: 4px 0 0; color: rgba(10,6,18,0.7); font-size: 13px; }
    .body { padding: 40px; color: #cbd5e1; font-size: 15px; line-height: 1.7; }
    .body h2 { color: #f1f5f9; font-size: 20px; margin-top: 0; }
    .body a { color: #00d9ff; text-decoration: none; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0e7490, #00d9ff); color: #0a0612 !important; font-weight: 700; border-radius: 12px; text-decoration: none !important; font-size: 15px; margin: 16px 0; }
    .step { display: flex; gap: 12px; margin-bottom: 16px; align-items: flex-start; }
    .step-num { flex-shrink: 0; width: 28px; height: 28px; background: rgba(0,217,255,0.12); border: 1px solid rgba(0,217,255,0.25); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #00d9ff; font-weight: 700; font-size: 13px; }
    .step-text { color: #94a3b8; font-size: 14px; line-height: 1.5; }
    .step-text strong { color: #e2e8f0; }
    .divider { border: none; border-top: 1px solid rgba(0,217,255,0.1); margin: 24px 0; }
    .footer { padding: 24px 40px; text-align: center; border-top: 1px solid rgba(0,217,255,0.08); }
    .footer p { color: #475569; font-size: 12px; margin: 4px 0; }
    .footer a { color: #64748b; text-decoration: underline; }
    .preheader { display: none !important; max-height: 0; overflow: hidden; mso-hide: all; }
    @media (max-width: 600px) {
      .body { padding: 24px 20px; }
      .header { padding: 24px 20px; }
      .footer { padding: 20px; }
    }
  </style>
</head>
<body style="margin:0; padding:20px 12px; background:#0a0612;">
  <span class="preheader">${preheader}</span>
  <div class="email-wrapper">
    <div class="header">
      <h1>⚡ M20 Autopilot</h1>
      <p>Amazon Ad Automation</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} M20 Autopilot. All rights reserved.</p>
      <p><a href="{unsubscribe_url}">Unsubscribe</a> · <a href="{preferences_url}">Email Preferences</a></p>
    </div>
  </div>
</body>
</html>`;
}

function welcomeTemplate(name: string) {
  const firstName = name?.split(' ')[0] || 'there';
  return baseLayout(`
    <h2>Welcome aboard, ${firstName}! 🎉</h2>
    <p>Thank you for joining <strong>M20 Autopilot</strong> — your AI-powered Amazon advertising platform. We're excited to help you optimize your campaigns and grow your sales.</p>

    <hr class="divider"/>

    <p style="color:#e2e8f0; font-weight:600; margin-bottom:16px;">Here's how to get started:</p>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text"><strong>Connect your Amazon account</strong> — Link your Amazon Seller Central to start syncing your campaigns automatically.</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text"><strong>Review your dashboard</strong> — See all your key metrics at a glance: Sales, ACOS, ROAS, and more.</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text"><strong>Enable AI optimization</strong> — Let our AI analyze your campaigns and suggest improvements to lower ACOS and boost ROAS.</div>
    </div>
    <div class="step">
      <div class="step-num">4</div>
      <div class="step-text"><strong>Chat with your AI assistant</strong> — Ask questions about your campaigns anytime using the built-in chatbot.</div>
    </div>

    <div style="text-align:center; margin-top:24px;">
      <a href="{dashboard_url}" class="btn">Go to Dashboard →</a>
    </div>

    <hr class="divider"/>

    <p style="font-size:13px; color:#64748b;">Need help? Our AI assistant is available 24/7 right inside the app, or visit our Help Center anytime.</p>
  `, `Welcome to M20 Autopilot — your AI-powered Amazon ad optimization platform`);
}

function passwordResetTemplate(name: string, resetLink: string) {
  const firstName = name?.split(' ')[0] || 'there';
  return baseLayout(`
    <h2>Reset Your Password</h2>
    <p>Hi ${firstName}, we received a request to reset your password. Click the button below to create a new one:</p>

    <div style="text-align:center; margin:24px 0;">
      <a href="${resetLink}" class="btn">Reset Password →</a>
    </div>

    <p style="font-size:13px; color:#64748b;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>

    <hr class="divider"/>

    <p style="font-size:12px; color:#475569;">If the button doesn't work, copy and paste this link into your browser:<br/>
    <a href="${resetLink}" style="word-break:break-all; font-size:11px;">${resetLink}</a></p>
  `, `Reset your M20 Autopilot password`);
}

function verificationTemplate(name: string, verifyLink: string) {
  const firstName = name?.split(' ')[0] || 'there';
  return baseLayout(`
    <h2>Verify Your Email</h2>
    <p>Hi ${firstName}, please verify your email address to complete your registration:</p>

    <div style="text-align:center; margin:24px 0;">
      <a href="${verifyLink}" class="btn">Verify Email →</a>
    </div>

    <p style="font-size:13px; color:#64748b;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
  `, `Verify your email for M20 Autopilot`);
}

function otpTemplate(name: string, otp: string, type: 'signup' | 'recovery') {
  const firstName = name?.split(' ')[0] || 'there';
  const title = type === 'signup' ? 'Verify Your Email' : 'Password Reset Code';
  const desc = type === 'signup'
    ? `Hi ${firstName}, use the code below to verify your email address and complete your registration:`
    : `Hi ${firstName}, use the code below to reset your password. This code expires in 15 minutes.`;
  const digits = otp.split('').map(d =>
    `<span style="display:inline-block;width:44px;height:56px;line-height:56px;text-align:center;background:rgba(0,217,255,0.08);border:2px solid rgba(0,217,255,0.3);border-radius:12px;color:#00d9ff;font-size:28px;font-weight:800;margin:0 4px;">${d}</span>`
  ).join('');
  return baseLayout(`
    <h2>${title}</h2>
    <p>${desc}</p>
    <div style="text-align:center;margin:32px 0;">
      ${digits}
    </div>
    <p style="font-size:13px;color:#64748b;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
  `, `Your M20 Autopilot verification code: ${otp}`);
}

function announcementTemplate(name: string, subject: string, contentHtml: string) {
  const firstName = name?.split(' ')[0] || 'there';
  return baseLayout(`
    <h2>${subject}</h2>
    <p>Hi ${firstName},</p>
    ${contentHtml}

    <div style="text-align:center; margin-top:24px;">
      <a href="{dashboard_url}" class="btn">Open Dashboard →</a>
    </div>
  `, subject);
}
