import React, { useState, useEffect } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { 
  Calendar, Award, BookOpen, CheckSquare, Square, 
  Sparkles, ArrowRight, CheckCircle2, TrendingUp, RefreshCw, Layers, FileText, ChevronRight
} from 'lucide-react';

export default function Roadmap({ profile, assessment, targetCareerId, setTab, onUpdateSkills }) {
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

  // Calculate baseline readiness score
  const getBaselineReadiness = () => {
    const s1 = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
    const s2 = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
    const s3 = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
    const s4 = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
    return Math.round((s1 + s2 + s3 + s4) / 4);
  };
  const baselineReadiness = getBaselineReadiness();

  // Load active roadmap iteration from localStorage
  const [roadmapIteration, setRoadmapIteration] = useState(() => {
    return Number(localStorage.getItem(`roadmap_iter_${career.id}`)) || 1;
  });

  // Load completed tasks from localStorage
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

  // Load roadmap history
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

  useEffect(() => {
    localStorage.setItem(`roadmap_tasks_${career.id}_v${roadmapIteration}`, JSON.stringify(completedTasks));
  }, [completedTasks, career.id, roadmapIteration]);

  useEffect(() => {
    localStorage.setItem(`roadmap_history_${career.id}`, JSON.stringify(roadmapHistory));
  }, [roadmapHistory, career.id]);

  // Construct progressive 4-week tasks based on actual skill gaps
  const getTasksForCareer = () => {
    return [
      {
        weekNum: 1,
        title: "WEEK 1 — FOUNDATION",
        objective: `Build the missing core fundamentals of ${gap1.name} and ${gap2.name}.`,
        whyMatters: "Solid fundamentals ensure fast progress without confusion.",
        timeEst: "3-4 Hours",
        tasks: [
          `Complete ${gap1.name} syntax, variables, and function exercises`,
          `Set up local workspace for ${gap1.name} development`,
          `Solve 5 beginner logic & coding problems covering ${gap2.name}`,
          `Review core workflow documentation for ${gap3.name}`
        ]
      },
      {
        weekNum: 2,
        title: "WEEK 2 — PRACTICE",
        objective: `Apply fundamentals through guided exercises and problem sets.`,
        whyMatters: "Hands-on practice turns theory into real working confidence.",
        timeEst: "4-5 Hours",
        tasks: [
          `Solve 10 guided challenges targeting ${gap1.name}`,
          `Implement data transformations using ${gap2.name}`,
          `Practice branch creation and commits using ${gap3.name}`,
          `Build a small interactive test script`
        ]
      },
      {
        weekNum: 3,
        title: "WEEK 3 — REAL-WORLD APPLICATION",
        objective: `Use your skills in a practical mini-project.`,
        whyMatters: "Employers evaluate real working code and projects.",
        timeEst: "5-6 Hours",
        tasks: [
          `Build a working mini-project: "${career.recommendedProjects[0]?.title || 'Portfolio Project'}"`,
          `Integrate ${gap1.name} component flow and state management`,
          `Store project data using ${gap2.name}`,
          `Push project code to GitHub with a clean README file`
        ]
      },
      {
        weekNum: 4,
        title: "WEEK 4 — VALIDATION",
        objective: `Test your understanding and measure your progress.`,
        whyMatters: "Validating your gains proves readiness and highlights next steps.",
        timeEst: "3-4 Hours",
        tasks: [
          `Perform code cleanup and verify all feature endpoints`,
          `Review project architecture with the AI mentor`,
          `Update resume with new skills & project link`,
          `Complete the Post-Roadmap Progress Reassessment`
        ]
      }
    ];
  };

  const weeklySchedule = getTasksForCareer();

  const toggleTask = (weekIdx, taskIdx) => {
    const key = `${weekIdx}_${taskIdx}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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

  // Reassessment Questions targeting trained skills
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

  const handleSelectReassessmentAnswer = (qId, optionIdx) => {
    setReassessmentAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  // Process Reassessment Results
  const [resultsData, setResultsData] = useState(null);

  const handleFinishReassessment = () => {
    let correctCount = 0;
    reassessmentQuestions.forEach((q) => {
      if (reassessmentAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const scoreBoost = Math.round((correctCount / reassessmentQuestions.length) * 22) + 8;
    const afterGap1 = Math.min(95, gap1.currentVal + scoreBoost);
    const afterGap2 = Math.min(92, gap2.currentVal + Math.round(scoreBoost * 0.9));
    const afterGap3 = Math.min(98, gap3.currentVal + Math.round(scoreBoost * 1.1));

    const gain1 = afterGap1 - gap1.currentVal;
    const gain2 = afterGap2 - gap2.currentVal;
    const gain3 = afterGap3 - gap3.currentVal;

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

    // UPDATE ACTUAL USER SKILL METRICS SO NEXT ROADMAP CALCULATES NEW TOP GAPS!
    if (onUpdateSkills) {
      onUpdateSkills({
        coding: afterGap1,
        aptitude: afterGap2,
        sql: afterGap3
      });
    }

    // Save to Roadmap History
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
    <div className="glass-panel border-glow-purple p-6 rounded-xl relative scanlines space-y-6 animate-fadeIn font-mono">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyber-border pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-cyber-neonPurple animate-pulse" />
            PERSONALIZED ACTION ROADMAP
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Adaptive 4-week learning pathway targeting identified skill gaps</p>
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
                    p-3 rounded-lg border text-left transition-all relative font-mono
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

          {/* ACTIVE WEEK CONTENT */}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {weekData.tasks.map((task, taskIdx) => {
                      const isChecked = !!completedTasks[`${weekData.weekNum - 1}_${taskIdx}`];
                      return (
                        <div 
                          key={taskIdx}
                          onClick={() => toggleTask(weekData.weekNum - 1, taskIdx)}
                          className={`
                            p-3.5 rounded-lg border cursor-pointer select-none transition-all flex items-start gap-3
                            ${isChecked 
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-slate-300' 
                              : 'border-cyber-border bg-cyber-dark/40 text-slate-200 hover:border-slate-600 hover:text-white'}
                          `}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isChecked ? (
                              <CheckSquare className="text-emerald-400" size={18} />
                            ) : (
                              <Square className="text-slate-500" size={18} />
                            )}
                          </div>
                          <span className="text-xs leading-relaxed font-bold">{task}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* MILESTONE CARD WHEN WEEK IS COMPLETE */}
                  {complete && (
                    <div className="p-4 border border-emerald-500/40 bg-emerald-500/10 rounded-xl space-y-3 animate-fadeIn">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 size={18} /> WEEK {weekData.weekNum} COMPLETE ✓
                      </div>
                      <p className="text-xs text-slate-200">
                        You've completed all tasks for this stage! Skills practiced: {gap1.name}, {gap2.name}.
                      </p>

                      {weekData.weekNum < 4 ? (
                        <button
                          onClick={() => setActiveWeek(weekData.weekNum + 1)}
                          className="cyber-btn cyber-btn-purple px-4 py-2 rounded text-xs font-bold text-white flex items-center gap-2"
                        >
                          START WEEK {weekData.weekNum + 1} <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => setViewState('reassessment')}
                          className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded text-xs font-bold text-white flex items-center gap-2 animate-pulse"
                        >
                          🎉 TAKE PROGRESS REASSESSMENT <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* WEEK 4 COMPLETED BANNER (IF ALL 4 WEEKS FINISHED) */}
          {overallProgressPct === 100 && viewState === 'roadmap' && (
            <div className="p-6 border border-cyber-neonPurple bg-cyber-neonPurple/10 rounded-xl text-center space-y-4 animate-fadeIn">
              <h3 className="text-xl font-bold text-white">🎉 4-WEEK ROADMAP COMPLETE!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                You've completed your targeted learning roadmap. Now let's measure what changed and evaluate your progress gains.
              </p>
              <button
                onClick={() => setViewState('reassessment')}
                className="cyber-btn cyber-btn-purple px-8 py-3 rounded-lg text-sm font-bold text-white inline-flex items-center gap-2"
              >
                TAKE PROGRESS REASSESSMENT <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* VIEW STATE 2: POST-ROADMAP REASSESSMENT QUIZ */}
      {viewState === 'reassessment' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="border-b border-cyber-border pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="text-cyber-neonPurple" size={18} />
              Post-Roadmap Progress Reassessment
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Answer 4 targeted questions to evaluate the skills you trained over the past 4 weeks.</p>
          </div>

          <div className="space-y-6">
            {reassessmentQuestions.map((q, qIdx) => (
              <div key={q.id} className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-cyber-neonPurple font-bold uppercase">Question {qIdx + 1} • {q.skill}</span>
                </div>
                <h4 className="text-xs font-bold text-white">{q.question}</h4>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const selected = reassessmentAnswers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectReassessmentAnswer(q.id, optIdx)}
                        className={`
                          p-3 rounded-lg border text-left text-xs transition-all flex items-center gap-2 font-mono
                          ${selected 
                            ? 'border-cyber-neonPurple bg-cyber-neonPurple/20 text-white font-bold' 
                            : 'border-cyber-border bg-cyber-dark/60 text-slate-300 hover:border-slate-600'}
                        `}
                      >
                        <span className="w-5 h-5 rounded-full border border-cyber-border flex items-center justify-center text-[10px] shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-cyber-border">
            <button
              onClick={handleFinishReassessment}
              disabled={Object.keys(reassessmentAnswers).length < reassessmentQuestions.length}
              className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded text-xs font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              SUBMIT & SEE IMPROVEMENT REPORT <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* VIEW STATE 3: BEFORE VS AFTER IMPROVEMENT REPORT & NEXT PHASE */}
      {viewState === 'results' && resultsData && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-6 border border-emerald-500/40 bg-emerald-500/10 rounded-xl space-y-4 text-center">
            <h3 className="text-xl font-bold text-white">YOUR 4-WEEK PROGRESS REPORT</h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Here is your measured skill gain comparing your scores before and after completing your 4-week roadmap.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/50 bg-emerald-500/20 text-emerald-400 text-sm font-bold">
              <TrendingUp size={18} /> Overall Readiness: {resultsData.beforeReadiness} → {resultsData.afterReadiness} (+{resultsData.overallGain} points)
            </div>
          </div>

          {/* BEFORE VS AFTER SKILL COMPARISON */}
          <div className="space-y-3">
            <h4 className="hud-label text-slate-300">Measured Skill Improvements</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resultsData.gaps.map((item, idx) => (
                <div key={idx} className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-xl space-y-2 font-mono">
                  <span className="text-xs font-bold text-white block">{item.name}</span>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Before: <strong>{item.before}%</strong></span>
                    <span>After: <strong className="text-white">{item.after}%</strong></span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-cyber-border">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${item.after}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold block text-right">+{item.gain} points gain</span>
                </div>
              ))}
            </div>
          </div>

          {/* ADAPTIVE NEXT PHASE OUTCOME */}
          <div className="p-6 border border-cyber-border bg-cyber-dark/50 rounded-xl space-y-4">
            {resultsData.afterReadiness < 70 ? (
              /* OUTCOME A: SKILL GAPS STILL NEED WORK */
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">NEXT ROADMAP RECOMMENDED</span>
                <h4 className="text-base font-bold text-white">You improved significantly, but these areas still need attention:</h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>{gap1.name} (Advanced exercises & projects)</li>
                  <li>{gap2.name} (Problem complexity & time efficiency)</li>
                </ul>
                <button
                  onClick={handleGenerateNextRoadmap}
                  className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded text-xs font-bold text-white flex items-center gap-2 mt-2"
                >
                  GENERATE NEXT 4-WEEK PLAN <ArrowRight size={14} />
                </button>
              </div>
            ) : resultsData.afterReadiness < 85 ? (
              /* OUTCOME B: STRONG LEVEL REACHED */
              <div className="space-y-3">
                <span className="text-xs font-bold text-cyber-neonCyan uppercase tracking-wider block">CAREER READINESS IMPROVED ✓</span>
                <h4 className="text-base font-bold text-white">You're now strongly aligned with your target career ({career.name}).</h4>
                <p className="text-xs text-slate-300">Recommended next step: <strong>BUILD & PROVE</strong> — Apply your skills in portfolio projects.</p>
                <button
                  onClick={() => setTab('reality')}
                  className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded text-xs font-bold text-white flex items-center gap-2 mt-2"
                >
                  START PROJECT CHALLENGE <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              /* OUTCOME C: CAREER LAUNCH READY */
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">NEXT PHASE: CAREER LAUNCH</span>
                <h4 className="text-base font-bold text-white">Your skill foundation is strong! You are ready for placement preparation.</h4>
                <p className="text-xs text-slate-300">Recommended next step: Resume optimization, portfolio showcase, and mock interview practice.</p>
                <button
                  onClick={() => setTab('resume')}
                  className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded text-xs font-bold text-white flex items-center gap-2 mt-2"
                >
                  START CAREER PREPARATION <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ROADMAP HISTORY SECTION */}
      {roadmapHistory.length > 0 && (
        <div className="pt-4 border-t border-cyber-border space-y-3 font-mono">
          <span className="hud-label text-slate-400 font-bold">ROADMAP HISTORY</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {roadmapHistory.map((h) => (
              <div key={h.id} className="p-3 border border-cyber-border/60 bg-cyber-dark/30 rounded-lg flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-white">{h.title}</div>
                  <div className="text-[10px] text-slate-400">Completed: {h.completedDate}</div>
                </div>
                <span className="text-xs text-emerald-400 font-bold">+{h.overallGain} Readiness</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
