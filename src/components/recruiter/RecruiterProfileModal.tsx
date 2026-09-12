import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, X, Check, Globe, MapPin, Mail, Briefcase } from 'lucide-react';
import { RecruiterCompanyProfile } from '../../types';

interface RecruiterProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecruiterProfileModal: React.FC<RecruiterProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateRecruiterCompanyProfile } = useApp();

  const [companyName, setCompanyName] = useState(currentUser.companyName || 'FinTech Global Consortium');
  const [recruiterName, setRecruiterName] = useState(currentUser.name || 'Rohan Sen');
  const [designation, setDesignation] = useState(currentUser.designation || 'Lead Campus Talent Acquisition Partner');
  const [workEmail, setWorkEmail] = useState(currentUser.workEmail || currentUser.email || 'rohan.sen@fintechglobal.io');
  const [companyWebsite, setCompanyWebsite] = useState(currentUser.companyWebsite || 'https://fintechglobal.io');
  const [industry, setIndustry] = useState(currentUser.industry || 'Financial Technology & Quantitative Trading');
  const [companyLocation, setCompanyLocation] = useState(currentUser.companyLocation || 'Bengaluru, India / Singapore');
  const [companyDescription, setCompanyDescription] = useState(
    currentUser.companyDescription ||
    'Leading algorithmic trading and financial technology enterprise recruiting top verified engineering and quantitative talent across premier campuses.'
  );
  const [hiringRolesInput, setHiringRolesInput] = useState(
    (currentUser.hiringRoles && currentUser.hiringRoles.length > 0)
      ? currentUser.hiringRoles.join(', ')
      : 'Software Engineering Intern, Quantitative Analyst, Backend Systems Engineer'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedRoles = hiringRolesInput
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const profileData: Partial<RecruiterCompanyProfile> = {
      companyName,
      recruiterName,
      designation,
      workEmail,
      companyWebsite,
      industry,
      companyLocation,
      companyDescription,
      hiringRoles: parsedRoles
    };

    updateRecruiterCompanyProfile(profileData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#171A2B] border border-[#252A46] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#252A46] flex items-center justify-between bg-[#111424]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/40 flex items-center justify-center text-[#8B7CFF]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Recruiter & Company Profile</h2>
              <p className="text-xs text-[#666A7A]">Update your enterprise identity, recruitment credentials, and hiring scope.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#666A7A] hover:text-white hover:bg-[#252A46] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile details saved successfully.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recruiter Name */}
            <div>
              <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
                Recruiter Name
              </label>
              <input
                type="text"
                value={recruiterName}
                onChange={e => setRecruiterName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
                Designation / Title
              </label>
              <input
                type="text"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors"
              />
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
                Official Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#666A7A]" />
                <input
                  type="email"
                  value={workEmail}
                  onChange={e => setWorkEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors"
                />
              </div>
            </div>

            {/* Company Website */}
            <div>
              <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
                Company Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-[#666A7A]" />
                <input
                  type="url"
                  value={companyWebsite}
                  onChange={e => setCompanyWebsite(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors"
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
                Industry Domain
              </label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
              Hiring Office Location(s)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#666A7A]" />
              <input
                type="text"
                value={companyLocation}
                onChange={e => setCompanyLocation(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors"
              />
            </div>
          </div>

          {/* Hiring Roles */}
          <div>
            <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
              Target Hiring Roles (comma-separated)
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 w-4 h-4 text-[#666A7A]" />
              <input
                type="text"
                value={hiringRolesInput}
                onChange={e => setHiringRolesInput(e.target.value)}
                placeholder="e.g. Software Engineer, Backend Developer, Systems Intern"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors"
              />
            </div>
          </div>

          {/* Company Description */}
          <div>
            <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1.5">
              About Company & Hiring Mission
            </label>
            <textarea
              value={companyDescription}
              onChange={e => setCompanyDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#252A46] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#666A7A] hover:text-white bg-[#111424] hover:bg-[#252A46] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#8B7CFF] rounded-xl shadow-md shadow-[#6C63FF]/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
