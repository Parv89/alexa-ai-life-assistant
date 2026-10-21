import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  CheckSquare, 
  Home, 
  BarChart3, 
  Award, 
  Cpu, 
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  stats, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Voice & Chat', icon: MessageSquare, badge: 'Live' },
    { id: 'tasks', label: 'Daily Task Manager', icon: CheckSquare, count: stats?.pendingTasks ?? 0 },
    { id: 'home', label: 'Smart Home Controls', icon: Home, count: stats?.smartHomeStats?.activeDevices ?? 0 },
    { id: 'analytics', label: 'Productivity Metrics', icon: BarChart3 },
    { id: 'alexa', label: 'Alexa+ & ASK Compliance', icon: Award, highlight: true },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed md:sticky top-[61px] left-0 h-[calc(100vh-61px)] w-64 bg-[rgba(10,17,36,0.95)] md:bg-[rgba(10,17,36,0.7)] backdrop-blur-xl border-r border-[rgba(0,240,255,0.12)] p-4 flex flex-col justify-between transition-transform duration-300 z-30 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="space-y-1.5">
          <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Navigation Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    size={18} 
                    className={`transition-colors ${
                      isActive 
                        ? 'text-cyan-400' 
                        : item.highlight ? 'text-purple-400 group-hover:text-purple-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`} 
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    isActive 
                      ? 'bg-cyan-500/30 text-cyan-200' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom System Status Widget */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-slate-800 text-xs space-y-2.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Zap size={14} className="text-cyan-400" />
              Focus Score
            </span>
            <span className="font-mono font-bold text-cyan-300">{stats?.focusScore ?? 75}/100</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats?.focusScore ?? 75}%` }}
            />
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck size={12} className="text-emerald-400" />
              ASK Webhook Active
            </span>
            <span className="text-slate-400 font-mono">200 OK</span>
          </div>
        </div>

      </aside>
    </>
  );
}
