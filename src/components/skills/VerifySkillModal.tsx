import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Skill, ProofSource } from '../../types';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  GitBranch,
  FolderGit2,
  Zap,
  ArrowRight
} from 'lucide-react';

interface VerifySkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
}

export const VerifySkillModal: React.FC<VerifySkillModalProps> = ({
  isOpen,
  onClose,
  skill
}) => {
  const { assessments, startAssessment, connectProofToSkill } = useApp();
  
  const [activeTab, setActiveTab] = useState<'assessment' | 'proof' | 'project'>('assessment');

  // Proof Form State
  const [proofType, setProofType] = useState<ProofSource['type']>('github');
  const [proofTitle, setProofTitle] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [proofMetric, setProofMetric] = useState('');

  // Project Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [projectRepo, setProjectRepo] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  if (!isOpen || !skill) return null;

  const matchingAssessment = assessments.find(
    a => a.skillName.toLowerCase() === skill.name.toLowerCase()
  ) || assessments[0];

  const handleStartTest = () => {
    onClose();
    startAssessment(matchingAssessment.id);
  };

  const handleConnectProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle.trim()) return;

    connectProofToSkill(skill.id, {
      type: proofType,
      title: proofTitle.trim(),
      url: proofUrl.trim() || undefined,
      metric: proofMetric.trim() || 'Verified integration (Demo)'
    });

    onClose();
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    connectProofToSkill(skill.id, {
      type: 'project',
      title: projectTitle.trim(),
      url: projectRepo.trim() || undefined,
      details: projectDesc.trim() || undefined,
      metric: 'Project Evidence Attached'
    });

    onClose();
  };

  const autofillProof = (type: ProofSource['type']) => {
    setProofType(type);
    if (type === 'github') {
      setProofTitle(`${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-production-service`);
      setProofUrl(`https://github.com/rahulsharma-dev/${skill.name.toLowerCase()}-service`);
      setProofMetric('28 stars • 14 commits • CI/CD Verified');
    } else if (type === 'leetcode') {
      setProofTitle(`LeetCode ${skill.name} Solved Problems`);
      setProofUrl(`https://leetcode.com/u/rahul_codes`);
      setProofMetric('140 Solved (Top 15% Percentile)');
    } else if (type === 'kaggle') {
      setProofTitle(`Kaggle ${skill.name} Competitions`);
      setProofUrl(`https://kaggle.com/u/rahul_dev`);
      setProofMetric('Kaggle Expert • 1 Silver Medal');
    } else if (type === 'certification') {
      setProofTitle(`Certified ${skill.name} Developer Specialization`);
      setProofUrl('https://coursera.org/verify/SP-CERT-948');
      setProofMetric('Credential ID: CRT-772910-SP');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-dropdown rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-400 p-0.5 shadow-lg shadow-emerald-600/25 shrink-0">
            <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Verify <span className="text-emerald-400">{skill.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose an evidence pathway to substantiate your skill claim.
            </p>
          </div>
        </div>

        {/* 3 Pathway Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          
          <button
            type="button"
            onClick={() => setActiveTab('assessment')}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
              activeTab === 'assessment'
                ? 'bg-indigo-600/25 border-indigo-500 text-white font-bold shadow-glow-brand'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 mb-1 text-amber-300" />
            <span className="text-xs">Take Assessment</span>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">Fastest (10m)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('proof');
              if (!proofTitle) autofillProof('github');
            }}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
              activeTab === 'proof'
                ? 'bg-indigo-600/25 border-indigo-500 text-white font-bold shadow-glow-brand'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4 mb-1 text-cyan-400" />
            <span className="text-xs">Connect Proof</span>
            <span className="text-[10px] text-slate-500 mt-0.5">GitHub / LeetCode</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('project');
              setProjectTitle(`${skill.name} Microservice App`);
              setProjectRepo(`https://github.com/rahulsharma-dev/${skill.name.toLowerCase()}-app`);
              setProjectDesc(`Production application demonstrating modular ${skill.name} architecture.`);
            }}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
              activeTab === 'project'
                ? 'bg-indigo-600/25 border-indigo-500 text-white font-bold shadow-glow-brand'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FolderGit2 className="w-4 h-4 mb-1 text-purple-400" />
            <span className="text-xs">Add Project</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Live Code Demo</span>
          </button>

        </div>

        {/* Tab 1: Take Assessment Pathway */}
        {activeTab === 'assessment' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-indigo-400" />
                  {matchingAssessment.skillName} Technical Assessment
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                  {matchingAssessment.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {matchingAssessment.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
                <div>
                  <span className="font-bold text-white block">{matchingAssessment.durationMinutes} Mins</span>
                  <span className="text-[10px] text-slate-500">Duration</span>
                </div>
                <div>
                  <span className="font-bold text-white block">{matchingAssessment.questionCount} Questions</span>
                  <span className="text-[10px] text-slate-500">MCQ + Code</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-400 block">{matchingAssessment.passingScore}%</span>
                  <span className="text-[10px] text-slate-500">Pass Score</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartTest}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              Launch {matchingAssessment.skillName} Test Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab 2: Connect Proof Pathway */}
        {activeTab === 'proof' && (
          <form onSubmit={handleConnectProofSubmit} className="space-y-4 animate-in fade-in duration-150">
            
            <div className="grid grid-cols-4 gap-2">
              {(['github', 'leetcode', 'kaggle', 'certification'] as ProofSource['type'][]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => autofillProof(t)}
                  className={`p-2 rounded-xl border text-center text-[11px] font-semibold capitalize transition-all ${
                    proofType === t
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Proof Title / Repository
              </label>
              <input
                type="text"
                required
                value={proofTitle}
                onChange={(e) => setProofTitle(e.target.value)}
                placeholder="e.g. distributed-caching-service"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Metric (Stars / Solved)
                </label>
                <input
                  type="text"
                  value={proofMetric}
                  onChange={(e) => setProofMetric(e.target.value)}
                  placeholder="e.g. 24 stars • Top 10%"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  External URL
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="text-slate-300 font-medium">⚡ Demo Verified Connector</span>
              <span className="text-emerald-400">Mock API Active</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Attach Proof & Update Skill
            </button>
          </form>
        )}

        {/* Tab 3: Add Project Evidence Pathway */}
        {activeTab === 'project' && (
          <form onSubmit={handleAddProjectSubmit} className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. MedScan Vision AI"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Repository / Live Demo Link</label>
              <input
                type="url"
                value={projectRepo}
                onChange={(e) => setProjectRepo(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Architecture Notes</label>
              <textarea
                rows={2}
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="Explain how this project validates your real proficiency..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              <FolderGit2 className="w-4 h-4" />
              Attach Project Evidence
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
