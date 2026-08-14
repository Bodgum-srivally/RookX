import React, { useState, useEffect } from 'react';
import './App.css';

// Importing custom components
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import MissionsPage from './components/MissionsPage';
import ProfileForm from './components/ProfileForm';
import Assessment from './components/Assessment';
import DecisionEngine from './components/DecisionEngine';
import RealityCheck from './components/RealityCheck';
import Simulator from './components/Simulator';
import SkillGaps from './components/SkillGaps';
import Roadmap from './components/Roadmap';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ParentMode from './components/ParentMode';
import AIAssistant from './components/AIAssistant';
import AccountModal from './components/AccountModal';
import AuthModal from './components/AuthModal';

// New Feature Components
import TryBeforeYouCommit from './components/TryBeforeYouCommit';
import CareerProgress from './components/CareerProgress';
import RookXXP from './components/RookXXP';

import { saveUserToDB, getUserFromDB, getAllUsersFromDB, saveSessionToDB } from './services/dbService';
import { loginUser, registerUser, fetchCurrentUser, clearAuthToken, syncUserData, changePassword } from './services/apiService';
import { getLevelInfo, BADGES, evaluateBadges } from './utils/gamification';

// Lucide Icons
import { 
  Home, Activity, Compass, Layers, BarChart3, 
  Target, Calendar, FileText, Users, Sparkles, RefreshCw,
  Sun, Moon, UserCheck, Lock, LogIn, Award, TrendingUp, X,
  Menu, ArrowLeft, Zap
} from 'lucide-react';

export default function App() {
  // Theme state: default dark mode, persist in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('rookx_theme') || 'dark');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Navigation Drawer & History State
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [tabHistory, setTabHistory] = useState([]);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (title, subtitle, icon = '🎉') => {
    setToastMessage({ title, subtitle, icon });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Active Session State
  const [activeSession, setActiveSession] = useState({ isAuthenticated: false, email: '' });

  // Target active goal career
  const [targetCareerId, setTargetCareerId] = useState('software_engineer');

  // Load active user profile data
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    isOnboarded: false,
    academic: { qualification: '2nd Year College', stream: 'Computer Science', gpa: '8.0' },
    skills: { coding: 55, sql: 40, mathematics: 45, design_principles: 30, communication: 50, business_strategy: 35 },
    interests: ['tech', 'data'],
    preferences: { workStyle: 3, solvingStyle: 2, studyTime: '2-3 Hours' },
    constraints: { location: 'Local', budget: '3-5 Lakhs/Yr', collegeType: 'Government' }
  });

  // Load active user assessment scores
  const [assessmentScores, setAssessmentScores] = useState({
    skills: { aptitude: 65, coding: 60, sql: 45, mathematics: 50, communication: 70 },
    interests: { software_engineer: 80, data_scientist: 60, cybersecurity_analyst: 40, ui_ux_designer: 30 }
  });

  // Gamification & XP State
  const [gamificationState, setGamificationState] = useState({
    xp: 450,
    unlockedBadges: [],
    triedSimulations: [],
    completedTasks: [],
    highestSimScore: 0
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

  // Check persistent login session via MongoDB backend on startup
  useEffect(() => {
    async function restoreSession() {
      const user = await fetchCurrentUser();
      if (user && user.email) {
        setActiveSession({ isAuthenticated: true, email: user.email, fullName: user.fullName });
        if (user.profileData) setProfileData(user.profileData);
        if (user.assessmentScores) setAssessmentScores(user.assessmentScores);
        if (user.gamification) setGamificationState(user.gamification);
      }
    }
    restoreSession();
  }, []);

  // Sync profile, assessment & gamification data to MongoDB cloud database
  const syncActiveUserData = async (newProfile, newAssessment, newGamification) => {
    const updatedProfile = newProfile || profileData;
    const updatedAssessment = newAssessment || assessmentScores;
    const updatedGamification = newGamification || gamificationState;

    if (activeSession.isAuthenticated && activeSession.email) {
      await syncUserData({
        profileData: updatedProfile,
        assessmentScores: updatedAssessment,
        gamification: updatedGamification
      });
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Central Gamification XP & Badge Award Handler
  const handleAwardXP = (addedXp, reason, meta = {}) => {
    setGamificationState(prevState => {
      const oldLevel = getLevelInfo(prevState.xp).level;
      const newXp = (prevState.xp || 0) + addedXp;
      const newTriedSimulations = meta.simulationId 
        ? Array.from(new Set([...(prevState.triedSimulations || []), meta.simulationId])) 
        : (prevState.triedSimulations || []);
      
      const newCompletedTasks = meta.taskId 
        ? Array.from(new Set([...(prevState.completedTasks || []), meta.taskId])) 
        : (prevState.completedTasks || []);

      const newHighestSimScore = Math.max(prevState.highestSimScore || 0, meta.simScore || 0);

      const candidateState = {
        ...prevState,
        xp: newXp,
        triedSimulations: newTriedSimulations,
        completedTasks: newCompletedTasks,
        highestSimScore: newHighestSimScore
      };

      // Check badge evaluation
      const { unlockedBadges, newUnlocks } = evaluateBadges(candidateState, 54 + (newCompletedTasks.length * 5));
      candidateState.unlockedBadges = unlockedBadges;

      const newLevelObj = getLevelInfo(newXp);
      if (newLevelObj.level > oldLevel) {
        triggerToast(`LEVEL UP! REACHED LEVEL ${newLevelObj.level}`, `Title: ${newLevelObj.name}`, '🏆');
      } else if (newUnlocks.length > 0) {
        const badgeObj = BADGES.find(b => b.id === newUnlocks[0]);
        triggerToast(`ACHIEVEMENT UNLOCKED!`, `${badgeObj ? badgeObj.name : 'New Badge'} (+${badgeObj ? badgeObj.xpReward : 100} XP)`, badgeObj ? badgeObj.icon : '🎉');
      } else {
        triggerToast(`+${addedXp} XP EARNED!`, reason, '⚡');
      }

      syncActiveUserData(null, null, candidateState);
      return candidateState;
    });
  };

  // Auth Handler: Login
  const handleLogin = async (email, password) => {
    const response = await loginUser(email, password);
    if (!response || !response.success || !response.user) {
      return false;
    }

    const user = response.user;
    const session = { email: user.email, isAuthenticated: true, fullName: user.fullName };
    setActiveSession(session);

    if (user.profileData) setProfileData(user.profileData);
    if (user.assessmentScores) setAssessmentScores(user.assessmentScores);
    if (user.gamification) setGamificationState(user.gamification);

    setShowAuthModal(false);
    setActiveTab('dashboard');
    triggerToast('WELCOME BACK!', `Signed in as ${user.fullName || user.email}`, '🔑');
    return true;
  };

  // Auth Handler: Register
  const handleRegister = async (regData) => {
    const response = await registerUser(regData);
    if (!response || !response.success || !response.user) {
      return false;
    }

    const user = response.user;
    const session = { email: user.email, isAuthenticated: true, fullName: user.fullName };
    setActiveSession(session);

    if (user.profileData) setProfileData(user.profileData);
    if (user.assessmentScores) setAssessmentScores(user.assessmentScores);
    if (user.gamification) setGamificationState(user.gamification);

    setShowAuthModal(false);
    setActiveTab('assessment');
    triggerToast('ACCOUNT CREATED!', 'Welcome to RookX. Let\'s start your career assessment.', '🚀');
    return true;
  };

  // Auth Handler: Logout
  const handleLogout = () => {
    clearAuthToken();
    setActiveSession({ isAuthenticated: false, email: '' });
    setActiveTab('home');
    triggerToast('LOGGED OUT', 'You have been safely signed out.', '🔒');
  };

  // Auth Handler: Change Password
  const handleChangePassword = async (currentPass, newPass) => {
    const success = await changePassword(currentPass, newPass);
    if (success) {
      triggerToast('PASSWORD CHANGED', 'Your account password has been updated.', '🛡️');
      return true;
    }
    return false;
  };

  const handleProfileSave = (updatedData) => {
    const newProfile = {
      ...updatedData,
      isOnboarded: true
    };
    setProfileData(newProfile);
    syncActiveUserData(newProfile, null, null);
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
    syncActiveUserData(updatedProfile, updatedAssessment, null);
    handleAwardXP(100, 'Completed Roadmap Reassessment');
  };

  const handleAssessmentComplete = (skills, interests) => {
    const newScores = { skills, interests };
    setAssessmentScores(newScores);
    syncActiveUserData(null, newScores, null);
    handleAwardXP(100, 'Completed Career Fit Test');
    setActiveTab('dashboard');
  };

  // Close navigation drawer when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isNavOpen) {
        setIsNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavOpen]);

  const handleSelectTargetCareer = (careerId) => {
    setTargetCareerId(careerId);
  };

  // Protected Tab Navigation Helper
  const navigateTab = (tabName, isBack = false) => {
    if (!activeSession.isAuthenticated && tabName !== 'home') {
      setAuthModalMode('login');
      setShowAuthModal(true);
      setIsNavOpen(false);
      return;
    }
    if (tabName === activeTab) {
      setIsNavOpen(false);
      return;
    }

    if (!isBack) {
      setTabHistory(prev => [...prev, activeTab]);
    }
    setActiveTab(tabName);
    setIsNavOpen(false);
  };

  // In-App Back Navigation Handler
  const handleGoBack = () => {
    if (tabHistory.length === 0) {
      setActiveTab('home');
      return;
    }
    const previousTab = tabHistory[tabHistory.length - 1];
    setTabHistory(prev => prev.slice(0, prev.length - 1));
    setActiveTab(previousTab);
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
            gamificationState={gamificationState}
            onAwardXP={handleAwardXP}
          />
        );
      case 'missions':
        return (
          <MissionsPage 
            profile={profileData}
            assessment={assessmentScores}
            targetCareerId={targetCareerId}
            gamificationState={gamificationState}
            onAwardXP={handleAwardXP}
            setTab={navigateTab}
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
      case 'try_career':
        return (
          <TryBeforeYouCommit 
            profile={profileData}
            setTab={navigateTab}
            onCompleteSimulation={(simId, score) => {
              handleAwardXP(200, `Completed ${simId.replace('_', ' ')} Simulation`, { simulationId: simId, simScore: score });
            }}
          />
        );
      case 'progress':
        return (
          <CareerProgress 
            profile={profileData}
            assessment={assessmentScores}
            targetCareerId={targetCareerId}
            gamificationState={gamificationState}
            setTab={navigateTab}
            onCompleteActivity={(actId, boost, xp) => {
              handleAwardXP(xp || 100, `Completed Booster Task`, { taskId: actId });
            }}
          />
        );
      case 'xp_badges':
        return (
          <RookXXP 
            gamificationState={gamificationState}
            readinessScore={54}
            setTab={navigateTab}
            onAwardXP={handleAwardXP}
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
      case 'roadmap':
        return (
          <Roadmap 
            profile={profileData} 
            assessment={assessmentScores} 
            targetCareerId={targetCareerId}
            setTab={navigateTab}
            onUpdateSkills={handleUpdateSkillsFromRoadmap}
            onAwardXP={handleAwardXP}
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

  const levelInfo = getLevelInfo(gamificationState.xp || 0);

  // Navigation Items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Overview Hub', icon: Activity },
    { id: 'missions', label: 'Practice Missions', icon: Zap },
    { id: 'try_career', label: 'Try Before You Commit', icon: Sparkles },
    { id: 'progress', label: 'Career Progress', icon: TrendingUp },
    { id: 'xp_badges', label: 'RookX XP & Badges', icon: Award },
    { id: 'assessment', label: 'Career Fit Test', icon: Compass },
    { id: 'decision', label: 'Compare Careers', icon: Layers },
    { id: 'reality', label: 'Reality Check', icon: BarChart3 },
    { id: 'simulator', label: 'What-If Simulator', icon: Sparkles },
    { id: 'gaps', label: 'Skills to Learn', icon: Target },
    { id: 'roadmap', label: '4-Week Action Plan', icon: Calendar },
    { id: 'resume', label: 'Resume Checker', icon: FileText },
    { id: 'parent', label: 'Parent Report', icon: Users },
  ];

  return (
    <div className={`min-h-screen flex flex-col cyber-bg ${theme === 'dark' ? 'dark text-slate-200' : 'light-mode text-slate-900'}`}>
      
      {/* Header Bar */}
      <header className="border-b border-cyber-border bg-cyber-dark/95 backdrop-blur-md sticky top-0 z-30 font-mono">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-2">
          
          {/* Left Header Group: Hamburger Toggle + Logo + Back Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Hamburger Menu Icon Button */}
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="p-2 rounded-lg border border-cyber-border bg-cyber-dark/40 text-slate-300 hover:border-cyber-neonPurple hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-sm"
              title={isNavOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-label="Toggle navigation menu"
            >
              {isNavOpen ? <X size={18} className="text-cyber-neonPurple" /> : <Menu size={18} />}
            </button>

            {/* Brand Logo */}
            <div 
              onClick={() => navigateTab('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 rounded border border-cyber-neonPurple flex items-center justify-center font-extrabold text-white text-base shadow-[0_0_10px_rgba(168,85,247,0.3)] animate-pulse group-hover:scale-105 transition-all">
                RX
              </div>
              <div className="hidden xs:block sm:block">
                <h1 className="text-lg font-extrabold text-white tracking-wider m-0 leading-none group-hover:text-cyber-neonPurple transition-colors">RookX</h1>
                <span className="text-[9px] text-cyber-neonPurple block uppercase tracking-widest mt-0.5">Career Decision Engine</span>
              </div>
            </div>

            {/* In-App Back Button (Hidden on Home Page) */}
            {activeTab !== 'home' && (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyber-border bg-cyber-dark/60 text-xs font-bold text-slate-300 hover:border-cyber-neonPurple hover:text-white transition-all cursor-pointer shadow-sm group font-mono ml-1"
                title="Return to previous page"
              >
                <ArrowLeft size={14} className="text-cyber-neonPurple group-hover:-translate-x-1 transition-transform" />
                <span>BACK</span>
              </button>
            )}

          </div>

          {/* Right Header Group: Controls */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            
            {/* Gamification XP Level Pill */}
            <button
              onClick={() => navigateTab('xp_badges')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-cyber-neonPurple/50 bg-cyber-neonPurple/15 text-xs font-bold text-white hover:bg-cyber-neonPurple/25 transition-all cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]"
              title="View RookX XP & Badges"
            >
              <Award size={14} className="text-cyber-neonPurple animate-pulse" />
              <span>LVL {levelInfo.level} • {levelInfo.totalXp.toLocaleString()} XP</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyber-border bg-cyber-dark/40 text-xs font-bold text-white hover:border-cyber-neonPurple transition-all cursor-pointer"
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

            {/* Account / Sign In Button */}
            {activeSession.isAuthenticated ? (
              <button 
                onClick={() => setShowAccountModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyber-neonPurple/50 bg-cyber-neonPurple/15 text-white hover:bg-cyber-neonPurple/25 transition-all font-bold cursor-pointer"
              >
                <UserCheck size={15} className="text-cyber-neonPurple" />
                <span className="hidden xs:inline">{userDisplayName}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setShowAuthModal(true);
                }}
                className="cyber-btn cyber-btn-purple px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <LogIn size={14} /> SIGN IN
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Slide-over Hamburger Navigation Drawer */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 flex font-mono animate-fadeIn">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsNavOpen(false)}
          />

          {/* Drawer Content Panel */}
          <div className="relative w-80 max-w-[85vw] h-full bg-cyber-dark border-r border-cyber-border p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col z-10 animate-slideRight">
            
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-4 border-b border-cyber-border/80">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded border border-cyber-neonPurple flex items-center justify-center font-extrabold text-white text-xs shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                  RX
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-wider m-0 leading-none">RookX Menu</h3>
                  <span className="text-[9px] text-cyber-neonPurple uppercase tracking-widest">Navigation Suite</span>
                </div>
              </div>

              <button
                onClick={() => setIsNavOpen(false)}
                className="p-1.5 rounded-lg border border-cyber-border text-slate-400 hover:text-white hover:border-cyber-neonPurple transition-all cursor-pointer"
                title="Close Menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Options List */}
            <div className="hud-label text-slate-500 mt-4 mb-2 px-2 text-[10px]">CAREER ENGINE NAVIGATION</div>
            <nav className="space-y-1 overflow-y-auto flex-1 pr-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTab(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer
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

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-cyber-border/80 text-xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Theme Mode</span>
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1 rounded-lg border border-cyber-border bg-cyber-dark/40 text-[11px] font-bold text-white hover:border-cyber-neonPurple transition-all"
                >
                  {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
              </div>

              <div className="text-[10px] text-slate-500 text-center">
                RookX Career Decision Engine • 2026
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Main Workspace Canvas (Full Width) */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
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

      {/* FLOATING ACHIEVEMENT / XP TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="glass-panel border-glow-purple p-4 rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.5)] bg-cyber-dark/95 flex items-center gap-3 border border-cyber-neonPurple">
            <div className="text-2xl p-2 rounded-lg bg-cyber-neonPurple/20">
              {toastMessage.icon}
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block uppercase tracking-wider">
                {toastMessage.title}
              </span>
              <span className="text-xs text-cyber-neonCyan font-bold block">
                {toastMessage.subtitle}
              </span>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1 ml-2"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
