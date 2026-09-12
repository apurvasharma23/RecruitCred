import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPREHENSIVE_ASSESSMENTS } from '../../mockData/assessmentData';
import { IntegrityEvent } from '../../types';
import { VisionEngine, VisionMetrics, GazeDirection } from '../../services/vision/visionEngine';
import { VisionDebugOverlay } from './VisionDebugOverlay';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Flag,
  Terminal,
  X,
  Copy,
  Check,
  AlertCircle,
  Camera,
  Maximize,
  Eye,
  Info,
  Users,
  LogOut,
  RefreshCw
} from 'lucide-react';

type PauseReason =
  | 'none'
  | 'camera_interrupted'
  | 'multiple_faces'
  | 'face_missing'
  | 'looking_away'
  | 'fullscreen_exited'
  | 'focus_lost'
  | 'vision_unavailable';

export const AssessmentRunnerView: React.FC = () => {
  const {
    assessments,
    selectedAssessmentId,
    submitAssessment,
    navigateTo
  } = useApp();

  // Find target assessment from comprehensive catalogue or fallback
  const assessment = COMPREHENSIVE_ASSESSMENTS.find(a => a.id === selectedAssessmentId) || 
    assessments.find(a => a.id === selectedAssessmentId) || 
    COMPREHENSIVE_ASSESSMENTS[0];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [qId: string]: boolean }>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(assessment.durationMinutes * 60);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Proctoring & Integrity States
  const [pauseReason, setPauseReason] = useState<PauseReason>('none');
  const [sessionToken] = useState<string>(() => `RC_SESSION_${Math.random().toString(16).substring(2, 10).toUpperCase()}`);
  const [integrityStatus, setIntegrityStatus] = useState<'Normal' | 'Attention Required' | 'Additional Verification Recommended'>('Normal');
  const [_integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multiple-face / Resuming verification state
  const [isResumingCheck, setIsResumingCheck] = useState(false);
  const [resumeFeedbackMessage, setResumeFeedbackMessage] = useState<string | null>(null);

  // Vision Engine & CV Telemetry
  const [visionMetrics, setVisionMetrics] = useState<VisionMetrics | null>(null);
  const [isDebugOverlayOpen, setIsDebugOverlayOpen] = useState(false);
  const visionEngineRef = useRef<VisionEngine | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const isExitingRef = useRef<boolean>(false);

  // Real-time canvas landmark overlay rendering for debug and verification
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas || !visionMetrics) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isDebugOverlayOpen && visionMetrics.faces.length > 0) {
      const scaleX = canvas.width / 320;
      const scaleY = canvas.height / 240;

      visionMetrics.faces.forEach(face => {
        // Face Box
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(face.x * scaleX, face.y * scaleY, face.width * scaleX, face.height * scaleY);

        // Left Eye Contour (6 points)
        if (face.leftEyeLandmarks && face.leftEyeLandmarks.length >= 6) {
          ctx.strokeStyle = '#22d3ee';
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          face.leftEyeLandmarks.forEach((pt, idx) => {
            const px = pt.x * scaleX;
            const py = pt.y * scaleY;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.stroke();

          face.leftEyeLandmarks.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x * scaleX, pt.y * scaleY, 1.2, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Right Eye Contour (6 points)
        if (face.rightEyeLandmarks && face.rightEyeLandmarks.length >= 6) {
          ctx.strokeStyle = '#22d3ee';
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          face.rightEyeLandmarks.forEach((pt, idx) => {
            const px = pt.x * scaleX;
            const py = pt.y * scaleY;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.stroke();

          face.rightEyeLandmarks.forEach(pt => {
            ctx.beginPath();
            ctx.arc(pt.x * scaleX, pt.y * scaleY, 1.2, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });
    }
  }, [visionMetrics, isDebugOverlayOpen]);

  // Unified cleanup function for exit, submission, or unmount
  const cleanupAssessmentEnvironment = useCallback(async () => {
    isExitingRef.current = true;

    // 1. Stop vision engine loop
    if (visionEngineRef.current) {
      visionEngineRef.current.stop();
    }

    // 2. Stop camera tracks
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {}
      });
      activeStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // 3. Exit fullscreen safely if active
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen().catch(() => {});
      } catch {}
    }
  }, []);

  // Initialize Vision Engine and Camera Stream
  useEffect(() => {
    isExitingRef.current = false;

    const visionEngine = new VisionEngine({
      targetFps: 15,
      faceConfirmationMs: 600,
      multipleFaceConfirmationMs: 1000,
      faceLostGraceMs: 2500,
      gazeWarningMs: 2800,
      blinkWindowMs: 14000
    });
    visionEngineRef.current = visionEngine;

    const startCameraAndVision = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 320 },
              height: { ideal: 240 },
              facingMode: 'user'
            }
          });
          activeStreamRef.current = stream;

          if (videoRef.current && !isExitingRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              if (isExitingRef.current) return;
              videoRef.current?.play().catch(() => {});
              visionEngine.initialize(videoRef.current!, handleVisionMetricsUpdate);
            };
          }
        }
      } catch (err) {
        console.warn('Proctoring webcam fallback in test mode:', err);
        if (videoRef.current && !isExitingRef.current) {
          visionEngine.initialize(videoRef.current, handleVisionMetricsUpdate);
        }
      }
    };

    startCameraAndVision();

    return () => {
      cleanupAssessmentEnvironment();
    };
  }, [cleanupAssessmentEnvironment]);

  // Handle updates from the Vision Engine state machine
  const handleVisionMetricsUpdate = (metrics: VisionMetrics) => {
    if (isExitingRef.current) return;
    setVisionMetrics(metrics);

    // Sync state machine transitions to assessment pauses and warnings
    if (metrics.state === 'MULTIPLE_FACES') {
      setPauseReason('multiple_faces');
      setResumeFeedbackMessage(null);
      recordIntegritySignal(
        'multiple_faces',
        'medium',
        `Multiple faces detected (${metrics.faceCount} people visible in camera frame)`
      );
    } else if (metrics.state === 'FACE_MISSING') {
      setPauseReason('face_missing');
      recordIntegritySignal(
        'face_missing',
        'low',
        'Candidate presence could not be verified (0 faces detected beyond grace period)'
      );
    } else if (metrics.state === 'LOOKING_AWAY') {
      setPauseReason('looking_away');
      recordIntegritySignal(
        'focus_loss',
        'low',
        `Candidate oriented gaze away from test window (${metrics.gazeDirection}, Yaw: ${metrics.yawDegrees}°)`
      );
    } else if (metrics.state === 'CAMERA_INTERRUPTED') {
      setPauseReason('camera_interrupted');
      recordIntegritySignal('camera_interruption', 'high', 'Camera stream disconnected or video track interrupted');
    } else if (metrics.state === 'VISION_UNAVAILABLE') {
      setPauseReason('vision_unavailable');
    } else if (metrics.state === 'ATTENTION_WARNING') {
      showToast('Attention check: Please keep your attention focused on the test screen.');
    }
  };

  // Timer countdown
  useEffect(() => {
    if (pauseReason !== 'none' || isExitingRef.current) return;

    if (timeRemainingSeconds <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemainingSeconds, pauseReason]);

  // Log an integrity event and update status without being accusatory
  const recordIntegritySignal = (
    type: IntegrityEvent['type'],
    severity: 'low' | 'medium' | 'high',
    details: string
  ) => {
    if (isExitingRef.current) return;

    const newEvent: IntegrityEvent = {
      id: `evt-${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      severity,
      details
    };

    setIntegrityEvents(prev => {
      const updated = [...prev, newEvent];
      const mediumOrHighCount = updated.filter(e => e.severity === 'medium' || e.severity === 'high').length;
      if (mediumOrHighCount >= 3) {
        setIntegrityStatus('Additional Verification Recommended');
      } else if (mediumOrHighCount >= 1) {
        setIntegrityStatus('Attention Required');
      }
      return updated;
    });
  };

  // Browser Focus & Visibility Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isExitingRef.current) return;
      if (document.hidden) {
        recordIntegritySignal('focus_loss', 'medium', 'Candidate navigated away from assessment window');
        showToast('Assessment focus was lost. Please keep this tab active.');
        setPauseReason('focus_lost');
      }
    };

    const handleFullscreenChange = () => {
      if (isExitingRef.current) return;
      const isFullscreen = document.fullscreenElement !== null;
      if (!isFullscreen) {
        recordIntegritySignal('fullscreen_exit', 'low', 'Fullscreen mode ended.');
        setPauseReason('fullscreen_exited');
      }
    };

    const handleCopy = (_e: ClipboardEvent) => {
      if (isExitingRef.current) return;
      recordIntegritySignal('copy_paste', 'low', 'Question text copy action recorded.');
      showToast('Copy action recorded in integrity telemetry.');
    };

    const handlePaste = (_e: ClipboardEvent) => {
      if (isExitingRef.current) return;
      recordIntegritySignal('copy_paste', 'low', 'Paste action recorded in assessment window.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitModalOpen || isExitModalOpen || pauseReason !== 'none' || isExitingRef.current) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIndex = parseInt(e.key, 10) - 1;
        if (currentQuestion && optionIndex < currentQuestion.options.length) {
          handleSelectOption(optionIndex);
        }
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const optionIndex = e.key.toLowerCase().charCodeAt(0) - 97;
        if (currentQuestion && optionIndex < currentQuestion.options.length) {
          handleSelectOption(optionIndex);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(prev => prev - 1);
        }
      } else if (e.key === 'D' && e.shiftKey) {
        setIsDebugOverlayOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, isSubmitModalOpen, isExitModalOpen, pauseReason, assessment.questions]);

  const currentQuestion = assessment.questions[currentQuestionIndex] || assessment.questions[0];
  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const copyCodeToClipboard = () => {
    if (currentQuestion.codeSnippet) {
      navigator.clipboard.writeText(currentQuestion.codeSnippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  // Re-check camera & face state before resuming from multiple-face detection
  const handleConfirmSingleCandidateAndResume = async () => {
    setIsResumingCheck(true);
    setResumeFeedbackMessage('Checking camera view…');

    if (!visionEngineRef.current) {
      setIsResumingCheck(false);
      setPauseReason('none');
      return;
    }

    // Active multi-frame stability check
    const check = await visionEngineRef.current.validateSingleFaceStability(600);

    if (check.valid) {
      setResumeFeedbackMessage('Candidate verified. Resuming assessment…');
      await new Promise(r => setTimeout(r, 350));
      
      // Reset vision state counters to prevent immediate re-trigger
      visionEngineRef.current.clearSimulationOverride();
      visionEngineRef.current.resetStateCounters();
      
      setPauseReason('none');
      setResumeFeedbackMessage(null);
      setIsResumingCheck(false);
    } else {
      // Keep paused and show clear feedback
      setResumeFeedbackMessage(check.message);
      setIsResumingCheck(false);
    }
  };

  const handleResumeFromFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // Ignore
    }
    setPauseReason('none');
  };

  // Manual Exit Flow
  const handleConfirmExit = async () => {
    setIsExitModalOpen(false);
    await cleanupAssessmentEnvironment();
    navigateTo('assessments');
  };

  // Final Assessment Submission Flow
  const handleFinalSubmit = async () => {
    setIsSubmitModalOpen(false);
    const timeSpent = (assessment.durationMinutes * 60) - timeRemainingSeconds;
    await cleanupAssessmentEnvironment();
    const result = submitAssessment(assessment.id, userAnswers, timeSpent);
    navigateTo('assessment-result', { attemptId: result.id });
  };

  // Developer Simulation Helpers
  const handleSimulateSignal = (override: {
    forcedFaceCount?: number;
    forcedGaze?: GazeDirection;
    forcedBlink?: boolean;
    forcedCameraDrop?: boolean;
    forcedModelError?: boolean;
  }) => {
    if (visionEngineRef.current) {
      visionEngineRef.current.setSimulationOverride(override);
    }
  };

  const handleResetSimulation = () => {
    if (visionEngineRef.current) {
      visionEngineRef.current.clearSimulationOverride();
    }
    setPauseReason('none');
    setResumeFeedbackMessage(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-indigo-500/50 text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-in slide-in-from-top duration-200">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Test Navigation Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        
        {/* Left: Skill title & Question count */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-sm sm:text-base">
                {assessment.skillName}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                {assessment.difficulty}
              </span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                {sessionToken}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>•</span>
              <span>Pass threshold: <strong className="text-emerald-400">{assessment.passingScore}%</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Small Webcam Feed, Live Timer, Submit, and Exit Assessment Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Integrity Status Indicator */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold ${
            integrityStatus === 'Normal'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
              : integrityStatus === 'Attention Required'
              ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
              : 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              integrityStatus === 'Normal' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`} />
            <span>Integrity: {integrityStatus}</span>
          </div>

          {/* Small Unobtrusive Webcam Tile with Real-time CV HUD */}
          <div className="relative w-28 h-20 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0 shadow-inner group">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Live Real-time Landmark Overlay Canvas */}
            <canvas
              ref={overlayCanvasRef}
              width={112}
              height={80}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />

            {/* Live CV Badge & Face Count Overlay */}
            <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-mono text-emerald-400 z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {visionMetrics ? `FACES: ${visionMetrics.faceCount}` : 'LIVE'}
              </span>
            </div>

            {/* Live Blink Indicator */}
            {visionMetrics && visionMetrics.blinkDetected && (
              <div className="absolute top-1 right-1 bg-cyan-500/90 text-black font-black px-1 rounded text-[7px] font-mono animate-ping z-20">
                BLINK
              </div>
            )}

            {/* Calibration / Attention Pill */}
            {visionMetrics && visionMetrics.state === 'CALIBRATING' && (
              <div className="absolute bottom-1 inset-x-1 bg-indigo-950/90 border border-indigo-500/50 rounded text-[7px] font-mono text-indigo-200 text-center py-0.5 animate-pulse z-20">
                CALIBRATING {visionMetrics.calibrationProgress}%
              </div>
            )}
          </div>

          {/* Live Timer */}
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border font-mono font-bold text-xs sm:text-sm transition-all ${
            timeRemainingSeconds < 180
              ? 'bg-rose-950/60 text-rose-400 border-rose-500/60 animate-pulse'
              : 'bg-slate-950 text-emerald-400 border-slate-800'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          {/* Submit Action */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            Submit
          </button>

          {/* Explicit Exit Assessment Button */}
          <button
            onClick={() => setIsExitModalOpen(true)}
            className="p-2 rounded-2xl bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer"
            title="Exit Assessment"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Overall Progress: <strong>{answeredCount} of {totalQuestions}</strong> Answered</span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div className="w-full bg-slate-900 border border-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Main Question Card (Left 8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between min-h-[520px]">
          <div>
            
            {/* Category tag & Flag button */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700">
                  {currentQuestion.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Q{currentQuestionIndex + 1}/{totalQuestions}
                </span>
              </div>

              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  flaggedQuestions[currentQuestion.id]
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQuestion.id] ? 'fill-current' : ''}`} />
                {flaggedQuestions[currentQuestion.id] ? 'Flagged for Review' : 'Flag Question'}
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-extrabold text-white leading-relaxed mb-5">
              {currentQuestion.question}
            </h3>

            {/* Code Snippet Box */}
            {currentQuestion.codeSnippet && (
              <div className="mb-6 rounded-2xl bg-[#070A10] border border-slate-800 overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-2 text-indigo-400">
                    <Terminal className="w-3.5 h-3.5" />
                    {currentQuestion.codeLanguage || 'code'}
                  </span>
                  
                  <button
                    onClick={copyCodeToClipboard}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedSnippet ? 'Copied' : 'Copy'}
                  </button>
                </div>
                
                <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto leading-relaxed selection:bg-cyan-900 selection:text-white">
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 group cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-glow-brand ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-700 group-hover:border-slate-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <span className="text-xs sm:text-sm font-medium leading-relaxed flex-1 pt-0.5">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Bottom Prev / Next Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                currentQuestionIndex === 0
                  ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-600'
                  : 'text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.02] cursor-pointer"
              >
                Next Question
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 hover:scale-[1.02] cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Assessment
              </button>
            )}
          </div>

        </div>

        {/* Question Palette Navigator (Right 4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-white text-sm">Question Navigator</h4>
              <span className="text-[10px] text-indigo-400 font-semibold font-mono">
                {answeredCount}/{totalQuestions} Answered
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Click any question to jump instantly.</p>

            {/* Interactive Number Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {assessment.questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isFlagged = flaggedQuestions[q.id];
                const isCurrent = idx === currentQuestionIndex;

                let btnStyle = 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600';
                if (isCurrent) {
                  btnStyle = 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-500/50 font-black scale-105';
                } else if (isFlagged) {
                  btnStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold';
                } else if (isAnswered) {
                  btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-2xl border text-xs transition-all relative flex items-center justify-center cursor-pointer ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && !isCurrent && (
                      <span className="absolute top-1 right-1 text-[8px]">🚩</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Palette Legend */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
                  <span>Answered</span>
                </div>
                <span className="font-bold text-white">{answeredCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50" />
                  <span>Flagged for Review</span>
                </div>
                <span className="font-bold text-white">
                  {Object.values(flaggedQuestions).filter(Boolean).length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
                  <span>Unanswered</span>
                </div>
                <span className="font-bold text-white">{totalQuestions - answeredCount}</span>
              </div>
            </div>

            {/* Shortcuts hint */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Shortcuts: Press <strong>A-D</strong> or <strong>1-4</strong> to answer</span>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Assessment ({answeredCount}/{totalQuestions})
            </button>
          </div>
        </div>

      </div>

      {/* PROCTORING PAUSE OVERLAYS */}
      {pauseReason !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl text-center space-y-4">
            
            {/* Multiple Faces Pause Flow */}
            {pauseReason === 'multiple_faces' && (
              <>
                <div className="p-4 rounded-3xl bg-amber-500/20 text-amber-400 w-fit mx-auto border border-amber-500/30">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Multiple People Detected</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Multiple people were detected in the camera frame. Please ensure that only the candidate is visible before continuing.
                </p>

                {/* Feedback message during validation */}
                {resumeFeedbackMessage && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    resumeFeedbackMessage.includes('verified')
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                  }`}>
                    {resumeFeedbackMessage}
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsExitModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Exit Assessment
                  </button>
                  
                  <button
                    disabled={isResumingCheck}
                    onClick={handleConfirmSingleCandidateAndResume}
                    className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      isResumingCheck
                        ? 'bg-indigo-700 opacity-70 cursor-wait'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:scale-[1.02]'
                    }`}
                  >
                    {isResumingCheck && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isResumingCheck ? 'Checking camera view…' : 'Confirm Single Candidate & Resume'}</span>
                  </button>
                </div>
              </>
            )}

            {/* Camera Interrupted Flow */}
            {pauseReason === 'camera_interrupted' && (
              <>
                <div className="p-4 rounded-3xl bg-rose-500/20 text-rose-400 w-fit mx-auto border border-rose-500/30">
                  <Camera className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white">Camera Connection Interrupted</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Camera connection was interrupted. Your assessment is paused until camera verification is restored.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsExitModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Exit Assessment
                  </button>
                  <button
                    onClick={() => {
                      handleResetSimulation();
                      setPauseReason('none');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Restore Camera Access & Resume
                  </button>
                </div>
              </>
            )}

            {/* Face Missing Flow */}
            {pauseReason === 'face_missing' && (
              <>
                <div className="p-4 rounded-3xl bg-amber-500/20 text-amber-400 w-fit mx-auto border border-amber-500/30">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Presence Verification Required</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We can’t currently verify your presence. Please return to the camera view.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsExitModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Exit Assessment
                  </button>
                  <button
                    onClick={handleConfirmSingleCandidateAndResume}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Return to Camera View & Continue
                  </button>
                </div>
              </>
            )}

            {/* Looking Away Flow */}
            {pauseReason === 'looking_away' && (
              <>
                <div className="p-4 rounded-3xl bg-indigo-500/20 text-indigo-400 w-fit mx-auto border border-indigo-500/30">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Attention Verification Required</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Please keep your attention on the assessment screen.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsExitModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Exit Assessment
                  </button>
                  <button
                    onClick={() => {
                      handleResetSimulation();
                      setPauseReason('none');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Orient to Screen & Resume
                  </button>
                </div>
              </>
            )}

            {/* Fullscreen Exited Flow */}
            {pauseReason === 'fullscreen_exited' && (
              <>
                <div className="p-4 rounded-3xl bg-indigo-500/20 text-indigo-400 w-fit mx-auto border border-indigo-500/30">
                  <Maximize className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Fullscreen Mode Ended</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fullscreen mode ended. Return to fullscreen to continue your assessment.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsExitModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Exit Assessment
                  </button>
                  <button
                    onClick={handleResumeFromFullscreen}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Re-enter Fullscreen & Continue
                  </button>
                </div>
              </>
            )}

            {/* Focus Lost Flow */}
            {pauseReason === 'focus_lost' && (
              <>
                <div className="p-4 rounded-3xl bg-amber-500/20 text-amber-400 w-fit mx-auto border border-amber-500/30">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Assessment Focus Lost</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assessment window focus was lost. Return to the assessment window to continue.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsExitModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Exit Assessment
                  </button>
                  <button
                    onClick={() => setPauseReason('none')}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Resume Assessment
                  </button>
                </div>
              </>
            )}

            {/* Vision Unavailable Flow */}
            {pauseReason === 'vision_unavailable' && (
              <>
                <div className="p-4 rounded-3xl bg-rose-500/20 text-rose-400 w-fit mx-auto border border-rose-500/30">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Vision Model Unavailable</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Camera verification could not be initialized. Please restart the system check.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsExitModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Exit Assessment
                  </button>
                  <button
                    onClick={() => {
                      handleResetSimulation();
                      setPauseReason('none');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Retry Vision Check
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Confirmation Modal Before Submission */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 w-fit mb-4 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Ready to Submit Assessment?</h3>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              You have completed <strong className="text-emerald-400">{answeredCount} of {totalQuestions}</strong> questions. 
              Once confirmed, your answers will be submitted to the backend grading engine for evaluation and credential issuance.
            </p>

            {totalQuestions - answeredCount > 0 && (
              <div className="mb-6 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong>Warning:</strong> You still have <strong>{totalQuestions - answeredCount} unanswered</strong> question(s). Unanswered questions will receive 0 points.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Review Answers
              </button>
              
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Exit Confirmation Modal */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
            <button
              onClick={() => setIsExitModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 w-fit mb-4 border border-rose-500/30">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Exit Assessment?</h3>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              You have completed <strong className="text-white">{answeredCount} of {totalQuestions}</strong> questions. 
              Your current progress and session state will be safely saved. Are you sure you want to return to the Assessment Center?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Continue Assessment
              </button>
              
              <button
                onClick={handleConfirmExit}
                className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                Exit Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Computer-Vision Debug Inspector HUD */}
      <VisionDebugOverlay
        metrics={visionMetrics}
        isOpen={isDebugOverlayOpen}
        onToggle={() => setIsDebugOverlayOpen(prev => !prev)}
        onSimulate={handleSimulateSignal}
        onResetSimulation={handleResetSimulation}
      />

    </div>
  );
};
