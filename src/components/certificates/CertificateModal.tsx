import React, { useRef, useState } from 'react';
import { DigitalCertificate } from '../../types';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  Check,
  Copy,
  Award,
  Calendar,
  FileCheck
} from 'lucide-react';

interface CertificateModalProps {
  certificate: DigitalCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !certificate) return null;

  const verificationUrl = certificate.verificationUrl || `https://recruitcred.dev/verify/${certificate.certificateId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Open print dialog with media print styling
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Official Digital Credential</h2>
              <p className="text-[11px] text-slate-400 font-mono">ID: {certificate.certificateId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Copy verification link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Proof'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
              title="Download or Print PDF Certificate"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-6 sm:p-10 bg-slate-950 flex items-center justify-center">
          
          <div
            ref={certRef}
            className="w-full max-w-2xl bg-[#0B0F19] text-slate-100 rounded-2xl p-8 sm:p-12 border-2 border-indigo-500/40 relative shadow-2xl overflow-hidden print:m-0 print:border-none print:shadow-none"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 50% 10%, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0) 70%)'
            }}
          >
            {/* Subtle Guilloche / Border Accents */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-indigo-500/20 rounded-xl pointer-events-none" />
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-slate-800 rounded-lg pointer-events-none" />

            {/* Corner Decorative Marks */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />

            {/* Header / Brand */}
            <div className="text-center space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-bold tracking-widest text-indigo-300 uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Digital Credential
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-white pt-2">
                RECRUITCRED
              </h1>
              <div className="text-xs sm:text-sm font-semibold tracking-widest text-indigo-400 uppercase">
                CERTIFICATE OF ASSESSMENT
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center my-8 space-y-4 relative z-10">
              <p className="text-xs text-slate-400 font-serif italic">
                This certifies that
              </p>

              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight border-b-2 border-slate-700/60 pb-3 max-w-md mx-auto">
                {certificate.candidateName}
              </div>

              <p className="text-xs text-slate-400 font-serif italic pt-1">
                has successfully completed the
              </p>

              <div className="text-lg sm:text-xl font-bold text-indigo-300">
                {certificate.assessmentName}
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
                <Award className="w-4 h-4 text-emerald-400" />
                Score Achieved: {certificate.score}%
              </div>
            </div>

            {/* Certificate Footer Details */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left relative z-10">
              
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Issue Date
                </div>
                <div className="text-xs font-bold text-slate-200 mt-0.5">
                  {certificate.issueDate}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-slate-400" />
                  Credential ID
                </div>
                <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                  {certificate.certificateId}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 text-left sm:text-right">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Status & Authority
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center sm:justify-end gap-1">
                  <span>✓ {certificate.status}</span>
                  <span className="text-slate-400 font-normal">({certificate.issuer})</span>
                </div>
              </div>

            </div>

            {/* Verification Link watermark */}
            <div className="mt-6 pt-3 border-t border-slate-900 text-center text-[10px] text-slate-500 font-mono">
              Verify authentic status at: {verificationUrl}
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-center sm:text-left">
            Certificates are dynamically bound to candidate verification records and cannot be altered.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
