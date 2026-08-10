import React, { useState } from 'react';
import { User, Settings, Sun, Moon, RefreshCw, X, ShieldCheck, Edit3, Compass, LogOut, Key, CheckCircle2, Mail, Lock } from 'lucide-react';

export default function AccountModal({ profile, theme, toggleTheme, onClose, onEditProfile, onRetakeAssessment, onLogout, onChangePassword }) {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passStatus, setPassStatus] = useState({ type: '', message: '' });

  const userInitials = profile.fullName 
    ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : 'ST';

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPassStatus({ type: '', message: '' });

    if (!newPass || newPass.length < 4) {
      setPassStatus({ type: 'error', message: 'New password must be at least 4 characters long.' });
      return;
    }

    if (newPass !== confirmNewPass) {
      setPassStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    const success = onChangePassword(currentPass, newPass);
    if (success) {
      setPassStatus({ type: 'success', message: 'Password updated successfully!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      setTimeout(() => setShowPasswordChange(false), 1500);
    } else {
      setPassStatus({ type: 'error', message: 'Current password is incorrect.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel border-glow-purple max-w-lg w-full p-6 rounded-2xl relative font-mono space-y-6 animate-fadeIn scanlines">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-cyber-border pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-cyber-neonPurple/15 text-cyber-neonPurple">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Student Account & Privacy</h3>
              <span className="text-[10px] text-slate-400">Password-protected student session</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-cyber-border hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Card Section */}
        <div className="p-4 border border-cyber-border bg-cyber-dark/40 rounded-xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-cyber-neonPurple bg-gradient-to-tr from-cyber-neonPurple to-cyber-neonCyan flex items-center justify-center font-extrabold text-white text-lg shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              {userInitials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white truncate">
                  {profile.fullName || 'Student Account'}
                </h4>
                <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0 font-bold">
                  <ShieldCheck size={10} /> PROTECTED
                </span>
              </div>

              <p className="text-xs text-cyber-neonCyan flex items-center gap-1 mt-0.5 truncate font-bold">
                <Mail size={12} /> {profile.email || 'No email registered'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {profile.academic?.qualification || 'College Student'} • {profile.academic?.stream || 'Computer Science'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyber-border/40">
            <button
              onClick={() => {
                onClose();
                onEditProfile();
              }}
              className="px-3 py-2 border border-cyber-border rounded-lg text-xs font-bold text-slate-300 hover:border-cyber-neonPurple hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Edit3 size={13} /> Edit Account
            </button>

            <button
              onClick={() => {
                onClose();
                onRetakeAssessment();
              }}
              className="px-3 py-2 border border-cyber-border bg-cyber-neonPurple/15 text-cyber-neonPurple border-cyber-neonPurple/30 rounded-lg text-xs font-bold hover:bg-cyber-neonPurple/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Compass size={13} /> Retake Test
            </button>
          </div>
        </div>

        {/* Change Password Collapsible Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Account Security</span>
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-xs text-cyber-neonPurple hover:underline font-bold flex items-center gap-1"
            >
              <Key size={13} /> {showPasswordChange ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordChange && (
            <form onSubmit={handleChangePasswordSubmit} className="p-4 border border-cyber-neonPurple/30 bg-cyber-neonPurple/5 rounded-xl space-y-3 animate-fadeIn">
              {passStatus.message && (
                <div className={`p-2 rounded text-xs font-bold text-center ${passStatus.type === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                  {passStatus.message}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 block uppercase">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cyber-dark border border-cyber-border rounded px-3 py-1.5 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block uppercase">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-cyber-dark border border-cyber-border rounded px-3 py-1.5 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 block uppercase">Confirm New</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-cyber-dark border border-cyber-border rounded px-3 py-1.5 text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cyber-btn cyber-btn-purple w-full py-2 rounded text-xs font-bold text-white mt-1"
              >
                UPDATE PASSWORD
              </button>
            </form>
          )}
        </div>

        {/* Display Settings */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Display Settings</span>

          <div className="p-3.5 border border-cyber-border rounded-xl bg-cyber-dark/40 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-white block">Theme Mode</span>
              <span className="text-[10px] text-slate-400">Switch between dark space & light modes</span>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyber-border bg-cyber-dark/60 text-xs font-bold text-white hover:border-cyber-neonPurple transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <Moon size={14} className="text-cyber-neonPurple" />
                  <span>🌙 Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun size={14} className="text-amber-500" />
                  <span>☀️ Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer: Log Out */}
        <div className="pt-3 border-t border-cyber-border flex gap-3">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={14} /> LOG OUT
          </button>
        </div>

      </div>
    </div>
  );
}
