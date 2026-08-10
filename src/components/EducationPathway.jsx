import React, { useState } from 'react';
import { EDUCATION_PATHWAYS, SCHOLARSHIPS } from '../data/careerData';
import { GraduationCap, Landmark, Calendar, Award, Filter, MapPin } from 'lucide-react';

export default function EducationPathway({ profile, targetCareerId }) {
  const pathData = EDUCATION_PATHWAYS[targetCareerId] || EDUCATION_PATHWAYS.software_engineer;

  // Custom filters based on student constraints (initialized from profile constraints)
  const [locFilter, setLocFilter] = useState(profile.constraints?.location || 'No Preference');
  const [budgetFilter, setBudgetFilter] = useState(profile.constraints?.budget || 'No Constraint');
  const [typeFilter, setTypeFilter] = useState(profile.constraints?.collegeType || 'No Preference');

  // Helper checking if college fees match budget filter
  const feeMatchesBudget = (feeStr, filterVal) => {
    if (filterVal === 'No Constraint') return true;
    
    // Parse fee numeric value
    const numericFee = parseInt(feeStr.replace(/[^0-9]/g, '')) || 0;
    if (feeStr.includes('Nil')) return true; // government stipends

    if (filterVal === 'Under 1 Lakh/Yr') {
      return numericFee < 100000;
    } else if (filterVal === '1-3 Lakhs/Yr') {
      return numericFee >= 100000 && numericFee <= 300000;
    } else if (filterVal === '3-5 Lakhs/Yr') {
      return numericFee <= 500000;
    }
    return true;
  };

  // Helper checking if college location matches preference
  const locationMatches = (distStr, filterVal) => {
    if (filterVal === 'No Preference') return true;
    return distStr.toLowerCase() === filterVal.toLowerCase();
  };

  // Helper checking if college type matches preference
  const typeMatches = (typeStr, filterVal) => {
    if (filterVal === 'No Preference') return true;
    return typeStr.toLowerCase() === filterVal.toLowerCase();
  };

  // Filter colleges list
  const filteredColleges = pathData.colleges.filter(col => {
    return feeMatchesBudget(col.fees, budgetFilter) && 
           locationMatches(col.distance, locFilter) && 
           typeMatches(col.type, typeFilter);
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Degrees & Exams */}
        <div className="lg:col-span-1 space-y-6">
          {/* Courses / Degrees */}
          <div className="glass-panel border-glow-purple p-5 rounded-xl relative">
            <h3 className="text-base font-bold font-mono text-white mb-4 flex items-center gap-2">
              <GraduationCap className="text-cyber-neonPurple" />
              SUGGESTED DEGREE TRACKS
            </h3>
            <div className="space-y-3">
              {pathData.courses.map((crs, idx) => (
                <div key={idx} className="p-3 border border-cyber-border/60 bg-cyber-dark/40 rounded font-mono">
                  <div className="text-xs font-bold text-white">{crs.name}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                    <span>Duration: <strong>{crs.duration}</strong></span>
                    <span className="text-cyber-neonPurple font-bold">Recommended: {crs.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Entrance Exams */}
          <div className="glass-panel border-glow-rose p-5 rounded-xl relative">
            <h3 className="text-base font-bold font-mono text-white mb-4 flex items-center gap-2">
              <Calendar className="text-cyber-neonRose" />
              REQUIRED ENTRANCE EXAMS
            </h3>
            <div className="space-y-3">
              {pathData.entranceExams.map((ex, idx) => (
                <div key={idx} className="p-3 border border-cyber-border/60 bg-cyber-dark/40 rounded font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{ex.name}</span>
                    <span className="text-[9px] bg-cyber-neonRose/20 text-cyber-neonRose px-1.5 py-0.5 rounded border border-cyber-neonRose/30">DATES: {ex.dates}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{ex.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Colleges List with Live Filter Controls */}
        <div className="lg:col-span-2 glass-panel border-glow-cyan p-5 rounded-xl flex flex-col justify-between">
          <div className="absolute top-3 right-4 hud-label text-cyber-neonCyan">COLLEGE_RECOMMENDER</div>
          
          <div className="space-y-4">
            <div className="border-b border-cyber-border/40 pb-3 mb-2 flex justify-between items-center">
              <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <Landmark className="text-cyber-neonCyan" />
                TARGET ENGINEERING & TECH INSTITUTES
              </h3>
            </div>

            {/* Filter Panel */}
            <div className="p-3 border border-cyber-border/50 bg-cyber-dark/40 rounded flex flex-col sm:flex-row gap-4 font-mono text-xs text-slate-400">
              <div className="flex-1 space-y-1.5">
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">📍 Distance Preference</label>
                <select 
                  value={locFilter} 
                  onChange={(e) => setLocFilter(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-border rounded p-1.5 text-white focus:outline-none focus:border-cyber-neonCyan"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Local">Local (Same State)</option>
                  <option value="Outstation">Outstation (India)</option>
                  <option value="Remote">Remote Degrees</option>
                </select>
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">💰 Budget Limit</label>
                <select 
                  value={budgetFilter} 
                  onChange={(e) => setBudgetFilter(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-border rounded p-1.5 text-white focus:outline-none focus:border-cyber-neonCyan"
                >
                  <option value="No Constraint">No Constraint</option>
                  <option value="Under 1 Lakh/Yr">Under 1 Lakh/Yr</option>
                  <option value="1-3 Lakhs/Yr">1-3 Lakhs/Yr</option>
                  <option value="3-5 Lakhs/Yr">3-5 Lakhs/Yr</option>
                </select>
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">🏫 College Type</label>
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-cyber-dark border border-cyber-border rounded p-1.5 text-white focus:outline-none focus:border-cyber-neonCyan"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                </select>
              </div>
            </div>

            {/* Colleges Render */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((col, idx) => (
                  <div key={idx} className="p-3 border border-cyber-border/40 bg-cyber-dark/20 rounded flex justify-between items-center font-mono">
                    <div>
                      <div className="text-xs font-bold text-white">{col.name}</div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center gap-0.5"><MapPin size={10} /> {col.location}</span>
                        <span>•</span>
                        <span>Type: <strong>{col.type}</strong></span>
                        <span>•</span>
                        <span>Route: <strong>{col.admission}</strong></span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-cyber-neonCyan font-bold">{col.fees}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{col.distance} status</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 border border-dashed border-cyber-border rounded text-center text-xs text-slate-500 italic font-mono">
                  ⚠️ No colleges match your selected preferences. Try resetting distance or budget limits.
                </div>
              )}
            </div>
          </div>

          <div className="p-2 border border-yellow-500/20 bg-yellow-500/5 rounded text-[10px] font-mono text-slate-400 mt-4 leading-relaxed">
            * Verification notice: Tuitions are representative. Verify directly on official university portals.
          </div>
        </div>

      </div>

      {/* Scholarships Panel */}
      <div className="glass-panel border-glow-purple p-6 rounded-xl relative scanlines">
        <div className="absolute top-3 right-4 hud-label text-cyber-neonPurple">SCHOLARSHIP_REGISTRY</div>
        
        <h3 className="text-base font-bold font-mono text-white mb-4 flex items-center gap-2">
          <Award className="text-cyber-neonPurple" />
          AVAILABLE TECHNICAL SCHOLARSHIPS & FELLOWSHIPS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCHOLARSHIPS.map((sch, idx) => (
            <div key={idx} className="p-4 border border-cyber-border bg-cyber-dark/40 rounded flex flex-col justify-between font-mono">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-white max-w-[70%]">{sch.name}</span>
                  <span className="text-[9px] bg-cyber-neonPurple/20 text-cyber-neonPurple border border-cyber-neonPurple/40 px-1.5 py-0.5 rounded font-bold shrink-0">
                    DUE: {sch.deadline}
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-bold">{sch.amount}</div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{sch.eligibility}</p>
              </div>

              <div className="pt-3 border-t border-cyber-border/40 mt-3 flex justify-between items-center text-[9px] text-slate-500">
                <span>Verified Source: <a href={`https://${sch.source}`} target="_blank" rel="noreferrer" className="text-cyber-neonPurple hover:underline">{sch.source}</a></span>
                <span>Category: Merit-Cum-Means</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
