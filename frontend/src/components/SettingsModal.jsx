import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Server, Cpu, Database, Save, RotateCcw, Link2 } from 'lucide-react';
import { getBackendURL, setBackendURL } from '../services/api';

export const SettingsModal = ({
  isOpen,
  onClose,
  onSave,
  backendOnline,
  ollamaOnline,
  dbCount
}) => {
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrlInput(getBackendURL());
    }
  }, [isOpen]);

  const handleSave = () => {
    setBackendURL(urlInput);
    onSave(urlInput);
  };

  const handleReset = () => {
    setUrlInput('http://127.0.0.1:5000');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-[#030014]/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-md rounded-2xl glass-panel p-6 shadow-2xl relative border border-white/10 overflow-hidden"
      >
        {/* Top Glow background decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-500/10 filter blur-3xl pointer-events-none" />

        {/* Header section */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 relative z-10">
          <div>
            <h2 className="text-lg font-bold font-outfit text-slate-100 uppercase tracking-wider">
              System Settings
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              Configure endpoints & environment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body section */}
        <div className="py-6 space-y-6 relative z-10">
          {/* Backend url config */}
          <div className="space-y-2">
            <label className="text-[11px] text-purple-400 font-outfit uppercase tracking-widest font-extrabold flex items-center space-x-1">
              <Link2 className="w-3.5 h-3.5" />
              <span>Backend Endpoint URL</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://127.0.0.1:5000"
                className="flex-grow px-3 py-2 text-sm rounded-xl glass-input text-slate-200"
              />
              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
                title="Reset to default URL"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Service Connections details */}
          <div className="space-y-3">
            <h3 className="text-[11px] text-purple-400 font-outfit uppercase tracking-widest font-extrabold">
              Service Infrastructure Status
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              {/* Backend API server indicator */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex items-center space-x-3">
                  <Server className={`w-4 h-4 ${backendOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <div>
                    <p className="text-xs font-semibold text-slate-200 font-outfit uppercase tracking-wider">Flask API Server</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{getBackendURL()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span className={`text-[10px] font-bold font-outfit uppercase tracking-wider ${backendOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {backendOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Ollama Mistral LLM indicator */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex items-center space-x-3">
                  <Cpu className={`w-4 h-4 ${ollamaOnline ? 'text-purple-400' : 'text-rose-400'}`} />
                  <div>
                    <p className="text-xs font-semibold text-slate-200 font-outfit uppercase tracking-wider">Ollama Model</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Mistral local LLM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${ollamaOnline ? 'bg-purple-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span className={`text-[10px] font-bold font-outfit uppercase tracking-wider ${ollamaOnline ? 'text-purple-400' : 'text-rose-400'}`}>
                    {ollamaOnline ? 'Loaded' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {/* Vector Database volume */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-200 font-outfit uppercase tracking-wider">Vector DB Volume</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">document_chunks records</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-outfit">
                    {dbCount} Chunks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex space-x-3 pt-4 border-t border-white/5 relative z-10">
          <button
            onClick={onClose}
            className="flex-grow py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs font-outfit uppercase tracking-wider font-extrabold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-grow flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white text-xs font-outfit uppercase tracking-wider font-extrabold shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsModal;
