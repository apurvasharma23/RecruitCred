import React, { useState } from 'react';
import { OpportunityItem } from '../../mockData/dashboardDemoData';
import { X, Building2, MapPin, Briefcase, Calendar, CheckCircle2, ShieldCheck, Sparkles, Send, Check } from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: OpportunityItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose
}) => {
  const [hasApplied, setHasApplied] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleApply = () => {
    setHasApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="opp-detail-title"
        className="w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                  {opportunity.company}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {opportunity.status}
                </span>
              </div>
              <h3 id="opp-detail-title" className="text-lg font-bold text-white mt-0.5 leading-snug">
                {opportunity.role}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {opportunity.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  {opportunity.type}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  {opportunity.stipendOrSalary}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setHasApplied(false);
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Eligibility Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Campus Eligibility Criteria Analysis</span>
            </h4>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Academic Discipline</div>
                <div className="text-slate-200 font-bold mt-0.5 flex items-center gap-1">
                  <span className="text-emerald-400">✓</span> {opportunity.branchEligible}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Graduation Batch</div>
                <div className="text-slate-200 font-bold mt-0.5 flex items-center gap-1">
                  <span className="text-emerald-400">✓</span> {opportunity.yearEligible}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Academic Performance</div>
                <div className="text-slate-200 font-bold mt-0.5 flex items-center gap-1">
                  <span className="text-emerald-400">✓</span> {opportunity.cgpaRequired}
                </div>
              </div>
            </div>
          </div>

          {/* Skill & Credibility Compatibility Matches */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Technical Skill Fit</span>
                <span className="text-xs font-bold text-indigo-400">{opportunity.skillMatchPercentage}% Match</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${opportunity.skillMatchPercentage}%` }} 
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {opportunity.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 font-semibold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Verified Credibility Match</span>
                <span className="text-xs font-bold text-emerald-400">{opportunity.credibilityMatchPercentage}% Proof</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${opportunity.credibilityMatchPercentage}%` }} 
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Backed by standardized code evaluation & repos</span>
              </div>
            </div>
          </div>

          {/* Role Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
              Role & Responsibility Overview
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              {opportunity.description}
            </p>
          </div>

          {/* Hiring Drive Timeline */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Placement Application Window Closes:</span>
            </span>
            <span className="font-bold text-slate-200">{opportunity.deadline}</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sends verified profile & assessment proofs directly</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setHasApplied(false);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleApply}
              disabled={hasApplied}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                hasApplied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer'
              }`}
            >
              {hasApplied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Application Submitted ✓</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Apply with Verified Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
