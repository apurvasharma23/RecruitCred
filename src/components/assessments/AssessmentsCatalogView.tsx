import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assessment, SkillProgressionRoadmap } from '../../types';
import { AssessmentSetupModal } from './AssessmentSetupModal';
import {
  COMPREHENSIVE_ASSESSMENTS,
  DEMO_ASSESSMENT_ATTEMPTS,
  DEMO_ASSIGNMENTS,
  DEMO_VERIFICATION_APPOINTMENTS,
  SKILL_PROGRESSION_ROADMAPS,
  RECOMMENDED_ASSESSMENTS
} from '../../mockData/assessmentData';
import {
  FileCode2,
  Clock,
  CheckCircle2,
  Play,
  ShieldCheck,
  Terminal,
  Cpu,
  Atom,
  Server,
  Palette,
  GitBranch,
  BookOpen,
  Search,
  History,
  ChevronRight,
  Info,
  Lock,
  Calendar,
  Briefcase,
  TrendingUp,
  Award,
  Check,
  XCircle,
  Sparkles,
  HelpCircle
} from 'lucide-react';

const ICON_MAP: { [key: string]: React.ElementType } = {
  Terminal,
  Atom,
  Cpu,
  Server,
  Palette,
  GitBranch,
  FileCode2
};

export const AssessmentsCatalogView: React.FC = () => {
  const { startAssessment, currentUser, attempts, navigateTo } = useApp();
  
  // Active Tab: 'available' | 'locked' | 'history' | 'assignments' | 'verification' | 'progression'
  const [activeTab, setActiveTab] = useState<'available' | 'locked' | 'history' | 'assignments' | 'verification' | 'progression'>('available');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Setup Modal State
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedAssessmentForSetup, setSelectedAssessmentForSetup] = useState<Assessment | null>(null);

  // Requirement Modal State
  const [requirementModalAssessment, setRequirementModalAssessment] = useState<Assessment | null>(null);

  // Verification Factor Breakdown Modal State
  const [selectedRoadmapForDetail, setSelectedRoadmapForDetail] = useState<SkillProgressionRoadmap | null>(null);

  const categories = ['All', 'Backend', 'Frontend', 'Systems', 'AI & Data'];

  // All assessments list (available vs locked)
  const allAssessments = COMPREHENSIVE_ASSESSMENTS;

  // Filter available assessments
  const availableAssessments = allAssessments.filter(a => {
    if (a.isLocked) return false;
    const matchesCategory = selectedCategory === 'All' || 
      a.category === selectedCategory || 
      (selectedCategory === 'AI & Data' && (a.category === 'AI & ML' || a.category === 'Backend'));
    const matchesSearch = a.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.syllabus.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filter locked assessments
  const lockedAssessments = allAssessments.filter(a => {
    if (!a.isLocked) return false;
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = a.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle start assessment flow
  const handleOpenSetup = (assessment: Assessment) => {
    setSelectedAssessmentForSetup(assessment);
    setSetupModalOpen(true);
  };

  const handleStartFromSetup = (assessmentId: string, _sessionToken: string) => {
    setSetupModalOpen(false);
    startAssessment(assessmentId);
  };

  const formatTimeSpent = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  // Combine attempts from context and demo attempts
  const allAttempts = attempts.length > 0 ? attempts : DEMO_ASSESSMENT_ATTEMPTS;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            RecruitCred Technical Assessment Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Skill Assessments & Secure Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Standardized technical evaluations, level-based progression, and proctored verification designed for objective recruiter review.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center min-w-[130px]">
            <div className="text-xl font-extrabold text-emerald-400">
              {currentUser.skills.filter(s => s.status === 'verified').length} / {currentUser.skills.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Skills Verified</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center min-w-[130px]">
            <div className="text-xl font-extrabold text-cyan-400">
              {allAttempts.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attempts Logged</div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          
          {/* Tab 1: Available Assessments */}
          <button
            onClick={() => setActiveTab('available')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'available'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Available Assessments</span>
            <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px]">
              {availableAssessments.length}
            </span>
          </button>

          {/* Tab 2: Locked Assessments */}
          <button
            onClick={() => setActiveTab('locked')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'locked'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Locked Assessments</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px]">
              {lockedAssessments.length}
            </span>
          </button>

          {/* Tab 3: Assessment History */}
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Assessment History</span>
            <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
              {allAttempts.length}
            </span>
          </button>

          {/* Tab 4: My Assignments */}
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'assignments'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>My Assignments</span>
            <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px]">
              {DEMO_ASSIGNMENTS.length}
            </span>
          </button>

          {/* Tab 5: Verification History */}
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Verification Appointments</span>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px]">
              {DEMO_VERIFICATION_APPOINTMENTS.length}
            </span>
          </button>

          {/* Tab 6: Skill Progression */}
          <button
            onClick={() => setActiveTab('progression')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'progression'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Skill Progression</span>
          </button>

        </div>

        {/* Search Bar */}
        {(activeTab === 'available' || activeTab === 'locked') && (
          <div className="relative w-full lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill or topic..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* TAB 1: AVAILABLE ASSESSMENTS */}
      {activeTab === 'available' && (
        <div className="space-y-8">
          
          {/* Section: Recommended for You Engine */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/20 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recommended For Your Profile
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Matched to your target engineering roles and opportunity criteria
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {RECOMMENDED_ASSESSMENTS.map((rec, idx) => {
                const targetAss = allAssessments.find(a => a.id === rec.assessmentId) || allAssessments[0];
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {rec.targetRole}
                        </span>
                        <span className="text-[10px] text-amber-400 font-semibold">{rec.priority} Priority</span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{targetAss.skillName}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {rec.reason}
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenSetup(targetAss)}
                      className="mt-3 w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Take Assessment
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Available Assessments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableAssessments.map((assessment) => {
              const IconComponent = ICON_MAP[assessment.icon] || FileCode2;
              const userSkill = currentUser.skills.find(
                s => s.name.toLowerCase() === assessment.skillName.toLowerCase() ||
                     (assessment.skillName.toLowerCase().includes(s.name.toLowerCase()))
              );
              const isVerified = userSkill?.status === 'verified';

              return (
                <div
                  key={assessment.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between group ${
                    isVerified
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/70 shadow-glow-verified'
                      : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 shadow-xl'
                  }`}
                >
                  <div>
                    {/* Top Badge & Icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {isVerified ? (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Verified ({userSkill?.score}%)
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-950/40 text-blue-300 border border-blue-500/30">
                            {assessment.difficulty}
                          </span>
                        )}
                        <span className="text-[10px] text-purple-300 font-mono font-semibold">
                          {assessment.level || 'Level 1'}
                        </span>
                      </div>
                    </div>

                    {/* Skill Title */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {assessment.skillName}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {assessment.category}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2 min-h-[36px]">
                      {assessment.description}
                    </p>

                    {/* 4 Professional Metric Indicators */}
                    <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <FileCode2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span><strong>{assessment.questionCount}</strong> Questions</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span><strong>{assessment.durationMinutes}</strong> Mins</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Pass: <strong>{assessment.passingScore}%</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Verification: <strong className="text-amber-300">{assessment.verificationContribution || '+8%'}</strong></span>
                      </div>
                    </div>

                    {/* Certificate & Proctoring Tags */}
                    <div className="flex items-center gap-2 mb-6 text-[11px]">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        Certificate: Available
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Anti-Cheating Monitored
                      </span>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleOpenSetup(assessment)}
                      className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isVerified
                          ? 'bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40'
                          : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/25 hover:scale-[1.01]'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {isVerified ? 'Retake Verification Test' : 'Start Assessment'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: LOCKED ASSESSMENTS (PREREQUISITES VALIDATED SERVER-SIDE) */}
      {activeTab === 'locked' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white">Server-Validated Level Prerequisites</h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Advanced and professional assessments require verified completion of prerequisite fundamentals. Unlock rules are strictly enforced server-side upon passing prerequisite thresholds.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAssessments.map((assessment) => {
              const IconComponent = ICON_MAP[assessment.icon] || FileCode2;
              return (
                <div
                  key={assessment.id}
                  className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 opacity-90 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        Locked
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {assessment.skillName}
                    </h3>
                    <div className="text-xs text-purple-300 font-mono mt-0.5">{assessment.level}</div>

                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {assessment.description}
                    </p>

                    {/* Prerequisite Box */}
                    <div className="my-4 p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Prerequisite Requirement:
                      </div>
                      <div className="text-xs text-slate-200 font-medium">
                        {assessment.prerequisite?.requiredLevelTitle || 'Complete previous tier assessment'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Passing threshold: ≥ {assessment.prerequisite?.requiredScore || 75}%
                      </div>
                    </div>

                    {/* Assessment Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-6">
                      <div className="flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{assessment.questionCount} Questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{assessment.durationMinutes} Mins</span>
                      </div>
                    </div>

                  </div>

                  <button
                    onClick={() => setRequirementModalAssessment(assessment)}
                    className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    View Requirement & Roadmap
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ASSESSMENT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Assessment Attempt Records</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete audit trail of verified tests, scores, attempt timestamps, and cryptographic credentials.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 w-fit">
              {allAttempts.length} Recorded Submissions
            </span>
          </div>

          <div className="grid gap-4">
            {allAttempts.map((attempt) => {
              const targetAssessment = allAssessments.find(a => a.id === attempt.assessmentId);
              const IconComponent = targetAssessment ? (ICON_MAP[targetAssessment.icon] || FileCode2) : FileCode2;

              return (
                <div
                  key={attempt.id}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3.5 rounded-2xl border shrink-0 ${
                      attempt.passed
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-bold text-white">
                          {attempt.skillName}
                        </h4>
                        {attempt.passed ? (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Passed
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            Failed
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>Date: <strong className="text-slate-300">{formatDate(attempt.submittedAt)}</strong></span>
                        <span>•</span>
                        <span>Time Spent: <strong className="text-purple-300 font-mono">{formatTimeSpent(attempt.timeSpentSeconds)}</strong></span>
                        <span>•</span>
                        <span>Attempt: <strong className="text-slate-300">#{attempt.attemptNumber || 1}</strong></span>
                        <span>•</span>
                        <span>Contribution: <strong className="text-emerald-400">{attempt.verificationContribution || '+8%'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Score & Actions */}
                  <div className="flex items-center gap-4 justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Score Achieved</div>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-xl font-extrabold ${attempt.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {attempt.score}%
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          ({attempt.correctAnswersCount}/{attempt.totalQuestions})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateTo('assessment-result', { attemptId: attempt.id })}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View Result</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {attempt.passed && (
                        <button
                          onClick={() => navigateTo('certificates')}
                          className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MY ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Employer Technical Assignments</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Practical tasks, architecture benchmarks, and company take-home evaluations assigned directly to you.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {DEMO_ASSIGNMENTS.length} Total Assignments
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DEMO_ASSIGNMENTS.map((asg) => {
              const isAssigned = asg.status === 'Assigned';
              const isInProgress = asg.status === 'In Progress';
              const isCompleted = asg.status === 'Completed';
              const isExpired = asg.status === 'Expired';

              return (
                <div
                  key={asg.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${
                        isAssigned ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                        isInProgress ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        isCompleted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {asg.status}
                      </span>

                      <span className="text-xs text-slate-400 font-mono">
                        Due: <strong className="text-slate-200">{asg.dueDate}</strong>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{asg.title}</h4>
                    <div className="text-xs font-semibold text-cyan-400 mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{asg.company}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{asg.skill}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 leading-relaxed">
                      {asg.instructions}
                    </p>

                    {asg.reviewer && (
                      <div className="text-[11px] text-slate-400 mt-3">
                        Reviewer: <strong className="text-slate-300">{asg.reviewer}</strong>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Duration: <strong className="text-white">{asg.durationMinutes} Mins</strong>
                    </div>

                    {isAssigned && (
                      <button
                        onClick={() => {
                          const target = allAssessments.find(a => a.id === asg.assessmentId) || allAssessments[0];
                          handleOpenSetup(target);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        Start Assignment
                      </button>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => {
                          const target = allAssessments.find(a => a.id === asg.assessmentId) || allAssessments[0];
                          handleOpenSetup(target);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                      >
                        Continue Task
                      </button>
                    )}

                    {isCompleted && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Score: {asg.score}% (Submitted)
                      </span>
                    )}

                    {isExpired && (
                      <span className="text-xs text-slate-500 font-semibold">
                        Deadline Passed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: VERIFICATION HISTORY & APPOINTMENTS */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Scheduled Verification History</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluator appointments, live technical walkthroughs, and practical assessment outcomes.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {DEMO_VERIFICATION_APPOINTMENTS.length} Records
            </span>
          </div>

          <div className="grid gap-4">
            {DEMO_VERIFICATION_APPOINTMENTS.map((app) => {
              const isScheduled = app.status === 'Scheduled';
              const isCompleted = app.status === 'Completed';
              const isInconclusive = app.status === 'Inconclusive';
              const isAdditional = app.status === 'Additional Verification Required';

              return (
                <div
                  key={app.id}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{app.title}</h4>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isScheduled ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                        isCompleted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        isInconclusive ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                        isAdditional ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>Type: <strong className="text-slate-200">{app.verificationType}</strong></span>
                      <span>•</span>
                      <span>Date & Time: <strong className="text-cyan-300">{app.date} at {app.time}</strong></span>
                      {app.evaluator && (
                        <>
                          <span>•</span>
                          <span>Evaluator: <strong className="text-slate-300">{app.evaluator}</strong></span>
                        </>
                      )}
                    </div>

                    {app.result && (
                      <p className="text-xs text-slate-300 p-3 rounded-xl bg-slate-950/60 border border-slate-800 leading-relaxed">
                        {app.result}
                      </p>
                    )}

                    {app.followUpRequired && (
                      <div className="text-xs text-amber-300 flex items-center gap-1.5 mt-1">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        <span>Next Step: {app.followUpRequired}</span>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isScheduled ? (
                      <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer">
                        Join Verification Room
                      </button>
                    ) : (
                      <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer">
                        View Audit Log
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: SKILL PROGRESSION & ROADMAPS */}
      {activeTab === 'progression' && (
        <div className="space-y-8">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Professional Skill Progression Roadmaps</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Structured tier progression (Level 1 Fundamentals ➔ Level 4 Professional) with transparent verification weights.
              </p>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Passed
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 ml-2" /> Available
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 ml-2" /> Locked
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {SKILL_PROGRESSION_ROADMAPS.map((roadmap) => {
              return (
                <div
                  key={roadmap.skillName}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-5 shadow-xl"
                >
                  {/* Skill Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-black text-white">{roadmap.skillName}</h4>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {roadmap.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Current Status: <strong className="text-emerald-400">{roadmap.currentLevelTitle}</strong>
                      </div>
                    </div>

                    {/* Clickable Verification Progress Factor Box */}
                    <button
                      onClick={() => setSelectedRoadmapForDetail(roadmap)}
                      className="text-right p-2.5 rounded-2xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-500 hover:bg-slate-900 transition-all cursor-pointer group"
                    >
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end group-hover:text-indigo-300">
                        <span>Verification Progress</span>
                        <HelpCircle className="w-3 h-3" />
                      </div>
                      <div className="text-lg font-black text-emerald-400">
                        {roadmap.overallVerificationProgress}%
                      </div>
                    </button>
                  </div>

                  {/* Visual Roadmap Sequence */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Your Skill Roadmap:
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {roadmap.levels.map((lvl) => {
                        const isPassed = lvl.status === 'Passed';
                        const isAvailable = lvl.status === 'Available';

                        return (
                          <div
                            key={lvl.levelNumber}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                              isPassed
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                                : isAvailable
                                ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 shadow-md ring-1 ring-indigo-500/30'
                                : 'bg-slate-950/60 border-slate-800 text-slate-500'
                            }`}
                          >
                            <div className="text-[10px] uppercase font-mono font-bold mb-1">
                              Level {lvl.levelNumber}
                            </div>

                            <div className="text-xs font-bold text-white truncate">
                              {lvl.levelTitle.replace(/Level \d+ — /, '')}
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                              {isPassed ? (
                                <span className="text-emerald-400 font-bold flex items-center justify-center gap-0.5">
                                  <Check className="w-3 h-3" /> {lvl.userScore}%
                                </span>
                              ) : isAvailable ? (
                                <span className="text-indigo-300 font-bold">→ Available</span>
                              ) : (
                                <span className="text-slate-500 font-medium">🔒 Locked</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next Recommended Action CTA */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="text-slate-300">
                      <span className="text-indigo-400 font-semibold block text-[11px]">Recommended Next Step:</span>
                      <span className="text-xs">{roadmap.nextRecommendedAction}</span>
                    </div>

                    {roadmap.levels.find(l => l.status === 'Available')?.assessmentId && (
                      <button
                        onClick={() => {
                          const targetId = roadmap.levels.find(l => l.status === 'Available')?.assessmentId;
                          const targetAss = allAssessments.find(a => a.id === targetId) || allAssessments[0];
                          handleOpenSetup(targetAss);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 transition-all shadow-md cursor-pointer"
                      >
                        Take Test
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assessment Setup Modal */}
      <AssessmentSetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        assessment={selectedAssessmentForSetup}
        onStart={handleStartFromSetup}
      />

      {/* Prerequisite Detail Modal */}
      {requirementModalAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
            <button
              onClick={() => setRequirementModalAssessment(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 w-fit mb-4 border border-amber-500/30">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Prerequisite Lock Details
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {requirementModalAssessment.skillName} ({requirementModalAssessment.level})
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 mb-6 text-xs text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Required Prerequisite:</span>
                <strong className="text-white">{requirementModalAssessment.prerequisite?.skillName}</strong>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Passing Score Threshold:</span>
                <strong className="text-emerald-400">≥ {requirementModalAssessment.prerequisite?.requiredScore}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Validation Authority:</span>
                <strong className="text-cyan-400">RecruitCred Backend Rules Engine</strong>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Complete the prerequisite evaluation and satisfy the required passing criteria to unlock this assessment automatically.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRequirementModalAssessment(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
              
              <button
                onClick={() => {
                  const prereqId = requirementModalAssessment.prerequisite?.assessmentId;
                  const prereqAss = allAssessments.find(a => a.id === prereqId) || allAssessments[0];
                  setRequirementModalAssessment(null);
                  handleOpenSetup(prereqAss);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25"
              >
                Go to Prerequisite Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Factor Breakdown Modal */}
      {selectedRoadmapForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl">
            <button
              onClick={() => setSelectedRoadmapForDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 w-fit mb-4 border border-indigo-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              Transparent Verification Model
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              How <strong className="text-white">{selectedRoadmapForDetail.skillName} ({selectedRoadmapForDetail.overallVerificationProgress}%)</strong> is calculated
            </p>

            {/* Factor Bars */}
            <div className="space-y-4 mb-6 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Proctored Assessment Score (35% Weight)</span>
                  <strong className="text-emerald-400">{selectedRoadmapForDetail.verificationBreakdown.assessmentScore}%</strong>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedRoadmapForDetail.verificationBreakdown.assessmentScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Evidence & Repository Static Code Proof (35% Weight)</span>
                  <strong className="text-cyan-400">{selectedRoadmapForDetail.verificationBreakdown.evidenceScore}%</strong>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${selectedRoadmapForDetail.verificationBreakdown.evidenceScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Project Demonstration & Code Walkthrough (30% Weight)</span>
                  <strong className="text-purple-400">{selectedRoadmapForDetail.verificationBreakdown.projectScore}%</strong>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${selectedRoadmapForDetail.verificationBreakdown.projectScore}%` }} />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed mb-6">
              {selectedRoadmapForDetail.verificationBreakdown.description}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRoadmapForDetail(null)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
