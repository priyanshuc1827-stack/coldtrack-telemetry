import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, EyeOff, Eye } from 'lucide-react';
import type { ThemeClasses } from '../types';

interface AuthViewProps {
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  darkMode: boolean;
  theme: ThemeClasses;
  passwordError: string;
  setPasswordError: (err: string) => void;
  handleAuthSubmit: (e: React.FormEvent) => void;
  editName: string;
  setEditName: (val: string) => void;
  editEmail: string;
  setEditEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  checks: { length: boolean; upper: boolean; lower: boolean; number: boolean; special: boolean; };
  setCurrentRoute: (route: 'landing' | 'auth' | 'dashboard') => void;
}

export default function AuthView({
  authMode, setAuthMode, darkMode, theme, passwordError, setPasswordError,
  handleAuthSubmit, editName, setEditName, editEmail, setEditEmail,
  password, setPassword, showPassword, setShowPassword, checks, setCurrentRoute
}: AuthViewProps) {
  
  const isPasswordValid = Object.values(checks).every(Boolean);

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 relative overflow-hidden transition-colors ${darkMode ? 'bg-[#0A0B0E]' : 'bg-[#F4F5F7]'}`}>
      
      {/* Blueprint Grid Mesh Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 40H0V0h40v40zM1 39h38V1H1v38z' fill='%23107C41' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 pointer-events-none ${darkMode ? 'bg-[#107C41]' : 'bg-[#107C41]/60'}`} />
      </div>

      <header className="max-w-4xl w-full mx-auto flex justify-between items-center py-2 relative z-10">
        <button
          type="button"
          onClick={() => { setCurrentRoute('landing'); setPassword(''); setPasswordError(''); }}
          className={`text-xs font-semibold flex items-center gap-1.5 transition-opacity ${darkMode ? 'text-white' : 'text-gray-800 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to homepage
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-[#107C41] text-white p-1.5 rounded-lg shadow-md">
            <Shield className="w-4 h-4" />
          </div>
          <span className={`font-bold text-sm tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>ColdTrack</span>
        </div>
      </header>

      <div className="w-full max-w-md mx-auto my-auto pt-4 pb-12 relative z-10">
        <div className={`p-8 rounded-2xl border transition-all duration-300 ${theme.cardThemeBg}`}>
          <div className="space-y-1 mb-6 text-left">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {authMode === 'signin' ? 'Log in' : 'Sign up'}
            </h2>
          </div>

          {passwordError && (
            <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-sans">
            {authMode === 'signup' && (
              <div className="space-y-1.5">
                <label className={`block text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-normal transition-all outline-none text-sm ${theme.inputThemeBg}`}
                  placeholder="USERNAME"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className={`block text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-normal transition-all outline-none text-sm ${theme.inputThemeBg}`}
                placeholder="Email"
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className={`block text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border font-normal transition-all outline-none text-sm ${theme.inputThemeBg}`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-3.5 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 text-[11px] font-mono ${darkMode ? 'bg-[#0F1013]/90 border-gray-800' : 'bg-[#F9FAFB]/90 border-[#EDEFF1]'}`}>
              <p className={`font-bold uppercase tracking-wider text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Password Parameters Check:</p>
              <div className={`grid grid-cols-2 gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-700 font-medium'}`}>
                <div className={`flex items-center gap-1.5 ${checks.length ? 'text-emerald-600 font-bold' : 'opacity-40'}`}>
                  <span>{checks.length ? "●" : "○"}</span> 8+ Glyphs
                </div>
                <div className={`flex items-center gap-1.5 ${checks.upper ? 'text-emerald-600 font-bold' : 'opacity-40'}`}>
                  <span>{checks.upper ? "●" : "○"}</span> ABC Uppercase
                </div>
                <div className={`flex items-center gap-1.5 ${checks.lower ? 'text-emerald-600 font-bold' : 'opacity-40'}`}>
                  <span>{checks.lower ? "●" : "○"}</span> abc Lowercase
                </div>
                <div className={`flex items-center gap-1.5 ${checks.number ? 'text-emerald-600 font-bold' : 'opacity-40'}`}>
                  <span>{checks.number ? "●" : "○"}</span> 123 Numeric
                </div>
                <div className={`flex items-center gap-1.5 col-span-2 ${checks.special ? 'text-emerald-600 font-bold' : 'opacity-40'}`}>
                  <span>{checks.special ? "●" : "○"}</span> Symbol Key (!@#$)
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isPasswordValid}
              className="w-full bg-[#107C41] hover:bg-[#0D6334] disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-800 disabled:opacity-50 text-white py-3 rounded-xl font-bold tracking-wide text-sm shadow-sm transition-all text-center block"
            >
              {authMode === 'signin' ? 'Verify & Log In' : 'Register Account'}
            </button>
          </form>

          <div className="text-center pt-5 border-t border-gray-100 dark:border-gray-800 mt-5">
            <button
              type="button"
              onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setPassword(''); setPasswordError(''); }}
              className="text-xs font-bold text-[#107C41] hover:underline"
            >
              {authMode === 'signin' ? "Don't have an account yet? Register" : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>

      <footer className="max-w-4xl w-full mx-auto text-center text-[10px] text-gray-400 relative z-10 py-2">
        <span>Secure TLS Handshake Node Active</span>
      </footer>
    </div>
  );
}