// RookX Core Data Module: structured data for careers, colleges, scholarships, assessments, and myth busters.

export const CAREER_LIST = [
  {
    id: "software_engineer",
    name: "Software Engineer",
    description: "Builds, tests, and deploys scalable software applications, services, and libraries.",
    icon: "Code",
    color: "#3b82f6", // Neon Blue
    weights: {
      coding: 40,
      problem_solving: 20,
      aptitude: 15,
      sql: 10,
      communication: 10,
      interest: 5
    },
    requiredSkills: [
      { name: "JavaScript/React", level: 80 },
      { name: "Data Structures & Algorithms", level: 75 },
      { name: "Node.js & Databases", level: 70 },
      { name: "Git & Version Control", level: 80 }
    ],
    recommendedProjects: [
      { title: "Full-Stack Task Manager", desc: "Build a responsive Kanban board using React, Node.js, and SQL." },
      { title: "E-Commerce API", desc: "Develop a secure RESTful API with complete authentication and cart checkout." },
      { title: "Algorithms Visualizer", desc: "Interactive canvas app showing search and sort patterns in real time." }
    ],
    readinessCriteria: [
      "Can write modular JavaScript or Python code.",
      "Understands database normalization and CRUD operations.",
      "Proficient with version control and terminal commands.",
      "Can debug syntax and logical errors efficiently."
    ]
  },
  {
    id: "data_scientist",
    name: "Data Scientist",
    description: "Extracts insights from structured/unstructured data using statistical modeling and machine learning.",
    icon: "BarChart3",
    color: "#06b6d4", // Neon Cyan
    weights: {
      sql: 30,
      statistics: 25,
      aptitude: 20,
      data_interpretation: 15,
      communication: 10
    },
    requiredSkills: [
      { name: "Python (Pandas/NumPy)", level: 85 },
      { name: "SQL & Querying", level: 80 },
      { name: "Probability & Statistics", level: 80 },
      { name: "Machine Learning (Scikit-Learn)", level: 70 }
    ],
    recommendedProjects: [
      { title: "Customer Churn Predictor", desc: "Train a Random Forest classifier to predict client churn using Pandas." },
      { title: "Interactive Sales Dashboard", desc: "Design a data portal using SQL queries, Streamlit, and Plotly." },
      { title: "Housing Price Regression", desc: "A linear/gradient-boosted regression pipeline analyzing property trends." }
    ],
    readinessCriteria: [
      "Able to write complex SQL joins and aggregations.",
      "Understands statistical tests, distributions, and probability basics.",
      "Proficient in exploratory data analysis (EDA) using Python.",
      "Understands ML pipeline steps: scaling, training, evaluation."
    ]
  },
  {
    id: "cybersecurity_analyst",
    name: "Cybersecurity Analyst",
    description: "Protects digital networks, servers, and devices from malicious hacks and unauthorized access.",
    icon: "ShieldAlert",
    color: "#f43f5e", // Neon Rose
    weights: {
      aptitude: 25,
      coding: 20,
      networking: 25,
      security_concepts: 20,
      communication: 10
    },
    requiredSkills: [
      { name: "Network Routing & Protocols", level: 80 },
      { name: "Linux Administration", level: 75 },
      { name: "Vulnerability Scanning", level: 70 },
      { name: "Bash/Python Scripting", level: 65 }
    ],
    recommendedProjects: [
      { title: "Intrusion Detection System", desc: "Write a packet-sniffing script to flag abnormal traffic patterns." },
      { title: "Penetration Testing Lab", desc: "Deploy a virtualized network environment to identify open ports and exploits." },
      { title: "Encrypted Secure Chat", desc: "Implement an AES-encrypted client-server message tool in Python." }
    ],
    readinessCriteria: [
      "Understands the TCP/IP stack, DNS, and HTTP protocol operations.",
      "Able to identify top vulnerability classes (OWASP Top 10).",
      "Familiar with standard command line tools like nmap and Wireshark.",
      "Understands symmetrical/asymmetrical encryption principles."
    ]
  },
  {
    id: "ui_ux_designer",
    name: "UI/UX Designer",
    description: "Researches user needs and designs high-fidelity wireframes, flows, and interactive layouts.",
    icon: "Palette",
    color: "#a855f7", // Neon Purple
    weights: {
      design_principles: 35,
      user_research: 25,
      communication: 20,
      aptitude: 15,
      coding: 5
    },
    requiredSkills: [
      { name: "Figma & Prototyping", level: 85 },
      { name: "User Research & Testing", level: 80 },
      { name: "Typography & Color Theory", level: 85 },
      { name: "Basic HTML/CSS Layouts", level: 60 }
    ],
    recommendedProjects: [
      { title: "EdTech Dashboard Prototype", desc: "Design a desktop app HUD for student tracking with dynamic design tokens." },
      { title: "Locality Volunteering App", desc: "Perform user research interviews and deliver clickable Figma workflows." },
      { title: "Interactive Portfolio site", desc: "Code an interactive web portfolio with smooth custom transitions." }
    ],
    readinessCriteria: [
      "Proficient in constructing components, auto-layouts, and styles in Figma.",
      "Understands wireframing levels: sketch, low-fi, high-fi prototyping.",
      "Knows user experience heuristics (Gestalt principles, Fitts's law).",
      "Able to conduct usability interviews and aggregate user feedback."
    ]
  },
  {
    id: "product_manager",
    name: "Product Manager",
    description: "Defines product strategy, prioritizes feature roadmaps, and coordinates engineering and design teams.",
    icon: "Compass",
    color: "#fb923c", // Vibrant Orange
    weights: {
      communication: 35,
      problem_solving: 25,
      business_strategy: 20,
      data_interpretation: 15,
      coding: 5
    },
    requiredSkills: [
      { name: "Agile & Jira Management", level: 80 },
      { name: "Product Roadmap Design", level: 85 },
      { name: "Data Analytics & KPI Tracking", level: 75 },
      { name: "Market/User Research", level: 80 }
    ],
    recommendedProjects: [
      { title: "PRD for AI Career Tool", desc: "Draft a comprehensive Product Requirement Document for a career bot." },
      { title: "Feature Prioritization Model", desc: "Construct a RICE scoring matrix analyzing 15 product ideas." },
      { title: "User Journey Funnel Analysis", desc: "Map and analyze sign-up churn using SQL and interactive flow diagrams." }
    ],
    readinessCriteria: [
      "Can draft detailed user stories with concrete acceptance criteria.",
      "Familiar with product metrics: CAC, LTV, churn, MAU, retention.",
      "Understands feature prioritization models (RICE, MoSCoW).",
      "Excellent presentation and cross-functional facilitation skills."
    ]
  }
];

export const DISCOVERY_SCENARIOS = [
  {
    id: "ds_1",
    question: "You have 3 hours to work on a fresh project. Which of these tasks gets you most excited?",
    options: [
      { text: "Writing code to connect pages and get a database storing items.", type: "software_engineer" },
      { text: "Cleaning up a messy Excel dataset to find hidden purchase patterns.", type: "data_scientist" },
      { text: "Inspecting a web form's code to see if it allows malicious injections.", type: "cybersecurity_analyst" },
      { text: "Sketching layout variations, choosing typography, and styling components.", type: "ui_ux_designer" }
    ]
  },
  {
    id: "ds_2",
    question: "A company's online store goes down during a big sale. What is your immediate focus?",
    options: [
      { text: "Trace server request logs and fix the broken database database query.", type: "software_engineer" },
      { text: "Query the logs to calculate the exact loss in sales and trend projections.", type: "data_scientist" },
      { text: "Perform a security scan to verify if this is a DDoS attack or network breach.", type: "cybersecurity_analyst" },
      { text: "Check customer service requests to see how we should design the status page.", type: "ui_ux_designer" }
    ]
  },
  {
    id: "ds_3",
    question: "Which type of challenge is most satisfying for you to solve?",
    options: [
      { text: "Making a slow function run 10x faster and cleaner.", type: "software_engineer" },
      { text: "Finding that a specific metric explains why users cancel subscriptions.", type: "data_scientist" },
      { text: "Setting up a firewall and network configurations to block ports.", type: "cybersecurity_analyst" },
      { text: "Reworking a multi-step checkout form so users finish in half the time.", type: "ui_ux_designer" }
    ]
  },
  {
    id: "ds_4",
    question: "In a team group project, what role do you naturally fall into?",
    options: [
      { text: "The primary coder/builder who writes the core program files.", type: "software_engineer" },
      { text: "The researcher who compiles data and does statistical validation.", type: "data_scientist" },
      { text: "The safeguard who checks sharing links and enforces file structure permissions.", type: "cybersecurity_analyst" },
      { text: "The visual presenter who makes the demo slide decks look beautiful.", type: "ui_ux_designer" }
    ]
  }
];

export const ASSESSMENT_QUESTIONS = [
  // Aptitude
  {
    id: "apt_1",
    category: "aptitude",
    text: "Complete the pattern: 3, 6, 12, 21, 33, ...",
    options: [
      { text: "45", isCorrect: false },
      { text: "48", isCorrect: true }, // +3, +6, +9, +12, +15
      { text: "42", isCorrect: false },
      { text: "51", isCorrect: false }
    ]
  },
  {
    id: "apt_2",
    category: "aptitude",
    text: "Five years ago, a father was 3 times as old as his son. In 10 years, he will be twice as old. How old is the son now?",
    options: [
      { text: "15 years", isCorrect: false },
      { text: "20 years", isCorrect: true }, // F-5 = 3(S-5) => F = 3S - 10. F+10 = 2(S+10) => F = 2S + 10. 3S-10 = 2S+10 => S = 20.
      { text: "25 years", isCorrect: false },
      { text: "30 years", isCorrect: false }
    ]
  },
  // Coding
  {
    id: "cod_1",
    category: "coding",
    text: "Which of the following data structures operates on a First-In, First-Out (FIFO) basis?",
    options: [
      { text: "Stack", isCorrect: false },
      { text: "Queue", isCorrect: true },
      { text: "Binary Tree", isCorrect: false },
      { text: "Hash Map", isCorrect: false }
    ]
  },
  {
    id: "cod_2",
    category: "coding",
    text: "What is the time complexity of searching in a balanced Binary Search Tree?",
    options: [
      { text: "O(1)", isCorrect: false },
      { text: "O(N)", isCorrect: false },
      { text: "O(log N)", isCorrect: true },
      { text: "O(N log N)", isCorrect: false }
    ]
  },
  // Data/SQL
  {
    id: "sql_1",
    category: "sql",
    text: "Which SQL clause is used to filter records generated by a GROUP BY statement?",
    options: [
      { text: "WHERE", isCorrect: false },
      { text: "HAVING", isCorrect: true },
      { text: "FILTER", isCorrect: false },
      { text: "SORT", isCorrect: false }
    ]
  },
  {
    id: "sql_2",
    category: "sql",
    text: "What type of join returns all records from the left table, and matching records from the right table?",
    options: [
      { text: "INNER JOIN", isCorrect: false },
      { text: "LEFT JOIN", isCorrect: true },
      { text: "RIGHT JOIN", isCorrect: false },
      { text: "FULL OUTER JOIN", isCorrect: false }
    ]
  },
  // Math
  {
    id: "mat_1",
    category: "mathematics",
    text: "If the probability of rolling a 6-sided die and getting an even number is P(A) and rolling a 4 is P(B), what is P(A or B)?",
    options: [
      { text: "1/2", isCorrect: true }, // Even numbers: 2, 4, 6 (3/6 = 1/2). Rolling a 4 is already in that set.
      { text: "2/3", isCorrect: false },
      { text: "1/3", isCorrect: false },
      { text: "5/6", isCorrect: false }
    ]
  },
  {
    id: "mat_2",
    category: "mathematics",
    text: "What is the derivative of f(x) = 3x^2 + 5x - 7 with respect to x?",
    options: [
      { text: "3x + 5", isCorrect: false },
      { text: "6x + 5", isCorrect: true },
      { text: "6x^2 + 5", isCorrect: false },
      { text: "6x - 7", isCorrect: false }
    ]
  },
  // Communication
  {
    id: "com_1",
    category: "communication",
    text: "Your team is running behind schedule on a deliverable. What is the best way to handle this?",
    options: [
      { text: "Keep quiet and hope to complete it last-minute to avoid worrying anyone.", isCorrect: false },
      { text: "Notify stakeholders early, outline the reasons, and propose a new timeline.", isCorrect: true },
      { text: "Blame the delays on the client's slow requirements gathering.", isCorrect: false },
      { text: "Ask team members to work 16 hours a day without discussing it with them.", isCorrect: false }
    ]
  }
];

export const EDUCATION_PATHWAYS = {
  software_engineer: {
    courses: [
      { name: "B.Tech in Computer Science & Engineering (CSE)", duration: "4 Years", rating: "9.5/10" },
      { name: "B.Sc in Computer Science / BCA", duration: "3 Years", rating: "8.0/10" },
      { name: "B.Tech in Information Technology", duration: "4 Years", rating: "9.0/10" }
    ],
    entranceExams: [
      { name: "JEE Mains / Advanced", description: "All India entry exam for IITs, NITs, and IIITs.", dates: "Session 1: Jan | Session 2: Apr" },
      { name: "BITSAT", description: "Entrance exam for Birla Institute of Technology and Science.", dates: "May - June" },
      { name: "VITEEE", description: "VIT University entry test.", dates: "April" }
    ],
    colleges: [
      { name: "Indian Institute of Technology (IIT), Bombay", location: "Mumbai, MH", fees: "2,20,000 / Yr", type: "Government", distance: "Local", admission: "JEE Advanced" },
      { name: "National Institute of Technology (NIT), Trichy", location: "Tiruchirappalli, TN", fees: "1,50,000 / Yr", type: "Government", distance: "Outstation", admission: "JEE Mains" },
      { name: "BITS Pilani", location: "Pilani, RJ", fees: "5,00,000 / Yr", type: "Private", distance: "Outstation", admission: "BITSAT" },
      { name: "Vellore Institute of Technology", location: "Vellore, TN", fees: "2,00,000 / Yr", type: "Private", distance: "Outstation", admission: "VITEEE" }
    ]
  },
  data_scientist: {
    courses: [
      { name: "B.Tech in AI & Data Science", duration: "4 Years", rating: "9.6/10" },
      { name: "B.Sc in Statistics & Data Interpretation", duration: "3 Years", rating: "8.8/10" },
      { name: "BCA with Data Analytics Specialization", duration: "3 Years", rating: "8.2/10" }
    ],
    entranceExams: [
      { name: "JEE Mains", description: "Joint Entrance Examination for engineering degrees.", dates: "Jan / April" },
      { name: "ISI Admission Test", description: "Indian Statistical Institute entry for statistics courses.", dates: "May" }
    ],
    colleges: [
      { name: "Indian Statistical Institute (ISI)", location: "Kolkata, WB", fees: "Nil (Stipend provided)", type: "Government", distance: "Outstation", admission: "ISI Test" },
      { name: "IIT Madras (Data Science Online / Hybrid)", location: "Chennai, TN", fees: "1,00,000 / Yr", type: "Government", distance: "Remote", admission: "Qualifier Exam" },
      { name: "IIIT Bangalore", location: "Bangalore, KA", fees: "3,50,000 / Yr", type: "Private", distance: "Outstation", admission: "JEE Mains" }
    ]
  },
  cybersecurity_analyst: {
    courses: [
      { name: "B.Tech in Cybersecurity / Information Security", duration: "4 Years", rating: "9.3/10" },
      { name: "B.Sc in Cyber Security & Forensics", duration: "3 Years", rating: "8.5/10" }
    ],
    entranceExams: [
      { name: "JEE Mains", description: "Central engineering entrance exam.", dates: "Jan / April" },
      { name: "NFSU AT", description: "National Forensic Sciences University Admission Test.", dates: "June" }
    ],
    colleges: [
      { name: "National Forensic Sciences University", location: "Gandhinagar, GJ", fees: "1,20,000 / Yr", type: "Government", distance: "Outstation", admission: "NFSU AT" },
      { name: "DTU (Delhi Technological University)", location: "Delhi", fees: "2,00,000 / Yr", type: "Government", distance: "Outstation", admission: "JEE Mains" },
      { name: "Manipal Institute of Technology", location: "Manipal, KA", fees: "4,20,000 / Yr", type: "Private", distance: "Outstation", admission: "MET Exam" }
    ]
  },
  ui_ux_designer: {
    courses: [
      { name: "Bachelor of Design (B.Des) in Interaction/Communication Design", duration: "4 Years", rating: "9.7/10" },
      { name: "B.Sc in Animation and Multimedia Design", duration: "3 Years", rating: "7.8/10" }
    ],
    entranceExams: [
      { name: "UCEED", description: "Undergraduate Common Entrance Examination for Design.", dates: "January" },
      { name: "NID DAT", description: "National Institute of Design - Design Aptitude Test.", dates: "December - January" }
    ],
    colleges: [
      { name: "Industrial Design Centre (IDC), IIT Bombay", location: "Mumbai, MH", fees: "1,80,000 / Yr", type: "Government", distance: "Local", admission: "UCEED" },
      { name: "National Institute of Design (NID)", location: "Ahmedabad, GJ", fees: "2,50,000 / Yr", type: "Government", distance: "Outstation", admission: "NID DAT" },
      { name: "Srishti Institute of Art, Design and Technology", location: "Bangalore, KA", fees: "5,50,000 / Yr", type: "Private", distance: "Outstation", admission: "Srishti Entrance" }
    ]
  },
  product_manager: {
    courses: [
      { name: "Integrated MBA (BBA + MBA)", duration: "5 Years", rating: "9.2/10" },
      { name: "B.Tech CSE + Business Management Minor", duration: "4 Years", rating: "9.5/10" }
    ],
    entranceExams: [
      { name: "IPMAT", description: "Five-year Integrated Program in Management Aptitude Test (IIM Indore).", dates: "May" },
      { name: "JEE Mains", description: "Joint Entrance Exam.", dates: "Jan / April" }
    ],
    colleges: [
      { name: "Indian Institute of Management (IIM), Indore", location: "Indore, MP", fees: "4,00,000 / Yr", type: "Government", distance: "Outstation", admission: "IPMAT" },
      { name: "IIM Rohtak", location: "Rohtak, HR", fees: "3,80,000 / Yr", type: "Government", distance: "Outstation", admission: "IPMAT" },
      { name: "NMIMS School of Business", location: "Mumbai, MH", fees: "3,20,000 / Yr", type: "Private", distance: "Local", admission: "NMAT / NPAT" }
    ]
  }
};

export const SCHOLARSHIPS = [
  {
    name: "KVPY (Kishore Vaigyanik Protsahan Yojana)",
    amount: "Rs. 5,000 - 7,000 / Month + Contingency",
    eligibility: "Students pursuing Basic Sciences, Math, Statistics. High academic marks in Class 10 & 12.",
    deadline: "October",
    source: "kvpy.iisc.ac.in"
  },
  {
    name: "OP Jindal Engineering & Management Scholarship (OPJEMS)",
    amount: "Rs. 80,000 / Year",
    eligibility: "Top performers in 3rd/4th year B.Tech CSE/IT/Metallurgy or Management at partner colleges.",
    deadline: "September",
    source: "opjems.com"
  },
  {
    name: "AICTE Pragati Scholarship for Girls",
    amount: "Rs. 50,000 / Year",
    eligibility: "Girl students admitted to AICTE approved technical degree courses. Family income < Rs. 8 LPA.",
    deadline: "December",
    source: "scholarships.gov.in"
  },
  {
    name: "Reliance Foundation Undergraduate Scholarships",
    amount: "Up to Rs. 2,00,000 over course duration",
    eligibility: "Full-time UG students in any stream. Based on aptitude test and family income.",
    deadline: "October",
    source: "reliancefoundation.org"
  }
];

export const MYTH_BUSTERS = [
  {
    myth: "Everyone working in technology must be a brilliant math/coding wizard.",
    reality: "False! Many tech careers (like Product Management, UI/UX Design, Technical Writing, Scrum Masters, and SEO strategy) value communication, empathy, system organization, and graphics layout far more than writing complex algorithms."
  },
  {
    myth: "Once you graduate college, your career path is set in stone forever.",
    reality: "Not at all. The modern workspace relies on skills, not degrees. Over 45% of engineers change specializations within 5 years of graduating. Adapting via online projects, certifications, and portfolios is highly common."
  },
  {
    myth: "Data Science is just about coding Python scripts and models.",
    reality: "False. Data science is 70% about asking the right questions, cleaning databases, understanding business metrics, and presenting insights to managers. High coding skills without domain knowledge is useless."
  },
  {
    myth: "Cybersecurity is all about hacking databases and cracking passwords in a dark room.",
    reality: "False. Real cybersecurity is mostly risk compliance, auditing system permissions, configuring server firewalls, educating employees, and drafting incident recovery plans."
  }
];
