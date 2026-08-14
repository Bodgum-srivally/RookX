// RookX Gemini AI Question-Generation Service
// Supports context-aware question generation, fingerprint-based duplicate prevention,
// and fail-safe fallback handling for offline/error states.

// Curated Fallback Question Sets (used if Gemini API is unavailable or offline)
const FALLBACK_QUESTIONS = {
  dsa: [
    {
      id: 'fb_dsa_1',
      question: 'Given an array nums = [2, 7, 11, 15] and target = 9, what are the indices of the two numbers that add up to target?',
      codeSnippet: 'nums = [2, 7, 11, 15], target = 9',
      options: [
        { id: 'A', text: '[0, 1]', isCorrect: true },
        { id: 'B', text: '[1, 2]', isCorrect: false },
        { id: 'C', text: '[0, 3]', isCorrect: false },
        { id: 'D', text: '[2, 3]', isCorrect: false }
      ],
      explanation: 'nums[0] + nums[1] = 2 + 7 = 9. Hash Map achieves O(N) linear time complexity.',
      topic: 'Arrays & Hash Maps',
      difficulty: 'Easy'
    },
    {
      id: 'fb_dsa_2',
      question: 'Which Data Structure is optimal to verify balanced bracket strings like "()[]{}" in O(N) linear time?',
      codeSnippet: 's = "()[]{}"',
      options: [
        { id: 'A', text: 'Queue (FIFO)', isCorrect: false },
        { id: 'B', text: 'Stack (LIFO)', isCorrect: true },
        { id: 'C', text: 'Binary Search Tree', isCorrect: false },
        { id: 'D', text: 'Priority Queue', isCorrect: false }
      ],
      explanation: 'A Stack (Last-In, First-Out) matches closing brackets with the most recently opened bracket at the top of stack.',
      topic: 'Stacks & Queues',
      difficulty: 'Fundamentals'
    },
    {
      id: 'fb_dsa_3',
      question: 'What is the average time complexity of Binary Search on a sorted array of size N?',
      codeSnippet: 'def binary_search(arr, target): ...',
      options: [
        { id: 'A', text: 'O(N)', isCorrect: false },
        { id: 'B', text: 'O(log N)', isCorrect: true },
        { id: 'C', text: 'O(N log N)', isCorrect: false },
        { id: 'D', text: 'O(1)', isCorrect: false }
      ],
      explanation: 'Binary Search halves the search space at each step, yielding O(log N) logarithmic complexity.',
      topic: 'Searching & Binary Search',
      difficulty: 'Medium'
    }
  ],

  python: [
    {
      id: 'fb_py_1',
      question: 'What is the output of the following Python list comprehension?',
      codeSnippet: 'nums = [1, 2, 3, 4, 5, 6]\nevens = [x * 2 for x in nums if x % 2 == 0]\nprint(evens)',
      options: [
        { id: 'A', text: '[2, 4, 6]', isCorrect: false },
        { id: 'B', text: '[4, 8, 12]', isCorrect: true },
        { id: 'C', text: '[2, 4, 6, 8, 10, 12]', isCorrect: false },
        { id: 'D', text: '[1, 3, 5]', isCorrect: false }
      ],
      explanation: 'The condition `if x % 2 == 0` filters [2, 4, 6], and `x * 2` doubles each item yielding [4, 8, 12].',
      topic: 'Python Core',
      difficulty: 'Easy'
    },
    {
      id: 'fb_py_2',
      question: 'What does dict.get(key, default) return if the key does not exist in the dictionary?',
      codeSnippet: 'user = {"name": "Alex"}\nrole = user.get("role", "Guest")',
      options: [
        { id: 'A', text: 'Raises KeyError', isCorrect: false },
        { id: 'B', text: 'None', isCorrect: false },
        { id: 'C', text: '"Guest"', isCorrect: true },
        { id: 'D', text: '"Alex"', isCorrect: false }
      ],
      explanation: 'dict.get(key, default) safely returns the default value ("Guest") without raising KeyError.',
      topic: 'Data Structures',
      difficulty: 'Easy'
    }
  ],

  java: [
    {
      id: 'fb_java_1',
      question: 'In Java, which keyword is used in a subclass to call a constructor or method defined in its superclass?',
      codeSnippet: 'class Student extends Person {\n  public Student() { /* call super constructor */ }\n}',
      options: [
        { id: 'A', text: 'this', isCorrect: false },
        { id: 'B', text: 'super', isCorrect: true },
        { id: 'C', text: 'parent', isCorrect: false },
        { id: 'D', text: 'base', isCorrect: false }
      ],
      explanation: '`super()` invokes the constructor or member method of the immediate parent superclass.',
      topic: 'Java OOP',
      difficulty: 'Fundamentals'
    }
  ],

  js: [
    {
      id: 'fb_js_1',
      question: 'Which keyword must precede a JavaScript function declaration to allow using the `await` keyword inside it?',
      codeSnippet: 'const fetchData = _____ () => {\n  const res = await fetch("/api/data");\n};',
      options: [
        { id: 'A', text: 'defer', isCorrect: false },
        { id: 'B', text: 'async', isCorrect: true },
        { id: 'C', text: 'promise', isCorrect: false },
        { id: 'D', text: 'sync', isCorrect: false }
      ],
      explanation: '`async` functions return a Promise and enable asynchronous flow with `await`.',
      topic: 'Asynchronous JS',
      difficulty: 'Fundamentals'
    }
  ],

  sql: [
    {
      id: 'fb_sql_1',
      question: 'Which SQL clause is used to filter records that satisfy a specific condition?',
      codeSnippet: 'SELECT * FROM students _____ gpa >= 3.5;',
      options: [
        { id: 'A', text: 'GROUP BY', isCorrect: false },
        { id: 'B', text: 'WHERE', isCorrect: true },
        { id: 'C', text: 'ORDER BY', isCorrect: false },
        { id: 'D', text: 'HAVING', isCorrect: false }
      ],
      explanation: '`WHERE` filters rows before grouping or aggregation occurs.',
      topic: 'SQL Basics',
      difficulty: 'Easy'
    }
  ],

  aptitude: [
    {
      id: 'fb_apt_1',
      question: 'What is the next number in the sequence: 3, 6, 12, 24, 48, ___?',
      codeSnippet: '3 * 2 = 6, 6 * 2 = 12, 12 * 2 = 24...',
      options: [
        { id: 'A', text: '60', isCorrect: false },
        { id: 'B', text: '96', isCorrect: true },
        { id: 'C', text: '72', isCorrect: false },
        { id: 'D', text: '84', isCorrect: false }
      ],
      explanation: 'Each term is doubled (multiplied by 2). 48 * 2 = 96.',
      topic: 'Logical Reasoning',
      difficulty: 'Easy'
    }
  ]
};

// Helper: Read configured Gemini API Key from localStorage or environment
function getGeminiApiKey() {
  return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

// Helper: Fingerprint history management for preventing duplicate questions
const HISTORY_KEY = 'rookx_question_history';

function getQuestionHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveQuestionToHistory(fingerprint) {
  try {
    const history = getQuestionHistory();
    if (!history.includes(fingerprint)) {
      history.push(fingerprint);
      // Keep history lightweight (max 100 recent fingerprints)
      if (history.length > 100) history.shift();
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (e) {
    // Ignore storage write errors
  }
}

function generateFingerprint(questionText) {
  return (questionText || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '').slice(0, 50);
}

// Extract JSON array or object from raw Gemini text output
function extractJsonFromText(rawText) {
  if (!rawText) return null;
  
  try {
    // Direct parse attempt
    return JSON.parse(rawText);
  } catch (e) {
    // Try stripping markdown backticks ```json ... ```
    const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (err) {
        // continue to regex fallback
      }
    }

    // Try finding outer brackets [ ... ] or { ... }
    const bracketMatch = rawText.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (bracketMatch && bracketMatch[1]) {
      try {
        return JSON.parse(bracketMatch[1]);
      } catch (err) {
        return null;
      }
    }
  }
  return null;
}

/**
 * Generate Context-Aware Multiple Choice Questions using Gemini AI
 * @param {Object} params
 * @param {string} params.category - e.g. 'dsa', 'python', 'java', 'js', 'html_css', 'sql', 'aptitude'
 * @param {string} params.career - e.g. 'Software Engineer', 'Data Scientist'
 * @param {string} params.roadmapWeek - e.g. 'Week 1', 'Week 2'
 * @param {Array<string>} params.weeklyTasks - Topics covered this week
 * @param {string} params.difficulty - 'Easy', 'Medium', 'Hard'
 * @param {number} params.count - Number of questions to generate (default 3)
 */
export async function generateAIQuestions({
  category = 'python',
  career = 'Software Engineer',
  roadmapWeek = 'Week 1',
  weeklyTasks = [],
  difficulty = 'Easy',
  count = 3
}) {
  const apiKey = getGeminiApiKey();

  // If no API key configured, return fallbacks gracefully
  if (!apiKey) {
    return getFallbackQuestions(category, count);
  }

  const tasksText = weeklyTasks.length > 0 ? weeklyTasks.join(', ') : 'core concepts';
  const history = getQuestionHistory();

  const prompt = `You are an expert technical interviewer for RookX career platform.
Generate ${count} multiple choice questions for a student pursuing a career as a ${career}.
Category: ${category}
Roadmap Stage: ${roadmapWeek}
Target Topics: ${tasksText}
Difficulty Level: ${difficulty}

CRITICAL RULES:
1. Return ONLY valid, minified JSON array of question objects. Do not include markdown headers or commentary outside JSON.
2. Each question object MUST follow this schema strictly:
[
  {
    "id": "q_gen_1",
    "question": "Question text here",
    "codeSnippet": "optional short code snippet if relevant, or empty string",
    "options": [
      { "id": "A", "text": "Option A text", "isCorrect": true },
      { "id": "B", "text": "Option B text", "isCorrect": false },
      { "id": "C", "text": "Option C text", "isCorrect": false },
      { "id": "D", "text": "Option D text", "isCorrect": false }
    ],
    "explanation": "Clear solution explanation",
    "topic": "${category}",
    "difficulty": "${difficulty}"
  }
]
3. Exactly ONE option per question must have "isCorrect": true.
4. Keep questions unique, realistic, and focused ONLY on the requested topics.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API call returned non-200 status, using fallback questions.');
      return getFallbackQuestions(category, count);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = extractJsonFromText(rawText);

    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter out previously seen questions to ensure uniqueness
      const uniqueQuestions = parsed.filter(q => {
        const fp = generateFingerprint(q.question);
        if (history.includes(fp)) return false;
        saveQuestionToHistory(fp);
        return true;
      });

      if (uniqueQuestions.length > 0) {
        return uniqueQuestions.slice(0, count);
      } else {
        // If all generated were duplicates, return parsed array anyway
        return parsed.slice(0, count);
      }
    }
  } catch (err) {
    console.warn('Error calling Gemini API for question generation:', err);
  }

  // Fallback return if AI generation failed or returned invalid data
  return getFallbackQuestions(category, count);
}

/**
 * Fallback question retriever
 */
export function getFallbackQuestions(category = 'python', count = 3) {
  const catKey = (category || 'python').toLowerCase();
  const pool = FALLBACK_QUESTIONS[catKey] || FALLBACK_QUESTIONS['python'] || [];
  
  // Clone pool and shuffle slightly
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
