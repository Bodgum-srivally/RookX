import React, { useState, useEffect } from 'react';
import './App.css';

// Importing custom components
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';
import Assessment from './components/Assessment';
import DecisionEngine from './components/DecisionEngine';
import RealityCheck from './components/RealityCheck';
import Simulator from './components/Simulator';
import SkillGaps from './components/SkillGaps';
import EducationPathway from './components/EducationPathway';
import Roadmap from './components/Roadmap';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ParentMode from './components/ParentMode';
import AIAssistant from './components/AIAssistant';
import AccountModal from './components/AccountModal';
import AuthModal from './components/AuthModal';
import { saveUserToDB, getUserFromDB, getAllUsersFromDB, saveSessionToDB } from './services/dbService';

// Lucide Icons
import { 
  Home, Activity, Compass, Layers, BarChart3, 
  Target, GraduationCap, Calendar, FileText, Users, Sparkles, RefreshCw,
  Sun, Moon, UserCheck, Lock, LogIn
} from 'lucide-react';

export default function App() {
  // Theme state: default dark mode, persist in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('rookx_theme') || 'dark');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Users Database in localStorage
  const [usersDb, setUsersDb] = useState(() => {
    const saved = localStorage.getItem('rookx_users_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  // Active Session in localStorage
  const [activeSession, setActiveSession] = useState(() => {
    const saved = localStorage.getItem('rookx_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { isAuthenticated: false, email: '' };
  });

  // Target active goal career
  const [targetCareerId, setTargetCareerId] = useState('software_engineer');

  // Load active user profile data
  const [profileData, setProfileData] = useState(() => {
    if (activeSession.isAuthenticated && activeSession.email && usersDb[activeSession.email]) {
      return usersDb[activeSession.email].profileData;
    }
    const saved = localStorage.getItem('rookx_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      fullName: '',
      email: '',
      isOnboarded: false,
      academic: { qualification: '2nd Year College', stream: 'Computer Science', gpa: '8.0' },
      skills: { coding: 55, sql: 40, mathematics: 45, design_principles: 30, communication: 50, business_strategy: 35 },
      interests: ['tech', 'data'],
      preferences: { workStyle: 3, solvingStyle: 2, studyTime: '2-3 Hours' },
      constraints: { location: 'Local', budget: '3-5 Lakhs/Yr', collegeType: 'Government' }
    };
  });

  // Load active user assessment scores
  const [assessmentScores, setAssessmentScores] = useState(() => {
    if (activeSession.isAuthenticated && activeSession.email && usersDb[activeSession.email]) {
      return usersDb[activeSession.email].assessmentScores;
    }
    const saved = localStorage.getItem('rookx_assessment_scores');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      skills: { aptitude: 65, coding: 60, sql: 45, mathematics: 50, communication: 70 },
      interests: { software_engineer: 80, data_scientist: 60, cybersecurity_analyst: 40, ui_ux_designer: 30 }
    };
  });

  // Default initial view to 'home'
  const [activeTab, setActiveTab] = useState('home');

  // Theme Syncing
  useEffect(() => {
    localStorage.setItem('rookx_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-mode');
    }
  }, [theme]);

  // Asynchronously sync database from IndexedDB on startup
  useEffect(() => {
    async function initDB() {
      const dbUsers = await getAllUsersFromDB();
      if (dbUsers && Object.keys(dbUsers).length > 0) {
        setUsersDb(prev => ({ ...prev, ...dbUsers }));
      }
    }
    initDB();
  }, []);

  // Sync profile & assessment data to user database whenever modified
  const syncActiveUserData = async (newProfile, newAssessment) => {
    if (activeSession.isAuthenticated && activeSession.email) {
      const email = activeSession.email;
      const updatedUser = {
        ...usersDb[email],
        email,
        profileData: newProfile || profileData,
        assessmentScores: newAssessment || assessmentScores
      };
      const updatedDb = { ...usersDb, [email]: updatedUser };
      setUsersDb(updatedDb);

      // Save to IndexedDB persistent database & localStorage mirror
      await saveUserToDB(updatedUser);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Auth Handler: Login
  const handleLogin = async (email, password) => {
    let user = usersDb[email];
    if (!user) {
      user = await getUserFromDB(email);
    }
    if (!user || user.password !== password) {
      return false;
    }
    const session = { email, isAuthenticated: true };
    setActiveSession(session);
    await saveSessionToDB(session);

    if (user.profileData) setProfileData(user.profileData);
    if (user.assessmentScores) setAssessmentScores(user.assessmentScores);

    setShowAuthModal(false);
    setActiveTab('dashboard');
    return true;
  };

  // Auth Handler: Register
  const handleRegister = async (regData) => {
    let existing = usersDb[regData.email] || (await getUserFromDB(regData.email));
    if (existing) {
      return false;
    }

    const newProfile = {
      fullName: regData.fullName,
      email: regData.email,
      isOnboarded: true,
      academic: regData.academic || { qualification: '2nd Year College', stream: 'Computer Science', gpa: '8.0' },
      skills: { coding: 55, sql: 40, mathematics: 45, design_principles: 30, communication: 50, business_strategy: 35 },
      interests: ['tech', 'data'],
      preferences: { workStyle: 3, solvingStyle: 2, studyTime: '2-3 Hours' },
      constraints: { location: 'Local', budget: '3-5 Lakhs/Yr', collegeType: 'Government' }
    };

    const initialAssessment = {
      skills: { aptitude: 65, coding: 60, sql: 45, mathematics: 50, communication: 70 },
      interests: { software_engineer: 80, data_scientist: 60, cybersecurity_analyst: 40, ui_ux_designer: 30 }
    };

    const newUserRecord = {
      email: regData.email,
      password: regData.password,
      profileData: newProfile,
      assessmentScores: initialAssessment
    };

    const updatedDb = {
      ...usersDb,
      [regData.email]: newUserRecord
    };

    setUsersDb(updatedDb);
    await saveUserToDB(newUserRecord);

    const session = { email: regData.email, isAuthenticated: true };
    setActiveSession(session);
    await saveSessionToDB(session);

    setProfileData(newProfile);
    setAssessmentScores(initialAssessment);
    setShowAuthModal(false);
    setActiveTab('assessment');
    return true;
  };

  // Auth Handler: Logout
  const handleLogout = () => {
    setActiveSession({ isAuthenticated: false, email: '' });
    localStorage.removeItem('rookx_session');
    setActiveTab('home');
  };

  // Auth Handler: Change Password
  const handleChangePassword = (currentPass, newPass) => {
    if (!activeSession.email || !usersDb[activeSession.email]) return false;
    const user = usersDb[activeSession.email];
    if (user.password !== currentPass) return false;

    const updatedUser = { ...user, password: newPass };
    const updatedDb = { ...usersDb, [activeSession.email]: updatedUser };
    setUsersDb(updatedDb);
    localStorage.setItem('rookx_users_db', JSON.stringify(updatedDb));
    return true;
  };

  const handleProfileSave = (updatedData) => {
    const newProfile = {
      ...updatedData,
      isOnboarded: true
    };
    setProfileData(newProfile);
    syncActiveUserData(newProfile, null);
    setActiveTab('dashboard');
  };

  const handleUpdateSkillsFromRoadmap = (improvedSkills) => {
    const updatedProfile = {
      ...profileData,
      skills: {
        ...profileData.skills,
        coding: Math.max(profileData.skills?.coding || 50, improvedSkills.coding || 50),
        sql: Math.max(profileData.skills?.sql || 40, improvedSkills.sql || 40)
      }
    };
    const updatedAssessment = {
      ...assessmentScores,
      skills: {
        ...assessmentScores.skills,
        coding: Math.max(assessmentScores.skills?.coding || 50, improvedSkills.coding || 50),
        aptitude: Math.max(assessmentScores.skills?.aptitude || 50, improvedSkills.aptitude || 50),
        sql: Math.max(assessmentScores.skills?.sql || 40, improvedSkills.sql || 40)
      }
    };

    setProfileData(updatedProfile);
    setAssessmentScores(updatedAssessment);
    syncActiveUserData(updatedProfile, updatedAssessment);
  };

  const handleAssessmentComplete = (skills, interests) => {
    const newScores = { skills, interests };
    setAssessmentScores(newScores);
    syncActiveUserData(null, newScores);
    setActiveTab('dashboard');
  };

  const handleSelectTargetCareer = (careerId) => {
    setTargetCareerId(careerId);
  };

  // Protected Tab Navigation Helper
  const navigateTab = (tabName) => {
    if (!activeSession.isAuthenticated && tabName !== 'home') {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tabName);
  };

  // Active view renderer
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onStartDiscovery={() => {
              if (activeSession.isAuthenticated) {
                setActiveTab('assessment');
              } else {
                setAuthModalMode('register');
                setShowAuthModal(true);
              }
            }}
            onTryDemo={() => {
              const demoProfile = {
                fullName: 'Demo Student',
                email: 'demo@rookx.edu',
                isOnboarded: true,
                academic: { qualification: '3rd Year College', stream: 'Computer Science', gpa: '8.4 CGPA' },
                skills: { coding: 75, sql: 65, mathematics: 70, design_principles: 45, communication: 80, business_strategy: 60 },
                interests: ['tech', 'data'],
                preferences: { workStyle: 4, solvingStyle: 2, studyTime: '3-4 Hours' },
                constraints: { location: 'Local', budget: '3-5 Lakhs/Yr', collegeType: 'Government' }
              };
              const demoAssessment = {
                skills: { aptitude: 82, coding: 78, sql: 68, mathematics: 75, communication: 80 },
                interests: { software_engineer: 88, data_scientist: 72, cybersecurity_analyst: 55, ui_ux_designer: 40 }
              };

              const session = { email: 'demo@rookx.edu', isAuthenticated: true };
              setActiveSession(session);
              localStorage.setItem('rookx_session', JSON.stringify(session));

              setProfileData(demoProfile);
              setAssessmentScores(demoAssessment);
              setActiveTab('dashboard');
            }}
            onExploreLandscape={() => {
              if (activeSession.isAuthenticated) {
                setActiveTab('decision');
              } else {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }
            }}
            onStart={() => {
              if (activeSession.isAuthenticated) {
                setActiveTab('assessment');
              } else {
                setAuthModalMode('register');
                setShowAuthModal(true);
              }
            }} 
            setTab={navigateTab}
            onSelectTarget={handleSelectTargetCareer}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            profile={profileData} 
            assessment={assessmentScores}
            targetCareerId={targetCareerId}
            setTab={navigateTab}
            onSelectTarget={handleSelectTargetCareer}
          />
        );
      case 'onboarding':
      case 'profile':
        return (
          <ProfileForm 
            profileData={profileData} 
            onSave={handleProfileSave} 
            isOnboarding={!profileData.isOnboarded || activeTab === 'onboarding'} 
          />
        );
      case 'assessment':
        return (
          <Assessment 
            onComplete={handleAssessmentComplete}
            targetCareerId={targetCareerId}
          />
        );
      case 'decision':
        return (
          <DecisionEngine 
            profile={profileData} 
            assessment={assessmentScores}
            targetCareerId={targetCareerId}
            onSelectTarget={handleSelectTargetCareer}
            setTab={navigateTab}
          />
        );
      case 'reality':
        return (
          <RealityCheck 
            profile={profileData} 
            assessment={assessmentScores} 
            targetCareerId={targetCareerId}
          />
        );
      case 'simulator':
        return (
          <Simulator 
            profile={profileData} 
            assessment={assessmentScores} 
          />
        );
      case 'gaps':
        return (
          <SkillGaps 
            profile={profileData} 
            assessment={assessmentScores} 
            targetCareerId={targetCareerId}
          />
        );
      case 'education':
        return (
          <EducationPathway 
            profile={profileData} 
            targetCareerId={targetCareerId}
          />
        );
      case 'roadmap':
        return (
          <Roadmap 
            profile={profileData} 
            assessment={assessmentScores} 
            targetCareerId={targetCareerId}
            setTab={navigateTab}
            onUpdateSkills={handleUpdateSkillsFromRoadmap}
          />
        );
      case 'resume':
        return (
          <ResumeAnalyzer 
            targetCareerId={targetCareerId} 
          />
        );
      case 'parent':
        return (
          <ParentMode 
            profile={profileData} 
            assessment={assessmentScores} 
            targetCareerId={targetCareerId}
          />
        );
      default:
        return <div className="text-center font-mono py-8">Section Offline</div>;
    }
  };

  const userDisplayName = activeSession.isAuthenticated && profileData.fullName 
    ? profileData.fullName.split(' ')[0] 
    : 'Sign In';

  // Navigation Items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Overview Hub', icon: Activity },
    { id: 'assessment', label: 'Career Fit Test', icon: Compass },
    { id: 'decision', label: 'Compare Careers', icon: Layers },
    { id: 'reality', label: 'Reality Check', icon: BarChart3 },
    { id: 'simulator', label: 'What-If Simulator', icon: Sparkles },
    { id: 'gaps', label: 'Skills to Learn', icon: Target },
    { id: 'roadmap', label: '4-Week Action Plan', icon: Calendar },
    { id: 'education', label: 'Colleges & Exams', icon: GraduationCap },
    { id: 'resume', label: 'Resume Checker', icon: FileText },
    { id: 'parent', label: 'Parent Report', icon: Users },
  ];

  return (
    <div className={`min-h-screen flex flex-col cyber-bg ${theme === 'dark' ? 'dark text-slate-200' : 'light-mode text-slate-900'}`}>
      
      {/* Header Bar */}
      <header className="border-b border-cyber-border bg-cyber-dark/95 backdrop-blur-md sticky top-0 z-30 font-mono">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded border border-cyber-neonPurple flex items-center justify-center font-extrabold text-white text-base shadow-[0_0_10px_rgba(168,85,247,0.3)] animate-pulse group-hover:scale-105 transition-all">
              RX
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-wider m-0 leading-none group-hover:text-cyber-neonPurple transition-colors">RookX</h1>
              <span className="text-[9px] text-cyber-neonPurple block uppercase tracking-widest mt-0.5">Career Decision Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyber-border bg-cyber-dark/40 text-xs font-bold text-white hover:border-cyber-neonPurple transition-all"
              title="Toggle Dark / Light Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Moon size={13} className="text-cyber-neonPurple" />
                  <span className="hidden sm:inline">🌙 Dark</span>
                </>
              ) : (
                <>
                  <Sun size={13} className="text-amber-500" />
                  <span className="hidden sm:inline">☀️ Light</span>
                </>
              )}
            </button>

            {/* SEPARATE ACCOUNT / SIGN IN BUTTON */}
            {activeSession.isAuthenticated ? (
              <button 
                onClick={() => setShowAccountModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyber-neonPurple/50 bg-cyber-neonPurple/15 text-white hover:bg-cyber-neonPurple/25 transition-all font-bold"
              >
                <UserCheck size={15} className="text-cyber-neonPurple" />
                <span>{userDisplayName}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setShowAuthModal(true);
                }}
                className="cyber-btn cyber-btn-purple px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
              >
                <LogIn size={14} /> SIGN IN
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-cyber-border p-4 bg-cyber-dark/60 backdrop-blur-sm shrink-0 font-mono">
          <div className="hud-label text-slate-500 mb-3 px-2">Navigation</div>
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTab(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left
                    ${isActive 
                      ? 'bg-cyber-neonPurple/20 border border-cyber-neonPurple/60 text-white border-glow-purple' 
                      : 'text-slate-400 hover:bg-cyber-dark/40 hover:text-slate-200 border border-transparent'}
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-cyber-neonPurple' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Workspace Canvas */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderActiveTab()}
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="border-t border-cyber-border bg-cyber-dark/95 backdrop-blur-md py-4 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>RookX — Explainable Career Decision Engine © 2026</span>
          <span className="text-[10px] text-slate-400">🔒 Student Privacy Secured • Local Data Privacy</span>
        </div>
      </footer>

      {/* Floating AI Assistant Chatbot */}
      <AIAssistant 
        profile={profileData}
        assessment={assessmentScores}
        targetCareerId={targetCareerId}
      />

      {/* Account Settings Drawer / Modal */}
      {showAccountModal && activeSession.isAuthenticated && (
        <AccountModal 
          profile={profileData}
          theme={theme}
          toggleTheme={toggleTheme}
          onClose={() => setShowAccountModal(false)}
          onEditProfile={() => setActiveTab('profile')}
          onRetakeAssessment={() => setActiveTab('assessment')}
          onLogout={handleLogout}
          onChangePassword={handleChangePassword}
        />
      )}

      {/* Auth / Password Protection Modal */}
      {showAuthModal && (
        <AuthModal 
          initialMode={authModalMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onClose={() => setShowAuthModal(false)}
        />
      )}

    </div>
  );
}
