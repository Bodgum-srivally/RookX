import React, { useState } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { Columns, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';

export default function Simulator({ profile, assessment }) {
  const [careerAId, setCareerAId] = useState(CAREER_LIST[0].id);
  const [careerBId, setCareerBId] = useState(CAREER_LIST[1].id);

  const getBlendedMetric = (profileVal, assessmentVal) => {
    const p = profileVal !== undefined ? Number(profileVal) : 50;
    const a = assessmentVal !== undefined ? Number(assessmentVal) : 50;
    return Math.round(p * 0.6 + a * 0.4);
  };

  const getCareerMetrics = (careerId) => {
    const career = CAREER_LIST.find(c => c.id === careerId) || CAREER_LIST[0];
    
    // 1. Calculate compatibility
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

    let compatibilityScore = 0;
    let gapsCount = 0;

    if (career.id === 'software_engineer') {
      compatibilityScore = (coding/100)*40 + (math/100)*20 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*15 + (sql/100)*10 + (comms/100)*10 + (interestBlended/100)*5;
      if (coding < 75) gapsCount++;
      if (sql < 65) gapsCount++;
      if (math < 70) gapsCount++;
      if (comms < 60) gapsCount++;
    } 
    else if (career.id === 'data_scientist') {
      compatibilityScore = (sql/100)*30 + (math/100)*25 + (getBlendedMetric(profile.skills?.mathematics, assessment.skills?.aptitude)/100)*20 + (coding/100)*15 + (comms/100)*10;
      if (sql < 75) gapsCount++;
      if (math < 70) gapsCount++;
      if (coding < 65) gapsCount++;
      if (comms < 65) gapsCount++;
    } 
    else if (career.id === 'cybersecurity_analyst') {
      compatibilityScore = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*25 + (coding/100)*20 + (getBlendedMetric(50, assessment.skills?.aptitude)/100)*25 + (getBlendedMetric(profile.skills?.coding, 50)/100)*20 + (comms/100)*10;
      if (coding < 60) gapsCount++;
      if (comms < 60) gapsCount++;
      gapsCount += 2; // Default security concepts / networking gaps
    } 
    else if (career.id === 'ui_ux_designer') {
      compatibilityScore = (getBlendedMetric(profile.skills?.design_principles, 50)/100)*35 + (getBlendedMetric(profile.skills?.business_strategy, 50)/100)*25 + (comms/100)*20 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*15 + (coding/100)*5;
      const design = profile.skills?.design_principles || 30;
      if (design < 70) gapsCount++;
      if (comms < 70) gapsCount++;
      if (business < 60) gapsCount++;
    } 
    else {
      // Product Manager
      compatibilityScore = (comms/100)*35 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*25 + (business/100)*20 + (sql/100)*15 + (coding/100)*5;
      if (comms < 75) gapsCount++;
      if (business < 70) gapsCount++;
      if (sql < 60) gapsCount++;
    }

    compatibilityScore = Math.max(25, Math.min(99, Math.round(compatibilityScore)));
    
    // Readiness is compatibility minus safety factors for missing elements
    const readinessScore = Math.max(15, Math.min(95, Math.round(compatibilityScore - gapsCount * 4)));
    
    // Dynamic preparation estimates
    const prepMonths = Math.max(3, Math.min(12, Math.round((gapsCount * 1.5) + (100 - compatibilityScore) / 10)));

    return {
      career,
      compatibility: compatibilityScore,
      readiness: readinessScore,
      gaps: gapsCount,
      prepTime: `${prepMonths} Months`,
      projects: career.recommendedProjects.length,
      educationOptions: career.id === 'software_engineer' ? 8 : career.id === 'data_scientist' ? 6 : 5
    };
  };

  const metricsA = getCareerMetrics(careerAId);
  const metricsB = getCareerMetrics(careerBId);

  // Generate dynamic simulator comparative advice
  const getComparisonInsight = () => {
    const diff = Math.abs(metricsA.compatibility - metricsB.compatibility);
    const strongerFit = metricsA.compatibility > metricsB.compatibility ? metricsA : metricsB;
    const alternateFit = metricsA.compatibility > metricsB.compatibility ? metricsB : metricsA;

    if (diff < 5) {
      return `📊 Decision Insight: Both ${metricsA.career.name} and ${metricsB.career.name} present highly balanced compatibility alignments (within ${diff}% of each other). Choose ${metricsA.career.name} if you prefer building products directly, or ${metricsB.career.name} if you are excited by its specific day-to-day requirements.`;
    }

    return `📊 Decision Insight: ${strongerFit.career.name} currently has a stronger fit (${strongerFit.compatibility}%) with your existing profile and requires fewer skill gaps (${strongerFit.gaps} gaps). However, ${alternateFit.career.name} (${alternateFit.compatibility}%) remains completely achievable if you allocate an estimated ${alternateFit.prepTime} to clear its identified roadmap requirements.`;
  };

  return (
    <div className="glass-panel border-glow-purple p-6 rounded-xl relative scanlines">
      <div className="absolute top-3 right-4 hud-label text-cyber-neonPurple">WHAT_IF_SIMULATOR</div>

      <div className="border-b border-cyber-border pb-4 mb-6">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <Columns className="text-cyber-neonPurple" size={20} />
          WHAT-IF CAREER SIMULATOR
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">Simulate alternate futures and compare transition preparation pathways</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Selection Dropdown A */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-slate-400">SELECT PATHWAY A</label>
          <select 
            value={careerAId}
            onChange={(e) => setCareerAId(e.target.value)}
            className="w-full bg-cyber-dark/80 border border-cyber-border rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-neonPurple"
          >
            {CAREER_LIST.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Selection Dropdown B */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-slate-400">SELECT PATHWAY B</label>
          <select 
            value={careerBId}
            onChange={(e) => setCareerBId(e.target.value)}
            className="w-full bg-cyber-dark/80 border border-cyber-border rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-neonPurple"
          >
            {CAREER_LIST.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="border border-cyber-border rounded overflow-hidden mb-6 bg-cyber-dark/20 font-mono">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-cyber-border bg-cyber-dark/80">
              <th className="p-3 text-xs text-slate-400 font-bold uppercase">PATHWAY METRIC</th>
              <th className="p-3 text-xs text-cyber-neonCyan font-bold uppercase tracking-wider text-center">{metricsA.career.name}</th>
              <th className="p-3 text-xs text-cyber-neonRose font-bold uppercase tracking-wider text-center">{metricsB.career.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40">
            <tr>
              <td className="p-3 font-semibold text-slate-300">Compatibility Index</td>
              <td className="p-3 text-center text-cyber-neonCyan font-bold text-base">{metricsA.compatibility}%</td>
              <td className="p-3 text-center text-cyber-neonRose font-bold text-base">{metricsB.compatibility}%</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">Current Career Readiness</td>
              <td className="p-3 text-center font-bold text-slate-200">{metricsA.readiness}%</td>
              <td className="p-3 text-center font-bold text-slate-200">{metricsB.readiness}%</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">Identified Skill Gaps</td>
              <td className="p-3 text-center text-amber-400 font-bold">{metricsA.gaps} Gaps</td>
              <td className="p-3 text-center text-amber-400 font-bold">{metricsB.gaps} Gaps</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">Est. Preparation Duration</td>
              <td className="p-3 text-center text-slate-300 font-bold">{metricsA.prepTime}</td>
              <td className="p-3 text-center text-slate-300 font-bold">{metricsB.prepTime}</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">Suggested Build Projects</td>
              <td className="p-3 text-center text-slate-400">{metricsA.projects} Projects</td>
              <td className="p-3 text-center text-slate-400">{metricsB.projects} Projects</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-300">Educational Options</td>
              <td className="p-3 text-center text-slate-400">{metricsA.educationOptions} Courses</td>
              <td className="p-3 text-center text-slate-400">{metricsB.educationOptions} Courses</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Decision Insight Notice Panel */}
      <div className="p-4 rounded border border-cyber-border bg-cyber-dark/40 flex items-start gap-3">
        <div className="text-xl shrink-0 mt-0.5">🧠</div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          {getComparisonInsight()}
        </p>
      </div>

    </div>
  );
}
