import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Bell,
  Palette,
  HelpCircle,
  FileText,
  AlertTriangle,
  Lock,
  Camera,
  Mic,
  Eye,
  CheckCircle2,
  Key,
  Globe,
  Trash2,
  ChevronRight,
  Laptop,
  X,
  RotateCcw
} from 'lucide-react';

type SettingsTab =
  | 'account'
  | 'assessment-privacy'
  | 'notifications'
  | 'appearance'
  | 'support'
  | 'legal'
  | 'danger';

export const SettingsView: React.FC = () => {
  const { currentUser, resetAllData, logout, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Notification toggles
  const [notifAssessments, setNotifAssessments] = useState(true);
  const [notifOpportunities, setNotifOpportunities] = useState(true);
  const [notifRecruiters, setNotifRecruiters] = useState(true);
  const [notifVerification, setNotifVerification] = useState(true);
  const [notifHackathons, setNotifHackathons] = useState(true);
  const [notifEmailDigests, setNotifEmailDigests] = useState(false);

  // Privacy toggles
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [allowRecruiterDirectMessage, setAllowRecruiterDirectMessage] = useState(true);
  const [anonymizeAcademicRecords, setAnonymizeAcademicRecords] = useState(false);

  // Appearance
  const [selectedTheme, setSelectedTheme] = useState<'system' | 'dark' | 'light'>('dark');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Change Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Delete Account Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Support / Report Modal
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordError(null);
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully.');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toUpperCase() !== 'DELETE') return;
    setIsDeleteModalOpen(false);
    resetAllData();
    logout();
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsSupportModalOpen(false);
    setSupportMessage('');
    showToast('Your message has been submitted to RecruitCred Support.');
  };

  const navTabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'account', label: 'Account & Security', icon: User },
    { id: 'assessment-privacy', label: 'Assessment & Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
    { id: 'legal', label: 'Legal & Compliance', icon: FileText },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 p-3.5 rounded-2xl bg-emerald-950/95 border border-emerald-500/50 shadow-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your account credentials, proctoring preferences, notification delivery, and privacy controls.
        </p>
      </div>

      {/* Main Settings Layout (Sidebar Tabs + Content Area) */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar Tabs (Left 4 cols) */}
        <div className="md:col-span-4 space-y-1">
          <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-1">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === 'danger';

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? isDanger
                        ? 'bg-rose-950/40 text-rose-300 border border-rose-500/40'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                      : isDanger
                      ? 'text-rose-400 hover:bg-rose-950/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-indigo-400 rotate-90' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Profile Navigation Callout */}
          <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Looking to edit your bio or links?
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Profile details such as your bio, education, GitHub, and LeetCode handles are managed directly on your Profile page.
            </p>
            <button
              onClick={() => navigateTo('profile')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              Go to Profile & Edit Details →
            </button>
          </div>
        </div>

        {/* Content Area (Right 8 cols) */}
        <div className="md:col-span-8">
          
          {/* TAB 1: ACCOUNT & SECURITY */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              
              {/* Account Information Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  Account Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[11px]">Full Name</span>
                    <strong className="text-white text-sm">{currentUser.name}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[11px]">RecruitCred ID</span>
                    <strong className="text-indigo-300 text-sm font-mono">{currentUser.username}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[11px]">Primary Email</span>
                    <strong className="text-white text-sm">agastya.sharma@thapar.edu</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[11px]">Account Role</span>
                    <strong className="text-emerald-400 text-sm font-semibold">Verified Candidate</strong>
                  </div>
                </div>
              </div>

              {/* Login & Security Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  Login & Security
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Password Authentication</div>
                      <div className="text-slate-400 text-[11px]">Last changed 3 weeks ago</div>
                    </div>
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Two-Factor Authentication (2FA)</div>
                      <div className="text-slate-400 text-[11px]">Secure verification via authenticator app</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                      Enabled ✓
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Sessions Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-400" />
                    Active Login Sessions
                  </h2>
                  <button
                    onClick={() => showToast('Signed out of all other active sessions.')}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    Sign Out Other Devices
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>Chrome on macOS (Apple Silicon)</span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">This Device</span>
                        </div>
                        <div className="text-slate-500 text-[11px]">Patiala, Punjab, India • Active now</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ASSESSMENT & PRIVACY */}
          {activeTab === 'assessment-privacy' && (
            <div className="space-y-6">
              
              {/* Camera & Sensor Diagnostics */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-400" />
                  Assessment Camera & Sensor Permissions
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Proctored assessments require webcam verification to confirm candidate identity, liveness, and test integrity.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-white block">Camera Access</span>
                        <span className="text-[10px] text-emerald-400 font-medium">Permission Granted ✓</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold">Active</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mic className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-bold text-white block">Microphone Access</span>
                        <span className="text-[10px] text-slate-400 font-medium">Standard / Standby</span>
                      </div>
                    </div>
                    <span className="text-slate-400 font-medium">Ready</span>
                  </div>
                </div>
              </div>

              {/* Assessment Proctoring Preferences */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  Assessment Monitoring Preferences
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Liveness & Attention Telemetry</div>
                      <div className="text-slate-400 text-[11px]">Real-time gaze and multi-stage blink tracking during test runs</div>
                    </div>
                    <span className="text-emerald-400 font-bold">Enabled</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Full-Screen Session Lock</div>
                      <div className="text-slate-400 text-[11px]">Notify and pause assessment if candidate exits fullscreen mode</div>
                    </div>
                    <span className="text-emerald-400 font-bold">Enforced</span>
                  </div>
                </div>
              </div>

              {/* Privacy & Visibility */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  Recruiter Privacy & Visibility
                </h2>

                <div className="space-y-3 text-xs">
                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Public Credibility Profile</div>
                      <div className="text-slate-400 text-[11px]">Allow verified campus recruiters to discover your verified skill credentials</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isPublicProfile}
                      onChange={(e) => {
                        setIsPublicProfile(e.target.checked);
                        showToast(`Public profile visibility ${e.target.checked ? 'enabled' : 'disabled'}.`);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Direct Recruiter Outreach</div>
                      <div className="text-slate-400 text-[11px]">Allow hiring partners to send placement opportunities and interview invites</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowRecruiterDirectMessage}
                      onChange={(e) => {
                        setAllowRecruiterDirectMessage(e.target.checked);
                        showToast(`Recruiter direct outreach ${e.target.checked ? 'enabled' : 'disabled'}.`);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Anonymize Contact in Blind Screening</div>
                      <div className="text-slate-400 text-[11px]">Mask personal contact info until formal recruiter match confirmation</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={anonymizeAcademicRecords}
                      onChange={(e) => {
                        setAnonymizeAcademicRecords(e.target.checked);
                        showToast(`Blind screening mode ${e.target.checked ? 'enabled' : 'disabled'}.`);
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  Notification Preferences
                </h2>
                <p className="text-xs text-slate-400">
                  Select which platform alerts, invitations, and milestone updates you wish to receive.
                </p>

                <div className="space-y-3 text-xs">
                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Assessment Reminders</div>
                      <div className="text-slate-400 text-[11px]">Scheduled skill certification and proctored test windows</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifAssessments}
                      onChange={(e) => setNotifAssessments(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Opportunity Recommendations</div>
                      <div className="text-slate-400 text-[11px]">Roles matching your verified technical stack and graduation year</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifOpportunities}
                      onChange={(e) => setNotifOpportunities(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Recruiter Activity Alerts</div>
                      <div className="text-slate-400 text-[11px]">Notifications when companies view your verified profile or credentials</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifRecruiters}
                      onChange={(e) => setNotifRecruiters(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Verification Updates</div>
                      <div className="text-slate-400 text-[11px]">Grading completions, digital badge issuance, and hash proofs</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifVerification}
                      onChange={(e) => setNotifVerification(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Hackathon & Team Invitations</div>
                      <div className="text-slate-400 text-[11px]">Teammate invitations and peer squad match requests</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifHackathons}
                      onChange={(e) => setNotifHackathons(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-bold text-white">Weekly Career Digest</div>
                      <div className="text-slate-400 text-[11px]">Consolidated summary of new roles and benchmark performance</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifEmailDigests}
                      onChange={(e) => setNotifEmailDigests(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showToast('Notification settings saved.')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save Notification Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-400" />
                  Interface Theme & Density
                </h2>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-2">Theme Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['system', 'dark', 'light'] as const).map(theme => (
                        <button
                          key={theme}
                          onClick={() => {
                            setSelectedTheme(theme);
                            showToast(`Theme set to ${theme}.`);
                          }}
                          className={`p-3 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                            selectedTheme === theme
                              ? 'bg-indigo-600/20 text-white border-indigo-500 ring-1 ring-indigo-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <label className="block text-slate-300 font-bold mb-2">Display Density</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['comfortable', 'compact'] as const).map(d => (
                        <button
                          key={d}
                          onClick={() => {
                            setDensity(d);
                            showToast(`Display density set to ${d}.`);
                          }}
                          className={`p-3 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                            density === d
                              ? 'bg-indigo-600/20 text-white border-indigo-500 ring-1 ring-indigo-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HELP & SUPPORT */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Help, Support & FAQs
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-white">How does RecruitCred verify coding skills?</div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">
                      Skills are verified through timed proctored coding assessments with AI-assisted webcam monitoring, combined with synchronized GitHub commits and LeetCode ratings.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-white">Can recruiters see my webcam recording?</div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">
                      No. Video processing runs locally on your client machine to compute integrity signals. Recruiters only see verified assessment scorecards and skill badges.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-white">How do I share my certificate?</div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">
                      Navigate to Certificates from the sidebar to copy your public verification link or download your verified digital certificate PDF.
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Contact Support / Report Issue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LEGAL & COMPLIANCE */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Legal, Privacy & Terms
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Privacy Policy</div>
                      <div className="text-slate-400 text-[11px]">How we protect your biometric telemetry and academic records</div>
                    </div>
                    <span className="text-indigo-400 text-xs font-semibold">Version 2.4</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Candidate Terms of Service</div>
                      <div className="text-slate-400 text-[11px]">Assessment integrity agreements and credential licensing</div>
                    </div>
                    <span className="text-indigo-400 text-xs font-semibold">Accepted ✓</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DANGER ZONE */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              
              {/* Danger Zone Container */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-rose-500/40 space-y-4">
                <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Danger Zone
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Actions in this area affect your authentication session and saved verification records. Proceed with caution.
                </p>

                <div className="space-y-3 text-xs">
                  
                  {/* Sign Out Action */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Sign Out of RecruitCred</div>
                      <div className="text-slate-400 text-[11px]">End your active session securely</div>
                    </div>
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>

                  {/* Reset Demo Data (Pitch Tool) */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-amber-300">Reset Demo Data</div>
                      <div className="text-slate-400 text-[11px]">Reset all candidate skills and challenge states back to initial baseline</div>
                    </div>
                    <button
                      onClick={() => {
                        resetAllData();
                        showToast('Demo data reset to clean seed state.');
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Demo
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-rose-300">Permanently Delete Account</div>
                      <div className="text-slate-400 text-[11px]">Irreversibly delete your profile, assessments, and verified credentials</div>
                    </div>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0B0F17] rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 w-fit border border-indigo-500/30">
              <Key className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white">Change Account Password</h3>

            {passwordError && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0B0F17] rounded-3xl p-6 border border-rose-500/40 shadow-2xl space-y-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 w-fit border border-rose-500/30">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white">Permanently Delete Account?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action is permanent and cannot be undone. All verified skills, certificates, and proctored assessment logs will be deleted.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-400">
                To confirm deletion, please type <strong className="text-rose-400 font-mono">DELETE</strong> below:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText.toUpperCase() !== 'DELETE'}
                onClick={handleDeleteAccount}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                  deleteConfirmText.toUpperCase() === 'DELETE'
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 cursor-pointer'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Message Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0B0F17] rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 w-fit border border-indigo-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white">Contact RecruitCred Support</h3>
            <p className="text-xs text-slate-400">
              Have questions about assessment proctoring, skill verification, or account settings?
            </p>

            <form onSubmit={handleSupportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Your Message or Issue Description</label>
                <textarea
                  rows={4}
                  required
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
