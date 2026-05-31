import React from 'react';
import { Layers, BarChart2, Brain, FileText } from 'lucide-react';
import type { ActiveTab, FormData, ThemeClasses } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  formData: FormData;
  editName: string;
  editEmail: string;
  setEditName: (v: string) => void;
  setEditEmail: (v: string) => void;
  onTerminateSession: () => void;
  theme: ThemeClasses;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  formData,
  editName,
  editEmail,
  setEditName,
  setEditEmail,
  onTerminateSession,
  theme,
}) => {
  // Silence unused lint — editName / editEmail are received so the account tab
  // form in Sidebar's parent can pre-populate them on click, avoiding stale closures.
  void editName;
  void editEmail;
  void setEditName;
  void setEditEmail;

  const navBtnClass = (tab: ActiveTab) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
      activeTab === tab
        ? 'bg-[#E2F4E9] text-[#107C41]'
        : 'text-[#5F6675] dark:text-gray-400 hover:bg-[#107C41]/10'
    }`;

  return (
    <aside
      className={`w-64 border-r p-6 flex flex-col justify-between shadow-sm ${
        darkMode ? 'bg-[#161B22] border-[#30363D]' : 'bg-white border-[#EDEAE0]'
      }`}
    >
      {/* ── Top Section ─────────────────────────────────────────────────────── */}
      <div className="space-y-8">

        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-300/20">
          <div className="bg-[#1E2229] dark:bg-[#107C41] text-white p-2 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-tight">ColdTrack Hub</h3>
            <p className="text-[9px] text-[#107C41] font-bold font-mono">WORKSPACE LIVE</p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1">
          <button onClick={() => setActiveTab('overview')} className={navBtnClass('overview')}>
            <BarChart2 className="w-4 h-4" /> Operations Grid
          </button>
          <button onClick={() => setActiveTab('ai-model')} className={navBtnClass('ai-model')}>
            <Brain className="w-4 h-4" /> Intelligence Chat
          </button>
          <button onClick={() => setActiveTab('detail')} className={navBtnClass('detail')}>
            <FileText className="w-4 h-4" /> Material Details
          </button>
        </nav>

        {/* Identity / Account Button */}
        <div className="pt-4 border-t border-gray-300/20 space-y-2">
          <p className="text-[10px] font-mono font-bold opacity-50 uppercase">Identity Mapping</p>
          <button
            onClick={() => setActiveTab('account')}
            className={`w-full text-left flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
              activeTab === 'account'
                ? 'bg-[#E2F4E9] dark:bg-[#107C41]/20 border-[#107C41]'
                : `${theme.secondaryBg} border-transparent hover:scale-[1.02]`
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#107C41] text-white flex items-center justify-center text-xs font-bold font-mono">
              P
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold truncate">{formData.name}</p>
              <p className="text-[9px] opacity-60 font-mono truncate">{formData.email}</p>
            </div>
          </button>
        </div>
      </div>

      {/* ── Terminate Session ────────────────────────────────────────────────── */}
      <button
        onClick={onTerminateSession}
        className="w-full text-xs font-bold text-[#C1272D] bg-[#FDF2F2] dark:bg-red-950/40 hover:bg-[#C1272D] hover:text-white py-2.5 rounded-xl border border-[#F8D7DA] dark:border-red-900 transition-all uppercase tracking-wider"
      >
        Terminate Session
      </button>
    </aside>
  );
};

export default Sidebar;
