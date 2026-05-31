import React from 'react';
import { Activity, PlusCircle, Sun, Moon } from 'lucide-react';
import type { ActiveTab, ThemeClasses } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  activeTab: ActiveTab;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddModal: () => void;
  theme: ThemeClasses;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Header: React.FC<HeaderProps> = ({
  activeTab,
  darkMode,
  onToggleDarkMode,
  onOpenAddModal,
  theme,
}) => {
  return (
    <header
      className={`border p-4 rounded-2xl flex justify-between items-center shadow-sm ${theme.cardThemeBg}`}
    >
      {/* Status Indicator */}
      <h2 className="text-sm font-bold font-mono opacity-80 uppercase flex items-center gap-2">
        <Activity className="w-4 h-4 text-[#107C41]" />
        Node Status Array:{' '}
        <span className="text-[#107C41]">{activeTab.toUpperCase()}</span>
      </h2>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Dark / Light Toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`p-2.5 rounded-xl border transition-all ${theme.secondaryBg} border-gray-300/20`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#5F6675]" />
          )}
        </button>

        {/* Register New Shipment CTA */}
        <button
          id="btn-register-shipment"
          onClick={onOpenAddModal}
          className="bg-[#107C41] hover:bg-[#149B52] text-white text-xs font-bold font-mono uppercase px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Register New Shipment
        </button>
      </div>
    </header>
  );
};

export default Header;
