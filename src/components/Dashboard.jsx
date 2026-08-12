import React, { useState } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { 
  Activity, Compass, Cpu, Award, ArrowRight, X, CheckCircle2, 
  Sparkles, TrendingUp, Target, Zap, ShieldCheck, Flame, ChevronRight, Layers
} from 'lucide-react';
import { getLevelInfo } from '../utils/gamification';

export default function Dashboard({ profile, assessment, targetCareerId, setTab, onSelectTarget, gamificationState }) {
  const [showWhyModal, setShowWhyModal] = useState(false);

  const getBlendedMetric = (profileVal, assessmentVal) => {
    const p = profileVal !== undefined ? Number(profileVal) : 50;
    const a = assessmentVal !== undefined ? Number(assessmentVal) : 50;
    return Math.round(p * 0.6 + a * 0.4);
  };

  const getCareerCompatibility = (career) => {
    const coding = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
    const sql = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
    const math = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
    const comms = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
    const business = getBlendedMetric(profile.skills?.business_strategy, assessment.skills?.business_strategy);

    const hasInterestMatch = profile.interests?.includes(
      career.id === 'software_engineer' ? 'tech' :
      career.id === 'data_scientist' ? 'data' :
      career.id === 'cybersecurity_analyst' ? 'security' :
      career.id === 'ui_ux_designer' ? 'design' : 'business'
    );
    const discoveryScore = assessment.interests?.[career.id] || 0;
    const interestBlended = hasInterestMatch ? 90 + discoveryScore * 0.1 : 40 + discoveryScore * 0.5;

    let score = 0;
    if (career.id === 'software_engineer') {
      score = (coding/100)*40 + (math/100)*20 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*15 + (sql/100)*10 + (comms/100)*10 + (interestBlended/100)*5;
    } else if (career.id === 'data_scientist') {
      score = (sql/100)*30 + (math/100)*25 + (getBlendedMetric(profile.skills?.mathematics, assessment.skills?.aptitude)/100)*20 + (coding/100)*15 + (comms/100)*10;
    } else if (career.id === 'cybersecurity_analyst') {
      score = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*25 + (coding/100)*20 + (getBlendedMetric(50, assessment.skills?.aptitude)/100)*25 + (getBlendedMetric(profile.skills?.coding, 50)/100)*20 + (comms/100)*10;
    } else if (career.id === 'ui_ux_designer') {
      score = (getBlendedMetric(profile.skills?.design_principles, 50)/100)*35 + (getBlendedMetric(profile.skills?.business_strategy, 50)/100)*25 + (comms/100)*20 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*15 + (coding/100)*5;
    } else {
      score = (comms/100)*35 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*25 + (business/100)*20 + (sql/100)*15 + (coding/100)*5;
    }
    return Math.max(20, Math.min(99, Math.round(score)));
  };

  const resultsList = CAREER_LIST.map(career => ({
    ...career,
    compatibility: getCareerCompatibility(career)
  })).sort((a, b) => b.compatibility - a.compatibility);

  // Check if assessment is completed
  const hasAssessment = Boolean(
    profile.isOnboarded && 
    assessment && 
    assessment.skills && 
    Object.keys(assessment.skills).length > 0
  );

  const topMatch = resultsList[0];
  const activeCareer = resultsList.find(c => c.id === targetCareerId) || topMatch;

  // Primary skill gap calculation
  const getPrimarySkillGap = (career) => {
    let maxGap = 0;
    let gapName = 'Data Structures & Algorithms';
    career.requiredSkills.forEach(req => {
      let userVal = 50;
      const nameLower = req.name.toLowerCase();
      if (nameLower.includes('react') || nameLower.includes('javascript') || nameLower.includes('git')) {
        userVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
      } else if (nameLower.includes('sql') || nameLower.includes('query')) {
        userVal = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
      } else if (nameLower.includes('statistic') || nameLower.includes('math')) {
        userVal = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
      } else {
        userVal = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
      }
      const gap = req.level - userVal;
      if (gap > maxGap) {
        maxGap = gap;
        gapName = req.name;
      }
    });
    return gapName;
  };

  const primarySkillGap = getPrimarySkillGap(topMatch);

  // Placement readiness score calculation
  const getReadinessScore = () => {
    const s1 = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
    const s2 = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
    const s3 = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
    const s4 = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
    return Math.round((s1 + s2 + s3 + s4) / 4);
  };

  const readinessIndex = getReadinessScore();
  const levelInfo = getLevelInfo(gamificationState?.xp || 450);
  const userName = profile.fullName ? profile.fullName.split(' ')[0] : 'Student';

  // 8-Step Journey Definition
  const JOURNEY_STEPS = [
    { id: 1, title: 'Assess Fit', desc: 'Career Fit Test', tab: 'assessment', icon: Compass, isDone: hasAssessment },
    { id: 2, title: 'Discover Paths', desc: 'Compare Matches', tab: 'decision', icon: Layers, isDone: hasAssessment },
    { id: 3, title: 'Try Work', desc: 'Try Before Commit', tab: 'try_career', icon: Sparkles, isDone: (gamificationState?.triedSimulations?.length || 0) > 0 },
    { id: 4, title: 'Reality Check', desc: 'Market Benchmark', tab: 'reality', icon: Activity, isDone: true },
    { id: 5, title: 'Progress Plan', desc: 'Readiness Projection', tab: 'progress', icon: TrendingUp, isDone: true },
    { id: 6, title: 'Action Roadmap', desc: '4-Week Growth', tab: 'roadmap', icon: Target, isDone: (gamificationState?.completedTasks?.length || 0) > 0 },
    { id: 7, title: 'Earn XP & Badges', desc: 'Unlock Achievements', tab: 'xp_badges', icon: Award, isDone: (gamificationState?.unlockedBadges?.length || 0) > 0 },
    { id: 8, title: 'Career Ready', desc: 'Reach > 80% Readiness', tab: 'progress', icon: ShieldCheck, isDone: readinessIndex >= 80 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn font-mono pb-12">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyber-border pb-4 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyber-neonPurple/40 bg-cyber-neonPurple/10 text-cyber-neonPurple text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles size={13} className="animate-pulse" />
            CAREER DECISION PLATFORM
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-cyber-neonPurple">{userName} 👋</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Your Career Journey: <span className="text-cyber-neonCyan font-bold">Assess → Discover → Try → Understand → Improve → Earn XP → Career Ready</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setTab('profile')}
            className="px-3.5 py-2 border border-cyber-border rounded-lg text-xs font-mono text-slate-300 hover:border-cyber-neonPurple transition-all font-bold cursor-pointer"
          >
            EDIT PROFILE
          </button>
          <button 
            onClick={() => setTab('assessment')}
            className="px-3.5 py-2 border border-cyber-neonPurple/40 bg-cyber-neonPurple/15 text-cyber-neonPurple rounded-lg text-xs font-mono hover:bg-cyber-neonPurple/25 transition-all font-bold cursor-pointer"
          >
            {hasAssessment ? 'RETAKE ASSESSMENT' : 'TAKE ASSESSMENT'}
          </button>
        </div>
      </div>

      {/* IMPORTANT STATS BAR (Part 11 Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="p-4 rounded-xl border border-cyber-neonCyan/40 bg-cyber-dark/60 text-center space-y-1 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">CAREER READINESS</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyber-neonCyan">{readinessIndex}%</span>
          <span className="text-[9px] text-slate-400 block">Baseline Readiness</span>
        </div>

        <div className="p-4 rounded-xl border border-cyber-neonPurple/40 bg-cyber-dark/60 text-center space-y-1 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">ROOKX LEVEL</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyber-neonPurple">LVL {levelInfo.level}</span>
          <span className="text-[9px] text-cyber-neonPurple block truncate font-bold">{levelInfo.name}</span>
        </div>

        <div className="p-4 rounded-xl border border-amber-400/40 bg-cyber-dark/60 text-center space-y-1 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL XP</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{(gamificationState?.xp || 450).toLocaleString()}</span>
          <span className="text-[9px] text-amber-400 block font-bold">Career XP Points</span>
        </div>

        <div className="p-4 rounded-xl border border-emerald-400/40 bg-cyber-dark/60 text-center space-y-1 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">CURRENT CAREER</span>
          <span className="text-base sm:text-lg font-bold text-white block truncate">{activeCareer.name}</span>
          <span className="text-[9px] text-emerald-400 block font-bold">{activeCareer.compatibility}% Compatibility</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-xl border border-rose-400/40 bg-cyber-dark/60 text-center space-y-1 shadow-[0_0_15px_rgba(251,113,133,0.15)]">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">ROADMAP PROGRESS</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">68%</span>
          <span className="text-[9px] text-slate-400 block">4-Week Completion</span>
        </div>

      </div>

      {/* YOUR NEXT MISSION CARD (Part 11 Requirement) */}
      <div className="glass-panel border-glow-purple p-6 rounded-2xl relative scanlines flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold border border-amber-400/40 bg-amber-400/10 text-amber-400 uppercase">
            <Zap size={12} className="animate-pulse" /> RECOMMENDED ACTION MISSION
          </div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            🧩 Mission: Solve 2 Data Structures & Algorithms Problems
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Target Skill: <strong className="text-cyber-neonCyan">Problem Solving & Logic</strong> • Est Time: <strong className="text-amber-400">30 Min</strong>
          </p>
          <div className="flex items-center gap-3 text-xs font-bold pt-1">
            <span className="text-purple-400 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">+50 XP</span>
            <span className="text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">+2% Career Readiness</span>
          </div>
        </div>

        <button
          onClick={() => setTab('roadmap')}
          className="cyber-btn cyber-btn-purple px-6 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
        >
          START MISSION <ArrowRight size={14} />
        </button>
      </div>

      {/* 8-STEP INTERACTIVE CAREER JOURNEY STEPPER */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers size={16} className="text-cyber-neonPurple" />
            Your 8-Step Career Journey Roadmap
          </h3>
          <span className="text-xs text-slate-400">Click any step to jump to action</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {JOURNEY_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                onClick={() => setTab(step.tab)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 scanlines ${
                  step.isDone 
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-white hover:border-emerald-400' 
                    : 'border-cyber-border bg-cyber-dark/40 text-slate-400 hover:border-cyber-neonPurple hover:bg-cyber-neonPurple/10'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span>STEP 0{step.id}</span>
                  {step.isDone ? <CheckCircle2 size={13} className="text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-slate-600"></div>}
                </div>

                <div className="space-y-1">
                  <Icon size={18} className={step.isDone ? 'text-emerald-400' : 'text-slate-400'} />
                  <span className="text-xs font-bold block truncate text-white">{step.title}</span>
                  <span className="text-[9px] text-slate-400 block truncate">{step.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Decision Core and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CAREER DECISION ENGINE PANEL */}
        <div className="lg:col-span-1 glass-panel border-glow-purple p-6 rounded-xl flex flex-col justify-between scanlines min-h-[380px] relative">
          <div className="flex justify-between items-center border-b border-cyber-border/60 pb-3 mb-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase flex items-center gap-1.5">
              <Cpu className="text-cyber-neonPurple" size={16} />
              CAREER DECISION ENGINE
            </h3>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${hasAssessment ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {hasAssessment ? 'Analysis Complete' : 'Analysis Pending'}
            </span>
          </div>

          {hasAssessment ? (
            <div className="space-y-4 font-mono flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Top Match */}
                <div className="p-3.5 border border-cyber-border rounded-lg bg-cyber-dark/40">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Top Career Match</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-bold text-white">{topMatch.name}</span>
                    <span className="text-xl font-extrabold text-cyber-neonPurple">{topMatch.compatibility}% Fit</span>
                  </div>
                </div>

                {/* Why this match breakdown list */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">Why this match?</span>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Skills compatibility verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Interest alignment confirmed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Diagnostic performance score</span>
                    </div>
                  </div>
                </div>

                {/* Primary Skill Gap & Recommended Next Step */}
                <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold block uppercase">Primary Skill Gap</span>
                  <div className="text-xs font-bold text-white">{primarySkillGap}</div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    <strong>Recommended Next Step:</strong> Build {primarySkillGap} fundamentals and reassess readiness.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowWhyModal(true)}
                className="cyber-btn cyber-btn-purple w-full py-2.5 rounded text-xs font-mono tracking-wider font-bold text-white flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                WHY THIS CAREER? <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-4 font-mono flex-1 flex flex-col justify-between py-4">
              <div className="space-y-3 text-center py-4">
                <Compass size={40} className="mx-auto text-amber-400 animate-bounce" />
                <h4 className="text-base font-bold text-white">Analysis Pending</h4>
                <p className="text-xs text-slate-400 leading-relaxed px-2">
                  Complete your assessment to generate your personalized career recommendations.
                </p>
              </div>

              <button
                onClick={() => setTab('assessment')}
                className="cyber-btn cyber-btn-purple w-full py-3 rounded text-xs font-mono tracking-wider font-bold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                TAKE ASSESSMENT <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Key Profile Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Readiness Monitor */}
          <div className="glass-panel border-glow-cyan p-5 rounded-xl flex flex-col justify-between">
            <span className="hud-label text-cyber-neonCyan font-bold">CAREER READINESS MONITOR</span>
            
            <div className="space-y-4 my-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase">Career Readiness Score</h4>
              {hasAssessment ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-mono text-white">{readinessIndex}%</span>
                    <span className="text-xs text-cyber-neonCyan font-mono">Readiness Index</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-cyber-border">
                    <div 
                      className="bg-cyber-neonCyan h-full transition-all duration-300"
                      style={{ width: `${readinessIndex}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 border border-cyber-border rounded bg-cyber-dark/40 text-xs text-amber-400 font-mono">
                  Analysis Pending — Take career test to calculate your readiness score.
                </div>
              )}
            </div>

            <button 
              onClick={() => setTab('progress')}
              className="text-left text-xs font-mono text-cyber-neonCyan hover:underline flex items-center gap-1 mt-4 font-bold cursor-pointer"
            >
              Simulate career progress <ChevronRight className="inline" size={12} />
            </button>
          </div>

          {/* Target Alignment Fit */}
          <div className="glass-panel border-glow-rose p-5 rounded-xl flex flex-col justify-between">
            <span className="hud-label text-cyber-neonRose font-bold">TARGET ALIGNMENT FIT</span>

            <div className="space-y-4 my-2 font-mono">
              <h4 className="text-xs font-mono text-slate-400 uppercase">Target Compatibility Score</h4>
              {hasAssessment ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{activeCareer.compatibility}%</span>
                    <span className="text-xs text-cyber-neonRose">Compatibility Fit</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Primary Goal: <strong className="text-white">{activeCareer.name}</strong>
                  </p>
                </>
              ) : (
                <div className="p-3 border border-cyber-border rounded bg-cyber-dark/40 text-xs text-amber-400 font-mono">
                  Analysis Pending — Complete test to unlock target fit score.
                </div>
              )}
            </div>

            <button 
              onClick={() => setTab('decision')}
              className="text-left text-xs font-mono text-cyber-neonRose hover:underline flex items-center gap-1 mt-4 font-bold cursor-pointer"
            >
              Compare career matches <ChevronRight className="inline" size={12} />
            </button>
          </div>

          {/* Quick Tools */}
          <div className="md:col-span-2 glass-panel border-glow-purple p-5 rounded-xl">
            <span className="hud-label text-cyber-neonPurple font-bold">CAREER DECISION ENGINE TOOLS</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <button 
                onClick={() => setTab('try_career')}
                className="p-3 border border-cyber-border bg-cyber-dark/40 text-center rounded-lg hover:border-cyber-neonPurple transition-all font-mono text-xs text-slate-300 hover:text-white font-bold cursor-pointer"
              >
                🎮 Try Career
              </button>
              <button 
                onClick={() => setTab('reality')}
                className="p-3 border border-cyber-border bg-cyber-dark/40 text-center rounded-lg hover:border-cyber-neonPurple transition-all font-mono text-xs text-slate-300 hover:text-white font-bold cursor-pointer"
              >
                ⚖️ Reality Check
              </button>
              <button 
                onClick={() => setTab('resume')}
                className="p-3 border border-cyber-border bg-cyber-dark/40 text-center rounded-lg hover:border-cyber-neonPurple transition-all font-mono text-xs text-slate-300 hover:text-white font-bold cursor-pointer"
              >
                📁 Resume Checker
              </button>
              <button 
                onClick={() => setTab('parent')}
                className="p-3 border border-cyber-border bg-cyber-dark/40 text-center rounded-lg hover:border-cyber-neonPurple transition-all font-mono text-xs text-slate-300 hover:text-white font-bold cursor-pointer"
              >
                👨‍👩‍👦 Parent Report
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Recommended Career Matches */}
      <div className="space-y-4">
        <h3 className="hud-label text-slate-400 font-bold">RECOMMENDED CAREER MATCHES</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resultsList.slice(0, 3).map((match, idx) => (
            <div 
              key={match.id} 
              className={`
                glass-panel p-5 rounded-xl relative flex flex-col justify-between min-h-[190px]
                ${idx === 0 ? 'border-glow-purple bg-cyber-neonPurple/5' : 'border-cyber-border'}
              `}
            >
              <div className="font-mono space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white block">{match.name}</span>
                  <span 
                    className="text-sm font-bold font-mono"
                    style={{ color: hasAssessment ? match.color : '#94a3b8' }}
                  >
                    {hasAssessment ? `${match.compatibility}%` : 'Pending'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{match.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-cyber-border/40 flex justify-between items-center font-mono text-xs font-bold">
                <button
                  onClick={() => {
                    onSelectTarget(match.id);
                    setTab('try_career');
                  }}
                  className="text-cyber-neonCyan hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Try Career →
                </button>
                <button
                  onClick={() => {
                    onSelectTarget(match.id);
                    setTab('roadmap');
                  }}
                  className="text-cyber-neonPurple hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Build Roadmap →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY THIS CAREER EXPLAINABILITY MODAL */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel border-glow-purple max-w-xl w-full p-6 rounded-2xl relative font-mono space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-cyber-border pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="text-cyber-neonPurple" size={18} />
                  Why {topMatch.name}?
                </h3>
                <span className="text-xs text-cyber-neonPurple font-bold">Calculated Compatibility: {topMatch.compatibility}%</span>
              </div>
              <button 
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 border border-cyber-border rounded-xl bg-cyber-dark/40 space-y-1">
                <span className="font-bold text-cyber-neonCyan block">1. Skills Compatibility Score</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your self-assessed and test-verified skills align with {Math.round(topMatch.compatibility * 0.85)}% of standard entry-level requirements for a {topMatch.name}.
                </p>
              </div>

              <div className="p-3.5 border border-cyber-border rounded-xl bg-cyber-dark/40 space-y-1">
                <span className="font-bold text-cyber-neonRose block">2. Interest & Work Style Alignment</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your stated interests in {profile.interests?.join(', ') || 'technology'} and work style preferences match the daily problem-solving environment of this career.
                </p>
              </div>

              <div className="p-3.5 border border-cyber-border rounded-xl bg-cyber-dark/40 space-y-1">
                <span className="font-bold text-emerald-400 block">3. Diagnostic Assessment Performance</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your accuracy score in logic, aptitude, and technical questions confirms strong potential in this track.
                </p>
              </div>

              <div className="p-3.5 border border-amber-500/30 rounded-xl bg-amber-500/5 space-y-1">
                <span className="font-bold text-amber-400 block">4. Primary Skill Gap & Action Plan</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your primary gap is <strong>{primarySkillGap}</strong>. Recommended action: Build {primarySkillGap} fundamentals and reassess readiness.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-cyber-border">
              <button
                onClick={() => setShowWhyModal(false)}
                className="cyber-btn cyber-btn-purple px-5 py-2 rounded text-xs font-mono font-bold text-white cursor-pointer"
              >
                CLOSE EXPLANATION
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
