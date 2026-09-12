import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRO_FEATURES, PAYMENT_CONFIG } from '../../services/payment/paymentConfig';
import { ProBadge } from './ProBadge';
import { ProCheckoutModal } from './ProCheckoutModal';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  CreditCard,
  History,
  Calendar,
  Layers,
  ArrowUpRight,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const RecruitCredProView: React.FC = () => {
  const { currentUser, paymentTransactions, cancelPro } = useApp();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);

  const isPro = Boolean(currentUser.isPro && currentUser.proSubscription?.status === 'active');
  const sub = currentUser.proSubscription;

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your RecruitCred Pro subscription? Your priority visibility will remain active until the end of the current billing cycle.')) {
      return;
    }

    try {
      setIsCancelling(true);
      await cancelPro();
      setCancelNotice('Your subscription has been cancelled. You will maintain access until the end of the current period.');
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#171A2B] via-[#1F233B] to-[#171A2B] border border-[#252A46] p-6 md:p-10 overflow-hidden shadow-xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-[#8B7CFF] text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            RecruitCred Pro
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            Get more visibility. <span className="text-[#8B7CFF]">Not more credibility.</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
            RecruitCred Pro gives you priority profile visibility when candidates have comparable skill relevance and eligibility. It does not increase your credibility score, verification status, assessment score, or evidence strength.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {isPro ? (
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Pro Subscriber
                <ProBadge size="sm" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E0] text-white font-semibold text-sm transition shadow-lg shadow-[#6C63FF]/25 flex items-center gap-2 cursor-pointer"
              >
                Upgrade to Pro (₹{PAYMENT_CONFIG.planPriceINR} / mo)
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

            <span className="text-xs text-gray-400">
              ₹{PAYMENT_CONFIG.planPriceINR} / month · Standard INR billing · Cancel anytime
            </span>
          </div>
        </div>

        {/* Subtle geometric background decoration (no gold neon) */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#6C63FF]/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Cancellation Notice Banner */}
      {cancelNotice && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{cancelNotice}</span>
        </div>
      )}

      {/* 2. Core Pricing & Subscription Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: What Pro provides & Pricing Card */}
        <div className="md:col-span-2 rounded-2xl bg-[#171A2B] border border-[#252A46] p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">RecruitCred Pro Plan</h2>
                {isPro && <ProBadge size="md" />}
              </div>
              <p className="text-xs text-gray-400 mt-1">Be more visible when your profile is equally relevant.</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-white">₹{PAYMENT_CONFIG.planPriceINR}</span>
              <span className="text-xs text-gray-400 block">/ month</span>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {PRO_FEATURES.map((feat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#0D0E15] border border-[#252A46] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8B7CFF]" />
                      {feat.title}
                    </span>
                    <span className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#252A46] text-gray-300">
                      {feat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="p-4 rounded-xl bg-[#0D0E15] border border-[#252A46] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-white">
                {isPro ? 'Your subscription is active' : 'Ready to increase recruiter discovery?'}
              </p>
              <p className="text-[11px] text-gray-400">
                {isPro
                  ? `Next renewal date: ${sub?.nextBillingDate || 'In 30 days'}`
                  : `Start your ₹${PAYMENT_CONFIG.planPriceINR}/month plan today with secure Indian payment gateway checkout.`}
              </p>
            </div>

            {isPro ? (
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isCancelling ? 'Processing…' : 'Cancel Subscription'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E0] text-white font-semibold text-xs transition shrink-0 shadow-md shadow-[#6C63FF]/20 cursor-pointer"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Right Col: Active Plan Card / Subscription Management */}
        <div className="rounded-2xl bg-[#171A2B] border border-[#252A46] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#252A46]">
              <CreditCard className="w-4 h-4 text-[#8B7CFF]" />
              <h3 className="text-sm font-bold text-white">Your Pro Plan</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  isPro 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {isPro ? 'Active' : 'Free Tier'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Plan</span>
                <span className="font-semibold text-white">{isPro ? 'RecruitCred Pro' : 'Standard (Free)'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price</span>
                <span className="font-semibold text-white">{isPro ? `₹${PAYMENT_CONFIG.planPriceINR} / month` : '₹0 / forever'}</span>
              </div>

              {isPro && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Started On</span>
                    <span className="font-mono text-gray-300">{sub?.startedAt || 'Current Cycle'}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Next Expiry / Billing</span>
                    <span className="font-mono text-emerald-400 font-semibold">{sub?.expiresAt || '30 days'}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Payment Gateway</span>
                    <span className="font-mono text-gray-300 uppercase">{sub?.provider || 'Razorpay'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#252A46]">
            <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
              {isPro
                ? 'Your profile receives priority visibility among comparable candidates on recruiter search results.'
                : 'Free users enjoy full access to assessments, verification, projects, and fair merit-based ranking.'}
            </p>
            {!isPro && (
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-2.5 rounded-xl bg-[#252A46] hover:bg-[#2e3458] text-white text-xs font-semibold transition text-center cursor-pointer"
              >
                Upgrade for ₹{PAYMENT_CONFIG.planPriceINR}/mo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Core Principle: Never Sell Credibility (Strict Transparency) */}
      <div className="rounded-2xl bg-[#171A2B] border border-[#252A46] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Never Sell Credibility</h2>
            <p className="text-xs text-gray-400">The core RecruitCred transparency and merit commitment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* What Pro DOES */}
          <div className="p-5 rounded-xl bg-[#0D0E15] border border-emerald-500/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              What Pro Does
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Priority profile visibility when candidates have <strong>comparable skill relevance and eligibility</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Subtle Pro indicator on profile and candidate card.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Search impression and recruiter engagement analytics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Advanced opportunity matching breakdowns.</span>
              </li>
            </ul>
          </div>

          {/* What Pro NEVER Does */}
          <div className="p-5 rounded-xl bg-[#0D0E15] border border-red-500/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              What Pro Never Does
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Does <strong>NOT</strong> increase your Credibility Score.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Does <strong>NOT</strong> increase assessment scores or marks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Does <strong>NOT</strong> turn claimed skills into verified skills.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Does <strong>NOT</strong> override lower relevance or lack of eligibility.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Clear Principle Quote */}
        <div className="p-4 rounded-xl bg-[#252A46]/30 border border-[#252A46] text-center">
          <p className="text-sm font-semibold text-white">
            "Money can improve visibility. Money cannot buy credibility."
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Verification, assessment integrity, evidence strength, and credibility standards remain identical for every candidate.
          </p>
        </div>
      </div>

      {/* 4. Fair Recruiter Ranking Explanation */}
      <div className="rounded-2xl bg-[#171A2B] border border-[#252A46] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-[#8B7CFF] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">How Fair Recruiter Ranking Works</h2>
            <p className="text-xs text-gray-400">Strict 7-tier ordering ensures merit always comes first</p>
          </div>
        </div>

        {/* 7-Tier Ordering visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[#0D0E15] border border-[#252A46]">
            <span className="text-[10px] font-bold text-[#8B7CFF] uppercase">Tier 1 & 2</span>
            <h4 className="text-xs font-bold text-white mt-1">Skill Relevance & Eligibility</h4>
            <p className="text-[11px] text-gray-400 mt-1">Required technical stack match & academic cutoffs.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0D0E15] border border-[#252A46]">
            <span className="text-[10px] font-bold text-[#8B7CFF] uppercase">Tier 3 & 4</span>
            <h4 className="text-xs font-bold text-white mt-1">Verified Skills & Assessments</h4>
            <p className="text-[11px] text-gray-400 mt-1">Proctored assessment scores and verified badges.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0D0E15] border border-[#252A46]">
            <span className="text-[10px] font-bold text-[#8B7CFF] uppercase">Tier 5 & 6</span>
            <h4 className="text-xs font-bold text-white mt-1">Project & Experience Relevance</h4>
            <p className="text-[11px] text-gray-400 mt-1">GitHub proof sources, live demos & work background.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/30">
            <span className="text-[10px] font-bold text-[#8B7CFF] uppercase">Tier 7 (Tie-Breaker)</span>
            <h4 className="text-xs font-bold text-white mt-1">Pro Priority Visibility</h4>
            <p className="text-[11px] text-gray-300 mt-1">Priority among otherwise comparable candidate scores.</p>
          </div>
        </div>

        {/* Comparison Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#0D0E15] border border-[#252A46]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">Case 1: Relevance Disparity</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">Free Candidate Wins</span>
            </div>
            <div className="space-y-1.5 text-gray-300 text-[11px]">
              <div className="p-2 rounded bg-[#171A2B] border border-[#252A46]">
                <strong>Candidate A (Free):</strong> Highly relevant skills, Verified, Eligible <span className="text-emerald-400 font-bold">→ Rank 1</span>
              </div>
              <div className="p-2 rounded bg-[#171A2B] border border-[#252A46]">
                <strong>Candidate B (Pro):</strong> Less relevant skills, Pro Subscriber <span className="text-gray-400">→ Rank 2</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Pro does not override relevance. Candidate A remains ahead.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0E15] border border-[#252A46]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">Case 2: Comparable Relevance</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#6C63FF]/20 text-[#8B7CFF] font-semibold">Pro Priority Applied</span>
            </div>
            <div className="space-y-1.5 text-gray-300 text-[11px]">
              <div className="p-2 rounded bg-[#171A2B] border border-[#252A46]">
                <strong>Candidate B (Pro):</strong> Python, Verified, Eligible, Pro Subscriber <span className="text-[#8B7CFF] font-bold">→ Priority Visibility</span>
              </div>
              <div className="p-2 rounded bg-[#171A2B] border border-[#252A46]">
                <strong>Candidate A (Free):</strong> Python, Verified, Eligible, Free <span className="text-gray-400">→ Standard Visibility</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              When candidates have comparable relevance, Pro provides priority visibility.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Payment History */}
      <div className="rounded-2xl bg-[#171A2B] border border-[#252A46] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#252A46] text-gray-300 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Payment History</h2>
              <p className="text-xs text-gray-400">Receipts and transaction records for your RecruitCred subscriptions</p>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {paymentTransactions.length} {paymentTransactions.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {paymentTransactions.length === 0 ? (
          <div className="text-center py-10 rounded-xl bg-[#0D0E15] border border-[#252A46]">
            <CreditCard className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No payment transactions found.</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Your transaction history will be recorded here when you subscribe to RecruitCred Pro.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0E15] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#252A46]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A46]">
                {paymentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#1F233B]/40 transition">
                    <td className="py-3 px-4 text-gray-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {txn.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {txn.planName}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">₹{txn.amount} INR</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 capitalize">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {txn.status === 'captured' ? 'Paid' : txn.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400">{txn.paymentId}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`Receipt #${txn.paymentId}\nPlan: ${txn.planName}\nAmount: ₹${txn.amount} INR\nStatus: Paid\nDate: ${txn.date}\nMerchant: RecruitCred (6005420014@ybl)`)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#8B7CFF] hover:text-white transition font-medium"
                      >
                        <FileText className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <ProCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
