import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCode2,
  GitBranch,
  Award,
  ArrowRight,
  Eye
} from 'lucide-react';

export type CredibilityStage = 'claim' | 'evidence' | 'assessment' | 'verified';

interface StageMeta {
  id: CredibilityStage;
  stepNumber: string;
  label: string;
  shortDesc: string;
}

const STAGES: StageMeta[] = [
  { id: 'claim', stepNumber: '01', label: 'Claim', shortDesc: 'Self-declared competency' },
  { id: 'evidence', stepNumber: '02', label: 'Evidence', shortDesc: 'Connected repositories' },
  { id: 'assessment', stepNumber: '03', label: 'Assessment', shortDesc: 'Objective technical test' },
  { id: 'verified', stepNumber: '04', label: 'Verified', shortDesc: 'Cryptographic proof signal' }
];

export const CredibilitySnapshot: React.FC = () => {
  const [activeStage, setActiveStage] = useState<CredibilityStage>('claim');
  const [isRecruiterView, setIsRecruiterView] = useState(false);

  const activeIndex = STAGES.findIndex(s => s.id === activeStage);

  const handleNextStage = () => {
    if (activeStage === 'claim') setActiveStage('evidence');
    else if (activeStage === 'evidence') setActiveStage('assessment');
    else if (activeStage === 'assessment') setActiveStage('verified');
    else setActiveStage('claim');
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6 transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">RecruitCred</h2>
            <p className="text-[11px] text-slate-400 font-medium">Credibility Snapshot</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Verified Score</span>
        </div>
      </div>

      {/* 4-Stage Horizontal Progression Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
          <span>Verification Journey</span>
          <span>Stage {activeIndex + 1} of 4</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800" role="tablist" aria-label="Credibility Verification Stages">
          {STAGES.map((stage, idx) => {
            const isActive = activeStage === stage.id;
            const isCompleted = idx < activeIndex;

            return (
              <button
                key={stage.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`stage-panel-${stage.id}`}
                id={`stage-tab-${stage.id}`}
                onClick={() => setActiveStage(stage.id)}
                className={`flex flex-col items-center py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20'
                    : isCompleted
                    ? 'text-emerald-400 hover:bg-slate-900 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 font-medium'
                }`}
              >
                <span className={`text-[10px] font-mono ${isActive ? 'text-brand-200' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isCompleted ? '✓' : stage.stepNumber}
                </span>
                <span className="text-xs truncate w-full">{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Content Panel */}
      <div
        id={`stage-panel-${activeStage}`}
        role="tabpanel"
        aria-labelledby={`stage-tab-${activeStage}`}
        className="min-h-[260px] flex flex-col justify-between p-5 rounded-xl bg-slate-950/80 border border-slate-800 transition-opacity duration-200"
      >
        
        {/* ============================================================ */}
        {/* STATE 1 — CLAIM */}
        {/* ============================================================ */}
        {activeStage === 'claim' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Declared Skill</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Python</h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-700">
                Status: Claimed ○
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              “Candidate has listed Python as a technical skill on their profile.”
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Self-declared claims lack objective proof until supported by code evidence and standardized assessments.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextStage}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>See how it gets verified</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STATE 2 — EVIDENCE */}
        {/* ============================================================ */}
        {activeStage === 'evidence' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Skill With Proof</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Python</h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/30">
                Evidence Attached
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Evidence Sources
              </div>

              <div className="space-y-1.5 text-xs text-slate-200">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-brand-400" />
                    <span>GitHub Project</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">✓ Connected</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-3.5 h-3.5 text-brand-400" />
                    <span>Project Repository</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">✓ Added</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Technical Certification</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">✓ Added</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              “Supporting evidence gives recruiters additional context beyond a resume claim.”
            </p>

            <div className="pt-1 flex justify-end">
              <button
                onClick={handleNextStage}
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Continue to Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STATE 3 — ASSESSMENT */}
        {/* ============================================================ */}
        {activeStage === 'assessment' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Standardized Evaluation</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Python Skill Assessment</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-500/10 text-brand-300 border border-brand-500/20">
                10 Questions
              </span>
            </div>

            {/* Assessment Progress */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Assessment Progress</span>
                <span className="text-brand-400 font-mono">80% (8/10 completed)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full rounded-full w-[80%]"></div>
              </div>
            </div>

            {/* Example Metrics */}
            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] font-mono uppercase text-slate-500">
                Example Assessment Preview
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Technical Concepts</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">Strong</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Problem Solving</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">Strong</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Code Understanding</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">Good</div>
                </div>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                onClick={handleNextStage}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Assessment-backed evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STATE 4 — VERIFIED */}
        {/* ============================================================ */}
        {activeStage === 'verified' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Verified Credential</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Python</h3>
              </div>
              <span className="badge-verified text-xs">
                ✓ VERIFIED
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Evidence:</span>
                <span className="text-emerald-300 font-semibold">Assessment-backed</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Verification Status:</span>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>
              <div className="flex justify-between font-mono text-[10px] pt-1 border-t border-emerald-500/20 text-slate-400">
                <span>Proof ID:</span>
                <span className="text-emerald-400">RC-V92-PYT</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              “RecruitCred combines evidence and assessment results to create a more trustworthy skill signal for recruitment.”
            </p>

            <div className="pt-1 flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveStage('claim')}
                className="text-slate-500 hover:text-slate-300 text-[11px] font-mono transition-colors cursor-pointer"
              >
                ↺ Restart Journey
              </button>
              <span className="text-emerald-400 font-semibold">
                ✓ Ready for Placement
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Recruiter View Toggle */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <label className="text-xs text-slate-300 font-medium flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isRecruiterView}
            onChange={(e) => setIsRecruiterView(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-brand-600 focus:ring-brand-500 focus:ring-offset-slate-900 cursor-pointer"
          />
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            Recruiter View (Illustrative Preview)
          </span>
        </label>
      </div>

      {/* Recruiter Perspective Overlay when enabled */}
      {isRecruiterView && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-brand-500/30 text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-white">Python Skill Signal</span>
            <span className="badge-verified text-[10px]">✓ Verified</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Assessment</div>
              <div className="font-bold text-emerald-400">92%</div>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Project Evidence</div>
              <div className="font-bold text-white">3 items</div>
            </div>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Verified Sources</div>
              <div className="font-bold text-white">2</div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center pt-1 font-mono">
            Evidence-backed profile (Illustrative demo data)
          </div>
        </div>
      )}

    </div>
  );
};
