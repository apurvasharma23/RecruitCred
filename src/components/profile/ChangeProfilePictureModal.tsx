import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getInitials } from '../common/UserAvatar';
import {
  X,
  Upload,
  Camera,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  AlertCircle,
  Sparkles,
  Move
} from 'lucide-react';

interface ChangeProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    label: 'Professional Candidate 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Professional Candidate 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Engineering Student 1',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80'
  },
  {
    label: 'Engineering Student 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
  }
];

export const ChangeProfilePictureModal: React.FC<ChangeProfilePictureModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, updateAvatar } = useApp();

  const [rawImageSrc, setRawImageSrc] = useState<string | null>(currentUser.avatar || null);
  const [zoom, setZoom] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRawImageSrc(currentUser.avatar || null);
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
      setErrorMsg(null);
      setIsSuccess(false);
      setIsRemoving(false);
    }
  }, [isOpen, currentUser.avatar]);

  if (!isOpen) return null;

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type & file extension
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const validExts = /\.(jpe?g|png|webp)$/i;

    if (!validMimes.includes(file.type) && !validExts.test(file.name)) {
      setErrorMsg('Please upload a JPG, PNG, or WEBP image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (max 5 MB)
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setErrorMsg('Image must be smaller than 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setErrorMsg('Unable to read selected file. Please try again.');
    };
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => {
          imageElementRef.current = img;
          setRawImageSrc(reader.result as string);
          setZoom(1);
          setPanOffset({ x: 0, y: 0 });
          setIsRemoving(false);
        };
        img.onerror = () => {
          setErrorMsg('Please upload a valid JPG, PNG, or WEBP image.');
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rawImageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !rawImageSrc) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    // Bound pan range based on zoom
    const maxPan = 100 * zoom;
    setPanOffset({
      x: Math.max(-maxPan, Math.min(maxPan, newX)),
      y: Math.max(-maxPan, Math.min(maxPan, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePresetSelect = (url: string) => {
    setErrorMsg(null);
    setRawImageSrc(url);
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    setIsRemoving(false);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementRef.current = img;
    };
    img.src = url;
  };

  const handleRemovePhoto = () => {
    setRawImageSrc(null);
    setIsRemoving(true);
    setErrorMsg(null);
  };

  const generateCroppedCanvasData = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!rawImageSrc) {
        resolve('');
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 320; // High resolution square canvas
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Fill background
        ctx.fillStyle = '#171A2B';
        ctx.fillRect(0, 0, size, size);

        // Calculate aspect ratio crop
        const minDim = Math.min(img.width, img.height);
        const sourceWidth = minDim / zoom;
        const sourceHeight = minDim / zoom;
        
        // Pan offset mapped from preview container (200px) to source image coordinates
        const scaleFactor = minDim / 200;
        const sourceX = (img.width - sourceWidth) / 2 - (panOffset.x * scaleFactor) / zoom;
        const sourceY = (img.height - sourceHeight) / 2 - (panOffset.y * scaleFactor) / zoom;

        // Draw image onto canvas
        ctx.drawImage(
          img,
          Math.max(0, Math.min(img.width - sourceWidth, sourceX)),
          Math.max(0, Math.min(img.height - sourceHeight, sourceY)),
          sourceWidth,
          sourceHeight,
          0,
          0,
          size,
          size
        );

        // Convert to safe dataURL
        try {
          const dataUrl = canvas.toDataURL('image/webp', 0.92);
          resolve(dataUrl);
        } catch {
          // Fallback to jpeg if webp unsupported
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        }
      };

      img.onerror = () => {
        // If external image fails CORS canvas conversion, return raw URL
        resolve(rawImageSrc);
      };

      img.src = rawImageSrc;
    });
  };

  const handleSave = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      if (isRemoving || !rawImageSrc) {
        updateAvatar('');
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsProcessing(false);
          onClose();
        }, 500);
        return;
      }

      const finalAvatarData = await generateCroppedCanvasData();
      updateAvatar(finalAvatarData);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setIsProcessing(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error('[ChangeProfilePicture] Error saving avatar:', err);
      setErrorMsg('Unable to update profile picture. Please try again.');
      setIsProcessing(false);
    }
  };

  const userInitials = getInitials(currentUser.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-pfp-title"
        className="w-full max-w-lg bg-[#171A2B] border border-[#252A46] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-5 bg-[#111424] border-b border-[#252A46] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#6C63FF]/20 text-[#8B7CFF] border border-[#6C63FF]/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 id="change-pfp-title" className="text-sm font-bold text-white">
                Change Profile Picture
              </h3>
              <p className="text-[11px] text-[#666A7A]">
                Upload, reposition, crop, or select a verified avatar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#252A46] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Interactive Crop & Circular Preview Stage */}
          <div className="flex flex-col items-center justify-center">
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`relative w-48 h-48 rounded-full overflow-hidden border-2 border-[#6C63FF] shadow-2xl bg-[#111424] select-none flex items-center justify-center ${
                rawImageSrc ? 'cursor-move' : ''
              }`}
              title={rawImageSrc ? 'Click and drag to reposition image' : 'No image'}
            >
              {rawImageSrc ? (
                <img
                  src={rawImageSrc}
                  alt="Avatar preview"
                  draggable={false}
                  className="absolute pointer-events-none transition-transform duration-75 max-w-none"
                  style={{
                    width: `${100 * zoom}%`,
                    height: `${100 * zoom}%`,
                    objectFit: 'cover',
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-[#8B7CFF]">{userInitials}</span>
                  <span className="text-[10px] text-[#666A7A] mt-1 font-medium">Initials Fallback</span>
                </div>
              )}

              {/* Reposition Overlay Cue */}
              {rawImageSrc && (
                <div className="absolute inset-0 bg-transparent rounded-full pointer-events-none border border-white/20 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-white/10" />
                  <div className="h-full w-[1px] bg-white/10 absolute" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#666A7A]">
              {rawImageSrc ? (
                <>
                  <Move className="w-3 h-3 text-[#8B7CFF]" />
                  <span>Drag to reposition • Circular display</span>
                </>
              ) : (
                <span>No profile photo set. Showing initials badge.</span>
              )}
            </div>
          </div>

          {/* Zoom & Reset Controls (Active when image is selected) */}
          {rawImageSrc && (
            <div className="p-3.5 rounded-2xl bg-[#111424] border border-[#252A46] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#8B7CFF]" />
                  Zoom & Scale
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className="text-[11px] text-[#8B7CFF] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-3">
                <ZoomOut className="w-3.5 h-3.5 text-[#666A7A]" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#252A46] rounded-lg appearance-none cursor-pointer accent-[#6C63FF]"
                />
                <ZoomIn className="w-3.5 h-3.5 text-[#8B7CFF]" />
                <span className="text-xs font-mono text-white w-8 text-right font-bold">
                  {zoom.toFixed(1)}x
                </span>
              </div>
            </div>
          )}

          {/* File Picker Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelection}
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#252A46] hover:bg-[#6C63FF] hover:text-white text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Upload className="w-4 h-4 text-[#8B7CFF] group-hover:text-white" />
              <span>{rawImageSrc ? 'Replace from Device' : 'Upload from Device'}</span>
            </button>

            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={!rawImageSrc}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                rawImageSrc
                  ? 'bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30'
                  : 'bg-[#111424] text-[#666A7A] border border-[#252A46] cursor-not-allowed opacity-50'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Picture</span>
            </button>
          </div>

          <p className="text-[10px] text-[#666A7A] text-center">
            Supported formats: <strong>JPG, PNG, WEBP</strong> (Max file size: <strong>5 MB</strong>)
          </p>

          {/* Preset Professional Avatars */}
          <div className="pt-3 border-t border-[#252A46] space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#666A7A] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#8B7CFF]" />
              Or Choose Preset Demo Avatar:
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {PRESET_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(preset.url)}
                  className={`p-1 rounded-2xl border transition-all cursor-pointer relative group ${
                    rawImageSrc === preset.url
                      ? 'border-[#6C63FF] bg-[#6C63FF]/20 ring-2 ring-[#6C63FF]/40'
                      : 'border-[#252A46] hover:border-[#6C63FF]/50 bg-[#111424]'
                  }`}
                  title={preset.label}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-12 rounded-xl object-cover"
                  />
                  {rawImageSrc === preset.url && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#6C63FF] rounded-full text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-[#111424] border-t border-[#252A46] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#252A46] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing || isSuccess}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#584DE8] disabled:opacity-60 text-white text-xs font-bold shadow-lg shadow-[#6C63FF]/30 hover:shadow-[#6C63FF]/50 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : isSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <span>Save Profile Picture</span>
            )}
          </button>
        </div>

        {/* Hidden Canvas for High-Quality Export */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
