import React from 'react';
import { CAREER_LIST, EDUCATION_PATHWAYS } from '../data/careerData';
import { FileDown, Users, CheckCircle2, Bookmark } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ParentMode({ profile, assessment, targetCareerId }) {
  const career = CAREER_LIST.find(c => c.id === targetCareerId) || CAREER_LIST[0];
  const pathway = EDUCATION_PATHWAYS[career.id] || EDUCATION_PATHWAYS.software_engineer;

  const getBlendedMetric = (profileVal, assessmentVal) => {
    const p = profileVal !== undefined ? Number(profileVal) : 50;
    const a = assessmentVal !== undefined ? Number(assessmentVal) : 50;
    return Math.round(p * 0.6 + a * 0.4);
  };

  const getOverallMatch = () => {
    let matchSum = 0;
    career.requiredSkills.forEach(reqSkill => {
      let currentVal = 50;
      const nameLower = reqSkill.name.toLowerCase();
      if (nameLower.includes('react') || nameLower.includes('javascript') || nameLower.includes('git')) {
        currentVal = getBlendedMetric(profile.skills?.coding, assessment.skills?.coding);
      } else if (nameLower.includes('sql') || nameLower.includes('query')) {
        currentVal = getBlendedMetric(profile.skills?.sql, assessment.skills?.sql);
      } else if (nameLower.includes('statistic') || nameLower.includes('math')) {
        currentVal = getBlendedMetric(profile.skills?.mathematics, assessment.skills?.mathematics);
      } else {
        currentVal = getBlendedMetric(profile.skills?.communication, assessment.skills?.communication);
      }
      matchSum += Math.min(1.0, currentVal / reqSkill.level);
    });
    return Math.round((matchSum / career.requiredSkills.length) * 100);
  };

  const score = getOverallMatch();

  // Non-technical narrative explaining the student's strengths
  const getParentNarrative = () => {
    const stream = profile.academic?.stream || 'Computer Science';
    const studyHours = profile.preferences?.studyTime || '2-3 hours';
    const locationPref = profile.constraints?.location || 'No Preference';

    let strength = "strong logical capacity and coding interest";
    if (career.id === 'data_scientist') strength = "excellent mathematical skills and interest in discovering factual details";
    if (career.id === 'cybersecurity_analyst') strength = "alert nature, systematic logic, and safeguarding skills";
    if (career.id === 'ui_ux_designer') strength = "exceptional creative layout sense and user empathy";
    if (career.id === 'product_manager') strength = "outstanding communication skills and planning strategy";

    return `Based on our multi-stage diagnostic checks, the student demonstrates a ${strength}. Their profile currently shows a ${score}% compatibility score to become a ${career.name}. They are studying ${stream} and can allocate ${studyHours} daily to close the identified skill gaps. They prefer ${locationPref.toLowerCase() === 'local' ? 'colleges closer to home' : locationPref.toLowerCase() === 'remote' ? 'flexible remote learning courses' : 'colleges anywhere in India'}.`;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const qualification = profile.academic?.qualification || '2nd Year College';
    const stream = profile.academic?.stream || 'Computer Science';

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(33, 41, 54);
    doc.text("RookX - PARENT CAREER PATHWAY REPORT", 20, 30);

    // Decorative underline
    doc.setDrawColor(168, 85, 247);
    doc.setLineWidth(1);
    doc.line(20, 35, 190, 35);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: August 2026 | Student Profile: ${qualification} (${stream})`, 20, 42);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 41, 54);
    doc.text("1. Overall Career Assessment Summary", 20, 55);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 64, 67);
    const splitNarrative = doc.splitTextToSize(getParentNarrative(), 170);
    doc.text(splitNarrative, 20, 63);

    let nextY = 63 + (splitNarrative.length * 6) + 10;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 41, 54);
    doc.text(`2. Selected Career Pathway: ${career.name}`, 20, nextY);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 64, 67);
    doc.text(`- Career Description: ${career.description}`, 20, nextY + 8);
    doc.text(`- Student Compatibility Fit: ${score}% match level`, 20, nextY + 14);

    nextY = nextY + 28;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 41, 54);
    doc.text("3. Recommended College Options & Routes", 20, nextY);

    let collegeY = nextY + 8;
    pathway.colleges.slice(0, 3).forEach((col) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(33, 41, 54);
      doc.text(col.name, 20, collegeY);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Location: ${col.location} | Fees: ${col.fees} | Route: ${col.admission}`, 20, collegeY + 5);
      collegeY += 13;
    });

    collegeY += 5;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 41, 54);
    doc.text("4. Home Support Recommendations", 20, collegeY);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(60, 64, 67);
    doc.text(`- Support the student in spending ${profile.preferences?.studyTime || '2-3 hours'} daily on learning.`, 20, collegeY + 7);
    doc.text("- Review the 4-week roadmap checklist together every Sunday to track milestone completions.", 20, collegeY + 13);
    doc.text("- Check out AICTE Pragati or OP Jindal scholarships to help offset admission fees.", 20, collegeY + 19);

    doc.save(`RookX_Career_Report_${career.id}.pdf`);
  };

  return (
    <div className="glass-panel border-glow-purple p-6 rounded-xl relative scanlines">
      <div className="absolute top-3 right-4 hud-label text-cyber-neonPurple">PARENT_PORTAL</div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyber-border pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Users className="text-cyber-neonPurple animate-pulse" />
            PARENT-FRIENDLY ROADMAP REPORT
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Jargon-free analysis and financial college guidance for families</p>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          className="cyber-btn cyber-btn-purple px-4 py-2.5 rounded text-xs font-mono tracking-wider font-bold text-white flex items-center gap-2 mt-3 sm:mt-0"
        >
          DOWNLOAD REPORT (PDF) <FileDown size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Narrative & Goal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-lg">
            <span className="text-[10px] font-mono text-cyber-neonPurple font-bold uppercase block mb-2">FAMILY SITUATION SUMMARY</span>
            <p className="text-sm text-slate-200 leading-relaxed font-mono">
              {getParentNarrative()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-lg font-mono">
              <span className="text-[10px] text-slate-500 font-bold block mb-2 uppercase">🎓 CAREER CHOICE OUTCOME</span>
              <div className="text-xs text-slate-300 font-bold">Role: <span className="text-white font-semibold">{career.name}</span></div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{career.description}</p>
            </div>
            
            <div className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-lg font-mono">
              <span className="text-[10px] text-slate-500 font-bold block mb-2 uppercase">🎯 ENTRANCE EXAM REQUIREMENT</span>
              <div className="text-xs text-slate-300 font-bold">Primary Exam: <span className="text-cyber-neonPurple font-semibold">{pathway.entranceExams[0]?.name || 'Direct Merit'}</span></div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">Required exam window: {pathway.entranceExams[0]?.dates || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Right Side Support Checklists */}
        <div className="lg:col-span-1 p-5 rounded border border-cyber-border bg-cyber-dark/40 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 font-bold block mb-3 uppercase">💡 How Parents Can Support</span>
            <div className="space-y-3 font-mono">
              <div className="flex gap-2 text-xs text-slate-300">
                <CheckCircle2 className="text-cyber-neonPurple shrink-0 mt-0.5" size={15} />
                <span>Help reserve <strong>{profile.preferences?.studyTime || '2-3 hours'}</strong> of quiet self-study time daily.</span>
              </div>
              <div className="flex gap-2 text-xs text-slate-300">
                <CheckCircle2 className="text-cyber-neonPurple shrink-0 mt-0.5" size={15} />
                <span>Review the <strong>4-Week Roadmap</strong> checklist together every Sunday.</span>
              </div>
              <div className="flex gap-2 text-xs text-slate-300">
                <CheckCircle2 className="text-cyber-neonPurple shrink-0 mt-0.5" size={15} />
                <span>Monitor government scholarship registries (AICTE Pragati, Reliance) for deadlines.</span>
              </div>
            </div>
          </div>

          <div className="p-3 border border-cyber-border/40 rounded bg-cyber-dark/50 text-[10px] text-slate-400 leading-relaxed font-mono mt-4">
            📌 <strong>Parent Tip</strong>: You can print out the downloaded PDF to attach to the study desk as an interactive milestone reference.
          </div>
        </div>

      </div>
    </div>
  );
}
