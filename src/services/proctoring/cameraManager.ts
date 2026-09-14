/**
 * RecruitCred Camera Manager Singleton
 * 
 * Centralized, production-grade MediaStream controller for pre-flight System Check
 * and live proctored Assessment Runner.
 * 
 * Key Features:
 * - Full macOS Safari & Chromium compatibility with secure context detection
 * - React StrictMode idempotent acquisition handling (no race conditions or premature stream drops)
 * - Legacy WebKit fallback (navigator.webkitGetUserMedia)
 * - Safe diagnostic metadata collection (devices, permission state, track state, settings)
 * - Stream continuity between System Check -> Assessment Runner without stopping hardware tracks
 * - Multi-tier exact error classification with actionable instructions:
 *     * NotAllowedError -> Permission denied/blocked in Safari/Chrome settings
 *     * NotFoundError -> No camera device found
 *     * NotReadableError -> Camera in use by another macOS app
 *     * OverconstrainedError -> Constraints cannot be satisfied
 *     * SecurityError / Insecure Context -> HTTP vs localhost/HTTPS detection
 *     * TypeError -> Constraint/API issue
 * - Safe video element attachment with autoPlay / playsInline / muted / play()
 */

export type CameraStatusCode =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'blocked'
  | 'not_found'
  | 'in_use'
  | 'overconstrained'
  | 'security_error'
  | 'insecure_context'
  | 'type_error'
  | 'error'
  | 'disconnected';

export interface CameraEnvironmentDiagnostics {
  isSecureContext: boolean;
  hasNavigator: boolean;
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  hasLegacyGetUserMedia: boolean;
  videoDeviceCount: number;
  permissionState: string;
  protocol: string;
  hostname: string;
  origin: string;
}

export interface CameraDiagnosticResult {
  success: boolean;
  status: CameraStatusCode;
  stream: MediaStream | null;
  track: MediaStreamTrack | null;
  message: string;
  rawError?: {
    name: string;
    message: string;
    stack?: string;
  } | null;
  diagnostics?: CameraEnvironmentDiagnostics;
  resolution?: string;
  fps?: number;
  label?: string;
}

export type CameraStatusListener = (status: CameraStatusCode, detail: CameraDiagnosticResult) => void;

class CameraManager {
  private activeStream: MediaStream | null = null;
  private currentStatus: CameraStatusCode = 'idle';
  private lastDiagnostic: CameraDiagnosticResult | null = null;
  private listeners: Set<CameraStatusListener> = new Set();
  private inFlightAcquisition: Promise<CameraDiagnosticResult> | null = null;

  /**
   * Collect safe browser environment diagnostics
   */
  public async getEnvironmentDiagnostics(): Promise<CameraEnvironmentDiagnostics> {
    const isSecure = typeof window !== 'undefined' ? Boolean(window.isSecureContext) : false;
    const hasNav = typeof navigator !== 'undefined';
    const hasMD = hasNav && Boolean(navigator.mediaDevices);
    const hasGUM = hasMD && typeof navigator.mediaDevices.getUserMedia === 'function';
    const hasLegacyGUM = hasNav && Boolean((navigator as any).webkitGetUserMedia || (navigator as any).getUserMedia);

    let videoDeviceCount = 0;
    if (hasMD && typeof navigator.mediaDevices.enumerateDevices === 'function') {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        videoDeviceCount = devices.filter(d => d.kind === 'videoinput').length;
      } catch (e) {
        console.warn('[CameraManager] enumerateDevices query notice:', e);
      }
    }

    let permissionState = 'unsupported';
    if (hasNav && (navigator as any).permissions && typeof (navigator as any).permissions.query === 'function') {
      try {
        const perm = await (navigator as any).permissions.query({ name: 'camera' });
        permissionState = perm.state || 'unsupported';
      } catch {}
    }

    return {
      isSecureContext: isSecure,
      hasNavigator: hasNav,
      hasMediaDevices: hasMD,
      hasGetUserMedia: hasGUM,
      hasLegacyGetUserMedia: hasLegacyGUM,
      videoDeviceCount,
      permissionState,
      protocol: typeof window !== 'undefined' ? window.location.protocol : '',
      hostname: typeof window !== 'undefined' ? window.location.hostname : '',
      origin: typeof window !== 'undefined' ? window.location.origin : ''
    };
  }

  /**
   * Subscribe to camera status changes
   */
  public subscribe(listener: CameraStatusListener): () => void {
    this.listeners.add(listener);
    if (this.lastDiagnostic) {
      listener(this.currentStatus, this.lastDiagnostic);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(status: CameraStatusCode, diagnostic: CameraDiagnosticResult) {
    this.currentStatus = status;
    this.lastDiagnostic = diagnostic;
    this.listeners.forEach((listener) => {
      try {
        listener(status, diagnostic);
      } catch (err) {
        console.error('[CameraManager] Listener notification error:', err);
      }
    });
  }

  /**
   * Check if an active, live camera stream is already running
   */
  public isCameraLive(): boolean {
    if (!this.activeStream || !this.activeStream.active) {
      return false;
    }
    const videoTracks = this.activeStream.getVideoTracks();
    if (!videoTracks || videoTracks.length === 0) {
      return false;
    }
    const track = videoTracks[0];
    return track.readyState === 'live' && track.enabled;
  }

  /**
   * Retrieve currently active MediaStream if live, else null
   */
  public getActiveStream(): MediaStream | null {
    if (this.isCameraLive()) {
      return this.activeStream;
    }
    if (this.activeStream) {
      this.activeStream = null;
    }
    return null;
  }

  /**
   * Request real browser camera permission and obtain MediaStream
   * Safe against React StrictMode double-mounting
   */
  public async requestCamera(preferredConstraints?: MediaStreamConstraints): Promise<CameraDiagnosticResult> {
    // 1. If we already have a healthy live stream, return it immediately
    if (this.isCameraLive() && this.activeStream) {
      const track = this.activeStream.getVideoTracks()[0];
      const settings = track.getSettings ? track.getSettings() : {};
      const resolution = settings.width && settings.height ? `${settings.width}x${settings.height}` : '640x480';
      const diagnostic: CameraDiagnosticResult = {
        success: true,
        status: 'active',
        stream: this.activeStream,
        track,
        resolution,
        fps: settings.frameRate || 30,
        label: track.label || 'Webcam Sensor',
        message: `Camera ready (${resolution}) · Video track live`
      };
      this.notifyListeners('active', diagnostic);
      return diagnostic;
    }

    // 2. React StrictMode Idempotency: Reuse in-flight promise if one is running
    if (this.inFlightAcquisition) {
      return this.inFlightAcquisition;
    }

    this.inFlightAcquisition = this.executeCameraAcquisition(preferredConstraints);
    try {
      const result = await this.inFlightAcquisition;
      return result;
    } finally {
      this.inFlightAcquisition = null;
    }
  }

  private async executeCameraAcquisition(preferredConstraints?: MediaStreamConstraints): Promise<CameraDiagnosticResult> {
    this.notifyListeners('requesting', {
      success: false,
      status: 'requesting',
      stream: null,
      track: null,
      message: 'Requesting camera access from browser...'
    });

    const diagnostics = await this.getEnvironmentDiagnostics();

    // Log safe diagnostics to console for debugging
    console.log('[CameraDiagnostics] Environment:', {
      isSecureContext: diagnostics.isSecureContext,
      hasMediaDevices: diagnostics.hasMediaDevices,
      hasGetUserMedia: diagnostics.hasGetUserMedia,
      videoDeviceCount: diagnostics.videoDeviceCount,
      permissionState: diagnostics.permissionState,
      origin: diagnostics.origin
    });

    // Check Secure Context requirement (Safari / Chrome require https or localhost)
    if (!diagnostics.isSecureContext && diagnostics.hostname !== 'localhost' && diagnostics.hostname !== '127.0.0.1') {
      const msg = `Insecure Context (${diagnostics.origin}): Safari and Chrome disable camera access on non-localhost HTTP. Please open http://localhost:5174/ or use HTTPS.`;
      const diagnostic: CameraDiagnosticResult = {
        success: false,
        status: 'insecure_context',
        stream: null,
        track: null,
        message: msg,
        rawError: { name: 'InsecureContextError', message: msg },
        diagnostics
      };
      this.notifyListeners('insecure_context', diagnostic);
      return diagnostic;
    }

    // Check mediaDevices availability
    if (!diagnostics.hasGetUserMedia && !diagnostics.hasLegacyGetUserMedia) {
      const msg = `MediaDevices API is not available on ${diagnostics.origin}. Please ensure you are accessing via http://localhost:5174/ in Safari.`;
      const diagnostic: CameraDiagnosticResult = {
        success: false,
        status: 'error',
        stream: null,
        track: null,
        message: msg,
        rawError: { name: 'NotSupportedError', message: msg },
        diagnostics
      };
      this.notifyListeners('error', diagnostic);
      return diagnostic;
    }

    let stream: MediaStream | null = null;
    let rawError: any = null;

    // Strategy 1: Standard getUserMedia with basic { video: true, audio: false }
    // Universal support across Safari macOS, Chrome, Firefox
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints: MediaStreamConstraints = preferredConstraints || {
          video: true,
          audio: false
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } else if (typeof navigator !== 'undefined' && (navigator as any).webkitGetUserMedia) {
        // Legacy WebKit fallback
        const legacyGUM = (navigator as any).webkitGetUserMedia.bind(navigator);
        stream = await new Promise<MediaStream>((resolve, reject) => {
          legacyGUM({ video: true, audio: false }, resolve, reject);
        });
      }
    } catch (err1: any) {
      console.warn('[CameraManager] Primary getUserMedia failed with:', {
        name: err1.name,
        message: err1.message
      });
      rawError = err1;

      // If error is not permission denial, try fallback constraint
      const isDenied = err1.name === 'NotAllowedError' || err1.name === 'PermissionDeniedError' || err1.name === 'SecurityError';
      const isNotFound = err1.name === 'NotFoundError' || err1.name === 'DevicesNotFoundError';

      if (!isDenied && !isNotFound && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          rawError = null;
        } catch (err2: any) {
          console.error('[CameraManager] Fallback getUserMedia also failed:', {
            name: err2.name,
            message: err2.message
          });
          rawError = err2;
        }
      }
    }

    // Handle Failure with precise error classification
    if (!stream || rawError) {
      const err = rawError || new Error('Failed to obtain camera stream');
      const errName = err.name || 'UnknownError';
      const errMsg = err.message || 'Camera request failed';

      let status: CameraStatusCode = 'error';
      let message = `Camera error (${errName}): ${errMsg}`;

      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        status = 'denied';
        message = 'Camera permission is blocked. Allow camera access for this website in Safari Settings → Websites → Camera, then retry.';
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        status = 'not_found';
        message = `No camera device available (${diagnostics.videoDeviceCount} video inputs detected). Please connect a webcam and ensure it is recognized by macOS.`;
      } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
        status = 'in_use';
        message = 'Camera is currently in use by another application (FaceTime, Zoom, Photo Booth, etc.) or macOS process.';
      } else if (errName === 'OverconstrainedError' || errName === 'ConstraintNotSatisfiedError') {
        status = 'overconstrained';
        message = 'Requested camera constraints cannot be satisfied by your webcam device.';
      } else if (errName === 'SecurityError') {
        status = 'security_error';
        message = 'Camera access was restricted by browser security policies or insecure origin context.';
      } else if (errName === 'TypeError') {
        status = 'type_error';
        message = `Invalid camera configuration or API call: ${errMsg}`;
      }

      const diagnostic: CameraDiagnosticResult = {
        success: false,
        status,
        stream: null,
        track: null,
        message,
        rawError: {
          name: errName,
          message: errMsg,
          stack: err.stack
        },
        diagnostics
      };
      this.notifyListeners(status, diagnostic);
      return diagnostic;
    }

    // Validate Stream Tracks
    const videoTracks = stream.getVideoTracks();
    if (!videoTracks || videoTracks.length === 0) {
      this.stopStreamInternal(stream);
      const diagnostic: CameraDiagnosticResult = {
        success: false,
        status: 'not_found',
        stream: null,
        track: null,
        message: 'No video track found in MediaStream.',
        rawError: { name: 'NotFoundError', message: 'No video track found in MediaStream.' },
        diagnostics
      };
      this.notifyListeners('not_found', diagnostic);
      return diagnostic;
    }

    const videoTrack = videoTracks[0];
    if (videoTrack.readyState !== 'live') {
      this.stopStreamInternal(stream);
      const diagnostic: CameraDiagnosticResult = {
        success: false,
        status: 'error',
        stream: null,
        track: null,
        message: `Camera video track is not live (readyState: ${videoTrack.readyState}).`,
        rawError: { name: 'TrackInactiveError', message: `Video track state: ${videoTrack.readyState}` },
        diagnostics
      };
      this.notifyListeners('error', diagnostic);
      return diagnostic;
    }

    // Attach track disconnect handler
    videoTrack.onended = () => {
      console.warn('[CameraManager] Hardware camera track disconnected or ended');
      this.activeStream = null;
      const diagnostic: CameraDiagnosticResult = {
        success: false,
        status: 'disconnected',
        stream: null,
        track: null,
        message: 'Camera device disconnected or video track stopped.',
        diagnostics
      };
      this.notifyListeners('disconnected', diagnostic);
    };

    this.activeStream = stream;
    const settings = videoTrack.getSettings ? videoTrack.getSettings() : {};
    const resolution = settings.width && settings.height ? `${settings.width}x${settings.height}` : '640x480';
    const fps = settings.frameRate || 30;

    console.log('[CameraDiagnostics] Active Track Live:', {
      label: videoTrack.label,
      readyState: videoTrack.readyState,
      resolution,
      fps
    });

    const diagnostic: CameraDiagnosticResult = {
      success: true,
      status: 'active',
      stream,
      track: videoTrack,
      resolution,
      fps,
      label: videoTrack.label || 'Webcam Sensor',
      message: `Camera ready (${resolution}) · Video track live`,
      diagnostics
    };

    this.notifyListeners('active', diagnostic);
    return diagnostic;
  }

  /**
   * Safely attach a MediaStream to an HTMLVideoElement with autoplay & playsinline
   * and verifies that dimensions become ready
   */
  public async attachToVideo(videoElement: HTMLVideoElement, customStream?: MediaStream): Promise<boolean> {
    const stream = customStream || this.getActiveStream();
    if (!stream || !videoElement) {
      return false;
    }

    try {
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = true;

      if (videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }

      await videoElement.play().catch((playErr) => {
        console.warn('[CameraManager] video.play() note:', playErr);
      });

      // Wait briefly for video metadata / dimensions to become available if needed
      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        await new Promise<void>((resolve) => {
          let resolved = false;
          const onReady = () => {
            if (!resolved) {
              resolved = true;
              videoElement.removeEventListener('loadedmetadata', onReady);
              videoElement.removeEventListener('canplay', onReady);
              videoElement.removeEventListener('loadeddata', onReady);
              resolve();
            }
          };
          videoElement.addEventListener('loadedmetadata', onReady);
          videoElement.addEventListener('canplay', onReady);
          videoElement.addEventListener('loadeddata', onReady);
          setTimeout(() => {
            if (!resolved) {
              resolved = true;
              videoElement.removeEventListener('loadedmetadata', onReady);
              videoElement.removeEventListener('canplay', onReady);
              videoElement.removeEventListener('loadeddata', onReady);
              resolve();
            }
          }, 1200);
        });
      }

      return true;
    } catch (err) {
      console.error('[CameraManager] Failed to attach stream to video element:', err);
      return false;
    }
  }

  /**
   * Get safe diagnostic telemetry without sensitive information
   */
  public getSafeDiagnostics(videoElement?: HTMLVideoElement | null) {
    const stream = this.activeStream;
    const tracks = stream ? stream.getVideoTracks() : [];
    const track = tracks[0] || null;
    return {
      cameraStreamExists: Boolean(stream),
      videoTracksCount: tracks.length,
      trackReadyState: track ? track.readyState : 'none',
      trackEnabled: track ? track.enabled : false,
      videoReadyState: videoElement ? videoElement.readyState : 0,
      videoWidth: videoElement ? videoElement.videoWidth : 0,
      videoHeight: videoElement ? videoElement.videoHeight : 0,
      videoPaused: videoElement ? videoElement.paused : true,
      videoEnded: videoElement ? videoElement.ended : true,
      videoSrcObjectExists: videoElement ? Boolean(videoElement.srcObject) : false
    };
  }

  private stopStreamInternal(stream: MediaStream) {
    try {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
    } catch {}
  }

  /**
   * Stop active camera stream and release hardware sensor
   */
  public stopCamera() {
    if (this.activeStream) {
      this.stopStreamInternal(this.activeStream);
      this.activeStream = null;
    }
    this.currentStatus = 'idle';
    const diagnostic: CameraDiagnosticResult = {
      success: true,
      status: 'idle',
      stream: null,
      track: null,
      message: 'Camera stopped.'
    };
    this.notifyListeners('idle', diagnostic);
  }
}

// Global Singleton Export
export const cameraManager = new CameraManager();
