import React, { useState, useEffect } from 'react';
import { Layers, Sun, Moon, Settings, Download, ArrowRight, Code, Zap, Truck, Activity, Database, Brain } from 'lucide-react';

// ─── Sub-Components & Isolated Views ──────────────────────────────────────────
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddModal from './components/AddModal';
import AuthView from './views/AuthView';

// ─── Control Views ────────────────────────────────────────────────────────────
import Overview from './views/Overview';
import AiSandbox from './views/AiSandbox';
import DetailView from './views/DetailView';

import type { Shipment, FormData, NewShipmentForm, ChatLog, ActiveTab, ThemeClasses } from './types';

const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SH-901', item: 'Amul Fresh Milk', partner: 'Vishal Dairy Corp',
    temp: 3.4, target: '1°C to 4°C', route: 'Anand → Gandhinagar',
    status: 'Stable', ETA: '45 mins', risk: 'Low',
    origin: 'Anand Processing Plant', destination: 'Gandhinagar Parlour Hub', volume: '12,500 Units',
  },
  {
    id: 'SH-902', item: 'Bio-Vaccine B3', partner: 'DHL Medical Fleet',
    temp: 5.2, target: '2°C to 8°C', route: 'Mumbai → Ahmedabad Depot',
    status: 'Stable', ETA: '2 hrs 15 mins', risk: 'Low',
    origin: 'Mumbai Bio-Hub (BOM)', destination: 'Ahmedabad Clinical Storage', volume: '4,500 Units',
  },
  {
    id: 'SH-903', item: 'Frozen Seafood Matrix', partner: 'BlueWater Logistics',
    temp: -18.2, target: '-22°C to -15°C', route: 'Veraval → Surat Cold Storage',
    status: 'Stable', ETA: '1 hr 10 mins', risk: 'Low',
    origin: 'Veraval Harbor Corridor', destination: 'Surat Central Vault', volume: '800 Units',
  },
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [selectedId, setSelectedId] = useState<string>('SH-902');
  const [simValue, setSimValue] = useState<string>('5.2');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [prevSelectedId, setPrevSelectedId] = useState<string>('SH-902');

  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');
  
  const [userDatabase, setUserDatabase] = useState<Record<string, string>>({
    'tech@ldrp.edu.in': 'Password123!',
  });

  const [formData, setFormData] = useState<FormData>({
    name: 'Priyanshu Chaudhari', email: 'tech@ldrp.edu.in', idCode: '24BEIT30018', role: 'Lead Cold-Chain Systems Architect',
  });
  
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newShipment, setNewShipment] = useState<NewShipmentForm>({
    item: '', partner: '', temp: '4.0', minTemp: '2', maxTemp: '8', origin: '', destination: '', volume: '',
  });

  const [chatInput, setChatInput] = useState<string>('');
  const [chatLogs] = useState<ChatLog[]>([{ sender: 'ai', text: 'Subsystem Online.' }]);

  const activeDetailShipment = shipments.find((s) => s.id === selectedId) || shipments[0];

  const cardThemeBg = darkMode ? 'bg-[#16181D]/90 border-[#262930] backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 'bg-white/95 border-[#E4E7EB] backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.04)]';
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

  useEffect(() => {
    if (currentRoute !== 'dashboard') return;
    const interval = setInterval(() => {
      setShipments((prev) =>
        prev.map((s) => {
          const drift = (Math.random() * 0.5 - 0.25);
          const nextTemp = parseFloat((s.temp + drift).toFixed(2));
          const ranges = s.target.match(/(-?\d+\.?\d*)/g);
          if (ranges && ranges.length >= 2) {
            const isOutOfBounds = nextTemp < parseFloat(ranges[0]) || nextTemp > parseFloat(ranges[1]);
            return { ...s, temp: nextTemp, status: isOutOfBounds ? 'Breached' : 'Stable', risk: isOutOfBounds ? 'Critical' : 'Low' };
          }
          return { ...s, temp: nextTemp };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [currentRoute]);

  useEffect(() => {
    if (selectedId !== prevSelectedId && activeDetailShipment) {
      setPrevSelectedId(selectedId);
      setSimValue(activeDetailShipment.temp.toString());
    }
  }, [selectedId, prevSelectedId, activeDetailShipment]);

  const handleExportDataManifest = () => {
    const csvHeaders = "Shipment ID,Asset Cargo Item,Logistics Partner,Current Temperature,Target Safety Threshold,Transit Route Corridor,Current Status,Risk Vector Level,Volume Capacity\n";
    const csvRows = shipments.map(s => `"${s.id}","${s.item}","${s.partner}",${s.temp}°C,"${s.target}","${s.route}","${s.status}","${s.risk}","${s.volume}"`).join("\n");
    const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `COLDTRACK_MANIFEST_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(checks).every(Boolean)) {
      setPasswordError("Password signature does not meet validation rules.");
      return;
    }

    if (authMode === 'signup') {
      if (userDatabase[editEmail]) {
        setPasswordError("An account with this email already exists.");
        return;
      }
      setUserDatabase(prev => ({ ...prev, [editEmail]: password }));
      setFormData({ ...formData, name: editName || 'Authorized Operator', email: editEmail || 'operator@ldrp.edu.in' });
      setPasswordError('');
      setCurrentRoute('dashboard');
    } else {
      const storedSecret = userDatabase[editEmail];
      if (!storedSecret) {
        setPasswordError("No account found with this email. Please sign up first.");
        return;
      }
      if (storedSecret !== password) {
        setPasswordError("Incorrect password signature. Access denied.");
        return;
      }
      setFormData({ ...formData, name: editName || 'Authorized Operator', email: editEmail });
      setPasswordError('');
      setCurrentRoute('dashboard');
    }
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
      id: nextId, item: newShipment.item || 'Custom Material Cargo', partner: newShipment.partner || 'Regional Cold Fleet',
      temp: currentTemp, target: `${newShipment.minTemp}°C to ${newShipment.maxTemp}°C`,
      route: `${newShipment.origin || 'Source'} → ${newShipment.destination || 'Destination'}`,
      status: isOutOfBounds ? 'Breached' : 'Stable', ETA: '1 hr 30 mins', risk: isOutOfBounds ? 'Critical' : 'Low',
      origin: newShipment.origin || 'Processing Node', destination: newShipment.destination || 'Delivery Vault', volume: newShipment.volume || '2,500 Units',
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

  const handleDrillDown = (id: string, temp: number) => { setSelectedId(id); setSimValue(temp.toString()); setActiveTab('detail'); };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 relative ${darkMode ? 'bg-[#0E0F12] text-[#E2E8F0]' : 'bg-[#FAFAFB] text-[#1E2229]'}`}>

      {/* ROUTE 1: SCROLLING MARKETING LANDING HOME PAGE */}
      {currentRoute === 'landing' && (
        <div className="w-full overflow-y-auto">
          <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${darkMode ? 'bg-[#0E0F12]/80 border-[#262930]' : 'bg-white/80 border-[#E4E7EB]'}`}>
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-[#107C41] text-white p-1.5 rounded-lg"><Layers className="w-4 h-4" /></div>
                <span className="font-bold tracking-tight text-sm uppercase">ColdTrack</span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl border ${darkMode ? 'bg-[#16181D] border-[#262930] text-amber-400' : 'bg-gray-50 border-[#DCDFE4] text-gray-500'}`}>
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); setPassword(''); setPasswordError(''); }} className="bg-[#107C41] hover:bg-[#0D6334] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">Sign In</button>
              </div>
            </div>
          </nav>

          <div className="max-w-4xl mx-auto px-6 pt-12 text-center">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 opacity-80">
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}><div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20"><Truck className="w-5 h-5" /></div><span className="text-[11px] font-semibold">Logistics</span></div>
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}><div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20"><Activity className="w-5 h-5" /></div><span className="text-[11px] font-semibold">Telemetry</span></div>
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}><div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20"><Database className="w-5 h-5" /></div><span className="text-[11px] font-semibold">Ledger Vault</span></div>
              <div className="flex flex-col items-center gap-1.5 group cursor-pointer" onClick={() => { setAuthMode('signin'); setCurrentRoute('auth'); }}><div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20"><Brain className="w-5 h-5" /></div><span className="text-[11px] font-semibold">Cognitive AI</span></div>
            </div>
            <div className="space-y-4 max-w-2xl mx-auto mt-6">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">Imagine a cold chain <br /><span className="text-[#107C41]">without complexity.</span></h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Every application module simplifies a process, monitoring thermal thresholds automatically. Zero hassle, total asset visibility.</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#16181D]/60 border-[#262930]' : 'bg-white border-[#E4E7EB]'}`}>
              <div className="border-b pb-3 mb-4 border-gray-500/10 flex justify-between items-center text-xs">
                <span className="font-bold tracking-widest font-mono text-slate-700 dark:text-slate-400">⚡ LIVE DEMO TRACKER SHUTTLE</span><span className="w-2 h-2 rounded-full bg-[#107C41] animate-pulse" />
              </div>
              
              {/* ── HIGH-CONTRAST LIGHT MODE CARDS CORRECTION ── */}
              <div className="grid md:grid-cols-3 gap-4 text-slate-800 dark:text-white">
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0F1013] border-gray-800' : 'bg-gray-50 border-slate-200'}`}>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Amul Fresh Milk</span>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Anand → Gandhinagar</p>
                  <p className="text-xl font-black mt-3 text-[#107C41]">3.4°C</p>
                </div>
                
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0F1013] border-gray-800' : 'bg-gray-50 border-slate-200'}`}>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Bio-Vaccine B3</span>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Mumbai → Ahmedabad</p>
                  <p className="text-xl font-black mt-3 text-emerald-600 dark:text-emerald-500">5.2°C</p>
                </div>
                
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0F1013] border-gray-800' : 'bg-gray-50 border-slate-200'}`}>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">AI Core Node</span>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Scanning anomalies...</p>
                  <p className="text-xs font-mono font-bold mt-4 text-purple-600 dark:text-purple-400">99.4% Safety Rating</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 py-16 border-t border-gray-500/10">
            <h2 className="text-2xl font-black text-center mb-10">Enterprise Infrastructure Done Right</h2>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-2"><div className="text-[#107C41] font-bold flex items-center gap-2 text-base"><Code className="w-4 h-4" /> Complete Code Control</div><p className="text-gray-500 dark:text-gray-400 text-xs">Built on a robust architecture engineered by academic pioneers. Fully integrated with customized React state flows.</p></div>
              <div className="space-y-2"><div className="text-[#107C41] font-bold flex items-center gap-2 text-base"><Zap className="w-4 h-4" /> Integrated Intelligence</div><p className="text-gray-500 dark:text-gray-400 text-xs">No complex vendor lock-ins. Access a cognitive sandbox assistant directly inside your console stack.</p></div>
            </div>
          </div>

          <div className={`w-full py-20 text-center border-t border-b ${darkMode ? 'bg-[#121317] border-[#262930]' : 'bg-[#F9FAFB] border-[#E4E7EB]'}`}>
            <div className="max-w-xl mx-auto px-6 space-y-5">
              <h2 className="text-3xl font-black tracking-tight">Unleash your platform potential</h2>
              <button onClick={() => { setAuthMode('signup'); setCurrentRoute('auth'); setPassword(''); setPasswordError(''); }} className="inline-flex items-center gap-2 bg-[#107C41] hover:bg-[#0D6334] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all">Start Tracking Now — It's Free <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>

          <footer className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-gray-400">
            <div className="space-y-2.5"><p className="font-bold uppercase tracking-wider text-[10px] text-gray-800 dark:text-white">Community</p><p>Documentation Hub</p><p>LDRP Github Cluster</p></div>
            <div className="space-y-2.5"><p className="font-bold uppercase tracking-wider text-[10px] text-gray-800 dark:text-white">Services</p><p>Module Upgrades</p><p>IoT Integrations</p></div>
            <div className="space-y-2.5"><p className="font-bold uppercase tracking-wider text-[10px] text-gray-800 dark:text-white">Security</p><p>AES-256 Protocol</p><p>Access Controls</p></div>
            <div className="space-y-2.5 flex flex-col items-start justify-between"><span className="font-bold text-[#107C41] uppercase tracking-wider text-[10px]">LDRP-ITR Hub Node</span><p className="text-[10px] opacity-60">© 2026 ColdTrack Systems Corp.</p></div>
          </footer>
        </div>
      )}

      {/* ROUTE 2: DECOUPLED INDEPENDENT AUTH VIEW GATEWAY */}
      {currentRoute === 'auth' && (
        <AuthView
          authMode={authMode} setAuthMode={setAuthMode} darkMode={darkMode} theme={theme}
          passwordError={passwordError} setPasswordError={setPasswordError} handleAuthSubmit={handleAuthSubmit}
          editName={editName} setEditName={setEditName} editEmail={editEmail} setEditEmail={setEditEmail}
          password={password} setPassword={setPassword} showPassword={showPassword} setShowPassword={setShowPassword}
          checks={checks} setCurrentRoute={setCurrentRoute}
        />
      )}

      {/* ROUTE 3: CENTRAL WORKSPACE DASHBOARD */}
      {currentRoute === 'dashboard' && (
        <div className="flex min-h-screen relative z-10">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => { if (tab === 'account') { setEditName(formData.name); setEditEmail(formData.email); } setActiveTab(tab); }}
            darkMode={darkMode} formData={formData} editName={editName} editEmail={editEmail} setEditName={setEditName} setEditEmail={setEditEmail}
            onTerminateSession={() => { setCurrentRoute('landing'); setActiveTab('overview'); setPassword(''); }} theme={theme}
          />
          <main className="flex-1 p-8 space-y-6 overflow-y-auto max-h-screen">
            <div className="flex items-center justify-between border-b border-gray-500/10 pb-4">
              <Header activeTab={activeTab} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} onOpenAddModal={() => setShowAddModal(true)} theme={theme} />
              {activeTab === 'overview' && (
                <button onClick={handleExportDataManifest} className="flex items-center gap-2 bg-[#1E2229] dark:bg-[#107C41] text-white px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-md"><Download className="w-3.5 h-3.5" /> Export Fleet Ledger (.CSV)</button>
              )}
            </div>

            {activeTab === 'overview' && (
              <Overview shipments={shipments} selectedId={selectedId} setSelectedId={setSelectedId} simValue={simValue} setSimValue={setSimValue} isUpdating={isUpdating} onTelemetrySubmit={executeTelemetrySimulation} onDrillDown={handleDrillDown} darkMode={darkMode} theme={theme} />
            )}
            {activeTab === 'ai-model' && (
              <AiSandbox chatLogs={chatLogs} chatInput={chatInput} setChatInput={setChatInput} onSendMessage={(e) => e.preventDefault()} shipments={shipments} theme={theme} />
            )}
            {activeTab === 'detail' && (
              <DetailView shipment={activeDetailShipment} setActiveTab={setActiveTab} theme={theme} />
            )}

            {activeTab === 'account' && (
              <div className="grid md:grid-cols-3 gap-6 items-start">
                <div className={`border p-6 rounded-3xl text-center space-y-4 ${cardThemeBg}`}><div className="w-16 h-16 bg-[#107C41] text-white flex items-center justify-center text-2xl font-extrabold rounded-full mx-auto font-mono">P</div><div><h3 className="text-base font-bold">{formData.name}</h3><p className="text-xs opacity-60 font-mono">{formData.role}</p></div></div>
                <div className={`border p-6 rounded-3xl md:col-span-2 space-y-4 ${cardThemeBg}`}>
                  <div className="border-b pb-2 border-gray-300/20 flex items-center gap-2"><Settings className="w-4 h-4 text-[#107C41]" /><h4 className="text-xs font-bold font-mono uppercase">Identity Record Mutator</h4></div>
                  {profileSuccess && <div className="p-3 bg-[#E2F4E9] text-[#107C41] text-xs font-mono font-bold rounded-xl">✓ Account updates saved successfully!</div>}
                  <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1"><label className="font-bold opacity-60 uppercase text-[10px]">Edit Operator Name</label><input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className={`w-full px-4 py-2 rounded-xl focus:outline-none ${inputThemeBg}`} /></div>
                    <div className="space-y-1"><label className="font-bold opacity-60 uppercase text-[10px]">Edit Contact Email</label><input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className={`w-full px-4 py-2 rounded-xl focus:outline-none ${inputThemeBg}`} /></div>
                    <button type="submit" className="bg-[#1E2229] dark:bg-[#107C41] text-white font-bold uppercase px-5 py-2 rounded-xl shadow-md">Commit Updates</button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {showAddModal && <AddModal newShipment={newShipment} setNewShipment={setNewShipment} onSubmit={handleCreateShipment} onClose={() => setShowAddModal(false)} theme={theme} />}
    </div>
  );
}