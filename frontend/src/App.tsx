import React, { useState, useEffect } from 'react';
import {
  Layers, Sun, Moon, Settings, Activity, Brain, Truck, AlertTriangle, Shield, Eye, EyeOff, ArrowLeft, Database, Download, ArrowRight, Code, Zap
} from 'lucide-react';

// ─── Sub-Components ───────────────────────────────────────────────────────────
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddModal from './components/AddModal';

// ─── Views ────────────────────────────────────────────────────────────────────
import Overview from './views/Overview';
import AiSandbox from './views/AiSandbox';
import DetailView from './views/DetailView';

// ─── Types ────────────────────────────────────────────────────────────────────
import type {
  Shipment,
  FormData,
  NewShipmentForm,
  ChatLog,
  ActiveTab,
  ThemeClasses,
} from './types';

const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SH-901', item: 'Amul Fresh Milk', partner: 'Vishal Dairy Corp',
    temp: 3.4, target: '1°C to 4°C', route: 'Anand → Gandhinagar',
    status: 'Stable', ETA: '45 mins', risk: 'Low',
    origin: 'Anand Processing Plant', destination: 'Gandhinagar Parlour Hub',
    volume: '12,500 Units',
  },
  {
    id: 'SH-902', item: 'Bio-Vaccine B3', partner: 'DHL Medical Fleet',
    temp: 5.2, target: '2°C to 8°C', route: 'Mumbai → Ahmedabad Depot',
    status: 'Stable', ETA: '2 hrs 15 mins', risk: 'Low',
    origin: 'Mumbai Bio-Hub (BOM)', destination: 'Ahmedabad Clinical Storage',
    volume: '4,500 Units',
  },
  {
    id: 'SH-903', item: 'Frozen Seafood Matrix', partner: 'BlueWater Logistics',
    temp: -18.2, target: '-22°C to -15°C', route: 'Veraval → Surat Cold Storage',
    status: 'Stable', ETA: '1 hr 10 mins', risk: 'Low',
    origin: 'Veraval Harbor Corridor', destination: 'Surat Central Vault',
    volume: '800 Units',
  },
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Core App Registers
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [selectedId, setSelectedId] = useState<string>('SH-902');
  const [simValue, setSimValue] = useState<string>('5.2');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [prevSelectedId, setPrevSelectedId] = useState<string>('SH-902');

  // Authentication Fields
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  // Profile Context Block
  const [formData, setFormData] = useState<FormData>({
    name: 'Priyanshu Chaudhari',
    email: 'tech@ldrp.edu.in',
    idCode: '24BEIT30018',
    role: 'Lead Cold-Chain Systems Architect',
  });
  const [editName, setEditName] = useState<string>(formData.name);
  const [editEmail, setEditEmail] = useState<string>(formData.email);
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newShipment, setNewShipment] = useState<NewShipmentForm>({
    item: '', partner: '', temp: '4.0', minTemp: '2', maxTemp: '8', origin: '', destination: '', volume: '',
  });

  const [chatInput, setChatInput] = useState<string>('');
  const [chatLogs] = useState<ChatLog[]>([{ sender: 'ai', text: 'Subsystem Online.' }]);

  const activeDetailShipment = shipments.find((s) => s.id === selectedId) || shipments[0];

  // Dynamic Theme Definitions
  const baseThemeBg = darkMode ? 'bg-[#0E0F12] text-[#E2E8F0]' : 'bg-[#FAFAFB] text-[#1E2229]';
  const cardThemeBg = darkMode ? 'bg-[#16181D] border-[#262930]' : 'bg-white border-[#E4E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.02)]';
  const inputThemeBg = darkMode ? 'bg-[#0F1013] border-[#262930] text-white focus:border-[#107C41]' : 'bg-white border-[#DCDFE4] text-gray-900 focus:border-[#107C41]';
  const secondaryBg = darkMode ? 'bg-[#20242C]' : 'bg-[#F3F4F6]';

  const theme: ThemeClasses = { cardThemeBg, inputThemeBg, secondaryBg };

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordValid = Object.values(checks).every(Boolean);

  // ── FEATURE 1: AUTOMATED TEMPERATURE DRIFT BACKGROUND SIMULATION ENGINE ──
  useEffect(() => {
    if (currentRoute !== 'dashboard') return;

    const interval = setInterval(() => {
      setShipments((prevShipments) =>
        prevShipments.map((shipment) => {
          const drift = (Math.random() * 0.5 - 0.25);
          const nextTemp = parseFloat((shipment.temp + drift).toFixed(2));

          const ranges = shipment.target.match(/(-?\d+\.?\d*)/g);
          if (ranges && ranges.length >= 2) {
            const minAllowed = parseFloat(ranges[0]);
            const maxAllowed = parseFloat(ranges[1]);
            const isOutOfBounds = nextTemp < minAllowed || nextTemp > maxAllowed;

            return {
              ...shipment,
              temp: nextTemp,
              status: isOutOfBounds ? 'Breached' : 'Stable',
              risk: isOutOfBounds ? 'Critical' : 'Low',
            };
          }
          return { ...shipment, temp: nextTemp };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [currentRoute]);

  // Safe manual slider synchronization hook
  useEffect(() => {
    if (selectedId !== prevSelectedId) {
      setPrevSelectedId(selectedId);
      if (activeDetailShipment) {
        setSimValue(activeDetailShipment.temp.toString());
      }
    }
  }, [selectedId, prevSelectedId, activeDetailShipment]);


  // ── FEATURE 2: NATIVE CSV CRYPTOGRAPHIC MANIFEST DATA EXPORTER ──
  const handleExportDataManifest = () => {
    const csvHeaders = "Shipment ID,Asset Cargo Item,Logistics Partner,Current Temperature,Target Safety Threshold,Transit Route Corridor,Current Status,Risk Vector Level,Volume Capacity\n";

    const csvRows = shipments.map(s =>
      `"${s.id}","${s.item}","${s.partner}",${s.temp}°C,"${s.target}","${s.route}","${s.status}","${s.risk}","${s.volume}"`
    ).join("\n");

    const fullBlobPayload = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
    const dynamicDownloadUrl = URL.createObjectURL(fullBlobPayload);

    const nativeAnchor = document.createElement('a');
    nativeAnchor.href = dynamicDownloadUrl;
    nativeAnchor.setAttribute('download', `COLDTRACK_MANIFEST_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(nativeAnchor);
    nativeAnchor.click();
    document.body.removeChild(nativeAnchor);
  };


  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setPasswordError("Password signature does not meet validation rules.");
      return;
    }
    setPasswordError('');
    setCurrentRoute('dashboard');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ ...formData, name: editName, email: editEmail });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = `SH-${Math.floor(100 + Math.random() * 900)}`;
    const currentTemp = parseFloat(newShipment.temp || '0');
    const minAllowed = parseFloat(newShipment.minTemp || '0');
    const maxAllowed = parseFloat(newShipment.maxTemp || '0');
    const isOutOfBounds = currentTemp < minAllowed || currentTemp > maxAllowed;

    const created: Shipment = {
      id: nextId,
      item: newShipment.item || 'Custom Material Cargo',
      partner: newShipment.partner || 'Regional Cold Fleet',
      temp: currentTemp,
      target: `${newShipment.minTemp}°C to ${newShipment.maxTemp}°C`,
      route: `${newShipment.origin || 'Source'} → ${newShipment.destination || 'Destination'}`,
      status: isOutOfBounds ? 'Breached' : 'Stable',
      ETA: '1 hr 30 mins',
      risk: isOutOfBounds ? 'Critical' : 'Low',
      origin: newShipment.origin || 'Processing Node',
      destination: newShipment.destination || 'Delivery Vault',
      volume: newShipment.volume || '2,500 Units',
    };
    setShipments([created, ...shipments]);
    setSelectedId(nextId);
    setSimValue(newShipment.temp);
    setShowAddModal(false);
  };

  const executeTelemetrySimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setShipments((prev) =>
        prev.map((item) => {
          if (item.id !== selectedId) return item;
          const tNum = parseFloat(simValue);
          const matches = item.target.match(/(-?\d+\.?\d*)/g);
          if (matches && matches.length >= 2) {
            const isOutOfBounds = tNum < parseFloat(matches[0]) || tNum > parseFloat(matches[1]);
            return { ...item, temp: tNum, status: isOutOfBounds ? 'Breached' : 'Stable', risk: isOutOfBounds ? 'Critical' : 'Low' };
          }
          return item;
        })
      );
      setIsUpdating(false);
    }, 400);
  };

  const handleSendAiMessage = (e: React.FormEvent) => { e.preventDefault(); };
  const handleDrillDown = (id: string, temp: number) => { setSelectedId(id); setSimValue(temp.toString()); setActiveTab('detail'); };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${baseThemeBg}`}>

      {/* PHASE 1: ODOO STYLE FULL SCROLLING PRODUCT MARKETING HOMEPAGE */}
      {currentRoute === 'landing' && (
        <div className="w-full overflow-y-auto">
          {/* Global Sticky Navbar */}
          <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${darkMode ? 'bg-[#0E0F12]/80 border-[#262930]' : 'bg-white/80 border-[#E4E7EB]'}`}>
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#107C41] text-white p-1.5 rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
                <span className={`font-bold tracking-tight text-sm uppercase ${darkMode ? 'text-white' : 'text-[#1E2229]'}`}>ColdTrack</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-[#16181D] border-[#262930] text-amber-400' : 'bg-gray-50 border-[#DCDFE4] text-gray-500'}`}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}
                  className="bg-[#107C41] hover:bg-[#0D6334] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>
          </nav>

          {/* Section 1: Launcher Grid */}
          <div className="max-w-4xl mx-auto px-6 pt-12 text-center">
            <div className={`flex flex-wrap justify-center gap-4 md:gap-8 mb-10 opacity-80 ${darkMode ? 'text-[#E2E8F0]' : 'text-gray-700'}`}>
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform"><Truck className="w-5 h-5" /></div>
                <span className="text-[11px] font-semibold">Logistics</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform"><Activity className="w-5 h-5" /></div>
                <span className="text-[11px] font-semibold">Telemetry</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform"><Database className="w-5 h-5" /></div>
                <span className="text-[11px] font-semibold">Ledger Vault</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform"><Brain className="w-5 h-5" /></div>
                <span className="text-[11px] font-semibold">Cognitive AI</span>
              </div>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto mt-6">
              <h1 className={`text-4xl md:text-5xl font-black tracking-tight leading-[1.1] ${darkMode ? 'text-white' : 'text-[#1E2229]'}`}>
                Imagine a cold chain <br />
                <span className="text-[#107C41] relative inline-block">without complexity.</span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                Every application module simplifies a process, monitoring thermal thresholds automatically. Zero hassle, total asset visibility.
              </p>
            </div>
          </div>

          {/* Section 2: Interactive Main Feature Showcase Layout */}
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#16181D]/60 border-[#262930]' : 'bg-white border-[#E4E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.02)]'}`}>
              <div className="border-b pb-3 mb-4 border-gray-500/10 flex justify-between items-center text-xs">
                <span className={`font-bold tracking-widest font-mono ${darkMode ? 'text-gray-400 opacity-60' : 'text-gray-500 font-semibold'}`}>⚡ LIVE DEMO TRACKER SHUTTLE</span>
                <span className="w-2 h-2 rounded-full bg-[#107C41] animate-pulse" />
              </div>
              <div className={`grid md:grid-cols-3 gap-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0F1013] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-1"><span className="font-bold text-sm">Amul Fresh Milk</span></div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Anand → Gandhinagar</p>
                  <p className="text-xl font-black mt-2 text-[#107C41]">3.4°C</p>
                </div>
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0F1013] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-1"><span className="font-bold text-sm">Bio-Vaccine B3</span></div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Mumbai → Ahmedabad</p>
                  <p className="text-xl font-black mt-2 text-emerald-500">5.2°C</p>
                </div>
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0F1013] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-1"><span className="font-bold text-sm">AI Core Node</span></div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Scanning anomalies...</p>
                  <p className="text-xs font-mono font-bold mt-3 text-purple-500 dark:text-purple-400">99.4% Safety Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dual Column Open-Source / Benefit Grid */}
          <div className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-500/10">
            <h2 className={`text-2xl font-black text-center mb-10 ${darkMode ? 'text-white' : 'text-[#1E2229]'}`}>Enterprise Infrastructure Done Right</h2>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-2">
                <div className="text-[#107C41] font-bold flex items-center gap-2 text-base"><Code className="w-4 h-4" /> Complete Code Control</div>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-xs">
                  Built on a robust architecture engineered by academic pioneers. Fully integrated with customized React state flows, custom modal triggers, and clean layout parameters.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-[#107C41] font-bold flex items-center gap-2 text-base"><Zap className="w-4 h-4" /> Integrated Intelligence</div>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-xs">
                  No complex vendor lock-ins. Access a cognitive sandbox assistant directly inside your console stack to parse active database metrics instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Massive Bottom Conversion CTA Frame */}
          <div className={`w-full py-20 text-center border-t border-b ${darkMode ? 'bg-[#121317] border-[#262930]' : 'bg-[#F9FAFB] border-[#E4E7EB]'}`}>
            <div className="max-w-xl mx-auto px-6 space-y-5">
              <h2 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-[#1E2229]'}`}>Unleash your platform potential</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">No credit cards or hardware keys required. Immediate administrative workspace creation hub.</p>
              <button
                onClick={() => { setAuthMode('signup'); setCurrentRoute('auth'); }}
                className="inline-flex items-center gap-2 bg-[#107C41] hover:bg-[#0D6334] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Start Tracking Now — It's Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Extended Link Directory Footer */}
          <footer className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-gray-400">
            <div className="space-y-2.5">
              <p className={`font-bold uppercase tracking-wider text-[10px] ${darkMode ? 'text-white' : 'text-gray-800'}`}>Community</p>
              <p className="hover:text-[#107C41] cursor-pointer transition-colors">Documentation Hub</p>
              <p className="hover:text-[#107C41] cursor-pointer transition-colors">LDRP Github Cluster</p>
            </div>
            <div className="space-y-2.5">
              <p className={`font-bold uppercase tracking-wider text-[10px] ${darkMode ? 'text-white' : 'text-gray-800'}`}>Services</p>
              <p className="hover:text-[#107C41] cursor-pointer transition-colors">Module Upgrades</p>
              <p className="hover:text-[#107C41] cursor-pointer transition-colors">IoT Integrations</p>
            </div>
            <div className="space-y-2.5">
              <p className={`font-bold uppercase tracking-wider text-[10px] ${darkMode ? 'text-white' : 'text-gray-800'}`}>Security</p>
              <p className="hover:text-[#107C41] cursor-pointer transition-colors">AES-256 Protocol</p>
              <p className="hover:text-[#107C41] cursor-pointer transition-colors">Access Controls</p>
            </div>
            <div className="space-y-2.5 flex flex-col items-start justify-between">
              <span className="font-bold text-[#107C41] uppercase tracking-wider text-[10px]">LDRP-ITR Hub Node</span>
              <p className="text-[10px] opacity-60">© 2026 ColdTrack Systems Corp.</p>
            </div>
          </footer>
        </div>
      )}

      {/* PHASE 2 — AUTH GATEWAY */}
      {currentRoute === 'auth' && (
        <div className={`min-h-screen flex flex-col justify-between p-6 ${darkMode ? 'bg-[#0E0F12]' : 'bg-[#F8F9FA]'}`}>
          <header className="max-w-4xl w-full mx-auto flex justify-between items-center py-2">
            <button
              type="button"
              onClick={() => { setCurrentRoute('landing'); setPassword(''); setPasswordError(''); }}
              className={`text-xs font-semibold flex items-center gap-1.5 transition-opacity ${darkMode ? 'text-white' : 'text-gray-800 hover:text-gray-900'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back to homepage
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-[#107C41] text-white p-1.5 rounded-lg shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <span className={`font-bold text-sm tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>ColdTrack</span>
            </div>
          </header>

          <div className="w-full max-w-md mx-auto my-auto pt-4 pb-12">
            <div className={`p-8 rounded-2xl border transition-all duration-300 ${cardThemeBg}`}>
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
                      onChange={(e) => { setEditName(e.target.value); setFormData({ ...formData, name: e.target.value }); }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-normal transition-all outline-none text-sm ${inputThemeBg}`}
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
                    onChange={(e) => { setEditEmail(e.target.value); setFormData({ ...formData, email: e.target.value }); }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-normal transition-all outline-none text-sm ${inputThemeBg}`}
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
                      className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border font-normal transition-all outline-none text-sm ${inputThemeBg}`}
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

                <div className={`p-4 rounded-xl border space-y-2 text-[11px] font-mono ${darkMode ? 'bg-[#0F1013] border-gray-800' : 'bg-[#F9FAFB] border-[#EDEFF1]'}`}>
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
                  Confirm & Log In
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
        </div>
      )}

      {/* PHASE 3 — CENTRAL CONSOLE DASHBOARD */}
      {currentRoute === 'dashboard' && (
        <div className="flex min-h-screen">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === 'account') { setEditName(formData.name); setEditEmail(formData.email); }
              setActiveTab(tab);
            }}
            darkMode={darkMode}
            formData={formData}
            editName={editName}
            editEmail={editEmail}
            setEditName={setEditName}
            setEditEmail={setEditEmail}
            onTerminateSession={() => { setCurrentRoute('landing'); setActiveTab('overview'); setPassword(''); }}
            theme={theme}
          />

          <main className="flex-1 p-8 space-y-6 overflow-y-auto max-h-screen">
            <div className="flex items-center justify-between border-b border-gray-500/10 pb-4">
              <Header
                activeTab={activeTab}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode(!darkMode)}
                onOpenAddModal={() => setShowAddModal(true)}
                theme={theme}
              />
              {activeTab === 'overview' && (
                <button
                  onClick={handleExportDataManifest}
                  className="flex items-center gap-2 bg-[#1E2229] dark:bg-[#107C41] hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-md transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" /> Export Fleet Ledger (.CSV)
                </button>
              )}
            </div>

            {activeTab === 'overview' && (
              <Overview
                shipments={shipments}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                simValue={simValue}
                setSimValue={setSimValue}
                isUpdating={isUpdating}
                onTelemetrySubmit={executeTelemetrySimulation}
                onDrillDown={handleDrillDown}
                darkMode={darkMode}
                theme={theme}
              />
            )}

            {activeTab === 'ai-model' && (
              <AiSandbox
                chatLogs={chatLogs}
                chatInput={chatInput}
                setChatInput={setChatInput}
                onSendMessage={handleSendAiMessage}
                shipments={shipments}
                theme={theme}
              />
            )}

            {activeTab === 'detail' && (
              <DetailView
                shipment={activeDetailShipment}
                setActiveTab={setActiveTab}
                theme={theme}
              />
            )}

            {activeTab === 'account' && (
              <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className={`border p-6 rounded-3xl shadow-sm text-center space-y-4 ${cardThemeBg}`}>
                  <div className="w-16 h-16 bg-[#107C41] text-white flex items-center justify-center text-2xl font-extrabold rounded-full mx-auto font-mono">
                    P
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{formData.name}</h3>
                    <p className="text-xs opacity-60 font-mono">{formData.role}</p>
                  </div>
                </div>

                <div className={`border p-6 rounded-3xl shadow-sm md:col-span-2 space-y-4 ${cardThemeBg}`}>
                  <div className="border-b pb-2 border-gray-300/20 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#107C41]" />
                    <h4 className="text-xs font-bold font-mono uppercase">Identity Record Mutator</h4>
                  </div>
                  {profileSuccess && (
                    <div className="p-3 bg-[#E2F4E9] text-[#107C41] text-xs font-mono font-bold rounded-xl">
                      ✓ Account updates saved successfully!
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="font-bold opacity-60 uppercase text-[10px]">Edit Operator Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={`w-full px-4 py-2 rounded-xl focus:outline-none ${inputThemeBg}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold opacity-60 uppercase text-[10px]">Edit Contact Email</label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className={`w-full px-4 py-2 rounded-xl focus:outline-none ${inputThemeBg}`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#1E2229] dark:bg-[#107C41] text-white font-bold uppercase px-5 py-2 rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Commit Updates
                    </button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {showAddModal && (
        <AddModal
          newShipment={newShipment}
          setNewShipment={setNewShipment}
          onSubmit={handleCreateShipment}
          onClose={() => setShowAddModal(false)}
          theme={theme}
        />
      )}
    </div>
  );
}