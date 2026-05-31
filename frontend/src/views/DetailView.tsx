import React from 'react';
import {
  ArrowLeft, Thermometer, Clock, Weight, ShieldAlert, CheckCircle, Navigation, TrendingUp
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

interface DetailViewProps {
  shipment: Shipment;
  setActiveTab: (tab: 'overview' | 'ai-model' | 'detail' | 'account') => void;
  theme: ThemeClasses;
}

export default function DetailView({ shipment, setActiveTab, theme }: DetailViewProps) {

  const isBreached = shipment.status === 'Breached';
  const baseTemp = shipment.temp;

  // Dynamic 6-frame sensor simulator points
  const historyPoints = isBreached
    ? [baseTemp - 4.2, baseTemp - 3.0, baseTemp - 1.5, baseTemp - 0.8, baseTemp - 0.2, baseTemp]
    : [baseTemp + 0.4, baseTemp - 0.2, baseTemp + 0.1, baseTemp - 0.3, baseTemp + 0.2, baseTemp];

  const minChartTemp = Math.min(...historyPoints) - 2;
  const maxChartTemp = Math.max(...historyPoints) + 2;
  const tempRange = maxChartTemp - minChartTemp || 1;

  const svgCoordinates = historyPoints
    .map((val, idx) => {
      const x = (idx * (500 / 5)).toFixed(0);
      const y = (140 - ((val - minChartTemp) / tempRange) * 100).toFixed(0);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className={`border p-6 rounded-3xl shadow-sm space-y-6 ${theme.cardThemeBg}`}>

      {/* View Header */}
      <div className="flex justify-between items-start border-b border-gray-300/10 pb-4">
        <div>
          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${isBreached ? 'bg-red-500/10 text-red-500' : 'bg-[#E2F4E9] text-[#107C41]'}`}>
            {shipment.status} Core Telemetry Drilldown
          </span>
          <h3 className="text-2xl font-extrabold mt-1">{shipment.item}</h3>
          <p className="text-xs opacity-60 font-mono mt-0.5">Asset Reference Ledger Node: {shipment.id}</p>
        </div>
        <button
          onClick={() => setActiveTab('overview')}
          className={`text-xs font-mono font-bold uppercase border px-4 py-2 rounded-xl transition-all ${theme.secondaryBg} border-gray-300/20 hover:scale-102`}
        >
          ← Back to Operations Grid
        </button>
      </div>

      {/* REAL-TIME HISTORICAL TEMPERATURE DEVIATION GRAPH */}
      <div className={`border p-5 rounded-2xl space-y-3 ${theme.secondaryBg} border-gray-300/10`}>
        <div className="flex justify-between items-center border-b pb-2 border-gray-300/10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-80">
            <TrendingUp className="w-4 h-4 text-[#107C41]" /> 6-Frame Node Ambient Thermal Waveform
          </span>
          <span className="text-[10px] font-mono opacity-50">Interval: Live Sensor Polling</span>
        </div>

        {/* Hardware Rendered SVG Sparkline Graph Wrapper */}
        <div className="w-full bg-slate-950/5 dark:bg-black/20 p-4 rounded-xl border border-gray-500/5 relative overflow-hidden">
          <svg viewBox="0 0 500 150" className="w-full h-32 overflow-visible">
            {/* Horizontal Guide Grid Lines */}
            <line x1="0" y1="20" x2="500" y2="20" className="stroke-gray-500/10 stroke-1" strokeDasharray="4 4" />
            <line x1="0" y1="70" x2="500" y2="70" className="stroke-gray-500/10 stroke-1" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="500" y2="120" className="stroke-gray-500/10 stroke-1" strokeDasharray="4 4" />

            {/* Dynamic Polyline Vector Wave */}
            <polyline
              fill="none"
              stroke={isBreached ? '#C1272D' : '#107C41'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={svgCoordinates}
              className="transition-all duration-500 ease-in-out"
            />

            {/* Glowing Interactive coordinate boundary nodes */}
            {historyPoints.map((val, idx) => {
              const x = (idx * (500 / 5)).toFixed(0);
              const y = (140 - ((val - minChartTemp) / tempRange) * 100).toFixed(0);
              return (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={isBreached ? '#C1272D' : '#107C41'}
                    className="hover:r-7 transition-all"
                  />
                  <text
                    x={x}
                    y={parseInt(y) - 10}
                    textAnchor="middle"
                    className="fill-current text-[9px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  >
                    {val.toFixed(1)}°C
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* KPI Structural Snapshot Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-4 rounded-2xl border border-gray-300/10 ${theme.secondaryBg}`}>
          <p className="text-[10px] font-mono font-bold opacity-60 uppercase flex items-center gap-1">
            <ThemeIcon component={Thermometer} /> Current Sensor Load
          </p>
          <p className={`text-2xl font-extrabold mt-1 ${isBreached ? 'text-[#C1272D]' : 'text-[#107C41]'}`}>{shipment.temp}°C</p>
        </div>
        <div className={`p-4 rounded-2xl border border-gray-300/10 ${theme.secondaryBg}`}>
          <p className="text-[10px] font-mono font-bold opacity-60 uppercase flex items-center gap-1">
            <ThemeIcon component={Clock} /> Est. Transit Window
          </p>
          <p className="text-lg font-bold mt-1 font-mono">{shipment.ETA}</p>
        </div>
        <div className={`p-4 rounded-2xl border border-gray-300/10 ${theme.secondaryBg}`}>
          <p className="text-[10px] font-mono font-bold opacity-60 uppercase flex items-center gap-1">
            <ThemeIcon component={Weight} /> Payload Mass Volume
          </p>
          <p className="text-lg font-bold mt-1">{shipment.volume}</p>
        </div>
        <div className={`p-4 rounded-2xl border border-gray-300/10 ${theme.secondaryBg}`}>
          <p className="text-[10px] font-mono font-bold opacity-60 uppercase flex items-center gap-1">
            {isBreached ? <ShieldAlert className="w-3.5 h-3.5 text-[#C1272D]" /> : <CheckCircle className="w-3.5 h-3.5 text-[#107C41]" />} Core Hazard Profile
          </p>
          <p className={`text-sm font-bold uppercase mt-2 ${isBreached ? 'text-[#C1272D]' : 'text-[#107C41]'}`}>{shipment.risk} RISK MATRIX</p>
        </div>
      </div>

      {/* Dynamic Path Waypoint Route Track Card Component */}
      <div className={`p-5 rounded-2xl border border-gray-300/10 space-y-3 ${theme.secondaryBg}`}>
        <h4 className="text-xs font-bold font-mono uppercase tracking-wider opacity-70 flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-[#107C41]" /> Supply Chain Corridor Checkpoints
        </h4>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-300/10 bg-opacity-40 bg-white dark:bg-gray-950/20 font-mono text-xs">
          <div>
            <p className="text-[9px] opacity-40 uppercase">Origin Source Leg</p>
            <p className="font-bold">{shipment.origin}</p>
          </div>
          <div className="hidden sm:block text-[#107C41] font-extrabold tracking-widest">──────────────▶</div>
          <div className="sm:text-right">
            <p className="text-[9px] opacity-40 uppercase">Terminal Destination Node</p>
            <p className="font-bold">{shipment.destination}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

// Inline helper for consistent icon rendering size
function ThemeIcon({ component: Icon }: { component: React.ComponentType<{ className?: string }> }) {
  return <Icon className="w-3.5 h-3.5" />;
}