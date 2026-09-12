import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProfileView } from './components/profile/ProfileView';
import { SkillsVerificationView } from './components/skills/SkillsVerificationView';
import { AssessmentsCatalogView } from './components/assessments/AssessmentsCatalogView';
import { AssessmentRunnerView } from './components/assessments/AssessmentRunnerView';
import { AssessmentResultView } from './components/assessments/AssessmentResultView';
import { CertificatesView } from './components/certificates/CertificatesView';
import { FindTeammatesView } from './components/teams/FindTeammatesView';
import { MyTeamsView } from './components/teams/MyTeamsView';
import { TeamDetailsView } from './components/teams/TeamDetailsView';
import { InvitationsView } from './components/invitations/InvitationsView';
import { SettingsView } from './components/settings/SettingsView';
import { RecruiterDashboardView } from './components/recruiter/RecruiterDashboardView';
import { FindCandidatesView } from './components/recruiter/FindCandidatesView';
import { CollegeRecruitmentView } from './components/recruiter/CollegeRecruitmentView';
import { ShortlistedCandidatesView } from './components/recruiter/ShortlistedCandidatesView';
import { RecruitmentActivityView } from './components/recruiter/RecruitmentActivityView';
import { SignInModal } from './components/auth/SignInModal';
import { GetStartedModal } from './components/auth/GetStartedModal';
import { CredAIChatbot } from './components/chat/CredAIChatbot';

export const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    currentPage,
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal
  } = useApp();

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView />;
      case 'profile':
        return <ProfileView />;
      case 'skills':
        return <SkillsVerificationView />;
      case 'assessments':
        return <AssessmentsCatalogView />;
      case 'assessment-runner':
        return <AssessmentRunnerView />;
      case 'assessment-result':
        return <AssessmentResultView />;
      case 'certificates':
        return <CertificatesView />;
      case 'find-teammates':
        return <FindTeammatesView />;
      case 'teams':
        return <MyTeamsView />;
      case 'team-detail':
        return <TeamDetailsView />;
      case 'invitations':
        return <InvitationsView />;
      case 'settings':
        return <SettingsView />;
      
      // Recruiter Specific Views
      case 'recruiter-dashboard':
        return <RecruiterDashboardView />;
      case 'find-candidates':
        return <FindCandidatesView />;
      case 'college-recruitment':
        return <CollegeRecruitmentView />;
      case 'shortlisted-candidates':
        return <ShortlistedCandidatesView />;
      case 'recruitment-activity':
        return <RecruitmentActivityView />;

      case 'landing':
      default:
        return <LandingPage />;
    }
  };

  const isLandingView = !isAuthenticated || currentPage === 'landing';

  return (
    <div className="min-h-screen bg-[#0E111F] text-slate-100 flex flex-col selection:bg-[#6C63FF] selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenAuth={openAuthModal} />

      {/* Main Layout */}
      {isLandingView ? (
        <main className="flex-1">
          <LandingPage />
        </main>
      ) : (
        <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sidebar */}
          <Sidebar />

          {/* Active View */}
          <main className="flex-1 min-w-0 py-8 px-2 sm:px-6 lg:px-8">
            {renderActivePage()}
            <Footer />
          </main>
        </div>
      )}

      {/* Global Distinct Auth Modals */}
      <SignInModal
        isOpen={isAuthModalOpen && authModalMode === 'signin'}
        onClose={closeAuthModal}
        onSwitchToGetStarted={() => openAuthModal('signup')}
      />

      <GetStartedModal
        isOpen={isAuthModalOpen && authModalMode === 'signup'}
        onClose={closeAuthModal}
        onSwitchToSignIn={() => openAuthModal('signin')}
      />

      {/* Persistent AI Assistant CredAI */}
      <CredAIChatbot />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
