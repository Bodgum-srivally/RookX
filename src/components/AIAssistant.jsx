import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ShieldAlert, Cpu, Sparkles, HelpCircle } from 'lucide-react';
import { CAREER_LIST, MYTH_BUSTERS } from '../data/careerData';

export default function AIAssistant({ profile, assessment, targetCareerId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [useLiveApi, setUseLiveApi] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am RookX Core, your explainable career mentor. Ask me to explain your compatibility scores, explain skill gaps, or bust career myths!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveKey = (val) => {
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');
    setLoading(true);

    if (useLiveApi && apiKey) {
      // Call live Gemini API if the user configured it
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are RookX, an explainable career mentor. The student is currently studying/working: ${JSON.stringify(profile.academic)}. Their skill levels are: ${JSON.stringify(profile.skills)}. Their target career is: ${targetCareerId}. Answer this question: "${userMsg}"`
              }]
            }]
          })
        });
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to retrieve a response. Please double-check your API key.";
        setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
      } catch (err) {
        setMessages(prev => [...prev, { sender: 'ai', text: "Error connecting to Gemini API. Reverting to local simulator." }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Local High-Fidelity Simulator Response
    setTimeout(() => {
      const q = userMsg.toLowerCase();
      let reply = "";

      const activeCareer = CAREER_LIST.find(c => c.id === targetCareerId) || CAREER_LIST[0];

      if (q.includes('myth') || q.includes('buster') || q.includes('false')) {
        const randomMyth = MYTH_BUSTERS[Math.floor(Math.random() * MYTH_BUSTERS.length)];
        reply = `🔍 **Career Myth Buster:**\n\n**Myth:** "${randomMyth.myth}"\n\n**Reality:** ${randomMyth.reality}`;
      } 
      else if (q.includes('gap') || q.includes('missing') || q.includes('weak')) {
        reply = `⚙️ **Analyzing Gaps for ${activeCareer.name}:**\n\nBased on your profile, your primary gap lies in technical benchmarks. For example, your target is ${activeCareer.requiredSkills[0]?.name} (${activeCareer.requiredSkills[0]?.level}%) while your current assessment is lower. I suggest starting with Week 1 of your personalized roadmap to close this!`;
      } 
      else if (q.includes('why') || q.includes('explain') || q.includes('compatibility') || q.includes('score')) {
        reply = `📊 **Scoring Explained:**\n\nYour compatibility is calculated using weighted metrics:
- Academic Alignment: Matched with ${profile.academic?.stream}
- Diagnostic Scenarios: Extracted interest factors
- Direct Skills: Blended profile and assessment ratings.
To increase your score, focus on increasing your Coding or SQL proficiency through the action roadmap.`;
      } 
      else if (q.includes('product') || q.includes('manager') || q.includes('pm')) {
        reply = `💼 **Product Manager Insights:**\n\nProduct Managers coordinate engineering and visual designers. If you choose this path, prioritize developing:
1. Communication & public presenting (35% weight)
2. Strategic roadmaps & user story drafting (25% weight)
3. SQL metrics interpretation (15% weight)`;
      }
      else if (q.includes('software') || q.includes('engineer') || q.includes('code')) {
        reply = `💻 **Software Engineer Insights:**\n\nSoftware Engineers build and deploy applications. Key requirements:
- Programming (40% weight)
- Problem Solving (20% weight)
- SQL database foundations (10% weight)`;
      }
      else if (q.includes('data') || q.includes('science') || q.includes('analyst')) {
        reply = `📊 **Data Science Insights:**\n\nData Scientists analyze statistics. Key requirements:
- SQL querying (30% weight)
- Statistics (25% weight)
- Python data scripts (15% weight)`;
      }
      else {
        reply = `🤖 **RookX Core:**\n\nThanks for asking! I've analyzed your profile and suggest:
1. Check the **Reality Check** tab to compare skill bars.
2. Review matched **Colleges & Scholarships** to check admission deadlines.
3. Type "myth" to read a career myth, or paste your CV in the **Resume Analyzer** for custom feedback.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-5 right-5 z-50 p-4 rounded-full cyber-btn-purple text-white shadow-2xl animate-float flex items-center gap-2 border border-cyber-neonPurple/50"
      >
        <MessageSquare size={20} />
        <span className="text-xs font-mono font-bold tracking-wider hidden md:inline">ASK ROOKX</span>
      </button>

      {/* Chat Portal Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-80 md:w-96 h-[500px] glass-panel border-glow-purple rounded-xl shadow-2xl flex flex-col justify-between overflow-hidden scanlines animate-fadeIn">
          
          {/* Header */}
          <div className="p-3 border-b border-cyber-border bg-cyber-dark/80 flex justify-between items-center font-mono">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyber-neonPurple animate-pulse" />
              <span className="text-xs font-bold text-white uppercase">ROOKX CAREER MENTOR</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Settings panel inside Chat */}
          <div className="px-3 py-1.5 bg-cyber-dark/40 border-b border-cyber-border flex justify-between items-center text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <input 
                type="checkbox" 
                checked={useLiveApi}
                onChange={(e) => setUseLiveApi(e.target.checked)}
                className="rounded accent-cyber-neonPurple"
              />
              <span>Use Gemini API</span>
            </div>
            {useLiveApi && (
              <input 
                type="password"
                placeholder="Paste API Key..."
                value={apiKey}
                onChange={(e) => handleSaveKey(e.target.value)}
                className="bg-black/50 border border-cyber-border rounded px-1 text-[9px] w-28 text-white focus:outline-none focus:border-cyber-neonPurple"
              />
            )}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`
                  flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}
                `}
              >
                <div 
                  className={`
                    p-3 rounded-lg text-xs leading-relaxed max-w-[85%] font-mono
                    ${msg.sender === 'user' 
                      ? 'bg-cyber-neonPurple/20 border border-cyber-neonPurple/40 text-white rounded-br-none' 
                      : 'bg-cyber-dark/80 border border-cyber-border text-slate-200 rounded-bl-none'}
                  `}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-cyber-dark/80 border border-cyber-border text-xs text-cyber-neonPurple font-mono animate-pulse">
                  Analyzing queries...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="p-3 border-t border-cyber-border bg-cyber-dark/80 flex gap-2">
            <input
              type="text"
              placeholder="Ask: 'explain my score' or 'myth'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-cyber-dark border border-cyber-border rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-neonPurple"
            />
            <button 
              type="submit"
              className="p-2.5 rounded cyber-btn-purple text-white border border-cyber-neonPurple/40 shrink-0"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
