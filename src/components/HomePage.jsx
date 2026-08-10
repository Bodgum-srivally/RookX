import React from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Compass, Layers, 
  Target, GraduationCap, Calendar, FileText, Users, Cpu, Zap, CheckCircle2, RefreshCw
} from 'lucide-react';
import { MYTH_BUSTERS } from '../data/careerData';

export default function HomePage({ 
  onStartDiscovery, 
  onTryDemo, 
  onExploreLandscape, 
  onStart, 
  setTab 
}) {
  const handleStartClick = () => {
    if (onStartDiscovery) onStartDiscovery();
    else if (onStart) onStart();
    else if (setTab) setTab('assessment');
  };

  const handleDemoClick = () => {
    if (onTryDemo) onTryDemo();
    else if (setTab) setTab('dashboard');
  };

  const handleExploreClick = () => {
    if (onExploreLandscape) onExploreLandscape();
    else if (setTab) setTab('decision');
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-8 font-mono">
      
      {/* HERO SECTION */}
      <section className="glass-panel border-glow-purple p-8 md:p-12 rounded-2xl text-center relative scanlines overflow-hidden">
        <div className="absolute top-0 right-0 p-4 hud-label opacity-60 text-[10px]">
          SYS_HOME_HERO // v2.4
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonPurple/40 bg-cyber-neonPurple/10 text-cyber-neonPurple text-xs font-bold tracking-widest uppercase">
            <Sparkles size={14} className="animate-pulse" />
            ROOKX — EXPLAINABLE CAREER ENGINE
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your Future. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyber-neonPurple via-cyber-neonCyan to-cyber-neonRose bg-clip-text text-transparent">
              Simulated Before You Choose It.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Understand where you stand, explore where you could go, identify measurable skill & education gaps, and receive an actionable pathway toward your goal.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={handleStartClick}
              className="cyber-btn cyber-btn-purple w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm tracking-wider font-bold text-white flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              DISCOVER MY CAREER <ArrowRight size={16} />
            </button>

            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-sm tracking-wider font-bold border border-cyber-neonCyan/40 bg-cyber-neonCyan/10 text-cyber-neonCyan hover:bg-cyber-neonCyan/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={16} /> TRY DEMO MODE
            </button>

            <button
              onClick={handleExploreClick}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg text-sm tracking-wider font-bold border border-cyber-border text-slate-300 hover:border-slate-500 hover:text-white transition-all cursor-pointer"
            >
              EXPLORE LANDSCAPE
            </button>
          </div>
        </div>
      </section>

      {/* THE CORE PROBLEM SOLVED */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="hud-label text-cyber-neonCyan">THE FOUR CORE QUESTIONS</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
            Student → Evidence → Decision → Action
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Traditional career quizzes guess your future. RookX answers all 4 crucial decisions in one connected engine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-l-cyber-neonPurple cursor-pointer hover:border-cyber-neonPurple/80 transition-all" onClick={() => setTab && setTab('assessment')}>
            <div className="text-xs text-cyber-neonPurple font-bold">1. SUITABILITY</div>
            <h3 className="text-sm font-bold text-white font-mono">"What career suits me?"</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Unbiased scenario choices evaluate natural work affinities without pre-judging career names.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-l-cyber-neonCyan cursor-pointer hover:border-cyber-neonCyan/80 transition-all" onClick={() => setTab && setTab('reality')}>
            <div className="text-xs text-cyber-neonCyan font-bold">2. REALITY CHECK</div>
            <h3 className="text-sm font-bold text-white font-mono">"Am I actually ready?"</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Benchmarks your current skills against minimum entry expectations for realistic gap feedback.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-l-cyber-neonRose cursor-pointer hover:border-cyber-neonRose/80 transition-all" onClick={() => setTab && setTab('simulator')}>
            <div className="text-xs text-cyber-neonRose font-bold">3. WHAT-IF SIMULATOR</div>
            <h3 className="text-sm font-bold text-white font-mono">"What if I change paths?"</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Simulates alternative careers side-by-side to compare readiness, project needs, and prep timelines.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-l-emerald-400 cursor-pointer hover:border-emerald-400/80 transition-all" onClick={() => setTab && setTab('roadmap')}>
            <div className="text-xs text-emerald-400 font-bold">4. ACTION ROADMAP</div>
            <h3 className="text-sm font-bold text-white font-mono">"What should I do next?"</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Generates a 4-week task calendar with progress checklists to systematically close your gaps.
            </p>
          </div>
        </div>
      </section>

      {/* 7 MAJOR ENGINES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="hud-label text-cyber-neonPurple">PRODUCT ARCHITECTURE</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
            7 Major Career Decision Engines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel border-glow-purple p-6 rounded-xl space-y-3 cursor-pointer hover:border-cyber-neonPurple" onClick={() => setTab && setTab('profile')}>
            <div className="p-2.5 rounded-lg bg-cyber-neonPurple/15 text-cyber-neonPurple w-fit">
              <Cpu size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">1. Profile Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Captures academic history, skill self-assessments, interest priorities, and logistical constraints (location, budget, college type).
            </p>
          </div>

          <div className="glass-panel border-glow-blue p-6 rounded-xl space-y-3 cursor-pointer hover:border-cyber-neonBlue" onClick={() => setTab && setTab('assessment')}>
            <div className="p-2.5 rounded-lg bg-cyber-neonBlue/15 text-cyber-neonBlue w-fit">
              <Compass size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">2. Assessment Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diagnostic test measuring aptitude, coding, SQL, math, and communication accuracy alongside scenario discovery preference weights.
            </p>
          </div>

          <div className="glass-panel border-glow-cyan p-6 rounded-xl space-y-3 cursor-pointer hover:border-cyber-neonCyan" onClick={() => setTab && setTab('decision')}>
            <div className="p-2.5 rounded-lg bg-cyber-neonCyan/15 text-cyber-neonCyan w-fit">
              <Layers size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">3. Career Decision Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates match scores against configurable career weights and renders explainable factor-by-factor score attributions.
            </p>
          </div>

          <div className="glass-panel border-glow-rose p-6 rounded-xl space-y-3 cursor-pointer hover:border-cyber-neonRose" onClick={() => setTab && setTab('reality')}>
            <div className="p-2.5 rounded-lg bg-cyber-neonRose/15 text-cyber-neonRose w-fit">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">4. Career Reality Check</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates current skill levels against target career benchmarks with visual gauge bars and honest gap feedback.
            </p>
          </div>

          <div className="glass-panel border-glow-purple p-6 rounded-xl space-y-3 cursor-pointer hover:border-cyber-neonPurple" onClick={() => setTab && setTab('simulator')}>
            <div className="p-2.5 rounded-lg bg-cyber-neonPurple/15 text-cyber-neonPurple w-fit">
              <Sparkles size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">5. What-If Simulator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Side-by-side comparative simulation analyzing two pathways to compare preparation duration, skill gaps, and course options.
            </p>
          </div>

          <div className="glass-panel border-glow-cyan p-6 rounded-xl space-y-3 cursor-pointer hover:border-cyber-neonCyan" onClick={() => setTab && setTab('education')}>
            <div className="p-2.5 rounded-lg bg-cyber-neonCyan/15 text-cyber-neonCyan w-fit">
              <GraduationCap size={20} />
            </div>
            <h3 className="text-sm font-bold text-white">6. Education & Scholarships</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connects careers to college degree programs filtered by budget/location preferences, entrance exams, and verified scholarships.
            </p>
          </div>
        </div>
      </section>

      {/* CAREER MYTH BUSTER PREVIEW */}
      <section className="glass-panel border-glow-cyan p-6 md:p-8 rounded-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyber-border pb-4 gap-2">
          <div>
            <span className="hud-label text-cyber-neonCyan">DEMYSTIFYING TECH CAREERS</span>
            <h2 className="text-lg font-bold text-white">Career Myth Buster</h2>
          </div>
          <span className="text-[10px] text-slate-400">Educational insights for students & parents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MYTH_BUSTERS.slice(0, 2).map((item, idx) => (
            <div key={idx} className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-lg space-y-2">
              <div className="text-xs font-bold text-cyber-neonRose">MYTH: "{item.myth}"</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-400">REALITY:</strong> {item.reality}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="glass-panel border-glow-purple p-8 rounded-xl text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Simulate Your Career Path Today
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Start your personalized onboarding to discover suitable career choices, evaluate skill gaps, and get your 4-week roadmap.
        </p>
        <button
          onClick={handleStartClick}
          className="cyber-btn cyber-btn-purple px-8 py-3 rounded-lg text-sm font-bold text-white inline-flex items-center gap-2 cursor-pointer shadow-xl"
        >
          START MY DISCOVERY NOW <ArrowRight size={16} />
        </button>
      </section>

    </div>
  );
}
