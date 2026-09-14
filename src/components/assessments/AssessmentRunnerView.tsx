import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPREHENSIVE_ASSESSMENTS } from '../../mockData/assessmentData';
import { IntegrityEvent } from '../../types';
import { VisionEngine, VisionMetrics, GazeDirection } from '../../services/vision/visionEngine';
import { cameraManager } from '../../services/proctoring/cameraManager';
import {
  isBrowserFullscreen,
  requestBrowserFullscreen,
  exitBrowserFullscreen,
  addFullscreenChangeListener
} from '../../services/proctoring/fullscreenManager';
import { VisionDebugOverlay } from './VisionDebugOverlay';
import { apiRecordViolation } from '../../services/api/assessmentService';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Flag,
  Terminal,
  X,
  AlertCircle,
  Camera,
  Eye,
  Info,
  Users,
  RefreshCw,
  ShieldAlert,
  AlertTriangle,
  CameraOff,
  Maximize
} from 'lucide-react';

type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'blocked'
  | 'not_found'
  | 'in_use'
  | 'insecure_context'
  | 'security_error'
  | 'overconstrained'
  | 'type_error'
  | 'disconnected'
  | 'stream_failed'
  | 'rendering_stalled'
  | 'error';

type PauseReason =
  | 'none'
  | 'camera_interrupted'
  | 'multiple_faces'
  | 'face_missing'
  | 'looking_away'
  | 'fullscreen_exited'
  | 'focus_lost'
  | 'vision_unavailable'
  | 'cheating_critical'
  | 'max_warnings_reached';

export const AssessmentRunnerView: React.FC = () => {
  const {
    assessments,
    selectedAssessmentId,
    activeAssessmentSessionId,
    currentUser,
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

  // Centralized Proctoring & Integrity States
  const [pauseReason, setPauseReason] = useState<PauseReason>('none');
  const [serverWarningCount, setServerWarningCount] = useState<number>(0);
  const [sessionToken] = useState<string>(() => `RC_SESSION_${Math.random().toString(16).substring(2, 10).toUpperCase()}`);
  const [integrityStatus, setIntegrityStatus] = useState<'Normal' | 'Attention Required' | 'Additional Verification Recommended'>('Normal');
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'info' | 'warning' | 'error' } | null>(null);

  // Camera & Sensor States
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('requesting');
  const [cameraErrorMessage, setCameraErrorMessage] = useState<string | null>(null);

  // Multiple-face / Resuming verification state
  const [isResumingCheck, setIsResumingCheck] = useState(false);
  const [resumeFeedbackMessage, setResumeFeedbackMessage] = useState<string | null>(null);

  // Vision Engine & CV Telemetry
  const [visionMetrics, setVisionMetrics] = useState<VisionMetrics | null>(null);
  const [isDebugOverlayOpen, setIsDebugOverlayOpen] = useState(false);
  const visionEngineRef = useRef<VisionEngine | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isExitingRef = useRef<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  const autoSubmitReasonRef = useRef<string | null>(null);
  const lastWarningTimestampsRef = useRef<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamHealthCheckTimerRef = useRef<any>(null);

  // Fullscreen State Machine
  const [isFullscreenActive, setIsFullscreenActive] = useState<boolean>(() => isBrowserFullscreen());
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const fullscreenEstablishedRef = useRef<boolean>(isBrowserFullscreen());
  const fullscreenMonitoringActiveRef = useRef<boolean>(false);

  // Mutable refs for stable event dispatchers
  const serverWarningCountRef = useRef<number>(0);
  serverWarningCountRef.current = serverWarningCount;
  const activeSessionIdRef = useRef<string | null>(activeAssessmentSessionId);
  activeSessionIdRef.current = activeAssessmentSessionId;
  const currentUserIdRef = useRef<string>(currentUser?.id || 'anonymous');
  currentUserIdRef.current = currentUser?.id || 'anonymous';

  // Manual Fullscreen Handler (if browser required another gesture or rejected)
  const handleManualEnterFullscreen = async () => {
    setFullscreenError(null);
    const ok = await requestBrowserFullscreen();
    if (ok || isBrowserFullscreen()) {
      setIsFullscreenActive(true);
      fullscreenEstablishedRef.current = true;
      setTimeout(() => {
        if (isBrowserFullscreen() && !isExitingRef.current) {
          fullscreenMonitoringActiveRef.current = true;
          console.log('[AssessmentSecurity] Fullscreen monitoring is active.');
        }
      }, 1000);
    } else {
      setFullscreenError('Fullscreen could not be enabled. Please click again or allow fullscreen in Safari settings.');
    }
  };

  // Real-time canvas landmark overlay rendering for HUD
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas || !visionMetrics) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (visionMetrics.faces.length > 0) {
      const scaleX = canvas.width / 320;
      const scaleY = canvas.height / 240;

      visionMetrics.faces.forEach(face => {
        // Face Box
        ctx.strokeStyle = face.confidence > 0.6 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 1;
        ctx.strokeRect(face.x * scaleX, face.y * scaleY, face.width * scaleX, face.height * scaleY);

        // Eye Landmarks
        if (face.leftEyeLandmarks && face.leftEyeLandmarks.length >= 6) {
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          face.leftEyeLandmarks.forEach((pt, idx) => {
            const px = pt.x * scaleX;
            const py = pt.y * scaleY;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.stroke();
        }

        if (face.rightEyeLandmarks && face.rightEyeLandmarks.length >= 6) {
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          face.rightEyeLandmarks.forEach((pt, idx) => {
            const px = pt.x * scaleX;
            const py = pt.y * scaleY;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.closePath();
          ctx.stroke();
        }
      });
    }
  }, [visionMetrics]);

  // Unified cleanup function for exit, submission, or unmount
  const cleanupAssessmentEnvironment = useCallback(async () => {
    isExitingRef.current = true;
    fullscreenMonitoringActiveRef.current = false;

    if (streamHealthCheckTimerRef.current) {
      clearInterval(streamHealthCheckTimerRef.current);
      streamHealthCheckTimerRef.current = null;
    }

    // 1. Stop vision engine loop
    if (visionEngineRef.current) {
      visionEngineRef.current.stop();
    }

    // 2. Clear video element source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // 3. Exit fullscreen safely if active (will NOT trigger violation because isExitingRef & isSubmittingRef are true)
    await exitBrowserFullscreen();
  }, []);

  // Centralized Warning & Violation Dispatcher with Debounce / Cooldown
  const registerProctoringViolation = useCallback(async (
    type: IntegrityEvent['type'] | 'multiple_people_critical' | 'prohibited_object' | 'additional_camera',
    severity: 'low' | 'medium' | 'high',
    details: string,
    metadata?: Record<string, any>
  ) => {
    if (isExitingRef.current) return;

    const now = Date.now();
    const cooldownPeriodMs = 4500; // 4.5 seconds cooldown per category
    const lastTriggered = lastWarningTimestampsRef.current[type] || 0;

    // Critical violations bypass cooldown
    if (type !== 'multiple_people_critical' && type !== 'fullscreen_exit' && now - lastTriggered < cooldownPeriodMs) {
      return;
    }
    lastWarningTimestampsRef.current[type] = now;

    // 1. Critical Cheating: More than 3 people detected (>3 people)
    if (type === 'multiple_people_critical' || (metadata && metadata.faceCount > 3)) {
      autoSubmitReasonRef.current = 'More than 3 people were detected in the camera frame.';
      setPauseReason('cheating_critical');
      showToast('Assessment automatically submitted: cheating detected. More than 3 people were detected in the camera frame.', 'error');

      // Dispatch to server
      const sessId = activeSessionIdRef.current;
      const uId = currentUserIdRef.current;
      if (sessId) {
        apiRecordViolation({
          sessionId: sessId,
          userId: uId,
          type: 'multiple_people_critical',
          details: 'More than 3 people were detected in the camera frame.',
          metadata,
          severity: 'high'
        }).catch(() => {});
      }

      await new Promise(r => setTimeout(r, 1200));
      void handleFinalSubmit(true, autoSubmitReasonRef.current);
      return;
    }

    // 2. Standard Warning System (1/3, 2/3, 3/3)
    const nextWarning = serverWarningCountRef.current + 1;
    setServerWarningCount(nextWarning);

    const newEvent: IntegrityEvent = {
      id: `evt-${Date.now()}`,
      type: type as any,
      timestamp: new Date().toISOString(),
      severity,
      details: `Warning ${nextWarning}/3: ${details}`
    };

    setIntegrityEvents(prev => [...prev, newEvent]);

    // Send violation event to server backend
    const sessId = activeSessionIdRef.current;
    const uId = currentUserIdRef.current;
    if (sessId) {
      apiRecordViolation({
        sessionId: sessId,
        userId: uId,
        type: type as any,
        details,
        metadata,
        severity
      }).catch(() => {});
    }

    // Display Warning Count
    showToast(`Warning ${Math.min(nextWarning, 3)}/3: ${details}`, 'warning');

    if (nextWarning >= 3) {
      autoSubmitReasonRef.current = 'Assessment automatically submitted after 3 warnings.';
      setPauseReason('max_warnings_reached');
      showToast('Assessment automatically submitted after 3 warnings.', 'error');
      await new Promise(r => setTimeout(r, 1400));
      void handleFinalSubmit(true, autoSubmitReasonRef.current);
    } else {
      if (nextWarning >= 2) {
        setIntegrityStatus('Additional Verification Recommended');
      } else {
        setIntegrityStatus('Attention Required');
      }
    }
  }, []);

  // Handle updates from the Vision Engine state machine
  const handleVisionMetricsUpdate = useCallback((metrics: VisionMetrics) => {
    if (isExitingRef.current) return;
    setVisionMetrics(metrics);

    // RULE 1: If MORE THAN 3 people are detected in camera frame (>3 people = 4+) -> IMMEDIATE CHEATING AUTO-SUBMIT
    if (metrics.faceCount > 3) {
      registerProctoringViolation(
        'multiple_people_critical',
        'high',
        `More than 3 people detected in frame (${metrics.faceCount} people detected).`,
        { faceCount: metrics.faceCount }
      );
      return;
    }

    // Sync state machine transitions to assessment pauses and warnings
    if (metrics.state === 'MULTIPLE_FACES') {
      setPauseReason('multiple_faces');
      setResumeFeedbackMessage(null);
      registerProctoringViolation(
        'multiple_faces',
        'medium',
        `Multiple faces visible in camera frame (${metrics.faceCount} detected).`,
        { faceCount: metrics.faceCount }
      );
    } else if (metrics.state === 'FACE_MISSING') {
      setPauseReason('face_missing');
      registerProctoringViolation(
        'face_missing',
        'low',
        'Candidate presence could not be verified in camera view.'
      );
    } else if (metrics.state === 'LOOKING_AWAY') {
      setPauseReason('looking_away');
      registerProctoringViolation(
        'focus_loss',
        'low',
        `Candidate oriented gaze away from test window (${metrics.gazeDirection}, Yaw: ${metrics.yawDegrees}°)`
      );
    } else if (metrics.state === 'BLACK_SCREEN') {
      setPauseReason('camera_interrupted');
      registerProctoringViolation(
        'camera_interruption',
        'high',
        'Camera preview appears blocked or completely black. Please uncover camera lens.'
      );
    } else if (metrics.state === 'CAMERA_INTERRUPTED') {
      setPauseReason('camera_interrupted');
      registerProctoringViolation(
        'camera_interruption',
        'high',
        'Camera stream disconnected or video track interrupted.'
      );
    } else if (metrics.state === 'VISION_UNAVAILABLE') {
      setPauseReason('vision_unavailable');
    } else if (metrics.state === 'NORMAL') {
      // Auto-clear pauses when candidate returns to normal verified 1-person state
      setPauseReason(prev => {
        if (prev === 'multiple_faces' || prev === 'face_missing' || prev === 'looking_away') {
          return 'none';
        }
        return prev;
      });
    }
  }, [registerProctoringViolation]);

  // Request & Mount Real Live Camera Stream using cameraManager singleton
  const initRealCameraStream = useCallback(async () => {
    setCameraStatus('requesting');
    setCameraErrorMessage(null);

    // Step 1: Check if an active stream is already live in cameraManager (e.g. from System Check)
    let stream = cameraManager.getActiveStream();

    if (!stream) {
      console.log('[CameraLifecycle] No active stream in cameraManager; requesting fresh camera stream...');
      const diagnostic = await cameraManager.requestCamera();
      if (diagnostic.success && diagnostic.stream) {
        stream = diagnostic.stream;
      } else {
        setCameraStatus(diagnostic.status as CameraStatus);
        setCameraErrorMessage(diagnostic.message);
        registerProctoringViolation('camera_interruption', 'high', diagnostic.message);
        return;
      }
    } else {
      console.log('[CameraLifecycle] Seamlessly transferred active camera stream from System Check.');
    }

    if (!stream || isExitingRef.current) return;

    // Step 2: Ensure video element is available (wait briefly if component DOM is still mounting)
    let videoEl = videoRef.current;
    if (!videoEl) {
      for (let i = 0; i < 6; i++) {
        await new Promise(r => setTimeout(r, 100));
        videoEl = videoRef.current;
        if (videoEl) break;
      }
    }

    if (!videoEl || isExitingRef.current) {
      console.warn('[CameraLifecycle] Video element not available');
      return;
    }

    // Step 3: Attach stream to video element and verify playback & dimensions
    const attached = await cameraManager.attachToVideo(videoEl, stream);
    if (!attached) {
      setCameraStatus('error');
      setCameraErrorMessage('Failed to attach camera stream to video preview.');
      return;
    }

    // Step 4: Verify live video dimensions and active track state
    const tracks = stream.getVideoTracks();
    const track = tracks[0];
    if (!track || track.readyState !== 'live') {
      setCameraStatus('disconnected');
      setCameraErrorMessage('Camera video track is not live.');
      return;
    }

    // Safe Diagnostic Telemetry Log (Safari/macOS friendly)
    const diagnostics = cameraManager.getSafeDiagnostics(videoEl);
    console.log('[CameraDiagnostics] Assessment Live Stream Bound:', diagnostics);

    setCameraStatus('active');

    // Step 5: Start Vision Engine proctoring on the live video element
    if (visionEngineRef.current && !isExitingRef.current) {
      await visionEngineRef.current.initialize(videoEl, handleVisionMetricsUpdate);
    }
  }, [registerProctoringViolation, handleVisionMetricsUpdate]);

  // Periodic Camera Stream Health Checker
  useEffect(() => {
    streamHealthCheckTimerRef.current = setInterval(() => {
      if (isExitingRef.current || pauseReason !== 'none') return;
      const isLive = cameraManager.isCameraLive();
      if (!isLive) {
        if (cameraStatus === 'active') {
          setCameraStatus('disconnected');
          setCameraErrorMessage('Camera stream became inactive.');
          setPauseReason('camera_interrupted');
          registerProctoringViolation('camera_interruption', 'high', 'Camera stream became inactive.');
        }
      }
    }, 2500);

    return () => {
      if (streamHealthCheckTimerRef.current) {
        clearInterval(streamHealthCheckTimerRef.current);
      }
    };
  }, [cameraStatus, pauseReason, registerProctoringViolation]);

  // 1. Fullscreen Monitoring Lifecycle Setup
  useEffect(() => {
    isExitingRef.current = false;
    isSubmittingRef.current = false;

    const initialFs = isBrowserFullscreen();
    setIsFullscreenActive(initialFs);

    let t: any = null;
    if (initialFs) {
      fullscreenEstablishedRef.current = true;
      t = setTimeout(() => {
        if (isBrowserFullscreen() && !isExitingRef.current) {
          fullscreenMonitoringActiveRef.current = true;
          console.log('[AssessmentSecurity] Fullscreen monitoring is now active.');
        }
      }, 1200);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, []);

  // 2. Vision Engine & Real Camera Stream Lifecycle Setup
  useEffect(() => {
    isExitingRef.current = false;

    // Initialize Vision Engine instance
    const visionEngine = new VisionEngine({
      targetFps: 15,
      faceConfirmationMs: 600,
      multipleFaceConfirmationMs: 2200,
      faceLostGraceMs: 5000,
      gazeWarningMs: 2800,
      blinkWindowMs: 14000
    });
    visionEngineRef.current = visionEngine;

    // Start Real Camera Stream
    void initRealCameraStream();

    return () => {
      if (visionEngineRef.current) {
        visionEngineRef.current.stop();
      }
    };
  }, [initRealCameraStream]);

  // Timer countdown - only counts down when fullscreen is active and assessment not paused
  useEffect(() => {
    if (pauseReason !== 'none' || isExitingRef.current || isSubmittingRef.current || !isFullscreenActive) return;

    if (timeRemainingSeconds <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemainingSeconds, pauseReason, isFullscreenActive]);

  // Fullscreen, Tab Switch & Keyboard Security Listeners
  useEffect(() => {
    // 1. Tab Switching Detection (Page Visibility API) - active only when monitoring is enabled
    const handleVisibilityChange = () => {
      if (isExitingRef.current || isSubmittingRef.current || !fullscreenMonitoringActiveRef.current) return;
      if (document.hidden) {
        registerProctoringViolation(
          'focus_loss',
          'medium',
          'Candidate switched away or opened another browser tab.'
        );
        setPauseReason('focus_lost');
      }
    };

    const handleWindowBlur = () => {
      if (isExitingRef.current || isSubmittingRef.current || !fullscreenMonitoringActiveRef.current) return;
      registerProctoringViolation(
        'focus_loss',
        'medium',
        'Assessment window lost active focus.'
      );
    };

    // 2. Cross-browser Fullscreen Change Listener
    const removeFullscreenListener = addFullscreenChangeListener(() => {
      if (isExitingRef.current || isSubmittingRef.current) return;

      const isFs = isBrowserFullscreen();
      setIsFullscreenActive(isFs);

      // Phase 1: During setup / before monitoring is active
      if (!fullscreenMonitoringActiveRef.current) {
        if (isFs) {
          fullscreenEstablishedRef.current = true;
          setFullscreenError(null);
          setTimeout(() => {
            if (isBrowserFullscreen() && !isExitingRef.current) {
              fullscreenMonitoringActiveRef.current = true;
              console.log('[AssessmentSecurity] Fullscreen monitoring is now active.');
            }
          }, 1000);
        }
        return; // NEVER trigger auto-submit before monitoring is active
      }

      // Phase 2: Monitoring is genuinely active and candidate exited fullscreen
      if (!isFs && fullscreenEstablishedRef.current && fullscreenMonitoringActiveRef.current) {
        console.warn('[AssessmentSecurity] Candidate exited active browser fullscreen mode.');
        autoSubmitReasonRef.current = 'Assessment automatically submitted because fullscreen mode was exited.';
        showToast('Assessment automatically submitted because fullscreen mode was exited.', 'error');
        registerProctoringViolation(
          'fullscreen_exit',
          'high',
          'Fullscreen mode was exited by the candidate.'
        );
        void handleFinalSubmit(true, autoSubmitReasonRef.current);
      }
    });

    // 3. Prevent Back Navigation & Inconsistent Reopen
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isExitingRef.current && !isSubmittingRef.current) {
        e.preventDefault();
        e.returnValue = 'Assessment in progress. Leaving will submit or lock your session.';
        return e.returnValue;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (!isExitingRef.current && !isSubmittingRef.current) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
        registerProctoringViolation('focus_loss', 'medium', 'Browser back navigation attempted during examination.');
        showToast('Browser navigation is restricted during the assessment.', 'warning');
      }
    };

    // 4. UI Copy/Paste Restrictions
    const handleCopy = (e: ClipboardEvent) => {
      if (isExitingRef.current || isSubmittingRef.current) return;
      e.preventDefault();
      showToast('Copying assessment questions or content is restricted.', 'warning');
      registerProctoringViolation('copy_paste', 'medium', 'Copy action blocked in assessment UI.');
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (isExitingRef.current || isSubmittingRef.current) return;
      e.preventDefault();
      showToast('Pasting is restricted in assessment fields.', 'warning');
      registerProctoringViolation('copy_paste', 'medium', 'Paste action blocked in assessment UI.');
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (isExitingRef.current || isSubmittingRef.current) return;
      e.preventDefault();
    };

    // Push state to trap back button
    window.history.pushState(null, '', window.location.href);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      removeFullscreenListener();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [registerProctoringViolation]);

  const showToast = (msg: string, type: 'info' | 'warning' | 'error' = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Keyboard shortcut listener for option selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitModalOpen || pauseReason !== 'none' || isExitingRef.current) return;

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
  }, [currentQuestionIndex, isSubmitModalOpen, pauseReason, assessment.questions]);

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

  // Re-check camera & face state before resuming
  const handleConfirmSingleCandidateAndResume = async () => {
    setIsResumingCheck(true);
    setResumeFeedbackMessage('Checking camera view…');

    if (!visionEngineRef.current) {
      setIsResumingCheck(false);
      setPauseReason('none');
      return;
    }

    const check = await visionEngineRef.current.validateSingleFaceStability(600);

    if (check.valid) {
      setResumeFeedbackMessage('Candidate verified. Resuming assessment…');
      await new Promise(r => setTimeout(r, 350));
      
      visionEngineRef.current.clearSimulationOverride();
      visionEngineRef.current.resetStateCounters();
      
      setPauseReason('none');
      setResumeFeedbackMessage(null);
      setIsResumingCheck(false);
    } else {
      setResumeFeedbackMessage(check.message);
      setIsResumingCheck(false);
    }
  };

  // Final Assessment Submission Flow
  const handleFinalSubmit = async (autoSubmitted = false, terminationReason?: string) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitModalOpen(false);
    const timeSpent = (assessment.durationMinutes * 60) - timeRemainingSeconds;
    await cleanupAssessmentEnvironment();
    cameraManager.stopCamera();
    const result = submitAssessment(assessment.id, userAnswers, timeSpent, {
      events: integrityEvents,
      status: integrityStatus,
      autoSubmitted,
      terminationReason: terminationReason || autoSubmitReasonRef.current || undefined
    });
    navigateTo('assessment-result', { attemptId: result.id });
  };

  // Simulation handlers for CV verification
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

  const handleSimulateTabSwitch = () => {
    registerProctoringViolation('focus_loss', 'medium', 'Candidate switched away from assessment window.');
  };

  const handleSimulateObjectViolation = () => {
    registerProctoringViolation('prohibited_object', 'medium', 'Prohibited camera device or electronic object detected.');
  };

  const handleResetSimulation = () => {
    if (visionEngineRef.current) {
      visionEngineRef.current.clearSimulationOverride();
    }
    setPauseReason('none');
    setResumeFeedbackMessage(null);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#070A10] text-slate-100 flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* Floating Proctoring Alert Toast */}
      {toastMessage && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top duration-200 ${
          toastMessage.type === 'error'
            ? 'bg-rose-950 border border-rose-500 text-rose-200 shadow-rose-950/50'
            : toastMessage.type === 'warning'
            ? 'bg-amber-950 border border-amber-500 text-amber-200 shadow-amber-950/50'
            : 'bg-slate-900 border border-indigo-500/50 text-white'
        }`}>
          {toastMessage.type === 'error' ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
          ) : toastMessage.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* TOP EXAMINATION HEADER BAR */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/95 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shrink-0">
        
        {/* Left: Examination Title & Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-sm sm:text-base">
                {assessment.skillName} Examination
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

        {/* Center: Proctoring Warning Counter Pill */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold ${
            serverWarningCount === 0
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
              : serverWarningCount < 3
              ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 animate-pulse'
              : 'bg-rose-950/60 text-rose-300 border-rose-500/50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              serverWarningCount === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`} />
            <span>{serverWarningCount > 0 ? `Warnings: ${serverWarningCount}/3` : `Integrity: ${integrityStatus}`}</span>
          </div>
        </div>

        {/* Right: Live Camera Preview HUD + Timer + Submit Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Live Camera Preview Tile with Real Video Feed */}
          <div className="relative w-28 h-20 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0 shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />

            {cameraStatus !== 'active' && (
              <div
                title={cameraErrorMessage || 'Camera sensor is currently offline'}
                className="absolute inset-0 z-30 w-full h-full flex flex-col items-center justify-center p-1 text-center bg-slate-950/95"
              >
                <CameraOff className="w-5 h-5 text-rose-400 mb-0.5" />
                <span className="text-[8px] text-rose-300 font-semibold leading-tight px-1">
                  {cameraStatus === 'denied'
                    ? 'Permission Denied'
                    : cameraStatus === 'blocked'
                    ? 'Permission Blocked'
                    : cameraStatus === 'not_found'
                    ? 'Camera Not Detected'
                    : cameraStatus === 'in_use'
                    ? 'Camera In Use'
                    : cameraStatus === 'disconnected'
                    ? 'Disconnected'
                    : cameraStatus === 'rendering_stalled'
                    ? 'Rendering Stalled'
                    : cameraStatus === 'requesting'
                    ? 'Connecting...'
                    : 'Camera Offline'}
                </span>
              </div>
            )}
            
            {/* Live Landmark Overlay Canvas */}
            <canvas
              ref={overlayCanvasRef}
              width={112}
              height={80}
              className="absolute inset-0 w-full h-full pointer-events-none z-10 -scale-x-100"
            />

            {/* Live CV Badge & Face Count Overlay */}
            {cameraStatus === 'active' && (
              <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-mono text-emerald-400 z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {visionMetrics ? `FACES: ${visionMetrics.faceCount}` : 'LIVE'}
                </span>
              </div>
            )}

            {/* Live Blink Indicator */}
            {visionMetrics && visionMetrics.blinkDetected && (
              <div className="absolute top-1 right-1 bg-cyan-500/90 text-black font-black px-1 rounded text-[7px] font-mono animate-ping z-20">
                BLINK
              </div>
            )}
          </div>

          {/* Live Examination Countdown Timer */}
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border font-mono font-bold text-xs sm:text-sm transition-all ${
            timeRemainingSeconds < 180
              ? 'bg-rose-950/60 text-rose-400 border-rose-500/60 animate-pulse'
              : 'bg-slate-950 text-emerald-400 border-slate-800'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>

          {/* Submit Action Button */}
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1 px-1 my-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progress: <strong>{answeredCount} of {totalQuestions}</strong> Answered</span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div className="w-full bg-slate-900 border border-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* MAIN EXAMINATION TWO-COLUMN WORKSPACE */}
      <div className="flex-1 grid lg:grid-cols-12 gap-5 min-h-0 overflow-y-auto py-1">
        
        {/* Main Question Window (Left 8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-7 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-xl flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Category tag & Flag button */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700">
                  {currentQuestion.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
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
            <h3 className="text-base sm:text-lg font-extrabold text-white leading-relaxed mb-4">
              {currentQuestion.question}
            </h3>

            {/* Code Snippet Box */}
            {currentQuestion.codeSnippet && (
              <div className="mb-5 rounded-2xl bg-[#070A10] border border-slate-800 overflow-hidden shadow-inner">
                <div className="px-4 py-1.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-2 text-indigo-400">
                    <Terminal className="w-3.5 h-3.5" />
                    {currentQuestion.codeLanguage || 'code'}
                  </span>
                </div>
                
                <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-300 overflow-x-auto leading-relaxed selection:bg-cyan-900 selection:text-white">
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 group cursor-pointer ${
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
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
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
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/85 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-white text-sm">Question Navigator</h4>
              <span className="text-[10px] text-indigo-400 font-semibold font-mono">
                {answeredCount}/{totalQuestions} Answered
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">Click any question to jump directly.</p>

            {/* Number Palette Grid */}
            <div className="grid grid-cols-5 gap-2">
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
                    className={`h-9 rounded-xl border text-xs transition-all relative flex items-center justify-center cursor-pointer ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && !isCurrent && (
                      <span className="absolute top-1 right-1 text-[8px]">🚩</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
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
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Shortcuts: Press <strong>A-D</strong> or <strong>1-4</strong> to answer</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Assessment ({answeredCount}/{totalQuestions})
            </button>
          </div>
        </div>

      </div>

      {/* PROCTORING PAUSE & SECURITY MODALS */}
      {pauseReason !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl text-center space-y-4">
            
            {/* Cheating Detected (>3 People) Critical Flow */}
            {pauseReason === 'cheating_critical' && (
              <>
                <div className="p-4 rounded-3xl bg-rose-500/20 text-rose-400 w-fit mx-auto border border-rose-500/40 animate-pulse">
                  <ShieldAlert className="w-10 h-10 text-rose-400" />
                </div>
                <h3 className="text-xl font-black text-rose-400">
                  Assessment Automatically Submitted: Cheating Detected
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  More than 3 people were detected in the camera frame. The assessment has been automatically locked and submitted.
                </p>
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-[11px] text-rose-300">
                  Session locked. Redirecting to evaluation report...
                </div>
              </>
            )}

            {/* Max Warnings (3/3) Reached Flow */}
            {pauseReason === 'max_warnings_reached' && (
              <>
                <div className="p-4 rounded-3xl bg-amber-500/20 text-amber-400 w-fit mx-auto border border-amber-500/40 animate-pulse">
                  <AlertTriangle className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-black text-amber-300">
                  Assessment Automatically Submitted After 3 Warnings
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  The session reached the maximum limit of 3 valid proctoring warnings (e.g. prohibited detections, tab switching, or environment violations).
                </p>
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-[11px] text-amber-300">
                  Session locked. Redirecting to evaluation report...
                </div>
              </>
            )}

            {/* Multiple Faces (2-3 People) Pause Flow */}
            {pauseReason === 'multiple_faces' && (
              <>
                <div className="p-4 rounded-3xl bg-amber-500/20 text-amber-400 w-fit mx-auto border border-amber-500/30">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Multiple People Detected</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Multiple people were detected in the camera frame. Please ensure only the candidate is visible before continuing.
                </p>

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
                <h3 className="text-xl font-bold text-white">Camera Sensor Disconnected</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Camera connection was interrupted or video track stopped. Your assessment is paused until camera access is restored.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={async () => {
                      await initRealCameraStream();
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

            {/* Focus Lost Flow */}
            {pauseReason === 'focus_lost' && (
              <>
                <div className="p-4 rounded-3xl bg-amber-500/20 text-amber-400 w-fit mx-auto border border-amber-500/30">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Assessment Focus Lost</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assessment window lost focus or browser tab was switched. Return to the assessment window to continue.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setPauseReason('none')}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Resume Assessment
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
              Once confirmed, your answers will be submitted to the backend server grading engine for evaluation and credential issuance.
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
                onClick={() => handleFinalSubmit()}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Computer-Vision Debug Inspector HUD (Shift + D) */}
      <VisionDebugOverlay
        metrics={visionMetrics}
        serverWarningCount={serverWarningCount}
        isOpen={isDebugOverlayOpen}
        onToggle={() => setIsDebugOverlayOpen(prev => !prev)}
        onSimulate={handleSimulateSignal}
        onSimulateTabSwitch={handleSimulateTabSwitch}
        onSimulateObjectViolation={handleSimulateObjectViolation}
        onResetSimulation={handleResetSimulation}
      />

      {/* Fullscreen Activation Barrier Modal (shown only if browser fullscreen is not yet active) */}
      {!isFullscreenActive && (
        <div className="fixed inset-0 z-50 bg-[#070A10]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-indigo-500/40 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto">
              <Maximize className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">
              Fullscreen Focus Mode Required
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              To ensure examination integrity, the assessment must run in full-screen mode. Please click below to enter fullscreen and begin the test.
            </p>
            {fullscreenError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                {fullscreenError}
              </div>
            )}
            <button
              onClick={handleManualEnterFullscreen}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Maximize className="w-4 h-4" />
              <span>Enter Fullscreen & Begin Assessment</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
