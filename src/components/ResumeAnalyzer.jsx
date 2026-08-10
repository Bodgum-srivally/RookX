import React, { useState } from 'react';
import { CAREER_LIST } from '../data/careerData';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const MOCK_RESUMES = [
  {
    name: "Ravi's Draft Resume (2nd Year)",
    text: "Ravi Kumar. 2nd Year Computer Science student. Skills: Python, Basic Java, Git, HTML, CSS. Completed 1 small landing page project. Looking for web development internships."
  },
  {
    name: "Preeti's Data Analyst Profile",
    text: "Preeti Sharma. Statistics major. Proficient in SQL, Excel, and Tableau. Basic Python scripting. Completed project analyzing sales data and trends. Strong communication."
  },
  {
    name: "Karan's Design Portfolio CV",
    text: "Karan Johar. UI Designer. Skills: Figma, Adobe XD, Photoshop, Illustrator, HTML, CSS, user research. Designed edtech dashboard wireframes and mobile layouts."
  }
];

export default function ResumeAnalyzer({ targetCareerId }) {
  const career = CAREER_LIST.find(c => c.id === targetCareerId) || CAREER_LIST[0];
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  const performAnalysis = (textToAnalyze) => {
    setAnalyzing(true);
    setAnalysisResults(null);

    // Simulate analysis delay
    setTimeout(() => {
      const textLower = textToAnalyze.toLowerCase();
      const detectedSkills = [];
      const missingSkills = [];
      
      // Keyword matching matching database
      const skillsToCheck = [
        { name: "Python", keywords: ["python", "pandas", "numpy", "django", "flask"] },
        { name: "JavaScript/React", keywords: ["javascript", "js", "react", "vue", "angular", "node"] },
        { name: "SQL & Querying", keywords: ["sql", "mysql", "postgres", "database", "sqlite", "query"] },
        { name: "Data Structures & Algorithms", keywords: ["dsa", "algorithms", "data structures", "leetcode", "trees", "graphs"] },
        { name: "Git & Version Control", keywords: ["git", "github", "gitlab", "version control"] },
        { name: "Probability & Statistics", keywords: ["statistics", "probability", "r language", "tableau", "excel", "math"] },
        { name: "Network Routing & Protocols", keywords: ["networking", "network", "tcp", "dns", "http", "ip", "cisco"] },
        { name: "Vulnerability Scanning", keywords: ["vulnerability", "security scan", "penetration", "nmap", "wireshark"] },
        { name: "Figma & Prototyping", keywords: ["figma", "sketch", "adobe xd", "ui", "ux", "wireframe", "prototype"] },
        { name: "Typography & Color Theory", keywords: ["typography", "color theory", "layout", "aesthetics", "photoshop"] },
        { name: "Agile & Jira Management", keywords: ["agile", "jira", "scrum", "kanban", "sprint"] },
        { name: "Product Roadmap Design", keywords: ["roadmap", "prd", "product requirement", "feature prioritization"] }
      ];

      skillsToCheck.forEach(skill => {
        const hasSkill = skill.keywords.some(kw => textLower.includes(kw));
        if (hasSkill) {
          detectedSkills.push(skill.name);
        }
      });

      // Match against target career required skills
      career.requiredSkills.forEach(reqSkill => {
        const isDetected = detectedSkills.some(det => 
          det.toLowerCase().includes(reqSkill.name.toLowerCase().split(' ')[0]) ||
          reqSkill.name.toLowerCase().includes(det.toLowerCase().split(' ')[0])
        );

        if (!isDetected) {
          missingSkills.push(reqSkill.name);
        }
      });

      // Calculate score based on ratio of detected skills
      const totalRequired = career.requiredSkills.length;
      const detectedCount = totalRequired - missingSkills.length;
      const matchScore = totalRequired > 0 
        ? Math.round((detectedCount / totalRequired) * 100) 
        : 70;

      // Extract details
      const score = Math.max(35, Math.min(95, matchScore + (textToAnalyze.length > 150 ? 10 : 0)));

      setAnalysisResults({
        score,
        detected: detectedSkills,
        missing: missingSkills,
        projectsCount: textLower.includes('project') || textLower.includes('portfolio') ? 1 : 0
      });
      setAnalyzing(false);
    }, 1500);
  };

  const handleMockClick = (mockText) => {
    setResumeText(mockText);
    performAnalysis(mockText);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setResumeText(`[Uploaded File: ${file.name}]\n\n${text}`);
        performAnalysis(text);
      };
      reader.readAsText(file);
    }
  };

  const resetAnalysis = () => {
    setResumeText('');
    setAnalysisResults(null);
  };

  return (
    <div className="glass-panel border-glow-cyan p-6 rounded-xl relative scanlines">
      <div className="absolute top-3 right-4 hud-label text-cyber-neonCyan">RESUME_PARSER</div>

      <div className="border-b border-cyber-border pb-4 mb-6">
        <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
          <FileText className="text-cyber-neonCyan" />
          RESUME PROFILE ANALYZER
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">Parse your existing resume file to evaluate compatibility alignment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Upload / Paste */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="hud-label text-slate-500">Fast Demo Presets</span>
            <div className="flex flex-col gap-2">
              {MOCK_RESUMES.map((mock, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMockClick(mock.text)}
                  className="p-2 border border-cyber-border/40 bg-cyber-dark/40 text-left rounded text-xs font-mono text-slate-300 hover:border-cyber-neonCyan hover:bg-cyber-neonCyan/5 transition-all"
                >
                  ⚡ LOAD: {mock.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="hud-label text-slate-500">Paste Resume Text or Drop File</span>
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="p-6 border border-dashed border-cyber-border rounded-lg bg-cyber-dark/20 text-center hover:border-cyber-neonCyan transition-all cursor-pointer"
            >
              <Upload size={32} className="mx-auto text-slate-500 mb-2 animate-bounce" />
              <p className="text-xs font-mono text-slate-400">Drag & drop resume .txt or click to copy paste</p>
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste raw CV / Resume text here..."
              rows={5}
              className="w-full bg-cyber-dark border border-cyber-border rounded p-3 text-xs font-mono text-white focus:outline-none focus:border-cyber-neonCyan"
            />
            {resumeText && !analyzing && !analysisResults && (
              <button
                onClick={() => performAnalysis(resumeText)}
                className="cyber-btn cyber-btn-purple w-full py-2 rounded text-xs font-mono tracking-wider font-bold text-white"
              >
                EXECUTE PARSING PIPELINE
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Analysis Display */}
        <div className="p-5 rounded border border-cyber-border bg-cyber-dark/40 relative min-h-[300px] flex flex-col justify-between">
          {analyzing && (
            <div className="absolute inset-0 bg-cyber-dark/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4 font-mono">
              <RefreshCw className="text-cyber-neonCyan animate-spin" size={32} />
              <span className="text-xs text-cyber-neonCyan font-bold tracking-wider">EXTRACTING SEMANTIC SKILLS...</span>
            </div>
          )}

          {analysisResults ? (
            <div className="space-y-5 animate-fadeIn font-mono">
              <div className="text-center py-2">
                <span className="hud-label text-slate-500">RESUME ALIGNMENT GRADIENT</span>
                <div className="text-4xl font-extrabold text-cyber-neonCyan mt-1 font-mono">
                  {analysisResults.score}%
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Target Match: <strong className="text-white">{career.name}</strong>
                </p>
              </div>

              {/* Detected Skills */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Detected Core Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResults.detected.length > 0 ? (
                    analysisResults.detected.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded flex items-center gap-1">
                        <CheckCircle2 size={10} /> {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No technical keywords detected.</span>
                  )}
                </div>
              </div>

              {/* Missing Core Skills */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Gaps Identified</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResults.missing.length > 0 ? (
                    analysisResults.missing.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-cyber-neonRose/10 border border-cyber-neonRose/30 text-cyber-neonRose text-[10px] rounded flex items-center gap-1">
                        <AlertCircle size={10} /> {skill}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500 text-emerald-400 text-[10px] rounded">
                      ✓ No major gaps in CV
                    </span>
                  )}
                </div>
              </div>

              {/* Action summary */}
              <div className="p-3 border border-cyber-border rounded bg-cyber-dark/60 text-[11px] leading-relaxed text-slate-300">
                <strong>Verdict</strong>: Your CV shows strong foundations, but needs to feature details like <strong>{analysisResults.missing[0] || 'projects'}</strong>. Check the 4-week roadmap to build matching repositories.
              </div>

              <button 
                onClick={resetAnalysis}
                className="w-full py-2 border border-cyber-border rounded text-[10px] text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all font-mono"
              >
                RESET ANALYSIS PANEL
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 font-mono">
              <div className="text-3xl">📁</div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Source Data</h3>
              <p className="text-[10px] text-slate-500 max-w-[200px] leading-relaxed">
                Load a preset CV or paste your own document on the left to extract compatibility diagnostics.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
