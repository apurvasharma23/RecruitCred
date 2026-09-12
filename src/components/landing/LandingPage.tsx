import React from 'react';
import { useApp } from '../../context/AppContext';
import { CredibilitySnapshot } from '../credibility/CredibilitySnapshot';
import {
  VERIFIED_USER_COUNT,
  SKILLS_VERIFIED_COUNT,
  PROJECTS_EVIDENCE_COUNT,
  OPPORTUNITIES_COUNT
} from '../../config/constants';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Building2,
  GitBranch,
  Code2,
  Award,
  Sparkles,
  Users,
  Trophy,
  Bot,
  Layers,
  ChevronRight,
  Briefcase
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { openAuthModal } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold tracking-wide shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CAMPUS RECRUITMENT CREDIBILITY PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Build Credibility.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400">
                  Get Recruited With Confidence.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                RecruitCred helps students turn skill claims into evidence-backed professional profiles while helping them discover relevant opportunities and giving recruiters stronger signals for candidate evaluation.
              </p>

              {/* Action CTAs: Distinct Get Started vs Sign In */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-base shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => openAuthModal('signin')}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-base border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Sign In</span>
                  </button>
                </div>

                {/* Trust Line */}
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                  Skills • Assessments • Projects • Credentials • Verified Evidence
                </p>
              </div>

            </div>

            {/* Right Column: Interactive Credibility Snapshot */}
            <div className="lg:col-span-5">
              <CredibilitySnapshot />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST STATISTICS SECTION (79,999+ VERIFIED USERS) */}
      {/* ========================================================================= */}
      <section className="py-12 bg-slate-900/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Verification Scale</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {VERIFIED_USER_COUNT} Verified Users
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
              Students building evidence-backed professional profiles on RecruitCred across top engineering colleges.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">{VERIFIED_USER_COUNT}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Verified Users</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Active candidates</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{SKILLS_VERIFIED_COUNT}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Skills Verified</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Assessment evaluated</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{PROJECTS_EVIDENCE_COUNT}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Projects & Evidence</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Repositories connected</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">{OPPORTUNITIES_COUNT}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Opportunities</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Campus drives & hackathons</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROBLEM SECTION */}
      {/* ========================================================================= */}
      <section id="problem" className="relative py-20 bg-slate-950 border-b border-slate-800/80">
        <div id="product" className="absolute -top-20" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider">The Credibility Gap</h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Resumes Tell Stories. Recruiters Need Evidence.
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Self-declared resume bullet points create screening fatigue for recruiters and obscure true technical depth for deserving students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300 text-base leading-relaxed">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">The Student Experience</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students spend hundreds of hours coding capstone systems, solving data structures, and learning frameworks, but their resumes reduce those complex achievements to a generic list of keywords.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">The Recruiter Challenge</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recruiters filter thousands of applicants where nearly every resume claims "Python, React, SQL". Without objective evidence, technical interviews turn into lengthy filtering rounds.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SOLUTION PIPELINE: FROM CLAIMS TO CREDIBILITY */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">The Solution</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Claims to Credibility
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              A transparent verification pipeline turning declarations into recruiter trust.
            </p>
          </div>

          {/* 6-Stage Horizontal Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-indigo-400">STAGE 01</span>
              <div className="text-xs font-extrabold text-white">CLAIM</div>
              <p className="text-[11px] text-slate-400">Self-declared skill competency</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-indigo-400">STAGE 02</span>
              <div className="text-xs font-extrabold text-white">EVIDENCE</div>
              <p className="text-[11px] text-slate-400">GitHub, LeetCode & Projects</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 text-center space-y-2 shadow-sm">
              <span className="text-[10px] font-mono font-bold text-indigo-400">STAGE 03</span>
              <div className="text-xs font-extrabold text-indigo-300">ASSESS</div>
              <p className="text-[11px] text-slate-400">Timed code-output evaluation</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center space-y-2 shadow-sm">
              <span className="text-[10px] font-mono font-bold text-emerald-400">STAGE 04</span>
              <div className="text-xs font-extrabold text-emerald-400">VERIFY</div>
              <p className="text-[11px] text-slate-400">Cryptographic proof hash issued</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-purple-400">STAGE 05</span>
              <div className="text-xs font-extrabold text-purple-300">MATCH</div>
              <p className="text-[11px] text-slate-400">College & skill matchmaking</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-emerald-300">STAGE 06</span>
              <div className="text-xs font-extrabold text-emerald-300">RECRUIT</div>
              <p className="text-[11px] text-emerald-400/80">Evidence-backed hiring</p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EVIDENCE SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Multi-Source Verification</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Work Becomes Your Evidence
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              RecruitCred integrates your authentic technical artifacts across multiple platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-indigo-400" />
              </div>
              <h4 className="text-base font-bold text-white">GitHub Repositories</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect real repositories. RecruitCred verifies commit volume, language distribution, and architectural structure.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">LeetCode & Algorithms</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Showcase verified problem solving count, contest ratings, and algorithmic problem-solving percentiles.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Capstone Projects</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demonstrate live deployments, architecture design documentation, and peer engineering contributions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-purple-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Industry Certifications</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrate verifiable credential IDs from AWS, Google Cloud, Meta, and Coursera.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Standardized Assessments</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Objective timed tests across 7 core software & engineering technologies (Python, React, SQL, C++, Git).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Hackathon Track Records</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verify team contributions, submission demos, and podium placements from university hackathons.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. VIRTUAL VERIFICATION SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Objective Evaluation</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Can You Actually Demonstrate What You Claim?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              RecruitCred tests practical application: memory limits, concurrency, decorators, query optimization, and code execution.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-emerald-400 font-bold text-sm mb-1">1. Proctored Timers</div>
                <div className="text-xs text-slate-400">Strict per-assessment countdown timers preventing external reference lookups.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-indigo-400 font-bold text-sm mb-1">2. Code-Output Questions</div>
                <div className="text-xs text-slate-400">Predict exact output for asynchronous execution, recursion, and mutability.</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-amber-400 font-bold text-sm mb-1">3. Immutable Verification Proof</div>
                <div className="text-xs text-slate-400">Cryptographic hash badges (<code className="text-indigo-300 font-mono">RC-V92-PYT</code>) shareable on resumes.</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. OPPORTUNITIES SECTION */}
      {/* ========================================================================= */}
      <section id="opportunities" className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Targeted Matching</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Opportunities That Match You
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Connecting verified candidates with company placement drives, internships, and hackathon squads.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <Building2 className="w-6 h-6 text-indigo-400" />
              <h4 className="text-base font-bold text-white">Campus Placement Drives</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct recruiter visibility for companies actively hiring from your college branch and verified skill brackets.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <Briefcase className="w-6 h-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Technical Internships</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-growth startups and tech giants seeking candidates with demonstrated code-level proficiency.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
              <Users className="w-6 h-6 text-purple-400" />
              <h4 className="text-base font-bold text-white">Complementary Squad Discovery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Algorithmic pairing prioritizing missing capabilities (e.g. pairing Frontend + ML + Systems).
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. COLLEGE PERSONALIZATION SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Institution Alignment</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built Around Your College Journey
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Personalized recommendations driven by your university, engineering discipline, and graduation timeline.
            </p>
          </div>

          {/* Formula Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 text-center space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-700">College</span>
              <span className="text-indigo-400">+</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-700">Branch</span>
              <span className="text-indigo-400">+</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-700">Skills</span>
              <span className="text-indigo-400">+</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-white border border-slate-700">Eligibility</span>
              <span className="text-emerald-400">=</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/50">Personalized Opportunities</span>
            </div>

            <p className="text-xs text-slate-300 max-w-lg mx-auto pt-2">
              Whether you are a Mechanical Engineering student at Thapar focusing on CAD & Embedded Systems, or a CS student at IIT Bombay building AI systems, RecruitCred personalizes every hackathon and drive for you.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. LINKEDIN DIFFERENTIATION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Platform Synergy</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              LinkedIn Shows Your Professional Story.<br />
              <span className="text-indigo-400">RecruitCred Strengthens the Evidence Behind It.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              We do not replace your professional profile—we provide the objective verification layer that makes your claims credible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">LinkedIn Profile</div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><span>•</span> Self-reported skill lists</li>
                <li className="flex items-center gap-2"><span>•</span> Peer endorsements</li>
                <li className="flex items-center gap-2"><span>•</span> Career timeline overview</li>
                <li className="flex items-center gap-2"><span>•</span> Broad professional network</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-950/30 border border-indigo-500/40 space-y-4">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RecruitCred Credibility Layer</span>
              </div>
              <ul className="space-y-2.5 text-xs text-indigo-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Objective code-output assessments</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Cryptographic verification badges (<code className="font-mono">RC-V...</code>)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Repository code analysis & evidence</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> College & branch matching</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. RECRUITCRED PRO */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RECRUITCRED PRO</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            More Visibility. Not Purchased Credibility.
          </h3>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 max-w-2xl mx-auto space-y-4 text-left">
            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority recruiter profile discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Advanced skill gap & cohort analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Personalized placement drive alerts</span>
              </div>
            </div>

            {/* Core Trust Statement */}
            <div className="pt-4 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 font-bold text-center">
                PRO CAN BUY VISIBILITY. PRO CANNOT BUY CREDIBILITY.<br />
                <span className="font-normal text-[11px] text-amber-300/80">
                  Pro subscription does not alter assessment scores, verification statuses, or badge issuance.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. CREDAI ASSISTANT SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
                <Bot className="w-4 h-4" />
                <span>AI RECRUITMENT ASSISTANT</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Meet CredAI
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Available throughout the platform. CredAI understands your college, verified skills, and placement goals to provide real-time guidance.
              </p>

              <div className="space-y-2 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>"Which claimed skill should I verify first for upcoming campus drives?"</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>"How is my credibility score computed across assessments?"</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>"What hackathons match my Mechanical + Python profile?"</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">CredAI Assistant</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Active & Context Aware</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-indigo-400">CredAI:</span> Based on your profile at <strong>Thapar Institute</strong> in <strong>Mechanical Engineering</strong>, taking the <strong>CAD / SolidWorks</strong> or <strong>Python Core</strong> assessment will increase your placement readiness to 90%+.
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FINAL CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="py-24 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 border-b border-slate-800/80 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Don’t Just List Your Skills.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400">
              Build Evidence Behind Them.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join over 79,999+ students building transparent, evidence-backed professional credibility on RecruitCred.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => openAuthModal('signup')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openAuthModal('signin')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
