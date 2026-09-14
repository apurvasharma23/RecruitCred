import React from 'react';
import { VisionMetrics, GazeDirection } from '../../services/vision/visionEngine';
import {
  Activity,
  RotateCcw,
  Sliders,
  Sparkles,
  Eye,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

interface VisionDebugOverlayProps {
  metrics: VisionMetrics | null;
  serverWarningCount?: number;
  onSimulate: (override: {
    forcedFaceCount?: number;
    forcedGaze?: GazeDirection;
    forcedBlink?: boolean;
    forcedCameraDrop?: boolean;
    forcedModelError?: boolean;
  }) => void;
  onSimulateTabSwitch?: () => void;
  onSimulateObjectViolation?: () => void;
  onResetSimulation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const VisionDebugOverlay: React.FC<VisionDebugOverlayProps> = ({
  metrics,
  serverWarningCount = 0,
  onSimulate,
  onSimulateTabSwitch,
  onSimulateObjectViolation,
  onResetSimulation,
  isOpen,
  onToggle
}) => {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-40 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-indigo-400 border border-indigo-500/40 text-[11px] font-mono font-bold shadow-xl flex items-center gap-1.5 transition-all cursor-pointer"
        title="Toggle Computer-Vision Debug Inspector (Dev Mode: Shift+D)"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>CV Proctoring HUD</span>
        {serverWarningCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-md bg-amber-500 text-black text-[9px] font-black">
            {serverWarningCount}/3
          </span>
        )}
        {metrics && (
          <span className={`w-2 h-2 rounded-full ${
            metrics.state === 'NORMAL' ? 'bg-emerald-400' :
            metrics.state === 'CALIBRATING' ? 'bg-indigo-400 animate-pulse' :
            metrics.state === 'ATTENTION_WARNING' ? 'bg-amber-400' :
            'bg-rose-400 animate-pulse'
          }`} />
        )}
      </button>
    );
  }

  const now = Date.now();
  const timeSinceLastBlink = metrics ? Math.round((now - metrics.lastBlinkTimestamp) / 100) / 10 : 0;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-84 sm:w-96 bg-[#070A10]/95 backdrop-blur-md rounded-2xl border border-indigo-500/50 shadow-2xl p-4 text-xs font-mono text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200 max-h-[90vh] overflow-y-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">
            Proctoring & CV Inspector
          </span>
        </div>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Server Warning Counter Display */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 mb-2">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300 text-[10px] font-bold">SERVER WARNING LEVEL:</span>
        </div>
        <span className={`font-black text-[11px] px-2.5 py-0.5 rounded-md ${
          serverWarningCount === 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
          serverWarningCount < 3 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
          'bg-rose-500/20 text-rose-300 border border-rose-500/40'
        }`}>
          {serverWarningCount}/3 Warnings
        </span>
      </div>

      {metrics ? (
        <div className="space-y-3">
          
          {/* Requirement 17: Official Diagnostics Telemetry Readout */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-1 text-[11px] font-mono shadow-inner">
            <div className="flex justify-between">
              <span className="text-slate-400">Camera:</span>
              <strong className={metrics.diagnostics?.cameraStatusText === 'LIVE' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {metrics.diagnostics?.cameraStatusText || (metrics.cameraConnected ? 'LIVE' : 'DISCONNECTED')}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Video:</span>
              <strong className="text-white">{metrics.diagnostics?.videoResolution || '1280 × 720'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Frame:</span>
              <strong className={metrics.diagnostics?.frameStatusText === 'VALID' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {metrics.diagnostics?.frameStatusText || 'VALID'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Faces detected:</span>
              <strong className={metrics.faceCount === 1 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {metrics.faceCount}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Persons detected:</span>
              <strong className={metrics.personCount === 1 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {metrics.personCount}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Face confidence:</span>
              <strong className="text-cyan-300">{metrics.faceConfidence.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Face stable:</span>
              <strong className={metrics.diagnostics?.faceStable ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {metrics.diagnostics?.faceStable ? 'YES' : 'NO'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Face lost duration:</span>
              <strong className={metrics.debugInfo.faceMissingTimeMs > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                {metrics.debugInfo.faceMissingTimeMs} ms
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Multiple person:</span>
              <strong className={metrics.personCount > 1 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {metrics.personCount > 1 ? 'YES' : 'NO'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Warnings:</span>
              <strong className={serverWarningCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {serverWarningCount}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Proctoring:</span>
              <strong className="text-emerald-400 font-bold">ACTIVE</strong>
            </div>
          </div>

          {/* Eye State & Blink Real-time Panel */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[11px]">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>EYE ASPECT RATIO (EAR)</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                metrics.eyeState === 'OPEN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                metrics.eyeState === 'CLOSING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                metrics.eyeState === 'CLOSED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                'bg-slate-800 text-slate-400'
              }`}>
                {metrics.eyeState}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">LEFT EAR</span>
                <strong className="text-cyan-300 text-xs font-mono">{metrics.leftEAR.toFixed(3)}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">RIGHT EAR</span>
                <strong className="text-cyan-300 text-xs font-mono">{metrics.rightEAR.toFixed(3)}</strong>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">AVG EAR</span>
                <strong className={`text-xs font-mono ${
                  metrics.averageEAR < metrics.blinkThreshold ? 'text-amber-400 font-black' : 'text-emerald-300'
                }`}>
                  {metrics.averageEAR.toFixed(3)}
                </strong>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  metrics.blinkDetected ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'
                }`} />
                <span className="text-slate-300 font-bold">
                  Blinks: <strong className="text-cyan-300 text-sm">{metrics.blinkCount}</strong>
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Last: {timeSinceLastBlink}s ago {metrics.lastBlinkDurationMs > 0 && `(${metrics.lastBlinkDurationMs}ms)`}
              </div>
            </div>
          </div>

          {/* Test Scenarios & Signal Injectors */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Test Proctoring Edge Cases</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {/* Normal 1 Face */}
              <button
                onClick={() => onSimulate({ forcedFaceCount: 1, forcedGaze: 'CENTER' })}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-800 text-left cursor-pointer"
              >
                1 Face (Normal)
              </button>

              {/* 2 Faces (Warning) */}
              <button
                onClick={() => onSimulate({ forcedFaceCount: 2 })}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-950 hover:text-amber-300 border border-slate-800 text-left cursor-pointer"
              >
                2 Faces (Warning)
              </button>

              {/* 4+ Faces (>3 Detection - Critical Cheating) */}
              <button
                onClick={() => onSimulate({ forcedFaceCount: 4 })}
                className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/60 text-left cursor-pointer font-bold"
              >
                🚨 4+ People (&gt;3 Cheating)
              </button>

              {/* Prohibited Object / Secondary Camera */}
              {onSimulateObjectViolation && (
                <button
                  onClick={onSimulateObjectViolation}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-950 hover:text-amber-300 border border-slate-800 text-left cursor-pointer flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Object / Camera Flag</span>
                </button>
              )}

              {/* Tab Switch Warning */}
              {onSimulateTabSwitch && (
                <button
                  onClick={onSimulateTabSwitch}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-950 hover:text-amber-300 border border-slate-800 text-left cursor-pointer"
                >
                  Tab Switch (Warning)
                </button>
              )}

              {/* Absence */}
              <button
                onClick={() => onSimulate({ forcedFaceCount: 0 })}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-amber-950 hover:text-amber-300 border border-slate-800 text-left cursor-pointer"
              >
                0 Faces (Absence)
              </button>

              {/* Camera Disconnect */}
              <button
                onClick={() => onSimulate({ forcedCameraDrop: true })}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 hover:text-rose-300 border border-slate-800 text-left cursor-pointer"
              >
                Camera Disconnect
              </button>

              {/* Blink */}
              <button
                onClick={() => {
                  onSimulate({ forcedBlink: true });
                  setTimeout(() => onSimulate({ forcedBlink: false }), 250);
                }}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 text-left cursor-pointer font-bold text-cyan-400"
              >
                Simulate Blink
              </button>
            </div>

            <button
              onClick={onResetSimulation}
              className="w-full mt-1 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Live Camera Feed
            </button>
          </div>

        </div>
      ) : (
        <div className="text-center py-4 text-slate-500 text-xs">
          Vision engine initializing...
        </div>
      )}

    </div>
  );
};
