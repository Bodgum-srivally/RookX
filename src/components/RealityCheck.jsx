import React from 'react';
import { CAREER_LIST } from '../data/careerData';
import { ShieldCheck, ShieldAlert, TrendingUp, HelpCircle } from 'lucide-react';

export default function RealityCheck({ profile, assessment, targetCareerId }) {
  const career = CAREER_LIST.find(c => c.id === targetCareerId) || CAREER_LIST[0];

  const getBlendedMetric = (profileVal, assessmentVal) => {
    const p = profileVal !== undefined ? Number(profileVal) : 50;
    const a = assessmentVal !== undefined ? Number(assessmentVal) : 50;
    return Math.round(p * 0.6 + a * 0.4);
  };

  // Maps required skills and calculates current vs required
  const skillsComparison = career.requiredSkills.map(reqSkill => {
    let currentVal = 50;
    if (reqSkill.name.toLowerCase().includes('react') || reqSkill.name.toLowerCase().includes('javascript') || reqSkill.name.toLowerCase().includes('git')) {
      currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
    } else if (reqSkill.name.toLowerCase().includes('algorithm') || reqSkill.name.toLowerCase().includes('data structure')) {
      currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude);
    } else if (reqSkill.name.toLowerCase().includes('sql') || reqSkill.name.toLowerCase().includes('query')) {
      currentVal = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
    } else if (reqSkill.name.toLowerCase().includes('statistic') || reqSkill.name.toLowerCase().includes('probability') || reqSkill.name.toLowerCase().includes('math')) {
      currentVal = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
    } else if (reqSkill.name.toLowerCase().includes('network') || reqSkill.name.toLowerCase().includes('linux') || reqSkill.name.toLowerCase().includes('vulnerability')) {
      currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) - 10;
    } else if (reqSkill.name.toLowerCase().includes('figma') || reqSkill.name.toLowerCase().includes('design')) {
      currentVal = getBlendedMetric(profile.skills?.design_principles, 50);
    } else if (reqSkill.name.toLowerCase().includes('research') || reqSkill.name.toLowerCase().includes('strategy') || reqSkill.name.toLowerCase().includes('jira') || reqSkill.name.toLowerCase().includes('roadmap')) {
      currentVal = getBlendedMetric(profile.skills?.business_strategy, 50);
    } else {
      currentVal = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
    }

    currentVal = Math.max(15, Math.min(95, currentVal));
    const gap = Math.max(0, reqSkill.level - currentVal);

    return {
      name: reqSkill.name,
      required: reqSkill.level,
      current: currentVal,
      gap: gap
    };
  });

  // Calculate compatibility score (weighted)
  const getOverallMatch = () => {
    let matchSum = 0;
    skillsComparison.forEach(s => {
      // Calculate how close the student is (ratio)
      const ratio = s.current / s.required;
      matchSum += Math.min(1.0, ratio);
    });
    const avgRatio = skillsComparison.length > 0 ? matchSum / skillsComparison.length : 0.7;
    return Math.round(avgRatio * 100);
  };

  const overallMatch = getOverallMatch();

  // Sort and identify the biggest gaps
  const sortedGaps = [...skillsComparison]
    .filter(s => s.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  // Dynamic analysis judgment
  const getRealityStatement = () => {
    if (overallMatch >= 85) {
      return `🌟 Reality Check: Excellent alignment! Your current skills strongly meet the entry profile requirements for ${career.name}. You are in a prime position to start working on high-quality portfolio projects and apply for roles.`;
    } else if (overallMatch >= 65) {
      return `⚡ Reality Check: You can pursue a career as a ${career.name}, but your current profile has moderate gaps in ${sortedGaps.slice(0, 2).map(s => s.name).join(' and ')}. Focus your daily learning time on these topics before seeking active roles.`;
    } else {
      return `⚠️ Reality Check: Your current profile needs a solid foundation in core technical modules before you are career-ready. The system shows significant gaps in ${sortedGaps.slice(0, 3).map(s => s.name).join(', ')}. Follow the personalized learning roadmap below to step up systematically.`;
    }
  };

  return (
    <div className="glass-panel border-glow-cyan p-6 rounded-xl relative scanlines">
      <div className="absolute top-3 right-4 hud-label text-cyber-neonCyan">REALITY_MONITOR</div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyber-border pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">CAREER REALITY CHECK</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Benchmarking student profile against target market expectations</p>
        </div>
        <div className="mt-3 md:mt-0 font-mono px-3 py-1.5 rounded border border-cyber-neonCyan/30 bg-cyber-neonCyan/10 text-cyber-neonCyan font-bold text-sm">
          TARGET: {career.name.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Score & Judgement */}
        <div className="lg:col-span-1 p-5 rounded border border-cyber-border bg-cyber-dark/40 flex flex-col justify-between">
          <div className="text-center space-y-4">
            <span className="hud-label text-slate-500">OVERALL FIT VECTOR</span>
            
            <div className="relative inline-flex items-center justify-center p-6">
              {/* Spinning/pulsing neon circle wrapper */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyber-neonCyan/30 animate-spin-slow" />
              <div className="absolute inset-2 rounded-full border border-cyber-neonCyan/60 animate-pulse" />
              <div className="text-center z-10">
                <span className="text-5xl font-extrabold font-mono text-white tracking-tighter">{overallMatch}</span>
                <span className="text-xs font-mono text-cyber-neonCyan block">/ 100 INDEX</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Aggregated skill alignment across all required technical tracks.
            </p>
          </div>

          <div className="mt-6 p-3 rounded border border-cyber-border bg-cyber-dark/50">
            <div className="text-xs font-mono text-white font-bold mb-1 flex items-center gap-1.5">
              {overallMatch >= 65 ? <ShieldCheck className="text-cyber-neonCyan shrink-0" size={15} /> : <ShieldAlert className="text-cyber-neonRose shrink-0" size={15} />}
              ENGINE EVALUATION
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              {getRealityStatement()}
            </p>
          </div>
        </div>

        {/* Right Side: Skill Benchmarks Comparison */}
        <div className="lg:col-span-2 space-y-5">
          <h3 className="text-xs font-mono text-slate-300 uppercase tracking-widest font-bold">
            Skill Requirement Benchmarks
          </h3>

          <div className="space-y-4">
            {skillsComparison.map((skill, index) => {
              const aboveBenchmark = skill.current >= skill.required;
              return (
                <div key={index} className="space-y-2 p-3 rounded border border-cyber-border/40 bg-cyber-dark/20">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white font-bold">{skill.name}</span>
                    <div className="flex gap-3 text-[10px]">
                      <span className="text-slate-400">Current: <strong className={aboveBenchmark ? 'text-cyber-neonCyan' : 'text-cyber-neonRose'}>{skill.current}%</strong></span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400">Required: <strong className="text-white">{skill.required}%</strong></span>
                    </div>
                  </div>

                  {/* Dual overlay visual progress bar */}
                  <div className="relative w-full h-4 bg-slate-900 rounded border border-cyber-border overflow-hidden">
                    {/* Required benchmark indicator marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-20 shadow-md"
                      style={{ left: `${skill.required}%` }}
                    />
                    {/* Current level progress */}
                    <div 
                      className={`h-full z-10 transition-all duration-300 ${aboveBenchmark ? 'bg-gradient-to-r from-cyber-neonCyan/40 to-cyber-neonCyan/80' : 'bg-gradient-to-r from-cyber-neonRose/30 to-cyber-neonRose/65'}`}
                      style={{ width: `${skill.current}%` }}
                    />
                    {/* Highlight gap zone */}
                    {!aboveBenchmark && (
                      <div 
                        className="absolute top-0 bottom-0 bg-cyber-neonRose/10 border-l border-dashed border-cyber-neonRose/50 z-0"
                        style={{ left: `${skill.current}%`, right: `${100 - skill.required}%` }}
                      />
                    )}
                  </div>
                  
                  {/* Status subtitle */}
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>Baseline standard: {skill.required}%</span>
                    <span>
                      {aboveBenchmark 
                        ? '✅ MEET STANDARD' 
                        : `⚠️ GAP IDENTIFIED: -${skill.gap}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gaps Priority Breakdown */}
          {sortedGaps.length > 0 && (
            <div className="p-3 border border-cyber-neonRose/20 bg-cyber-neonRose/5 rounded">
              <span className="text-[10px] font-mono text-cyber-neonRose font-bold block mb-2 uppercase">
                ⚙️ PRIORITY ACTION REQUIRED (LARGEST GAPS)
              </span>
              <div className="flex flex-wrap gap-2">
                {sortedGaps.slice(0, 3).map((gap, idx) => (
                  <div key={idx} className="px-2 py-1 bg-cyber-dark/60 border border-cyber-border rounded text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonRose" />
                    {gap.name} (Gap: <strong className="text-cyber-neonRose">-{gap.gap}%</strong>)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
