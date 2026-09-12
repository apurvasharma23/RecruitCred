import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProofSource, Skill } from '../../types';
import { X, GitBranch, Trophy, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ConnectProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSkill: Skill | null;
}

export const ConnectProofModal: React.FC<ConnectProofModalProps> = ({
  isOpen,
  onClose,
  targetSkill
}) => {
  const { connectProofToSkill } = useApp();
  const [proofType, setProofType] = useState<ProofSource['type']>('github');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [details, setDetails] = useState('');
  const [metric, setMetric] = useState('');

  if (!isOpen || !targetSkill) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    connectProofToSkill(targetSkill.id, {
      type: proofType,
      title: title.trim(),
      url: url.trim() || undefined,
      details: details.trim() || undefined,
      metric: metric.trim() || undefined
    });

    // Reset and close
    setTitle('');
    setUrl('');
    setDetails('');
    setMetric('');
    onClose();
  };

  // Helper autofills for demo realism
  const handleQuickAutofill = (type: ProofSource['type']) => {
    setProofType(type);
    if (type === 'github') {
      setTitle(`${targetSkill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-production-service`);
      setUrl(`https://github.com/developer/${targetSkill.name.toLowerCase()}-service`);
      setDetails('Microservice architecture with automated CI/CD and comprehensive unit tests');
      setMetric('42 stars • 12 forks • 85 commits');
    } else if (type === 'leetcode') {
      setTitle(`LeetCode ${targetSkill.name} Problem Solving`);
      setUrl(`https://leetcode.com/u/verified_coder`);
      setDetails('Verified solutions across Medium & Hard algorithmic challenges');
      setMetric('185 Solved (Top 12% percentile)');
    } else if (type === 'kaggle') {
      setTitle(`Kaggle ${targetSkill.name} Competition Rank`);
      setUrl(`https://kaggle.com/u/master_dev`);
      setDetails('Top tier performance in multimodal classification benchmarks');
      setMetric('Kaggle Master • 2 Gold Medals');
    } else if (type === 'certification') {
      setTitle(`Professional ${targetSkill.name} Developer Specialization`);
      setUrl('https://coursera.org/verify/SP-DEV-CERT');
      setDetails('Issuer: Industry Standard Accreditation Body');
      setMetric('Credential ID: CRT-882910-SP');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-dropdown rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Attach Verifiable Proof for <span className="text-emerald-400">{targetSkill.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect external repositories, competitive programming metrics, or certificates.
            </p>
          </div>
        </div>

        {/* Proof Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <button
            type="button"
            onClick={() => handleQuickAutofill('github')}
            className={`p-3 rounded-xl border text-center transition-all ${
              proofType === 'github'
                ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
            <span className="text-xs">GitHub Repo</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAutofill('leetcode')}
            className={`p-3 rounded-xl border text-center transition-all ${
              proofType === 'leetcode'
                ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            <span className="text-xs">LeetCode</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAutofill('kaggle')}
            className={`p-3 rounded-xl border text-center transition-all ${
              proofType === 'kaggle'
                ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
            <span className="text-xs">Kaggle / Hack</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickAutofill('certification')}
            className={`p-3 rounded-xl border text-center transition-all ${
              proofType === 'certification'
                ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
            <span className="text-xs">Certification</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Proof Title / Repository Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. distributed-caching-service or LeetCode Top 5%"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Verifiable Metric / Highlights
              </label>
              <input
                type="text"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                placeholder="e.g. 120 stars • 32 commits or Top 5%"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                External Link URL (Optional)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Technical Description / Architecture Notes
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain how this proof demonstrates your actual proficiency..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Prototype Transparency Notice */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Demo Verified Connector Integration
            </span>
            <span className="text-slate-500">Live Mock API Verified</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Attach Proof
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
