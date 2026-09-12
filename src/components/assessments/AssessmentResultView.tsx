import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateModal } from '../certificates/CertificateModal';
import { DigitalCertificate } from '../../types';
import { COMPREHENSIVE_ASSESSMENTS, DEMO_ASSESSMENT_ATTEMPTS } from '../../mockData/assessmentData';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Trophy,
  RotateCcw,
  Sparkles,
  Check,
  X,
  BookOpen,
  Award,
  Download,
  Eye,
  TrendingUp,
  AlertCircle,
  Info
} from 'lucide-react';

export const AssessmentResultView: React.FC = () => {
  const {
    attempts,
    selectedAttemptId,
    assessments,
    currentUser,
    startAssessment,
    navigateTo
  } = useApp();

  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Combine attempts
  const allAttempts = attempts.length > 0 ? attempts : DEMO_ASSESSMENT_ATTEMPTS;
  const attempt = allAttempts.find(a => a.id === selectedAttemptId) || allAttempts[0];

  const allAssessments = COMPREHENSIVE_ASSESSMENTS;
  const assessment = allAssessments.find(a => a.id === attempt?.assessmentId || a.skillName.toLowerCase() === attempt?.skillName.toLowerCase()) || 
    assessments.find(a => a.id === attempt?.assessmentId) || 
    allAssessments[0];

  useEffect(() => {
    if (attempt?.passed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [attempt?.passed]);

  if (!attempt) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-white">No assessment attempt record found.</h3>
        <button
          onClick={() => navigateTo('assessments')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Browse Assessment Center
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const certificateId = `RC-${attempt.skillName.substring(0, 2).toUpperCase()}-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const dynamicCertificate: DigitalCertificate = {
    id: `cert-${attempt.id}`,
    certificateId: certificateId,
    candidateName: currentUser.name,
    candidateId: currentUser.id,
    assessmentName: `RecruitCred ${attempt.skillName} Assessment`,
    skillName: attempt.skillName,
    score: attempt.score,
    issueDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Valid',
    issuer: 'RecruitCred',
    verificationUrl: `https://recruitcred.dev/verify/${certificateId}`,
    criteria: `Demonstrated technical competency in ${attempt.skillName} by scoring ≥ ${assessment.passingScore}% on proctored evaluation.`
  };

  const filteredQuestions = assessment.questions.filter(q => {
    const userAnswer = attempt.answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (reviewFilter === 'correct') return isCorrect;
    if (reviewFilter === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Top Celebration & Official Result Card */}
      <div className={`p-8 sm:p-10 rounded-3xl border text-center relative overflow-hidden shadow-2xl ${
        attempt.passed
          ? 'bg-gradient-to-b from-slate-900 via-emerald-950/30 to-slate-900 border-emerald-500/50 shadow-glow-verified'
          : 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-slate-700/80'
      }`}>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Status Icon */}
          <div className={`p-4 rounded-3xl mb-4 shadow-xl ${
            attempt.passed
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-bounce'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}>
            {attempt.passed ? <Trophy className="w-10 h-10" /> : <AlertCircle className="w-10 h-10 text-amber-400" />}
          </div>

          {/* Assessment Header Status */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3 border shadow-sm ${
            attempt.passed
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}>
            {attempt.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Info className="w-4 h-4 text-amber-400" />}
            {attempt.passed ? 'Assessment Passed' : 'Assessment Not Passed'}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {attempt.passed ? `Assessment Complete — ${attempt.skillName}` : `Assessment Result — ${attempt.skillName}`}
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
            {attempt.passed ? (
              <>
                You scored <strong className="text-emerald-400 font-bold">{attempt.score}%</strong> (Passing threshold: {assessment.passingScore}%).
                Your skill level has been verified and added to your RecruitCred profile.
              </>
            ) : (
              <>
                You scored <strong className="text-white font-bold">{attempt.score}%</strong> (Passing threshold: {assessment.passingScore}%).
                You can strengthen your preparation in the highlighted competency areas and attempt the assessment again when eligible.
              </>
            )}
          </p>

          {/* Dynamic Certificate Action Card (When Passed) */}
          {attempt.passed && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 shadow-glow-verified flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-xl">
              <div className="flex items-center gap-3 text-left">
                <Award className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>RecruitCred Digital Certificate Issued</span>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-400 mt-0.5">
                    ID: <strong>{certificateId}</strong> · Contribution: <strong>+8%</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* 4 PRIMARY METRIC TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-8 pt-8 border-t border-slate-800/80">
            
            {/* Score */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Score</div>
              <div className={`text-2xl sm:text-3xl font-black mt-1.5 ${attempt.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {attempt.score}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Threshold: {assessment.passingScore}%</div>
            </div>

            {/* Accuracy */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Accuracy</div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-1.5">
                {attempt.correctAnswersCount}/{attempt.totalQuestions}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Correct Answers</div>
            </div>

            {/* Time Taken */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Time Spent</div>
              <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono mt-1.5">
                {formatTime(attempt.timeSpentSeconds)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">of {assessment.durationMinutes}:00 limit</div>
            </div>

            {/* Skill Level */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Skill Level</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1.5">
                {attempt.passed ? (attempt.level || 'Intermediate') : 'Preparation'}
              </div>
              <div className="text-[11px] text-indigo-400 mt-0.5">
                {attempt.passed ? 'Level 1 Verified' : 'Next Level: Level 1'}
              </div>
            </div>

          </div>

          {/* FAILED FLOW: RECOMMENDED LEARNING & RETRY RULES */}
          {!attempt.passed && (
            <div className="mt-8 p-6 rounded-3xl bg-slate-950 border border-slate-800 w-full text-left space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Recommended Preparation Areas & Next Steps
              </h4>
              
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                {assessment.syllabus.slice(0, 4).map((topic, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>

              {/* Retry Rules Info */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Assessment Retry Policy:</strong>
                  <span>You may re-attempt this assessment once you have reviewed the syllabus topics. Each attempt generates a fresh set of randomized questions from the question pool.</span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {attempt.passed && (
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                View & Download Certificate
              </button>
            )}

            <button
              onClick={() => navigateTo('assessments')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              Continue Skill Progression
            </button>

            <button
              onClick={() => navigateTo('assessments')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Back to Assessment Center
            </button>

            <button
              onClick={() => startAssessment(assessment.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </button>
          </div>

        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={dynamicCertificate}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      {/* Question Review Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Question Review & Explanations</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed technical explanations and optimal solutions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                reviewFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All ({assessment.questions.length})
            </button>

            <button
              onClick={() => setReviewFilter('correct')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                reviewFilter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Correct ({attempt.correctAnswersCount})
            </button>

            <button
              onClick={() => setReviewFilter('incorrect')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                reviewFilter === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Incorrect ({attempt.totalQuestions - attempt.correctAnswersCount})
            </button>
          </div>
        </div>

        {/* Question Cards */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const originalIndex = assessment.questions.findIndex(item => item.id === q.id);
            const userAnswer = attempt.answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-slate-950/60 border-emerald-500/30'
                    : 'bg-slate-950/60 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5 font-bold text-sm text-white">
                    <span className="text-slate-500 font-mono">Q{originalIndex + 1}.</span>
                    <span className="leading-relaxed">{q.question}</span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${
                    isCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {q.codeSnippet && (
                  <div className="my-3 rounded-xl bg-[#070A10] border border-slate-800 overflow-hidden">
                    <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                      {q.codeLanguage || 'code'}
                    </div>
                    <pre className="p-3 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3 my-3 text-xs">
                  <div className={`p-3 rounded-xl border ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}>
                    <span className="font-bold text-[11px] uppercase tracking-wider block mb-1">
                      Your Answer:
                    </span>
                    <span className="font-medium leading-relaxed">
                      {userAnswer !== undefined ? (
                        `${String.fromCharCode(65 + userAnswer)}. ${q.options[userAnswer]}`
                      ) : (
                        'No answer selected'
                      )}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200">
                    <span className="font-bold text-[11px] uppercase tracking-wider block mb-1 text-emerald-300">
                      Correct Answer:
                    </span>
                    <span className="font-medium leading-relaxed">
                      {String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mt-2">
                  <span className="font-bold text-indigo-400 block mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Concept Explanation:
                  </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
