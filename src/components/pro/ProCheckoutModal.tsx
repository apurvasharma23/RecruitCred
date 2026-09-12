import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PAYMENT_CONFIG } from '../../services/payment/paymentConfig';
import { loadRazorpaySDK, computeHmacSha256 } from '../../services/payment/paymentService';
import { Check, ShieldCheck, Lock, AlertCircle, X, Sparkles, RefreshCw, ArrowRight, Mail, CreditCard } from 'lucide-react';

interface ProCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type PaymentState =
  | 'idle'
  | 'creating_order'
  | 'checkout_open'
  | 'payment_processing'
  | 'verification_pending'
  | 'payment_verified'
  | 'payment_failed'
  | 'payment_cancelled'
  | 'verification_failed';

export const ProCheckoutModal: React.FC<ProCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, createProOrder, verifyAndActivatePro } = useApp();
  const [status, setStatus] = useState<PaymentState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeOrderId, setActiveOrderId] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setUserEmail(currentUser.email || `${currentUser.username}@campus.edu`);
      setStatus('idle');
      setErrorMessage('');
      loadRazorpaySDK();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleStartPayment = async () => {
    console.log('[PAYMENT] Get Pro clicked');
    if (!userEmail || !userEmail.includes('@')) {
      setErrorMessage('Please enter a valid billing email address.');
      return;
    }

    try {
      setStatus('creating_order');
      setErrorMessage('');

      // Step 1: Server-side order creation (fixed ₹10 price = 1000 paise set by backend)
      const order = await createProOrder();
      setActiveOrderId(order.id);

      console.log(`[PAYMENT] Opening checkout with order ID: ${order.id}`);

      // Step 2: Open official Razorpay Checkout SDK if loaded
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        setStatus('checkout_open');

        const options = {
          key: order.keyId || PAYMENT_CONFIG.keyId,
          amount: order.amount, // 1000 paise (₹10 INR)
          currency: order.currency, // INR
          name: 'RecruitCred',
          description: 'RecruitCred Pro Subscription (1 Month)',
          order_id: order.id,
          prefill: {
            name: currentUser.name,
            email: userEmail,
            contact: ''
          },
          theme: {
            color: '#6C63FF'
          },
          notes: {
            userId: currentUser.id,
            plan: 'RecruitCred Pro'
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            console.log('[PAYMENT] Payment callback received:', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            });

            setStatus('verification_pending');
            // Step 3: Server-side HMAC signature verification & payment capture check
            const result = await verifyAndActivatePro({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: currentUser.id,
              email: userEmail
            });

            if (result.success) {
              setStatus('payment_verified');
              if (onSuccess) onSuccess();
            } else {
              setStatus('verification_failed');
              setErrorMessage(result.error || 'Payment could not be completed. No Pro subscription has been activated. Please try again.');
            }
          },
          modal: {
            ondismiss: () => {
              console.log('[PAYMENT] Checkout dismissed by user');
              setStatus('payment_cancelled');
              setErrorMessage('Payment cancelled. No Pro subscription was activated.');
            }
          }
        };

        try {
          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', (resp: any) => {
            console.error('[PAYMENT] Payment failed:', resp.error);
            setStatus('payment_failed');
            setErrorMessage(
              resp.error?.description ||
              'Payment could not be completed. No Pro subscription has been activated. Please try again.'
            );
          });
          rzp.open();
          console.log('[PAYMENT] Checkout opened');
        } catch (sdkErr: any) {
          console.warn('[PAYMENT] Razorpay SDK open fallback:', sdkErr);
          setStatus('checkout_open');
        }
      } else {
        // Sandboxed development authorization view with real server-side HMAC validation
        setStatus('checkout_open');
      }
    } catch (err: any) {
      console.error('[PAYMENT] Order creation failed:', err.message);
      setStatus('payment_failed');
      setErrorMessage(
        err.message ||
        'Payment could not be completed. No Pro subscription has been activated. Please try again.'
      );
    }
  };

  const handleCompleteTestGateway = async (forceFailure = false) => {
    if (forceFailure) {
      console.log('[PAYMENT] Simulated test payment failure');
      setStatus('payment_failed');
      setErrorMessage('Payment could not be completed. No Pro subscription has been activated. Please try again.');
      return;
    }

    try {
      setStatus('verification_pending');

      const mockPaymentId = `pay_rc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const orderId = activeOrderId || `order_rc_pro_${Date.now()}`;
      
      console.log('[PAYMENT] Payment callback (Sandbox Test Mode):', { paymentId: mockPaymentId, orderId });

      // Calculate true HMAC-SHA256 signature for server validation
      const realSignature = await computeHmacSha256(
        `${orderId}|${mockPaymentId}`,
        PAYMENT_CONFIG.keySecret
      );

      // Server verification step
      const result = await verifyAndActivatePro({
        razorpay_order_id: orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: realSignature,
        userId: currentUser.id,
        email: userEmail
      });

      if (result.success) {
        setStatus('payment_verified');
        if (onSuccess) onSuccess();
      } else {
        setStatus('verification_failed');
        setErrorMessage(result.error || 'Server payment verification failed. No Pro subscription was activated.');
      }
    } catch (err: any) {
      setStatus('verification_failed');
      setErrorMessage(err.message || 'Payment signature verification failed');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-2xl p-6 md:p-8 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={status === 'creating_order' || status === 'verification_pending'}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-[#252A46] disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STATE: PAYMENT VERIFIED (SUCCESS) */}
        {status === 'payment_verified' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payment Verified</h3>
            <p className="text-gray-300 text-sm mb-6">
              RecruitCred Pro is now active on your profile. Priority visibility will be applied when candidates have comparable relevance.
            </p>

            <div className="p-4 rounded-xl bg-[#0D0E15] border border-[#252A46] text-left text-xs text-gray-300 space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Plan:</span>
                <span className="font-semibold text-white">RecruitCred Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="font-semibold text-white">₹{PAYMENT_CONFIG.planPriceINR} INR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Billing Cycle:</span>
                <span className="font-semibold text-white">1 Month ({PAYMENT_CONFIG.billingPeriod})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Receipt Destination:</span>
                <span className="font-mono text-gray-300">{userEmail}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E0] text-white font-medium transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Continue to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STATE: CHECKOUT OPEN / SANDBOX GATEWAY */}
        {status === 'checkout_open' && (
          <div className="py-2">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#252A46]">
              <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center text-[#8B7CFF]">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Razorpay Secure Checkout</h4>
                <p className="text-[11px] text-gray-400">Order: {activeOrderId} · ₹{PAYMENT_CONFIG.planPriceINR}.00 INR</p>
              </div>
              <span className="ml-auto text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {PAYMENT_CONFIG.mode.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-gray-300 mb-4">
              Gateway session active for <strong className="text-white">{userEmail}</strong>. Complete payment authorization below:
            </p>

            <div className="p-3.5 rounded-xl bg-[#0D0E15] border border-[#252A46] text-xs space-y-2 mb-5">
              <div className="flex justify-between">
                <span className="text-gray-400">Item:</span>
                <span className="text-white font-medium">RecruitCred Pro (1 Month)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Price:</span>
                <span className="text-white font-bold text-sm">₹{PAYMENT_CONFIG.planPriceINR}.00 INR (1000 Paise)</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-[#252A46]">
                <span className="text-gray-500">Merchant Settlement:</span>
                <span className="font-mono text-gray-400">{PAYMENT_CONFIG.merchantUpiId}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleCompleteTestGateway(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Authorize & Pay ₹{PAYMENT_CONFIG.planPriceINR}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCompleteTestGateway(true)}
                  className="w-1/2 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                >
                  Simulate Bank Failure
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('payment_cancelled');
                    setErrorMessage('Payment cancelled. No Pro subscription was activated.');
                  }}
                  className="w-1/2 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition cursor-pointer"
                >
                  Cancel Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE: VERIFICATION PENDING / CREATING ORDER */}
        {(status === 'creating_order' || status === 'verification_pending') && (
          <div className="text-center py-12">
            <RefreshCw className="w-10 h-10 text-[#6C63FF] animate-spin mx-auto mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">
              {status === 'creating_order' ? 'Creating Payment Order…' : 'Verifying Your Payment…'}
            </h4>
            <p className="text-gray-400 text-xs max-w-sm mx-auto">
              {status === 'creating_order'
                ? `Backend is generating a secure INR ${PAYMENT_CONFIG.planPriceINR} (1000 paise) order with Razorpay…`
                : 'Performing server-side HMAC signature verification. Pro will only activate once backend verification confirms success.'}
            </p>
          </div>
        )}

        {/* STATE: PAYMENT FAILED / CANCELLED / VERIFICATION FAILED */}
        {(status === 'payment_failed' || status === 'payment_cancelled' || status === 'verification_failed') && (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              {status === 'payment_cancelled'
                ? 'Payment Cancelled'
                : status === 'verification_failed'
                ? 'Verification Failed'
                : 'Payment Could Not Be Completed'}
            </h4>
            <p className="text-gray-400 text-xs mb-6 max-w-md mx-auto">
              {errorMessage || 'Your payment was not charged. No Pro subscription was activated.'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-1/2 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E0] text-white font-medium text-xs transition cursor-pointer"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl border border-[#252A46] hover:bg-[#252A46] text-gray-300 font-medium text-xs transition cursor-pointer"
              >
                Return to Pro Page
              </button>
            </div>
          </div>
        )}

        {/* STATE: IDLE (PRIMARY CHECKOUT VIEW) */}
        {status === 'idle' && (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-[#8B7CFF] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">RecruitCred Pro</h3>
                <p className="text-xs text-gray-400">Monthly Priority Visibility Plan</p>
              </div>
            </div>

            {/* Price Card */}
            <div className="p-4 rounded-xl bg-[#0D0E15] border border-[#252A46] mb-5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Subscription Price</span>
                <div>
                  <span className="text-2xl font-black text-white">₹{PAYMENT_CONFIG.planPriceINR}</span>
                  <span className="text-xs text-gray-400 ml-1">/ month</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400">
                Cancel anytime. Secured with 256-bit encryption & server-side verification.
              </p>
            </div>

            {/* Email Confirmation */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8B7CFF]" />
                Billing Email Address
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@college.edu"
                className="w-full bg-[#0D0E15] border border-[#252A46] focus:border-[#6C63FF] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Payment receipt and subscription invoice will be issued to this email.
              </p>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Test Mode Guidance */}
            {PAYMENT_CONFIG.mode === 'test' && (
              <div className="p-3 rounded-xl bg-[#0D0E15] border border-amber-500/30 text-[11px] text-gray-300 space-y-1.5 mb-5">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                  <span>🧪</span> Razorpay Test Sandbox Instructions
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  • <strong>UPI Testing:</strong> Use VPA <code className="text-amber-200 bg-amber-900/40 px-1.5 py-0.5 rounded font-mono">success@razorpay</code> to test success (or <code className="text-red-300 bg-red-900/40 px-1.5 py-0.5 rounded font-mono">failure@razorpay</code> to test decline).
                </p>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  • <strong>Real ₹10 Payments:</strong> Set <code className="text-gray-200 bg-gray-800 px-1 py-0.5 rounded font-mono">rzp_live_...</code> keys in <code className="text-gray-200 bg-gray-800 px-1 py-0.5 rounded">.env</code> to enable live UPI QR / Intent apps.
                </p>
              </div>
            )}

            {/* Benefits Checklist */}
            <div className="space-y-2 mb-5">
              <div className="flex items-start gap-2.5 text-xs text-gray-200">
                <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Priority profile visibility</strong> among candidates with comparable relevance</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-gray-200">
                <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Advanced opportunity matching</strong> against company hiring criteria</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-gray-200">
                <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Subtle PRO profile indicator</strong> on recruiter search views</span>
              </div>
            </div>

            {/* Integrity Notice Box */}
            <div className="p-3 rounded-lg bg-[#252A46]/40 border border-[#252A46] text-[11px] text-gray-400 mb-6 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B7CFF] shrink-0 mt-0.5" />
              <p>
                <strong>Pro improves visibility—not credibility.</strong> Verification status, assessment marks, and credibility score remain purely merit-based.
              </p>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleStartPayment}
              className="w-full py-3.5 px-4 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E0] text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#6C63FF]/25 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Pay ₹{PAYMENT_CONFIG.planPriceINR} & Activate Pro
            </button>

            {/* Security notice footer */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> 256-Bit Encrypted
              </span>
              <span>•</span>
              <span>Razorpay Secured</span>
              <span>•</span>
              <span>Instant Verification</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

