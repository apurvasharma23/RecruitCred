import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Skill } from '../../types';
import { AddSkillModal } from '../skills/AddSkillModal';
import { VerifySkillModal } from '../skills/VerifySkillModal';
import { EditProfileModal } from '../dashboard/EditProfileModal';
import { ChangeProfilePictureModal } from './ChangeProfilePictureModal';
import { UserAvatar } from '../common/UserAvatar';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MapPin,
  GraduationCap,
  Award,
  Plus,
  Share2,
  Check,
  GitBranch,
  Trophy,
  Zap,
  Flame,
  Edit3,
  Camera
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, hackathons, navigateTo } = useApp();
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [selectedSkillForVerify, setSelectedSkillForVerify] = useState<Skill | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const verifiedSkills = currentUser.skills.filter(s => s.status === 'verified');
  const claimedSkills = currentUser.skills.filter(s => s.status === 'claimed');

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(`https://recruitcred.dev/u/${currentUser.username}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenVerify = (skill: Skill) => {
    setSelectedSkillForVerify(skill);
    setIsVerifyModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. CANDIDATE PROFILE HEADER (CAMPUS & PLACEMENT CONTEXT) */}
      {/* ========================================================================= */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6C63FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Profile Picture with Change Photo Camera Overlay and Click Action */}
            <div className="flex flex-col items-center shrink-0">
              <div
                onClick={() => setIsChangeAvatarOpen(true)}
                className="relative cursor-pointer group select-none"
                title="Change profile picture"
              >
                <UserAvatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="2xl"
                  className="ring-2 ring-[#6C63FF]/40 group-hover:ring-[#8B7CFF] transition-all shadow-xl"
                  showVerified={true}
                />

                {/* Hover Camera Action Overlay */}
                <div className="absolute inset-0 bg-[#0E111F]/75 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <Camera className="w-5 h-5 text-white mb-0.5" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                    Change
                  </span>
                </div>
              </div>

              {/* Explicit Clickable Text CTA */}
              <button
                type="button"
                onClick={() => setIsChangeAvatarOpen(true)}
                className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#8B7CFF] hover:text-white transition-colors cursor-pointer"
                title="Change profile picture"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change photo</span>
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentUser.name}</h1>
                <span className="text-xs font-mono text-[#666A7A]">@{currentUser.username}</span>
                <span className="badge-verified text-xs">
                  RC VERIFIED
                </span>
                {currentUser.placementStatus && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6C63FF]/15 text-[#8B7CFF] border border-[#6C63FF]/30">
                    {currentUser.placementStatus}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-[#8B7CFF] mt-1">{currentUser.role}</p>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-2 leading-relaxed">
                {currentUser.bio}
              </p>

              {/* Academic & Placement Metadata */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#666A7A]">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <GraduationCap className="w-4 h-4 text-[#8B7CFF]" />
                  {currentUser.college || currentUser.education}
                  {currentUser.gradYear && ` • Batch of ${currentUser.gradYear}`}
                </span>
                {currentUser.cgpa && (
                  <>
                    <span>•</span>
                    <span className="text-[#10B981] font-semibold">
                      CGPA: {currentUser.cgpa} / 10.0
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#666A7A]" />
                  {currentUser.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">

            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#252A46] hover:bg-[#32395C] text-white border border-[#252A46] text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#8B7CFF]" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={handleCopyProfileLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#252A46] hover:bg-[#32395C] text-slate-200 border border-[#252A46] text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#10B981]" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
            </button>

            <button
              onClick={() => setIsAddSkillOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#584DE8] text-white text-xs font-bold shadow-md shadow-[#6C63FF]/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Claim Skill</span>
            </button>
          </div>

        </div>

        {/* Connected External Evidence Sources */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#252A46]">
          
          <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <GitBranch className="w-4 h-4 text-[#8B7CFF]" />
              <div>
                <span className="text-xs font-bold text-white block">GitHub Profile</span>
                <span className="text-[10px] text-[#10B981] font-medium">Verified Repos ✓</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#666A7A]">@{currentUser.githubUsername || 'connected'}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">LeetCode Sync</span>
                <span className="text-[10px] text-[#10B981] font-medium">Connected ✓</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#10B981]">Top 5% Global</span>
          </div>

          <div className="p-3 rounded-xl bg-[#111424] border border-[#10B981]/30">
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider block">Placement Readiness</span>
            <span className="text-xl font-black text-white">{currentUser.overallScore}%</span>
          </div>

          <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46]">
            <span className="text-[10px] font-bold text-[#8B7CFF] uppercase tracking-wider block">Verified Skills</span>
            <span className="text-xl font-black text-white">{verifiedSkills.length} Verified</span>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SKILLS SHOWCASE (VERIFIED vs CLAIMED vs PENDING) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#252A46]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              Verified & Claimed Technical Competencies
            </h2>
            <p className="text-xs text-[#666A7A] mt-0.5">
              Verified skills carry standardized assessment scores, timestamped proof hashes, and code evidence.
            </p>
          </div>
          <button
            onClick={() => setIsAddSkillOpen(true)}
            className="text-xs text-[#8B7CFF] hover:text-white font-semibold transition-colors cursor-pointer"
          >
            + Claim New Skill
          </button>
        </div>

        {/* Verified Skills Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Verified Skills ({verifiedSkills.length})
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {verifiedSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-5 rounded-xl bg-[#111424] border border-[#10B981]/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="font-extrabold text-base text-white flex items-center gap-2">
                        {skill.name}
                        <span className="text-xs px-2 py-0.5 rounded bg-[#252A46] text-slate-300 font-medium">
                          {skill.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#10B981] font-semibold mt-0.5">
                        Assessment Score: <strong>{skill.score || 92}%</strong>
                      </div>
                    </div>

                    <span className="badge-verified text-xs">
                      ✓ VERIFIED
                    </span>
                  </div>

                  {/* Verification Source & Date */}
                  <div className="p-2.5 rounded-lg bg-[#171A2B] border border-[#252A46] text-xs text-slate-300 space-y-1 my-3">
                    <div className="flex justify-between">
                      <span className="text-[#666A7A]">Source:</span>
                      <span className="text-slate-200 font-semibold">{skill.verificationSource || 'RecruitCred Assessment'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666A7A]">Date Verified:</span>
                      <span className="text-[#10B981] font-medium">{skill.verifiedAt || 'Mar 8, 2026'}</span>
                    </div>
                    {skill.verificationId && (
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-[#666A7A]">Hash ID:</span>
                        <span className="text-[#10B981]">{skill.verificationId}</span>
                      </div>
                    )}
                  </div>

                  {/* Proof Sources */}
                  {skill.proofSources.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-[#252A46]">
                      {skill.proofSources.map((ps) => (
                        <div key={ps.id} className="text-xs text-slate-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[#666A7A] truncate">
                            <GitBranch className="w-3.5 h-3.5 text-[#8B7CFF] shrink-0" />
                            {ps.title}
                          </span>
                          <span className="text-[#10B981] font-medium shrink-0">{ps.metric}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#252A46] flex items-center justify-end">
                  <button
                    onClick={() => handleOpenVerify(skill)}
                    className="text-xs text-[#8B7CFF] hover:text-white font-semibold transition-colors cursor-pointer"
                  >
                    Retake / Add Proof →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claimed & Pending Skills Grid */}
        {claimedSkills.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#252A46]">
            <div className="text-xs font-bold text-[#666A7A] uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Claimed (Unverified) Skills ({claimedSkills.length})
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {claimedSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-xl bg-[#111424] border border-[#252A46] flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-200">{skill.name}</div>
                    <div className="text-xs text-[#666A7A]">{skill.category} • Claimed ○ (No Assessment Proof)</div>
                  </div>

                  <button
                    onClick={() => handleOpenVerify(skill)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6C63FF] hover:bg-[#584DE8] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    Verify Skill
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. VERIFIABLE PROJECTS SECTION */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#252A46]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#8B7CFF]" />
              Authentic Engineering Projects ({currentUser.projects.length})
            </h2>
            <p className="text-xs text-[#666A7A] mt-0.5">
              Real projects that demonstrate verified codebase architecture and implementation skills.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {currentUser.projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-xl bg-[#111424] border border-[#252A46] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-white">{proj.title}</h3>
                  {proj.stars && (
                    <span className="text-xs font-semibold text-amber-300">
                      ★ {proj.stars} stars
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#666A7A] leading-relaxed mb-4">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#252A46] text-slate-300 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#252A46] flex items-center justify-between text-xs">
                <span className="text-[#10B981] font-semibold">
                  Verified: {proj.verifiedSkills.join(', ')}
                </span>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#8B7CFF] hover:text-white flex items-center gap-1 font-semibold transition-colors"
                  >
                    View Code
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CERTIFICATIONS & ACCREDITATIONS */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-[#10B981]" />
          Verified Certifications
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {currentUser.certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl bg-[#111424] border border-[#252A46] flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-xs text-white">{cert.name}</div>
                <div className="text-[11px] text-[#666A7A]">{cert.issuer} • {cert.issueDate}</div>
                {cert.credentialId && (
                  <div className="text-[10px] font-mono text-[#10B981] mt-1">ID: {cert.credentialId}</div>
                )}
              </div>

              <span className="badge-verified text-[11px]">
                Verified ✓
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. HACKATHONS PARTICIPATED */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#171A2B] border border-[#252A46] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Hackathons & Engineering Sprints ({hackathons.length})
          </h2>
          <button
            onClick={() => navigateTo('find-teammates')}
            className="text-xs text-[#8B7CFF] hover:text-white font-semibold transition-colors cursor-pointer"
          >
            Find Teammates →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {hackathons.map((hack) => (
            <div
              key={hack.id}
              className="p-4 rounded-xl bg-[#111424] border border-[#252A46] hover:border-[#6C63FF]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate">{hack.title}</span>
                  <span className="text-[10px] text-[#10B981] font-bold">{hack.prizePool}</span>
                </div>
                <p className="text-[11px] text-[#666A7A] line-clamp-2 mt-1">{hack.tagline}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#252A46] flex items-center justify-between text-[10px] text-[#666A7A]">
                <span>{hack.startDate}</span>
                <span className="text-[#10B981] font-semibold">Active Squad</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ChangeProfilePictureModal
        isOpen={isChangeAvatarOpen}
        onClose={() => setIsChangeAvatarOpen(false)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
      />

      <VerifySkillModal
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setSelectedSkillForVerify(null);
        }}
        skill={selectedSkillForVerify}
      />

    </div>
  );
};
