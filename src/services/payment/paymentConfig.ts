/**
 * RecruitCred Pro Payment & Gateway Configuration
 * Supporting Razorpay INR subscriptions and merchant settlements.
 */

export const PRO_ENABLED = false;
export const PAYMENTS_ENABLED = false;

export interface PaymentConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  planId: string;
  planName: string;
  planPriceINR: number; // ₹10 INR
  amountInPaise: number; // 1000 paise (Smallest currency unit for Razorpay)
  billingPeriod: string;
  mode: 'test' | 'live';
  merchantUpiId: string; // Server/provider settlement destination
  currency: string;
}

const getEnv = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key]!;
    }
  } catch {}
  return fallback;
};

// In production, these are populated via secure environment variables.
const rawKeyId = getEnv('VITE_RAZORPAY_KEY_ID', getEnv('RAZORPAY_KEY_ID', 'rzp_test_RecruitCred2026'));
const rawKeySecret = getEnv('RAZORPAY_KEY_SECRET', getEnv('PAYMENT_KEY_SECRET', 'rc_sec_sandbox_vault_9482'));
const rawWebhookSecret = getEnv('RAZORPAY_WEBHOOK_SECRET', getEnv('PAYMENT_WEBHOOK_SECRET', 'whsec_rc_pro_webhook_signature'));
const rawMode = (getEnv('PAYMENT_MODE', getEnv('VITE_PAYMENT_MODE', 'test')) as 'test' | 'live');

export const PAYMENT_CONFIG: PaymentConfig = {
  keyId: rawKeyId,
  keySecret: rawKeySecret,
  webhookSecret: rawWebhookSecret,
  planId: getEnv('RAZORPAY_PLAN_ID', getEnv('PAYMENT_PLAN_ID', 'plan_rc_pro_monthly_10')),
  planName: 'RecruitCred Pro',
  planPriceINR: 10, // ₹10 INR
  amountInPaise: 1000, // 1000 paise
  billingPeriod: '1 month',
  mode: rawMode,
  merchantUpiId: '6005420014@ybl',
  currency: 'INR'
};

/**
 * Validates whether real Razorpay credentials are provided in environment
 */
export const isLiveRazorpayConfigured = (): boolean => {
  const isKeyReal = PAYMENT_CONFIG.keyId.startsWith('rzp_test_') || PAYMENT_CONFIG.keyId.startsWith('rzp_live_');
  const isNotDefaultPlaceholder = !PAYMENT_CONFIG.keyId.includes('RecruitCred2026');
  return isKeyReal && isNotDefaultPlaceholder && PAYMENT_CONFIG.keySecret.length >= 14;
};

export const PRO_FEATURES = [
  {
    title: 'Priority Profile Visibility',
    description: 'Appear ahead when recruiters search and compare candidates with equally relevant verified competencies.',
    badge: 'Visibility'
  },
  {
    title: 'Advanced Opportunity Matching',
    description: 'Get deep match analysis against company hiring criteria, cutoffs, and required tech stacks.',
    badge: 'Matching'
  },
  {
    title: 'Profile Discovery Analytics',
    description: 'Track recruiter views, search appearances, and skill discovery trends across campus drives.',
    badge: 'Analytics'
  },
  {
    title: 'Recruiter Search Insights',
    description: 'Understand which verified skills in your stack are generating the most recruiter engagement.',
    badge: 'Insights'
  },
  {
    title: 'Subtle Pro Indicator',
    description: 'Distinguished Pro tag on your candidate card without altering your credibility score or verification.',
    badge: 'Badge'
  }
];

export const PRO_INTEGRITY_NOTICE = `RecruitCred Pro gives you priority profile visibility when candidates have comparable skill relevance and eligibility. It does not increase your credibility score, verification status, assessment score, or evidence strength. Money can improve visibility. Money cannot buy credibility.`;
