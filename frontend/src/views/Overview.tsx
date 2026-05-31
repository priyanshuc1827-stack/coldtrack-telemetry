import React, { useState } from 'react';
import {
  Truck, CheckCircle, AlertTriangle, ChevronRight, Radio, RefreshCw, Activity, ShieldCheck, Cpu
} from 'lucide-react';

interface Shipment {
  id: string;
  item: string;
  partner: string;
  temp: number;
  target: string;
  route: string;
  status: string;
  ETA: string;
  risk: string;
  origin: string;
  destination: string;
  volume: string;
}

interface ThemeClasses {
  cardThemeBg: string;
  inputThemeBg: string;
  secondaryBg: string;
}

interface OverviewProps {
  shipments: Shipment[];
  selectedId: string;
  setSelectedId: (id: string) => void;
  simValue: string;
  setSimValue: (val: string) => void;
  isUpdating: boolean;
  onTelemetrySubmit: (e: React.FormEvent) => void;
  onDrillDown: (id: string, temp: number) => void;
  darkMode: boolean;
  theme: ThemeClasses;
}

interface LogEntry {
  time: string;
  type: 'INFO' | 'SECURE' | 'WARN' | 'EXEC';
  module: string;
  message: string;
}

export default function Overview({
  shipments,
  selectedId,
  setSelectedId,
  simValue,
  setSimValue,
  isUpdating,
  onTelemetrySubmit,
  onDrillDown,
  darkMode,
  theme,
}: OverviewProps) {

  // Upgraded log structure using explicit metadata components instead of raw strings
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: new Date().toLocaleTimeString(), type: 'INFO', module: 'SYS_INIT', message: 'Cold-Chain ERP cluster linked to LDRP-ITR edge gateway network.' },
    { time: new Date().toLocaleTimeString(), type: 'SECURE', module: 'AUTH_MATRIX', message: 'Session handshake active for Operator: Priyanshu Chaudhari.' },
    { time: new Date().toLocaleTimeString(), type: 'INFO', module: 'DATA_SYNC', message: 'Telemetry pipelines parsing active fleet asset configurations.' }
  ]);

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTelemetrySubmit(e);

    const targetShipment = shipments.find(s => s.id === selectedId);
    const timestamp = new Date().toLocaleTimeString();

    const newLog: LogEntry = {
      time: timestamp,
      type: 'EXEC',
      module: 'TELEMETRY',
      message: `Override signature forced payload ${selectedId} (${targetShipment?.item || 'Cargo'}) to ${simValue}°C.`
    };

    setLogs(prev => [newLog, ...prev]);
  };

  // Helper helper to return beautiful clean indicator colors for log categories
  const getBadgeStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'SECURE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'WARN': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'EXEC': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">

      {/* 📊 Strategic Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`border p-5 rounded-2xl shadow-sm transition-all ${theme.cardThemeBg}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] font-mono font-bold opacity-60 uppercase">Monitored Fleet Channels</p>
              <h3 className="text-3xl font-extrabold mt-1">{shipments.length} <span className="text-xs font-normal opacity-60">Batches</span></h3>
            </div>
            <div className={`p-3 rounded-xl ${theme.secondaryBg}`}><Truck className="w-5 h-5 text-[#107C41]" /></div>
          </div>
        </div>

        <div className={`border p-5 rounded-2xl shadow-sm transition-all ${theme.cardThemeBg}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] font-mono font-bold opacity-60 uppercase">Ecosystem Safety Index</p>
              <h3 className="text-3xl font-extrabold text-[#107C41] mt-1">100% <span className="text-xs font-normal opacity-60">Compliant</span></h3>
            </div>
            <div className="p-3 rounded-xl bg-[#E2F4E9] text-[#107C41]"><CheckCircle className="w-5 h-5" /></div>
          </div>
        </div>

        <div className={`border p-5 rounded-2xl shadow-sm transition-all ${theme.cardThemeBg}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] font-mono font-bold opacity-60 uppercase">Thermal Boundary Anomalies</p>
              <h3 className="text-3xl font-extrabold text-[#C1272D] mt-1">
                {shipments.filter(s => s.status === 'Breached').length} <span className="text-xs font-normal opacity-60">Alerts</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#FDF2F2] text-[#C1272D]"><AlertTriangle className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      {/* Main UI Sub-Layout Workspace Split */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">

        {/* Fleet Logs Table Manifest */}
        <div className={`border rounded-2xl shadow-sm overflow-hidden lg:col-span-2 ${theme.cardThemeBg}`}>
          <div className={`p-4 border-b flex justify-between items-center ${theme.secondaryBg} border-gray-300/10`}>
            <h4 className="text-xs font-bold font-mono uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#107C41]" /> Logistics Stream Pipeline
            </h4>
            <span className="text-[10px] font-mono opacity-50 hidden sm:inline">Click cargo name for deep diagnostics view</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className={`text-[10px] font-mono font-bold opacity-70 border-b uppercase ${theme.secondaryBg} border-gray-300/10`}>
                  <th className="p-4">Cargo ID</th>
                  <th className="p-4">Material Vector</th>
                  <th className="p-4 text-center">Live Status</th>
                  <th className="p-4 text-right">Targeting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300/10">
                {shipments.map((s) => (
                  <tr key={s.id} className={`transition-colors ${selectedId === s.id ? 'bg-[#107C41]/5' : 'hover:bg-gray-500/5'}`}>
                    <td className="p-4 font-mono font-bold text-[#107C41]">{s.id}</td>

                    <td
                      onClick={() => onDrillDown(s.id, s.temp)}
                      className="p-4 cursor-pointer group"
                    >
                      <p className="font-bold group-hover:text-[#107C41] group-hover:underline flex items-center gap-1">
                        {s.item} <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-xs opacity-60 font-mono">{s.partner}</p>
                    </td>

                    <td className="p-4 text-center">
                      <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-md ${s.status === 'Stable' ? 'bg-[#E2F4E9] text-[#107C41]' : 'bg-[#FDF2F2] text-[#C1272D]'}`}>
                        {s.temp}°C
                      </span>
                      <p className="text-[9px] opacity-40 font-mono mt-1">Bounds: {s.target}</p>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => { setSelectedId(s.id); setSimValue(s.temp.toString()); }}
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${selectedId === s.id ? 'bg-[#1E2229] dark:bg-[#107C41] text-white' : 'bg-transparent border-gray-300/20'}`}
                      >
                        {selectedId === s.id ? 'Targeted' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Override Calibration Telemetry Input Form Deck */}
        <div className={`border p-5 rounded-2xl shadow-sm space-y-4 ${theme.cardThemeBg}`}>
          <div className="border-b pb-2 border-gray-300/20 flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#107C41]" />
            <h4 className="text-xs font-bold font-mono uppercase">Telemetry Injector Deck</h4>
          </div>
          <form onSubmit={handleLocalSubmit} className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="font-bold opacity-60 uppercase text-[10px]">Active Node Carrier</label>
              <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); const matched = shipments.find(s => s.id === e.target.value); if (matched) setSimValue(matched.temp.toString()); }} className={`w-full px-3 py-2 rounded-xl focus:outline-none ${theme.inputThemeBg}`}>
                {shipments.map(s => <option key={s.id} value={s.id}>{s.id} — {s.item}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold opacity-60 uppercase text-[10px]">Override Value (°C)</label>
              <input type="number" step="0.1" required value={simValue} onChange={(e) => setSimValue(e.target.value)} className={`w-full px-3 py-2 rounded-xl focus:outline-none ${theme.inputThemeBg}`} />
            </div>
            <button type="submit" disabled={isUpdating} className="w-full bg-[#1E2229] dark:bg-[#107C41] text-white py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95">
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} /> Inject Metric Vector
            </button>
          </form>
        </div>
      </div>

      {/* ── 🚀 UPGRADED MODULE: MODERN ENTERPRISE AUDIT TRAIL LEDGER ── */}
      <div className={`border p-4 rounded-2xl shadow-sm space-y-3 ${theme.cardThemeBg}`}>
        <div className="flex justify-between items-center border-b pb-2 border-gray-300/10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 opacity-80">
            <Cpu className="w-4 h-4 text-[#107C41]" /> Platform System Telemetry Logs
          </span>
          <span className="text-[10px] font-mono opacity-40 bg-gray-500/10 px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#107C41]" /> Subsystem Synced
          </span>
        </div>

        {/* Modern Tabular Ledger Layout Frame */}
        <div className={`rounded-xl h-36 overflow-y-auto text-[11px] p-2 font-mono border ${darkMode ? 'bg-[#0E1117] border-gray-800' : 'bg-slate-50 border-gray-100'}`}>
          <div className="space-y-1.5">
            {logs.map((log, index) => (
              <div key={index} className={`flex items-start gap-3 p-2 rounded-lg border transition-all ${darkMode ? 'bg-[#161B22]/50 border-transparent hover:border-gray-800' : 'bg-white border-gray-200/60 hover:shadow-sm'}`}>
                {/* Micro-Badges instead of shell arrows */}
                <span className="opacity-40 font-bold select-none text-[10px] pt-0.5">{log.time}</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border tracking-wide font-sans ${getBadgeStyle(log.type)}`}>
                  {log.type}
                </span>
                <span className={`font-bold opacity-80 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>[{log.module}]</span>
                <span className={`flex-1 truncate ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}