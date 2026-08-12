import React, { useState } from 'react';
import { 
  TrendingUp, Target, Award, CheckCircle2, Circle, Zap, 
  BarChart2, ArrowUpRight, Sparkles, ShieldCheck, ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';

export default function CareerProgress({ profile, assessment, targetCareerId, gamificationState, onCompleteActivity, setTab }) {
  const [completedActivities, setCompletedActivities] = useState(() => {
    return new Set(gamificationState?.completedTasks || []);
  });

  const CAREER_SKILLS = {
    software_engineer: [
      { name: 'Data Structures & Algorithms', key: 'dsa', current: 45, target: 80 },
      { name: 'SQL & Database Systems', key: 'sql', current: 65, target: 85 },
      { name: 'Python / Java / C++', key: 'coding', current: 55, target: 85 },
      { name: 'Problem Solving & Logic', key: 'aptitude', current: 60, target: 90 },
      { name: 'Full-Stack Portfolio Projects', key: 'projects', current: 35, target: 75 },
      { name: 'Technical Communication', key: 'communication', current: 65, target: 85 }
    ],
    data_scientist: [
      { name: 'Python & Data Libraries (Pandas)', key: 'coding', current: 60, target: 85 },
      { name: 'Advanced SQL & Data Warehousing', key: 'sql', current: 55, target: 85 },
      { name: 'Statistics & Linear Algebra', key: 'mathematics', current: 50, target: 80 },
      { name: 'Machine Learning Fundamentals', key: 'ml', current: 30, target: 75 },
      { name: 'Data Visualization & Storytelling', key: 'communication', current: 65, target: 85 }
    ],
    ui_ux_designer: [
      { name: 'Figma & Visual Interface Design', key: 'design', current: 40, target: 85 },
      { name: 'User Research & Wireframing', key: 'research', current: 45, target: 80 },
      { name: 'Design Systems & Prototyping', key: 'prototyping', current: 35, target: 75 },
      { name: 'User Psychology & Empathy', key: 'communication', current: 60, target: 85 }
    ],
    cybersecurity_analyst: [
      { name: 'Network Protocols & Security', key: 'networks', current: 45, target: 85 },
      { name: 'Linux Command Line & Scripting', key: 'coding', current: 50, target: 80 },
      { name: 'Log Auditing & Intrusion Detection', key: 'aptitude', current: 40, target: 85 },
      { name: 'Vulnerability Assessment', key: 'sec', current: 35, target: 75 }
    ],
    product_manager: [
      { name: 'Product Strategy & Roadmap Planning', key: 'strategy', current: 50, target: 85 },
      { name: 'User Analytics & Metrics', key: 'sql', current: 55, target: 80 },
      { name: 'Feature Prioritization Frameworks', key: 'aptitude', current: 60, target: 85 },
      { name: 'Cross-functional Communication', key: 'communication', current: 70, target: 90 }
    ]
  };

  const activeSkillsList = CAREER_SKILLS[targetCareerId] || CAREER_SKILLS.software_engineer;

  // Calculate dynamic readiness boost based on completed activities
  const ACTIVITIES = [
    { id: 'act_dsa_10', title: 'Complete 10 DSA Problem Challenges', boost: 5, xp: 100, category: 'Skills' },
    { id: 'act_project_1', title: 'Build 1 Full-Stack Portfolio Project', boost: 8, xp: 250, category: 'Projects' },
    { id: 'act_sql_challenge', title: 'Complete Advanced SQL Query Challenge', boost: 3, xp: 50, category: 'Database' },
    { id: 'act_try_simulation', title: 'Complete "Try Before You Commit" Simulation', boost: 6, xp: 200, category: 'Experience' },
    { id: 'act_roadmap_week1', title: 'Complete Week 1 Action Roadmap Tasks', boost: 4, xp: 100, category: 'Action Plan' }
  ];

  let activityBoostPct = 0;
  ACTIVITIES.forEach(a => {
    if (completedActivities.has(a.id)) {
      activityBoostPct += a.boost;
    }
  });

  const baseReadiness = 54;
  const currentReadiness = Math.min(96, baseReadiness + activityBoostPct);

  // Growth trajectory data for timeline chart
  const timelineData = [
    { period: 'Now', readiness: currentReadiness },
    { period: 'Week 4', readiness: Math.min(98, currentReadiness + 9) },
    { period: 'Week 8', readiness: Math.min(99, currentReadiness + 19) },
    { period: 'Week 12', readiness: Math.min(100, currentReadiness + 30) }
  ];

  const handleToggleActivity = (act) => {
    const nextSet = new Set(completedActivities);
    let wasCompleted = false;

    if (nextSet.has(act.id)) {
      nextSet.delete(act.id);
    } else {
      nextSet.add(act.id);
      wasCompleted = true;
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }

    setCompletedActivities(nextSet);

    if (wasCompleted && onCompleteActivity) {
      onCompleteActivity(act.id, act.boost, act.xp);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn font-mono pb-12">
      
      {/* Header Banner */}
      <section className="glass-panel border-glow-cyan p-6 md:p-8 rounded-2xl relative scanlines overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonCyan/40 bg-cyber-neonCyan/10 text-cyber-neonCyan text-xs font-bold uppercase tracking-widest">
              <TrendingUp size={14} className="animate-pulse" />
              CAREER READINESS SIMULATOR
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Career Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track your career readiness, simulate potential 12-week skill gains, and complete target activities to boost your readiness score.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-cyber-neonCyan/50 bg-cyber-dark/80 text-center shrink-0 min-w-[150px] shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">CAREER READINESS</span>
            <span className="text-4xl font-extrabold text-white bg-gradient-to-r from-cyber-neonCyan to-cyber-neonPurple bg-clip-text text-transparent">
              {currentReadiness}%
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1 font-bold">
              +{activityBoostPct}% Boost Active
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 1: POTENTIAL PROGRESS TRAJECTORY CHART */}
      <section className="glass-panel border-glow-purple p-6 rounded-2xl space-y-6 scanlines">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart2 size={18} className="text-cyber-neonPurple" />
              Potential Progress Projection (12-Week Timeline)
            </h2>
            <p className="text-xs text-slate-400">
              Visualizing score growth from current baseline to Week 12.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-cyber-neonCyan px-3 py-1.5 rounded-lg border border-cyber-neonCyan/30 bg-cyber-neonCyan/10">
            <span>Now ({currentReadiness}%)</span>
            <ChevronRight size={14} />
            <span>W4 ({timelineData[1].readiness}%)</span>
            <ChevronRight size={14} />
            <span>W8 ({timelineData[2].readiness}%)</span>
            <ChevronRight size={14} />
            <span className="text-white">W12 ({timelineData[3].readiness}%)</span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#a855f7', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(val) => [`${val}% Readiness`, 'Projected Score']}
              />
              <Area type="monotone" dataKey="readiness" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#readinessGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* SECTION 2: RELEVANT CAREER SKILL BREAKDOWN MATRIX */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Target size={16} className="text-cyber-neonCyan" />
            Target Career Skill Breakdown
          </h2>
          <span className="text-xs text-slate-400">Current vs Target Thresholds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeSkillsList.map((skill, idx) => {
            const effectiveCurrent = Math.min(100, skill.current + Math.round(activityBoostPct * 0.4));
            const diffPct = skill.target - effectiveCurrent;
            const progressRatio = Math.min(100, Math.round((effectiveCurrent / skill.target) * 100));

            return (
              <div key={idx} className="p-4 rounded-xl border border-cyber-border bg-cyber-dark/40 space-y-3 hover:border-cyber-neonCyan transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-white">{skill.name}</h3>
                    <span className="text-[10px] text-slate-400">
                      Target: <strong className="text-cyber-neonCyan">{skill.target}%</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-white">{effectiveCurrent}%</span>
                    <span className="text-[10px] text-amber-400 block font-bold">
                      {diffPct > 0 ? `+${diffPct}% Needed` : '✓ On Target'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div 
                      className="bg-gradient-to-r from-cyber-neonPurple via-cyber-neonCyan to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressRatio}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Baseline: {skill.current}%</span>
                    <span>Progress Ratio: {progressRatio}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: DYNAMIC ACTIVITY BOOSTERS ("What will improve your score?") */}
      <section className="glass-panel border-glow-purple p-6 rounded-2xl space-y-6 scanlines">
        <div className="flex justify-between items-center border-b border-cyber-border pb-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap size={18} className="text-amber-400 animate-pulse" />
              What Will Improve Your Score?
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete these targeted activities to dynamically boost your Career Readiness & XP in real-time.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {ACTIVITIES.map((act) => {
            const isDone = completedActivities.has(act.id);
            return (
              <div 
                key={act.id}
                onClick={() => handleToggleActivity(act)}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isDone 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white' 
                    : 'bg-cyber-dark/40 border-cyber-border hover:border-cyber-neonPurple hover:bg-cyber-neonPurple/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={isDone ? 'text-emerald-400' : 'text-slate-500'}>
                    {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>

                  <div>
                    <span className={`text-xs font-bold block ${isDone ? 'line-through text-slate-300' : 'text-white'}`}>
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-400">Category: {act.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold border bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    +{act.boost}% Readiness
                  </span>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold border bg-purple-500/20 text-purple-400 border-purple-500/30">
                    +{act.xp} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-cyber-border">
          <span>Complete activities to unlock achievement badges!</span>
          <button 
            onClick={() => setTab('xp_badges')}
            className="text-cyber-neonPurple font-bold hover:underline flex items-center gap-1"
          >
            <Award size={14} /> View XP Badges →
          </button>
        </div>
      </section>

    </div>
  );
}
