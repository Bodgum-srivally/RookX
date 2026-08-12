import React, { useState } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { HelpCircle, Check, X, ShieldAlert, Cpu, Award, Zap, Sparkles, TrendingUp, Trophy, ArrowRight } from 'lucide-react';

export default function DecisionEngine({ profile, assessment, onSelectTarget, setTab }) {
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

    if (career.id === 'software_engineer') {
      const p1 = (coding / 100) * 40;
      const p2 = (math / 100) * 20;
      const p3 = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) / 100) * 15;
      const p4 = (sql / 100) * 10;
      const p5 = (comms / 100) * 10;
      const p6 = (interestBlended / 100) * 5;
      
      score = p1 + p2 + p3 + p4 + p5 + p6;

      factors.push({ name: 'Programming Foundations', value: Math.round(p1), max: 40 });
      factors.push({ name: 'Problem Solving (Math)', value: Math.round(p2), max: 20 });
      factors.push({ name: 'Aptitude & Speed', value: Math.round(p3), max: 15 });
      factors.push({ name: 'SQL/Querying capacity', value: Math.round(p4), max: 10 });
      factors.push({ name: 'Technical Communications', value: Math.round(p5), max: 10 });

      if (coding < 75) gaps.push({ name: 'Coding proficiency below benchmark', deduction: Math.round((75 - coding) * 0.4) });
      if (sql < 65) gaps.push({ name: 'Underdeveloped SQL querying skills', deduction: Math.round((65 - sql) * 0.1) });
    } 
    else if (career.id === 'data_scientist') {
      const p1 = (sql / 100) * 30;
      const p2 = (math / 100) * 25;
      const p3 = (getBlendedMetric(profile.skills?.mathematics, assessment.skills?.aptitude) / 100) * 20;
      const p4 = (coding / 100) * 15;
      const p5 = (comms / 100) * 10;
      
      score = p1 + p2 + p3 + p4 + p5;

      factors.push({ name: 'SQL Databases', value: Math.round(p1), max: 30 });
      factors.push({ name: 'Probability & Stats (Math)', value: Math.round(p2), max: 25 });
      factors.push({ name: 'Logical Aptitude', value: Math.round(p3), max: 20 });
      factors.push({ name: 'Python/Data coding', value: Math.round(p4), max: 15 });

      if (math < 70) gaps.push({ name: 'Statistical background is weak', deduction: Math.round((70 - math) * 0.25) });
      if (sql < 75) gaps.push({ name: 'Aggregations & Joins below target', deduction: Math.round((75 - sql) * 0.3) });
    } 
    else if (career.id === 'cybersecurity_analyst') {
      const p1 = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) / 100) * 25;
      const p2 = (coding / 100) * 20;
      const p3 = (getBlendedMetric(50, assessment.skills?.aptitude) / 100) * 25;
      const p4 = (getBlendedMetric(profile.skills?.coding, 50) / 100) * 20;
      const p5 = (comms / 100) * 10;

      score = p1 + p2 + p3 + p4 + p5;

      factors.push({ name: 'Cyber Logic Aptitude', value: Math.round(p1), max: 25 });
      factors.push({ name: 'Bash & Tool Scripting', value: Math.round(p2), max: 20 });
      factors.push({ name: 'Network Configuration baseline', value: Math.round(p3), max: 25 });

      if (coding < 60) gaps.push({ name: 'Python/Bash scripting deficit', deduction: Math.round((60 - coding) * 0.2) });
    } 
    else if (career.id === 'ui_ux_designer') {
      const p1 = (getBlendedMetric(profile.skills?.design_principles, 50) / 100) * 35;
      const p2 = (getBlendedMetric(profile.skills?.business_strategy, 50) / 100) * 25;
      const p3 = (comms / 100) * 20;
      const p4 = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) / 100) * 15;
      const p5 = (coding / 100) * 5;

      score = p1 + p2 + p3 + p4 + p5;

      factors.push({ name: 'Figma & Visual Interface Design', value: Math.round(p1), max: 35 });
      factors.push({ name: 'User Research & Wireframing', value: Math.round(p2), max: 25 });
    } 
    else {
      const p1 = (comms / 100) * 35;
      const p2 = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude) / 100) * 25;
      const p3 = (business / 100) * 20;
      const p4 = (sql / 100) * 15;
      const p5 = (coding / 100) * 5;

      score = p1 + p2 + p3 + p4 + p5;

      factors.push({ name: 'Product Strategy & Roadmap', value: Math.round(p1), max: 35 });
      factors.push({ name: 'User Metrics & Analytics', value: Math.round(p2), max: 25 });
    }

    return {
      compatibility: Math.max(20, Math.min(99, Math.round(score))),
      factors,
      gaps
    };
  };

  const resultsList = CAREER_LIST.map(career => {
    const computed = calculateCompatibility(career);
    return {
      ...career,
      compatibility: computed.compatibility,
      factors: computed.factors,
      gaps: computed.gaps
    };
  }).sort((a, b) => b.compatibility - a.compatibility);

  const topMatch = resultsList[0];
  const secondMatch = resultsList[1] || resultsList[0];
  const activeCareerData = resultsList.find(c => c.id === selectedCareerId) || topMatch;

  // Key user skills
  const userCoding = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
  const userAptitude = getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude);
  const userSql = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
  const userComms = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);

  const radarData = CAREER_LIST.map(career => {
    const matched = resultsList.find(r => r.id === career.id);
    return {
      subject: career.name.replace(' Engineer', '').replace(' Analyst', '').replace(' Designer', ''),
      Compatibility: matched.compatibility,
      fullMark: 100
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn font-mono pb-12">
      
      {/* Header Banner */}
      <section className="glass-panel border-glow-purple p-6 md:p-8 rounded-2xl relative scanlines overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonPurple/40 bg-cyber-neonPurple/10 text-cyber-neonPurple text-xs font-bold uppercase tracking-widest">
            <Trophy size={14} className="animate-pulse" />
            VISUAL CAREER COMPARISON ENGINE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Compare Careers & Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Evaluate your skill breakdown against top career paths with clear explainability on why a career fits your profile.
          </p>
        </div>
      </section>

      {/* PROMINENT "CURRENT STRONGER MATCH" EXPLAINABILITY BANNER (Part 9 Requirement) */}
      <section className="glass-panel border-glow-purple p-6 rounded-2xl space-y-4 scanlines bg-gradient-to-r from-cyber-neonPurple/15 via-cyber-dark/80 to-cyber-neonCyan/10 border border-cyber-neonPurple">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase">
              <Trophy size={14} /> 🏆 CURRENT STRONGER MATCH IDENTIFIED
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {topMatch.name} ({topMatch.compatibility}% Compatibility)
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              "Your coding ({userCoding}%) and problem-solving ({userAptitude}%) performance is significantly stronger than your data-analysis ({userSql}%) performance."
            </p>
          </div>

          <div className="p-4 rounded-xl border border-cyber-neonPurple/50 bg-cyber-dark/80 text-center shrink-0 min-w-[170px]">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">MATCH ADVANTAGE</span>
            <span className="text-2xl font-extrabold text-emerald-400">+{topMatch.compatibility - secondMatch.compatibility}%</span>
            <span className="text-[10px] text-slate-300 block">vs {secondMatch.name}</span>
          </div>
        </div>
      </section>

      {/* VISUAL SKILL COMPARISON BARS (Part 9 Requirement) */}
      <section className="glass-panel border-glow-cyan p-6 rounded-2xl space-y-6 scanlines">
        <div className="flex justify-between items-center border-b border-cyber-border pb-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={18} className="text-cyber-neonCyan" />
              Your Skill Breakdown vs Target Benchmarks
            </h2>
            <p className="text-xs text-slate-400">Comparing your verified skill levels against baseline target benchmarks.</p>
          </div>

          <span className="text-xs font-bold text-cyber-neonCyan">YOU vs BENCHMARKS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-4 p-4 rounded-xl border border-cyber-border bg-cyber-dark/40">
            <div className="flex justify-between items-center text-xs font-bold text-white">
              <span>Programming & Coding</span>
              <span className="text-cyber-neonPurple">{userCoding}% (Target: 85%)</span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div className="bg-gradient-to-r from-cyber-neonPurple to-cyber-neonCyan h-full rounded-full" style={{ width: `${userCoding}%` }}></div>
            </div>
          </div>

          <div className="space-y-4 p-4 rounded-xl border border-cyber-border bg-cyber-dark/40">
            <div className="flex justify-between items-center text-xs font-bold text-white">
              <span>Problem Solving & Aptitude</span>
              <span className="text-cyber-neonCyan">{userAptitude}% (Target: 80%)</span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div className="bg-gradient-to-r from-cyber-neonCyan to-emerald-400 h-full rounded-full" style={{ width: `${userAptitude}%` }}></div>
            </div>
          </div>

          <div className="space-y-4 p-4 rounded-xl border border-cyber-border bg-cyber-dark/40">
            <div className="flex justify-between items-center text-xs font-bold text-white">
              <span>SQL & Databases</span>
              <span className="text-amber-400">{userSql}% (Target: 85%)</span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div className="bg-gradient-to-r from-amber-400 to-rose-400 h-full rounded-full" style={{ width: `${userSql}%` }}></div>
            </div>
          </div>

          <div className="space-y-4 p-4 rounded-xl border border-cyber-border bg-cyber-dark/40">
            <div className="flex justify-between items-center text-xs font-bold text-white">
              <span>Technical Communication</span>
              <span className="text-emerald-400">{userComms}% (Target: 85%)</span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full" style={{ width: `${userComms}%` }}></div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Grid: Radar Chart & Match Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Radar Chart Visualization */}
        <div className="glass-panel border-glow-purple p-6 rounded-2xl relative flex flex-col justify-between scanlines">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">YOUR CAREER LANDSCAPE MATRIX</h3>
            <p className="text-xs text-slate-400 mt-1">Weighted profile-assessment radar projection</p>
          </div>

          <div className="h-64 md:h-72 w-full radar-glow mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.15)" tick={{ fill: '#64748b' }} />
                <Radar name="Compatibility" dataKey="Compatibility" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Matches List & Selector */}
        <div className="glass-panel border-glow-cyan p-6 rounded-2xl flex flex-col justify-between scanlines space-y-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">IDENTIFIED CAREER COMPATIBILITY</h3>
            
            <div className="space-y-2">
              {resultsList.map((career) => (
                <div 
                  key={career.id}
                  onClick={() => setSelectedCareerId(career.id)}
                  className={`
                    p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-center justify-between
                    ${selectedCareerId === career.id 
                      ? 'border-cyber-neonPurple bg-cyber-neonPurple/15 text-white' 
                      : 'border-cyber-border bg-cyber-dark/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full animate-pulse" 
                      style={{ backgroundColor: career.color }}
                    />
                    <div>
                      <span className="text-xs font-bold block text-white">{career.name}</span>
                      <span className="text-[10px] text-slate-400">Weights: Coding, Aptitude, SQL</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-base text-cyber-neonPurple">{career.compatibility}%</span>
                    <span className="text-[9px] block text-slate-400">fit index</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-cyber-border flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              onClick={() => {
                if (onSelectTarget) onSelectTarget(activeCareerData?.id);
                if (setTab) setTab('try_career');
              }}
              className="cyber-btn cyber-btn-purple w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              TRY {activeCareerData?.name?.toUpperCase()} NOW <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
