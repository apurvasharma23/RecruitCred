import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TeamChallenge, Question } from '../../types';
import {
  X,
  Zap,
  Clock,
  Terminal,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check
} from 'lucide-react';

interface TakeChallengeModalProps {
  challenge: TeamChallenge | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TakeChallengeModal: React.FC<TakeChallengeModalProps> = ({
  challenge,
  isOpen,
  onClose
}) => {
  const { assessments, submitTeamChallenge } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer state
  const totalSeconds = (challenge?.timeLimitMinutes || 10) * 60;
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(totalSeconds);

  useEffect(() => {
    if (!isOpen || !challenge) return;
    setTimeRemainingSeconds((challenge.timeLimitMinutes || 10) * 60);
    setCurrentIndex(0);
    setAnswers({});
  }, [isOpen, challenge]);

  useEffect(() => {
    if (!isOpen || timeRemainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeRemainingSeconds]);

  if (!isOpen || !challenge) return null;

  // Find matching questions for the skill
  const matchingAssessment = assessments.find(
    a => a.skillName.toLowerCase() === challenge.skillName.toLowerCase()
  ) || assessments[0];

  const questions: Question[] = matchingAssessment.questions.slice(0, challenge.questionCount || 5);
  const currentQ = questions[currentIndex] || questions[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: idx
    }));
  };

  const handleSubmitChallenge = (forcedAnswers?: { [qId: string]: number }, forcedTimeSpent?: number) => {
    setIsSubmitting(true);

    const evaluatedAnswers = forcedAnswers || answers;
    let correctCount = 0;
    questions.forEach(q => {
      if (evaluatedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const accuracy = Math.round((correctCount / questions.length) * 100);
    // If user got 4/5 or 5/5, calculate score e.g. 91%
    const score = accuracy === 100 ? 98 : accuracy === 80 ? 91 : accuracy;
    const timeSpent = forcedTimeSpent || (totalSeconds - timeRemainingSeconds);

    setTimeout(() => {
      submitTeamChallenge(challenge.id, score, evaluatedAnswers, timeSpent);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleSimulateStrongCandidate = () => {
    const autoAnswers: { [qId: string]: number } = {};
    questions.forEach((q, idx) => {
      // 90% correct
      autoAnswers[q.id] = (idx === questions.length - 1 && questions.length > 3) ? (q.correctAnswer + 1) % 4 : q.correctAnswer;
    });
    setAnswers(autoAnswers);
    handleSubmitChallenge(autoAnswers, 462); // 7:42
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-dropdown rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col justify-between max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base sm:text-lg">
                  {challenge.teamName} Skill Test
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {challenge.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {challenge.skillName} • Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          {/* Live Timer */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
              timeRemainingSeconds < 120
                ? 'bg-rose-950/60 text-rose-400 border-rose-500/50 animate-pulse'
                : 'bg-slate-950 text-emerald-400 border-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Fast Simulator Banner */}
        <div className="mb-4 p-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs">
          <span className="text-indigo-200 text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <strong>Demo Fast Flow:</strong> Simulate full candidate submission
          </span>
          <button
            onClick={handleSimulateStrongCandidate}
            className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] shadow-sm transition-all shrink-0"
          >
            ⚡ Auto-Submit (91% • 7:42)
          </button>
        </div>

        {/* Question Content */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          
          <h4 className="text-sm sm:text-base font-extrabold text-white leading-relaxed">
            {currentQ.question}
          </h4>

          {/* Code Snippet Box */}
          {currentQ.codeSnippet && (
            <div className="rounded-2xl bg-[#070A10] border border-slate-800 overflow-hidden shadow-inner">
              <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>{currentQ.codeLanguage || 'code'}</span>
              </div>
              <pre className="p-3 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Multiple-Choice Options */}
          <div className="space-y-2.5 pt-1">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQ.id] === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3 group ${
                    isSelected
                      ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-glow-brand font-medium ring-1 ring-indigo-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="pt-0.5">{opt}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Bottom Navigation Controls */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border ${
              currentIndex === 0
                ? 'opacity-30 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Next Question
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled={isSubmitting}
              onClick={() => handleSubmitChallenge()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'Evaluating...' : 'Submit Challenge to Team Lead'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
