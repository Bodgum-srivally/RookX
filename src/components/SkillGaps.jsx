import React from 'react';
import { CAREER_LIST } from '../data/careerData';
import { Target, Lightbulb, CheckCircle2, ChevronRight, TrendingUp } from 'lucide-react';

export default function SkillGaps({ profile, assessment, targetCareerId }) {
  const career = CAREER_LIST.find(c => c.id === targetCareerId) || CAREER_LIST[0];

  const getBlendedMetric = (profileVal, assessmentVal) => {
    const p = profileVal !== undefined ? Number(profileVal) : 50;
    const a = assessmentVal !== undefined ? Number(assessmentVal) : 50;
    return Math.round(p * 0.6 + a * 0.4);
  };

  // Compute skill parameters
  const skillsMatrix = career.requiredSkills.map(reqSkill => {
    let currentVal = 50;
    let categoryKey = 'general';
    let recommendations = [];

    const nameLower = reqSkill.name.toLowerCase();

    if (nameLower.includes('react') || nameLower.includes('javascript') || nameLower.includes('git')) {
      currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
      categoryKey = 'coding';
      recommendations = [
        "Learn core ES6+ functions (map, filter, promises).",
        "Build 3 small responsive React UIs using styling hooks.",
        "Commit project code to a public GitHub repo with readme notes."
      ];
    } else if (nameLower.includes('algorithm') || nameLower.includes('data structure')) {
      currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude);
      categoryKey = 'coding';
      recommendations = [
        "Study Arrays, Linked Lists, Queues, and Stacks.",
        "Practice 15 easy/medium sorting challenges on LeetCode.",
        "Understand Big-O space and time complexity parameters."
      ];
    } else if (nameLower.includes('sql') || nameLower.includes('query')) {
      currentVal = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
      categoryKey = 'sql';
      recommendations = [
        "Master aggregate grouping rules and window partitions.",
        "Solve 20 intermediate SQL queries on SQLZoo.",
        "Practice database index creation and optimization keys."
      ];
    } else if (nameLower.includes('statistic') || nameLower.includes('probability') || nameLower.includes('math')) {
      currentVal = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
      categoryKey = 'mathematics';
      recommendations = [
        "Review probability distributions (Gaussian, Binomial).",
        "Understand hypothesis test fundamentals (t-tests, p-values).",
        "Model 2 simple regression files in Excel or Python."
      ];
    } else if (nameLower.includes('network') || nameLower.includes('linux') || nameLower.includes('vulnerability')) {
      currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) - 10;
      categoryKey = 'security';
      recommendations = [
        "Study the OSI model layers and standard network packets.",
        "Practice basic command line syntax on a Linux terminal.",
        "Take a free introductory course in network security protocols."
      ];
    } else if (nameLower.includes('figma') || nameLower.includes('design')) {
      currentVal = getBlendedMetric(profile.skills?.design_principles, 50);
      categoryKey = 'design';
      recommendations = [
        "Learn auto-layouts and reusable component styling in Figma.",
        "Re-create 3 mobile app screens to master spacing guidelines.",
        "Study typography hierarchy scales and dark theme palettes."
      ];
    } else if (nameLower.includes('research') || nameLower.includes('strategy') || nameLower.includes('jira') || nameLower.includes('roadmap')) {
      currentVal = getBlendedMetric(profile.skills?.business_strategy, 50);
      categoryKey = 'business';
      recommendations = [
        "Draft a Product Requirements Document (PRD) for a mini tool.",
        "Study feature scoring framework calculations (RICE and MoSCoW).",
        "Map user experience funnels showing steps to complete a form."
      ];
    } else {
      currentVal = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
      categoryKey = 'communication';
      recommendations = [
        "Practice drafting technical guides explaining system steps.",
        "Record yourself delivering a 5-minute project pitch slide deck.",
        "Coordinate a mock planning session with peer engineers."
      ];
    }

    currentVal = Math.max(15, Math.min(95, currentVal));
    const gap = Math.max(0, reqSkill.level - currentVal);
    let priority = "LOW";
    if (gap > 20) priority = "HIGH";
    else if (gap > 5) priority = "MEDIUM";

    return {
      name: reqSkill.name,
      required: reqSkill.level,
      current: currentVal,
      gap: gap,
      priority,
      actions: recommendations
    };
  });

  return (
    <div className="glass-panel border-glow-cyan p-6 rounded-xl relative scanlines">
      <div className="absolute top-3 right-4 hud-label text-cyber-neonCyan">GAP_ENGINE</div>

      <div className="border-b border-cyber-border pb-4 mb-6">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <Target className="text-cyber-neonCyan animate-pulse" size={20} />
          SKILL GAP ANALYSIS MATRIX
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">Calculated target deficits with actionable resolution pathways</p>
      </div>

      <div className="space-y-6">
        {/* Table/List of Gaps */}
        <div className="space-y-3">
          {skillsMatrix.map((item, idx) => (
            <div 
              key={idx} 
              className={`
                p-4 border rounded-lg transition-all
                ${item.gap > 0 
                  ? 'border-cyber-border bg-cyber-dark/40' 
                  : 'border-emerald-500/20 bg-emerald-500/5'}
              `}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <div>
                  <span className="text-sm font-bold font-mono text-white">{item.name}</span>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                    <span>Target: <strong>{item.required}%</strong></span>
                    <span>•</span>
                    <span>Current: <strong>{item.current}%</strong></span>
                    <span>•</span>
                    <span>Gap: <strong className={item.gap > 0 ? 'text-cyber-neonRose' : 'text-emerald-400'}>{item.gap}%</strong></span>
                  </div>
                </div>

                <div className="mt-2 sm:mt-0">
                  {item.gap > 0 ? (
                    <span 
                      className={`
                        px-2.5 py-1 text-[10px] font-mono rounded font-bold
                        ${item.priority === 'HIGH' 
                          ? 'bg-cyber-neonRose/20 border border-cyber-neonRose text-cyber-rose' 
                          : 'bg-amber-400/20 border border-amber-400 text-amber-300'}
                      `}
                    >
                      {item.priority} PRIORITY GAP
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] font-mono rounded font-bold bg-emerald-500/20 border border-emerald-500 text-emerald-400">
                      ✓ READY
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Section */}
              {item.gap > 0 && (
                <div className="pt-3 border-t border-cyber-border/40 mt-3 space-y-2">
                  <div className="text-[10px] font-mono text-cyber-neonCyan font-bold uppercase flex items-center gap-1.5">
                    <Lightbulb size={13} /> SUGGESTED DEVELOPMENT STEPS
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-300 font-mono">
                    {item.actions.map((act, aIdx) => (
                      <li key={aIdx} className="leading-relaxed">
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Informative tips */}
        <div className="p-3 border border-cyber-border/40 rounded bg-cyber-dark/30 text-xs font-mono text-slate-400 leading-relaxed">
          💡 <strong>Growth Strategy</strong>: Prioritize the <strong>HIGH</strong> priority gaps first. Systematically completing the suggested tasks will dynamically update your dashboard compatibility ratings.
        </div>
      </div>
    </div>
  );
}
