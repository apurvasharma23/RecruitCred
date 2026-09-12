import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivePage } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { 
  ShieldCheck,
  CheckCircle2, 
  Users, 
  Menu, 
  X,
  Sparkles, 
  ChevronDown,
  ChevronRight,
  Zap,
  LogOut,
  Search,
  Bell,
  ArrowRight,
  FileCode2,
  Bot,
  Briefcase,
  Building2,
  GraduationCap,
  Trophy,
  Compass,
  Layers,
  UserPlus,
  HelpCircle,
  Target,
  FileCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

type NavDropdown = 'product' | 'how-it-works' | 'opportunities' | 'teammates' | 'about' | null;

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { 
    isAuthenticated,
    currentUser, 
    logout,
    notifications, 
    unreadNotificationsCount, 
    markNotificationsAsRead,
    searchQuery,
    setSearchQuery,
    toggleSidebar,
    currentPage,
    navigateTo,
    isRecruiter
  } = useApp();

  // Scroll detection for intelligent navbar elevation
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<NavDropdown>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (dropdown: NavDropdown) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleNavClick = (sectionId: string, directPage?: ActivePage) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);

    if (directPage && isAuthenticated) {
      navigateTo(directPage);
      return;
    }

    if (currentPage !== 'landing') {
      navigateTo('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isLanding = !isAuthenticated || currentPage === 'landing';

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-2.5' 
          : 'bg-slate-950/70 backdrop-blur-md border-b border-slate-800/40 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* ========================================================================= */}
          {/* 1. BRAND LOGO & WORDMARK (Subtle hover micro-interaction) */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-3">
            {!isLanding && (
              <button
                onClick={toggleSidebar}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl lg:hidden transition-colors"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div 
              onClick={() => navigateTo(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 cursor-pointer group select-none transition-transform duration-200 hover:scale-[1.02]"
              title="RecruitCred Home"
            >
              {/* Minimalist Geometric Brand Mark */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1.5px] shadow-md shadow-indigo-600/20 group-hover:shadow-indigo-500/40 transition-all duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors" />
                  <span className="font-mono font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-300 tracking-tighter">
                    RC
                  </span>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
                </div>
              </div>

              {/* High-Typography Wordmark: Recruit + Cred with subtle badge */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white group-hover:text-slate-100 transition-colors">
                    Recruit<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400 font-extrabold">Cred</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-md">
                    CAMPUS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. CENTER NAVIGATION (LANDING DROPDOWNS & MEGA-MENUS) */}
          {/* ========================================================================= */}
          {isLanding ? (
            <nav className="hidden lg:flex items-center gap-1 relative">
              
              {/* PRODUCT DROPDOWN */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('product')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavClick('product')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeDropdown === 'product'
                      ? 'bg-slate-900 text-white shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span>Product</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'product' ? 'rotate-180 text-indigo-400' : 'text-slate-400'
                  }`} />
                </button>

                {activeDropdown === 'product' && (
                  <div className="absolute top-full left-0 mt-2 w-80 p-3 rounded-2xl bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavClick('product')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-900/90 text-left transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-indigo-600/15 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Credibility Profiles</div>
                          <div className="text-[11px] text-slate-400 leading-snug">Evidence-backed professional profiles.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('how-it-works')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-900/90 text-left transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-emerald-600/15 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Skill Verification</div>
                          <div className="text-[11px] text-slate-400 leading-snug">Turn claims into verified skills.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('how-it-works')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-900/90 text-left transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-amber-600/15 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          <FileCode2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Assessments</div>
                          <div className="text-[11px] text-slate-400 leading-snug">Validate technical capabilities.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('how-it-works')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-900/90 text-left transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-purple-600/15 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">CredAI</div>
                          <div className="text-[11px] text-slate-400 leading-snug">AI assistant for recruitment and credibility.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('how-it-works')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-900/90 text-left transition-colors group border-t border-slate-800/80 mt-1 pt-2"
                      >
                        <div className="p-2 rounded-lg bg-amber-500/15 text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-amber-300">RecruitCred Pro</div>
                          <div className="text-[10px] text-slate-400 leading-snug">Advanced visibility and insights. (Cannot buy credibility)</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* HOW IT WORKS DROPDOWN / MEGA MENU */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('how-it-works')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavClick('how-it-works')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeDropdown === 'how-it-works'
                      ? 'bg-slate-900 text-white shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span>How It Works</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'how-it-works' ? 'rotate-180 text-indigo-400' : 'text-slate-400'
                  }`} />
                </button>

                {activeDropdown === 'how-it-works' && (
                  <div className="absolute top-full left-0 mt-2 w-[460px] p-4 rounded-2xl bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* For Students Pipeline */}
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>For Students</span>
                        </div>
                        <div className="space-y-1.5 text-[11px] text-slate-300">
                          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                            <span className="w-4 h-4 rounded bg-indigo-600/30 text-indigo-300 font-mono text-[9px] flex items-center justify-center font-bold">1</span>
                            <span>Claim skills</span>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                            <span className="w-4 h-4 rounded bg-indigo-600/30 text-indigo-300 font-mono text-[9px] flex items-center justify-center font-bold">2</span>
                            <span>Add evidence</span>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                            <span className="w-4 h-4 rounded bg-indigo-600/30 text-indigo-300 font-mono text-[9px] flex items-center justify-center font-bold">3</span>
                            <span>Take assessments</span>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 font-semibold">
                            <span className="w-4 h-4 rounded bg-emerald-500 text-slate-950 font-mono text-[9px] flex items-center justify-center font-black">✓</span>
                            <span>Get verified</span>
                          </div>
                        </div>
                      </div>

                      {/* For Recruiters Pipeline */}
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>For Recruiters</span>
                        </div>
                        <div className="space-y-1.5 text-[11px] text-slate-300">
                          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                            <span className="w-4 h-4 rounded bg-slate-800 text-slate-300 font-mono text-[9px] flex items-center justify-center font-bold">1</span>
                            <span>Search skills</span>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                            <span className="w-4 h-4 rounded bg-slate-800 text-slate-300 font-mono text-[9px] flex items-center justify-center font-bold">2</span>
                            <span>Review evidence</span>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                            <span className="w-4 h-4 rounded bg-slate-800 text-slate-300 font-mono text-[9px] flex items-center justify-center font-bold">3</span>
                            <span>Compare candidates</span>
                          </div>
                          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-indigo-950/50 border border-indigo-500/40 text-indigo-300 font-semibold">
                            <span className="w-4 h-4 rounded bg-indigo-500 text-white font-mono text-[9px] flex items-center justify-center font-black">★</span>
                            <span>Recruit with confidence</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* OPPORTUNITIES DROPDOWN */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('opportunities')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavClick('opportunities')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeDropdown === 'opportunities'
                      ? 'bg-slate-900 text-white shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span>Opportunities</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'opportunities' ? 'rotate-180 text-indigo-400' : 'text-slate-400'
                  }`} />
                </button>

                {activeDropdown === 'opportunities' && (
                  <div className="absolute top-full left-0 mt-2 w-72 p-3 rounded-2xl bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="px-2 py-1 mb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Explore
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavClick('opportunities')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Companies</div>
                          <div className="text-[10px] text-slate-400">Find relevant companies.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('opportunities')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Placements</div>
                          <div className="text-[10px] text-slate-400">Explore placement opportunities.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('opportunities')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <Layers className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Internships</div>
                          <div className="text-[10px] text-slate-400">Find relevant internships.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('opportunities')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Hackathons</div>
                          <div className="text-[10px] text-slate-400">Discover relevant hackathons.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('opportunities')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors border-t border-slate-800/80 mt-1 pt-2"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="text-xs font-bold text-indigo-300">Recommended For You</div>
                          <div className="text-[10px] text-slate-400">Personalized recommendations.</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* FIND TEAMMATES DROPDOWN */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('teammates')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavClick('opportunities', 'find-teammates')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeDropdown === 'teammates'
                      ? 'bg-slate-900 text-white shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Find Teammates</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'teammates' ? 'rotate-180 text-indigo-400' : 'text-slate-400'
                  }`} />
                </button>

                {activeDropdown === 'teammates' && (
                  <div className="absolute top-full left-0 mt-2 w-72 p-3 rounded-2xl bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="p-2 mb-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-300 font-semibold leading-snug">
                      Find teammates based on skills, not just profiles.
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavClick('opportunities', 'find-teammates')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <Search className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Find Skills</div>
                          <div className="text-[10px] text-slate-400">Match verified skill requirements.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('opportunities', 'find-teammates')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Find Students</div>
                          <div className="text-[10px] text-slate-400">Discover verified campus peers.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('opportunities', 'teams')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Create Team</div>
                          <div className="text-[10px] text-slate-400">Assemble a hackathon or project squad.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('opportunities', 'teams')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors border-t border-slate-800/80 mt-1 pt-2"
                      >
                        <Compass className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="text-xs font-bold text-white">My Teams</div>
                          <div className="text-[10px] text-slate-400">Squad coverage, invitations & tests.</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ABOUT DROPDOWN */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleNavClick('problem')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeDropdown === 'about'
                      ? 'bg-slate-900 text-white shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span>About</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'about' ? 'rotate-180 text-indigo-400' : 'text-slate-400'
                  }`} />
                </button>

                {activeDropdown === 'about' && (
                  <div className="absolute top-full right-0 mt-2 w-80 p-3 rounded-2xl bg-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="p-2 mb-2 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-xs font-bold text-white">Why RecruitCred?</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Campus recruitment with transparent credibility.</div>
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavClick('problem')}
                        className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-rose-400 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-white">The Problem</div>
                          <div className="text-[10px] text-slate-400">Unverified resumes & exaggerated skill claims.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('problem')}
                        className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <Target className="w-4 h-4 text-indigo-400 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-white">Our Approach</div>
                          <div className="text-[10px] text-slate-400">Continuous evidence verification + timed challenges.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('problem')}
                        className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors"
                      >
                        <FileCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-white">Evidence-Based Credibility</div>
                          <div className="text-[10px] text-slate-400">Connecting code repos and verifiable proofs.</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('problem')}
                        className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-slate-900 text-left transition-colors border-t border-slate-800/80 mt-1 pt-2"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-amber-300">Our Vision</div>
                          <div className="text-[10px] text-slate-400">The transparent recruitment standard for India.</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </nav>
          ) : (
            /* In-App Universal Search */
            <div className="hidden sm:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search verified skills, assessments, candidates, or drives..."
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. RIGHT ACTION BUTTONS (SIGN IN & GET STARTED OR IN-APP TOOLS) */}
          {/* ========================================================================= */}
          <div className="flex items-center gap-3">
            {isLanding ? (
              <div className="hidden sm:flex items-center gap-2.5">
                {/* Secondary Sign In Button */}
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('signin') : navigateTo('dashboard')}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Sign In
                </button>

                {/* Primary Filled Get Started CTA with Arrow Interaction */}
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('signup') : navigateTo('dashboard')}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-md shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all duration-200 group cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            ) : (
              /* Authenticated In-App Header Actions */
              <>
                {/* Notifications Center */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) markNotificationsAsRead();
                    }}
                    className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0B0F17] animate-pulse" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-dropdown rounded-2xl p-3 z-50 shadow-2xl animate-in fade-in duration-150">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Notifications</span>
                        <span className="text-[11px] text-slate-400">{notifications.length} Total</span>
                      </div>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 transition-colors"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                                {notif.type === 'challenge' ? (
                                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                                ) : notif.type === 'invitation' ? (
                                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-semibold text-slate-200">{notif.title}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                                <span className="text-[10px] text-slate-500 mt-1 block">{notif.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar & Profile Link */}
                <div 
                  onClick={() => navigateTo(isRecruiter ? 'recruiter-dashboard' : 'profile')}
                  className="flex items-center gap-2.5 pl-2 cursor-pointer group"
                  title={isRecruiter ? 'Recruiter Dashboard' : 'Go to Profile'}
                >
                  <UserAvatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                    size="md"
                    className="ring-2 ring-[#6C63FF]/40 group-hover:ring-[#8B7CFF] transition-all"
                    showOnline={true}
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-[#8B7CFF] transition-colors leading-tight">
                      {currentUser.name}
                    </span>
                    {isRecruiter ? (
                      <span className="text-[10px] text-[#8B7CFF] font-semibold truncate max-w-[140px]">
                        {currentUser.companyName || 'Recruiter'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {currentUser.skills.filter(s => s.status === 'verified').length} Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Mobile Hamburger Button */}
            {isLanding && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl lg:hidden transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE SLIDE-DOWN ACCORDION DRAWER MENU */}
        {/* ========================================================================= */}
        {isLanding && isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-4 pb-6 border-t border-slate-800/80 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1 text-sm font-semibold">
              <button
                onClick={() => handleNavClick('product')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 text-left text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Product</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => handleNavClick('how-it-works')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 text-left text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>How It Works</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => handleNavClick('opportunities')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 text-left text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span>Opportunities</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => handleNavClick('opportunities', 'find-teammates')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 text-left text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Find Teammates</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => handleNavClick('problem')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 text-left text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>About</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth ? onOpenAuth('signin') : navigateTo('dashboard');
                }}
                className="w-full py-3 rounded-xl bg-slate-900 text-slate-200 font-bold text-xs border border-slate-700 text-center"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth ? onOpenAuth('signup') : navigateTo('dashboard');
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 text-center"
              >
                Get Started →
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
