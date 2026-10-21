import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Leaf, 
  Award, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function ProductivityAnalytics({ stats, tasks = [] }) {
  const weeklyTrends = stats?.weeklyTrends || [
    { day: 'Sun', completed: 3, target: 5 },
    { day: 'Mon', completed: 5, target: 5 },
    { day: 'Tue', completed: 4, target: 5 },
    { day: 'Wed', completed: 6, target: 5 },
    { day: 'Thu', completed: 5, target: 5 },
    { day: 'Fri', completed: 7, target: 5 },
    { day: 'Sat', completed: 4, target: 5 },
  ];

  const focusScore = stats?.focusScore ?? 75;
  const categoryCounts = stats?.categoryCounts || {};
  const totalTasks = stats?.totalTasks || 1;
  const completionRate = stats?.completionRate ?? 0;

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (focusScore / 100) * circumference;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Analytics Header */}
      <div className="glass-panel p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Productivity & Intelligence Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time life performance metrics, velocity trends, and smart energy optimization.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <TrendingUp size={14} className="text-cyan-400" />
          <span>Productivity Index: +14% this week</span>
        </div>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gauge Card: Life Focus Score */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Life Focus Momentum
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="url(#cyanVioletGrad)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
              <defs>
                <linearGradient id="cyanVioletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F0FF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white font-mono">{focusScore}</span>
              <span className="text-[10px] text-cyan-300 font-mono tracking-widest uppercase">/ 100</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Derived from on-time completion rates, priority distribution, and daily task velocity.
          </div>
        </div>

        {/* Weekly Task Velocity Bar Chart */}
        <div className="md:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">7-Day Task Completion Velocity</h2>
              <p className="text-xs text-slate-400">Completed items vs daily target of 5</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Target: 5/day
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {weeklyTrends.map((item, idx) => {
              const maxVal = 8;
              const heightPct = Math.min(100, (item.completed / maxVal) * 100);
              const reachedTarget = item.completed >= item.target;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-cyan-300 transition-colors">
                    {item.completed}
                  </span>

                  <div className="w-full max-w-[34px] bg-slate-900/80 rounded-t-lg h-full flex items-end p-0.5 border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                    <div 
                      className={`w-full rounded-t-md transition-all duration-700 ${
                        reachedTarget 
                          ? 'bg-gradient-to-t from-cyan-500 to-indigo-500 shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                          : 'bg-gradient-to-t from-slate-700 to-slate-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className="text-xs font-mono text-slate-400">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Target Achieved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Below Target
            </span>
          </div>
        </div>

      </div>

      {/* Secondary Row: Category Breakdown & Smart Energy Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-purple-400" />
              <h2 className="text-sm font-bold text-white">Focus by Category</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">{stats?.totalTasks || 0} Total Items</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-xs text-slate-500">No categorized tasks yet.</p>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / totalTasks) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{cat}</span>
                      <span className="text-slate-400 font-mono">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Environmental & Smart Energy Optimization */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf size={18} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Simulated Space Efficiency</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              Eco Guard Active
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Automated Alexa away routines and intelligent thermostat scheduling decrease simulated energy overhead.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Simulated Savings</span>
              <span className="text-xl font-bold font-mono text-emerald-300">
                {stats?.smartHomeStats?.simulatedSavingsKwh || '2.40'} kWh
              </span>
              <p className="text-[10px] text-slate-500">Saved this session</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Instantaneous Load</span>
              <span className="text-xl font-bold font-mono text-cyan-300">
                {stats?.smartHomeStats?.currentPowerWatts || 0} W
              </span>
              <p className="text-[10px] text-slate-500">Across {stats?.smartHomeStats?.activeDevices || 0} active devices</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 size={15} className="flex-shrink-0" />
            <span>Smart rules running at peak 94.2% energy efficiency</span>
          </div>
        </div>

      </div>

    </div>
  );
}
