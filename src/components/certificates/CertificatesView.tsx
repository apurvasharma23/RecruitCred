import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DASHBOARD_DEMO_DATA } from '../../mockData/dashboardDemoData';
import { DigitalCertificate } from '../../types';
import { CertificateModal } from './CertificateModal';
import { VerifyCertificateModal } from './VerifyCertificateModal';
import {
  Award,
  ShieldCheck,
  Download,
  Eye,
  CheckCircle2,
  Search,
  Calendar,
  FileCode2,
  Copy,
  Check
} from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const { navigateTo } = useApp();
  const [selectedCert, setSelectedCert] = useState<DigitalCertificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const certificates = DASHBOARD_DEMO_DATA.certificates;

  const handleOpenCertificate = (cert: DigitalCertificate) => {
    setSelectedCert(cert);
    setIsCertModalOpen(true);
  };

  const handleCopyId = (certId: string) => {
    navigator.clipboard.writeText(certId);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Assessment Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Standardized technical credentials earned by scoring ≥70% on timed RecruitCred proctored assessments. Recruiter-verifiable with cryptographic IDs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsVerifyModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Search className="w-4 h-4 text-indigo-400" />
            <span>Verify Any Certificate</span>
          </button>

          <button
            onClick={() => navigateTo('assessments')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <FileCode2 className="w-4 h-4" />
            <span>Take Assessments</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Credentials</span>
          <div className="text-2xl font-black text-white font-mono mt-1">{certificates.length}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">All Valid & Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Highest Score</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">88%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Problem Solving</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Average Score</span>
          <div className="text-2xl font-black text-indigo-300 font-mono mt-1">84.2%</div>
          <div className="text-[10px] text-indigo-400 mt-0.5">Top 14% National</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Verification Ledger</span>
          <div className="text-2xl font-black text-emerald-300 font-mono mt-1">100%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Tamper-Proof</div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Issued Credentials Library</h2>
          <span className="text-xs text-slate-400 font-mono">{certificates.length} Available</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-5 shadow-lg group"
            >
              <div>
                {/* Card Top: Skill Name & Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {cert.skillName}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {cert.assessmentName}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono">
                    Score: {cert.score}%
                  </span>
                </div>

                {/* Details Bar */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Issued:
                    </span>
                    <span className="font-medium">{cert.issueDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Certificate ID:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-emerald-400 font-semibold">{cert.certificateId}</span>
                      <button
                        onClick={() => handleCopyId(cert.certificateId)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                        title="Copy Certificate ID"
                      >
                        {copiedId === cert.certificateId ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {cert.status} ({cert.issuer})
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  {cert.criteria}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleOpenCertificate(cert)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => handleOpenCertificate(cert)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recruiter Flow Explainer Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
          <span>The RecruitCred Verification Pipeline</span>
        </div>
        <h3 className="text-lg font-bold text-white">
          How RecruitCred Credentials Power Your Recruitment Advantage
        </h3>

        {/* Step by step flow */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2 text-center text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-between space-y-2">
            <span className="text-[10px] font-mono text-slate-500">Step 1</span>
            <div className="font-bold text-white">Choose Skill</div>
            <span className="text-[10px] text-slate-400">Select domain</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-between space-y-2">
            <span className="text-[10px] font-mono text-slate-500">Step 2</span>
            <div className="font-bold text-white">Take Assessment</div>
            <span className="text-[10px] text-slate-400">Timed code test</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-between space-y-2">
            <span className="text-[10px] font-mono text-slate-500">Step 3</span>
            <div className="font-bold text-white">Instant Result</div>
            <span className="text-[10px] text-slate-400">Detailed scoring</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-between space-y-2">
            <span className="text-[10px] font-mono text-slate-500">Step 4</span>
            <div className="font-bold text-emerald-400">Pass ≥ 70%</div>
            <span className="text-[10px] text-slate-400">Meet standard</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-between space-y-2">
            <span className="text-[10px] font-mono text-slate-500">Step 5</span>
            <div className="font-bold text-indigo-300">RecruitCred Certificate</div>
            <span className="text-[10px] text-slate-400">Cryptographic ID</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-glow-verified flex flex-col items-center justify-between space-y-2">
            <span className="text-[10px] font-mono text-emerald-400">Step 6</span>
            <div className="font-bold text-emerald-300">Recruiter Verification</div>
            <span className="text-[10px] text-emerald-400">Zero fraud</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={isCertModalOpen}
        onClose={() => {
          setIsCertModalOpen(false);
          setSelectedCert(null);
        }}
      />

      <VerifyCertificateModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />

    </div>
  );
};
