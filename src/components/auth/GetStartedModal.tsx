import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  POPULAR_COLLEGES,
  ENGINEERING_BRANCHES,
  GRADUATION_YEARS,
  POPULAR_STUDENT_SKILLS
} from '../../config/constants';
import {
  apiSendOtp,
  apiVerifyOtp,
  apiCompleteRegistration,
  apiCheckUsername
} from '../../services/auth/authService';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  GitBranch,
  Code2,
  Check,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

type OnboardingStep = 1 | 2 | 3 | 4;

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignIn
}) => {
  const { syncUserSession } = useApp();

  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);

  // Step 1: Account Type
  const [accountType, setAccountType] = useState<'student' | 'recruiter'>('student');

  // Step 2: Credentials & User ID
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [regToken, setRegToken] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 3: College & Education
  const [collegeSearch, setCollegeSearch] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('Thapar Institute of Engineering & Technology');
  const [customCollege, setCustomCollege] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [gradYear, setGradYear] = useState('2026');

  // Step 4: Optional Profile & Skills
  const [githubUsername, setGithubUsername] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'React', 'C++']);

  // Loading & Validation errors
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset entire form on modal open/close to ensure zero residual state
  const resetFormState = () => {
    setCurrentStep(1);
    setAccountType('student');
    setFullName('');
    setEmail('');
    setUniqueId('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setEmailSubmitted(false);
    setRegToken(null);
    setResendCooldown(0);
    setCollegeSearch('');
    setCustomCollege('');
    setGithubUsername('');
    setLeetcodeUsername('');
    setSelectedSkills(['Python', 'React', 'C++']);
    setIsLoading(false);
    setIsCheckingId(false);
    setIsIdAvailable(null);
    setError(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetFormState();
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Debounced server-side check for Unique User ID availability
  useEffect(() => {
    const trimmedId = uniqueId.trim().toLowerCase();
    if (trimmedId.length < 3 || !/^[a-zA-Z0-9_]+$/.test(trimmedId)) {
      setIsIdAvailable(null);
      return;
    }

    let isCurrent = true;
    setIsCheckingId(true);
    const timeout = setTimeout(async () => {
      const available = await apiCheckUsername(trimmedId);
      if (isCurrent) {
        setIsIdAvailable(available);
        setIsCheckingId(false);
      }
    }, 300);

    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [uniqueId]);

  if (!isOpen) return null;

  const isEmailValidFormat = (val: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  };

  // Filtered colleges for search selector
  const filteredColleges = POPULAR_COLLEGES.filter(c =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    c.shortName.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    c.location.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const isIdValidFormat = uniqueId.trim().length >= 3 && /^[a-zA-Z0-9_]+$/.test(uniqueId.trim());

  // Step 1 -> Step 2
  const handleNextFromStep1 = () => {
    setError(null);
    setCurrentStep(2);
  };

  // Step 2 Submission -> Call POST /api/auth/send-otp
  const handleSendOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !isEmailValidFormat(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!uniqueId.trim()) {
      setError('Please choose a unique RecruitCred ID.');
      return;
    }
    if (!isIdValidFormat) {
      setError('RecruitCred ID must be at least 3 characters and contain only letters, numbers, or underscores.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setIsLoading(true);
    const result = await apiSendOtp({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      uniqueUserId: uniqueId.trim().toLowerCase(),
      password,
      confirmPassword,
      accountType
    });
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "We couldn't send the verification email. Please try again.");
      return;
    }

    setResendCooldown(30);
    setEmailSubmitted(true);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setError(null);
    setIsLoading(true);

    const result = await apiSendOtp({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      uniqueUserId: uniqueId.trim().toLowerCase(),
      password,
      confirmPassword,
      accountType
    });
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "We couldn't send the verification email. Please try again.");
      return;
    }

    setResendCooldown(30);
  };

  // Step 2 OTP Verification -> Call POST /api/auth/verify-otp
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    const result = await apiVerifyOtp(email.trim().toLowerCase(), otp.trim());
    setIsLoading(false);

    if (!result.success || !result.regToken) {
      setError(result.error || 'Invalid verification code. Please check your email and try again.');
      return;
    }

    setRegToken(result.regToken);
    setEmailSubmitted(false);
    setOtp('');
    setCurrentStep(3);
  };

  // Step 3 -> Step 4
  const handleNextFromStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalCollege = customCollege.trim() || selectedCollege;
    if (!finalCollege) {
      setError('Please select or specify your college.');
      return;
    }

    setCurrentStep(4);
  };

  // Step 4 Final Submission -> Call POST /api/auth/complete-registration
  const handleFinalSubmit = async (skipOptional: boolean = false) => {
    if (!regToken) {
      setError('Registration token expired. Please restart email verification.');
      setCurrentStep(2);
      return;
    }

    const finalCollege = customCollege.trim() || selectedCollege;
    setIsLoading(true);
    setError(null);

    const result = await apiCompleteRegistration({
      regToken,
      email: email.trim(),
      college: finalCollege,
      branch,
      gradYear,
      skills: skipOptional ? ['Python', 'SQL'] : selectedSkills,
      githubUsername: skipOptional ? undefined : (githubUsername.trim() || undefined),
      leetcodeUsername: skipOptional ? undefined : (leetcodeUsername.trim() || undefined)
    });
    setIsLoading(false);

    if (!result.success || !result.user) {
      setError(result.error || 'Failed to complete registration. Please try again.');
      return;
    }

    // Update global app state with verified backend user
    syncUserSession(result.user);
    resetFormState();
    onClose();
  };

  const toggleSkillSelection = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(prev => prev.filter(s => s !== skillName));
    } else {
      setSelectedSkills(prev => [...prev, skillName]);
    }
  };

  // Progress Bar Percentage
  const stepProgressMap: Record<OnboardingStep, number> = {
    1: 25,
    2: 50,
    3: 75,
    4: 100
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-y-auto">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            resetFormState();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close registration wizard"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
            <span>Onboarding Step {currentStep} of 4</span>
            <span className="text-indigo-400 font-bold">{stepProgressMap[currentStep]}% Complete</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${stepProgressMap[currentStep]}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-in slide-in-from-top duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: CHOOSE ACCOUNT TYPE */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Create Your Account</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                How Will You Use RecruitCred?
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your primary role to customize your platform experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Student Option */}
              <button
                type="button"
                onClick={() => setAccountType('student')}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  accountType === 'student'
                    ? 'bg-gradient-to-br from-indigo-950/70 to-slate-900 border-indigo-500 shadow-glow-brand ring-2 ring-indigo-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    accountType === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    RECOMMENDED
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Student / Candidate</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Turn skill claims into verified credentials, take objective assessments, and showcase real project evidence to campus recruiters.
                </p>
              </button>

              {/* Recruiter Option */}
              <button
                type="button"
                onClick={() => setAccountType('recruiter')}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  accountType === 'recruiter'
                    ? 'bg-gradient-to-br from-indigo-950/70 to-slate-900 border-indigo-500 shadow-glow-brand ring-2 ring-indigo-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    accountType === 'recruiter' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Recruiter / Placement Lead</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluate candidates with cryptographic skill proof, review repository code quality, and dispatch pre-acceptance challenges.
                </p>
              </button>

            </div>

            <button
              onClick={handleNextFromStep1}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Continue as {accountType === 'student' ? 'Student' : 'Recruiter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CREATE CREDENTIALS & UNIQUE ID & OTP */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <form onSubmit={emailSubmitted ? handleVerifyOtpSubmit : handleSendOtpSubmit} className="space-y-4">
            <div>
              {!emailSubmitted && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Account Type</span>
                </button>
              )}
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {emailSubmitted ? 'Verify Your Email Address' : 'Create Your Account'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {emailSubmitted
                  ? `We've sent a 6-digit verification code to ${email.trim().toLowerCase()}.`
                  : 'Set up your unique RecruitCred login identifier and email address.'}
              </p>
            </div>

            {emailSubmitted ? (
              <>
                {/* Information Card - Absolutely Zero OTP displayed */}
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-indigo-200">
                  <div className="flex items-center gap-2 mb-1.5 text-indigo-300 font-bold">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <span>Verification Code Dispatched</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    We've sent a 6-digit security code to <strong className="text-white font-mono">{email.trim().toLowerCase()}</strong>. Please check your email inbox (and spam/junk folder if not received).
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-indigo-900/50 text-[11px] text-amber-300">
                    <span>⏱️ Code expires in 5 minutes</span>
                    <span>Max 5 attempts</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                    Enter 6-Digit Email Verification Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 tracking-[0.4em] text-center"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailSubmitted(false);
                      setOtp('');
                      setError(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    ← Change email address
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-xs text-indigo-400 hover:text-indigo-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Verify Email & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Email Address
                    </label>
                    <span className="text-[10px] text-slate-400">Gmail, Yahoo, Outlook, University, etc.</span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@gmail.com, user@yahoo.com, student@university.edu"
                      className={`w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        email.trim().length > 0 && !isEmailValidFormat(email)
                          ? 'border-rose-500/80 focus:border-rose-500'
                          : 'border-slate-700/80 focus:border-indigo-500'
                      }`}
                      required
                    />
                  </div>
                  {email.trim().length > 0 && !isEmailValidFormat(email) ? (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Please enter a valid email address.
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-1">
                      We will send a 6-digit verification code to this email address.
                    </p>
                  )}
                </div>

                {/* Unique User ID */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Unique User ID (Login Identifier)
                    </label>
                    {isCheckingId ? (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Checking server...
                      </span>
                    ) : isIdAvailable !== null && uniqueId.trim().length >= 3 ? (
                      <span className={`text-[11px] font-bold flex items-center gap-1 ${
                        isIdAvailable ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isIdAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            User ID available ✓
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            User ID already taken
                          </>
                        )}
                      </span>
                    ) : null}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-indigo-400 font-bold">@</span>
                    <input
                      type="text"
                      value={uniqueId}
                      onChange={(e) => setUniqueId(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      placeholder="e.g. agastya_28"
                      className={`w-full bg-slate-950 border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none transition-colors ${
                        uniqueId.trim().length >= 3
                          ? isIdAvailable
                            ? 'border-emerald-500/60 focus:border-emerald-500'
                            : 'border-rose-500/60 focus:border-rose-500'
                          : 'border-slate-700/80 focus:border-indigo-500'
                      }`}
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your public profile URL: <code className="text-indigo-300 font-mono">/u/{uniqueId.trim().toLowerCase() || 'your_id'}</code>
                  </p>
                </div>

                {/* Password & Confirm */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className={`w-full bg-slate-950 border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          confirmPassword.length > 0 && password !== confirmPassword
                            ? 'border-rose-500/80 focus:border-rose-500'
                            : 'border-slate-700/80 focus:border-indigo-500'
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 -mt-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !fullName.trim() ||
                    !isEmailValidFormat(email) ||
                    !uniqueId.trim() ||
                    !isIdValidFormat ||
                    isIdAvailable === false ||
                    password.length < 6 ||
                    password !== confirmPassword
                  }
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>Send Verification Code to Email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: COLLEGE SELECTION */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <form onSubmit={handleNextFromStep3} className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Credentials</span>
              </button>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Tell Us Where You Study
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Select your institution so RecruitCred can personalize verified opportunities, placement recommendations, and skill benchmarking.
              </p>
            </div>

            {/* Search College Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Search Your College / University
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  placeholder="Type to search (e.g. Thapar, IIT, BITS, DTU)..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* College Selection List */}
              <div className="max-h-44 overflow-y-auto space-y-1.5 p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
                {filteredColleges.map((c) => {
                  const isSelected = selectedCollege === c.name && !customCollege;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => {
                        setSelectedCollege(c.name);
                        setCustomCollege('');
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/25 text-white border border-indigo-500/50'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-[11px] text-slate-400">{c.shortName} • {c.location}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}

                {filteredColleges.length === 0 && (
                  <div className="p-3 text-xs text-slate-400 text-center">
                    No matching institution found. You can enter your college name below.
                  </div>
                )}
              </div>
            </div>

            {/* Custom College Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Or Enter Custom College / Institute Name
              </label>
              <input
                type="text"
                value={customCollege}
                onChange={(e) => setCustomCollege(e.target.value)}
                placeholder="Enter college name if not listed above"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Branch & Year */}
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {ENGINEERING_BRANCHES.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Graduation Year
                </label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {GRADUATION_YEARS.map(y => (
                    <option key={y} value={y}>Class of {y}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Next: Profile Setup & Skills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: PROFILE SETUP & SKILLS SELECTION */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to College Selection</span>
              </button>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Complete Your RecruitCred Profile
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect optional external profiles and select initial skills to prepare your evidence verification pipeline.
              </p>
            </div>

            {/* Optional GitHub & LeetCode */}
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                  <span>GitHub Username (Optional)</span>
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="e.g. agastya-dev"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>LeetCode Username (Optional)</span>
                </label>
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  placeholder="e.g. agastya_algo"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Initial Skills to Claim */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Initial Technical Skills to Add:
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_STUDENT_SKILLS.map((sk) => {
                  const isSelected = selectedSkills.includes(sk.name);
                  return (
                    <button
                      type="button"
                      key={sk.name}
                      onClick={() => toggleSkillSelection(sk.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
                      <span>{sk.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                These skills will start as <span className="text-amber-400 font-semibold">Claimed</span> until you complete standard assessments or connect repository proof.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleFinalSubmit(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Skip for now
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleFinalSubmit(false)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Complete Profile & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Switch to Sign In */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Already have a RecruitCred account?{' '}
            <button
              onClick={() => {
                resetFormState();
                onClose();
                onSwitchToSignIn();
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline decoration-indigo-500/40 ml-1 cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
