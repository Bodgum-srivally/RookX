import React, { useState, useEffect } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { getCareerRoadmap, reorderRoadmapByFirstSkill } from '../data/careerRoadmaps';
import { syncUserData } from '../services/apiService';
import { 
  Calendar, Award, BookOpen, CheckSquare, Square, 
  Sparkles, ArrowRight, CheckCircle2, TrendingUp, RefreshCw, Layers, FileText, ChevronRight, Zap, Clock, Lock, Trophy, RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Roadmap({ profile, assessment, targetCareerId, setTab, onUpdateSkills, onAwardXP }) {
  const career = CAREER_LIST.find(c => c.id === targetCareerId) || CAREER_LIST[0];
  
  const [firstSkillId, setFirstSkillId] = useState(() => {
    return localStorage.getItem(`first_skill_${career.id}`) || null;
  });

  const [showSkillSelector, setShowSkillSelector] = useState(!firstSkillId);

  const rawRoadmap = getCareerRoadmap(targetCareerId);
  const careerRoadmap = firstSkillId 
    ? reorderRoadmapByFirstSkill(rawRoadmap, firstSkillId)
    : rawRoadmap;

  // Storage key for roadmap tasks
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem(`roadmap_tasks_${career.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const [activeSkillId, setActiveSkillId] = useState(() => {
    return careerRoadmap.skills[0]?.id || 'python';
  });

  useEffect(() => {
    if (firstSkillId && careerRoadmap.skills[0]) {
      // Keep active skill aligned if starting skill changes
      setActiveSkillId(careerRoadmap.skills[0].id);
    }
  }, [firstSkillId, career.id]);

  useEffect(() => {
    localStorage.setItem(`roadmap_tasks_${career.id}`, JSON.stringify(completedTasks));
    syncUserData({
      roadmaps: {
        [career.id]: {
          completedTasks
        }
      }
    });
  }, [completedTasks, career.id]);

  const handleSelectFirstSkill = (skillId) => {
    setFirstSkillId(skillId);
    localStorage.setItem(`first_skill_${career.id}`, skillId);
    setActiveSkillId(skillId);
    setShowSkillSelector(false);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  // Helper: Determine if a specific week is complete (all tasks done)
  const isWeekComplete = (weekObj) => {
    if (!weekObj || !weekObj.tasks) return false;
    return weekObj.tasks.every(t => !!completedTasks[t.id]);
  };

  // Helper: Determine if a skill is completed (all its weeks complete)
  const isSkillComplete = (skillObj) => {
    if (!skillObj || !skillObj.weeks) return false;
    return skillObj.weeks.every(w => isWeekComplete(w));
  };

  // Helper: Determine if a skill is unlocked
  const isSkillUnlocked = (skillIdx) => {
    if (skillIdx === 0) return true;
    const prevSkill = careerRoadmap.skills[skillIdx - 1];
    return isSkillComplete(prevSkill);
  };

  // Helper: Determine if a week is unlocked
  const isWeekUnlocked = (skillIdx, weekIdx) => {
    if (!isSkillUnlocked(skillIdx)) return false;
    if (weekIdx === 0) return true;
    const currentSkill = careerRoadmap.skills[skillIdx];
    const prevWeek = currentSkill?.weeks[weekIdx - 1];
    return isWeekComplete(prevWeek);
  };

  // Find currently selected or active skill object
  const activeSkillObj = careerRoadmap.skills.find(s => s.id === activeSkillId) || careerRoadmap.skills[0];
  const activeSkillIdx = careerRoadmap.skills.findIndex(s => s.id === activeSkillObj.id);

  const toggleTask = (taskId, xpVal, taskTitle) => {
    const isNowDone = !completedTasks[taskId];

    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: isNowDone
    }));

    if (isNowDone) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      if (onAwardXP) {
        onAwardXP(xpVal || 50, `Completed Roadmap Task: ${taskTitle}`, { taskId });
      }
    }
  };

  // Calculate overall career progress
  const allTasksList = careerRoadmap.skills.flatMap(s => s.weeks.flatMap(w => w.tasks));
  const totalTasksCount = allTasksList.length;
  const doneTasksCount = allTasksList.filter(t => !!completedTasks[t.id]).length;
  const overallProgressPct = totalTasksCount > 0 ? Math.round((doneTasksCount / totalTasksCount) * 100) : 0;

  // Active skill week progress
  const activeSkillTasks = activeSkillObj.weeks.flatMap(w => w.tasks);
  const activeSkillDone = activeSkillTasks.filter(t => !!completedTasks[t.id]).length;
  const activeSkillProgressPct = activeSkillTasks.length > 0 ? Math.round((activeSkillDone / activeSkillTasks.length) * 100) : 0;

  const nextSkillObj = careerRoadmap.skills[activeSkillIdx + 1];

  return (
    <div className="space-y-8 animate-fadeIn font-mono pb-12">
      
      {/* HEADER BANNER */}
      <section className="glass-panel border-glow-cyan p-6 md:p-8 rounded-2xl scanlines">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonCyan/40 bg-cyber-neonCyan/10 text-cyber-neonCyan text-xs font-bold uppercase tracking-widest">
              <Calendar size={14} className="animate-pulse" />
              HIERARCHICAL ROADMAP • {(career?.name || career?.title || careerRoadmap?.title || 'CAREER ROADMAP').toUpperCase()}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Actionable Skill Journey 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Master one skill at a time across targeted learning weeks before unlocking your next career skill.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setShowSkillSelector(true)}
              className="px-3.5 py-2.5 rounded-xl border border-cyber-neonPurple/50 bg-cyber-neonPurple/15 text-cyber-neonPurple hover:bg-cyber-neonPurple/25 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RotateCcw size={14} />
              <span>Change Starting Skill</span>
            </button>

            <div className="p-4 rounded-xl border border-cyber-neonCyan/50 bg-cyber-dark/80 text-center shrink-0 min-w-[160px]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">OVERALL CAREER PROGRESS</span>
              <span className="text-3xl font-extrabold text-cyber-neonCyan block mt-1">
                {overallProgressPct}%
              </span>
              <span className="text-[10px] text-slate-300 block font-mono">
                {doneTasksCount} of {totalTasksCount} Tasks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DESIRED FIRST SKILL SELECTION BANNER / CARD */}
      {showSkillSelector && (
        <section className="glass-panel border-glow-purple p-6 rounded-2xl space-y-4 scanlines animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-cyber-border/60 pb-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold border border-amber-400/40 bg-amber-400/10 text-amber-400 uppercase">
                <Sparkles size={13} className="animate-pulse" />
                STARTING SKILL SELECTION
              </div>
              <h2 className="text-xl font-extrabold text-white">Where would you like to start?</h2>
              <p className="text-xs text-slate-300">
                Choose your primary entry point skill for <strong>{career.name}</strong>. Your weekly tasks, missions, and quizzes will align with your choice.
              </p>
            </div>
            {firstSkillId && (
              <button 
                onClick={() => setShowSkillSelector(false)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Close Selector
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {rawRoadmap.skills.map(sk => {
              const isSelected = firstSkillId === sk.id;
              return (
                <button
                  key={sk.id}
                  onClick={() => handleSelectFirstSkill(sk.id)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyber-neonPurple bg-cyber-neonPurple/20 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-[1.03]'
                      : 'border-cyber-border bg-cyber-dark/40 hover:border-cyber-neonPurple hover:bg-cyber-neonPurple/10'
                  }`}
                >
                  <div className="text-2xl">{sk.icon}</div>
                  <div>
                    <span className="text-xs font-bold text-white block truncate">{sk.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{sk.weeks.length} Weeks</span>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] text-emerald-400 font-bold block">✓ CURRENT START</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* SKILL PROGRESSION TABS & HIERARCHY */}
      <section className="space-y-4 font-mono">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Career Skill Learning Sequence
          </span>
          <span className="text-[10px] text-cyber-neonCyan font-bold">
            Step-by-Step Skill Mastery
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {careerRoadmap.skills.map((sk, idx) => {
            const unlocked = isSkillUnlocked(idx);
            const completed = isSkillComplete(sk);
            const isSelected = sk.id === activeSkillObj.id;

            return (
              <button
                key={sk.id}
                onClick={() => {
                  if (unlocked) setActiveSkillId(sk.id);
                }}
                disabled={!unlocked}
                className={`px-4 py-3 rounded-xl border text-xs font-bold shrink-0 flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyber-neonCyan bg-cyber-neonCyan/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]'
                    : completed
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500'
                      : unlocked
                        ? 'border-cyber-border bg-cyber-dark/40 text-slate-300 hover:border-slate-500 hover:text-white'
                        : 'border-cyber-border/30 bg-cyber-dark/20 text-slate-500 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-base">{sk.icon}</span>
                <div className="text-left">
                  <span className="block text-xs font-bold">{sk.name}</span>
                  <span className="text-[9px] text-slate-400 font-mono block">
                    {completed ? '✓ COMPLETED' : unlocked ? `${sk.weeks.length} Weeks` : '🔒 LOCKED'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CURRENT ACTIVE SKILL DETAIL BANNER */}
      <section className="glass-panel border-glow-purple p-6 rounded-2xl space-y-4 scanlines font-mono">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyber-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeSkillObj.icon}</span>
              <span className="text-xs font-bold text-cyber-neonPurple uppercase tracking-widest">CURRENT FOCUS SKILL</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{activeSkillObj.name}</h2>
            <p className="text-xs text-slate-300 max-w-2xl">{activeSkillObj.description}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 block font-bold">SKILL PROGRESS</span>
            <span className="text-2xl font-extrabold text-amber-400">{activeSkillProgressPct}%</span>
          </div>
        </div>

        {/* Skill Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div 
              className="bg-gradient-to-r from-cyber-neonPurple via-cyber-neonCyan to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
              style={{ width: `${activeSkillProgressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Next Skill Lock Banner */}
        {nextSkillObj && (
          <div className="p-3 rounded-lg border border-cyber-border/60 bg-cyber-dark/40 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <Lock size={14} className="text-amber-400" />
              <span><strong>NEXT SKILL:</strong> {nextSkillObj.name}</span>
            </span>
            <span className="text-[10px] text-cyber-neonCyan font-bold">
              Unlocks after completing all {activeSkillObj.name} weeks
            </span>
          </div>
        )}
      </section>

      {/* WEEKLY TASKS FOR CURRENT SKILL */}
      <section className="space-y-6 font-mono">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock size={18} className="text-cyber-neonCyan" />
            Learning Weeks for {activeSkillObj.name}
          </h3>
          <span className="text-xs text-slate-400">
            {activeSkillObj.weeks.length} Consecutive Weeks
          </span>
        </div>

        <div className="space-y-6">
          {activeSkillObj.weeks.map((week, wIdx) => {
            const weekUnlocked = isWeekUnlocked(activeSkillIdx, wIdx);
            const weekDone = isWeekComplete(week);

            return (
              <div 
                key={week.weekNum}
                className={`glass-panel p-6 rounded-2xl border transition-all scanlines space-y-4 ${
                  weekDone
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : weekUnlocked
                      ? 'border-cyber-border bg-cyber-dark/60'
                      : 'border-cyber-border/30 bg-cyber-dark/20 opacity-60'
                }`}
              >
                {/* Week Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyber-border/40 pb-3 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyber-neonCyan uppercase">
                        {week.title}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">
                        Difficulty: {week.difficulty}
                      </span>
                      {weekDone && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          ✓ WEEK COMPLETED
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {week.topics.map((tp, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-cyber-dark border border-cyber-border text-slate-300">
                          • {tp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action to Quiz Page */}
                  <button
                    onClick={() => setTab('xp_badges')}
                    className="px-3.5 py-1.5 rounded-lg border border-cyber-neonPurple/40 bg-cyber-neonPurple/20 text-cyber-neonPurple hover:bg-cyber-neonPurple/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <span>TAKE WEEK QUIZ</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="space-y-2.5">
                  {week.tasks.map((task) => {
                    const isDone = !!completedTasks[task.id];

                    return (
                      <div
                        key={task.id}
                        onClick={() => {
                          if (weekUnlocked) toggleTask(task.id, task.xp, task.title);
                        }}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                          weekUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                        } ${
                          isDone
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                            : weekUnlocked
                              ? 'border-cyber-border bg-cyber-dark/40 text-slate-300 hover:border-slate-500'
                              : 'border-cyber-border/30 bg-cyber-dark/20 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isDone ? (
                            <CheckSquare size={18} className="text-emerald-400 shrink-0" />
                          ) : (
                            <Square size={18} className="text-slate-500 shrink-0" />
                          )}
                          <div>
                            <span className={`text-xs font-bold block ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{task.time} • Skill: {task.skill}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-amber-400 shrink-0">
                          +{task.xp} XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
