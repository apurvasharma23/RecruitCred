import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, Check, UserCheck, MapPin, Building2, GraduationCap, Github, Code2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser.name || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [college, setCollege] = useState(currentUser.college || 'Thapar Institute of Engineering & Technology');
  const [branch, setBranch] = useState(currentUser.branch || 'Computer Science & Engineering');
  const [gradYear, setGradYear] = useState(currentUser.gradYear || '2026');
  const [cgpa, setCgpa] = useState(currentUser.cgpa || '8.7');
  const [location, setLocation] = useState(currentUser.location || 'Patiala, Punjab, India');
  const [githubUsername, setGithubUsername] = useState(currentUser.githubUsername || 'rahulsharma-dev');
  const [leetcodeUsername, setLeetcodeUsername] = useState(currentUser.leetcodeUsername || 'rahul_codes');
  const [placementStatus, setPlacementStatus] = useState<string>(currentUser.placementStatus || 'Available for Placement');

  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || currentUser.name,
      bio: bio.trim(),
      college: college.trim(),
      branch: branch.trim(),
      gradYear,
      cgpa: cgpa.trim(),
      location: location.trim(),
      githubUsername: githubUsername.trim(),
      leetcodeUsername: leetcodeUsername.trim(),
      placementStatus: placementStatus as 'Actively Interviewing' | 'Available for Placement' | 'Offer Accepted'
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="edit-profile-title" className="text-base font-bold text-white">
                Edit Professional Profile
              </h3>
              <p className="text-xs text-slate-400">
                Update your academic records, contact info, and external evidence links.
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

        {/* Security / System Integrity Banner */}
        <div className="p-3 bg-indigo-950/40 border-b border-indigo-500/20 px-6 flex items-center gap-2.5 text-xs text-indigo-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>System-Generated Credibility Values:</strong> Scores, verified badges, and verification hashes are controlled solely by proctored assessments and cannot be modified here.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Full Name & Placement Status */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Placement Availability Status
              </label>
              <select
                value={placementStatus}
                onChange={(e) => setPlacementStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Available for Placement">Available for Placement</option>
                <option value="Actively Interviewing">Actively Interviewing</option>
                <option value="Offer Accepted">Offer Accepted</option>
              </select>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>College / University</span>
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Graduation Year</span>
              </label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
              </select>
            </div>
          </div>

          {/* Branch & CGPA */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Engineering Discipline / Branch
              </label>
              <input
                type="text"
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                CGPA / Academic Score
              </label>
              <input
                type="text"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 8.7"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Location & Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Location (City, State, Country)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Patiala, Punjab, India"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Professional Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your technical focus, research, or development goals..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* External Profiles / Evidence Links */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              External Coding & Evidence Handles
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-300" />
                  <span>GitHub Username</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-950 border border-r-0 border-slate-700 rounded-l-xl text-xs text-slate-500 font-mono">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="username"
                    className="w-full bg-slate-950 border border-slate-700 rounded-r-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>LeetCode Username</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-950 border border-r-0 border-slate-700 rounded-l-xl text-xs text-slate-500 font-mono">
                    leetcode.com/u/
                  </span>
                  <input
                    type="text"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    placeholder="username"
                    className="w-full bg-slate-950 border border-slate-700 rounded-r-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
