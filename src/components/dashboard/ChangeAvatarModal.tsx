import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, Check, AlertCircle, Camera } from 'lucide-react';

interface ChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    label: 'Standard Male Candidate',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    label: 'Professional Lead Candidate',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    label: 'Female Engineer Candidate',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
  },
  {
    label: 'Engineering Student',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  }
];

export const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateAvatar } = useApp();

  const [previewUrl, setPreviewUrl] = useState<string>(currentUser.avatar);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload a JPEG, PNG, WEBP, or GIF image.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg('File exceeds 5MB size limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsUploading(true);
    setErrorMsg(null);

    setTimeout(() => {
      updateAvatar(previewUrl);
      setIsUploading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 600);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-modal-title"
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 id="avatar-modal-title" className="text-sm font-bold text-white">
                Change Profile Picture
              </h3>
              <p className="text-[11px] text-slate-400">
                Upload a verified headshot or select a professional avatar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Click to change"
              >
                <Upload className="w-6 h-6 text-white" />
              </button>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              Image preview (Max: 5MB)
            </span>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Upload Image from Device</span>
            </button>
          </div>

          {/* Preset Avatars */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Or Choose Preset Avatar:
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {PRESET_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setPreviewUrl(preset.url);
                  }}
                  className={`p-1 rounded-2xl border transition-all cursor-pointer ${
                    previewUrl === preset.url
                      ? 'border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500/40'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                  }`}
                  title={preset.label}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-12 rounded-xl object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading || isSuccess}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isUploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Profile Picture</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
