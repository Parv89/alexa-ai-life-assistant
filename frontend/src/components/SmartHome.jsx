import React from 'react';
import { 
  Home, 
  Lightbulb, 
  Thermometer, 
  Lock, 
  Unlock, 
  Zap, 
  Volume2, 
  Radio, 
  Sun, 
  Moon, 
  Film, 
  LogOut, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Power
} from 'lucide-react';

export default function SmartHome({ 
  devices = [], 
  onUpdateDeviceState, 
  onTriggerScene,
  isLoading 
}) {
  const activeCount = devices.filter(d => d.state && d.state.on).length;
  const totalWatts = devices.reduce((sum, d) => {
    return sum + (d.state && d.state.on && d.state.powerUsageWatts ? d.state.powerUsageWatts : 0);
  }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      
      {/* Honest Simulation Notice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900 border border-cyan-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mt-0.5 flex-shrink-0">
            <Radio size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Simulated Smart Home Environment
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                IoT Emulation Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              All connected items operate as virtual smart home endpoints. State mutations simulate real-time wattage, brightness, and climate telemetry. Architecture matches the official <strong>Alexa Smart Home Skill API</strong> & AWS IoT Device Shadow specifications.
            </p>
          </div>
        </div>

        {/* Live Power Load Pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-cyan-300 flex-shrink-0">
          <Zap size={15} className="text-amber-400" />
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Live Load</span>
            <span className="font-bold text-sm text-white">{totalWatts} W</span>
          </div>
        </div>
      </div>

      {/* Scene Presets Ribbon */}
      <div className="glass-panel p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-purple-400" />
            <h3 className="text-sm font-bold text-white">Automated Scene Presets</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {activeCount} of {devices.length} endpoints active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onTriggerScene('good_morning')}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 transition-all text-left group"
          >
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Sun size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Good Morning</p>
              <p className="text-[11px] text-slate-400">Lights 80% • 72°F • Coffee on</p>
            </div>
          </button>

          <button
            onClick={() => onTriggerScene('movie_night')}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 transition-all text-left group"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Film size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-purple-300">Movie Night</p>
              <p className="text-[11px] text-slate-400">Ambient cyan 15% • Locked</p>
            </div>
          </button>

          <button
            onClick={() => onTriggerScene('leave_home')}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 transition-all text-left group"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <LogOut size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">Leave Home (Eco)</p>
              <p className="text-[11px] text-slate-400">All lights off • Eco 66°F</p>
            </div>
          </button>
        </div>
      </div>

      {/* Connected Virtual Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {devices.map((device) => {
          const isOn = device.state?.on;
          const isLight = device.type === 'light';
          const isThermostat = device.type === 'thermostat';
          const isLock = device.type === 'lock';
          const isPlug = device.type === 'plug';
          const isSpeaker = device.type === 'speaker';

          return (
            <div 
              key={device._id} 
              className={`glass-panel p-5 space-y-4 transition-all duration-300 relative ${
                isOn ? 'border-[rgba(0,240,255,0.3)] shadow-[0_0_20px_rgba(0,240,255,0.08)]' : ''
              }`}
            >
              {/* Device Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border transition-colors ${
                    isOn 
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]' 
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
                  }`}>
                    {isLight && <Lightbulb size={20} />}
                    {isThermostat && <Thermometer size={20} />}
                    {isLock && (device.state?.locked ? <Lock size={20} /> : <Unlock size={20} />)}
                    {isPlug && <Power size={20} />}
                    {isSpeaker && <Volume2 size={20} />}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{device.name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{device.room}</p>
                  </div>
                </div>

                {/* Primary Switch (except Lock) */}
                {!isLock && (
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={!!isOn}
                      onChange={(e) => onUpdateDeviceState(device._id, { 
                        on: e.target.checked,
                        powerUsageWatts: e.target.checked ? (isPlug ? 1100 : isLight ? 15 : 200) : 0
                      })}
                    />
                    <span className="slider"></span>
                  </label>
                )}
              </div>

              {/* Specific Control 1: Lighting */}
              {isLight && (
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Brightness</span>
                    <span className="font-mono text-cyan-300 font-bold">{device.state?.brightness ?? 80}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    disabled={!isOn}
                    value={device.state?.brightness ?? 80}
                    onChange={(e) => onUpdateDeviceState(device._id, { 
                      brightness: parseInt(e.target.value, 10),
                      powerUsageWatts: Math.round((parseInt(e.target.value, 10) / 100) * 16)
                    })}
                    className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Dim (1%)</span>
                    <span>Radiant (100%)</span>
                  </div>
                </div>
              )}

              {/* Specific Control 2: Thermostat */}
              {isThermostat && (
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Ambient</span>
                      <span className="text-xl font-extrabold text-white font-mono">{device.state?.currentTemperature ?? 71}°F</span>
                    </div>

                    {/* Target adjuster */}
                    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
                      <button
                        onClick={() => onUpdateDeviceState(device._id, { targetTemperature: (device.state?.targetTemperature || 72) - 1 })}
                        className="text-cyan-400 hover:text-white font-mono font-bold text-sm px-1.5"
                      >
                        -
                      </button>
                      <span className="text-sm font-mono font-bold text-cyan-300">
                        {device.state?.targetTemperature ?? 72}°F
                      </span>
                      <button
                        onClick={() => onUpdateDeviceState(device._id, { targetTemperature: (device.state?.targetTemperature || 72) + 1 })}
                        className="text-cyan-400 hover:text-white font-mono font-bold text-sm px-1.5"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Mode tabs */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {['auto', 'cool', 'heat', 'eco'].map((m) => (
                      <button
                        key={m}
                        onClick={() => onUpdateDeviceState(device._id, { mode: m })}
                        className={`flex-1 py-1 rounded-md text-[11px] font-mono uppercase font-semibold transition-all ${
                          device.state?.mode === m
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-slate-900/60 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific Control 3: Smart Deadbolt */}
              {isLock && (
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Security Audit</span>
                      <p className={`text-xs font-mono font-bold ${device.state?.locked ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {device.state?.locked ? 'Deadbolt Secured' : 'Unlocked / Attention'}
                      </p>
                    </div>

                    <button
                      onClick={() => onUpdateDeviceState(device._id, { locked: !device.state?.locked })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                        device.state?.locked
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {device.state?.locked ? 'Unlock' : 'Lock Now'}
                    </button>
                  </div>
                </div>
              )}

              {/* Specific Control 4: Smart Plug */}
              {isPlug && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Power Consumption</span>
                    <span className="font-mono text-amber-300 font-bold">{device.state?.powerUsageWatts ?? 0} Watts</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isOn ? 'Appliance active and supplying 120V' : 'Relay open • Standby zero draw'}
                  </p>
                </div>
              )}

              {/* Specific Control 5: Speaker */}
              {isSpeaker && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Volume</span>
                    <span className="font-mono text-purple-300 font-bold">{device.state?.volume ?? 45}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    disabled={!isOn}
                    value={device.state?.volume ?? 45}
                    onChange={(e) => onUpdateDeviceState(device._id, { volume: parseInt(e.target.value, 10) })}
                    className="w-full accent-purple-400 cursor-pointer disabled:opacity-40"
                  />
                </div>
              )}

              {/* Footer Note */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={11} className="text-emerald-400" />
                  Simulated IoT Endpoint
                </span>
                <span>ID: {device._id?.slice(-4) || 'DEV'}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
