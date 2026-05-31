import React, { useState } from 'react';
import { Brain, Send, Bot, User, Cpu, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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

interface ChatLog {
  sender: 'user' | 'ai';
  text: string;
  thought?: string; // Appended deep-thinking trace metadata block
}

interface AiSandboxProps {
  chatLogs: ChatLog[];
  chatInput: string;
  setChatInput: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void; // Keep for fallback connectivity tracking
  shipments: Shipment[];
  theme: ThemeClasses;
}

export default function AiSandbox({
  chatInput,
  setChatInput,
  shipments,
  theme,
}: AiSandboxProps) {
  const [localLogs, setLocalLogs] = useState<ChatLog[]>([
    {
      sender: 'ai',
      text: "ColdTrack Core LLM Sandbox Online. I am monitoring your full runtime matrix across active segments. Ask me to cross-reference thresholds, diagnose fleet anomalies, or explain app states.",
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [expandedThoughtIndex, setExpandedThoughtIndex] = useState<number | null>(null);

  const handleAiInference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const workingLogs: ChatLog[] = [...localLogs, { sender: 'user', text: userText }];
    setLocalLogs(workingLogs);
    setChatInput('');
    setIsThinking(true);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let responseText: string;
      let thoughtTrace = "";

      // 🧠 STEP 1: CONSTRUCT THE DEEP COGNITIVE THINKING PROCESS LINES
      thoughtTrace += `[1] Input Node Processing: Parsed user token string: "${userText}"\n`;
      thoughtTrace += `[2] Context Scanning: Reading global app telemetry registry tracking ${shipments.length} active pipelines...\n`;

      const breachedItems = shipments.filter((s) => s.status === 'Breached');
      thoughtTrace += `[3] Evaluation Matrix: Active breaches detected in stack = ${breachedItems.length}.\n`;

      // 🛠️ STEP 2: RUN DYNAMIC REASONING HEURISTICS BASED ON TELEMETRY
      if (lower.includes('status') || lower.includes('summary') || lower.includes('everything')) {
        thoughtTrace += `[4] Intent Identified: SYSTEM_SUMMARY_QUERY. Compiling multi-vector fleet synthesis.\n`;
        const breachReport = breachedItems.length > 0
          ? `CRITICAL WARNING: Payload [${breachedItems.map(b => b.id).join(', ')}] is out of standard safety parameters.`
          : `All units are operatingnominally inside safety constraints.`;

        responseText = `System Analysis Synthesis:\n\nTracking ${shipments.length} live consignments across your regional cold chain corridors. ${breachReport} Current safety profile holds an index of ${(((shipments.length - breachedItems.length) / shipments.length) * 100).toFixed(0)}% grid compliance.`;

      } else if (lower.includes('milk') || lower.includes('amul') || lower.includes('901')) {
        thoughtTrace += `[4] Intent Identified: TARGET_ASSET_DIAGNOSTIC (SH-901).\n`;
        const milk = shipments.find(s => s.id === 'SH-901') || shipments[0];
        const stateAnalysis = milk.status === 'Breached'
          ? `🚨 RISK BREACH: It has drifted outside its strict limits! Immediate temperature adjustment required.`
          : `✅ NOMINAL: Thermal envelope is stable. Core composition parameters are securely locked.`;

        responseText = `[Asset Node SH-901 Diagnostics] — ${milk.item}:\n• Current Loading: ${milk.temp}°C against mandatory target ${milk.target}.\n• Logistics Segment: Running ${milk.route} via ${milk.partner}.\n• Evaluation: ${stateAnalysis}`;

      } else if (lower.includes('vaccine') || lower.includes('bio') || lower.includes('902')) {
        thoughtTrace += `[4] Intent Identified: TARGET_ASSET_DIAGNOSTIC (SH-902).\n`;
        const vac = shipments.find(s => s.id === 'SH-902') || shipments[0];
        const stateAnalysis = vac.status === 'Breached'
          ? `🚨 CRITICAL VIOLATION: Current temperature is ${vac.temp}°C! The target safety threshold is strictly ${vac.target}. Protein denaturation risk is high; redirect carrier immediately.`
          : `✅ NOMINAL: Cooling modules operating safely inside limits (${vac.target}).`;

        responseText = `[Asset Node SH-902 Diagnostics] — ${vac.item}:\n• Telemetry Stream: Registering ${vac.temp}°C.\n• Risk Core Profiling: flagged as [${vac.risk.toUpperCase()}] priority hazard vector.\n• Evaluation: ${stateAnalysis}`;

      } else if (lower.includes('breach') || lower.includes('violation') || lower.includes('alert') || lower.includes('anomaly')) {
        thoughtTrace += `[4] Intent Identified: ANOMALY_ISOLATION_QUERY.\n`;
        if (breachedItems.length > 0) {
          responseText = `⚠️ THERMAL ANOMALIES ISOLATED:\n\nI have isolated ${breachedItems.length} core exception patterns inside the active tracking buffer:\n\n` +
            breachedItems.map(b => `• [${b.id}] ${b.item}: Registering ${b.temp}°C (Safe Range: ${b.target}). Current Route: ${b.route}.`).join('\n');
        } else {
          responseText = `✅ MONITORED GRID NOMINAL: Zero exception flags raised in data queues. All active freight routes are running securely within their respective thermal targets.`;
        }

      } else if (lower.includes('app') || lower.includes('architecture') || lower.includes('code')) {
        thoughtTrace += `[4] Intent Identified: CORE_SYSTEM_ARCHITECTURE_QUERY.\n`;
        responseText = `Platform Architecture Blueprint:\n\nThis platform has been successfully split into a modular component tree to avoid monolithic slowdowns:\n• Root Hub: App.tsx (Maintains core state registers and global routing dispatching).\n• Strategic Grid: views/Overview.tsx (Drives analytics cards and layout metrics panels).\n• Predictive Engine: views/AiSandbox.tsx (This component, processing active conversational inference contexts).`;

      } else {
        thoughtTrace += `[4] Intent Identified: UNKNOWN_TOKEN_FALLBACK. Invoking contextual general heuristic search.\n`;
        responseText = `I have completed an audit of your workspace state registers. I am equipped to analyze precise tracking vectors. Try asking:\n• "Give me a fleet summary status update."\n• "Analyze vaccine thermal anomalies."\n• "Is there a breach active right now?"`;
      }

      thoughtTrace += `[5] Finalization: Aggregated response payload vectors cleanly. Transmitting strings.`;

      setLocalLogs([...workingLogs, { sender: 'ai', text: responseText, thought: thoughtTrace }]);
      setIsThinking(false);
    }, 1200); // Dynamic latency simulator to emulate thinking execution cycles
  };

  return (
    <div className={`border p-6 rounded-3xl shadow-sm flex flex-col h-[calc(100vh-140px)] ${theme.cardThemeBg}`}>

      {/* Conversation Window Module Header */}
      <div className="flex items-center justify-between border-b border-gray-300/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#107C41] text-white p-2 rounded-xl shadow-md">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-2">
              ColdTrack LLM Cognitive Engine Node
            </h3>
            <p className="text-[10px] font-mono opacity-50">Context Space: Local State Manifest Registers Linked</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono bg-gray-500/10 px-3 py-1 rounded-full opacity-70">
          <Cpu className="w-3.5 h-3.5 text-[#107C41]" /> Context-Aware Mode
        </div>
      </div>

      {/* Dynamic Conversation Scroll Thread Feed Canvas */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2 text-xs">
        {localLogs.map((log, idx) => (
          <div key={idx} className={`flex flex-col space-y-1.5 ${log.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-1.5 opacity-60 text-[10px] font-mono">
              {log.sender === 'user' ? (
                <><span>System Operator</span> <User className="w-3 h-3" /></>
              ) : (
                <><Bot className="w-3 h-3 text-[#107C41]" /> <span>ColdTrack Agent</span></>
              )}
            </div>

            {/* Injected Thinking Trace Toggle Component Panel Box */}
            {log.sender === 'ai' && log.thought && (
              <div className="w-full max-w-xl border border-gray-500/10 rounded-xl overflow-hidden font-mono text-[10px] bg-gray-500/5">
                <button
                  onClick={() => setExpandedThoughtIndex(expandedThoughtIndex === idx ? null : idx)}
                  className="w-full px-3 py-2 flex justify-between items-center bg-gray-500/10 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <span className="flex items-center gap-1.5 text-[#107C41] font-bold">
                    <Sparkles className="w-3 h-3 text-[#107C41]" />
                    {expandedThoughtIndex === idx ? "Hide Internal Thinking Chain" : "Show Core Chain of Thought Process Trace"}
                  </span>
                  {expandedThoughtIndex === idx ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {expandedThoughtIndex === idx && (
                  <pre className="p-3 whitespace-pre-wrap leading-relaxed text-gray-400 border-t border-gray-500/5 select-none bg-black/10">
                    {log.thought}
                  </pre>
                )}
              </div>
            )}

            {/* Bubble Layout Text Output Block */}
            <div className={`p-4 rounded-2xl max-w-xl leading-relaxed whitespace-pre-wrap shadow-sm border ${log.sender === 'user'
                ? 'bg-[#1E2229] border-[#1E2229] text-white rounded-br-none'
                : 'bg-gray-500/5 border-gray-300/10 rounded-bl-none'
              }`}>
              {log.text}
            </div>
          </div>
        ))}

        {/* Dynamic Thinking Status Loader Mask */}
        {isThinking && (
          <div className="flex flex-col space-y-2 items-start animate-pulse">
            <div className="flex items-center gap-1.5 opacity-60 text-[10px] font-mono">
              <Bot className="w-3 h-3 text-[#107C41]" /> <span>Agent processing variables...</span>
            </div>
            <div className="bg-gray-500/5 border border-gray-300/10 p-4 rounded-2xl rounded-bl-none flex items-center gap-3 font-mono text-[11px] text-[#107C41]">
              <Cpu className="w-4 h-4 animate-spin" /> Evaluating current dataset boundaries & routing matrix parameters...
            </div>
          </div>
        )}
      </div>

      {/* Message Command Prompt Box Footer Form Panel Layer */}
      <form onSubmit={handleAiInference} className="flex gap-3 border-t border-gray-300/10 pt-4">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask about active breaches, temperature summaries, or application structure blueprints..."
          className={`flex-1 px-4 py-3 rounded-xl focus:outline-none text-xs font-mono border transition-all ${theme.inputThemeBg}`}
        />
        <button
          type="submit"
          disabled={isThinking || !chatInput.trim()}
          className="bg-[#107C41] hover:bg-[#149B52] disabled:opacity-40 disabled:scale-100 text-white px-5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95"
        >
          Inference <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}