import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  X,
  Zap,
  Lock,
  Mail,
  User as UserIcon,
  Briefcase,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup'
}) => {
  const { login, signup, loginAsDemoUser } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Full-Stack Developer');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required fields.');
        return;
      }
      signup(name.trim(), email.trim(), password.trim(), role);
      onClose();
    } else {
      if (!email.trim()) {
        setError('Please enter your email.');
        return;
      }
      const success = await login(email.trim(), password.trim());
      if (success) {
        onClose();
      } else {
        setError('Invalid credentials.');
      }
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    loginAsDemoUser(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Ambient Corner Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {mode === 'signup' ? 'Create Placement Profile' : 'Sign in to RecruitCred'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === 'signup'
                ? 'Don’t just tell recruiters what you can do. Give them evidence.'
                : 'Access verified credentials, assessments, & placement tools.'}
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.sharma@iitb.ac.in"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Specialization
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Full-Stack Developer">Full-Stack Developer</option>
                  <option value="Frontend Specialist">Frontend Specialist</option>
                  <option value="Backend Architect">Backend Architect</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Lead UI/UX Designer">Lead UI/UX Designer</option>
                  <option value="Systems & Mobile Engineer">Systems & Mobile Engineer</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {mode === 'signup' ? 'Create Profile & Enter Dashboard' : 'Sign In to Dashboard'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </form>

        {/* Quick Access Strip */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Access Portals:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('user-rahul')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors text-xs flex items-center gap-2.5"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                alt="Student"
                className="w-7 h-7 rounded-lg object-cover border border-slate-700"
              />
              <div className="truncate">
                <div className="font-bold text-white truncate">Student Candidate</div>
                <div className="text-[10px] text-emerald-400">92% Python ✓</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('user-rohan')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors text-xs flex items-center gap-2.5"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
                alt="Recruiter"
                className="w-7 h-7 rounded-lg object-cover border border-slate-700"
              />
              <div className="truncate">
                <div className="font-bold text-white truncate">Recruiter Lead</div>
                <div className="text-[10px] text-indigo-300">Team Alpha Lead</div>
              </div>
            </button>
          </div>
        </div>

        {/* Toggle mode */}
        <div className="text-center text-xs text-slate-400 mt-4">
          {mode === 'signup' ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className="text-brand-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to RecruitCred?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className="text-brand-400 font-bold hover:underline"
              >
                Create an account
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
