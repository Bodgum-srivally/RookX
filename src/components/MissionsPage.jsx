import React, { useState } from 'react';
import { 
  Zap, CheckCircle2, ArrowRight, Award, Code, Database, 
  Terminal, Layout, Cpu, Brain, Sparkles, RefreshCw, ChevronRight, Lock
} from 'lucide-react';
import { generateAIQuestions as generateGeminiQuestions } from '../services/aiQuestionService';

export const MISSION_CATEGORIES = [
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: Code, color: 'text-cyber-neonPurple', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
  { id: 'python', name: 'Python', icon: Terminal, color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
  { id: 'java', name: 'Java', icon: Cpu, color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
  { id: 'js', name: 'JavaScript', icon: Sparkles, color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
  { id: 'html_css', name: 'HTML & CSS', icon: Layout, color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
  { id: 'sql', name: 'SQL', icon: Database, color: 'text-cyber-neonCyan', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
  { id: 'aptitude', name: 'Aptitude & Logic', icon: Brain, color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
];

export const ALL_MISSIONS = {
  dsa: [
    {
      id: 'dsa_1',
      title: 'Mission 1: Two Sum Target Index Match',
      topic: 'Arrays & Hash Maps',
      difficulty: 'Easy',
      xpReward: 50,
      question: 'Given an array of integers nums = [2, 7, 11, 15] and target = 9, return the 0-based indices of the two numbers that add up to target.',
      codeSnippet: 'nums = [2, 7, 11, 15], target = 9',
      options: [
        { id: 'A', text: '[0, 1]  (nums[0] + nums[1] = 2 + 7 = 9)', isCorrect: true },
        { id: 'B', text: '[1, 2]  (nums[1] + nums[2] = 7 + 11 = 18)', isCorrect: false },
        { id: 'C', text: '[0, 3]  (nums[0] + nums[3] = 2 + 15 = 17)', isCorrect: false },
        { id: 'D', text: '[2, 3]  (nums[2] + nums[3] = 11 + 15 = 26)', isCorrect: false },
      ],
      explanation: 'Correct! nums[0] + nums[1] = 2 + 7 = 9. Utilizing a Hash Map achieves O(N) linear time complexity instead of nested loops O(N²).'
    },
    {
      id: 'dsa_2',
      title: 'Mission 2: Valid Parentheses Matching',
      topic: 'Stacks (LIFO)',
      difficulty: 'Fundamentals',
      xpReward: 50,
      question: 'Which Data Structure is optimal to verify that every opening bracket has a matching closing bracket in "()[]{}" in O(N) linear time?',
      codeSnippet: 's = "()[]{}"',
      options: [
        { id: 'A', text: 'Queue (First-In, First-Out)', isCorrect: false },
        { id: 'B', text: 'Stack (Last-In, First-Out)', isCorrect: true },
        { id: 'C', text: 'Binary Search Tree', isCorrect: false },
        { id: 'D', text: 'Priority Queue / Min-Heap', isCorrect: false },
      ],
      explanation: 'Correct! A Stack (LIFO) pushes opening brackets onto top of stack and pops them off when a matching closing bracket is encountered.'
    },
    {
      id: 'dsa_3',
      title: 'Mission 3: Reverse Single Linked List',
      topic: 'Linked Lists & Pointers',
      difficulty: 'Medium',
      xpReward: 75,
      question: 'To reverse a Singly Linked List in place in O(N) time and O(1) space, how many pointer variables are required during iteration?',
      codeSnippet: 'head -> [1] -> [2] -> [3] -> NULL',
      options: [
        { id: 'A', text: '1 pointer (current)', isCorrect: false },
        { id: 'B', text: '3 pointers (prev, current, nextTemp)', isCorrect: true },
        { id: 'C', text: '4 pointers (head, tail, left, right)', isCorrect: false },
        { id: 'D', text: 'No pointers needed', isCorrect: false },
      ],
      explanation: 'Correct! Iteratively reversing links requires tracking prev, current, and nextTemp to avoid breaking pointer references.'
    }
  ],

  python: [
    {
      id: 'py_1',
      title: 'Mission 1: List Comprehension & Filtering',
      topic: 'Python Core',
      difficulty: 'Easy',
      xpReward: 50,
      question: 'What is the output of the following Python list comprehension?',
      codeSnippet: 'nums = [1, 2, 3, 4, 5, 6]\nevens = [x * 2 for x in nums if x % 2 == 0]\nprint(evens)',
      options: [
        { id: 'A', text: '[2, 4, 6]', isCorrect: false },
        { id: 'B', text: '[4, 8, 12]', isCorrect: true },
        { id: 'C', text: '[2, 4, 6, 8, 10, 12]', isCorrect: false },
        { id: 'D', text: '[1, 3, 5]', isCorrect: false },
      ],
      explanation: 'Correct! The condition `if x % 2 == 0` filters even numbers [2, 4, 6], and `x * 2` doubles each value yielding [4, 8, 12].'
    },
    {
      id: 'py_2',
      title: 'Mission 2: Dictionary Key Lookup & get() Method',
      topic: 'Data Structures',
      difficulty: 'Easy',
      xpReward: 50,
      question: 'What does user.get("role", "Guest") return if the dictionary user = {"name": "Alex"} does not contain the key "role"?',
      codeSnippet: 'user = {"name": "Alex"}\nrole = user.get("role", "Guest")',
      options: [
        { id: 'A', text: 'Raises KeyError', isCorrect: false },
        { id: 'B', text: 'None', isCorrect: false },
        { id: 'C', text: '"Guest"', isCorrect: true },
        { id: 'D', text: '"Alex"', isCorrect: false },
      ],
      explanation: 'Correct! `dict.get(key, default)` safely returns the default value ("Guest") if the requested key is missing without raising KeyError.'
    }
  ],

  java: [
    {
      id: 'java_1',
      title: 'Mission 1: Inheritance & Method Overriding',
      topic: 'Java OOP',
      difficulty: 'Fundamentals',
      xpReward: 50,
      question: 'In Java, which keyword is used in a subclass to call a method or constructor defined in its superclass?',
      codeSnippet: 'class Student extends Person {\n  public Student() { /* call superclass constructor */ }\n}',
      options: [
        { id: 'A', text: 'this', isCorrect: false },
        { id: 'B', text: 'super', isCorrect: true },
        { id: 'C', text: 'parent', isCorrect: false },
        { id: 'D', text: 'base', isCorrect: false },
      ],
      explanation: 'Correct! `super()` invokes the constructor or member method of the immediate parent/superclass.'
    },
    {
      id: 'java_2',
      title: 'Mission 2: ArrayList vs HashMap Time Complexity',
      topic: 'Java Collections',
      difficulty: 'Easy',
      xpReward: 50,
      question: 'What is the average time complexity for searching a key in a Java HashMap<K, V>?',
      codeSnippet: 'HashMap<String, Integer> map = new HashMap<>();',
      options: [
        { id: 'A', text: 'O(1) Constant Time', isCorrect: true },
        { id: 'B', text: 'O(N) Linear Time', isCorrect: false },
        { id: 'C', text: 'O(log N) Logarithmic Time', isCorrect: false },
        { id: 'D', text: 'O(N²)', isCorrect: false },
      ],
      explanation: 'Correct! HashMap uses key hashing to achieve O(1) average lookup complexity.'
    }
  ],

  js: [
    {
      id: 'js_1',
      title: 'Mission 1: ES6 Promises & Async/Await',
      topic: 'Asynchronous JavaScript',
      difficulty: 'Fundamentals',
      xpReward: 50,
      question: 'Which keyword must be used before a function declaration to allow using the `await` keyword inside it?',
      codeSnippet: 'const fetchData = _____ () => {\n  const res = await fetch("/api/data");\n};',
      options: [
        { id: 'A', text: 'defer', isCorrect: false },
        { id: 'B', text: 'async', isCorrect: true },
        { id: 'C', text: 'promise', isCorrect: false },
        { id: 'D', text: 'sync', isCorrect: false },
      ],
      explanation: 'Correct! `async` functions return a Promise and enable asynchronous flow with `await`.'
    },
    {
      id: 'js_2',
      title: 'Mission 2: Array Map vs Filter Methods',
      topic: 'Functional JS',
      difficulty: 'Easy',
      xpReward: 50,
      question: 'Which array method creates a new array populated with the results of calling a provided function on every element?',
      codeSnippet: 'const doubled = [1, 2, 3].map(x => x * 2); // [2, 4, 6]',
      options: [
        { id: 'A', text: 'filter()', isCorrect: false },
        { id: 'B', text: 'map()', isCorrect: true },
        { id: 'C', text: 'reduce()', isCorrect: false },
        { id: 'D', text: 'forEach()', isCorrect: false },
      ],
      explanation: 'Correct! `map()` transforms each element and returns a new array of equal length.'
    }
  ],

  html_css: [
    {
      id: 'html_1',
      title: 'Mission 1: Flexbox Alignment Along Main Axis',
      topic: 'CSS Flexbox Layout',
      difficulty: 'Easy',
      xpReward: 50,
      question: 'In CSS Flexbox, which property aligns flex items along the main axis (row or column)?',
      codeSnippet: '.container { display: flex; _____: center; }',
      options: [
        { id: 'A', text: 'align-items', isCorrect: false },
        { id: 'B', text: 'justify-content', isCorrect: true },
        { id: 'C', text: 'align-content', isCorrect: false },
        { id: 'D', text: 'text-align', isCorrect: false },
      ],
      explanation: 'Correct! `justify-content` controls main-axis alignment, while `align-items` controls cross-axis alignment.'
    }
  ],

  sql: [
    {
      id: 'sql_1',
      title: 'Mission 1: SELECT & WHERE Conditional Query',
      topic: 'SQL Basics',
      difficulty: 'Easy',
      xpReward: 50,
      question: 'Which SQL clause is used to filter records that satisfy a specific condition?',
      codeSnippet: 'SELECT * FROM students _____ gpa >= 3.5;',
      options: [
        { id: 'A', text: 'GROUP BY', isCorrect: false },
        { id: 'B', text: 'WHERE', isCorrect: true },
        { id: 'C', text: 'ORDER BY', isCorrect: false },
        { id: 'D', text: 'HAVING', isCorrect: false },
      ],
      explanation: 'Correct! `WHERE` filters rows before grouping or aggregation.'
    },
    {
      id: 'sql_2',
      title: 'Mission 2: INNER JOIN vs LEFT JOIN',
      topic: 'Relational Joins',
      difficulty: 'Fundamentals',
      xpReward: 50,
      question: 'Which type of JOIN returns all records from the left table and matched records from the right table?',
      codeSnippet: 'SELECT * FROM Users u _____ JOIN Orders o ON u.id = o.user_id;',
      options: [
        { id: 'A', text: 'INNER', isCorrect: false },
        { id: 'B', text: 'LEFT', isCorrect: true },
        { id: 'C', text: 'RIGHT', isCorrect: false },
        { id: 'D', text: 'CROSS', isCorrect: false },
      ],
      explanation: 'Correct! `LEFT JOIN` retains all rows from the left table regardless of matching right-table records.'
    }
  ],

  aptitude: [
    {
      id: 'aptitude_1',
      title: 'Mission 1: Numerical Pattern Recognition',
      topic: 'Logical Reasoning',
      difficulty: 'Easy',
      xpReward: 50,
      question: 'What is the next number in the sequence: 3, 6, 12, 24, 48, ___?',
      codeSnippet: 'Sequence: 3 * 2 = 6, 6 * 2 = 12, 12 * 2 = 24...',
      options: [
        { id: 'A', text: '60', isCorrect: false },
        { id: 'B', text: '96', isCorrect: true },
        { id: 'C', text: '72', isCorrect: false },
        { id: 'D', text: '84', isCorrect: false },
      ],
      explanation: 'Correct! Each number is doubled (multiplied by 2). 48 * 2 = 96.'
    }
  ]
};

export default function MissionsPage({ profile, assessment, targetCareerId = 'software_engineer', gamificationState, onAwardXP, setTab }) {
  const [activeCategory, setActiveCategory] = useState(() => {
    const saved = localStorage.getItem(`first_skill_${targetCareerId}`);
    if (saved && MISSION_CATEGORIES.some(c => c.id === saved)) return saved;
    const defaultMap = {
      software_engineer: 'python',
      data_scientist: 'python',
      frontend_developer: 'html_css',
      backend_developer: 'java',
      cybersecurity_analyst: 'python',
      product_manager: 'aptitude'
    };
    return defaultMap[targetCareerId] || 'dsa';
  });

  React.useEffect(() => {
    const saved = localStorage.getItem(`first_skill_${targetCareerId}`);
    if (saved && MISSION_CATEGORIES.some(c => c.id === saved)) {
      setActiveCategory(saved);
    }
  }, [targetCareerId]);

  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [customMissions, setCustomMissions] = useState({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const completedTasks = gamificationState?.completedTasks || [];

  const defaultCategoryMissions = ALL_MISSIONS[activeCategory] || [];
  const extraMissions = customMissions[activeCategory] || [];
  const categoryMissions = [...defaultCategoryMissions, ...extraMissions];
  
  // Find current active mission (first uncompleted or selected)
  const currentMission = categoryMissions.find(m => m.id === selectedMissionId) || 
                         categoryMissions.find(m => !completedTasks.includes(m.id)) || 
                         categoryMissions[0];

  const handleGenerateAIMission = async () => {
    setIsGeneratingAI(true);
    const aiList = await generateGeminiQuestions({
      category: activeCategory,
      career: (targetCareerId || 'software_engineer').replace('_', ' '),
      roadmapWeek: 'Current Skill Stage',
      weeklyTasks: [activeCategory.toUpperCase() + ' Problem Solving'],
      difficulty: 'Easy',
      count: 1
    });

    if (aiList && aiList.length > 0) {
      const newM = {
        ...aiList[0],
        id: `ai_${activeCategory}_${Date.now()}`,
        title: `AI Mission: ${aiList[0].question.slice(0, 35)}...`,
        xpReward: 50
      };

      setCustomMissions(prev => ({
        ...prev,
        [activeCategory]: [...(prev[activeCategory] || []), newM]
      }));

      setSelectedMissionId(newM.id);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsPassed(false);
    }
    setIsGeneratingAI(false);
  };

  const handleSelectMission = (missionId) => {
    setSelectedMissionId(missionId);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsPassed(false);
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSelectedMissionId(null);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsPassed(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentMission || !selectedOption) return;

    const chosen = currentMission.options.find(o => o.id === selectedOption);
    const correct = Boolean(chosen && chosen.isCorrect);

    setIsSubmitted(true);
    setIsPassed(correct);

    if (correct) {
      if (onAwardXP && !completedTasks.includes(currentMission.id)) {
        onAwardXP(currentMission.xpReward, `Completed Mission: ${currentMission.title}`, { taskId: currentMission.id });
      }
    }
  };

  const handleNextMission = () => {
    const nextInCat = categoryMissions.find(m => m.id !== currentMission?.id && !completedTasks.includes(m.id));
    if (nextInCat) {
      handleSelectMission(nextInCat.id);
    } else {
      const nextCat = MISSION_CATEGORIES.find(c => {
        const catList = ALL_MISSIONS[c.id] || [];
        return catList.some(m => !completedTasks.includes(m.id));
      });
      if (nextCat) {
        handleCategoryChange(nextCat.id);
      }
    }
  };

  const isCurrentDone = completedTasks.includes(currentMission?.id) || (isSubmitted && isPassed);

  return (
    <div className="space-y-8 animate-fadeIn font-mono pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyber-border pb-4 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyber-neonPurple/40 bg-cyber-neonPurple/10 text-cyber-neonPurple text-xs font-bold uppercase tracking-widest mb-1">
            <Zap size={13} className="animate-pulse" />
            SKILL PRACTICE MISSIONS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interactive <span className="text-cyber-neonPurple">Action Missions 🎯</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Master core skills for your target career. Solve interactive problem missions to earn XP and level up.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center gap-2">
            <Award size={16} />
            <span>{(gamificationState?.xp || 0).toLocaleString()} XP</span>
          </div>
          <button 
            onClick={() => setTab('dashboard')}
            className="px-3.5 py-2 border border-cyber-border rounded-lg text-xs text-slate-300 hover:border-white transition-all font-bold cursor-pointer"
          >
            OVERVIEW
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MISSION_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const catMissions = ALL_MISSIONS[cat.id] || [];
          const completedCount = catMissions.filter(m => completedTasks.includes(m.id)).length;
          
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold shrink-0 flex items-center gap-2.5 transition-all cursor-pointer ${
                isActive 
                  ? `${cat.borderColor} ${cat.bgColor} ${cat.color} shadow-[0_0_15px_rgba(168,85,247,0.15)]` 
                  : 'border-cyber-border bg-cyber-dark/40 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              <Icon size={16} className={cat.color} />
              <span>{cat.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                {completedCount}/{catMissions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Mission Selector List & Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Category Mission List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>Category Missions</span>
              <span className="text-[10px] text-cyber-neonCyan">({categoryMissions.length})</span>
            </h3>

            <button
              onClick={handleGenerateAIMission}
              disabled={isGeneratingAI}
              className="px-2.5 py-1 rounded bg-cyber-neonPurple/20 border border-cyber-neonPurple/40 text-cyber-neonPurple hover:bg-cyber-neonPurple/30 text-[10px] font-bold flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingAI ? <RefreshCw size={11} className="animate-spin" /> : <Sparkles size={11} />}
              <span>{isGeneratingAI ? 'LOADING...' : '+ NEW PRACTICE MISSION'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {categoryMissions.map((mission, idx) => {
              const isDone = completedTasks.includes(mission.id);
              const isSelected = currentMission?.id === mission.id;

              return (
                <div
                  key={mission.id}
                  onClick={() => handleSelectMission(mission.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-cyber-neonPurple bg-cyber-neonPurple/15 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : isDone
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-slate-300 hover:border-emerald-400'
                      : 'border-cyber-border bg-cyber-dark/50 text-slate-300 hover:border-cyber-neonPurple/60 hover:bg-cyber-dark/80'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400">MISSION 0{idx + 1}</span>
                    {isDone ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={13} /> COMPLETED
                      </span>
                    ) : (
                      <span className="text-purple-400">+{mission.xpReward} XP</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold block text-white truncate">{mission.title}</span>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{mission.topic}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">{mission.difficulty}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Mission Solver Workspace */}
        <div className="lg:col-span-2 space-y-4">
          {currentMission ? (
            <div className="glass-panel border-glow-purple p-6 rounded-2xl relative font-mono space-y-6 scanlines">
              
              {/* Mission Header */}
              <div className="flex justify-between items-start border-b border-cyber-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold uppercase">
                      {currentMission.topic}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                      {currentMission.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2 flex items-center gap-2">
                    {currentMission.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-amber-400 block">+{currentMission.xpReward} XP</span>
                  <span className={`text-[10px] font-bold ${isCurrentDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isCurrentDone ? 'COMPLETED ✅' : 'PENDING ACTION'}
                  </span>
                </div>
              </div>

              {/* Problem Description & Code Snippet */}
              <div className="space-y-3">
                <p className="text-xs text-white leading-relaxed font-bold">
                  {currentMission.question}
                </p>

                {currentMission.codeSnippet && (
                  <div className="p-3.5 rounded-xl border border-cyber-border bg-cyber-dark text-xs text-amber-300 font-mono whitespace-pre-wrap overflow-x-auto">
                    {currentMission.codeSnippet}
                  </div>
                )}
              </div>

              {/* Options Form */}
              <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                <div className="space-y-2.5">
                  {currentMission.options.map((opt) => (
                    <label 
                      key={opt.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedOption === opt.id 
                          ? 'border-cyber-neonPurple bg-cyber-neonPurple/20 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.25)]' 
                          : 'border-cyber-border bg-cyber-dark/40 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="mission_opt" 
                        value={opt.id}
                        checked={selectedOption === opt.id}
                        onChange={() => setSelectedOption(opt.id)}
                        className="accent-purple-500 cursor-pointer"
                      />
                      <span><strong>{opt.id}.</strong> {opt.text}</span>
                    </label>
                  ))}
                </div>

                {/* Feedback & Solution Banner */}
                {isSubmitted && (
                  <div className={`p-4 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                    isPassed 
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' 
                      : 'border-rose-500/50 bg-rose-500/10 text-rose-300'
                  }`}>
                    <div className="font-bold text-sm flex items-center gap-2">
                      {isPassed ? '🎉 CORRECT SOLUTION!' : '⚠️ INCORRECT CHOICE'}
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      {currentMission.explanation}
                    </p>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-cyber-border">
                  <span className="text-[11px] text-slate-400">
                    {isCurrentDone ? '✅ Task Completed • XP Awarded' : 'Select an option and submit your solution.'}
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {isPassed && (
                      <button
                        type="button"
                        onClick={handleNextMission}
                        className="cyber-btn cyber-btn-cyan px-5 py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                      >
                        NEXT MISSION <ArrowRight size={14} />
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={!selectedOption}
                      className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
                    >
                      SUBMIT SOLUTION <CheckCircle2 size={14} />
                    </button>
                  </div>
                </div>

              </form>

            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-3 font-mono text-slate-400">
              <Zap size={36} className="mx-auto text-amber-400 animate-pulse" />
              <h4 className="text-base font-bold text-white">All Category Missions Complete!</h4>
              <p className="text-xs">Great job mastering these skills. Try switching to another category above.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
