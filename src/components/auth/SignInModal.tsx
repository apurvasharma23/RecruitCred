import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  X,
  Lock,
  Mail,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToGetStarted: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSwitchToGetStarted
}) => {
  const { login, loginAsDemoUser } = useApp();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showForgotToast, setShowForgotToast] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your RecruitCred ID or registered email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    const success = login(identifier.trim(), password.trim());
    if (success) {
      onClose();
    } else {
      setError('Incorrect RecruitCred ID or password. Please try again.');
    }
  };

  const handleDemoLogin = (userId: string) => {
    loginAsDemoUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close sign in dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Sign In to RecruitCred
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Access your verified credentials, assessments, & placement tools.
            </p>
          </div>
        </div>

        {/* Forgot Password Notification */}
        {showForgotToast && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Password reset instructions simulated to your registered email.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-in slide-in-from-top duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              RecruitCred ID or Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. rahulsharma or student@college.edu"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                autoFocus
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotToast(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch to Get Started */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don’t have a RecruitCred account?{' '}
            <button
              onClick={() => {
                onClose();
                onSwitchToGetStarted();
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline decoration-indigo-500/40 ml-1"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Hackathon Evaluation Fast-Track */}
        <div className="mt-5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Judge / Presentation Fast-Track:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('user-rahul')}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-[11px] text-indigo-300 font-medium text-left truncate transition-colors"
            >
              Sign In: <strong>Student Account</strong>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('user-rohan')}
              className="px-2.5 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-[11px] text-amber-300 font-medium text-left truncate transition-colors"
            >
              Sign In: <strong>Recruiter Lead</strong>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
