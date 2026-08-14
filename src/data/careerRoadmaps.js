// RookX Career-Specific Multi-Week Skill Roadmaps
// Hierarchical structure: CAREER -> SKILLS -> WEEKS -> TASKS

export const CAREER_ROADMAPS = {
  software_engineer: {
    careerId: 'software_engineer',
    title: 'Software Engineer Master Roadmap',
    skills: [
      {
        id: 'python',
        name: 'Python Programming',
        icon: '🐍',
        description: 'Master core syntax, data structures, control flow, functions, OOP, and script development.',
        weeks: [
          {
            weekNum: 1,
            skillWeekNum: 1,
            title: 'Week 1: Python Fundamentals',
            difficulty: 'Easy',
            topics: ['Variables & Data Types', 'Input/Output Operations', 'Basic Arithmetic Operators', 'Comments & Code Formatting'],
            tasks: [
              { id: 'se_py_1_1', title: 'Learn Python variable assignment & primitive data types (int, float, str, bool)', skill: 'Python', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_py_1_2', title: 'Practice user input parsing & formatted string output (f-strings)', skill: 'Python', time: '30 min', xp: 50, readiness: '+2%' },
              { id: 'se_py_1_3', title: 'Solve 5 beginner arithmetic & string manipulation exercises', skill: 'Python', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'se_py_1_4', title: 'Write a basic Python interactive calculator script', skill: 'Python', time: '45 min', xp: 75, readiness: '+3%' }
            ]
          },
          {
            weekNum: 2,
            skillWeekNum: 2,
            title: 'Week 2: Python Control Flow',
            difficulty: 'Easy/Medium',
            topics: ['If-Else Conditionals', 'For Loops & range()', 'While Loops', 'Break & Continue Statements'],
            tasks: [
              { id: 'se_py_2_1', title: 'Master conditional logic branching with if/elif/else statements', skill: 'Python', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_py_2_2', title: 'Practice iterating over sequences using for loops and range()', skill: 'Python', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_py_2_3', title: 'Implement while loops with sentinel values & safety breaks', skill: 'Python', time: '45 min', xp: 75, readiness: '+3%' },
              { id: 'se_py_2_4', title: 'Build a number guessing game utilizing control flow loops', skill: 'Python', time: '60 min', xp: 100, readiness: '+4%' }
            ]
          },
          {
            weekNum: 3,
            skillWeekNum: 3,
            title: 'Week 3: Python Functions & Collections',
            difficulty: 'Medium',
            topics: ['Functions & Parameters', 'Return Values', 'Lists & Slicing', 'Dictionaries & Sets'],
            tasks: [
              { id: 'se_py_3_1', title: 'Write modular Python functions with default parameters and return values', skill: 'Python', time: '50 min', xp: 75, readiness: '+3%' },
              { id: 'se_py_3_2', title: 'Manipulate Python lists using append, pop, slice, and comprehension', skill: 'Python', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'se_py_3_3', title: 'Store & query key-value data using Python dictionaries', skill: 'Python', time: '50 min', xp: 75, readiness: '+3%' },
              { id: 'se_py_3_4', title: 'Create a student grade management CLI application', skill: 'Python', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          },
          {
            weekNum: 4,
            skillWeekNum: 4,
            title: 'Week 4: Python OOP & Problem Solving',
            difficulty: 'Medium/Hard',
            topics: ['Classes & Objects', '__init__ Constructor', 'Instance Methods', 'OOP Encapsulation & Inheritance'],
            tasks: [
              { id: 'se_py_4_1', title: 'Define custom classes with __init__ attributes and methods', skill: 'Python', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_py_4_2', title: 'Implement class inheritance to extend base object models', skill: 'Python', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_py_4_3', title: 'Refactor procedural scripts into clean Object-Oriented architecture', skill: 'Python', time: '75 min', xp: 125, readiness: '+5%' },
              { id: 'se_py_4_4', title: 'Complete Python Skill Master Assessment & Capstone Project', skill: 'Python', time: '120 min', xp: 250, readiness: '+8%' }
            ]
          }
        ]
      },
      {
        id: 'java',
        name: 'Java & Object-Oriented Core',
        icon: '☕',
        description: 'Master Java syntax, strongly-typed variables, OOP principles, constructors, and Collections.',
        weeks: [
          {
            weekNum: 5,
            skillWeekNum: 1,
            title: 'Week 5: Java Fundamentals',
            difficulty: 'Easy',
            topics: ['Java Syntax & Main Method', 'Primitive Data Types', 'Scanner Input', 'Static Methods'],
            tasks: [
              { id: 'se_jv_5_1', title: 'Setup Java JDK, IDE environment & run public static void main()', skill: 'Java', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_jv_5_2', title: 'Understand Java strong typing, int, double, boolean, and String', skill: 'Java', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_jv_5_3', title: 'Parse console input using java.util.Scanner', skill: 'Java', time: '45 min', xp: 75, readiness: '+3%' },
              { id: 'se_jv_5_4', title: 'Write Java static helper functions for math & string tasks', skill: 'Java', time: '60 min', xp: 75, readiness: '+3%' }
            ]
          },
          {
            weekNum: 6,
            skillWeekNum: 2,
            title: 'Week 6: Java Object-Oriented Principles',
            difficulty: 'Easy/Medium',
            topics: ['Classes & Objects', 'Constructors & super()', 'Access Modifiers (private/public)', 'Getters & Setters'],
            tasks: [
              { id: 'se_jv_6_1', title: 'Create Java domain classes with private fields and public getters/setters', skill: 'Java', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'se_jv_6_2', title: 'Write overloaded constructors and use this() keyword', skill: 'Java', time: '50 min', xp: 75, readiness: '+3%' },
              { id: 'se_jv_6_3', title: 'Implement single inheritance with extends and super() constructor calls', skill: 'Java', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_jv_6_4', title: 'Build an Employee Payroll class hierarchy in Java', skill: 'Java', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          },
          {
            weekNum: 7,
            skillWeekNum: 3,
            title: 'Week 7: Java Collections Framework',
            difficulty: 'Medium',
            topics: ['ArrayList', 'HashMap', 'Iterators', 'Generics <T>'],
            tasks: [
              { id: 'se_jv_7_1', title: 'Store dynamic list data using java.util.ArrayList', skill: 'Java', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_jv_7_2', title: 'Implement key-value lookups with java.util.HashMap', skill: 'Java', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_jv_7_3', title: 'Practice iterating collections with enhanced for-loops and Iterators', skill: 'Java', time: '45 min', xp: 75, readiness: '+3%' },
              { id: 'se_jv_7_4', title: 'Develop an In-Memory Inventory Management System in Java', skill: 'Java', time: '90 min', xp: 175, readiness: '+6%' }
            ]
          },
          {
            weekNum: 8,
            skillWeekNum: 4,
            title: 'Week 8: Java Problem Solving & Interfaces',
            difficulty: 'Medium/Hard',
            topics: ['Interfaces', 'Abstract Classes', 'Try-Catch Exception Handling', 'Algorithm Challenges'],
            tasks: [
              { id: 'se_jv_8_1', title: 'Define Java Interfaces to decouple implementation details', skill: 'Java', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_jv_8_2', title: 'Handle runtime exceptions with try/catch/finally blocks', skill: 'Java', time: '45 min', xp: 75, readiness: '+3%' },
              { id: 'se_jv_8_3', title: 'Solve 5 intermediate Java algorithm problem challenges', skill: 'Java', time: '90 min', xp: 150, readiness: '+5%' },
              { id: 'se_jv_8_4', title: 'Complete Java Master Capstone & Skill Certification', skill: 'Java', time: '120 min', xp: 250, readiness: '+8%' }
            ]
          }
        ]
      },
      {
        id: 'dsa',
        name: 'Data Structures & Algorithms',
        icon: '🧠',
        description: 'Master time complexity O(N), arrays, hash maps, stacks, binary search, and trees.',
        weeks: [
          {
            weekNum: 9,
            skillWeekNum: 1,
            title: 'Week 9: Time Complexity & Hash Maps',
            difficulty: 'Easy',
            topics: ['Big-O Notation O(1) vs O(N)', 'Array Inversion', 'Hash Map Lookups', 'Two Sum Problem'],
            tasks: [
              { id: 'se_ds_9_1', title: 'Analyze time & space complexity for linear algorithms', skill: 'DSA', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_ds_9_2', title: 'Solve Two-Sum problem in O(N) linear time using Hash Map', skill: 'DSA', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_ds_9_3', title: 'Implement frequency counter pattern with Hash Tables', skill: 'DSA', time: '45 min', xp: 75, readiness: '+3%' },
              { id: 'se_ds_9_4', title: 'Solve 5 array problem solving challenges', skill: 'DSA', time: '75 min', xp: 125, readiness: '+5%' }
            ]
          },
          {
            weekNum: 10,
            skillWeekNum: 2,
            title: 'Week 10: Stacks, Queues & Two Pointers',
            difficulty: 'Medium',
            topics: ['Stack (LIFO)', 'Queue (FIFO)', 'Balanced Parentheses', 'Two Pointer Technique'],
            tasks: [
              { id: 'se_ds_10_1', title: 'Implement Stack (LIFO) and solve Valid Parentheses challenge', skill: 'DSA', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_ds_10_2', title: 'Implement Queue (FIFO) and circular buffer queue', skill: 'DSA', time: '45 min', xp: 75, readiness: '+3%' },
              { id: 'se_ds_10_3', title: 'Apply Two Pointers pattern to reverse arrays and check palindromes', skill: 'DSA', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_ds_10_4', title: 'Build a Browser History Back/Forward Stack simulator', skill: 'DSA', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      },
      {
        id: 'sql',
        name: 'SQL & Database Engineering',
        icon: '🗄️',
        description: 'Master relational queries, WHERE filtering, INNER/LEFT JOINs, aggregations, and indexing.',
        weeks: [
          {
            weekNum: 11,
            skillWeekNum: 1,
            title: 'Week 11: Relational SQL Fundamentals',
            difficulty: 'Easy',
            topics: ['SELECT & DISTINCT', 'WHERE & Operators', 'ORDER BY & LIMIT', 'LIKE Pattern Matching'],
            tasks: [
              { id: 'se_sq_11_1', title: 'Write SELECT queries with column aliasing and filtering', skill: 'SQL', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_sq_11_2', title: 'Filter rows using WHERE, AND/OR, and IN clauses', skill: 'SQL', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_sq_11_3', title: 'Sort query result sets using ORDER BY and LIMIT', skill: 'SQL', time: '30 min', xp: 50, readiness: '+2%' },
              { id: 'se_sq_11_4', title: 'Solve 5 database query extraction challenges', skill: 'SQL', time: '60 min', xp: 100, readiness: '+4%' }
            ]
          }
        ]
      },
      {
        id: 'web',
        name: 'Web Technologies (HTML/CSS/JS)',
        icon: '🎨',
        description: 'Master semantic HTML5, modern CSS Flexbox, Grid, DOM manipulation, and Fetch APIs.',
        weeks: [
          {
            weekNum: 12,
            skillWeekNum: 1,
            title: 'Week 12: HTML5 & Modern CSS Layouts',
            difficulty: 'Easy',
            topics: ['Semantic Tags', 'Flexbox', 'Media Queries', 'DOM Tree'],
            tasks: [
              { id: 'se_wb_12_1', title: 'Build semantic HTML5 page layout with header, nav, main', skill: 'HTML/CSS', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'se_wb_12_2', title: 'Design responsive navbars and card components using CSS Flexbox', skill: 'HTML/CSS', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'se_wb_12_3', title: 'Manipulate DOM elements dynamically via JavaScript addEventListener', skill: 'JavaScript', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'se_wb_12_4', title: 'Build a dynamic REST API dashboard fetching live JSON', skill: 'JavaScript', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      }
    ]
  },

  data_scientist: {
    careerId: 'data_scientist',
    title: 'Data Scientist Master Roadmap',
    skills: [
      {
        id: 'python',
        name: 'Python for Data Analysis',
        icon: '🐍',
        description: 'Master Python fundamentals, data structures, functions, and data cleaning scripts.',
        weeks: [
          {
            weekNum: 1,
            skillWeekNum: 1,
            title: 'Week 1: Python Data Basics',
            difficulty: 'Easy',
            topics: ['Variables & Data Types', 'Input/Output', 'Lists & Methods', 'Control Flow'],
            tasks: [
              { id: 'ds_py_1_1', title: 'Learn Python data primitives (int, float, str, list)', skill: 'Python', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'ds_py_1_2', title: 'Store numerical data series in Python lists', skill: 'Python', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'ds_py_1_3', title: 'Filter raw data arrays using if/else logic and loops', skill: 'Python', time: '45 min', xp: 75, readiness: '+3%' },
              { id: 'ds_py_1_4', title: 'Write a Python script to clean and compute summary statistics', skill: 'Python', time: '60 min', xp: 100, readiness: '+4%' }
            ]
          },
          {
            weekNum: 2,
            skillWeekNum: 2,
            title: 'Week 2: Data Cleaning & Dictionaries',
            difficulty: 'Easy/Medium',
            topics: ['Dictionaries', 'Key-Value Lookups', 'List Comprehensions', 'Functions'],
            tasks: [
              { id: 'ds_py_2_1', title: 'Store tabular dataset records in Python dictionaries', skill: 'Python', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'ds_py_2_2', title: 'Transform raw data columns using list comprehensions', skill: 'Python', time: '45 min', xp: 75, readiness: '+3%' },
              { id: 'ds_py_2_3', title: 'Write reusable data processing and validation functions', skill: 'Python', time: '50 min', xp: 75, readiness: '+3%' },
              { id: 'ds_py_2_4', title: 'Build an automated dataset deduplication CLI utility', skill: 'Python', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      },
      {
        id: 'statistics',
        name: 'Applied Statistics & Probability',
        icon: '📊',
        description: 'Master central tendency, standard deviation, hypothesis testing, and confidence intervals.',
        weeks: [
          {
            weekNum: 3,
            skillWeekNum: 1,
            title: 'Week 3: Descriptive Statistics & Distributions',
            difficulty: 'Easy',
            topics: ['Mean, Median, Mode', 'Variance & Standard Deviation', 'Normal Distribution', 'Z-Scores'],
            tasks: [
              { id: 'ds_st_3_1', title: 'Calculate mean, median, mode and interquartile range (IQR)', skill: 'Statistics', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'ds_st_3_2', title: 'Compute variance and standard deviation for population vs sample', skill: 'Statistics', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'ds_st_3_3', title: 'Standardize feature values using Z-score normalization', skill: 'Statistics', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'ds_st_3_4', title: 'Build a statistical distribution analysis script in Python', skill: 'Statistics', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      },
      {
        id: 'sql',
        name: 'SQL & Database Analytics',
        icon: '🗄️',
        description: 'Master relational queries, aggregations, JOINs, and analytical window functions.',
        weeks: [
          {
            weekNum: 4,
            skillWeekNum: 1,
            title: 'Week 4: SQL Analytics Querying',
            difficulty: 'Easy',
            topics: ['SELECT', 'WHERE', 'GROUP BY', 'HAVING'],
            tasks: [
              { id: 'ds_sq_4_1', title: 'Query analytics tables using SELECT and WHERE filters', skill: 'SQL', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'ds_sq_4_2', title: 'Aggregate dataset totals with COUNT, SUM, AVG', skill: 'SQL', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'ds_sq_4_3', title: 'Group analytical metrics by category using GROUP BY & HAVING', skill: 'SQL', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'ds_sq_4_4', title: 'Build an analytical SQL query report for business KPIs', skill: 'SQL', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      }
    ]
  },

  frontend_developer: {
    careerId: 'frontend_developer',
    title: 'Frontend Developer Master Roadmap',
    skills: [
      {
        id: 'web',
        name: 'HTML5 & Semantic Structure',
        icon: '🎨',
        description: 'Master semantic HTML tags, forms, accessibility (ARIA), and document outline.',
        weeks: [
          {
            weekNum: 1,
            skillWeekNum: 1,
            title: 'Week 1: HTML5 Foundations',
            difficulty: 'Easy',
            topics: ['Semantic Elements', 'Form Controls', 'ARIA Roles', 'Page SEO'],
            tasks: [
              { id: 'fd_ht_1_1', title: 'Build structured HTML pages using section, nav, header, main', skill: 'HTML/CSS', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'fd_ht_1_2', title: 'Create interactive HTML form inputs with accessibility attributes', skill: 'HTML/CSS', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'fd_ht_1_3', title: 'Inspect and fix DOM tree layout & ARIA accessibility tags', skill: 'HTML/CSS', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'fd_ht_1_4', title: 'Build a multi-page semantic website wireframe', skill: 'HTML/CSS', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      },
      {
        id: 'javascript',
        name: 'JavaScript & Modern ES6+',
        icon: '⚡',
        description: 'Master ES6 syntax, DOM manipulation, event handling, and async Fetch API.',
        weeks: [
          {
            weekNum: 2,
            skillWeekNum: 1,
            title: 'Week 2: JavaScript DOM & Events',
            difficulty: 'Easy/Medium',
            topics: ['DOM Selection', 'Event Listeners', 'Async/Await', 'Fetch API'],
            tasks: [
              { id: 'fd_js_2_1', title: 'Manipulate web DOM nodes dynamically with document.querySelector', skill: 'JavaScript', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'fd_js_2_2', title: 'Attach click, change, and submit event listeners', skill: 'JavaScript', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'fd_js_2_3', title: 'Fetch live JSON data from REST APIs using async/await', skill: 'JavaScript', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'fd_js_2_4', title: 'Build an interactive search & filter web app', skill: 'JavaScript', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      }
    ]
  },

  backend_developer: {
    careerId: 'backend_developer',
    title: 'Backend Developer Master Roadmap',
    skills: [
      {
        id: 'java',
        name: 'Java / Python Core',
        icon: '☕',
        description: 'Master object-oriented programming, data structures, and CLI backend logic.',
        weeks: [
          {
            weekNum: 1,
            skillWeekNum: 1,
            title: 'Week 1: OOP & Backend Fundamentals',
            difficulty: 'Easy',
            topics: ['Classes & Objects', 'Inheritance', 'Interfaces', 'Exception Handling'],
            tasks: [
              { id: 'be_jv_1_1', title: 'Create domain models with encapsulation and getters/setters', skill: 'Java', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'be_jv_1_2', title: 'Implement interfaces to separate API contracts', skill: 'Java', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'be_jv_1_3', title: 'Handle runtime errors using try-catch blocks', skill: 'Java', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'be_jv_1_4', title: 'Build a CLI backend data service in Java', skill: 'Java', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      },
      {
        id: 'sql',
        name: 'SQL & Database Architecture',
        icon: '🗄️',
        description: 'Master relational schema design, indexes, transactions, and complex SQL joins.',
        weeks: [
          {
            weekNum: 2,
            skillWeekNum: 1,
            title: 'Week 2: Database Schema & Relational Queries',
            difficulty: 'Medium',
            topics: ['CREATE TABLE', 'Foreign Keys', 'INNER / LEFT JOIN', 'Indexes'],
            tasks: [
              { id: 'be_sq_2_1', title: 'Design 3NF relational database schema with foreign keys', skill: 'SQL', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'be_sq_2_2', title: 'Write complex multi-table queries with INNER JOIN', skill: 'SQL', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'be_sq_2_3', title: 'Create indexes to optimize backend query speed', skill: 'SQL', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'be_sq_2_4', title: 'Build an E-Commerce backend relational schema', skill: 'SQL', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      }
    ]
  },

  cybersecurity_analyst: {
    careerId: 'cybersecurity_analyst',
    title: 'Cybersecurity Analyst Master Roadmap',
    skills: [
      {
        id: 'python',
        name: 'Python for Security Automation',
        icon: '🐍',
        description: 'Master log parsing scripts, socket network connections, and security tools.',
        weeks: [
          {
            weekNum: 1,
            skillWeekNum: 1,
            title: 'Week 1: Python Security Automation',
            difficulty: 'Easy',
            topics: ['File I/O', 'Regex Matching', 'Sockets', 'Security Scripts'],
            tasks: [
              { id: 'cs_py_1_1', title: 'Write a Python script to parse server SSH login log files', skill: 'Python', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'cs_py_1_2', title: 'Use regex to detect IP address anomalies & failed logins', skill: 'Python', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'cs_py_1_3', title: 'Build a basic TCP port scanner script using Python sockets', skill: 'Python', time: '60 min', xp: 100, readiness: '+4%' },
              { id: 'cs_py_1_4', title: 'Create an automated Log Alert Monitor in Python', skill: 'Python', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      }
    ]
  },

  product_manager: {
    careerId: 'product_manager',
    title: 'Product Manager Master Roadmap',
    skills: [
      {
        id: 'aptitude',
        name: 'Product Strategy & Prioritization',
        icon: '💼',
        description: 'Master product backlog estimation, user stories, RICE scoring, and ROI trade-offs.',
        weeks: [
          {
            weekNum: 1,
            skillWeekNum: 1,
            title: 'Week 1: Backlog Prioritization & RICE',
            difficulty: 'Easy',
            topics: ['RICE Scoring', 'User Stories', 'Acceptance Criteria', 'MVP Scope'],
            tasks: [
              { id: 'pm_ap_1_1', title: 'Evaluate candidate features using RICE (Reach, Impact, Confidence, Effort)', skill: 'Aptitude', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'pm_ap_1_2', title: 'Draft complete Given-When-Then acceptance criteria user stories', skill: 'Aptitude', time: '45 min', xp: 50, readiness: '+2%' },
              { id: 'pm_ap_1_3', title: 'Define MVP feature boundaries vs v1.1 backlog items', skill: 'Aptitude', time: '60 min', xp: 75, readiness: '+3%' },
              { id: 'pm_ap_1_4', title: 'Build a Q3 Product Feature Prioritization Roadmap', skill: 'Aptitude', time: '90 min', xp: 150, readiness: '+5%' }
            ]
          }
        ]
      }
    ]
  }
};

// Fallback helper to retrieve or generate career roadmap
export function getCareerRoadmap(careerId = 'software_engineer') {
  if (CAREER_ROADMAPS[careerId]) {
    return CAREER_ROADMAPS[careerId];
  }
  return CAREER_ROADMAPS.software_engineer;
}

// Utility: Re-orders skills so that the preferred starting skill is at index 0
export function reorderRoadmapByFirstSkill(careerRoadmap, preferredSkillId) {
  if (!careerRoadmap || !careerRoadmap.skills || careerRoadmap.skills.length === 0) {
    return careerRoadmap;
  }

  const skillIdx = careerRoadmap.skills.findIndex(s => s.id === preferredSkillId);
  if (skillIdx <= 0) {
    return careerRoadmap; // Already first or not found
  }

  // Clone skills array and move chosen skill to index 0
  const skillsCopy = [...careerRoadmap.skills];
  const [chosenSkill] = skillsCopy.splice(skillIdx, 1);
  skillsCopy.unshift(chosenSkill);

  // Recalculate global weekNum sequentially
  let currentWeekNum = 1;
  const reorderedSkills = skillsCopy.map(sk => {
    const reorderedWeeks = sk.weeks.map(w => {
      const updatedWeek = {
        ...w,
        weekNum: currentWeekNum
      };
      currentWeekNum += 1;
      return updatedWeek;
    });

    return {
      ...sk,
      weeks: reorderedWeeks
    };
  });

  return {
    ...careerRoadmap,
    skills: reorderedSkills
  };
}
