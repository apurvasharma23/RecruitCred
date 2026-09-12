import React, { useState } from 'react';
import { DASHBOARD_DEMO_DATA } from '../../mockData/dashboardDemoData';
import { DigitalCertificate } from '../../types';
import {
  X,
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  Lock
} from 'lucide-react';

interface VerifyCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertificateId?: string;
}

export const VerifyCertificateModal: React.FC<VerifyCertificateModalProps> = ({
  isOpen,
  onClose,
  initialCertificateId = ''
}) => {
  const [certQuery, setCertQuery] = useState(initialCertificateId);
  const [searchResult, setSearchResult] = useState<DigitalCertificate | null>(() => {
    if (initialCertificateId) {
      return DASHBOARD_DEMO_DATA.certificates.find(
        c => c.certificateId.toLowerCase() === initialCertificateId.toLowerCase()
      ) || null;
    }
    return null;
  });
  const [searched, setSearched] = useState(Boolean(initialCertificateId));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certQuery.trim()) return;

    const query = certQuery.trim().toLowerCase();
    const found = DASHBOARD_DEMO_DATA.certificates.find(
      c => c.certificateId.toLowerCase() === query ||
           c.certificateId.toLowerCase().includes(query) ||
           query.includes(c.certificateId.toLowerCase())
    );

    setSearchResult(found || null);
    setSearched(true);
  };

  const handleQuickLookup = (id: string) => {
    setCertQuery(id);
    const found = DASHBOARD_DEMO_DATA.certificates.find(c => c.certificateId === id);
    setSearchResult(found || null);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">RecruitCred Credential Verification</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify the authenticity of any RecruitCred assessment certificate.
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enter Certificate ID
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={certQuery}
                  onChange={(e) => setCertQuery(e.target.value)}
                  placeholder="e.g. RC-PY-2026-001482"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
              >
                Verify
              </button>
            </div>
          </div>
        </form>

        {/* Quick Demo Certificate IDs */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 mb-2">Sample Certificate IDs for Verification:</div>
          <div className="flex flex-wrap gap-2">
            {DASHBOARD_DEMO_DATA.certificates.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleQuickLookup(c.certificateId)}
                className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-indigo-500/40 transition-colors"
              >
                {c.certificateId} ({c.skillName})
              </button>
            ))}
          </div>
        </div>

        {/* Verification Result Display */}
        {searched && (
          <div className="mt-6 pt-5 border-t border-slate-800 animate-in fade-in duration-200">
            {searchResult ? (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 shadow-glow-verified space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Valid Certificate Verified
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {searchResult.certificateId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Candidate Name</span>
                    <div className="font-bold text-white text-sm mt-0.5">{searchResult.candidateName}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Assessment Score</span>
                    <div className="font-bold text-emerald-400 text-sm mt-0.5 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {searchResult.score}% (Passed)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Credential Type</span>
                    <div className="font-bold text-indigo-300 mt-0.5">{searchResult.assessmentName}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Issue Date</span>
                    <div className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {searchResult.issueDate}
                    </div>
                  </div>
                </div>

                {searchResult.criteria && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
                    <strong className="text-indigo-300">Verification Criteria:</strong> {searchResult.criteria}
                  </div>
                )}

                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Privacy Guaranteed: No private contact or demographic data is exposed.</span>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                  <XCircle className="w-4 h-4" />
                  No Certificate Found
                </div>
                <p className="text-xs text-slate-400">
                  No valid RecruitCred credential matches ID: <span className="font-mono text-white">{certQuery}</span>.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
