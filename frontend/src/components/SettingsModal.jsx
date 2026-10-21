import React from 'react';
import { 
  Settings, 
  Database, 
  Volume2, 
  User, 
  Shield, 
  X, 
  CheckCircle2, 
  RefreshCw,
  Server,
  Key
} from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  userName, 
  setUserName, 
  dbStatus, 
  onRefreshData 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-lg p-6 space-y-5 border-[rgba(0,240,255,0.3)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] animate-fade-in text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Settings size={18} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">System Settings & Architecture</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* User Identity */}
        <div className="space-y-2">
          <label className="text-slate-300 font-semibold flex items-center gap-1.5">
            <User size={13} className="text-cyan-400" />
            <span>Assistant Greeting Name</span>
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input-field text-xs"
            placeholder="e.g. Executive, Parv, Sarah"
          />
          <p className="text-[10px] text-slate-500">Customizes Alexa's voice and dashboard greeting salutations.</p>
        </div>

        {/* Database & Infrastructure Status */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Database size={14} className={dbStatus?.isConnected ? 'text-emerald-400' : 'text-amber-400'} />
              Database Engine
            </span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
              dbStatus?.isConnected 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {dbStatus?.isConnected ? 'MongoDB Active' : 'In-Memory Fallback'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Host:</span>
              <span className="text-slate-300">{dbStatus?.host || 'Local Memory Store'}</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-slate-300">{dbStatus?.dbName || 'alexa_ai_assistant'}</span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="text-cyan-300 uppercase">{dbStatus?.mode || 'mongodb'}</span>
            </div>
          </div>

          {!dbStatus?.isConnected && (
            <p className="text-[10px] text-amber-300/90 pt-1 leading-relaxed border-t border-slate-800">
              Note: To connect to MongoDB, start the <code>mongod</code> service or set <code>MONGODB_URI</code> in <code>backend/.env</code>. The app functions seamlessly with full CRUD in either mode!
            </p>
          )}
        </div>

        {/* Security & API Keys Guarantee */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
          <Shield size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-slate-200">Zero Client-Side Key Exposure</p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              All credentials and environment variables stay securely encapsulated on the Express backend. No API keys or database connection secrets are ever shipped to the browser bundle.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              onRefreshData();
              onClose();
            }}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={13} />
            <span>Resync All Data</span>
          </button>

          <button onClick={onClose} className="btn-primary text-xs">
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
}
