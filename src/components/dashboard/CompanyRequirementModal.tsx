import React, { useState } from 'react';
import { CompanyRequirement } from '../../mockData/dashboardDemoData';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Award,
  FileCode2,
  ArrowRight,
  Send
} from 'lucide-react';

interface CompanyRequirementModalProps {
  requirement: CompanyRequirement | null;
  isOpen: boolean;
  onClose: () => void;
  onTakeAssessment?: (skillName: string) => void;
}

export const CompanyRequirementModal: React.FC<CompanyRequirementModalProps> = ({
  requirement,
  isOpen,
  onClose,
  onTakeAssessment
}) => {
  const { currentUser, navigateTo, startAssessment, assessments } = useApp();
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen || !requirement) return null;

  const userCgpaNumber = parseFloat(currentUser.cgpa || '8.7');
  const isCgpaEligible = userCgpaNumber >= requirement.minCgpa;
  const userScore = requirement.userAssessmentScore || 81;
  const isScoreEligible = userScore >= requirement.minScoreNumber;

  const handleStartTest = () => {
    onClose();
    const assess = assessments.find(
      a => a.skillName.toLowerCase().includes(requirement.requiredAssessment.toLowerCase().split(' ')[0]) ||
           requirement.requiredAssessment.toLowerCase().includes(a.skillName.toLowerCase())
    ) || assessments[0];

    if (onTakeAssessment) {
      onTakeAssessment(requirement.requiredAssessment);
    } else if (assess) {
      startAssessment(assess.id);
    }
  };

  const handleApply = () => {
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Company Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {requirement.company}
              </span>
              {requirement.isDemoRequirement && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                  Demo Requirement
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {requirement.role}
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          {requirement.description}
        </p>

        {/* Minimum Requirements Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Minimum Recruitment Standards
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Academic Branch */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                Eligible Branch
              </span>
              <div className="font-semibold text-slate-200 mt-1">
                {requirement.branch}
              </div>
            </div>

            {/* Minimum CGPA */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                Minimum CGPA Requirement
              </span>
              <div className="font-semibold text-slate-200 mt-1 flex items-center justify-between">
                <span>≥ {requirement.minCgpa} CGPA</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isCgpaEligible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  Yours: {currentUser.cgpa || '8.7'} {isCgpaEligible ? '✓' : '✗'}
                </span>
              </div>
            </div>

            {/* Minimum Assessment Score */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                Minimum Assessment Score
              </span>
              <div className="font-semibold text-slate-200 mt-1 flex items-center justify-between">
                <span>≥ {requirement.minAssessment}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isScoreEligible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  Your Score: {userScore}% {isScoreEligible ? '✓' : 'Action Required'}
                </span>
              </div>
            </div>

            {/* Required Certification */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Required Certification
              </span>
              <div className="font-semibold text-indigo-300 mt-1 truncate" title={requirement.requiredCertification}>
                {requirement.requiredCertification}
              </div>
            </div>

          </div>

          {/* Required Skills list */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-2">
              Evaluated Competencies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {requirement.skills.map((sk, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate Eligibility Status Banner */}
        <div className={`mt-6 p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          requirement.eligibility === 'Eligible'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : requirement.eligibility === 'Likely Eligible'
            ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            {requirement.eligibility === 'Eligible' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider">
                Candidate Status: {requirement.eligibility}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {requirement.eligibility === 'Eligible'
                  ? 'Your verified assessment score and academic criteria meet all hiring standards.'
                  : requirement.eligibility === 'Likely Eligible'
                  ? 'Your profile is highly competitive. Complete the specialized assessment to confirm eligibility.'
                  : 'Take the required assessment to achieve the minimum passing threshold.'}
              </div>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 shrink-0">
            {requirement.eligibility}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          {requirement.userHasCertification && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigateTo('certificates');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View Certificate</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStartTest}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Take Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {requirement.eligibility === 'Eligible' && (
            <button
              type="button"
              disabled={appliedSuccess}
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{appliedSuccess ? 'Application Submitted ✓' : 'Apply with Credential'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
