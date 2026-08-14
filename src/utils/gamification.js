// RookX Gamification & XP System Utility

export const XP_LEVELS = [
  { level: 1, name: 'Beginner', minXp: 0, maxXp: 250 },
  { level: 2, name: 'Explorer', minXp: 251, maxXp: 600 },
  { level: 3, name: 'Skill Seeker', minXp: 601, maxXp: 1000 },
  { level: 4, name: 'Challenger', minXp: 1001, maxXp: 1500 },
  { level: 5, name: 'Builder', minXp: 1501, maxXp: 2100 },
  { level: 6, name: 'Problem Solver', minXp: 2101, maxXp: 2800 },
  { level: 7, name: 'Career Explorer', minXp: 2801, maxXp: 3600 },
  { level: 8, name: 'Career Strategist', minXp: 3601, maxXp: 4500 },
  { level: 9, name: 'Future Ready', minXp: 4501, maxXp: 5500 },
  { level: 10, name: 'Career Master', minXp: 5501, maxXp: 10000 }
];

export const BADGES = [
  {
    id: 'debugger',
    name: 'Debugger',
    icon: '🐛',
    category: 'Simulation',
    description: 'Fix mini coding & debugging challenges in Software Developer simulation.',
    requirementText: 'Complete Software Developer mini task',
    xpReward: 100
  },
  {
    id: 'sql_hunter',
    name: 'SQL Hunter',
    icon: '🗄️',
    category: 'Analytics',
    description: 'Master data analysis & database insight challenges.',
    requirementText: 'Complete Data Analyst mini task',
    xpReward: 100
  },
  {
    id: 'career_explorer',
    name: 'Career Explorer',
    icon: '🎯',
    category: 'Exploration',
    description: 'Experience 3 different career simulations in "Try Before You Commit".',
    requirementText: 'Try 3 career simulations',
    xpReward: 200
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    icon: '🔥',
    category: 'Roadmap',
    description: 'Complete 5 roadmap activities toward your career goals.',
    requirementText: 'Complete 5 roadmap tasks',
    xpReward: 150
  },
  {
    id: 'problem_solver',
    name: 'Problem Solver',
    icon: '🧠',
    category: 'Excellence',
    description: 'Score 80%+ on any career simulation challenge.',
    requirementText: 'Score 80%+ on any simulation',
    xpReward: 150
  },
  {
    id: 'future_ready',
    name: 'Future Ready',
    icon: '🚀',
    category: 'Readiness',
    description: 'Reach 80% overall Career Readiness score.',
    requirementText: 'Reach 80% career readiness',
    xpReward: 250
  },
  {
    id: 'python_beginner',
    name: 'Python Beginner',
    icon: '🐍',
    category: 'Quiz Mastery',
    description: 'Master Week 1 Python Roadmap Quiz with a passing score.',
    requirementText: 'Complete Week 1 Python Quiz',
    xpReward: 150
  },
  {
    id: 'java_explorer',
    name: 'Java Explorer',
    icon: '☕',
    category: 'Quiz Mastery',
    description: 'Master Week 2 Java Roadmap Quiz.',
    requirementText: 'Complete Week 2 Java Quiz',
    xpReward: 150
  },
  {
    id: 'web_fundamentals',
    name: 'Web Fundamentals',
    icon: '🌐',
    category: 'Quiz Mastery',
    description: 'Master Web & HTML/CSS Roadmap Quiz.',
    requirementText: 'Complete Web Roadmap Quiz',
    xpReward: 150
  },
  {
    id: 'sql_learner',
    name: 'SQL Learner',
    icon: '🗄️',
    category: 'Quiz Mastery',
    description: 'Master SQL Relational Database Quiz.',
    requirementText: 'Complete SQL Roadmap Quiz',
    xpReward: 150
  },
  {
    id: 'dsa_challenger',
    name: 'DSA Challenger',
    icon: '⚡',
    category: 'Quiz Mastery',
    description: 'Master Data Structures & Algorithms Roadmap Quiz.',
    requirementText: 'Complete DSA Roadmap Quiz',
    xpReward: 200
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    icon: '👑',
    category: 'Excellence',
    description: 'Achieve a 100% Perfect Score on any AI Roadmap Quiz.',
    requirementText: 'Score 100% on any AI Quiz',
    xpReward: 250
  },
  {
    id: 'weekly_champion',
    name: 'Weekly Champion',
    icon: '🎖️',
    category: 'Roadmap',
    description: 'Complete 3 Weekly AI Roadmap Quizzes.',
    requirementText: 'Complete 3 Weekly AI Quizzes',
    xpReward: 300
  },
  {
    id: 'rookx_master',
    name: 'RookX Master',
    icon: '🏆',
    category: 'Mastery',
    description: 'Reach Level 10 Career Master status.',
    requirementText: 'Reach XP Level 10',
    xpReward: 500
  }
];

export function getLevelInfo(totalXp = 0) {
  let currentLevel = XP_LEVELS[0];
  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (totalXp >= XP_LEVELS[i].minXp) {
      currentLevel = XP_LEVELS[i];
    }
  }

  const isMaxLevel = currentLevel.level === 10;
  const xpInCurrentLevel = totalXp - currentLevel.minXp;
  const levelSpan = currentLevel.maxXp - currentLevel.minXp;
  const progressPct = isMaxLevel ? 100 : Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelSpan) * 100)));
  const xpToNextLevel = isMaxLevel ? 0 : Math.max(0, currentLevel.maxXp - totalXp);

  return {
    ...currentLevel,
    totalXp,
    progressPct,
    xpToNextLevel,
    isMaxLevel
  };
}

export function evaluateBadges(gamificationState = {}, readinessScore = 54) {
  const unlocked = new Set(gamificationState.unlockedBadges || []);
  const triedSimulations = gamificationState.triedSimulations || [];
  const completedTasksCount = (gamificationState.completedTasks || []).length;
  const highestSimScore = gamificationState.highestSimScore || 0;
  const totalXp = gamificationState.xp || 0;

  const newUnlocks = [];

  // Debugger badge
  if (!unlocked.has('debugger') && triedSimulations.includes('software_engineer')) {
    unlocked.add('debugger');
    newUnlocks.push('debugger');
  }

  // SQL Hunter badge
  if (!unlocked.has('sql_hunter') && triedSimulations.includes('data_scientist')) {
    unlocked.add('sql_hunter');
    newUnlocks.push('sql_hunter');
  }

  // Career Explorer badge (3 simulations)
  if (!unlocked.has('career_explorer') && triedSimulations.length >= 3) {
    unlocked.add('career_explorer');
    newUnlocks.push('career_explorer');
  }

  // Consistency King badge (5 completed tasks)
  if (!unlocked.has('consistency_king') && completedTasksCount >= 5) {
    unlocked.add('consistency_king');
    newUnlocks.push('consistency_king');
  }

  // Problem Solver badge (score 80%+)
  if (!unlocked.has('problem_solver') && highestSimScore >= 80) {
    unlocked.add('problem_solver');
    newUnlocks.push('problem_solver');
  }

  // Future Ready badge (readiness 80%+)
  if (!unlocked.has('future_ready') && readinessScore >= 80) {
    unlocked.add('future_ready');
    newUnlocks.push('future_ready');
  }

  // RookX Master (Level 10 / XP 5500+)
  if (!unlocked.has('rookx_master') && totalXp >= 5500) {
    unlocked.add('rookx_master');
    newUnlocks.push('rookx_master');
  }

  return {
    unlockedBadges: Array.from(unlocked),
    newUnlocks
  };
}
