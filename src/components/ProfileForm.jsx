import React, { useState } from 'react';
import { User, BookOpen, Cpu, Sliders, CheckCircle2, ChevronRight, Sparkles, Mail, Lock } from 'lucide-react';

const SKILL_FIELDS = [
  { id: 'coding', label: 'Programming & Coding', desc: 'Writing code, solving problem logic' },
  { id: 'sql', label: 'Databases & SQL', desc: 'Organizing and querying data tables' },
  { id: 'mathematics', label: 'Math & Statistics', desc: 'Algebra, probability, logic math' },
  { id: 'design_principles', label: 'Visual Design & Layouts', desc: 'Design sense, colors, user interface' },
  { id: 'communication', label: 'Communication & Teamwork', desc: 'Explaining ideas clearly, presenting' },
  { id: 'business_strategy', label: 'Business Thinking', desc: 'Understanding goals, problem solving' }
];

const INTEREST_FIELDS = [
  { id: 'tech', label: 'Technology & Apps', desc: 'Building software, mobile & web apps' },
  { id: 'data', label: 'Data & Analytics', desc: 'Finding trends, insights & numbers' },
  { id: 'security', label: 'Cybersecurity', desc: 'Protecting systems and networks' },
  { id: 'design', label: 'UI/UX Design', desc: 'Creating visual layouts and designs' },
  { id: 'business', label: 'Business & Management', desc: 'Planning products and strategies' }
];

export default function ProfileForm({ profileData = {}, onSave, isOnboarding = false }) {
  const [activeTab, setActiveTab] = useState('academic');
  const [formData, setFormData] = useState({
    fullName: profileData.fullName || '',
    email: profileData.email || '',
    academic: {
      qualification: '2nd Year College',
      stream: 'Computer Science',
      gpa: '8.0',
      ...profileData.academic
    },
    skills: {
      coding: 55,
      sql: 40,
      mathematics: 45,
      design_principles: 30,
      communication: 50,
      business_strategy: 35,
      ...profileData.skills
    },
    interests: profileData.interests || ['tech', 'data'],
    preferences: {
      workStyle: 3, 
      solvingStyle: 3, 
      studyTime: '2-3 Hours',
      ...profileData.preferences
    },
    constraints: {
      location: 'Local',
      budget: '3-5 Lakhs/Yr',
      collegeType: 'Government',
      ...profileData.constraints
    }
  });

  const handleAcademicChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      academic: { ...prev.academic, [field]: val }
    }));
  };

  const handleSkillChange = (skill, val) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: Number(val) }
    }));
  };

  const toggleInterest = (id) => {
    setFormData(prev => {
      const exists = prev.interests.includes(id);
      const newInterests = exists 
        ? prev.interests.filter(item => item !== id)
        : [...prev.interests, id];
      return { ...prev, interests: newInterests };
    });
  };

  const handlePreferenceChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: val }
    }));
  };

  const handleConstraintChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      constraints: { ...prev.constraints, [field]: val }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    onSave(formData);
  };

  const tabClass = (tabId) => `
    flex items-center gap-2 px-4 py-3 rounded-lg border text-xs font-mono tracking-wider transition-all font-bold
    ${activeTab === tabId 
      ? 'bg-cyber-neonPurple/20 border-cyber-neonPurple text-white border-glow-purple' 
      : 'bg-cyber-dark/40 border-cyber-border text-slate-400 hover:border-slate-700 hover:text-slate-200'}
  `;

  return (
    <div className="glass-panel border-glow-purple p-6 rounded-xl relative max-w-4xl mx-auto scanlines animate-fadeIn">
      
      <div className="mb-6 border-b border-cyber-border pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-wide text-white flex items-center gap-2">
          {isOnboarding ? <Sparkles className="text-cyber-neonPurple animate-pulse" /> : <Sliders className="text-cyber-neonPurple animate-pulse" />}
          {isOnboarding ? '🚀 Create Your Student Account' : 'Edit Your Profile'}
        </h2>
        {isOnboarding && (
          <p className="text-xs text-slate-400 font-mono mt-1">
            Enter your name and email to create your account. Next, take the career test to generate your personalized recommendations.
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        <button type="button" onClick={() => setActiveTab('academic')} className={tabClass('academic')}>
          <BookOpen size={16} /> ACCOUNT & EDUCATION
        </button>
        <button type="button" onClick={() => setActiveTab('skills')} className={tabClass('skills')}>
          <Cpu size={16} /> YOUR SKILLS
        </button>
        <button type="button" onClick={() => setActiveTab('preferences')} className={tabClass('preferences')}>
          <Sliders size={16} /> INTERESTS
        </button>
        <button type="button" onClick={() => setActiveTab('constraints')} className={tabClass('constraints')}>
          <User size={16} /> PREFERENCES
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'academic' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="hud-label">Account Details & Academic Background</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-4 border border-cyber-neonPurple/30 bg-cyber-neonPurple/5 rounded-lg">
                <label className="block text-xs font-mono text-white font-bold flex items-center gap-1.5">
                  <User size={14} className="text-cyber-neonPurple" /> FULL NAME *
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="e.g., Nova Kumar"
                  className="w-full bg-cyber-dark border border-cyber-neonPurple/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-neonPurple"
                />
              </div>

              <div className="space-y-2 p-4 border border-cyber-neonCyan/30 bg-cyber-neonCyan/5 rounded-lg">
                <label className="block text-xs font-mono text-white font-bold flex items-center gap-1.5">
                  <Mail size={14} className="text-cyber-neonCyan" /> EMAIL ADDRESS *
                </label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g., nova@example.com"
                  className="w-full bg-cyber-dark border border-cyber-neonCyan/50 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-neonCyan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">CURRENT YEAR / CLASS</label>
                <select 
                  value={formData.academic.qualification}
                  onChange={(e) => handleAcademicChange('qualification', e.target.value)}
                  className="w-full bg-cyber-dark/80 border border-cyber-border rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-neonPurple"
                >
                  <option>Class 12</option>
                  <option>1st Year College</option>
                  <option>2nd Year College</option>
                  <option>3rd Year College</option>
                  <option>4th Year College</option>
                  <option>Graduate</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">STREAM / BRANCH</label>
                <input 
                  type="text" 
                  value={formData.academic.stream}
                  onChange={(e) => handleAcademicChange('stream', e.target.value)}
                  placeholder="e.g., Computer Science, Mechanical, Science"
                  className="w-full bg-cyber-dark/80 border border-cyber-border rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-neonPurple"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">GRADES / CGPA / PERCENTAGE</label>
                <input 
                  type="text" 
                  value={formData.academic.gpa}
                  onChange={(e) => handleAcademicChange('gpa', e.target.value)}
                  placeholder="e.g., 8.2 CGPA or 85%"
                  className="w-full bg-cyber-dark/80 border border-cyber-border rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyber-neonPurple"
                />
              </div>
            </div>
            
            <div className="p-3.5 rounded border border-cyber-border bg-cyber-dark/30 text-xs text-slate-400 leading-relaxed font-mono">
              🔒 Privacy Guarantee: Your name and email are stored locally to personalize your dashboard, learning roadmap, and parent report.
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="hud-label">Rate Your Current Skills (1 to 100)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SKILL_FIELDS.map(skill => (
                <div key={skill.id} className="space-y-2 p-3 rounded border border-cyber-border/40 bg-cyber-dark/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white font-mono">{skill.label}</span>
                    <span className="text-sm font-mono text-cyber-neonPurple font-bold">{formData.skills[skill.id]}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{skill.desc}</p>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={formData.skills[skill.id]} 
                    onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                    className="w-full accent-cyber-neonPurple h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="hud-label">Your Interest Areas</h3>
            
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-400">WHAT EXCITES YOU MOST? (SELECT ANY)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {INTEREST_FIELDS.map(interest => {
                  const selected = formData.interests.includes(interest.id);
                  return (
                    <div 
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`
                        p-3 rounded border cursor-pointer select-none transition-all flex items-start gap-2
                        ${selected 
                          ? 'border-cyber-neonCyan bg-cyber-neonCyan/10 text-white' 
                          : 'border-cyber-border bg-cyber-dark/40 text-slate-400 hover:border-slate-700'}
                      `}
                    >
                      <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${selected ? 'text-cyber-neonCyan' : 'text-slate-600'}`} />
                      <div>
                        <div className="text-xs font-bold font-mono">{interest.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{interest.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-3 p-3 rounded border border-cyber-border/40 bg-cyber-dark/20">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyber-neonBlue font-semibold">BUILD THINGS</span>
                  <span className="text-cyber-neonCyan font-semibold">ANALYZE DATA</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={formData.preferences.workStyle} 
                  onChange={(e) => handlePreferenceChange('workStyle', Number(e.target.value))}
                  className="w-full accent-cyber-neonCyan h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-3 p-3 rounded border border-cyber-border/40 bg-cyber-dark/20">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-cyber-neonRose font-semibold">SOLVE LOGIC</span>
                  <span className="text-cyber-neonPurple font-semibold">WORK WITH PEOPLE</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={formData.preferences.solvingStyle} 
                  onChange={(e) => handlePreferenceChange('solvingStyle', Number(e.target.value))}
                  className="w-full accent-cyber-neonRose h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-400">HOW MUCH TIME CAN YOU DEDICATE DAILY?</label>
              <div className="flex gap-3">
                {['1 Hour', '2-3 Hours', '4-5 Hours', '6+ Hours'].map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handlePreferenceChange('studyTime', time)}
                    className={`
                      flex-1 py-2 text-xs font-mono rounded border transition-all font-bold
                      ${formData.preferences.studyTime === time 
                        ? 'bg-cyber-neonPurple/20 border-cyber-neonPurple text-white' 
                        : 'bg-cyber-dark/40 border-cyber-border text-slate-400 hover:border-slate-700'}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'constraints' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="hud-label">Your Learning & College Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">LOCATION PREFERENCE</label>
                <div className="flex flex-col gap-2">
                  {['Local', 'Outstation', 'Remote', 'No Preference'].map(loc => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleConstraintChange('location', loc)}
                      className={`
                        py-2 text-left px-3 text-xs font-mono rounded border transition-all
                        ${formData.constraints.location === loc 
                          ? 'bg-cyber-neonCyan/25 border-cyber-neonCyan text-white font-bold' 
                          : 'bg-cyber-dark/40 border-cyber-border text-slate-400 hover:border-slate-700'}
                      `}
                    >
                      {loc === 'Local' ? '📍 Home State / City' : loc === 'Outstation' ? '✈️ Anywhere in India' : loc === 'Remote' ? '💻 Online Learning' : '🌐 No Preference'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">BUDGET PER YEAR</label>
                <div className="flex flex-col gap-2">
                  {['Under 1 Lakh/Yr', '1-3 Lakhs/Yr', '3-5 Lakhs/Yr', 'No Constraint'].map(bgt => (
                    <button
                      key={bgt}
                      type="button"
                      onClick={() => handleConstraintChange('budget', bgt)}
                      className={`
                        py-2 text-left px-3 text-xs font-mono rounded border transition-all
                        ${formData.constraints.budget === bgt 
                          ? 'bg-cyber-neonRose/20 border-cyber-neonRose text-white font-bold' 
                          : 'bg-cyber-dark/40 border-cyber-border text-slate-400 hover:border-slate-700'}
                      `}
                    >
                      {bgt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-400">COLLEGE PREFERENCE</label>
                <div className="flex flex-col gap-2">
                  {['Government', 'Private', 'No Preference'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleConstraintChange('collegeType', type)}
                      className={`
                        py-2 text-left px-3 text-xs font-mono rounded border transition-all
                        ${formData.constraints.collegeType === type 
                          ? 'bg-cyber-neonPurple/20 border-cyber-neonPurple text-white font-bold' 
                          : 'bg-cyber-dark/40 border-cyber-border text-slate-400 hover:border-slate-700'}
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer / Submit */}
        <div className="flex justify-end items-center pt-6 border-t border-cyber-border">
          <button 
            type="submit" 
            className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded text-xs font-mono tracking-wider font-bold text-white flex items-center gap-2"
          >
            {isOnboarding ? 'CREATE ACCOUNT & TAKE TEST' : 'SAVE MY PROFILE'} <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
