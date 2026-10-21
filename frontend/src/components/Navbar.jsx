import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Settings, 
  Award, 
  Database, 
  Radio, 
  Menu, 
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ 
  onOpenVoiceModal, 
  onOpenSettings, 
  onOpenAlexaModal, 
  dbStatus, 
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[rgba(6,11,20,0.85)] backdrop-blur-xl border-b border-[rgba(0,240,255,0.15)] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-slate-300 hover:text-cyan-400 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Glowing Alexa Halo Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/30 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_22px_rgba(0,240,255,0.6)] transition-all">
              <span className="w-4 h-4 rounded-full border-2 border-cyan-300 animate-ping opacity-30 absolute"></span>
              <Sparkles className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                  Alexa <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">AI Life</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-mono tracking-widest uppercase">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Executive Life, IoT & Productivity Suite</p>
            </div>
          </div>
        </div>

        {/* Center: Live Time & Date */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{dateStr}</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-300 font-semibold">{timeStr}</span>
        </div>

        {/* Right: Actions & Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Database Status Badge */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-help"
            title={dbStatus?.isConnected ? `Connected to MongoDB (${dbStatus.host || 'local'})` : 'Operating in In-Memory Fallback Mode'}
            style={{
              backgroundColor: dbStatus?.isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.12)',
              borderColor: dbStatus?.isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
              color: dbStatus?.isConnected ? '#34D399' : '#FBBF24',
            }}
          >
            <Database size={13} className={dbStatus?.isConnected ? 'text-emerald-400' : 'text-amber-400'} />
            <span className="font-mono text-[11px]">
              {dbStatus?.isConnected ? 'MongoDB Live' : 'In-Memory Mode'}
            </span>
          </div>

          {/* Hackathon Compliance Pill */}
          <button
            onClick={onOpenAlexaModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all hover:border-purple-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          >
            <Award size={14} className="text-purple-400" />
            <span className="hidden md:inline">ASK / Alexa+</span>
            <span className="md:hidden">Rules</span>
          </button>

          {/* Voice Mic Trigger Button */}
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-600/30 hover:from-cyan-500/30 hover:to-blue-600/40 border border-cyan-400/40 text-cyan-300 text-xs font-semibold shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all transform active:scale-95"
            aria-label="Activate Voice Assistant"
          >
            <Mic size={14} className="text-cyan-300 animate-pulse" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="System Settings"
            aria-label="Settings"
          >
            <Settings size={17} />
          </button>

        </div>
      </div>
    </header>
  );
}
