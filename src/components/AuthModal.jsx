import React, { useState } from 'react';
import { Lock, Mail, User, Key, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ onLogin, onRegister, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [qualification, setQualification] = useState('2nd Year College');
  const [stream, setStream] = useState('Computer Science');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please check and try again.');
        return;
      }

      const registerSuccess = onRegister({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        academic: { qualification, stream, gpa: '8.0' }
      });

      if (!registerSuccess) {
        setErrorMsg('An account with this email already exists. Please sign in instead.');
      }
    } else {
      const loginSuccess = onLogin(email.trim().toLowerCase(), password);
      if (!loginSuccess) {
        setErrorMsg('Incorrect email or password. Please check your credentials.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel border-glow-purple max-w-md w-full p-6 sm:p-8 rounded-2xl relative font-mono space-y-6 animate-fadeIn scanlines">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full border-2 border-cyber-neonPurple bg-cyber-neonPurple/15 text-cyber-neonPurple flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Lock size={22} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {mode === 'login' ? 'STUDENT SIGN IN' : 'CREATE PRIVATE ACCOUNT'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' ? 'Enter your credentials to access your private career data.' : 'Set up a password-protected account to secure your data.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-cyber-dark/60 border border-cyber-border rounded-xl">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-cyber-neonPurple text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-cyber-neonPurple text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-3 border border-rose-500/40 bg-rose-500/10 rounded-xl text-rose-400 text-xs font-bold text-center animate-fadeIn">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block uppercase">Full Name *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Nova Kumar"
                  className="w-full bg-cyber-dark border border-cyber-border rounded-xl pl-9 pr-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyber-neonPurple"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 block uppercase">Email Address *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., nova@example.com"
                className="w-full bg-cyber-dark border border-cyber-border rounded-xl pl-9 pr-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyber-neonPurple"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 block uppercase">Password *</label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cyber-dark border border-cyber-border rounded-xl pl-9 pr-10 py-2.5 text-white text-xs focus:outline-none focus:border-cyber-neonPurple"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 block uppercase">Confirm Password *</label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-cyber-dark border border-cyber-border rounded-xl pl-9 pr-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyber-neonPurple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Current Class / Year</label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-2.5 py-2 text-white text-xs"
                  >
                    <option>Class 12</option>
                    <option>1st Year College</option>
                    <option>2nd Year College</option>
                    <option>3rd Year College</option>
                    <option>4th Year College</option>
                    <option>Graduate</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Stream / Branch</label>
                  <input
                    type="text"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-2.5 py-2 text-white text-xs"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="cyber-btn cyber-btn-purple w-full py-3 rounded-xl text-xs font-bold text-white tracking-wider flex items-center justify-center gap-2 mt-4"
          >
            {mode === 'login' ? 'SIGN IN TO DASHBOARD' : 'CREATE PROTECTED ACCOUNT'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Privacy Guarantee Badge */}
        <div className="p-3 border border-cyber-border bg-cyber-dark/40 rounded-xl flex items-center gap-2.5 text-[10px] text-slate-400">
          <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
          <span>Your password and career data are encrypted and stored privately on your local browser.</span>
        </div>

      </div>
    </div>
  );
}
