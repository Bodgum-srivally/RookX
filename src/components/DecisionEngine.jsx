import React, { useState } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { HelpCircle, Check, X, ShieldAlert, Cpu, Award, Zap } from 'lucide-react';

export default function DecisionEngine({ profile, assessment, onSelectTarget }) {
  const [selectedCareerId, setSelectedCareerId] = useState(CAREER_LIST[0].id);

  // Blends profile ratings & assessment scores to compute absolute metrics
  const getBlendedMetric = (profileVal, assessmentVal) => {
    const p = profileVal !== undefined ? Number(profileVal) : 50;
    const a = assessmentVal !== undefined ? Number(assessmentVal) : 50;
    return Math.round(p * 0.6 + a * 0.4);
  };

  const calculateCompatibility = (career) => {
    const coding = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
    const sql = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
    const math = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
    const comms = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
    const business = getBlendedMetric(profile.skills?.business_strategy, assessment.skills?.business_strategy);
    
    // Interests weight (binary match in profile interests: +100, else +30, modified by discovery test)
    const hasInterestMatch = profile.interests?.includes(
      career.id === 'software_engineer' ? 'tech' :
      career.id === 'data_scientist' ? 'data' :
      career.id === 'cybersecurity_analyst' ? 'security' :
      career.id === 'ui_ux_designer' ? 'design' : 'business'
    );
    const discoveryScore = assessment.interests?.[career.id] || 0;
    const interestBlended = hasInterestMatch ? 90 + discoveryScore * 0.1 : 40 + discoveryScore * 0.5;

    let score = 0;
    const factors = [];
    const gaps = [];

    // Calculate details and weights
    if (career.id === 'software_engineer') {
      const p1 = (coding / 100) * 40;
      const p2 = (math / 100) * 20; // Problem solving maps to math
      const p3 = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) / 100) * 15; // Aptitude
      const p4 = (sql / 100) * 10;
      const p5 = (comms / 100) * 10;
      const p6 = (interestBlended / 100) * 5;
      
      score = p1 + p2 + p3 + p4 + p5 + p6;

      factors.push({ name: 'Programming Foundations', value: Math.round(p1), max: 40 });
      factors.push({ name: 'Problem Solving (Math)', value: Math.round(p2), max: 20 });
      factors.push({ name: 'Aptitude & Speed', value: Math.round(p3), max: 15 });
      factors.push({ name: 'SQL/Querying capacity', value: Math.round(p4), max: 10 });
      factors.push({ name: 'Technical Communications', value: Math.round(p5), max: 10 });
      factors.push({ name: 'Engineering Interest', value: Math.round(p6), max: 5 });

      if (coding < 75) gaps.push({ name: 'Coding proficiency below benchmark', deduction: Math.round((75 - coding) * 0.4) });
      if (sql < 65) gaps.push({ name: 'Underdeveloped SQL querying skills', deduction: Math.round((65 - sql) * 0.1) });
    } 
    else if (career.id === 'data_scientist') {
      const p1 = (sql / 100) * 30;
      const p2 = (math / 100) * 25; // Statistics
      const p3 = (getBlendedMetric(profile.skills?.mathematics, assessment.skills?.aptitude) / 100) * 20; // Aptitude
      const p4 = (coding / 100) * 15; // Data interpretation
      const p5 = (comms / 100) * 10;
      
      score = p1 + p2 + p3 + p4 + p5;

      factors.push({ name: 'SQL Databases', value: Math.round(p1), max: 30 });
      factors.push({ name: 'Probability & Stats (Math)', value: Math.round(p2), max: 25 });
      factors.push({ name: 'Logical Aptitude', value: Math.round(p3), max: 20 });
      factors.push({ name: 'Python/Data coding', value: Math.round(p4), max: 15 });
      factors.push({ name: 'Statistical Presenting', value: Math.round(p5), max: 10 });

      if (math < 70) gaps.push({ name: 'Statistical background is weak', deduction: Math.round((70 - math) * 0.25) });
      if (sql < 75) gaps.push({ name: 'Aggregations & Joins below target', deduction: Math.round((75 - sql) * 0.3) });
    } 
    else if (career.id === 'cybersecurity_analyst') {
      const p1 = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) / 100) * 25; // Aptitude
      const p2 = (coding / 100) * 20;
      const p3 = (getBlendedMetric(50, assessment.skills?.aptitude) / 100) * 25; // Networking
      const p4 = (getBlendedMetric(profile.skills?.coding, 50) / 100) * 20; // Security
      const p5 = (comms / 100) * 10;

      score = p1 + p2 + p3 + p4 + p5;

      factors.push({ name: 'Cyber Logic Aptitude', value: Math.round(p1), max: 25 });
      factors.push({ name: 'Bash & Tool Scripting', value: Math.round(p2), max: 20 });
      factors.push({ name: 'Network Configuration baseline', value: Math.round(p3), max: 25 });
      factors.push({ name: 'Security Concepts awareness', value: Math.round(p4), max: 20 });
      factors.push({ name: 'Team Incident Reporting', value: Math.round(p5), max: 10 });

      if (coding < 60) gaps.push({ name: 'Python/Bash scripting deficit', deduction: Math.round((60 - coding) * 0.2) });
    } 
    else if (career.id === 'ui_ux_designer') {
      const p1 = (getBlendedMetric(profile.skills?.design_principles, 50) / 100) * 35; // Design
      const p2 = (getBlendedMetric(profile.skills?.business_strategy, 50) / 100) * 25; // Research
      const p3 = (comms / 100) * 20;
      const p4 = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) / 100) * 15; // Aptitude
      const p5 = (coding / 100) * 5;

      score = p1 + p2 + p3 + p4 + p5;

      factors.push({ name: 'Visual Layouts & Figma', value: Math.round(p1), max: 35 });
      factors.push({ name: 'User Empathy Research', value: Math.round(p2), max: 25 });
      factors.push({ name: 'UI Presentation & Mockups', value: Math.round(p3), max: 20 });
      factors.push({ name: 'Cognitive Flow Aptitude', value: Math.round(p4), max: 15 });
      factors.push({ name: 'Front-end CSS Basics', value: Math.round(p5), max: 5 });

      const design = profile.skills?.design_principles || 30;
      if (design < 70) gaps.push({ name: 'Visual layout & Figma principles weak', deduction: Math.round((70 - design) * 0.35) });
    } 
    else {
      // Product Manager
      const p1 = (comms / 100) * 35;
      const p2 = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) / 100) * 25; // Problem solving
      const p3 = (business / 100) * 20;
      const p4 = (sql / 100) * 15; // Data interpretation
      const p5 = (coding / 100) * 5;

      score = p1 + p2 + p3 + p4 + p5;

      factors.push({ name: 'Leadership & Communications', value: Math.round(p1), max: 35 });
      factors.push({ name: 'RICE & Roadmap Logic', value: Math.round(p2), max: 25 });
      factors.push({ name: 'Business Case Strategy', value: Math.round(p3), max: 20 });
      factors.push({ name: 'SQL & KPI analytics', value: Math.round(p4), max: 15 });
      factors.push({ name: 'Tech Stack literacy', value: Math.round(p5), max: 5 });

      if (comms < 75) gaps.push({ name: 'Assertive public presenting gaps', deduction: Math.round((75 - comms) * 0.35) });
    }

    const roundedScore = Math.max(20, Math.min(99, Math.round(score)));

    return {
      score: roundedScore,
      factors,
      gaps
    };
  };

  const resultsList = CAREER_LIST.map(career => {
    const compData = calculateCompatibility(career);
    return {
      ...career,
      compatibility: compData.score,
      factors: compData.factors,
      gaps: compData.gaps
    };
  }).sort((a, b) => b.compatibility - a.compatibility);

  // Find currently selected career stats
  const activeCareerData = resultsList.find(c => c.id === selectedCareerId);

  // Radar chart data representing career profiles
  const radarData = CAREER_LIST.map(career => {
    const matched = resultsList.find(r => r.id === career.id);
    return {
      subject: career.name.replace(' Engineer', '').replace(' Analyst', '').replace(' Designer', ''),
      Compatibility: matched.compatibility,
      fullMark: 100
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Radar Chart Visualization */}
        <div className="glass-panel border-glow-purple p-6 rounded-xl relative flex flex-col justify-between">
          <div className="absolute top-3 left-4 hud-label">ANALYTICAL_LANDSCAPE</div>
          
          <div className="text-center mt-4">
            <h3 className="text-lg font-bold font-mono text-white">YOUR CAREER LANDSCAPE MATRIX</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Weighted profile-assessment radar projection</p>
          </div>

          <div className="h-64 md:h-72 w-full radar-glow mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10, fontFamily: 'Space Grotesk' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.15)" tick={{ fill: '#64748b' }} />
                <Radar 
                  name="Compatibility" 
                  dataKey="Compatibility" 
                  stroke="#a855f7" 
                  fill="#a855f7" 
                  fillOpacity={0.35} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 border border-cyber-border/40 rounded bg-cyber-dark/30 text-[11px] font-mono text-slate-400 leading-relaxed">
            ⚡ Deciphering Chart: Peak vectors represent careers heavily aligned to your existing academic history, preferences, and diagnostic scoring metrics.
          </div>
        </div>

        {/* Right Side: Matches & Detailed Explainability */}
        <div className="glass-panel border-glow-cyan p-6 rounded-xl flex flex-col justify-between">
          <div className="absolute top-3 right-4 hud-label text-cyber-neonCyan">COMPATIBILITY_RANKING</div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-mono text-white mb-2">IDENTIFIED CAREER COMPATIBILITY</h3>
            
            <div className="space-y-2">
              {resultsList.map((career) => (
                <div 
                  key={career.id}
                  onClick={() => setSelectedCareerId(career.id)}
                  className={`
                    p-3 rounded border cursor-pointer select-none transition-all flex items-center justify-between
                    ${selectedCareerId === career.id 
                      ? 'border-cyber-neonPurple bg-cyber-neonPurple/10 text-white' 
                      : 'border-cyber-border bg-cyber-dark/20 text-slate-400 hover:border-slate-700 hover:text-slate-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2.5 h-2.5 rounded-full animate-pulse" 
                      style={{ backgroundColor: career.color }}
                    />
                    <div>
                      <span className="font-mono text-sm font-semibold block">{career.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono italic">Weights: Coding, Aptitude, SQL</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span 
                      className="font-mono font-bold text-base"
                      style={{ color: selectedCareerId === career.id ? '#a855f7' : career.color }}
                    >
                      {career.compatibility}%
                    </span>
                    <span className="text-[9px] block text-slate-400 font-mono">fit index</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-cyber-border flex justify-between items-center">
            <div className="text-xs font-mono text-slate-400">
              Selected Target: <span className="text-white font-bold">{activeCareerData?.name}</span>
            </div>
            <button
              onClick={() => onSelectTarget(activeCareerData?.id)}
              className="cyber-btn cyber-btn-purple px-4 py-2 rounded text-xs font-mono tracking-wider font-bold text-white flex items-center gap-1.5"
            >
              SET AS ACTIVE GOAL <Zap size={13} />
            </button>
          </div>
        </div>

      </div>

      {/* Accordion Explainability panel below */}
      {activeCareerData && (
        <div className="glass-panel border-glow-rose p-6 rounded-xl relative animate-fadeIn">
          <div className="absolute top-3 right-4 hud-label text-cyber-neonRose">EXPLAINABILITY_LEDGER</div>

          <h3 className="text-lg font-bold font-mono text-white mb-4 flex items-center gap-2">
            <Award className="text-cyber-neonRose animate-pulse" size={20} />
            Why is {activeCareerData.name} compatibility graded {activeCareerData.compatibility}%?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Positive Score Additions */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                ✓ POSITIVE ATTRIBUTION FACTORS
              </h4>
              
              <div className="space-y-2">
                {activeCareerData.factors.map((factor, idx) => (
                  <div key={idx} className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded flex justify-between items-center">
                    <div>
                      <div className="text-xs font-mono font-semibold text-slate-200">{factor.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono">Blended Input Metric</div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-emerald-400 font-bold text-sm">+{factor.value}</span>
                      <span className="text-[10px] text-slate-500"> / {factor.max}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Reductions / Gaps */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-cyber-neonRose font-bold uppercase tracking-wider">
                ✗ CRITICAL DEDUCTIONS & BENCHMARKS
              </h4>
              
              <div className="space-y-2">
                {activeCareerData.gaps.length > 0 ? (
                  activeCareerData.gaps.map((gap, idx) => (
                    <div key={idx} className="p-3 border border-cyber-neonRose/20 bg-cyber-neonRose/5 rounded flex justify-between items-center">
                      <div>
                        <div className="text-xs font-mono font-semibold text-slate-200">{gap.name}</div>
                        <div className="text-[9px] text-slate-400 font-mono">Skill level doesn't meet standard benchmarks</div>
                      </div>
                      <div className="text-right font-mono text-cyber-neonRose font-bold text-sm shrink-0">
                        -{gap.deduction} pts
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded text-xs text-slate-400 text-center font-mono leading-relaxed">
                    🌟 Maximum Alignment! Your skill vectors completely satisfy the entry-level baseline criteria for this role.
                  </div>
                )}

                <div className="p-3.5 border border-amber-500/20 bg-amber-500/5 rounded flex items-start gap-2.5">
                  <ShieldAlert className="text-amber-400 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                    <strong>Engine Note</strong>: Weights represent ideal entry standards in high-performance startups. Scores are adjustable by admins depending on custom hiring criteria.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
