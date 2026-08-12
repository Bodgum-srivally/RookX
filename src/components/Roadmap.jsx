import React, { useState, useEffect } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { 
  Calendar, Award, BookOpen, CheckSquare, Square, 
  Sparkles, ArrowRight, CheckCircle2, TrendingUp, RefreshCw, Layers, FileText, ChevronRight, Zap, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Roadmap({ profile, assessment, targetCareerId, setTab, onUpdateSkills, onAwardXP }) {
  const career = CAREER_LIST.find(c => c.id === targetCareerId) || CAREER_LIST[0];

  // State: active view ('roadmap', 'reassessment', 'results')
  const [viewState, setViewState] = useState('roadmap');
  const [reassessmentAnswers, setReassessmentAnswers] = useState({});
  const [activeWeek, setActiveWeek] = useState(1);

  const getBlendedMetric = (profileVal, assessmentVal) => {
    const p = profileVal !== undefined ? Number(profileVal) : 50;
    const a = assessmentVal !== undefined ? Number(assessmentVal) : 50;
    return Math.round(p * 0.6 + a * 0.4);
  };

  // Identify student's actual skill gaps for the selected career
  const getGapsSorted = () => {
    return career.requiredSkills.map(reqSkill => {
      let currentVal = 50;
      const nameLower = reqSkill.name.toLowerCase();

      if (nameLower.includes('react') || nameLower.includes('javascript') || nameLower.includes('git')) {
        currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
      } else if (nameLower.includes('algorithm') || nameLower.includes('data structure') || nameLower.includes('dsa')) {
        currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude);
      } else if (nameLower.includes('sql') || nameLower.includes('query') || nameLower.includes('database')) {
        currentVal = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
      } else if (nameLower.includes('statistic') || nameLower.includes('probability') || nameLower.includes('math')) {
        currentVal = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
      } else if (nameLower.includes('figma') || nameLower.includes('design')) {
        currentVal = getBlendedMetric(profile.skills?.design_principles, 50);
      } else if (nameLower.includes('strategy') || nameLower.includes('roadmap') || nameLower.includes('product')) {
        currentVal = getBlendedMetric(profile.skills?.business_strategy, 50);
      } else {
        currentVal = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
      }

      currentVal = Math.max(15, Math.min(95, currentVal));
      return {
        name: reqSkill.name,
        currentVal,
        requiredLevel: reqSkill.level,
        gap: Math.max(5, reqSkill.level - currentVal)
      };
    }).sort((a, b) => b.gap - a.gap);
  };

  const sortedGaps = getGapsSorted();
  const gap1 = sortedGaps[0] || { name: 'Programming & Logic', currentVal: 45, gap: 30 };
  const gap2 = sortedGaps[1] || { name: 'Data Structures & Algorithms', currentVal: 40, gap: 25 };
  const gap3 = sortedGaps[2] || { name: 'System Tools & Git', currentVal: 50, gap: 15 };

  const getBaselineReadiness = () => {
    const s1 = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
    const s2 = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
    const s3 = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
    const s4 = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
    return Math.round((s1 + s2 + s3 + s4) / 4);
  };
  const baselineReadiness = getBaselineReadiness();

  const [roadmapIteration, setRoadmapIteration] = useState(() => {
    return Number(localStorage.getItem(`roadmap_iter_${career.id}`)) || 1;
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem(`roadmap_tasks_${career.id}_v${roadmapIteration}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const [roadmapHistory, setRoadmapHistory] = useState(() => {
    const saved = localStorage.getItem(`roadmap_history_${career.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [resultsData, setResultsData] = useState(null);

  useEffect(() => {
    localStorage.setItem(`roadmap_tasks_${career.id}_v${roadmapIteration}`, JSON.stringify(completedTasks));
  }, [completedTasks, career.id, roadmapIteration]);

  useEffect(() => {
    localStorage.setItem(`roadmap_history_${career.id}`, JSON.stringify(roadmapHistory));
  }, [roadmapHistory, career.id]);

  // Structured action plan tasks with skill tags, time estimates, and XP rewards
  const getTasksForCareer = () => {
    return [
      {
        weekNum: 1,
        title: "WEEK 1 — FOUNDATIONS & CORE CONCEPTS",
        objective: `Focus on closing initial priority gaps: ${gap1.name} and ${gap2.name}.`,
        whyMatters: "Building strong fundamentals prevents compounding errors later in your career.",
        timeEst: "3-4 Hours",
        tasks: [
          { title: `Complete fundamental tutorial modules for ${gap1.name}`, skill: gap1.name, time: "45 min", xp: 50, readiness: "+2%" },
          { title: `Setup local development environment & version control workspace`, skill: "Dev Setup", time: "30 min", xp: 50, readiness: "+2%" },
          { title: `Solve 5 beginner logic & coding problems covering ${gap2.name}`, skill: gap2.name, time: "60 min", xp: 100, readiness: "+3%" },
          { title: `Review core workflow documentation for ${gap3.name}`, skill: gap3.name, time: "30 min", xp: 50, readiness: "+2%" }
        ]
      },
      {
        weekNum: 2,
        title: "WEEK 2 — GUIDED PRACTICE & PROBLEM SETS",
        objective: `Apply fundamentals through targeted exercises and problem sets.`,
        whyMatters: "Hands-on practice turns theory into real working confidence.",
        timeEst: "4-5 Hours",
        tasks: [
          { title: `Solve 10 guided challenges targeting ${gap1.name}`, skill: gap1.name, time: "60 min", xp: 100, readiness: "+3%" },
          { title: `Implement data queries & transformations using ${gap2.name}`, skill: gap2.name, time: "45 min", xp: 50, readiness: "+2%" },
          { title: `Practice branch creation and commits using ${gap3.name}`, skill: gap3.name, time: "30 min", xp: 50, readiness: "+2%" },
          { title: `Build a small interactive test script`, skill: "Practical Code", time: "45 min", xp: 75, readiness: "+3%" }
        ]
      },
      {
        weekNum: 3,
        title: "WEEK 3 — REAL-WORLD APPLICATION",
        objective: `Use your skills in a practical mini-project.`,
        whyMatters: "Employers evaluate real working code and projects.",
        timeEst: "5-6 Hours",
        tasks: [
          { title: `Build working project: "${career.recommendedProjects[0]?.title || 'Portfolio Project'}"`, skill: "Portfolio Project", time: "120 min", xp: 250, readiness: "+8%" },
          { title: `Integrate ${gap1.name} component flow and state management`, skill: gap1.name, time: "45 min", xp: 75, readiness: "+3%" },
          { title: `Store project data cleanly using ${gap2.name}`, skill: gap2.name, time: "45 min", xp: 50, readiness: "+2%" },
          { title: `Push project code to GitHub with a clean README file`, skill: "Git & Documentation", time: "30 min", xp: 75, readiness: "+3%" }
        ]
      },
      {
        weekNum: 4,
        title: "WEEK 4 — VALIDATION & REASSESSMENT",
        objective: `Test your understanding and measure your progress.`,
        whyMatters: "Validating your gains proves readiness and highlights next steps.",
        timeEst: "3-4 Hours",
        tasks: [
          { title: `Perform code cleanup and verify all feature endpoints`, skill: "Code Review", time: "45 min", xp: 75, readiness: "+3%" },
          { title: `Review project architecture with the AI mentor`, skill: "System Architecture", time: "30 min", xp: 50, readiness: "+2%" },
          { title: `Update resume with new skills & project link`, skill: "Career Prep", time: "30 min", xp: 75, readiness: "+3%" },
          { title: `Complete the Post-Roadmap Progress Reassessment`, skill: "Reassessment", time: "20 min", xp: 100, readiness: "+5%" }
        ]
      }
    ];
  };

  const weeklySchedule = getTasksForCareer();

  const toggleTask = (weekIdx, taskIdx, taskObj) => {
    const key = `${weekIdx}_${taskIdx}`;
    const isNowDone = !completedTasks[key];

    setCompletedTasks(prev => ({
      ...prev,
      [key]: isNowDone
    }));

    if (isNowDone) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      if (onAwardXP) {
        onAwardXP(taskObj.xp || 50, `Completed Roadmap Task: ${taskObj.title}`, { taskId: `roadmap_${weekIdx}_${taskIdx}` });
      }
    }
  };

  // Progress Calculations
  const totalTasks = weeklySchedule.reduce((acc, w) => acc + w.tasks.length, 0);
  const doneCount = Object.values(completedTasks).filter(Boolean).length;
  const overallProgressPct = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const isWeekComplete = (weekNum) => {
    const weekData = weeklySchedule[weekNum - 1];
    if (!weekData) return false;
    return weekData.tasks.every((_, taskIdx) => !!completedTasks[`${weekNum - 1}_${taskIdx}`]);
  };

  const isWeekUnlocked = (weekNum) => {
    if (weekNum === 1) return true;
    return isWeekComplete(weekNum - 1);
  };

  const reassessmentQuestions = [
    {
      id: 'q1',
      skill: gap1.name,
      question: `In ${gap1.name}, what is the best practice for handling state updates or modular logic?`,
      options: [
        `Keep logic immutable and update state cleanly`,
        `Mutate state directly anywhere`,
        `Ignore error handling and hardcode values`,
        `Use global variables for all operations`
      ],
      correct: 0
    },
    {
      id: 'q2',
      skill: gap2.name,
      question: `When optimizing ${gap2.name}, which data structure/approach yields optimal time complexity?`,
      options: [
        `Nested loops over linear arrays`,
        `Hash maps / indexed lookups (O(1) average time)`,
        `Randomly sorting arrays on every call`,
        `Re-reading data from disk sequentially`
      ],
      correct: 1
    },
    {
      id: 'q3',
      skill: gap3.name,
      question: `What is the primary benefit of isolating features using ${gap3.name} branches?`,
      options: [
        `It slows down development`,
        `It prevents broken code from affecting the main codebase`,
        `It automatically writes unit tests`,
        `It deletes old git commits`
      ],
      correct: 1
    },
    {
      id: 'q4',
      skill: 'Project Integration',
      question: `What is the most effective way to demonstrate career readiness to hiring teams?`,
      options: [
        `Only listing skill keywords on a resume`,
        `Deploying a working GitHub project with documentation`,
        `Memorizing definitions without building projects`,
        `Skipping code review`
      ],
      correct: 1
    }
  ];

  const handleReassessmentAnswer = (qId, optionIdx) => {
    setReassessmentAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleCalculateReassessmentResults = () => {
    let correctCount = 0;
    reassessmentQuestions.forEach(q => {
      if (reassessmentAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const scoreRatio = correctCount / reassessmentQuestions.length;
    const gain1 = Math.round(15 * scoreRatio + 5);
    const gain2 = Math.round(12 * scoreRatio + 4);
    const gain3 = Math.round(10 * scoreRatio + 3);

    const afterGap1 = Math.min(95, gap1.currentVal + gain1);
    const afterGap2 = Math.min(95, gap2.currentVal + gain2);
    const afterGap3 = Math.min(95, gap3.currentVal + gain3);

    const afterReadiness = Math.min(98, baselineReadiness + Math.round((gain1 + gain2 + gain3) / 3));
    const overallGain = afterReadiness - baselineReadiness;

    const computedResults = {
      correctCount,
      totalCount: reassessmentQuestions.length,
      beforeReadiness: baselineReadiness,
      afterReadiness,
      overallGain,
      gaps: [
        { name: gap1.name, before: gap1.currentVal, after: afterGap1, gain: gain1 },
        { name: gap2.name, before: gap2.currentVal, after: afterGap2, gain: gain2 },
        { name: gap3.name, before: gap3.currentVal, after: afterGap3, gain: gain3 }
      ]
    };

    setResultsData(computedResults);
    setViewState('results');

    if (onUpdateSkills) {
      onUpdateSkills({
        coding: afterGap1,
        aptitude: afterGap2,
        sql: afterGap3
      });
    }

    const historyItem = {
      id: Date.now(),
      iteration: roadmapIteration,
      title: `Roadmap #${roadmapIteration} — ${gap1.name} Focus`,
      completedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      overallGain
    };
    setRoadmapHistory(prev => [historyItem, ...prev]);
  };

  const handleGenerateNextRoadmap = () => {
    const nextIter = roadmapIteration + 1;
    setRoadmapIteration(nextIter);
    localStorage.setItem(`roadmap_iter_${career.id}`, nextIter);
    setCompletedTasks({});
    setViewState('roadmap');
    setActiveWeek(1);
  };

  return (
    <div className="glass-panel border-glow-purple p-6 rounded-xl relative scanlines space-y-6 animate-fadeIn font-mono pb-12">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyber-border pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-cyber-neonPurple animate-pulse" />
            PERSONALIZED 4-WEEK ACTION ROADMAP
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Interactive skill development roadmap with XP & Readiness rewards</p>
        </div>
        <div className="font-mono text-right shrink-0">
          <div className="text-xs text-slate-400">Target Career Goal</div>
          <span className="text-sm text-cyber-neonPurple font-bold">{career.name}</span>
        </div>
      </div>

      {/* VIEW STATE 1: MAIN ROADMAP VIEW */}
      {viewState === 'roadmap' && (
        <div className="space-y-6">
          
          {/* ROADMAP BASIS CARD */}
          <div className="p-4 border border-cyber-neonPurple/30 bg-cyber-neonPurple/5 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-cyber-neonPurple uppercase tracking-wider">ROADMAP BASIS</span>
              <span className="text-[10px] text-slate-400">Iteration #{roadmapIteration}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Your roadmap was created from your highest-priority skill gaps identified in your assessment & reality check:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 border border-cyber-border bg-cyber-dark/40 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">1. Priority Gap</span>
                <div className="text-xs font-bold text-white truncate">{gap1.name}</div>
                <span className="text-[10px] text-cyber-neonRose font-bold">-{gap1.gap} pt gap</span>
              </div>

              <div className="p-2.5 border border-cyber-border bg-cyber-dark/40 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">2. Priority Gap</span>
                <div className="text-xs font-bold text-white truncate">{gap2.name}</div>
                <span className="text-[10px] text-cyber-neonCyan font-bold">-{gap2.gap} pt gap</span>
              </div>

              <div className="p-2.5 border border-cyber-border bg-cyber-dark/40 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">3. Priority Gap</span>
                <div className="text-xs font-bold text-white truncate">{gap3.name}</div>
                <span className="text-[10px] text-emerald-400 font-bold">-{gap3.gap} pt gap</span>
              </div>
            </div>
          </div>

          {/* OVERALL ROADMAP PROGRESS TRACKER */}
          <div className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyber-neonPurple/15 text-cyber-neonPurple shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase">Roadmap Progress Tracker</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Tasks Completed: {doneCount} / {totalTasks} ({overallProgressPct}%)</div>
              </div>
            </div>

            <div className="w-full sm:w-1/2 flex items-center gap-3">
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-cyber-border">
                <div 
                  className="bg-cyber-neonPurple h-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  style={{ width: `${overallProgressPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-cyber-neonPurple shrink-0">{overallProgressPct}%</span>
            </div>
          </div>

          {/* WEEKLY PROGRESS STATUS BADGES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {weeklySchedule.map((w) => {
              const complete = isWeekComplete(w.weekNum);
              const unlocked = isWeekUnlocked(w.weekNum);
              return (
                <button
                  key={w.weekNum}
                  onClick={() => unlocked && setActiveWeek(w.weekNum)}
                  className={`
                    p-3 rounded-lg border text-left transition-all relative font-mono cursor-pointer
                    ${complete 
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-white' 
                      : activeWeek === w.weekNum 
                      ? 'border-cyber-neonPurple bg-cyber-neonPurple/20 text-white' 
                      : unlocked 
                      ? 'border-cyber-border bg-cyber-dark/40 text-slate-300 hover:border-slate-600' 
                      : 'border-cyber-border/30 bg-cyber-dark/20 text-slate-600 cursor-not-allowed'}
                  `}
                >
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Week {w.weekNum}</div>
                  <div className="text-xs font-bold truncate mt-0.5">
                    {complete ? 'Complete ✓' : unlocked ? (activeWeek === w.weekNum ? 'In Progress' : 'Unlocked') : 'Locked 🔒'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ACTIVE WEEK CONTENT WITH ENHANCED TASK ITEMS (Part 10 Requirement) */}
          <div className="space-y-4">
            {weeklySchedule.map((weekData) => {
              if (weekData.weekNum !== activeWeek) return null;
              const complete = isWeekComplete(weekData.weekNum);

              return (
                <div key={weekData.weekNum} className="space-y-4 p-5 border border-cyber-border bg-cyber-dark/30 rounded-xl">
                  
                  {/* Week Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyber-border/60 pb-3 gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-cyber-neonPurple" size={18} />
                        {weekData.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">{weekData.objective}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">💡 Why it matters: {weekData.whyMatters}</span>
                    </div>

                    <span className="text-xs text-cyber-neonCyan font-bold shrink-0">
                      Est. Time: {weekData.timeEst}
                    </span>
                  </div>

                  {/* Tasks Checklist Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {weekData.tasks.map((task, taskIdx) => {
                      const isChecked = !!completedTasks[`${weekData.weekNum - 1}_${taskIdx}`];
                      return (
                        <div 
                          key={taskIdx}
                          onClick={() => toggleTask(weekData.weekNum - 1, taskIdx, task)}
                          className={`
                            p-4 rounded-xl border cursor-pointer select-none transition-all flex flex-col justify-between space-y-3
                            ${isChecked 
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-white' 
                              : 'border-cyber-border bg-cyber-dark/40 hover:border-cyber-neonPurple hover:bg-cyber-neonPurple/5 text-slate-200'}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 shrink-0 ${isChecked ? 'text-emerald-400' : 'text-slate-500'}`}>
                              {isChecked ? <CheckCircle2 size={18} /> : <Square size={18} />}
                            </div>

                            <div className="space-y-1">
                              <span className={`text-xs font-bold block ${isChecked ? 'line-through text-slate-300' : 'text-white'}`}>
                                {task.title}
                              </span>
                              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold pt-1">
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  Skill: {task.skill}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                                  <Clock size={10} /> {task.time}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-cyber-border/40 flex justify-between items-center text-xs">
                            <div className="flex gap-2">
                              <span className="text-purple-400 font-bold">{task.xp} XP</span>
                              <span className="text-emerald-400 font-bold">{task.readiness} Readiness</span>
                            </div>

                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                              isChecked 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            }`}>
                              {isChecked ? '✓ Completed' : 'Complete Task'}
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* Complete Week Action Banner */}
                  <div className="pt-3 flex justify-between items-center border-t border-cyber-border/40">
                    <span className="text-xs text-slate-400">
                      {complete ? '🎉 Week Complete! Unlock next week or take reassessment.' : 'Complete all tasks to unlock progress reassessment.'}
                    </span>

                    {complete && activeWeek === 4 && (
                      <button
                        onClick={() => setViewState('reassessment')}
                        className="cyber-btn cyber-btn-purple px-5 py-2 rounded text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-lg animate-pulse"
                      >
                        TAKE REASSESSMENT TEST <ArrowRight size={14} />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* VIEW STATE 2: REASSESSMENT TEST */}
      {viewState === 'reassessment' && (
        <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
          <div className="text-center space-y-2 border-b border-cyber-border pb-4">
            <span className="text-xs font-bold text-cyber-neonPurple uppercase">POST-ROADMAP EVALUATION</span>
            <h3 className="text-xl font-bold text-white">4-Week Skill Reassessment Test</h3>
            <p className="text-xs text-slate-400">
              Answer 4 questions targeting your trained gaps ({gap1.name}, {gap2.name}, {gap3.name}) to verify skill growth.
            </p>
          </div>

          <div className="space-y-6">
            {reassessmentQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-cyber-neonCyan uppercase">QUESTION {idx + 1} • {q.skill}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{q.question}</h4>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleReassessmentAnswer(q.id, oIdx)}
                      className={`
                        w-full text-left p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer
                        ${reassessmentAnswers[q.id] === oIdx
                          ? 'border-cyber-neonPurple bg-cyber-neonPurple/20 text-white font-bold'
                          : 'border-cyber-border bg-cyber-dark/30 text-slate-300 hover:border-slate-700'}
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-cyber-border">
            <button
              onClick={() => setViewState('roadmap')}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ← Back to Roadmap
            </button>

            <button
              onClick={handleCalculateReassessmentResults}
              disabled={Object.keys(reassessmentAnswers).length < reassessmentQuestions.length}
              className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded text-xs font-bold text-white cursor-pointer disabled:opacity-50"
            >
              CALCULATE SKILL GAINS →
            </button>
          </div>
        </div>
      )}

      {/* VIEW STATE 3: RESULTS SUMMARY REPORT */}
      {viewState === 'results' && resultsData && (
        <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
          <div className="text-center space-y-2 border-b border-cyber-border pb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase">REASSESSMENT COMPLETE ✓</span>
            <h3 className="text-2xl font-extrabold text-white">Skill Growth Verified!</h3>
            <p className="text-xs text-slate-300">
              You answered {resultsData.correctCount} of {resultsData.totalCount} questions correctly.
            </p>
          </div>

          <div className="p-5 border border-emerald-500/40 bg-emerald-500/10 rounded-xl text-center space-y-2">
            <span className="text-[10px] text-slate-400 uppercase block">OVERALL CAREER READINESS BOOST</span>
            <div className="flex justify-center items-baseline gap-3">
              <span className="text-slate-400 text-lg line-through">{resultsData.beforeReadiness}%</span>
              <ArrowRight className="text-emerald-400" size={20} />
              <span className="text-3xl font-extrabold text-emerald-400">{resultsData.afterReadiness}%</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold block">+{resultsData.overallGain}% Career Readiness Improvement</span>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase block">Verified Skill Improvements:</span>
            {resultsData.gaps.map((g, idx) => (
              <div key={idx} className="p-3.5 border border-cyber-border bg-cyber-dark/40 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-white block">{g.name}</span>
                  <span className="text-[10px] text-slate-400">Baseline: {g.before}%</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-cyber-neonCyan">{g.after}%</span>
                  <span className="text-[10px] text-emerald-400 block font-bold">+{g.gain}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-cyber-border">
            <button
              onClick={() => setViewState('roadmap')}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              View Roadmap
            </button>

            <button
              onClick={handleGenerateNextRoadmap}
              className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded text-xs font-bold text-white cursor-pointer"
            >
              GENERATE ROADMAP ITERATION #{roadmapIteration + 1} →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
