import React from 'react';
import { Assessment } from '../../types';
import {
  X,
  Clock,
  FileCode2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Award,
  Terminal,
  ArrowRight
} from 'lucide-react';

interface AssessmentInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment | null;
  onStart: (assessmentId: string) => void;
}

export const AssessmentInstructionsModal: React.FC<AssessmentInstructionsModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onStart
}) => {
  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-dropdown rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Background Accent Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-600/25 shrink-0">
            <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1">
              Assessment Pre-Flight Briefing
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {assessment.skillName} Verification Assessment
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review test parameters, scoring criteria, and guidelines before beginning.
            </p>
          </div>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <Clock className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <div className="text-base font-bold text-white">{assessment.durationMinutes} Minutes</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Time Limit</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <FileCode2 className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-base font-bold text-white">{assessment.questionCount} Questions</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Items</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-base font-bold text-emerald-400">{assessment.passingScore}% Pass</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Min Score</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-base font-bold text-amber-300">{assessment.difficulty}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Difficulty</div>
          </div>
        </div>

        {/* Scrollable Guidelines & Topics */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1 mb-6 text-xs">
          
          {/* Syllabus Topics */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              Syllabus & Tested Competencies
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {assessment.syllabus.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300 bg-slate-950/50 p-2 rounded-xl border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span className="truncate">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Rules */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Assessment Rules & Engine Guidelines
            </h4>
            
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Multiple-Choice & Code-Output:</strong> Questions test both theoretical principles and concrete code output prediction.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Flexible Navigation:</strong> You may jump between questions, change answers, and flag items for review before submission.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Immediate Automated Grading:</strong> Upon clicking submit, the grading engine calculates your score, accuracy, and detailed rationale instantly.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Profile & Team Sync:</strong> Passing with ≥ {assessment.passingScore}% marks your skill as <span className="text-emerald-300 font-bold">VERIFIED</span> on your public developer card and matches you with hackathon teams.
                </span>
              </div>
            </div>
          </div>

          {/* Notice Alert */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Once you click <strong>Begin Assessment Now</strong>, the {assessment.durationMinutes}-minute countdown timer starts immediately. Make sure you are in a quiet environment.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={() => {
              onClose();
              onStart(assessment.id);
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4 fill-current text-amber-300" />
            Begin Assessment Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
