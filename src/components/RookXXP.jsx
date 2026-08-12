import React from 'react';
import { 
  Award, Zap, CheckCircle2, Lock, Sparkles, ShieldCheck, 
  Flame, Target, Star, ChevronRight, RotateCcw
} from 'lucide-react';
import { getLevelInfo, XP_LEVELS, BADGES } from '../utils/gamification';

export default function RookXXP({ gamificationState, readinessScore = 54, setTab }) {
  const totalXp = gamificationState?.xp || 0;
  const levelInfo = getLevelInfo(totalXp);
  const unlockedSet = new Set(gamificationState?.unlockedBadges || []);

  return (
    <div className="space-y-8 animate-fadeIn font-mono pb-12">
      
      {/* Header Banner */}
      <section className="glass-panel border-glow-purple p-6 md:p-8 rounded-2xl relative scanlines overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonPurple/40 bg-cyber-neonPurple/10 text-cyber-neonPurple text-xs font-bold uppercase tracking-widest">
              <Award size={14} className="animate-pulse" />
              GAMIFICATION & PROGRESSION
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              RookX Career XP
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              "Don't just choose your career. Try it. Build toward it. Earn it." Earn XP by completing tasks, simulations, and skill challenges.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-cyber-neonPurple/50 bg-cyber-dark/80 text-center shrink-0 min-w-[170px] shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL CAREER XP</span>
            <span className="text-3xl font-extrabold text-white bg-gradient-to-r from-cyber-neonPurple via-cyber-neonCyan to-amber-400 bg-clip-text text-transparent">
              {totalXp.toLocaleString()} XP
            </span>
            <span className="text-[10px] text-cyber-neonPurple block mt-1 font-bold">
              LEVEL {levelInfo.level} • {levelInfo.name}
            </span>
          </div>
        </div>
      </section>

      {/* LEVEL PROGRESSION BAR */}
      <section className="glass-panel border-glow-purple p-6 rounded-2xl space-y-6 scanlines">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-xs font-bold text-cyber-neonPurple uppercase tracking-widest">CURRENT LEVEL STATUS</span>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              LEVEL {levelInfo.level < 10 ? `0${levelInfo.level}` : levelInfo.level} — {levelInfo.name}
            </h2>
          </div>

          <span className="text-xs font-bold text-slate-300">
            {levelInfo.isMaxLevel 
              ? 'MAX LEVEL REACHED!' 
              : `${totalXp.toLocaleString()} / ${levelInfo.maxXp.toLocaleString()} XP (${levelInfo.xpToNextLevel} XP to Level ${levelInfo.level + 1})`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
            <div 
              className="bg-gradient-to-r from-cyber-neonPurple via-cyber-neonCyan to-amber-400 h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              style={{ width: `${levelInfo.progressPct}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Level {levelInfo.level} ({levelInfo.minXp} XP)</span>
            <span>{levelInfo.progressPct}% Progress</span>
            <span>Level {levelInfo.level < 10 ? levelInfo.level + 1 : 10} ({levelInfo.maxXp} XP)</span>
          </div>
        </div>

        {/* Level Path Grid */}
        <div className="pt-4 border-t border-cyber-border/40">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-4">
            10-Level Career Master Journey
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {XP_LEVELS.map(lvl => {
              const isCurrent = levelInfo.level === lvl.level;
              const isReached = levelInfo.level >= lvl.level;

              return (
                <div 
                  key={lvl.level}
                  className={`p-3 rounded-xl border transition-all text-center space-y-1 ${
                    isCurrent 
                      ? 'border-cyber-neonPurple bg-cyber-neonPurple/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                      : isReached 
                        ? 'border-cyber-neonCyan/40 bg-cyber-neonCyan/5 text-slate-200' 
                        : 'border-cyber-border/40 bg-cyber-dark/20 text-slate-500 opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-bold block uppercase">LVL {lvl.level}</span>
                  <span className="text-xs font-bold block truncate">{lvl.name}</span>
                  <span className="text-[9px] text-slate-400 block font-mono">{lvl.minXp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🏅 ACHIEVEMENTS & BADGES GRID */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Star size={18} className="text-amber-400" />
              Career Badges & Achievements
            </h2>
            <p className="text-xs text-slate-400">
              Unlocked: {unlockedSet.size} of {BADGES.length} Badges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BADGES.map(badge => {
            const isUnlocked = unlockedSet.has(badge.id);

            return (
              <div 
                key={badge.id}
                className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 scanlines ${
                  isUnlocked 
                    ? 'border-cyber-neonPurple/60 bg-cyber-neonPurple/10 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                    : 'border-cyber-border/40 bg-cyber-dark/30 text-slate-400 opacity-70'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="text-3xl p-2 rounded-xl bg-cyber-dark/60 border border-cyber-border/50">
                      {badge.icon}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold border ${
                      isUnlocked 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-base font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                      {badge.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-cyber-border/40 space-y-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Requirement: <span className="text-slate-300">{badge.requirementText}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Zap size={12} /> +{badge.xpReward} XP Reward
                    </span>
                    {!isUnlocked && (
                      <span className="text-[10px] text-slate-500 italic">
                        🔒 Complete task to unlock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="glass-panel border-glow-cyan p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white uppercase">Ready To Earn More XP?</h3>
          <p className="text-xs text-slate-400">
            Complete career simulations or roadmap tasks to level up faster.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setTab('try_career')}
            className="cyber-btn cyber-btn-purple px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
          >
            TRY CAREER SIMULATION →
          </button>
          <button
            onClick={() => setTab('roadmap')}
            className="px-4 py-2 rounded-lg border border-cyber-border bg-cyber-dark/60 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            ACTION ROADMAP →
          </button>
        </div>
      </section>

    </div>
  );
}
