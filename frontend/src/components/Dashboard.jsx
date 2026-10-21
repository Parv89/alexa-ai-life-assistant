import React from 'react';
import { 
  Sparkles, 
  Mic, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Zap, 
  Home, 
  ArrowRight, 
  Sun, 
  Moon, 
  Film, 
  LogOut,
  Calendar,
  Layers,
  Radio,
  Check
} from 'lucide-react';

export default function Dashboard({ 
  stats, 
  tasks = [], 
  devices = [], 
  onToggleTask, 
  onTriggerScene, 
  onOpenVoiceModal, 
  onNavigateTab,
  onPromptChat,
  userName = 'Executive'
}) {
  const greeting = stats?.greeting || 'Welcome back';
  const pendingTasks = tasks.filter(t => !t.completed);
  const urgentTasks = tasks.filter(t => !t.completed && (t.priority === 'urgent' || t.priority === 'high'));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#0C152B] to-[#141233] border border-[rgba(0,240,255,0.2)] shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
              <Sparkles size={13} className="text-cyan-400" />
              <span>Alexa Autonomous Intelligence Active</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {greeting}, <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{userName}</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Your life assistant is synchronized. You have{' '}
              <strong className="text-cyan-300">{pendingTasks.length} pending tasks</strong>,{' '}
              <strong className="text-purple-300">{urgentTasks.length} urgent priorities</strong>, and{' '}
              <strong className="text-emerald-300">{stats?.smartHomeStats?.activeDevices || 0} smart devices</strong> running in simulated IoT mode.
            </p>
          </div>

          {/* Quick Voice / Alexa CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenVoiceModal}
              className="btn-primary"
            >
              <Mic size={17} />
              <span>Voice Briefing</span>
            </button>

            <button
              onClick={() => onNavigateTab('chat')}
              className="btn-secondary"
            >
              <span>Ask Alexa AI</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Quick Voice Prompt Suggestions Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mr-1">
            <Radio size={13} className="text-cyan-400" />
            Try asking:
          </span>
          {[
            'What are my urgent tasks today?',
            'Turn on living room light',
            'Activate Movie Night scene',
            'Give me my daily life briefing',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onPromptChat(prompt)}
              className="text-xs px-3 py-1 rounded-full bg-slate-800/70 hover:bg-cyan-950/50 hover:border-cyan-500/40 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Productivity Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Focus Score */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Life Focus Score</span>
            <div className="p-2 rounded-xl bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
              <Zap size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats?.focusScore ?? 75}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span>●</span> Optimal momentum calculated
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${stats?.focusScore ?? 75}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Completion Rate */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Task Completion</span>
            <div className="p-2 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-500/20">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats?.completionRate ?? 0}%</span>
              <span className="text-xs text-slate-400">({stats?.completedTasks ?? 0}/{stats?.totalTasks ?? 0})</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {pendingTasks.length} tasks awaiting completion
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${stats?.completionRate ?? 0}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Urgent Items */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">High Priorities</span>
            <div className="p-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-500/20">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{urgentTasks.length}</span>
              <span className="text-xs text-rose-400 font-semibold">Need Action</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {stats?.overdueTasks ? `${stats.overdueTasks} overdue` : 'No overdue items'}
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(100, urgentTasks.length * 25)}%` }}
            />
          </div>
        </div>

        {/* Metric 4: Smart Home Power */}
        <div className="glass-panel p-5 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Simulated Smart Home</span>
            <div className="p-2 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
              <Home size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">{stats?.smartHomeStats?.activeDevices ?? 0}</span>
              <span className="text-xs text-slate-400">/ {stats?.smartHomeStats?.totalDevices ?? 5} Active</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-mono">
              ~{stats?.smartHomeStats?.currentPowerWatts ?? 0} W load
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${((stats?.smartHomeStats?.activeDevices ?? 2) / (stats?.smartHomeStats?.totalDevices ?? 5)) * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Split Section: High Priority Tasks + Smart Home Scenes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: High Priority & Today's Agenda */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers size={18} className="text-cyan-400" />
              <h2 className="text-base font-bold text-white">Priority Action Items</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                {pendingTasks.length} Active
              </span>
            </div>

            <button 
              onClick={() => onNavigateTab('tasks')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Manage All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Task Preview Items */}
          <div className="space-y-2.5">
            {pendingTasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-slate-300 font-medium">All tasks are completed!</p>
                <p className="text-xs text-slate-500 mt-1">Ask Alexa to create a new task or enjoy your focus time.</p>
              </div>
            ) : (
              pendingTasks.slice(0, 4).map((task) => (
                <div 
                  key={task._id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTask(task._id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        task.completed 
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950' 
                          : 'border-slate-600 hover:border-cyan-400 bg-slate-950/60'
                      }`}
                      aria-label="Toggle task status"
                    >
                      {task.completed && <Check size={13} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                          {task.category}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] flex items-center gap-1 text-slate-400">
                          <Clock size={11} />
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Today'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full capitalize font-semibold ${
                    task.priority === 'urgent' ? 'badge-urgent' :
                    task.priority === 'high' ? 'badge-high' :
                    task.priority === 'medium' ? 'badge-medium' : 'badge-low'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Smart Scene Presets */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home size={18} className="text-purple-400" />
              <h2 className="text-base font-bold text-white">Scene Directives</h2>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
              Simulated
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Trigger automated multi-device scenes. Directives update virtual smart home states in real time.
          </p>

          <div className="space-y-2.5">
            {/* Good Morning */}
            <button
              onClick={() => onTriggerScene('good_morning')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-500/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <Sun size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Good Morning</h3>
                  <p className="text-[11px] text-slate-400">Lights 80%, coffee on, 72°F</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Movie Night */}
            <button
              onClick={() => onTriggerScene('movie_night')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                  <Film size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-purple-300">Movie Night</h3>
                  <p className="text-[11px] text-slate-400">Ambient cyan 15%, door locked</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Leave Home */}
            <button
              onClick={() => onTriggerScene('leave_home')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                  <LogOut size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">Leave Home Mode</h3>
                  <p className="text-[11px] text-slate-400">All lights off, deadbolt locked</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('home')}
              className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Open Full Smart Home Dashboard →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
