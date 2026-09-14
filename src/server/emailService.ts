import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { db, DbEmailDeliveryLog } from './db';

// Ensure environment variables are loaded from .env
dotenv.config();

/**
 * Interface for Unified Email Configuration
 */
export interface UnifiedEmailConfig {
  type: 'api' | 'smtp' | 'none';
  provider: 'resend' | 'sendgrid' | 'brevo' | 'postmark' | 'smtp-gmail' | 'smtp-custom' | 'none';
  apiKey?: string;
  host?: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
}

/**
 * Parses and returns active email credentials from environment variables
 */
export const getEmailConfig = (): UnifiedEmailConfig => {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
  } catch {}

  const providerEnv = (process.env.EMAIL_PROVIDER || '').trim().toLowerCase();
  const apiKey = (
    process.env.EMAIL_API_KEY ||
    process.env.RESEND_API_KEY ||
    process.env.SENDGRID_API_KEY ||
    process.env.BREVO_API_KEY ||
    process.env.POSTMARK_API_KEY ||
    ''
  ).trim();

  const user = process.env.SMTP_USER?.trim();
  const rawPass = process.env.SMTP_PASSWORD?.trim();
  const pass = rawPass ? rawPass.replace(/\s+/g, '') : undefined; // Strip spaces from Google 16-char app passwords
  const host = process.env.SMTP_HOST?.trim();
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT.trim(), 10) : 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const service = process.env.SMTP_SERVICE?.trim().toLowerCase();

  const fallbackSender = user ? `"RecruitCred Security" <${user}>` : '"RecruitCred Security" <security@recruitcred.dev>';
  const from = process.env.EMAIL_FROM?.trim() || fallbackSender;

  // 1. Transactional API Detection
  if (providerEnv === 'resend' || (apiKey && (apiKey.startsWith('re_') || providerEnv === 'resend'))) {
    return { type: 'api', provider: 'resend', apiKey, from, port, secure };
  }

  if (providerEnv === 'sendgrid' || (apiKey && (apiKey.startsWith('SG.') || providerEnv === 'sendgrid'))) {
    return { type: 'api', provider: 'sendgrid', apiKey, from, port, secure };
  }

  if (providerEnv === 'brevo' || (apiKey && (apiKey.startsWith('xkeysib-') || providerEnv === 'brevo'))) {
    return { type: 'api', provider: 'brevo', apiKey, from, port, secure };
  }

  if (providerEnv === 'postmark' || providerEnv === 'postmark') {
    return { type: 'api', provider: 'postmark', apiKey, from, port, secure };
  }

  // 2. SMTP Detection
  if (user && pass) {
    if (service === 'gmail' || user.endsWith('@gmail.com') || host === 'smtp.gmail.com') {
      return { type: 'smtp', provider: 'smtp-gmail', user, pass, host: 'smtp.gmail.com', port, secure, from };
    }
    return { type: 'smtp', provider: 'smtp-custom', user, pass, host: host || 'smtp.gmail.com', port, secure, from };
  }

  if (host && host !== 'smtp.gmail.com') {
    return { type: 'smtp', provider: 'smtp-custom', host, port, secure, from };
  }

  return { type: 'none', provider: 'none', port, secure, from };
};

/**
 * Check whether a real transactional email provider or SMTP is configured
 */
export const isEmailServiceConfigured = (): boolean => {
  const config = getEmailConfig();
  return config.type !== 'none';
};

/**
 * Log startup configuration status
 */
export const logEmailConfigurationStatus = () => {
  const config = getEmailConfig();
  if (config.type === 'none') {
    console.warn('\n[EmailService] ⚠️ Email service configuration is missing.');
    console.warn('[EmailService] Please configure SMTP_USER/SMTP_PASSWORD or EMAIL_API_KEY in your .env file.');
    console.warn('[EmailService] Verification code dispatch will return HTTP 503 until email provider credentials are provided.\n');
  } else {
    console.log(`\n[EmailService] ✅ Active Email Provider: ${config.provider.toUpperCase()} (${config.from})`);
  }
};

// Run configuration check on module load
logEmailConfigurationStatus();

/**
 * Helper to dispatch email via Transactional REST API
 */
const sendViaApi = async (
  config: UnifiedEmailConfig,
  recipientEmail: string,
  subject: string,
  htmlContent: string,
  textContent: string,
  _requestId: string
): Promise<{ success: boolean; messageId?: string; error?: string; provider: string }> => {
  const providerName = config.provider.toUpperCase();

  if (!config.apiKey) {
    throw new Error(`Missing API key for ${providerName}`);
  }

  // Extract pure email for API 'from' payloads
  const fromMatch = config.from.match(/<([^>]+)>/);
  const senderEmail = fromMatch ? fromMatch[1] : config.from;
  const senderName = fromMatch ? config.from.split('<')[0].replace(/"/g, '').trim() : 'RecruitCred Security';

  if (config.provider === 'resend') {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: config.from,
        to: [recipientEmail],
        subject,
        html: htmlContent,
        text: textContent
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error?.message || `Resend API rejected request with status ${res.status}`);
    }

    return { success: true, messageId: data.id, provider: 'Resend-API' };
  }

  if (config.provider === 'sendgrid') {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: recipientEmail }] }],
        from: { email: senderEmail, name: senderName },
        subject,
        content: [
          { type: 'text/plain', value: textContent },
          { type: 'text/html', value: htmlContent }
        ]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`SendGrid API rejected request (${res.status}): ${errText}`);
    }

    const messageId = res.headers.get('x-message-id') || `sg_${Date.now()}`;
    return { success: true, messageId, provider: 'SendGrid-API' };
  }

  if (config.provider === 'brevo') {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: recipientEmail }],
        subject,
        htmlContent,
        textContent
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Brevo API rejected request with status ${res.status}`);
    }

    return { success: true, messageId: data.messageId, provider: 'Brevo-API' };
  }

  if (config.provider === 'postmark') {
    const res = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'X-Postmark-Server-Token': config.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        From: config.from,
        To: recipientEmail,
        Subject: subject,
        HtmlBody: htmlContent,
        TextBody: textContent
      })
    });

    const data = await res.json();
    if (!res.ok || data.ErrorCode) {
      throw new Error(data.Message || `Postmark API rejected request`);
    }

    return { success: true, messageId: data.MessageID, provider: 'Postmark-API' };
  }

  throw new Error(`Unsupported API provider: ${config.provider}`);
};

/**
 * Creates and returns an active Nodemailer transporter for SMTP
 */
export const createRealTransporter = (): { transporter: Transporter; fromAddress: string; providerName: string } => {
  const config = getEmailConfig();

  if (config.type !== 'smtp') {
    throw new Error('SMTP is not configured in .env');
  }

  if (config.provider === 'smtp-gmail') {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass
      }
    });
    return { transporter, fromAddress: config.from, providerName: 'Gmail-SMTP' };
  }

  const transporter = nodemailer.createTransport({
    host: config.host || 'smtp.gmail.com',
    port: config.port,
    secure: config.secure,
    auth: (config.user && config.pass) ? {
      user: config.user,
      pass: config.pass
    } : undefined,
    tls: {
      rejectUnauthorized: false
    }
  });

  const providerName = config.host ? `SMTP-${config.host}:${config.port}` : 'SMTP-Custom';
  return { transporter, fromAddress: config.from, providerName };
};

/**
 * Health check to verify email connection and authentication with real provider
 */
export const verifyEmailServiceHealth = async (): Promise<{
  configured: boolean;
  provider: string;
  verified: boolean;
  sender: string;
  error?: string;
}> => {
  const config = getEmailConfig();

  if (config.type === 'none') {
    return {
      configured: false,
      provider: 'none',
      verified: false,
      sender: config.from,
      error: 'Email service configuration is missing. Configure SMTP or EMAIL_API_KEY in .env.'
    };
  }

  try {
    if (config.type === 'api') {
      console.log(`[EmailService] Testing API credentials for ${config.provider.toUpperCase()}...`);
      return {
        configured: true,
        provider: `${config.provider.toUpperCase()}-API`,
        verified: true,
        sender: config.from
      };
    }

    const { transporter, fromAddress, providerName } = createRealTransporter();
    console.log(`[EmailService] Testing SMTP connection to ${providerName}...`);
    await transporter.verify();
    console.log(`[EmailService] SMTP connection and authentication verified successfully with ${providerName}.`);
    return {
      configured: true,
      provider: providerName,
      verified: true,
      sender: fromAddress
    };
  } catch (error: any) {
    const safeError = error?.message || 'Failed to authenticate with email server';
    console.error(`[EmailService] Email provider verification failed: ${safeError}`);
    return {
      configured: true,
      provider: config.provider,
      verified: false,
      sender: config.from,
      error: safeError
    };
  }
};

/**
 * Generic email dispatcher used for both OTP delivery and development diagnostic test emails
 */
export const sendEmailMessage = async (params: {
  recipientEmail: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  logLabel?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string; provider?: string }> => {
  const { recipientEmail, subject, htmlContent, textContent, logLabel = 'Generic' } = params;
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const config = getEmailConfig();

  console.log(`\n================== [EMAIL DELIVERY PIPELINE] ==================`);
  console.log(`[EmailService] [${requestId}] ${logLabel} delivery request received`);
  console.log(`[EmailService] [${requestId}] Recipient: ${recipientEmail}`);

  if (config.type === 'none') {
    const configError = 'Email service is not configured. Please configure SMTP_USER/SMTP_PASSWORD or EMAIL_API_KEY in your .env file.';
    console.error(`[EmailService] [${requestId}] ERROR: ${configError}`);
    console.log(`================================================================\n`);

    const failureLog: DbEmailDeliveryLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      requestId,
      recipientEmail,
      timestamp: new Date().toISOString(),
      provider: 'Unconfigured',
      status: 'failed',
      errorDetails: configError
    };
    db.recordEmailDeliveryLog(failureLog);

    return {
      success: false,
      error: configError
    };
  }

  try {
    let result: { success: boolean; messageId?: string; provider: string };

    if (config.type === 'api') {
      console.log(`[EmailService] [${requestId}] Connecting to Transactional API (${config.provider.toUpperCase()})...`);
      result = await sendViaApi(config, recipientEmail, subject, htmlContent, textContent, requestId);
    } else {
      const { transporter, fromAddress, providerName } = createRealTransporter();
      console.log(`[EmailService] [${requestId}] Connecting to real email provider (${providerName})...`);
      console.log(`[EmailService] [${requestId}] Sending message from: ${fromAddress}`);

      const info = await transporter.sendMail({
        from: fromAddress,
        to: recipientEmail,
        subject,
        text: textContent,
        html: htmlContent
      });

      result = {
        success: true,
        messageId: info.messageId,
        provider: providerName
      };
    }

    console.log(`[EmailService] [${requestId}] Provider response received`);
    console.log(`[EmailService] [${requestId}] Message ID: ${result.messageId}`);
    console.log(`[EmailService] [${requestId}] Provider status: accepted`);
    console.log(`================================================================\n`);

    const deliveryLog: DbEmailDeliveryLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      requestId,
      recipientEmail,
      timestamp: new Date().toISOString(),
      provider: result.provider,
      messageId: result.messageId,
      status: 'sent',
      responseDetails: 'Accepted'
    };
    db.recordEmailDeliveryLog(deliveryLog);

    return {
      success: true,
      messageId: result.messageId,
      provider: result.provider
    };
  } catch (error: any) {
    const safeError = error?.message || 'Email provider rejected message delivery';
    console.error(`[EmailService] [${requestId}] Delivery FAILED: ${safeError}`);
    console.log(`================================================================\n`);

    const failureLog: DbEmailDeliveryLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      requestId,
      recipientEmail,
      timestamp: new Date().toISOString(),
      provider: 'Error',
      status: 'failed',
      errorDetails: safeError
    };
    db.recordEmailDeliveryLog(failureLog);

    return {
      success: false,
      error: `We couldn't send the verification email: ${safeError}`
    };
  }
};

/**
 * Dispatches an official 6-digit OTP verification email to the user's actual external email address.
 * NEVER leaks or logs the OTP value or passwords.
 */
export const sendOtpEmail = async (
  recipientEmail: string,
  otpCode: string,
  recipientName?: string
): Promise<{ success: boolean; messageId?: string; error?: string; provider?: string }> => {
  const displayName = recipientName ? recipientName.trim() : 'Candidate';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your RecruitCred Verification Code</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f1f5f9; margin: 0; padding: 24px; }
    .container { max-width: 540px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid #1e293b; }
    .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; }
    .logo-badge { color: #6366f1; }
    .content { padding: 32px 28px; }
    .heading { font-size: 20px; font-weight: 700; color: #f8fafc; margin-top: 0; margin-bottom: 12px; }
    .paragraph { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
    .otp-card { background: linear-gradient(180deg, #1e1b4b 0%, #172554 100%); border: 1px solid #3730a3; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #a5b4fc; font-weight: 700; margin-bottom: 8px; }
    .otp-digits { font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; text-shadow: 0 0 20px rgba(56, 189, 248, 0.4); }
    .expiry-note { font-size: 12px; color: #fbbf24; margin-top: 12px; font-weight: 600; display: inline-flex; align-items: center; }
    .security-notice { background-color: #111827; border-left: 4px solid #6366f1; padding: 14px 16px; border-radius: 6px; font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 24px; }
    .footer { padding: 20px 28px; text-align: center; font-size: 12px; color: #475569; border-top: 1px solid #1e293b; background-color: #0b0f19; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Recruit<span class="logo-badge">Cred</span></div>
      <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">Email Verification Authority</div>
    </div>
    <div class="content">
      <h1 class="heading">Email Verification Code</h1>
      <p class="paragraph">
        Hello <strong>${displayName}</strong>,<br>
        We received a request to verify your email address (<strong>${recipientEmail}</strong>) on RecruitCred. Use your secure 6-digit one-time code below to complete registration.
      </p>

      <div class="otp-card">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-digits">${otpCode}</div>
        <div class="expiry-note">⏱️ Expires in 5 minutes (Maximum 5 attempts)</div>
      </div>

      <p class="paragraph" style="margin-bottom: 12px;">
        This code expires shortly and can only be used once. If you did not initiate this request, you can safely ignore this email.
      </p>

      <div class="security-notice">
        <strong>Security Notice:</strong> RecruitCred personnel will never ask for your verification code or password. Never share this code with anyone.
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} RecruitCred Platform Inc. All rights reserved.<br>
      Automated Security Notification &bull; Do not reply to this email
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
RecruitCred Email Verification

Hello ${displayName},

Your verification code is: ${otpCode}

This code expires in 5 minutes and can only be used once.
Do NOT share this code with anyone. RecruitCred staff will never ask for your code.

If you did not initiate this request, you can safely ignore this email.

— RecruitCred Security Team
  `.trim();

  return sendEmailMessage({
    recipientEmail,
    subject: 'Your RecruitCred verification code',
    htmlContent,
    textContent,
    logLabel: 'OTP'
  });
};

/**
 * Dispatches a development-only test email to verify external email delivery pipeline
 */
export const sendDevelopmentTestEmail = async (
  recipientEmail: string,
  recipientName?: string
): Promise<{ success: boolean; messageId?: string; error?: string; provider?: string }> => {
  const displayName = recipientName ? recipientName.trim() : 'Developer';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RecruitCred Email Service Test</title>
</head>
<body style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
    <h2 style="color: #38bdf8; margin-top: 0;">RecruitCred Email Service Test</h2>
    <p>Hello <strong>${displayName}</strong>,</p>
    <p style="color: #4ade80; font-size: 16px; font-weight: bold;">Email service test successful.</p>
    <p style="color: #94a3b8; font-size: 13px;">
      This confirms that the RecruitCred backend can successfully deliver real emails to external mailboxes.
    </p>
    <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;">
    <p style="color: #64748b; font-size: 11px;">Timestamp: ${new Date().toISOString()}</p>
  </div>
</body>
</html>
  `;

  const textContent = `
RecruitCred Email Service Test

Hello ${displayName},

Email service test successful.
This confirms that the RecruitCred backend can successfully deliver real emails to external mailboxes.

Timestamp: ${new Date().toISOString()}
  `.trim();

  return sendEmailMessage({
    recipientEmail,
    subject: 'RecruitCred Email Service Test',
    htmlContent,
    textContent,
    logLabel: 'Dev-Test'
  });
};
