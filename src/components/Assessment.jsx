import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS, DISCOVERY_SCENARIOS } from '../data/careerData';
import { HelpCircle, Award, ArrowRight, RotateCcw, AlertTriangle, Compass, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateAIQuestions } from '../services/aiQuestionService';

export default function Assessment({ onComplete, targetCareerId = 'software_engineer' }) {
  const [stage, setStage] = useState('intro'); // intro, discovery, diagnostic, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsList, setQuestionsList] = useState(ASSESSMENT_QUESTIONS);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Discovery State
  const [discoveryAnswers, setDiscoveryAnswers] = useState({}); // { scenarioId: career_id }
  
  // Diagnostic State
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({}); // { questionId: selectedIndex }
  const [scoreSummary, setScoreSummary] = useState(null);

  const startDiscovery = () => {
    setStage('discovery');
    setCurrentQuestionIndex(0);
  };

  const startDiagnostic = async () => {
    setIsLoadingAI(true);
    const aiQuestions = await generateAIQuestions({
      category: 'dsa',
      career: (targetCareerId || 'software_engineer').replace('_', ' '),
      roadmapWeek: 'Assessment Stage',
      weeklyTasks: ['Coding Logic', 'Database SQL', 'Aptitude & Math', 'Communication'],
      difficulty: 'Easy',
      count: 4
    });

    if (aiQuestions && aiQuestions.length > 0) {
      // Map AI questions to assessment structure
      const mapped = aiQuestions.map((q, idx) => ({
        id: q.id || `ai_diag_${idx}`,
        category: idx === 0 ? 'coding' : idx === 1 ? 'sql' : idx === 2 ? 'aptitude' : 'communication',
        question: q.question,
        options: q.options.map(o => o.text),
        correctIndex: Math.max(0, q.options.findIndex(o => o.isCorrect))
      }));
      setQuestionsList(mapped);
    } else {
      setQuestionsList(ASSESSMENT_QUESTIONS);
    }

    setIsLoadingAI(false);
    setStage('diagnostic');
    setCurrentQuestionIndex(0);
  };

  const handleDiscoverySelect = (careerType) => {
    const scenario = DISCOVERY_SCENARIOS[currentQuestionIndex];
    setDiscoveryAnswers(prev => ({ ...prev, [scenario.id]: careerType }));
    
    if (currentQuestionIndex < DISCOVERY_SCENARIOS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finished discovery stage
      setStage('discovery_transition');
    }
  };

  const handleDiagnosticSelect = (optionIndex) => {
    const question = questionsList[currentQuestionIndex];
    setDiagnosticAnswers(prev => ({ ...prev, [question.id]: optionIndex }));
    
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed diagnostic, evaluate scores
      calculateScores();
    }
  };

  const calculateScores = () => {
    // 1. Calculate Discovery distribution
    const careerTally = {};
    DISCOVERY_SCENARIOS.forEach(s => {
      const chosen = discoveryAnswers[s.id];
      if (chosen) {
        careerTally[chosen] = (careerTally[chosen] || 0) + 1;
      }
    });

    // Convert tallies to weights/percentages
    const totalDiscovery = DISCOVERY_SCENARIOS.length;
    const discoveryWeights = {};
    Object.keys(careerTally).forEach(c => {
      discoveryWeights[c] = Math.round((careerTally[c] / totalDiscovery) * 100);
    });

    // 2. Calculate Diagnostic accuracy per category
    const categoryStats = {
      aptitude: { correct: 0, total: 0 },
      coding: { correct: 0, total: 0 },
      sql: { correct: 0, total: 0 },
      mathematics: { correct: 0, total: 0 },
      communication: { correct: 0, total: 0 }
    };

    questionsList.forEach(q => {
      const userChoiceIndex = diagnosticAnswers[q.id];
      const isCorrect = userChoiceIndex !== undefined && (q.correctIndex !== undefined ? userChoiceIndex === q.correctIndex : q.options[userChoiceIndex]?.isCorrect);
      
      const catKey = q.category || 'coding';
      if (!categoryStats[catKey]) {
        categoryStats[catKey] = { correct: 0, total: 0 };
      }
      categoryStats[catKey].total += 1;
      if (isCorrect) {
        categoryStats[catKey].correct += 1;
      }
    });

    // Normalize category scores to percentage
    const skillScores = {};
    Object.keys(categoryStats).forEach(cat => {
      const stats = categoryStats[cat];
      skillScores[cat] = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 50;
    });

    const summary = {
      skills: skillScores,
      interests: discoveryWeights
    };

    setScoreSummary(summary);
    setStage('results');
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#3b82f6', '#06b6d4', '#f43f5e']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#3b82f6', '#06b6d4', '#f43f5e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleFinish = () => {
    onComplete(scoreSummary.skills, scoreSummary.interests);
  };

  return (
    <div className="glass-panel border-glow-blue p-6 rounded-xl max-w-2xl mx-auto scanlines">
      {stage === 'intro' && (
        <div className="text-center py-8 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-cyber-neonBlue/10 border border-cyber-neonBlue text-cyber-neonBlue animate-pulse">
            <Compass size={40} />
          </div>
          <h2 className="text-3xl font-bold font-mono tracking-wider text-white">CAREER FIT TEST</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            RookX evaluates your potential using real scenarios and skill questions. Answer honestly to uncover your best career matches.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto pt-4">
            <div className="p-3 border border-cyber-border rounded bg-cyber-dark/30">
              <div className="text-xs font-mono text-cyber-neonCyan font-bold">PART 1: CAREER PREFERENCES</div>
              <p className="text-[10px] text-slate-400 mt-1">4 scenario questions to discover what work style suits you best.</p>
            </div>
            <div className="p-3 border border-cyber-border rounded bg-cyber-dark/30">
              <div className="text-xs font-mono text-cyber-neonRose font-bold">PART 2: SKILL QUIZ</div>
              <p className="text-[10px] text-slate-400 mt-1">7 short questions to test coding, logic, math, and communication.</p>
            </div>
          </div>

          <button 
            onClick={startDiscovery}
            className="cyber-btn cyber-btn-purple px-8 py-3.5 rounded-lg text-sm font-mono tracking-wider font-bold text-white inline-flex items-center gap-2 shadow-xl cursor-pointer"
          >
            BEGIN CAREER FIT TEST <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Discovery Stage */}
      {stage === 'discovery' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="text-cyber-neonCyan font-bold">PART 1: CAREER PREFERENCES</span>
            <span>Question {currentQuestionIndex + 1} of {DISCOVERY_SCENARIOS.length}</span>
          </div>
          
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-cyber-neonCyan h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / DISCOVERY_SCENARIOS.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-5 border border-cyber-border bg-cyber-dark/40 rounded-lg min-h-[90px] flex items-center justify-center">
            <p className="text-base text-white text-center font-mono leading-relaxed">
              {DISCOVERY_SCENARIOS[currentQuestionIndex].question}
            </p>
          </div>

          <div className="space-y-3">
            {DISCOVERY_SCENARIOS[currentQuestionIndex].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleDiscoverySelect(opt.type)}
                className="w-full text-left p-4 rounded-lg border border-cyber-border bg-cyber-dark/20 text-sm text-slate-300 hover:border-cyber-neonCyan hover:bg-cyber-neonCyan/5 hover:text-white transition-all font-mono cursor-pointer"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Discovery Transition */}
      {stage === 'discovery_transition' && (
        <div className="text-center py-8 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-cyber-neonCyan/10 border border-cyber-neonCyan text-cyber-neonCyan">
            <CheckCircle2 size={40} className="animate-bounce" />
          </div>
          <h3 className="text-xl font-bold font-mono text-white">PART 1 COMPLETE!</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Your career preferences are saved! Now let's complete the quick 7-question skill quiz to grade logic, coding, and problem solving.
          </p>

          <button 
            onClick={startDiagnostic}
            className="cyber-btn cyber-btn-purple px-8 py-3.5 rounded-lg text-sm font-mono tracking-wider font-bold text-white inline-flex items-center gap-2 shadow-xl cursor-pointer"
          >
            CONTINUE TO SKILL QUIZ <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Diagnostic Stage */}
      {stage === 'diagnostic' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="text-cyber-neonRose font-bold">PART 2: SKILL QUIZ</span>
            <span>Question {currentQuestionIndex + 1} of {questionsList.length}</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-cyber-neonRose h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questionsList.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-5 border border-cyber-border bg-cyber-dark/40 rounded-lg min-h-[90px] flex items-center justify-center flex-col">
            <span className="hud-label text-[10px] text-cyber-neonRose mb-2 font-mono uppercase">
              Category: {questionsList[currentQuestionIndex]?.category || 'technical'}
            </span>
            <p className="text-sm text-white text-center font-mono leading-relaxed">
              {questionsList[currentQuestionIndex]?.question || questionsList[currentQuestionIndex]?.text}
            </p>
          </div>

          <div className="space-y-3">
            {(questionsList[currentQuestionIndex]?.options || []).map((opt, i) => (
              <button
                key={i}
                onClick={() => handleDiagnosticSelect(i)}
                className="w-full text-left p-3.5 rounded-lg border border-cyber-border bg-cyber-dark/20 text-sm text-slate-300 hover:border-cyber-neonRose hover:bg-cyber-neonRose/5 hover:text-white transition-all font-mono cursor-pointer"
              >
                {typeof opt === 'string' ? opt : opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Stage */}
      {stage === 'results' && scoreSummary && (
        <div className="text-center py-6 space-y-6 animate-fadeIn">
          <div className="inline-flex p-4 rounded-full bg-cyber-neonPurple/10 border border-cyber-neonPurple text-cyber-neonPurple">
            <Award size={40} className="animate-spin-slow" />
          </div>
          
          <h3 className="text-2xl font-bold font-mono tracking-wider text-white">TEST COMPLETE!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
            RookX calculated your career alignment and skill scores.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left py-4">
            <div className="p-4 border border-cyber-border bg-cyber-dark/40 rounded">
              <div className="text-xs font-mono text-cyber-neonCyan mb-3 font-bold">CAREER PREFERENCE MATCH</div>
              <div className="space-y-2">
                {Object.entries(scoreSummary.interests).map(([career, pct]) => (
                  <div key={career} className="text-xs font-mono text-slate-300 flex justify-between">
                    <span className="capitalize">{career.replace('_', ' ')}</span>
                    <span className="font-bold text-cyber-neonCyan">{pct}%</span>
                  </div>
                ))}
                {Object.keys(scoreSummary.interests).length === 0 && (
                  <div className="text-xs font-mono text-slate-500 italic">Balanced distribution</div>
                )}
              </div>
            </div>

            <div className="p-4 border border-cyber-border bg-cyber-dark/40 rounded">
              <div className="text-xs font-mono text-cyber-neonRose mb-3 font-bold">SKILL QUIZ SCORES</div>
              <div className="space-y-2">
                {Object.entries(scoreSummary.skills).map(([cat, score]) => (
                  <div key={cat} className="text-xs font-mono text-slate-300 flex justify-between">
                    <span className="capitalize">{cat}</span>
                    <span className="font-bold text-cyber-neonRose">{score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            className="cyber-btn cyber-btn-purple px-8 py-3.5 rounded-lg text-sm font-mono tracking-wider font-bold text-white inline-flex items-center gap-2 shadow-xl cursor-pointer"
          >
            VIEW MY CAREER MATCHES <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
