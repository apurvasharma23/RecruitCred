import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AddSkillModal } from '../skills/AddSkillModal';
import { ConnectProofModal } from '../skills/ConnectProofModal';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { CertificateModal } from '../certificates/CertificateModal';
import { DashboardCharts } from './DashboardCharts';
import {
  DASHBOARD_DEMO_DATA,
  OpportunityItem,
  SkillDevelopmentItem
} from '../../mockData/dashboardDemoData';
import { Skill, DigitalCertificate } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  TrendingUp,
  Plus,
  Briefcase,
  GitBranch,
  ArrowUpRight,
  Clock,
  Layers,
  Building2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    assessments,
    navigateTo,
    startAssessment
  } = useApp();

  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isConnectProofOpen, setIsConnectProofOpen] = useState(false);
  const [selectedSkillForProof, setSelectedSkillForProof] = useState<Skill | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<DigitalCertificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const demo = DASHBOARD_DEMO_DATA;

  const handleOpenOpportunity = (opp: OpportunityItem) => {
    setSelectedOpportunity(opp);
    setIsOpportunityModalOpen(true);
  };

  const handleSkillAction = (skill: SkillDevelopmentItem) => {
    if (skill.recommendedAction === 'Take Assessment') {
      const targetAssess = assessments.find(
        a => a.id === skill.assessmentId || a.skillName.toLowerCase() === skill.name.toLowerCase()
      ) || assessments[0];
      if (targetAssess) startAssessment(targetAssess.id);
      else navigateTo('assessments');
    } else if (skill.recommendedAction === 'View Certificate') {
      const cert = demo.certificates.find(
        c => c.skillName.toLowerCase().includes(skill.name.toLowerCase().split(' ')[0]) ||
             skill.name.toLowerCase().includes(c.skillName.toLowerCase().split(' ')[0])
      ) || demo.certificates[0];
      setSelectedCertificate(cert);
      setIsCertModalOpen(true);
    } else if (skill.recommendedAction === 'Add Evidence') {
      const userSk = currentUser.skills.find(
        s => s.name.toLowerCase().includes(skill.name.toLowerCase().split(' ')[0])
      ) || currentUser.skills[0];
      setSelectedSkillForProof(userSk);
      setIsConnectProofOpen(true);
    } else {
      navigateTo('skills');
    }
  };

  const readinessBreakdown = [
    { label: 'Profile Completion', value: 100, color: 'bg-[#10B981]' },
    { label: 'Skills Coverage', value: 85, color: 'bg-[#6C63FF]' },
    { label: 'Code Evidence', value: 75, color: 'bg-[#8B7CFF]' },
    { label: 'Proctored Assessments', value: 90, color: 'bg-[#10B981]' },
    { label: 'Identity Verification', value: 82, color: 'bg-[#6C63FF]' },
    { label: 'Verified Projects', value: 80, color: 'bg-[#8B7CFF]' }
  ];

  const recentTimeline = [
    { time: 'Today', text: 'Python Fundamentals proctored assessment completed (Score: 86%)', badge: 'Assessment', badgeColor: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' },
    { time: 'Yesterday', text: 'GitHub repository evidence linked (@fastapi-microservices)', badge: 'Evidence', badgeColor: 'bg-[#6C63FF]/10 text-[#8B7CFF] border-[#6C63FF]/30' },
    { time: 'Sep 10', text: 'CAD 3D Modeling project proof verified (FEA Stress Simulator)', badge: 'Evidence', badgeColor: 'bg-[#6C63FF]/10 text-[#8B7CFF] border-[#6C63FF]/30' },
    { time: 'Sep 8', text: 'Camera proctoring integrity and biometric liveness calibrated', badge: 'Verification', badgeColor: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#252A46]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Good morning, {currentUser.name.split(' ')[0]}
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#6C63FF]/15 text-[#8B7CFF] font-mono border border-[#6C63FF]/30">
              Verified Candidate
            </span>
          </h1>
          <p className="text-xs text-[#666A7A] mt-0.5">
            Real-time recruitment readiness, proctored benchmarks, and evidence analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('assessments')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#584DE8] text-white text-xs font-bold shadow-md shadow-[#6C63FF]/20 hover:shadow-[#6C63FF]/40 transition-all cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Take Assessment</span>
          </button>

          <button
            onClick={() => setIsAddSkillOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171A2B] hover:bg-[#252A46] text-slate-200 border border-[#252A46] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* 2. Compact KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Credibility Score */}
        <div className="p-4 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#666A7A] uppercase tracking-wider">Credibility Index</span>
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">82<span className="text-sm font-normal text-[#666A7A]">/100</span></div>
            <p className="text-[10px] text-[#666A7A] mt-0.5 leading-tight">Cryptographically validated</p>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="p-4 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#666A7A] uppercase tracking-wider">Verified Skills</span>
            <CheckCircle2 className="w-4 h-4 text-[#8B7CFF]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">7</div>
            <p className="text-[10px] text-[#666A7A] mt-0.5 leading-tight">Standardized scorecards</p>
          </div>
        </div>

        {/* Evidence Count */}
        <div className="p-4 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#666A7A] uppercase tracking-wider">Evidence Items</span>
            <GitBranch className="w-4 h-4 text-[#6C63FF]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-white">12</div>
            <p className="text-[10px] text-[#666A7A] mt-0.5 leading-tight">Repos, LeetCode & Projects</p>
          </div>
        </div>

        {/* Recruitment Readiness */}
        <div className="p-4 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#666A7A] uppercase tracking-wider">Placement Readiness</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-[#10B981]">84%</div>
            <p className="text-[10px] text-[#666A7A] mt-0.5 leading-tight">Eligible for Tier-1 Roles</p>
          </div>
        </div>

      </div>

      {/* 3. Dashboard Performance & Credibility Analytics (All 4 Interactive Charts) */}
      <DashboardCharts />

      {/* 4. Main Two-Column Structure */}
      <div className="grid lg:grid-cols-12 gap-6 pt-2">
        
        {/* LEFT COLUMN: Readiness Breakdown & Skills (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Recruitment Readiness & Credibility Progression */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#252A46]">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8B7CFF]" />
                  Recruitment Readiness Progress
                </h2>
                <p className="text-xs text-[#666A7A] mt-0.5">
                  Real-time progression through the RecruitCred verification lifecycle.
                </p>
              </div>
              <span className="text-xs font-extrabold text-[#10B981]">84% Overall</span>
            </div>

            {/* Stepped Credibility Lifecycle Indicator */}
            <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46]">
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-1.5 rounded-lg bg-[#252A46]/60 text-[#8B7CFF] font-bold border border-[#6C63FF]/30">
                  <span>1. CLAIMED ✓</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#252A46]/60 text-[#8B7CFF] font-bold border border-[#6C63FF]/30">
                  <span>2. EVIDENCE ✓</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#252A46]/60 text-[#8B7CFF] font-bold border border-[#6C63FF]/30">
                  <span>3. ASSESSED ✓</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#10B981]/15 text-[#10B981] font-black border border-[#10B981]/40">
                  <span>4. VERIFIED ★</span>
                </div>
              </div>
            </div>

            {/* Readiness Progress Bars */}
            <div className="space-y-3 pt-1">
              {readinessBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{item.label}</span>
                    <strong className="text-slate-200">{item.value}%</strong>
                  </div>
                  <div className="w-full bg-[#111424] rounded-full h-1.5 overflow-hidden border border-[#252A46]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Skill Development Table */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#252A46]">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  Verified & Assessed Competencies
                </h2>
                <p className="text-xs text-[#666A7A] mt-0.5">Top technical skills evaluated through proctored benchmarks.</p>
              </div>
              <button
                onClick={() => navigateTo('skills')}
                className="text-xs text-[#8B7CFF] hover:text-white font-semibold transition-colors cursor-pointer"
              >
                View all skills →
              </button>
            </div>

            <div className="space-y-2.5">
              {demo.skillDevelopment.slice(0, 4).map(skill => (
                <div
                  key={skill.id}
                  className="p-3.5 rounded-xl bg-[#111424] border border-[#252A46] flex items-center justify-between gap-3 hover:border-[#6C63FF]/50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate">{skill.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                        skill.currentStatus === 'Verified' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' :
                        skill.currentStatus === 'Assessed' ? 'bg-[#8B7CFF]/10 text-[#8B7CFF] border-[#8B7CFF]/30' :
                        skill.currentStatus === 'Evidence-backed' ? 'bg-[#6C63FF]/10 text-[#8B7CFF] border-[#6C63FF]/30' :
                        'bg-[#252A46] text-[#666A7A] border-[#32395C]'
                      }`}>
                        {skill.currentStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#666A7A] mt-0.5">
                      {skill.category} • {skill.assessmentScore ? `Score: ${skill.assessmentScore}%` : skill.assessmentStatus}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSkillAction(skill)}
                    className="px-3 py-1.5 rounded-lg bg-[#252A46] hover:bg-[#6C63FF] hover:text-white text-slate-200 text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                  >
                    {skill.recommendedAction}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Recommended Opportunities & Activity Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recommended Opportunities */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#252A46]">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#8B7CFF]" />
                  Recommended Opportunities
                </h2>
                <p className="text-xs text-[#666A7A] mt-0.5">Direct recruiter matches for your verified stack.</p>
              </div>
              <span className="text-[10px] font-bold text-[#8B7CFF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-full border border-[#6C63FF]/20">
                {demo.opportunities.length} Matches
              </span>
            </div>

            <div className="space-y-3">
              {demo.opportunities.slice(0, 3).map(opp => (
                <div
                  key={opp.id}
                  onClick={() => handleOpenOpportunity(opp)}
                  className="p-3.5 rounded-xl bg-[#111424] border border-[#252A46] hover:border-[#6C63FF]/50 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-white group-hover:text-[#8B7CFF] transition-colors">
                        {opp.role}
                      </h3>
                      <div className="text-[11px] text-[#666A7A] flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-[#666A7A]" />
                        <span>{opp.company}</span>
                        <span>•</span>
                        <span className="text-[#10B981] font-semibold">{opp.stipendOrSalary}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                      {opp.skillMatchPercentage}% Match
                    </span>
                  </div>

                  <p className="text-[11px] text-[#666A7A] line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#252A46] text-[#666A7A]">
                    <span>{opp.location}</span>
                    <span className="text-[#8B7CFF] font-semibold flex items-center gap-0.5">
                      View Role <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-4 shadow-sm">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#252A46]">
              <Clock className="w-4 h-4 text-[#666A7A]" />
              Recent Verification Activity
            </h2>

            <div className="space-y-3">
              {recentTimeline.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-16 font-mono text-[10px] text-[#666A7A] pt-0.5 shrink-0">
                    {act.time}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-slate-300 leading-relaxed text-[11px]">{act.text}</p>
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
      />

      <ConnectProofModal
        isOpen={isConnectProofOpen}
        onClose={() => setIsConnectProofOpen(false)}
        targetSkill={selectedSkillForProof}
      />

      {selectedOpportunity && (
        <OpportunityDetailModal
          isOpen={isOpportunityModalOpen}
          onClose={() => setIsOpportunityModalOpen(false)}
          opportunity={selectedOpportunity}
        />
      )}

      {selectedCertificate && (
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          certificate={selectedCertificate}
        />
      )}

    </div>
  );
};
