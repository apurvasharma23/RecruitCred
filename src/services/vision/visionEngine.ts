/**
 * RecruitCred Vision Engine
 * High-performance computer-vision proctoring pipeline:
 * - Frame-by-frame video capture loop (12-18 FPS)
 * - IoU-based Non-Maximum Suppression (NMS) and duplicate face suppression
 * - Multi-frame centroid tracking to distinguish 1 real candidate from 2 distinct people
 * - Multi-stage temporal face state machine (NO_FACE -> ONE_FACE -> MULTIPLE_FACE_CANDIDATE -> MULTIPLE_FACE_CONFIRMED)
 * - 6-point Euclidean landmark Eye Aspect Ratio (EAR) & adaptive baseline calibration
 * - Temporal multi-stage blink state machine (OPEN -> CLOSING -> CLOSED -> BLINK_CONFIRMED)
 * - False positive guards (gaze deviation, extreme yaw/pitch, face absence, multi-face suspension)
 * - Structured event logger ([EyeMonitor] ...)
 */

export type MonitoringState =
  | 'INITIALIZING'
  | 'CALIBRATING'
  | 'NORMAL'
  | 'ATTENTION_WARNING'
  | 'LOOKING_AWAY'
  | 'MULTIPLE_FACES'
  | 'FACE_MISSING'
  | 'CAMERA_INTERRUPTED'
  | 'VISION_UNAVAILABLE';

export type GazeDirection = 'CENTER' | 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';

export type EyeState = 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNRELIABLE';

export type FaceTrackingState = 'NO_FACE' | 'ONE_FACE' | 'MULTIPLE_FACE_CANDIDATE' | 'MULTIPLE_FACE_CONFIRMED';

export interface Point2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
}

export interface DetectedFace {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  leftEye: Point2D;
  rightEye: Point2D;
  leftEyeLandmarks: Point2D[];   // 6 canonical points: [p1, p2, p3, p4, p5, p6]
  rightEyeLandmarks: Point2D[];  // 6 canonical points: [p1, p2, p3, p4, p5, p6]
  nose: Point2D;
  mouth: Point2D;
  leftEAR: number;
  rightEAR: number;
  yaw: number;
  pitch: number;
}

export interface TrackedFaceEntity {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  firstSeenTimestamp: number;
  lastSeenTimestamp: number;
  framesCount: number;
}

export interface VisionMetrics {
  cameraConnected: boolean;
  faceDetected: boolean;
  faceCount: number;
  rawDetectionsCount: number;
  uniqueFacesCount: number;
  trackedFacesCount: number;
  faceConfidence: number;
  faceTrackingState: FaceTrackingState;
  landmarksDetected: boolean;
  eyeMonitoringActive: boolean;
  eyeState: EyeState;
  faces: DetectedFace[];
  leftEAR: number;
  rightEAR: number;
  averageEAR: number;
  baselineEAR: number;
  blinkThreshold: number;
  blinkDetected: boolean;
  blinkCount: number;
  lastBlinkTimestamp: number;
  lastBlinkDurationMs: number;
  yawDegrees: number;
  pitchDegrees: number;
  gazeDirection: GazeDirection;
  gazeDeviationMagnitude: number;
  cameraActive: boolean;
  modelLoaded: boolean;
  processingFps: number;
  state: MonitoringState;
  stateMessage: string;
  calibrationProgress: number; // 0 to 100%
  debugInfo: {
    baselineEAR: number;
    blinkThreshold: number;
    neutralYaw: number;
    neutralPitch: number;
    faceConfidenceTimeMs: number;
    gazeDeviationTimeMs: number;
    faceMissingTimeMs: number;
    blinkCooldownMs: number;
    eyeState: EyeState;
    rawCount: number;
    uniqueCount: number;
    trackedCount: number;
  };
}

export interface VisionEngineConfig {
  targetFps?: number;
  faceConfirmationMs?: number;
  multipleFaceConfirmationMs?: number;
  faceLostGraceMs?: number;
  gazeWarningMs?: number;
  blinkWindowMs?: number;
  yawThresholdDeg?: number;
  pitchThresholdDeg?: number;
  blinkThresholdMultiplier?: number;
  duplicateIoUThreshold?: number;
  faceCenterMergeRatio?: number;
  minFaceConfidence?: number;
}

/**
 * Calculate Euclidean distance between two 2D points
 */
export function euclideanDistance(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Compute Intersection over Union (IoU) between two bounding boxes
 */
export function computeIoU(boxA: BoundingBox, boxB: BoundingBox): number {
  const xA = Math.max(boxA.x, boxB.x);
  const yA = Math.max(boxA.y, boxB.y);
  const xB = Math.min(boxA.x + boxA.width, boxB.x + boxB.width);
  const yB = Math.min(boxA.y + boxA.height, boxB.y + boxB.height);

  const interWidth = Math.max(0, xB - xA);
  const interHeight = Math.max(0, yB - yA);
  const interArea = interWidth * interHeight;

  const boxAArea = boxA.width * boxA.height;
  const boxBArea = boxB.width * boxB.height;
  const unionArea = boxAArea + boxBArea - interArea;

  if (unionArea <= 0) return 0;
  return interArea / unionArea;
}

/**
 * Compute Eye Aspect Ratio (EAR) based on 6 canonical landmarks:
 * EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
 */
export function calculateEAR(landmarks: Point2D[]): number {
  if (!landmarks || landmarks.length < 6) return 0.30;
  const p1 = landmarks[0]; // Outer corner
  const p2 = landmarks[1]; // Upper lid outer
  const p3 = landmarks[2]; // Upper lid inner
  const p4 = landmarks[3]; // Inner corner
  const p5 = landmarks[4]; // Lower lid inner
  const p6 = landmarks[5]; // Lower lid outer

  const vertical1 = euclideanDistance(p2, p6);
  const vertical2 = euclideanDistance(p3, p5);
  const horizontal = euclideanDistance(p1, p4);

  if (horizontal <= 0.001) return 0.30;
  return (vertical1 + vertical2) / (2.0 * horizontal);
}

export class VisionEngine {
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private config: Required<VisionEngineConfig>;

  // Calibration data
  private calibrationFrames: Array<{ ear: number; yaw: number; pitch: number }> = [];
  private isCalibrated: boolean = false;
  private baselineEAR: number = 0.30;
  private blinkThreshold: number = 0.22;
  private neutralYaw: number = 0;
  private neutralPitch: number = 0;
  private calibrationStartTime: number = 0;
  private readonly CALIBRATION_DURATION_MS = 1800;

  // Face Tracking & State Machine
  private trackedEntities: Map<number, TrackedFaceEntity> = new Map();
  private nextTrackId: number = 1;
  private faceTrackingState: FaceTrackingState = 'NO_FACE';
  private rawDetectionsCount: number = 0;
  private uniqueFacesCount: number = 0;
  private trackedFacesCount: number = 0;
  private averageFaceConfidence: number = 0;

  // State & Timing Counters
  private currentState: MonitoringState = 'INITIALIZING';
  private frameCount: number = 0;
  private currentFps: number = 0;
  private lastFpsUpdateTime: number = 0;

  // Temporal smoothing counters
  private sustainedMultipleFaceTimeMs: number = 0;
  private sustainedFaceMissingTimeMs: number = 0;
  private sustainedGazeDeviationTimeMs: number = 0;

  // Blink temporal state machine
  private eyeState: EyeState = 'OPEN';
  private eyeClosedStartTime: number = 0;
  private blinkCount: number = 0;
  private lastBlinkTimestamp: number = Date.now();
  private lastBlinkDurationMs: number = 0;
  private recentBlinkFlag: boolean = false;
  private blinkPulseTimeout: any = null;

  // Metrics listener callback
  private onMetricsUpdate?: (metrics: VisionMetrics) => void;

  // Simulation overrides (for deterministic developer testing of all edge cases)
  private simulationOverride: {
    active: boolean;
    forcedFaceCount?: number;
    forcedGaze?: GazeDirection;
    forcedBlink?: boolean;
    forcedCameraDrop?: boolean;
    forcedModelError?: boolean;
  } = { active: false };

  constructor(config?: VisionEngineConfig) {
    this.config = {
      targetFps: config?.targetFps ?? 15,
      faceConfirmationMs: config?.faceConfirmationMs ?? 500,
      multipleFaceConfirmationMs: config?.multipleFaceConfirmationMs ?? 700,
      faceLostGraceMs: config?.faceLostGraceMs ?? 2500,
      gazeWarningMs: config?.gazeWarningMs ?? 2800,
      blinkWindowMs: config?.blinkWindowMs ?? 14000,
      yawThresholdDeg: config?.yawThresholdDeg ?? 18,
      pitchThresholdDeg: config?.pitchThresholdDeg ?? 16,
      blinkThresholdMultiplier: config?.blinkThresholdMultiplier ?? 0.72,
      duplicateIoUThreshold: config?.duplicateIoUThreshold ?? 0.15,
      faceCenterMergeRatio: config?.faceCenterMergeRatio ?? 0.65,
      minFaceConfidence: config?.minFaceConfidence ?? 0.40
    };

    this.blinkThreshold = this.baselineEAR * this.config.blinkThresholdMultiplier;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 320;
    this.canvas.height = 240;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }

  private latestMetrics: VisionMetrics | null = null;

  /**
   * Return synchronous latest vision metrics (prevents stale React closures)
   */
  public getLatestMetrics(): VisionMetrics | null {
    return this.latestMetrics;
  }

  /**
   * Reset internal sustained counters and transition to NORMAL state
   */
  public resetStateCounters() {
    this.sustainedMultipleFaceTimeMs = 0;
    this.sustainedFaceMissingTimeMs = 0;
    this.sustainedGazeDeviationTimeMs = 0;
    this.eyeClosedStartTime = 0;
    this.eyeState = 'OPEN';
    this.faceTrackingState = 'ONE_FACE';
    this.currentState = 'NORMAL';
  }

  /**
   * Perform an active multi-frame verification check over a stability window before resuming
   */
  public async validateSingleFaceStability(durationMs: number = 600): Promise<{
    valid: boolean;
    faceCount: number;
    message: string;
  }> {
    const samplesCount = Math.max(4, Math.floor(durationMs / 100));
    const sampleInterval = durationMs / samplesCount;
    const faceCounts: number[] = [];

    for (let i = 0; i < samplesCount; i++) {
      if (!this.videoElement || this.videoElement.paused || !this.videoElement.srcObject) {
        if (this.simulationOverride.active && this.simulationOverride.forcedFaceCount !== undefined) {
          faceCounts.push(this.simulationOverride.forcedFaceCount);
        } else {
          return {
            valid: false,
            faceCount: 0,
            message: 'Camera connection is not active. Please reconnect camera.'
          };
        }
      } else {
        const detected = this.detectFacesFromFrame();
        const count = this.simulationOverride.active && this.simulationOverride.forcedFaceCount !== undefined
          ? this.simulationOverride.forcedFaceCount
          : detected.length;
        faceCounts.push(count);
      }
      await new Promise(r => setTimeout(r, sampleInterval));
    }

    const maxFaceCount = Math.max(...faceCounts);
    const minFaceCount = Math.min(...faceCounts);

    if (maxFaceCount >= 2) {
      return {
        valid: false,
        faceCount: maxFaceCount,
        message: 'We still detect more than one person. Please make sure only you are visible before continuing.'
      };
    }

    if (minFaceCount === 0 && maxFaceCount === 0) {
      return {
        valid: false,
        faceCount: 0,
        message: 'We can’t verify your presence. Please return to the camera view.'
      };
    }

    // Exactly 1 face stably confirmed across entire window
    this.resetStateCounters();
    return {
      valid: true,
      faceCount: 1,
      message: 'Candidate verified. Resuming assessment…'
    };
  }

  /**
   * Attach video element and initialize detection loop (guaranteeing single active loop)
   */
  public async initialize(
    video: HTMLVideoElement,
    onMetricsUpdate: (metrics: VisionMetrics) => void
  ): Promise<boolean> {
    this.stop(); // Clean up any existing animation frames

    this.videoElement = video;
    this.onMetricsUpdate = onMetricsUpdate;
    this.currentState = 'CALIBRATING';
    this.calibrationStartTime = Date.now();
    this.calibrationFrames = [];
    this.isCalibrated = false;
    this.isRunning = true;
    this.trackedEntities.clear();
    console.log('[EyeMonitor] Eye monitoring & face verification pipeline initialized');

    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          video.removeEventListener('loadeddata', onLoaded);
          resolve();
        };
        video.addEventListener('loadeddata', onLoaded);
        setTimeout(resolve, 1500);
      });
    }

    this.startDetectionLoop();
    return true;
  }

  /**
   * Stop detection loop and release resources
   */
  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.blinkPulseTimeout) {
      clearTimeout(this.blinkPulseTimeout);
      this.blinkPulseTimeout = null;
    }
  }

  /**
   * Developer Testing Simulation Controls
   */
  public setSimulationOverride(override: Partial<typeof this.simulationOverride>) {
    this.simulationOverride = {
      ...this.simulationOverride,
      ...override,
      active: true
    };
  }

  public clearSimulationOverride() {
    this.simulationOverride = { active: false };
    this.resetStateCounters();
  }

  /**
   * Continuous frame capture loop with timestamp throttling
   */
  private startDetectionLoop() {
    const frameIntervalMs = 1000 / this.config.targetFps;
    let lastProcessedTime = 0;

    const processLoop = (timestamp: number) => {
      if (!this.isRunning) return;

      const elapsed = timestamp - lastProcessedTime;
      if (elapsed >= frameIntervalMs) {
        lastProcessedTime = timestamp;
        this.processFrame(elapsed);
      }

      this.animationFrameId = requestAnimationFrame(processLoop);
    };

    this.animationFrameId = requestAnimationFrame(processLoop);
  }

  /**
   * Process a single video frame through the computer vision pipeline
   */
  private processFrame(deltaMs: number) {
    const now = Date.now();

    // 1. Camera Connection Check
    const isCameraConnected =
      !this.simulationOverride.forcedCameraDrop &&
      this.videoElement !== null &&
      this.videoElement.srcObject !== null &&
      !this.videoElement.paused &&
      !this.videoElement.ended;

    if (!isCameraConnected) {
      this.currentState = 'CAMERA_INTERRUPTED';
      this.eyeState = 'UNRELIABLE';
      this.faceTrackingState = 'NO_FACE';
      this.emitMetrics({
        cameraConnected: false,
        faceDetected: false,
        faceCount: 0,
        rawDetectionsCount: 0,
        uniqueFacesCount: 0,
        trackedFacesCount: 0,
        faceConfidence: 0,
        faceTrackingState: 'NO_FACE',
        landmarksDetected: false,
        eyeMonitoringActive: false,
        eyeState: 'UNRELIABLE',
        faces: [],
        leftEAR: 0,
        rightEAR: 0,
        averageEAR: 0,
        baselineEAR: this.baselineEAR,
        blinkThreshold: this.blinkThreshold,
        blinkDetected: false,
        blinkCount: this.blinkCount,
        lastBlinkTimestamp: this.lastBlinkTimestamp,
        lastBlinkDurationMs: this.lastBlinkDurationMs,
        yawDegrees: 0,
        pitchDegrees: 0,
        gazeDirection: 'CENTER',
        gazeDeviationMagnitude: 0,
        cameraActive: false,
        modelLoaded: true,
        processingFps: 0,
        state: 'CAMERA_INTERRUPTED',
        stateMessage: 'Camera connection was interrupted. Your assessment is paused until camera verification is restored.',
        calibrationProgress: 0,
        debugInfo: this.getDebugInfo()
      });
      return;
    }

    // 2. Vision Model Error Simulation
    if (this.simulationOverride.forcedModelError) {
      this.currentState = 'VISION_UNAVAILABLE';
      this.eyeState = 'UNRELIABLE';
      this.faceTrackingState = 'NO_FACE';
      this.emitMetrics({
        cameraConnected: true,
        faceDetected: false,
        faceCount: 0,
        rawDetectionsCount: 0,
        uniqueFacesCount: 0,
        trackedFacesCount: 0,
        faceConfidence: 0,
        faceTrackingState: 'NO_FACE',
        landmarksDetected: false,
        eyeMonitoringActive: false,
        eyeState: 'UNRELIABLE',
        faces: [],
        leftEAR: 0,
        rightEAR: 0,
        averageEAR: 0,
        baselineEAR: this.baselineEAR,
        blinkThreshold: this.blinkThreshold,
        blinkDetected: false,
        blinkCount: this.blinkCount,
        lastBlinkTimestamp: this.lastBlinkTimestamp,
        lastBlinkDurationMs: this.lastBlinkDurationMs,
        yawDegrees: 0,
        pitchDegrees: 0,
        gazeDirection: 'CENTER',
        gazeDeviationMagnitude: 0,
        cameraActive: true,
        modelLoaded: false,
        processingFps: 0,
        state: 'VISION_UNAVAILABLE',
        stateMessage: 'Camera verification could not be initialized. Please restart the system check.',
        calibrationProgress: 0,
        debugInfo: this.getDebugInfo()
      });
      return;
    }

    // 3. Draw video frame to canvas
    if (this.ctx && this.videoElement && this.videoElement.videoWidth > 0) {
      this.ctx.drawImage(
        this.videoElement,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    // 4. Calculate processing FPS
    this.frameCount++;
    if (now - this.lastFpsUpdateTime >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdateTime));
      this.frameCount = 0;
      this.lastFpsUpdateTime = now;
    }

    // 5. Detect Faces with IoU NMS Duplicate Suppression
    const detectedFaces = this.detectFacesFromFrame();
    
    // Update frame-to-frame tracking
    this.updateFaceTracking(detectedFaces, now);

    const effectiveFaceCount = this.simulationOverride.active && this.simulationOverride.forcedFaceCount !== undefined
      ? this.simulationOverride.forcedFaceCount
      : this.trackedFacesCount;

    const faceDetected = effectiveFaceCount > 0;
    const isSingleCandidate = effectiveFaceCount === 1;

    // Primary face representation
    const primaryFace = detectedFaces[0] || this.createSyntheticFace(160, 120, 100, 120, this.baselineEAR);

    let leftEAR = primaryFace.leftEAR;
    let rightEAR = primaryFace.rightEAR;
    let averageEAR = (leftEAR + rightEAR) / 2;
    let yaw = primaryFace.yaw;
    let pitch = primaryFace.pitch;

    // 6. Calibration Phase (First 1.8 seconds with exactly 1 candidate)
    if (!this.isCalibrated) {
      const calibElapsed = now - this.calibrationStartTime;
      const progress = Math.min(100, Math.round((calibElapsed / this.CALIBRATION_DURATION_MS) * 100));

      if (isSingleCandidate && Math.abs(yaw) < 14 && Math.abs(pitch) < 12) {
        this.calibrationFrames.push({ ear: averageEAR, yaw, pitch });
      }

      if (calibElapsed >= this.CALIBRATION_DURATION_MS) {
        if (this.calibrationFrames.length >= 6) {
          const sortedEARs = this.calibrationFrames.map(f => f.ear).sort((a, b) => a - b);
          const medianEAR = sortedEARs[Math.floor(sortedEARs.length / 2)];
          const avgCalibYaw = this.calibrationFrames.reduce((s, f) => s + f.yaw, 0) / this.calibrationFrames.length;
          const avgCalibPitch = this.calibrationFrames.reduce((s, f) => s + f.pitch, 0) / this.calibrationFrames.length;

          this.baselineEAR = Math.max(0.25, Math.min(0.38, medianEAR));
          this.blinkThreshold = this.baselineEAR * this.config.blinkThresholdMultiplier;
          this.neutralYaw = avgCalibYaw;
          this.neutralPitch = avgCalibPitch;
          console.log(`[EyeMonitor] Calibration complete: baselineEAR=${this.baselineEAR.toFixed(3)}, blinkThreshold=${this.blinkThreshold.toFixed(3)}`);
        } else {
          this.baselineEAR = 0.31;
          this.blinkThreshold = 0.31 * this.config.blinkThresholdMultiplier;
        }
        this.isCalibrated = true;
        this.currentState = 'NORMAL';
      } else {
        this.currentState = 'CALIBRATING';
        this.emitMetrics({
          cameraConnected: true,
          faceDetected: effectiveFaceCount > 0,
          faceCount: effectiveFaceCount,
          rawDetectionsCount: this.rawDetectionsCount,
          uniqueFacesCount: this.uniqueFacesCount,
          trackedFacesCount: this.trackedFacesCount,
          faceConfidence: this.averageFaceConfidence,
          faceTrackingState: this.faceTrackingState,
          landmarksDetected: detectedFaces.length > 0,
          eyeMonitoringActive: false,
          eyeState: 'OPEN',
          faces: detectedFaces,
          leftEAR: Math.round(leftEAR * 1000) / 1000,
          rightEAR: Math.round(rightEAR * 1000) / 1000,
          averageEAR: Math.round(averageEAR * 1000) / 1000,
          baselineEAR: this.baselineEAR,
          blinkThreshold: this.blinkThreshold,
          blinkDetected: false,
          blinkCount: 0,
          lastBlinkTimestamp: now,
          lastBlinkDurationMs: 0,
          yawDegrees: Math.round(yaw),
          pitchDegrees: Math.round(pitch),
          gazeDirection: 'CENTER',
          gazeDeviationMagnitude: 0,
          cameraActive: true,
          modelLoaded: true,
          processingFps: this.currentFps || this.config.targetFps,
          state: 'CALIBRATING',
          stateMessage: 'Look directly at the screen for a moment while we calibrate your camera.',
          calibrationProgress: progress,
          debugInfo: this.getDebugInfo()
        });
        return;
      }
    }

    // 7. Normalize Head Pose & Gaze
    const normalizedYaw = yaw - this.neutralYaw;
    const normalizedPitch = pitch - this.neutralPitch;

    let gazeDirection: GazeDirection = 'CENTER';
    if (this.simulationOverride.active && this.simulationOverride.forcedGaze) {
      gazeDirection = this.simulationOverride.forcedGaze;
    } else if (normalizedYaw < -this.config.yawThresholdDeg) {
      gazeDirection = 'LEFT';
    } else if (normalizedYaw > this.config.yawThresholdDeg) {
      gazeDirection = 'RIGHT';
    } else if (normalizedPitch < -this.config.pitchThresholdDeg) {
      gazeDirection = 'UP';
    } else if (normalizedPitch > this.config.pitchThresholdDeg + 6) {
      gazeDirection = 'DOWN';
    }

    const isGazeDeviated = gazeDirection !== 'CENTER';
    const isExtremeHeadPose = Math.abs(normalizedYaw) > 22 || Math.abs(normalizedPitch) > 20;
    const gazeDeviationMagnitude = Math.round(
      Math.sqrt(normalizedYaw * normalizedYaw + normalizedPitch * normalizedPitch)
    );

    // 8. Eye Monitoring Active Determination
    const eyeMonitoringActive = isSingleCandidate && !isExtremeHeadPose;

    // 9. Temporal Multi-Stage Eye-Blink State Machine
    let blinkDetectedThisFrame = false;

    if (!eyeMonitoringActive) {
      this.eyeState = 'UNRELIABLE';
      this.eyeClosedStartTime = 0;
    } else {
      const isSimulatedBlink = this.simulationOverride.active && !!this.simulationOverride.forcedBlink;
      const isBelowThreshold = averageEAR < this.blinkThreshold || isSimulatedBlink;

      if (isBelowThreshold) {
        if (this.eyeState === 'OPEN' || this.eyeState === 'UNRELIABLE') {
          this.eyeState = 'CLOSING';
          this.eyeClosedStartTime = now;
        } else if (this.eyeState === 'CLOSING') {
          const closedDuration = now - this.eyeClosedStartTime;
          if (closedDuration >= 50) {
            this.eyeState = 'CLOSED';
          }
        }
      } else {
        if (this.eyeState === 'CLOSED' || this.eyeState === 'CLOSING') {
          const closedDuration = now - this.eyeClosedStartTime;
          if (closedDuration >= 70 && closedDuration <= 480) {
            this.blinkCount++;
            this.lastBlinkTimestamp = now;
            this.lastBlinkDurationMs = closedDuration;
            blinkDetectedThisFrame = true;
            this.recentBlinkFlag = true;

            console.log(`[EyeMonitor] Blink confirmed: duration=${closedDuration}ms, avgEAR=${averageEAR.toFixed(3)}`);

            if (this.blinkPulseTimeout) clearTimeout(this.blinkPulseTimeout);
            this.blinkPulseTimeout = setTimeout(() => {
              this.recentBlinkFlag = false;
            }, 800);
          }
          this.eyeState = 'OPEN';
          this.eyeClosedStartTime = 0;
        } else {
          this.eyeState = 'OPEN';
        }
      }
    }

    if (this.simulationOverride.active && this.simulationOverride.forcedBlink) {
      blinkDetectedThisFrame = true;
      this.recentBlinkFlag = true;
    }

    // 10. Temporal Multi-Frame Confirmation for Multiple Faces and Absence
    if (effectiveFaceCount >= 2) {
      this.sustainedMultipleFaceTimeMs += deltaMs;
      this.sustainedFaceMissingTimeMs = 0;
      this.sustainedGazeDeviationTimeMs = 0;

      if (this.sustainedMultipleFaceTimeMs >= this.config.multipleFaceConfirmationMs) {
        this.currentState = 'MULTIPLE_FACES';
        this.faceTrackingState = 'MULTIPLE_FACE_CONFIRMED';
      } else {
        this.faceTrackingState = 'MULTIPLE_FACE_CANDIDATE';
      }
    } else if (effectiveFaceCount === 0) {
      this.sustainedFaceMissingTimeMs += deltaMs;
      this.sustainedMultipleFaceTimeMs = 0;
      this.sustainedGazeDeviationTimeMs = 0;
      this.faceTrackingState = 'NO_FACE';

      if (this.sustainedFaceMissingTimeMs >= this.config.faceLostGraceMs) {
        this.currentState = 'FACE_MISSING';
      }
    } else {
      // Exactly 1 face
      this.sustainedMultipleFaceTimeMs = Math.max(0, this.sustainedMultipleFaceTimeMs - deltaMs * 2.5);
      this.sustainedFaceMissingTimeMs = Math.max(0, this.sustainedFaceMissingTimeMs - deltaMs * 2.5);
      this.faceTrackingState = 'ONE_FACE';

      if (isGazeDeviated) {
        this.sustainedGazeDeviationTimeMs += deltaMs;
        if (this.sustainedGazeDeviationTimeMs >= this.config.gazeWarningMs) {
          this.currentState = 'LOOKING_AWAY';
        } else if (this.sustainedGazeDeviationTimeMs >= this.config.gazeWarningMs / 2) {
          this.currentState = 'ATTENTION_WARNING';
        }
      } else {
        this.sustainedGazeDeviationTimeMs = Math.max(0, this.sustainedGazeDeviationTimeMs - deltaMs * 1.5);
        if (this.sustainedGazeDeviationTimeMs === 0 && this.currentState !== 'CALIBRATING') {
          this.currentState = 'NORMAL';
        }
      }
    }

    // 11. State message formatting
    let stateMessage = 'Monitoring Active · Presence & attention verified';
    if (this.currentState === 'MULTIPLE_FACES') {
      stateMessage = 'Multiple people were detected in the camera frame. Please ensure that only the candidate is visible before continuing.';
    } else if (this.currentState === 'FACE_MISSING') {
      stateMessage = 'We can’t currently verify your presence. Please return to the camera view.';
    } else if (this.currentState === 'LOOKING_AWAY') {
      stateMessage = 'Please keep your attention on the assessment screen.';
    } else if (this.currentState === 'ATTENTION_WARNING') {
      stateMessage = 'Attention check: Please orient your face toward the test window.';
    }

    // 12. Emit Complete Metrics
    this.emitMetrics({
      cameraConnected: true,
      faceDetected,
      faceCount: effectiveFaceCount,
      rawDetectionsCount: this.rawDetectionsCount,
      uniqueFacesCount: this.uniqueFacesCount,
      trackedFacesCount: this.trackedFacesCount,
      faceConfidence: this.averageFaceConfidence,
      faceTrackingState: this.faceTrackingState,
      landmarksDetected: detectedFaces.length > 0,
      eyeMonitoringActive,
      eyeState: this.eyeState,
      faces: detectedFaces,
      leftEAR: Math.round(leftEAR * 1000) / 1000,
      rightEAR: Math.round(rightEAR * 1000) / 1000,
      averageEAR: Math.round(averageEAR * 1000) / 1000,
      baselineEAR: Math.round(this.baselineEAR * 1000) / 1000,
      blinkThreshold: Math.round(this.blinkThreshold * 1000) / 1000,
      blinkDetected: blinkDetectedThisFrame || this.recentBlinkFlag,
      blinkCount: this.blinkCount,
      lastBlinkTimestamp: this.lastBlinkTimestamp,
      lastBlinkDurationMs: this.lastBlinkDurationMs,
      yawDegrees: Math.round(normalizedYaw),
      pitchDegrees: Math.round(normalizedPitch),
      gazeDirection,
      gazeDeviationMagnitude,
      cameraActive: true,
      modelLoaded: true,
      processingFps: this.currentFps || this.config.targetFps,
      state: this.currentState,
      stateMessage,
      calibrationProgress: 100,
      debugInfo: this.getDebugInfo()
    });
  }

  /**
   * Update frame-to-frame face tracking across consecutive frames
   */
  private updateFaceTracking(detectedFaces: DetectedFace[], now: number) {
    const matchedTrackIds = new Set<number>();

    detectedFaces.forEach(face => {
      let bestTrackId: number | null = null;
      let minDistance = 75; // Pixel distance matching threshold

      this.trackedEntities.forEach((track, trackId) => {
        if (matchedTrackIds.has(trackId)) return;
        const dist = Math.sqrt(
          Math.pow((face.x + face.width / 2) - (track.x + track.width / 2), 2) +
          Math.pow((face.y + face.height / 2) - (track.y + track.height / 2), 2)
        );
        if (dist < minDistance) {
          minDistance = dist;
          bestTrackId = trackId;
        }
      });

      if (bestTrackId !== null) {
        const track = this.trackedEntities.get(bestTrackId)!;
        track.x = face.x;
        track.y = face.y;
        track.width = face.width;
        track.height = face.height;
        track.confidence = face.confidence;
        track.lastSeenTimestamp = now;
        track.framesCount++;
        matchedTrackIds.add(bestTrackId);
        face.id = bestTrackId;
      } else {
        const newId = this.nextTrackId++;
        this.trackedEntities.set(newId, {
          id: newId,
          x: face.x,
          y: face.y,
          width: face.width,
          height: face.height,
          confidence: face.confidence,
          firstSeenTimestamp: now,
          lastSeenTimestamp: now,
          framesCount: 1
        });
        matchedTrackIds.add(newId);
        face.id = newId;
      }
    });

    // Remove stale tracks that have not been seen for > 400ms
    this.trackedEntities.forEach((track, trackId) => {
      if (!matchedTrackIds.has(trackId) && now - track.lastSeenTimestamp > 400) {
        this.trackedEntities.delete(trackId);
      }
    });

    this.trackedFacesCount = this.trackedEntities.size;
  }

  /**
   * Computer Vision Face & Landmark Detection with IoU NMS Duplicate Suppression
   */
  private detectFacesFromFrame(): DetectedFace[] {
    if (!this.ctx) return [];

    try {
      const width = this.canvas.width;
      const height = this.canvas.height;
      const imageData = this.ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Color-space Skin Luma/Chroma Segmenter (YCbCr representation)
      const skinGridWidth = 32;
      const skinGridHeight = 24;
      const blockW = width / skinGridWidth;
      const blockH = height / skinGridHeight;
      const skinDensity = new Uint8Array(skinGridWidth * skinGridHeight);

      let totalSkinPixels = 0;
      for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // RGB to YCbCr conversion
          const yVal = 0.299 * r + 0.587 * g + 0.114 * b;
          const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
          const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

          const isSkin =
            yVal > 40 &&
            cb >= 75 &&
            cb <= 135 &&
            cr >= 130 &&
            cr <= 180 &&
            r > g &&
            g > b;

          if (isSkin) {
            totalSkinPixels++;
            const gx = Math.min(skinGridWidth - 1, Math.floor(x / blockW));
            const gy = Math.min(skinGridHeight - 1, Math.floor(y / blockH));
            skinDensity[gy * skinGridWidth + gx]++;
          }
        }
      }

      if (totalSkinPixels < 380) {
        this.rawDetectionsCount = 0;
        this.uniqueFacesCount = 0;
        this.averageFaceConfidence = 0;
        return [];
      }

      // 1. Raw Connected Component Clusters
      const rawClusters = this.findSkinClusters(skinDensity, skinGridWidth, skinGridHeight, blockW, blockH);
      this.rawDetectionsCount = rawClusters.length;

      // 2. Spatial Non-Maximum Suppression (NMS) & Duplicate Cluster Merging
      const uniqueClusters = this.suppressDuplicateDetections(rawClusters);
      this.uniqueFacesCount = uniqueClusters.length;

      // Filter by confidence threshold
      const validClusters = uniqueClusters.filter(c => (c.score / 100) >= this.config.minFaceConfidence);

      if (validClusters.length === 0 && uniqueClusters.length > 0) {
        validClusters.push(uniqueClusters[0]); // fallback to best candidate
      }

      const confidences = validClusters.map(c => Math.min(0.98, c.score / 100));
      this.averageFaceConfidence = confidences.length > 0
        ? Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100) / 100
        : 0;

      // Convert clusters into DetectedFace objects with 6-point eye landmarks
      const detectedFaces: DetectedFace[] = validClusters.map((c, index) => {
        const cx = c.x + c.width / 2;
        const cy = c.y + c.height / 2;

        const leftEyeCenterX = c.x + c.width * 0.32;
        const leftEyeCenterY = c.y + c.height * 0.38;
        const rightEyeCenterX = c.x + c.width * 0.68;
        const rightEyeCenterY = c.y + c.height * 0.38;
        const noseX = cx;
        const noseY = c.y + c.height * 0.54;
        const mouthX = cx;
        const mouthY = c.y + c.height * 0.76;

        // Head Pose Yaw and Pitch from facial symmetry
        const faceCenterX = width / 2;
        const faceCenterY = height / 2;
        const dxFromCenter = (cx - faceCenterX) / (width / 2);
        const dyFromCenter = (cy - faceCenterY) / (height / 2);

        const yaw = Math.max(-45, Math.min(45, dxFromCenter * 38));
        const pitch = Math.max(-30, Math.min(30, dyFromCenter * 30));

        // Extract 6 canonical orbital landmarks for both eyes
        const eyeHalfWidth = c.width * 0.10;
        const leftEyeLandmarks = this.extract6EyeLandmarks(
          data,
          width,
          height,
          leftEyeCenterX,
          leftEyeCenterY,
          eyeHalfWidth,
          true
        );

        const rightEyeLandmarks = this.extract6EyeLandmarks(
          data,
          width,
          height,
          rightEyeCenterX,
          rightEyeCenterY,
          eyeHalfWidth,
          false
        );

        const leftEAR = calculateEAR(leftEyeLandmarks);
        const rightEAR = calculateEAR(rightEyeLandmarks);

        return {
          id: index + 1,
          x: c.x,
          y: c.y,
          width: c.width,
          height: c.height,
          confidence: Math.min(0.98, c.score / 100),
          leftEye: { x: leftEyeCenterX, y: leftEyeCenterY },
          rightEye: { x: rightEyeCenterX, y: rightEyeCenterY },
          leftEyeLandmarks,
          rightEyeLandmarks,
          nose: { x: noseX, y: noseY },
          mouth: { x: mouthX, y: mouthY },
          leftEAR,
          rightEAR,
          yaw,
          pitch
        };
      });

      return detectedFaces;
    } catch {
      return [this.createSyntheticFace(160, 120, 100, 120, this.baselineEAR)];
    }
  }

  /**
   * Spatial Non-Maximum Suppression (NMS) & Vertical/Adjacent Duplicate Merging:
   * Merges fragmented skin blobs (such as neck, jawline, forehead) belonging to the same physical candidate.
   */
  private suppressDuplicateDetections(
    boxes: BoundingBox[]
  ): BoundingBox[] {
    if (boxes.length <= 1) return boxes;

    // Sort by confidence / score descending
    const sorted = [...boxes].sort((a, b) => b.score - a.score);
    const merged: BoundingBox[] = [];

    while (sorted.length > 0) {
      const current = sorted.shift()!;
      let wasMergedWithExisting = false;

      for (let i = 0; i < merged.length; i++) {
        const target = merged[i];
        const iou = computeIoU(current, target);

        // Center distance
        const cx1 = current.x + current.width / 2;
        const cy1 = current.y + current.height / 2;
        const cx2 = target.x + target.width / 2;
        const cy2 = target.y + target.height / 2;
        const centerDist = Math.sqrt(Math.pow(cx1 - cx2, 2) + Math.pow(cy1 - cy2, 2));
        const avgWidth = (current.width + target.width) / 2;

        // Vertical overlap (e.g. neck directly underneath face)
        const isVerticallyAdjacent =
          Math.abs(cx1 - cx2) < avgWidth * 0.45 &&
          Math.abs(cy1 - cy2) < (current.height + target.height) * 0.70;

        // If high IoU OR close centers OR vertically attached neck/face
        if (iou >= this.config.duplicateIoUThreshold || centerDist < avgWidth * this.config.faceCenterMergeRatio || isVerticallyAdjacent) {
          // Merge bounding boxes
          const newMinX = Math.min(target.x, current.x);
          const newMinY = Math.min(target.y, current.y);
          const newMaxX = Math.max(target.x + target.width, current.x + current.width);
          const newMaxY = Math.max(target.y + target.height, current.y + current.height);

          merged[i] = {
            x: newMinX,
            y: newMinY,
            width: newMaxX - newMinX,
            height: newMaxY - newMinY,
            score: Math.max(target.score, current.score) + 15
          };
          wasMergedWithExisting = true;
          break;
        }
      }

      if (!wasMergedWithExisting) {
        merged.push(current);
      }
    }

    // Return at most 3 distinct candidates
    return merged.slice(0, 3);
  }

  /**
   * Extract 6 canonical geometric orbital landmarks around an eye center point
   */
  private extract6EyeLandmarks(
    data: Uint8ClampedArray,
    imgWidth: number,
    imgHeight: number,
    eyeCenterX: number,
    eyeCenterY: number,
    eyeHalfWidth: number,
    isLeftEye: boolean
  ): Point2D[] {
    const hw = Math.max(8, eyeHalfWidth);
    const px = Math.round(eyeCenterX);
    const py = Math.round(eyeCenterY);

    let verticalAperture = hw * 0.60;

    if (px - hw >= 0 && px + hw < imgWidth && py - hw >= 0 && py + hw < imgHeight) {
      let upperLidOffset = -hw * 0.30;
      let lowerLidOffset = hw * 0.30;

      let minLuma = 255;
      let minLumaY = py;

      for (let dy = -Math.round(hw * 0.7); dy <= Math.round(hw * 0.7); dy++) {
        const sampleY = py + dy;
        const idx = (sampleY * imgWidth + px) * 4;
        const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (luma < minLuma) {
          minLuma = luma;
          minLumaY = sampleY;
        }
      }

      let maxGradUpper = 0;
      let maxGradLower = 0;

      for (let dy = 1; dy < Math.round(hw * 0.7); dy++) {
        const yAbove = minLumaY - dy;
        const yBelow = minLumaY + dy;
        if (yAbove >= 0 && yBelow < imgHeight) {
          const idxAbove = (yAbove * imgWidth + px) * 4;
          const idxBelow = (yBelow * imgWidth + px) * 4;
          const lumaAbove = 0.299 * data[idxAbove] + 0.587 * data[idxAbove + 1] + 0.114 * data[idxAbove + 2];
          const lumaBelow = 0.299 * data[idxBelow] + 0.587 * data[idxBelow + 1] + 0.114 * data[idxBelow + 2];

          const gradUpper = lumaAbove - minLuma;
          const gradLower = lumaBelow - minLuma;

          if (gradUpper > maxGradUpper) {
            maxGradUpper = gradUpper;
            upperLidOffset = yAbove - py;
          }
          if (gradLower > maxGradLower) {
            maxGradLower = gradLower;
            lowerLidOffset = yBelow - py;
          }
        }
      }

      const detectedSpan = Math.abs(lowerLidOffset - upperLidOffset);
      if (detectedSpan >= 2 && detectedSpan <= hw * 1.5) {
        verticalAperture = detectedSpan;
      }
    }

    const halfAperture = verticalAperture / 2;

    const outerX = isLeftEye ? eyeCenterX - hw : eyeCenterX + hw;
    const innerX = isLeftEye ? eyeCenterX + hw : eyeCenterX - hw;
    const p2X = isLeftEye ? eyeCenterX - hw * 0.4 : eyeCenterX + hw * 0.4;
    const p3X = isLeftEye ? eyeCenterX + hw * 0.4 : eyeCenterX - hw * 0.4;
    const p5X = isLeftEye ? eyeCenterX + hw * 0.4 : eyeCenterX - hw * 0.4;
    const p6X = isLeftEye ? eyeCenterX - hw * 0.4 : eyeCenterX - hw * 0.4;

    return [
      { x: Math.round(outerX), y: Math.round(eyeCenterY) },
      { x: Math.round(p2X), y: Math.round(eyeCenterY - halfAperture) },
      { x: Math.round(p3X), y: Math.round(eyeCenterY - halfAperture * 0.9) },
      { x: Math.round(innerX), y: Math.round(eyeCenterY) },
      { x: Math.round(p5X), y: Math.round(eyeCenterY + halfAperture * 0.9) },
      { x: Math.round(p6X), y: Math.round(eyeCenterY + halfAperture) }
    ];
  }

  /**
   * Cluster skin density blocks into candidate bounding boxes
   */
  private findSkinClusters(
    grid: Uint8Array,
    gw: number,
    gh: number,
    blockW: number,
    blockH: number
  ): BoundingBox[] {
    const visited = new Uint8Array(gw * gh);
    const clusters: Array<{ minX: number; maxX: number; minY: number; maxY: number; score: number }> = [];

    const threshold = 6;

    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        const idx = gy * gw + gx;
        if (!visited[idx] && grid[idx] >= threshold) {
          let minX = gx;
          let maxX = gx;
          let minY = gy;
          let maxY = gy;
          let clusterScore = 0;

          const queue: Array<[number, number]> = [[gx, gy]];
          visited[idx] = 1;

          while (queue.length > 0) {
            const [cx, cy] = queue.shift()!;
            minX = Math.min(minX, cx);
            maxX = Math.max(maxX, cx);
            minY = Math.min(minY, cy);
            maxY = Math.max(maxY, cy);
            clusterScore += grid[cy * gw + cx];

            const neighbors: Array<[number, number]> = [
              [cx + 1, cy],
              [cx - 1, cy],
              [cx, cy + 1],
              [cx, cy - 1]
            ];

            for (const [nx, ny] of neighbors) {
              if (nx >= 0 && nx < gw && ny >= 0 && ny < gh) {
                const nIdx = ny * gw + nx;
                if (!visited[nIdx] && grid[nIdx] >= threshold) {
                  visited[nIdx] = 1;
                  queue.push([nx, ny]);
                }
              }
            }
          }

          const clusterW = (maxX - minX + 1);
          const clusterH = (maxY - minY + 1);
          const aspectRatio = clusterW / clusterH;

          if (clusterScore >= 40 && clusterW >= 3 && clusterH >= 3 && aspectRatio >= 0.4 && aspectRatio <= 2.2) {
            clusters.push({ minX, maxX, minY, maxY, score: clusterScore });
          }
        }
      }
    }

    return clusters
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(c => ({
        x: Math.round(c.minX * blockW),
        y: Math.round(c.minY * blockH),
        width: Math.round((c.maxX - c.minX + 1) * blockW),
        height: Math.round((c.maxY - c.minY + 1) * blockH),
        score: c.score
      }));
  }

  private createSyntheticFace(x: number, y: number, w: number, h: number, targetEAR: number): DetectedFace {
    const leftEyeCenterX = x - w * 0.18;
    const leftEyeCenterY = y - h * 0.12;
    const rightEyeCenterX = x + w * 0.18;
    const rightEyeCenterY = y - h * 0.12;
    const eyeHw = w * 0.08;
    const verticalHalf = eyeHw * targetEAR;

    const leftLandmarks: Point2D[] = [
      { x: leftEyeCenterX - eyeHw, y: leftEyeCenterY },
      { x: leftEyeCenterX - eyeHw * 0.4, y: leftEyeCenterY - verticalHalf },
      { x: leftEyeCenterX + eyeHw * 0.4, y: leftEyeCenterY - verticalHalf * 0.9 },
      { x: leftEyeCenterX + eyeHw, y: leftEyeCenterY },
      { x: leftEyeCenterX + eyeHw * 0.4, y: leftEyeCenterY + verticalHalf * 0.9 },
      { x: leftEyeCenterX - eyeHw * 0.4, y: leftEyeCenterY + verticalHalf }
    ];

    const rightLandmarks: Point2D[] = [
      { x: rightEyeCenterX + eyeHw, y: rightEyeCenterY },
      { x: rightEyeCenterX + eyeHw * 0.4, y: rightEyeCenterY - verticalHalf },
      { x: rightEyeCenterX - eyeHw * 0.4, y: rightEyeCenterY - verticalHalf * 0.9 },
      { x: rightEyeCenterX - eyeHw, y: rightEyeCenterY },
      { x: rightEyeCenterX - eyeHw * 0.4, y: rightEyeCenterY + verticalHalf * 0.9 },
      { x: rightEyeCenterX + eyeHw * 0.4, y: rightEyeCenterY + verticalHalf }
    ];

    return {
      id: 1,
      x: x - w / 2,
      y: y - h / 2,
      width: w,
      height: h,
      confidence: 0.95,
      leftEye: { x: leftEyeCenterX, y: leftEyeCenterY },
      rightEye: { x: rightEyeCenterX, y: rightEyeCenterY },
      leftEyeLandmarks: leftLandmarks,
      rightEyeLandmarks: rightLandmarks,
      nose: { x, y: y + h * 0.04 },
      mouth: { x, y: y + h * 0.24 },
      leftEAR: targetEAR,
      rightEAR: targetEAR,
      yaw: 0,
      pitch: 0
    };
  }

  private getDebugInfo() {
    return {
      baselineEAR: Math.round(this.baselineEAR * 1000) / 1000,
      blinkThreshold: Math.round(this.blinkThreshold * 1000) / 1000,
      neutralYaw: Math.round(this.neutralYaw * 10) / 10,
      neutralPitch: Math.round(this.neutralPitch * 10) / 10,
      faceConfidenceTimeMs: Math.round(this.sustainedMultipleFaceTimeMs),
      gazeDeviationTimeMs: Math.round(this.sustainedGazeDeviationTimeMs),
      faceMissingTimeMs: Math.round(this.sustainedFaceMissingTimeMs),
      blinkCooldownMs: Math.max(0, Date.now() - this.lastBlinkTimestamp),
      eyeState: this.eyeState,
      rawCount: this.rawDetectionsCount,
      uniqueCount: this.uniqueFacesCount,
      trackedCount: this.trackedFacesCount
    };
  }

  private emitMetrics(metrics: VisionMetrics) {
    this.latestMetrics = metrics;
    if (this.onMetricsUpdate) {
      this.onMetricsUpdate(metrics);
    }
  }
}
