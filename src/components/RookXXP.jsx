import React, { useState } from 'react';
import { 
  Award, Zap, CheckCircle2, Lock, Sparkles, ShieldCheck, 
  Flame, Target, Star, ChevronRight, RotateCcw, Brain, RefreshCw, HelpCircle, AlertCircle, ArrowLeft
} from 'lucide-react';
import { getLevelInfo, XP_LEVELS, BADGES } from '../utils/gamification';
import { generateAIQuestions } from '../services/aiQuestionService';
import { getCareerRoadmap, reorderRoadmapByFirstSkill } from '../data/careerRoadmaps';

export default function RookXXP({ gamificationState, readinessScore = 54, setTab, onAwardXP, targetCareerId = 'software_engineer' }) {
  const totalXp = gamificationState?.xp || 0;
  const levelInfo = getLevelInfo(totalXp);
  const unlockedSet = new Set(gamificationState?.unlockedBadges || []);
  const completedTasks = gamificationState?.completedTasks || [];

  const rawRoadmap = getCareerRoadmap(targetCareerId);
  const savedFirstSkill = localStorage.getItem(`first_skill_${targetCareerId}`);
  const careerRoadmap = savedFirstSkill ? reorderRoadmapByFirstSkill(rawRoadmap, savedFirstSkill) : rawRoadmap;

  // Flatten all skill weeks into a continuous level sequence
  const flatRoadmapWeeks = careerRoadmap.skills.flatMap(s => 
    s.weeks.map(w => ({
      ...w,
      skillId: s.id,
      skillName: s.name,
      skillIcon: s.icon
    }))
  );

  // Quiz State
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [quizState, setQuizState] = useState('idle'); // 'idle' | 'loading' | 'active' | 'results'
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [lockToast, setLockToast] = useState('');

  // Find active level week object
  const activeLevelData = flatRoadmapWeeks[selectedLevel - 1] || flatRoadmapWeeks[0];

  // Helper: Check if level is unlocked
  const isLevelUnlocked = (lvlNum) => {
    if (lvlNum === 1) return true;
    const prevCompleted = completedTasks.includes(`quiz_level_${lvlNum - 1}`) || completedTasks.includes(`quiz_week_${lvlNum - 1}`);
    const userLevelUnlocked = levelInfo.level >= lvlNum;
    return prevCompleted || userLevelUnlocked;
  };

  const handleStartQuiz = async (lvlNum = selectedLevel) => {
    if (!isLevelUnlocked(lvlNum)) {
      setLockToast(`Level ${lvlNum} is locked! Complete Level ${lvlNum - 1} quiz to unlock.`);
      setTimeout(() => setLockToast(''), 4000);
      return;
    }

    const lvlData = flatRoadmapWeeks[lvlNum - 1] || flatRoadmapWeeks[0];
    setSelectedLevel(lvlNum);
    setQuizState('loading');
    setUserAnswers({});
    setQuizResults(null);

    const generated = await generateAIQuestions({
      category: lvlData.skillId,
      career: targetCareerId.replace('_', ' '),
      roadmapWeek: `Level ${lvlNum} (${lvlData.skillName})`,
      weeklyTasks: lvlData.topics || [],
      difficulty: lvlData.difficulty || 'Easy',
      count: 4
    });

    setQuestions(generated);
    setQuizState('active');
  };

  const handleSelectAnswer = (questionId, optionId) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleCalculateScore = (e) => {
    e.preventDefault();
    if (!questions.length) return;

    let correctCount = 0;
    questions.forEach(q => {
      const selected = userAnswers[q.id];
      const correctOpt = q.options.find(o => o.isCorrect);
      if (selected && correctOpt && selected === correctOpt.id) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const baseXP = correctCount * 25;
    let bonusXP = 0;

    if (scorePct >= 80) bonusXP += 50;
    if (scorePct === 100) bonusXP += 100;

    const totalAwardedXP = baseXP + bonusXP;

    // Award XP and record completion
    if (onAwardXP && totalAwardedXP > 0) {
      onAwardXP(totalAwardedXP, `Completed Level ${selectedLevel}: ${activeLevelData.title} (${scorePct}% Score)`, { taskId: `quiz_level_${selectedLevel}` });
    }

    setQuizResults({
      correctCount,
      totalCount: questions.length,
      scorePct,
      baseXP,
      bonusXP,
      totalAwardedXP,
      isPassed: scorePct >= 60
    });

    setQuizState('results');
  };

  return (
    <div className="space-y-8 animate-fadeIn font-mono pb-12">
      
      {/* Lock Warning Toast */}
      {lockToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl border border-amber-500/60 bg-slate-900/90 text-amber-300 text-xs font-bold shadow-2xl flex items-center gap-3 animate-fadeIn">
          <AlertCircle size={18} className="text-amber-400 shrink-0" />
          <span>{lockToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="glass-panel border-glow-purple p-6 md:p-8 rounded-2xl relative scanlines overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonPurple/40 bg-cyber-neonPurple/10 text-cyber-neonPurple text-xs font-bold uppercase tracking-widest">
              <Award size={14} className="animate-pulse" />
              GAMIFICATION & PROGRESSION
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              RookX Career XP & Quizzes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Earn XP and badges by mastering interactive career roadmap quizzes and skill practice missions.
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

      {/* ACTIVE QUIZ WORKSPACE SECTION */}
      {quizState !== 'idle' && activeLevelData && (
        <section className="glass-panel border-glow-purple p-6 rounded-2xl space-y-6 scanlines animate-fadeIn">
          <div className="flex justify-between items-center border-b border-cyber-border pb-4">
            <button
              onClick={() => setQuizState('idle')}
              className="px-3.5 py-2 rounded-lg border border-cyber-border bg-cyber-dark/60 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft size={14} /> BACK TO LEVELS & BADGES
            </button>

            <span className="text-xs font-bold text-cyber-neonPurple uppercase">
              {activeLevelData.skillIcon} Level {selectedLevel}: {activeLevelData.skillName}
            </span>
          </div>

          {quizState === 'loading' && (
            <div className="p-8 border border-cyber-border/60 rounded-xl bg-cyber-dark/40 text-center space-y-3 font-mono">
              <RefreshCw size={32} className="mx-auto text-cyber-neonPurple animate-spin" />
              <h4 className="text-base font-bold text-white">Preparing Questions for {activeLevelData.title}...</h4>
              <p className="text-xs text-slate-400">Skill: {activeLevelData.skillName} • Difficulty: {activeLevelData.difficulty}</p>
            </div>
          )}

          {quizState === 'active' && (
            <form onSubmit={handleCalculateScore} className="space-y-6 font-mono">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-cyber-border pb-2">
                <span>ANSWER ALL QUESTIONS BELOW</span>
                <span className="text-cyber-neonCyan font-bold">{questions.length} Questions</span>
              </div>

              <div className="space-y-5">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 border border-cyber-border rounded-xl bg-cyber-dark/60 space-y-3">
                    <div className="flex justify-between items-center border-b border-cyber-border/40 pb-2">
                      <span className="text-xs font-bold text-cyber-neonPurple uppercase">QUESTION 0{idx + 1}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{q.difficulty || activeLevelData.difficulty}</span>
                    </div>

                    <p className="text-xs text-white font-bold leading-relaxed">{q.question}</p>

                    {q.codeSnippet && (
                      <div className="p-3 rounded-lg border border-cyber-border bg-cyber-dark text-xs text-amber-300 whitespace-pre-wrap font-mono">
                        {q.codeSnippet}
                      </div>
                    )}

                    <div className="space-y-2 pt-1">
                      {q.options.map(opt => (
                        <label 
                          key={opt.id}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            userAnswers[q.id] === opt.id
                              ? 'border-cyber-neonPurple bg-cyber-neonPurple/20 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                              : 'border-cyber-border bg-cyber-dark/40 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`q_${q.id}`} 
                            value={opt.id}
                            checked={userAnswers[q.id] === opt.id}
                            onChange={() => handleSelectAnswer(q.id, opt.id)}
                            className="accent-purple-500 cursor-pointer"
                          />
                          <span><strong>{opt.id}.</strong> {opt.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-cyber-border">
                <span className="text-xs text-slate-400">
                  {Object.keys(userAnswers).length} of {questions.length} answered
                </span>

                <button
                  type="submit"
                  disabled={Object.keys(userAnswers).length < questions.length}
                  className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  SUBMIT QUIZ <CheckCircle2 size={14} />
                </button>
              </div>
            </form>
          )}

          {quizState === 'results' && quizResults && (
            <div className="p-6 border border-cyber-border/60 rounded-xl bg-cyber-dark/40 space-y-6 font-mono animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyber-border pb-4 gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> QUIZ COMPLETED
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">Level {selectedLevel}: {activeLevelData.title}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-3xl font-extrabold text-amber-400 block">+{quizResults.totalAwardedXP} XP</span>
                  <span className="text-xs text-slate-300 font-bold">{quizResults.scorePct}% Score ({quizResults.correctCount}/{quizResults.totalCount} Correct)</span>
                </div>
              </div>

              {/* Explanations List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Question Explanations</h4>
                {questions.map((q, idx) => {
                  const userAns = userAnswers[q.id];
                  const correctOpt = q.options.find(o => o.isCorrect);
                  const isUserCorrect = userAns === correctOpt?.id;

                  return (
                    <div key={q.id || idx} className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${isUserCorrect ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/40 bg-rose-500/5'}`}>
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-white">Q{idx + 1}: {q.question}</span>
                        <span className={isUserCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                          {isUserCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <strong>Solution:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-cyber-border">
                <button
                  onClick={() => setQuizState('idle')}
                  className="px-4 py-2 border border-cyber-border rounded-lg text-xs font-bold text-slate-300 hover:border-white transition-all cursor-pointer"
                >
                  BACK TO LEVEL JOURNEY
                </button>

                <button
                  onClick={() => handleStartQuiz(selectedLevel)}
                  className="cyber-btn cyber-btn-purple px-5 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
                >
                  RETRY QUIZ WITH NEW QUESTIONS <RefreshCw size={13} />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* LEVEL PROGRESSION & CLICKABLE LEVEL QUIZ GRID */}
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

        {/* Career-Specific Interactive Level Journey Grid */}
        <div className="pt-4 border-t border-cyber-border/40 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Hierarchical Skill Quiz Journey ({careerRoadmap.title})
            </span>
            <span className="text-[10px] text-cyber-neonCyan font-bold">
              Click any unlocked level to start its quiz
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {flatRoadmapWeeks.slice(0, 10).map((lvlData, idx) => {
              const lvlNum = idx + 1;
              const isUnlocked = isLevelUnlocked(lvlNum);
              const isCompleted = completedTasks.includes(`quiz_level_${lvlNum}`);
              const isCurrent = levelInfo.level === lvlNum;

              return (
                <div 
                  key={lvlNum}
                  onClick={() => handleStartQuiz(lvlNum)}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                    isCurrent 
                      ? 'border-cyber-neonPurple bg-cyber-neonPurple/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:scale-[1.02]' 
                      : isUnlocked 
                        ? 'border-cyber-neonCyan/40 bg-cyber-neonCyan/5 text-slate-200 hover:border-cyber-neonCyan hover:bg-cyber-neonCyan/10 hover:scale-[1.02]' 
                        : 'border-cyber-border/40 bg-cyber-dark/30 text-slate-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyber-neonPurple">
                        LVL 0{lvlNum} • {lvlData.skillIcon}
                      </span>
                      {isCompleted ? (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                          ✓ PASSED
                        </span>
                      ) : !isUnlocked ? (
                        <Lock size={12} className="text-slate-500" />
                      ) : (
                        <Sparkles size={12} className="text-cyber-neonCyan animate-pulse" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white truncate">{lvlData.skillName}</h4>
                    <span className="text-[10px] text-cyber-neonCyan block font-bold">
                      {lvlData.title.split(':')[1] || lvlData.title}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-cyber-border/40 flex justify-between items-center">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {lvlData.difficulty}
                    </span>

                    {isUnlocked ? (
                      <span className="px-2 py-1 rounded bg-cyber-neonPurple/30 text-cyber-neonPurple border border-cyber-neonPurple/50 text-[10px] font-bold hover:bg-cyber-neonPurple hover:text-white transition-all">
                        {isCompleted ? 'RETAKE' : 'START →'}
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 italic">
                        🔒 Level {lvlNum - 1} req.
                      </span>
                    )}
                  </div>
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
