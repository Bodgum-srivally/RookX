import React, { useState } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { Activity, Compass, Cpu, Award, ArrowRight, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Dashboard({ profile, assessment, targetCareerId, setTab, onSelectTarget }) {
  const [showWhyModal, setShowWhyModal] = useState(false);

  const getBlendedMetric = (profileVal, assessmentVal) => {
    const p = profileVal !== undefined ? Number(profileVal) : 50;
    const a = assessmentVal !== undefined ? Number(assessmentVal) : 50;
    return Math.round(p * 0.6 + a * 0.4);
  };

  const getCareerCompatibility = (career) => {
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
    if (career.id === 'software_engineer') {
      score = (coding/100)*40 + (math/100)*20 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*15 + (sql/100)*10 + (comms/100)*10 + (interestBlended/100)*5;
    } else if (career.id === 'data_scientist') {
      score = (sql/100)*30 + (math/100)*25 + (getBlendedMetric(profile.skills?.mathematics, assessment.skills?.aptitude)/100)*20 + (coding/100)*15 + (comms/100)*10;
    } else if (career.id === 'cybersecurity_analyst') {
      score = (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*25 + (coding/100)*20 + (getBlendedMetric(50, assessment.skills?.aptitude)/100)*25 + (getBlendedMetric(profile.skills?.coding, 50)/100)*20 + (comms/100)*10;
    } else if (career.id === 'ui_ux_designer') {
      score = (getBlendedMetric(profile.skills?.design_principles, 50)/100)*35 + (getBlendedMetric(profile.skills?.business_strategy, 50)/100)*25 + (comms/100)*20 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*15 + (coding/100)*5;
    } else {
      score = (comms/100)*35 + (getBlendedMetric(profile.skills?.coding, assessment.skills?.aptitude)/100)*25 + (business/100)*20 + (sql/100)*15 + (coding/100)*5;
    }
    return Math.max(20, Math.min(99, Math.round(score)));
  };

  const resultsList = CAREER_LIST.map(career => ({
    ...career,
    compatibility: getCareerCompatibility(career)
  })).sort((a, b) => b.compatibility - a.compatibility);

  // Check if assessment is genuinely completed
  const hasAssessment = Boolean(
    profile.isOnboarded && 
    assessment && 
    assessment.skills && 
    Object.keys(assessment.skills).length > 0
  );

  const topMatch = resultsList[0];
  const activeCareer = resultsList.find(c => c.id === targetCareerId) || topMatch;

  // Primary skill gap calculation
  const getPrimarySkillGap = (career) => {
    let maxGap = 0;
    let gapName = 'Data Structures & Algorithms';
    career.requiredSkills.forEach(req => {
      let userVal = 50;
      const nameLower = req.name.toLowerCase();
      if (nameLower.includes('react') || nameLower.includes('javascript') || nameLower.includes('git')) {
        userVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
      } else if (nameLower.includes('sql') || nameLower.includes('query')) {
        userVal = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
      } else if (nameLower.includes('statistic') || nameLower.includes('math')) {
        userVal = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
      } else {
        userVal = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
      }
      const gap = req.level - userVal;
      if (gap > maxGap) {
        maxGap = gap;
        gapName = req.name;
      }
    });
    return gapName;
  };

  const primarySkillGap = getPrimarySkillGap(topMatch);

  // Placement readiness score calculation
  const getReadinessScore = () => {
    const s1 = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
    const s2 = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
    const s3 = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
    const s4 = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
    return Math.round((s1 + s2 + s3 + s4) / 4);
  };
  const readinessIndex = getReadinessScore();

  const userName = profile.fullName ? profile.fullName.toUpperCase() : 'STUDENT';

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyber-border pb-4 gap-3">
        <div>
          <h2 className="text-2xl font-bold font-mono text-white tracking-wide">
            WELCOME BACK, <span className="text-cyber-neonPurple">{userName}</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Profile Matrix: {profile.academic?.qualification || 'College Student'} • {profile.academic?.stream || 'Computer Science'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setTab('profile')}
            className="px-3.5 py-1.5 border border-cyber-border rounded text-xs font-mono text-slate-300 hover:border-cyber-neonPurple transition-all font-bold"
          >
            EDIT PROFILE
          </button>
          <button 
            onClick={() => setTab('assessment')}
            className="px-3.5 py-1.5 border border-cyber-border bg-cyber-neonPurple/15 text-cyber-neonPurple border-cyber-neonPurple/30 rounded text-xs font-mono hover:bg-cyber-neonPurple/25 transition-all font-bold"
          >
            {hasAssessment ? 'RETAKE ASSESSMENT' : 'TAKE ASSESSMENT'}
          </button>
        </div>
      </div>

      {/* Main Grid: Decision Core and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CAREER DECISION ENGINE PANEL */}
        <div className="lg:col-span-1 glass-panel border-glow-purple p-6 rounded-xl flex flex-col justify-between scanlines min-h-[380px] relative">
          <div className="flex justify-between items-center border-b border-cyber-border/60 pb-3 mb-4">
            <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase flex items-center gap-1.5">
              <Cpu className="text-cyber-neonPurple" size={16} />
              CAREER DECISION ENGINE
            </h3>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${hasAssessment ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {hasAssessment ? 'Analysis Status: Complete' : 'Analysis Pending'}
            </span>
          </div>

          {hasAssessment ? (
            <div className="space-y-4 font-mono flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Top Match */}
                <div className="p-3.5 border border-cyber-border rounded-lg bg-cyber-dark/40">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Top Career Match</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-base font-bold text-white">{topMatch.name}</span>
                    <span className="text-xl font-extrabold text-cyber-neonPurple">{topMatch.compatibility}% Compatibility</span>
                  </div>
                </div>

                {/* Why this match breakdown list */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">Why this match?</span>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Skills compatibility verified</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Interest alignment confirmed</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Diagnostic performance score</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>Career goal & academic fit</span>
                    </div>
                  </div>
                </div>

                {/* Primary Skill Gap & Recommended Next Step */}
                <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold block uppercase">Primary Skill Gap</span>
                  <div className="text-xs font-bold text-white">{primarySkillGap}</div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    <strong>Recommended Next Step:</strong> Build {primarySkillGap} fundamentals and reassess your readiness.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowWhyModal(true)}
                className="cyber-btn cyber-btn-purple w-full py-2.5 rounded text-xs font-mono tracking-wider font-bold text-white flex items-center justify-center gap-2 mt-4"
              >
                WHY THIS CAREER? <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-4 font-mono flex-1 flex flex-col justify-between py-4">
              <div className="space-y-3 text-center py-4">
                <Compass size={40} className="mx-auto text-amber-400 animate-bounce" />
                <h4 className="text-base font-bold text-white">Analysis Pending</h4>
                <p className="text-xs text-slate-400 leading-relaxed px-2">
                  Complete your assessment to generate your personalized career recommendations.
                </p>
              </div>

              <button
                onClick={() => setTab('assessment')}
                className="cyber-btn cyber-btn-purple w-full py-3 rounded text-xs font-mono tracking-wider font-bold text-white flex items-center justify-center gap-2"
              >
                TAKE ASSESSMENT <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Key Profile Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Readiness Monitor */}
          <div className="glass-panel border-glow-cyan p-5 rounded-xl flex flex-col justify-between">
            <span className="hud-label text-cyber-neonCyan font-bold">CAREER READINESS MONITOR</span>
            
            <div className="space-y-4 my-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase">Career Readiness Score</h4>
              {hasAssessment ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-mono text-white">{readinessIndex}</span>
                    <span className="text-xs text-cyber-neonCyan font-mono">/ 100 Readiness Index</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-cyber-border">
                    <div 
                      className="bg-cyber-neonCyan h-full transition-all duration-300"
                      style={{ width: `${readinessIndex}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 border border-cyber-border rounded bg-cyber-dark/40 text-xs text-amber-400 font-mono">
                  Analysis Pending — Take career test to calculate your readiness score.
                </div>
              )}
            </div>

            <button 
              onClick={() => setTab('roadmap')}
              className="text-left text-xs font-mono text-cyber-neonCyan hover:underline flex items-center gap-1 mt-4 font-bold"
            >
              Resolve skill gaps & tracks <ChevronRight className="inline" size={12} />
            </button>
          </div>

          {/* Target Alignment Fit */}
          <div className="glass-panel border-glow-rose p-5 rounded-xl flex flex-col justify-between">
            <span className="hud-label text-cyber-neonRose font-bold">TARGET ALIGNMENT FIT</span>

            <div className="space-y-4 my-2 font-mono">
              <h4 className="text-xs font-mono text-slate-400 uppercase">Target Compatibility Score</h4>
              {hasAssessment ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{activeCareer.compatibility}%</span>
                    <span className="text-xs text-cyber-neonRose">Compatibility Fit</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Primary Goal: <strong className="text-white">{activeCareer.name}</strong>
                  </p>
                </>
              ) : (
                <div className="p-3 border border-cyber-border rounded bg-cyber-dark/40 text-xs text-amber-400 font-mono">
                  Analysis Pending — Complete test to unlock target fit score.
                </div>
              )}
            </div>

            <button 
              onClick={() => setTab('decision')}
              className="text-left text-xs font-mono text-cyber-neonRose hover:underline flex items-center gap-1 mt-4 font-bold"
            >
              Analyze career matches <ChevronRight className="inline" size={12} />
            </button>
          </div>

          {/* Quick Tools */}
          <div className="md:col-span-2 glass-panel border-glow-purple p-5 rounded-xl">
            <span className="hud-label text-cyber-neonPurple font-bold">CAREER DECISION TOOLS</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <button 
                onClick={() => setTab('reality')}
                className="p-3 border border-cyber-border bg-cyber-dark/40 text-center rounded hover:border-cyber-neonPurple transition-all font-mono text-xs text-slate-300 hover:text-white font-bold"
              >
                ⚖️ Reality Check
              </button>
              <button 
                onClick={() => setTab('simulator')}
                className="p-3 border border-cyber-border bg-cyber-dark/40 text-center rounded hover:border-cyber-neonPurple transition-all font-mono text-xs text-slate-300 hover:text-white font-bold"
              >
                🔮 Compare Careers
              </button>
              <button 
                onClick={() => setTab('resume')}
                className="p-3 border border-cyber-border bg-cyber-dark/40 text-center rounded hover:border-cyber-neonPurple transition-all font-mono text-xs text-slate-300 hover:text-white font-bold"
              >
                📁 Resume Checker
              </button>
              <button 
                onClick={() => setTab('parent')}
                className="p-3 border border-cyber-border bg-cyber-dark/40 text-center rounded hover:border-cyber-neonPurple transition-all font-mono text-xs text-slate-300 hover:text-white font-bold"
              >
                👨‍👩‍👦 Parent Report
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Recommended Career Matches */}
      <div className="space-y-4">
        <h3 className="hud-label text-slate-400 font-bold">RECOMMENDED CAREER MATCHES</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resultsList.slice(0, 3).map((match, idx) => (
            <div 
              key={match.id} 
              className={`
                glass-panel p-5 rounded-xl relative flex flex-col justify-between min-h-[190px]
                ${idx === 0 ? 'border-glow-purple bg-cyber-neonPurple/5' : 'border-cyber-border'}
              `}
            >
              <div className="font-mono space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white block">{match.name}</span>
                  <span 
                    className="text-sm font-bold font-mono"
                    style={{ color: hasAssessment ? match.color : '#94a3b8' }}
                  >
                    {hasAssessment ? `${match.compatibility}%` : 'Pending'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{match.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-cyber-border/40 flex justify-between items-center font-mono text-xs font-bold">
                <button
                  onClick={() => {
                    onSelectTarget(match.id);
                    setTab('reality');
                  }}
                  className="text-cyber-neonCyan hover:underline flex items-center gap-0.5"
                >
                  Reality Check
                </button>
                <button
                  onClick={() => {
                    onSelectTarget(match.id);
                    setTab('roadmap');
                  }}
                  className="text-cyber-neonPurple hover:underline flex items-center gap-0.5"
                >
                  Build Roadmap
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY THIS CAREER EXPLAINABILITY MODAL */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel border-glow-purple max-w-xl w-full p-6 rounded-2xl relative font-mono space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-cyber-border pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="text-cyber-neonPurple" size={18} />
                  Why {topMatch.name}?
                </h3>
                <span className="text-xs text-cyber-neonPurple font-bold">Calculated Compatibility: {topMatch.compatibility}%</span>
              </div>
              <button 
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 border border-cyber-border rounded-xl bg-cyber-dark/40 space-y-1">
                <span className="font-bold text-cyber-neonCyan block">1. Skills Compatibility Score</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your self-assessed and test-verified skills align with {Math.round(topMatch.compatibility * 0.85)}% of standard entry-level requirements for a {topMatch.name}.
                </p>
              </div>

              <div className="p-3.5 border border-cyber-border rounded-xl bg-cyber-dark/40 space-y-1">
                <span className="font-bold text-cyber-neonRose block">2. Interest & Work Style Alignment</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your stated interests in {profile.interests?.join(', ') || 'technology'} and work style preferences match the daily problem-solving environment of this career.
                </p>
              </div>

              <div className="p-3.5 border border-cyber-border rounded-xl bg-cyber-dark/40 space-y-1">
                <span className="font-bold text-emerald-400 block">3. Diagnostic Assessment Performance</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your accuracy score in logic, aptitude, and technical questions confirms strong potential in this track.
                </p>
              </div>

              <div className="p-3.5 border border-amber-500/30 rounded-xl bg-amber-500/5 space-y-1">
                <span className="font-bold text-amber-400 block">4. Primary Skill Gap & Action Plan</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your primary gap is <strong>{primarySkillGap}</strong>. Recommended action: Build {primarySkillGap} fundamentals and reassess readiness.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-cyber-border">
              <button
                onClick={() => setShowWhyModal(false)}
                className="cyber-btn cyber-btn-purple px-5 py-2 rounded text-xs font-mono font-bold text-white"
              >
                CLOSE EXPLANATION
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function ChevronRight({ size = 16, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
