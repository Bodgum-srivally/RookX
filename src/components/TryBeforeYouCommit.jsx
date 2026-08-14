import React, { useState, useEffect } from 'react';
import { 
  Terminal, BarChart3, Layout, ShieldAlert, Briefcase, 
  CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Sparkles, HelpCircle, ChevronRight, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateAIQuestions } from '../services/aiQuestionService';

export default function TryBeforeYouCommit({ profile, onCompleteSimulation, setTab }) {
  const [selectedCareerId, setSelectedCareerId] = useState('software_engineer');
  const [simulationState, setSimulationState] = useState('select'); // 'select', 'active', 'results'
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { qIdx: selectedOption }
  const [showExplanation, setShowExplanation] = useState(false);
  const [resultSummary, setResultSummary] = useState(null);
  const [seenQuestionIds, setSeenQuestionIds] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const CAREERS = [
    {
      id: 'software_engineer',
      name: 'Software Developer',
      icon: Terminal,
      color: 'border-cyber-neonPurple text-cyber-neonPurple bg-cyber-neonPurple/10',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      shortDesc: 'Debug code, solve logical errors, and optimize algorithms.',
      taskTitle: 'Code & Logic Simulation (3 Tasks)',
      difficulty: 'Easy-Medium'
    },
    {
      id: 'data_scientist',
      name: 'Data Analyst',
      icon: BarChart3,
      color: 'border-cyber-neonCyan text-cyber-neonCyan bg-cyber-neonCyan/10',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      shortDesc: 'Analyze datasets, identify key drivers, and extract insights.',
      taskTitle: 'Data & Analytics Simulation (3 Tasks)',
      difficulty: 'Easy'
    },
    {
      id: 'ui_ux_designer',
      name: 'UI/UX Designer',
      icon: Layout,
      color: 'border-amber-400 text-amber-400 bg-amber-400/10',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      shortDesc: 'Evaluate user journeys, wireframes, and interface decisions.',
      taskTitle: 'UX Layout & Design Simulation (3 Tasks)',
      difficulty: 'Easy'
    },
    {
      id: 'cybersecurity_analyst',
      name: 'Cybersecurity Analyst',
      icon: ShieldAlert,
      color: 'border-cyber-neonRose text-cyber-neonRose bg-cyber-neonRose/10',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      shortDesc: 'Inspect server logs, spot intrusion threats, and audit code.',
      taskTitle: 'Security Audit Simulation (3 Tasks)',
      difficulty: 'Medium'
    },
    {
      id: 'product_manager',
      name: 'Product Manager',
      icon: Briefcase,
      color: 'border-emerald-400 text-emerald-400 bg-emerald-400/10',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      shortDesc: 'Prioritize feature backlogs and balance business trade-offs.',
      taskTitle: 'Product Backlog Simulation (3 Tasks)',
      difficulty: 'Easy'
    }
  ];

  // RICH QUESTION BANK POOL (6 Diverse Questions Per Career)
  const QUESTION_BANK = {
    software_engineer: [
      {
        id: 'se_q1',
        title: 'Task 1: Fix Shopping Cart Discount Logic',
        scenario: 'A shopping cart function is giving users double discounts during checkout. Inspect the JavaScript function below and select the correct fix.',
        codeSnippet: `function calculateTotal(items, discountCode) {
  let total = items.reduce((sum, item) => sum + item.price, 0);
  if (discountCode === 'SAVE20') {
    total = total - (total * 0.20); // 20% discount applied
    total = total * 0.80; // BUG: 20% discount applied AGAIN!
  }
  return total;
}`,
        options: [
          { id: 'o1', text: 'Remove line 5 (total = total * 0.80) because 20% discount was already calculated on line 4.', isCorrect: true, explanation: 'Correct! Line 4 already subtracted 20% from total. Line 5 was accidentally applying an additional 20% discount.' },
          { id: 'o2', text: 'Add total = total + 20 at the end of the function.', isCorrect: false, explanation: 'Incorrect. Adding static +20 does not fix variable percentage discounts.' },
          { id: 'o3', text: 'Change 0.20 to 2.0 on line 4.', isCorrect: false, explanation: 'Incorrect. 2.0 is 200%, making the total negative.' }
        ]
      },
      {
        id: 'se_q2',
        title: 'Task 2: Fix Uncaught Null Reference Exception',
        scenario: 'The web app crashes when rendering a user profile page for new accounts because optional profile metadata is missing.',
        codeSnippet: `// Failing code:
const userCity = user.profile.location.city; // TypeError: Cannot read property 'location' of undefined`,
        options: [
          { id: 'o1', text: 'Use optional chaining: const userCity = user?.profile?.location?.city || "Unknown";', isCorrect: true, explanation: 'Spot on! Optional chaining (?.) safely evaluates nested properties without throwing TypeError if intermediate objects are undefined.' },
          { id: 'o2', text: 'Wrap the code in a while(true) loop.', isCorrect: false, explanation: 'Incorrect. A while loop creates an infinite CPU hang.' },
          { id: 'o3', text: 'Delete user.profile from the database.', isCorrect: false, explanation: 'Incorrect. Deleting data masks the bug rather than resolving safe property access.' }
        ]
      },
      {
        id: 'se_q3',
        title: 'Task 3: Fix Infinite Loop in Data Pagination',
        scenario: 'The page hangs indefinitely when loading page 2 of search results.',
        codeSnippet: `let page = 1;
while (page <= totalPages) {
  fetchPageData(page);
  // BUG: Missing page counter increment!
}`,
        options: [
          { id: 'o1', text: 'Add page++; inside the while loop body.', isCorrect: true, explanation: 'Correct! Without incrementing page++, page <= totalPages remains true forever, freezing the browser thread.' },
          { id: 'o2', text: 'Change page = 1 to page = 0.', isCorrect: false, explanation: 'Incorrect. Setting initial page to 0 still results in an infinite loop without page++.' },
          { id: 'o3', text: 'Replace while with return true;.', isCorrect: false, explanation: 'Incorrect. Returning immediately cancels pagination processing.' }
        ]
      },
      {
        id: 'se_q4',
        title: 'Task 4: Resolve Async Data Race Condition',
        scenario: 'The UI displays "undefined" because the render function executes before API data finishes downloading.',
        codeSnippet: `// Failing code:
function loadDashboard() {
  const data = fetchUserData(); // Returns Promise <pending>
  renderWidget(data.name); // Crashes!
}`,
        options: [
          { id: 'o1', text: 'Make function async and add await before fetchUserData(): const data = await fetchUserData();', isCorrect: true, explanation: 'Perfect! Marking the function async and awaiting the Promise guarantees data is received before rendering.' },
          { id: 'o2', text: 'Call setTimeout for 10 seconds.', isCorrect: false, explanation: 'Incorrect. Arbitrary timers create flaky race conditions depending on network speed.' },
          { id: 'o3', text: 'Rename data to userObj.', isCorrect: false, explanation: 'Incorrect. Variable renaming does not handle async asynchronous execution.' }
        ]
      },
      {
        id: 'se_q5',
        title: 'Task 5: Fix Off-by-One Array Indexing Error',
        scenario: 'An algorithm iterating through student exam scores throws an Out of Bounds error on the final element.',
        codeSnippet: `const scores = [85, 92, 78, 90];
for (let i = 0; i <= scores.length; i++) {
  console.log(scores[i]); // Throws undefined on index 4!
}`,
        options: [
          { id: 'o1', text: 'Change i <= scores.length to i < scores.length in the loop condition.', isCorrect: true, explanation: 'Correct! Arrays are 0-indexed, so valid indices for length 4 are 0, 1, 2, 3. Condition < stops at index 3.' },
          { id: 'o2', text: 'Change i = 0 to i = 1.', isCorrect: false, explanation: 'Incorrect. Starting at index 1 skips the first score (85).' },
          { id: 'o3', text: 'Add scores.push(0) before the loop.', isCorrect: false, explanation: 'Incorrect. Adding fake items mutates the input data.' }
        ]
      },
      {
        id: 'se_q6',
        title: 'Task 6: Resolve Git Merge Conflict',
        scenario: 'Two developers edited the user authentication helper concurrently. Git flagged a conflict in auth.js.',
        codeSnippet: `<<<<<<< HEAD
const AUTH_TOKEN_EXPIRY = '7d';
=======
const AUTH_TOKEN_EXPIRY = '24h'; // Security patch requirement
>>>>>>> main`,
        options: [
          { id: 'o1', text: 'Keep the 24h security patch update and remove conflict marker headers.', isCorrect: true, explanation: 'Spot on! Resolving conflicts requires keeping the verified security requirement and removing Git conflict delimiters.' },
          { id: 'o2', text: 'Commit all Git marker lines <<<<<<< and >>>>>>> directly into production.', isCorrect: false, explanation: 'Incorrect. Committing Git markers causes syntax parse errors.' },
          { id: 'o3', text: 'Delete the entire auth.js file.', isCorrect: false, explanation: 'Incorrect. Deleting auth.js breaks user authentication.' }
        ]
      }
    ],
    data_scientist: [
      {
        id: 'ds_q1',
        title: 'Task 1: Identify Customer Churn Root Cause',
        scenario: 'Your company noticed a surge in user cancellations. Review the data table below and identify the primary operational driver causing customer churn.',
        dataTable: [
          { region: 'North', tickets: 120, resTime: '2.1 Hours', churn: '4.2%' },
          { region: 'South', tickets: 450, resTime: '18.5 Hours', churn: '24.8%' },
          { region: 'East', tickets: 180, resTime: '3.4 Hours', churn: '5.1%' },
          { region: 'West', tickets: 210, resTime: '4.0 Hours', churn: '6.0%' }
        ],
        options: [
          { id: 'o1', text: 'Excessive support ticket resolution time in South (18.5 hrs vs ~3 hrs in other regions) directly drives 24.8% churn.', isCorrect: true, explanation: 'Spot on! The data shows a direct correlation between long 18.5 hour response times and high 24.8% customer churn.' },
          { id: 'o2', text: 'The East region has too many support tickets.', isCorrect: false, explanation: 'Incorrect. East region has normal ticket volume and low 5.1% churn.' },
          { id: 'o3', text: 'Pricing in North region is too high.', isCorrect: false, explanation: 'Incorrect. Pricing is uniform across regions and North has the lowest churn (4.2%).' }
        ]
      },
      {
        id: 'ds_q2',
        title: 'Task 2: Analyze Mobile Conversion Drop-Off',
        scenario: 'A retail platform updated their web app. Review conversion data by device type to spot the anomaly.',
        dataTable: [
          { device: 'Desktop Chrome', visitors: 10000, checkoutPct: '4.8%' },
          { device: 'Desktop Safari', visitors: 8000, checkoutPct: '4.5%' },
          { device: 'Mobile iOS', visitors: 15000, checkoutPct: '0.4%' },
          { device: 'Mobile Android', visitors: 12000, checkoutPct: '4.6%' }
        ],
        options: [
          { id: 'o1', text: 'Mobile iOS has a critical checkout bug (0.4% vs ~4.6% on other devices).', isCorrect: true, explanation: 'Correct! Mobile iOS conversion collapsed to 0.4%, indicating a device-specific payment gateway failure.' },
          { id: 'o2', text: 'Desktop Chrome is performing poorly.', isCorrect: false, explanation: 'Incorrect. Desktop Chrome conversion (4.8%) is strong.' },
          { id: 'o3', text: 'Mobile Android has the highest traffic.', isCorrect: false, explanation: 'Incorrect. iOS has 15,000 visitors, higher than Android.' }
        ]
      },
      {
        id: 'ds_q3',
        title: 'Task 3: Fix SQL Aggregation Query Error',
        scenario: 'A reporting query calculating total revenue per product category returns duplicate category rows.',
        codeSnippet: `-- Incorrect SQL Query:
SELECT category, SUM(amount) AS total_revenue
FROM sales_orders; -- Missing GROUP BY clause!`,
        options: [
          { id: 'o1', text: 'Add GROUP BY category at the end of the SQL query.', isCorrect: true, explanation: 'Correct! Aggregate functions like SUM() require GROUP BY when selecting non-aggregated columns like category.' },
          { id: 'o2', text: 'Replace SUM(amount) with AVG(amount).', isCorrect: false, explanation: 'Incorrect. Changing aggregate functions does not replace the missing GROUP BY.' },
          { id: 'o3', text: 'Delete SELECT category.', isCorrect: false, explanation: 'Incorrect. Removing category removes category identification from the report.' }
        ]
      },
      {
        id: 'ds_q4',
        title: 'Task 4: Evaluate A/B Test Results',
        scenario: 'Marketing ran an A/B test on the landing page button color.',
        dataTable: [
          { variant: 'Control (Blue Button)', users: 20000, conversions: 600, rate: '3.0%' },
          { variant: 'Variant A (Green Button)', users: 20000, conversions: 740, rate: '3.7%' },
          { variant: 'Variant B (Purple Button)', users: 100, conversions: 8, rate: '8.0%' }
        ],
        options: [
          { id: 'o1', text: 'Implement Variant A (Green) due to high statistical confidence across 20,000 users (+23.3% conversion lift). Variant B sample size (100) is too small.', isCorrect: true, explanation: 'Excellent statistical judgment! Variant B sample size of 100 is statistically insignificant, whereas Variant A at 20,000 users proves true performance.' },
          { id: 'o2', text: 'Pick Variant B immediately because 8.0% is highest.', isCorrect: false, explanation: 'Incorrect. 100 users is an unrepresentative micro-sample prone to high variance.' },
          { id: 'o3', text: 'Keep the Control Blue Button.', isCorrect: false, explanation: 'Incorrect. Variant A demonstrated a clear statistically significant 23.3% lift.' }
        ]
      },
      {
        id: 'ds_q5',
        title: 'Task 5: Detect Revenue Anomaly Outlier',
        scenario: 'Daily sales revenue logs show a sudden $1,000,000 spike on Tuesday. Inspection shows a single order for 100,000 units by test_admin.',
        options: [
          { id: 'o1', text: 'Filter out the test_admin transaction as an artificial data artifact before computing baseline metrics.', isCorrect: true, explanation: 'Correct! Test transactions skew mean revenue and must be cleaned before modeling.' },
          { id: 'o2', text: 'Include the $1M test transaction in official quarterly forecasts.', isCorrect: false, explanation: 'Incorrect. Including test data inflates forecasts artificially.' },
          { id: 'o3', text: 'Delete all Tuesday sales records completely.', isCorrect: false, explanation: 'Incorrect. Deleting legitimate Tuesday orders creates missing data gaps.' }
        ]
      },
      {
        id: 'ds_q6',
        title: 'Task 6: Interpret User Retention Cohort Curve',
        scenario: 'A mobile app has 100,000 signups on Day 1. By Day 30, active users drop to 12,000 (12% retention).',
        options: [
          { id: 'o1', text: 'Focus on Day 1-7 onboarding activation to improve user retention before spending on new ad campaigns.', isCorrect: true, explanation: 'Spot on! Fixing early onboarding drop-off preserves acquisition ROI before scaling paid ads.' },
          { id: 'o2', text: 'Double ad budget to replace lost users.', isCorrect: false, explanation: 'Incorrect. Pouring money into a leaky retention funnel wastes marketing budget.' },
          { id: 'o3', text: 'Shut down the app immediately.', isCorrect: false, explanation: 'Incorrect. 12% Day 30 retention is workable with improved onboarding.' }
        ]
      }
    ],
    ui_ux_designer: [
      {
        id: 'ux_q1',
        title: 'Task 1: Optimize Mobile Checkout UX Flow',
        scenario: 'Analytics show 65% of mobile users abandon cart on step 2 of checkout. Compare the two UX designs below and choose the optimal flow.',
        uxDesigns: [
          { name: 'Design A — Single Long Form', desc: '15 required input fields asking for middle name, occupation, fax number, and full address before showing shipping options.' },
          { name: 'Design B — Progressive Stepper + Express Pay', desc: '3-step clean wizard with Apple/Google Pay 1-tap checkout, autofill address lookup, and visible progress indicators.' }
        ],
        options: [
          { id: 'o1', text: 'Design B — Progressive stepper and 1-tap express payment reduces cognitive load and form fatigue.', isCorrect: true, explanation: 'Excellent UX choice! Reducing input fields and adding 1-tap payment increases checkout conversion rates by up to 35%.' },
          { id: 'o2', text: 'Design A — Asking for 15 fields upfront builds customer trust.', isCorrect: false, explanation: 'Incorrect. Long forms create high user friction and increase cart abandonment.' }
        ]
      },
      {
        id: 'ux_q2',
        title: 'Task 2: Fix Color Contrast Accessibility (WCAG)',
        scenario: 'Visually impaired users report difficulty reading warning messages on your web app. You inspect the current styling: color: #a1a1aa (light gray) on #ffffff (white) background.',
        options: [
          { id: 'o1', text: 'Update text color to #27272a (dark slate) to achieve a contrast ratio > 4.5:1 compliant with WCAG AA accessibility standards.', isCorrect: true, explanation: 'Spot on! WCAG AA standards require a minimum contrast ratio of 4.5:1 for body text so all users can read content effortlessly.' },
          { id: 'o2', text: 'Keep light gray text and make font size 8px.', isCorrect: false, explanation: 'Incorrect. Decreasing font size makes low-contrast text even harder to read.' },
          { id: 'o3', text: 'Remove warning messages entirely.', isCorrect: false, explanation: 'Incorrect. Hiding important system status messages degrades usability.' }
        ]
      },
      {
        id: 'ux_q3',
        title: 'Task 3: Establish Visual Action Hierarchy',
        scenario: 'A landing page modal has 3 buttons placed side-by-side with identical size, shape, and red background color: "Save", "Cancel", and "Delete Account". Users are accidentally deleting their data.',
        options: [
          { id: 'o1', text: 'Make "Save" the primary button (Solid Accent), "Cancel" secondary (Outlined), and "Delete Account" a distinct destructive action with confirmation.', isCorrect: true, explanation: 'Perfect design hierarchy! Visual distinction prevents catastrophic user mistakes by guiding primary vs destructive intent.' },
          { id: 'o2', text: 'Make all 3 buttons larger and keep them all bright red.', isCorrect: false, explanation: 'Incorrect. Identical red styling continues causing accidental clicks.' },
          { id: 'o3', text: 'Hide all buttons in a hidden right-click menu.', isCorrect: false, explanation: 'Incorrect. Hiding core actions breaks mobile and web discoverability.' }
        ]
      },
      {
        id: 'ux_q4',
        title: 'Task 4: Optimize Mobile Thumb Zone Navigation',
        scenario: 'Users report difficulty navigating your mobile app with one hand because key navigation tabs are placed at the top-left corner of a 6.7-inch screen.',
        options: [
          { id: 'o1', text: 'Move primary navigation to a fixed bottom navigation bar within easy reach of the user\'s thumb.', isCorrect: true, explanation: 'Correct! Mobile ergonomics dictate placing high-frequency targets in the bottom natural thumb zone.' },
          { id: 'o2', text: 'Ask users to use two hands at all times.', isCorrect: false, explanation: 'Incorrect. Design must adapt to user behavior rather than demanding user compliance.' },
          { id: 'o3', text: 'Remove navigation entirely.', isCorrect: false, explanation: 'Incorrect. Disabling navigation breaks app functionality.' }
        ]
      },
      {
        id: 'ux_q5',
        title: 'Task 5: Improve Form Error Feedback Timing',
        scenario: 'Users fill out a 10-field form, click Submit, and only then see a error banner at the top of the page saying "Zip code invalid".',
        options: [
          { id: 'o1', text: 'Implement real-time inline validation feedback adjacent to each input field as the user types.', isCorrect: true, explanation: 'Excellent! Immediate inline feedback reduces context switching and lets users correct mistakes instantly.' },
          { id: 'o2', text: 'Show a popup alert dialog after page reload.', isCorrect: false, explanation: 'Incorrect. Reloading the page loses user focus and state.' },
          { id: 'o3', text: 'Disable form validation entirely.', isCorrect: false, explanation: 'Incorrect. Removing validation results in bad database records.' }
        ]
      },
      {
        id: 'ux_q6',
        title: 'Task 6: Design Engaging Empty State Onboarding',
        scenario: 'A new user logs into their workspace dashboard and sees a blank white screen with no content or guidance.',
        options: [
          { id: 'o1', text: 'Design an encouraging Empty State graphic with a clear "Create Your First Project" primary CTA and sample templates.', isCorrect: true, explanation: 'Spot on! Helpful empty states convert first-time users by providing clear guidance and low-friction starter actions.' },
          { id: 'o2', text: 'Leave the screen completely blank.', isCorrect: false, explanation: 'Incorrect. Blank screens create user confusion and high drop-off.' },
          { id: 'o3', text: 'Show a 50-page PDF user manual popup.', isCorrect: false, explanation: 'Incorrect. Heavy documentation overwhelms new users.' }
        ]
      }
    ],
    cybersecurity_analyst: [
      {
        id: 'sec_q1',
        title: 'Task 1: Spot Malicious Server SSH Access Log',
        scenario: 'Your security monitoring system triggered an alert on port 22. Inspect the server log lines below and identify the threat actor.',
        logLines: [
          '[10:02:11] USER: alex (192.168.1.45) -> Auth SUCCESS (200 OK)',
          '[10:02:15] USER: sara (192.168.1.48) -> Auth SUCCESS (200 OK)',
          '[10:02:18] USER: root (185.220.101.5) -> Failed Password (401)',
          '[10:02:19] USER: root (185.220.101.5) -> Failed Password (401)',
          '[10:02:20] USER: root (185.220.101.5) -> Auth SUCCESS (200 OK) [SSH PORT 22]'
        ],
        options: [
          { id: 'o1', text: 'Brute-force SSH attack from external IP 185.220.101.5 targeting root user, succeeding after rapid failed attempts.', isCorrect: true, explanation: 'Bullseye! Rapid password failures within 2 seconds followed by root login indicates an automated SSH brute-force attack.' },
          { id: 'o2', text: 'User alex logging in from 192.168.1.45 is suspicious.', isCorrect: false, explanation: 'Incorrect. Alex is an internal subnet user (192.168.1.x) with normal login history.' },
          { id: 'o3', text: 'Normal background scheduled cron job.', isCorrect: false, explanation: 'Incorrect. Password failures from an external IP are not backup scripts.' }
        ]
      },
      {
        id: 'sec_q2',
        title: 'Task 2: Analyze Phishing Email Header Anomalies',
        scenario: 'An employee received an urgent email claiming to be from "IT Security Admin" asking them to verify their corporate password.',
        codeSnippet: `From: "IT Security Admin" <support@paypa1-security-verify.cc>
Reply-To: intruder@darknet-mail.ru
Subject: URGENT: Password Expired - Click Here to Verify`,
        options: [
          { id: 'o1', text: 'Identify email as a Phishing Attack due to spoofed domain (@paypa1-security-verify.cc) and suspicious external Reply-To address.', isCorrect: true, explanation: 'Correct! Lookalike typosquatting domains and mismatching Reply-To headers are classic indicators of phishing.' },
          { id: 'o2', text: 'Instruct the employee to click the link and type their password.', isCorrect: false, explanation: 'Incorrect. Following phishing links compromises corporate credentials.' },
          { id: 'o3', text: 'Ignore the email completely.', isCorrect: false, explanation: 'Incorrect. Phishing emails should be reported to SOC to block malicious domain across firewall.' }
        ]
      },
      {
        id: 'sec_q3',
        title: 'Task 3: Identify SQL Injection Vulnerability in Code',
        scenario: 'During a source code audit, you inspect the user authentication SQL query builder below.',
        codeSnippet: `// Vulnerable Code:
const query = "SELECT * FROM users WHERE username = '" + req.body.username + "' AND password = '" + req.body.password + "'";`,
        options: [
          { id: 'o1', text: 'Replace raw string concatenation with Parameterized Queries (Prepared Statements) to prevent SQL Injection.', isCorrect: true, explanation: 'Spot on! Parameterized queries separate SQL code from user data, preventing attackers from injecting arbitrary SQL commands like \' OR \'1\'=\'1.' },
          { id: 'o2', text: 'Convert the SQL query to uppercase.', isCorrect: false, explanation: 'Incorrect. Changing letter case does not prevent SQL injection.' },
          { id: 'o3', text: 'Remove the WHERE clause.', isCorrect: false, explanation: 'Incorrect. Removing WHERE returns all user records to anyone.' }
        ]
      },
      {
        id: 'sec_q4',
        title: 'Task 4: Detect Suspicious Executable Extension',
        scenario: 'A user downloaded an email attachment named Invoice_March_2026.pdf.exe located in their Downloads folder.',
        options: [
          { id: 'o1', text: 'Quarantine file immediately. Double extension (.pdf.exe) hides a malicious Windows executable behind a fake PDF icon.', isCorrect: true, explanation: 'Correct! Attackers use double extensions to trick users into executing malicious code thinking it is a document.' },
          { id: 'o2', text: 'Double click to open the PDF file.', isCorrect: false, explanation: 'Incorrect. Executing .exe runs malicious payload code.' },
          { id: 'o3', text: 'Rename file to .png.', isCorrect: false, explanation: 'Incorrect. Renaming does not neutralize executable code.' }
        ]
      },
      {
        id: 'sec_q5',
        title: 'Task 5: Fix Insecure CORS Header Configuration',
        scenario: 'A security scanner flagged an API endpoint returning the HTTP response header: Access-Control-Allow-Origin: * alongside Access-Control-Allow-Credentials: true.',
        options: [
          { id: 'o1', text: 'Replace wildcard * origin with explicit trusted domain origin whitelist (e.g., https://app.company.com).', isCorrect: true, explanation: 'Perfect security fix! Combining wildcard origins (*) with credential sharing exposes user session cookies to malicious third-party websites.' },
          { id: 'o2', text: 'Keep wildcard * and disable HTTPS encryption.', isCorrect: false, explanation: 'Incorrect. Disabling HTTPS exposes traffic to Man-in-the-Middle sniffing.' },
          { id: 'o3', text: 'Delete all API endpoints.', isCorrect: false, explanation: 'Incorrect. Deleting APIs destroys web app functionality.' }
        ]
      },
      {
        id: 'sec_q6',
        title: 'Task 6: Remediate Exposed Cloud Credentials',
        scenario: 'An automated security scanner detected an AWS Secret Access Key committed to a public GitHub repository 5 minutes ago.',
        options: [
          { id: 'o1', text: 'Immediately revoke the AWS key in IAM console, generate a new key pair, and audit AWS CloudTrail logs for unauthorized API calls.', isCorrect: true, explanation: 'Correct! Once a key is exposed publicly, instant revocation and audit logging is mandatory because bots scrape GitHub within seconds.' },
          { id: 'o2', text: 'Simply delete the commit from local Git history.', isCorrect: false, explanation: 'Incorrect. Public GitHub repos are scraped instantly; deleting local commits does not invalidate active AWS credentials.' },
          { id: 'o3', text: 'Wait 30 days to see if anyone uses the key.', isCorrect: false, explanation: 'Incorrect. Delaying key revocation leads to cloud infrastructure hijacking.' }
        ]
      }
    ],
    product_manager: [
      {
        id: 'pm_q1',
        title: 'Task 1: Prioritize Q3 Feature Backlog',
        scenario: 'Your engineering team has 2 weeks of bandwidth. Review the 4 feature candidates and select the feature that should be prioritized FIRST in Sprint 1.',
        backlog: [
          { name: 'Feature A: AI Career Chatbot', impact: 'HIGH', effort: 'MEDIUM' },
          { name: 'Feature B: Footer Font Change', impact: 'LOW', effort: 'LOW' },
          { name: 'Feature C: 1-Click Express Payment', impact: 'HIGH', effort: 'LOW (Quick Win)' },
          { name: 'Feature D: Full Backend Rewrite', impact: 'LOW', effort: 'VERY HIGH' }
        ],
        options: [
          { id: 'o1', text: 'Feature C (1-Click Express Payment) — High User Impact with Low Effort represents a classic "Quick Win".', isCorrect: true, explanation: 'Perfect PM decision! High Impact / Low Effort items deliver maximum ROI and immediate customer value.' },
          { id: 'o2', text: 'Feature D (Full Backend Rewrite) because it takes the longest.', isCorrect: false, explanation: 'Incorrect. Very High effort with Low immediate user impact is a trap priority.' },
          { id: 'o3', text: 'Feature B (Footer Font Change) because it is easiest.', isCorrect: false, explanation: 'Incorrect. Low impact items should not take precedence over High impact value.' }
        ]
      },
      {
        id: 'pm_q2',
        title: 'Task 2: Balance Technical Debt vs New Features',
        scenario: 'Your product has a severe crash bug affecting 5% of iOS users during checkout, but stakeholders are demanding a new Social Sharing button for marketing.',
        options: [
          { id: 'o1', text: 'Prioritize fixing the checkout crash bug first. Platform stability and core funnel conversion take priority over secondary growth features.', isCorrect: true, explanation: 'Correct PM prioritization! A broken checkout funnel destroys user trust and revenue; fixing critical crashes takes precedence.' },
          { id: 'o2', text: 'Build the Social Sharing button first and ignore the crash.', isCorrect: false, explanation: 'Incorrect. Acquisition channels fail if the core checkout product crashes.' },
          { id: 'o3', text: 'Delay both features for 6 months.', isCorrect: false, explanation: 'Incorrect. Deleting roadmap items without evaluation stalls product progress.' }
        ]
      },
      {
        id: 'pm_q3',
        title: 'Task 3: Make Feature Deprecation Decision',
        scenario: 'Analytics show a legacy Export to XML feature costs $5,000/month in server maintenance but is used by only 0.1% of active users.',
        options: [
          { id: 'o1', text: 'Announce deprecation timeline to affected users, provide CSV export alternative, and sunset XML export to reduce maintenance overhead.', isCorrect: true, explanation: 'Spot on! Pruning low-usage, high-maintenance features frees up engineering bandwidth for core product value.' },
          { id: 'o2', text: 'Keep spending $5,000/month indefinitely without evaluation.', isCorrect: false, explanation: 'Incorrect. Wasting engineering budget on 0.1% usage drains startup resources.' },
          { id: 'o3', text: 'Turn off feature without any user communication.', isCorrect: false, explanation: 'Incorrect. Abrupt deprecation without alternatives breaks user trust.' }
        ]
      },
      {
        id: 'pm_q4',
        title: 'Task 4: Write Clear User Story Acceptance Criteria',
        scenario: 'You are drafting a user story for "Password Reset via Email". Which acceptance criteria specification is complete?',
        options: [
          { id: 'o1', text: 'Given a registered user clicks "Forgot Password", when they enter valid email, then a secure reset token link expiring in 15 mins is sent via email.', isCorrect: true, explanation: 'Perfect User Story formatting! Given-When-Then criteria ensures developers and QA testers understand exact functional boundaries.' },
          { id: 'o2', text: 'Make password reset work fast.', isCorrect: false, explanation: 'Incorrect. Vague requirements cause developer confusion and scope creep.' },
          { id: 'o3', text: 'User gets password reset.', isCorrect: false, explanation: 'Incorrect. Missing security constraints (token expiry, validation).' }
        ]
      },
      {
        id: 'pm_q5',
        title: 'Task 5: Define Freemium Feature Gating Strategy',
        scenario: 'You are designing the Free vs Pro tier boundaries for a SaaS analytics product to drive subscription upgrades.',
        options: [
          { id: 'o1', text: 'Include core reporting in Free Tier to build habit loop, and gate advanced Export, API Access, and Team Seats in Pro Tier.', isCorrect: true, explanation: 'Excellent monetization design! Providing core utility in Free builds adoption, while gating power-user workflow features drives conversion.' },
          { id: 'o2', text: 'Gate the login page so free users cannot access anything.', isCorrect: false, explanation: 'Incorrect. No free access prevents product trial and organic growth.' },
          { id: 'o3', text: 'Make all features 100% free with no monetization model.', isCorrect: false, explanation: 'Incorrect. Operating without revenue is unsustainable.' }
        ]
      },
      {
        id: 'pm_q6',
        title: 'Task 6: Manage Late Stakeholder Scope Creep',
        scenario: '2 days before a scheduled release, a VP asks to add 3 new complex fields to the registration modal.',
        options: [
          { id: 'o1', text: 'Protect current sprint release by logging stakeholder request in backlog for v1.1 evaluation after v1.0 ships.', isCorrect: true, explanation: 'Correct PM scope management! Protecting release schedules prevents last-minute regression bugs and team burnout.' },
          { id: 'o2', text: 'Force developers to work 48 hours nonstop to cram new fields into v1.0.', isCorrect: false, explanation: 'Incorrect. Last-minute crunch introduces severe code regressions.' },
          { id: 'o3', text: 'Cancel the entire product release permanently.', isCorrect: false, explanation: 'Incorrect. Overreacting to stakeholder feedback harms product shipping velocity.' }
        ]
      }
    ]
  };

  // Helper: Shuffle question options and randomly position the correct answer across A, B, C, D
  const shuffleAndFormatOptions = (question) => {
    if (!question || !question.options) return question;

    // Clone options array and perform Fisher-Yates shuffle
    const optionsCopy = question.options.map(o => ({ ...o }));
    for (let i = optionsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
    }

    const labels = ['A', 'B', 'C', 'D'];
    const relabeledOptions = optionsCopy.map((opt, idx) => ({
      ...opt,
      id: labels[idx] || opt.id || `o_${idx}`
    }));

    return {
      ...question,
      options: relabeledOptions
    };
  };

  const handleStartSimulation = async (careerId) => {
    setSelectedCareerId(careerId);
    setIsLoadingQuestions(true);
    setUserAnswers({});
    setShowExplanation(false);

    // Map career ID to skill category
    const catMap = {
      software_engineer: 'dsa',
      data_scientist: 'sql',
      ui_ux_designer: 'aptitude',
      cybersecurity_analyst: 'python',
      product_manager: 'aptitude'
    };
    const category = catMap[careerId] || 'dsa';
    const careerObj = CAREERS.find(c => c.id === careerId) || CAREERS[0];

    // Try fetching dynamic questions
    const aiGenerated = await generateAIQuestions({
      category,
      career: careerObj.name,
      roadmapWeek: 'Simulation Stage',
      weeklyTasks: ['Scenario Task 1', 'Scenario Task 2', 'Scenario Task 3'],
      difficulty: 'Easy',
      count: 3
    });

    let chosen3 = [];

    if (aiGenerated && aiGenerated.length >= 3) {
      chosen3 = aiGenerated.slice(0, 3).map((q, i) => ({
        id: q.id || `ai_sim_${i}_${Date.now()}`,
        title: `Task ${i + 1}: ${q.topic || 'Workplace Scenario'}`,
        scenario: q.question,
        codeSnippet: q.codeSnippet || '',
        options: q.options
      }));
    } else {
      // Fallback to local QUESTION_BANK if AI unavailable
      const pool = QUESTION_BANK[careerId] || QUESTION_BANK.software_engineer;
      // Exclude already seen questions if possible
      let available = pool.filter(q => !seenQuestionIds.includes(q.id));
      if (available.length < 3) {
        available = pool; // Reset if all were seen
      }
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      chosen3 = shuffled.slice(0, 3);
    }

    // Shuffle options for EVERY question to randomize correct answer placement
    const randomized3 = chosen3.map(q => shuffleAndFormatOptions(q));

    // Update seen question history
    const newIds = randomized3.map(q => q.id);
    setSeenQuestionIds(prev => [...prev, ...newIds]);

    setActiveQuestions(randomized3);
    setCurrentQuestionIdx(0);
    setIsLoadingQuestions(false);
    setSimulationState('active');
  };

  const handleOptionSelect = (option) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: option
    }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIdx < 2) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Completed all 3 tasks! Compute results
      computeFinalScore();
    }
  };

  const computeFinalScore = () => {
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      const chosen = userAnswers[idx];
      if (chosen && chosen.isCorrect) {
        correctCount += 1;
      }
    });

    const overallPct = correctCount === 3 ? 100 : correctCount === 2 ? 84 : correctCount === 1 ? 65 : 45;
    
    const summary = {
      correctCount,
      totalQuestions: 3,
      overallScore: overallPct,
      metrics: {
        problemSolving: correctCount === 3 ? 95 : correctCount === 2 ? 88 : 65,
        decisionMaking: correctCount === 3 ? 92 : correctCount === 2 ? 84 : 60,
        technicalThinking: correctCount === 3 ? 94 : correctCount === 2 ? 82 : 62,
        taskAccuracy: Math.round((correctCount / 3) * 100)
      },
      verdict: correctCount >= 2 
        ? 'You performed exceptionally well across these career tasks!' 
        : 'Good effort! Exploring these real workplace scenarios highlights areas for skill building.'
    };

    setResultSummary(summary);
    setSimulationState('results');

    if (correctCount >= 2) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }

    if (onCompleteSimulation) {
      onCompleteSimulation(selectedCareerId, overallPct);
    }
  };

  const activeQuestion = activeQuestions[currentQuestionIdx];
  const activeCareerObj = CAREERS.find(c => c.id === selectedCareerId);
  const currentSelectedOption = userAnswers[currentQuestionIdx];

  return (
    <div className="space-y-8 animate-fadeIn font-mono pb-12">
      
      {/* Header Banner */}
      <section className="glass-panel border-glow-purple p-6 md:p-8 rounded-2xl relative scanlines overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonPurple/40 bg-cyber-neonPurple/10 text-cyber-neonPurple text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} className="animate-pulse" />
              MINI CAREER EXPERIENCES
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Try Before You Commit
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              "Experience the work before you choose the career." Complete 3 interactive workplace scenario tasks dynamically chosen for each career.
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-xl border border-cyber-neonPurple/40 bg-cyber-dark/60 text-right shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase">SIMULATION REWARD</span>
            <span className="text-base font-extrabold text-cyber-neonPurple flex items-center justify-end gap-1">
              <Award size={16} /> +200 XP
            </span>
          </div>
        </div>
      </section>

      {/* STATE 1: CAREER SELECTION GRID */}
      {simulationState === 'select' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Select A Career Simulation (3 Scenarios Each)
            </h2>
            <span className="text-xs text-slate-400">Dynamic Scenario Bank (30 Tasks)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREERS.map(career => {
              const Icon = career.icon;
              return (
                <div
                  key={career.id}
                  className={`glass-panel p-6 rounded-2xl border ${career.color.split(' ')[0]} hover:scale-[1.02] transition-all flex flex-col justify-between space-y-5 relative scanlines group`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-xl ${career.color}`}>
                        <Icon size={24} />
                      </div>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${career.badgeColor}`}>
                        {career.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyber-neonPurple transition-colors">
                        {career.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {career.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyber-border/40 space-y-3">
                    <div className="text-[11px] text-slate-300 font-bold flex items-center gap-1">
                      <Terminal size={12} className="text-cyber-neonCyan" /> {career.taskTitle}
                    </div>

                    <button
                      onClick={() => handleStartSimulation(career.id)}
                      className="cyber-btn cyber-btn-purple w-full py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      START 3-TASK EXPERIENCE <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STATE 2: ACTIVE 3-QUESTION SIMULATION CHALLENGE */}
      {simulationState === 'active' && activeQuestion && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSimulationState('select')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-bold transition-all"
            >
              ← Change Career
            </button>

            <span className="text-xs font-bold text-cyber-neonCyan">
              Task {currentQuestionIdx + 1} of 3
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyber-neonPurple via-cyber-neonCyan to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / 3) * 100}%` }}
            ></div>
          </div>

          <div className="glass-panel border-glow-purple p-6 md:p-8 rounded-2xl space-y-6 relative scanlines">
            <div className="flex items-center gap-3 border-b border-cyber-border pb-4">
              <div className={`p-3 rounded-xl ${activeCareerObj.color}`}>
                <activeCareerObj.icon size={24} />
              </div>
              <div>
                <span className="text-[10px] text-cyber-neonPurple font-bold uppercase tracking-widest block">
                  TASK {currentQuestionIdx + 1} OF 3 • {activeCareerObj.name}
                </span>
                <h2 className="text-xl font-bold text-white">
                  {activeQuestion.title}
                </h2>
              </div>
            </div>

            {/* Scenario Prompt */}
            <div className="p-4 rounded-xl bg-cyber-dark/60 border border-cyber-border space-y-2">
              <span className="text-[10px] font-bold text-cyber-neonCyan block uppercase tracking-wider">
                Workplace Scenario
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeQuestion.scenario}
              </p>
            </div>

            {/* Code Snippet / Data Table / UX wireframes / Server Logs */}
            {activeQuestion.codeSnippet && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Inspect Code File:</span>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed">
                  <code>{activeQuestion.codeSnippet}</code>
                </pre>
              </div>
            )}

            {activeQuestion.dataTable && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Inspect Data Metrics Log:</span>
                <div className="overflow-x-auto border border-cyber-border rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-cyber-dark text-slate-300 border-b border-cyber-border">
                      <tr>
                        {Object.keys(activeQuestion.dataTable[0]).map((col, idx) => (
                          <th key={idx} className="p-2.5 uppercase">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-border/40 text-slate-300">
                      {activeQuestion.dataTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-cyber-dark/60">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-2.5">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeQuestion.uxDesigns && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeQuestion.uxDesigns.map((des, idx) => (
                  <div key={idx} className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-cyber-neonCyan block">{des.name}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{des.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeQuestion.logLines && (
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Inspect Log Event:</span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
                  {activeQuestion.logLines.map((line, idx) => (
                    <div key={idx} className={line.includes('Failed') ? 'text-rose-400 font-bold' : line.includes('PORT 22') ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeQuestion.backlog && (
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Inspect Backlog Matrix:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeQuestion.backlog.map((item, idx) => (
                    <div key={idx} className="p-3 border border-cyber-border bg-cyber-dark/40 rounded-lg text-xs space-y-1">
                      <span className="font-bold text-white block">{item.name}</span>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>User Impact: <strong className="text-cyber-neonCyan">{item.impact}</strong></span>
                        <span>Effort: <strong className="text-amber-400">{item.effort}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-white block uppercase tracking-wider">
                Select Your Action Response:
              </span>

              {activeQuestion.options.map((opt) => {
                const isSelected = currentSelectedOption?.id === opt.id;

                return (
                  <button
                    key={opt.id}
                    disabled={showExplanation}
                    onClick={() => handleOptionSelect(opt)}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-mono leading-relaxed cursor-pointer ${
                      isSelected 
                        ? opt.isCorrect 
                          ? 'border-emerald-500 bg-emerald-500/15 text-white font-bold' 
                          : 'border-rose-500 bg-rose-500/15 text-white font-bold'
                        : 'border-cyber-border bg-cyber-dark/30 hover:border-cyber-neonPurple hover:bg-cyber-neonPurple/10 text-slate-200'
                    }`}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation Feedback Box */}
            {showExplanation && currentSelectedOption && (
              <div className={`p-4 rounded-xl border space-y-3 animate-fadeIn ${currentSelectedOption.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/10 border-rose-500/40 text-rose-300'}`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  {currentSelectedOption.isCorrect ? (
                    <><CheckCircle2 size={16} /> Correct Action Selected!</>
                  ) : (
                    <><XCircle size={16} /> Action Feedback:</>
                  )}
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-mono">
                  {currentSelectedOption.explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="cyber-btn cyber-btn-purple px-6 py-2.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-lg cursor-pointer"
                  >
                    {currentQuestionIdx < 2 ? (
                      <>NEXT TASK ({currentQuestionIdx + 2}/3) <ChevronRight size={14} /></>
                    ) : (
                      <>VIEW SIMULATION RESULTS <ArrowRight size={14} /></>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* STATE 3: EXPERIENCE RESULTS REPORT (AFTER 3 QUESTIONS) */}
      {simulationState === 'results' && resultSummary && (
        <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
          
          <div className="glass-panel border-glow-purple p-6 md:p-8 rounded-2xl space-y-6 scanlines text-center">
            
            <div className="inline-flex p-4 rounded-full bg-cyber-neonPurple/15 border border-cyber-neonPurple text-cyber-neonPurple animate-bounce">
              <Award size={40} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-cyber-neonPurple uppercase tracking-widest">
                CAREER EXPERIENCE SCORE ({resultSummary.correctCount}/3 Tasks Correct)
              </span>
              <h2 className="text-4xl font-extrabold text-white">
                {resultSummary.overallScore}%
              </h2>
              <p className="text-sm font-bold text-cyber-neonCyan max-w-md mx-auto">
                "{resultSummary.verdict}"
              </p>
            </div>

            {/* Experience Metric Breakdown */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block text-left">
                Your 3-Task Performance Breakdown
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 border border-cyber-border bg-cyber-dark/40 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block">Problem Solving</span>
                  <span className="text-lg font-bold text-cyber-neonPurple">{resultSummary.metrics.problemSolving}%</span>
                </div>

                <div className="p-3 border border-cyber-border bg-cyber-dark/40 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block">Decision Making</span>
                  <span className="text-lg font-bold text-cyber-neonCyan">{resultSummary.metrics.decisionMaking}%</span>
                </div>

                <div className="p-3 border border-cyber-border bg-cyber-dark/40 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block">Tech Thinking</span>
                  <span className="text-lg font-bold text-amber-400">{resultSummary.metrics.technicalThinking}%</span>
                </div>

                <div className="p-3 border border-cyber-border bg-cyber-dark/40 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase block">Task Accuracy</span>
                  <span className="text-lg font-bold text-emerald-400">{resultSummary.metrics.taskAccuracy}%</span>
                </div>
              </div>
            </div>

            {/* "What You Experienced" Section */}
            <div className="p-5 border border-cyber-neonPurple/40 bg-cyber-neonPurple/10 rounded-xl text-left space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-cyber-neonPurple" />
                What You Experienced In Real Life
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You evaluated 3 authentic workplace scenarios for {activeCareerObj.name}. In daily industry roles, professionals balance speed, logic accuracy, and edge-case prevention to solve operational problems.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleStartSimulation(selectedCareerId)}
                className="flex-1 py-3 px-4 border border-cyber-border bg-cyber-dark/60 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} /> RETAKE (NEW 3 TASKS)
              </button>

              <button
                onClick={() => setTab('progress')}
                className="flex-1 cyber-btn cyber-btn-purple py-3 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                VIEW CAREER PROGRESS →
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
