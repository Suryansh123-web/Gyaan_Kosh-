import React from 'react';
import { Settings, Sparkles, Server, Cpu, Database, BookOpen } from 'lucide-react';

export const Navbar = ({ 
  backendOnline, 
  ollamaOnline, 
  dbCount, 
  onOpenSettings,
  activeDocuments = []
}) => {
  return (
    <header className="glass-panel border-b border-white/5 h-16 w-full sticky top-0 z-40 px-6 flex items-center justify-between backdrop-blur-md">
      {/* Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-outfit font-extrabold text-lg tracking-wider bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent uppercase">
            Gyaan Kosh
          </span>
          <span className="text-[10px] text-purple-400 font-bold block leading-none tracking-widest font-outfit uppercase">
            Study RAG Sandbox
          </span>
        </div>
      </div>

      {/* Selected Document Indicator */}
      <div className="hidden md:flex items-center space-x-2 py-1.5 px-3 rounded-full bg-white/5 border border-white/10 max-w-sm truncate">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 animate-pulse" />
        <span className="text-[10px] text-purple-300 font-outfit uppercase font-semibold tracking-wider">
          Query Context:
        </span>
        <span className="text-xs text-slate-200 font-medium truncate" title={activeDocuments && activeDocuments.length > 0 ? activeDocuments.join(', ') : ''}>
          {activeDocuments && activeDocuments.length > 0 
            ? activeDocuments.length === 1 
              ? activeDocuments[0] 
              : `${activeDocuments.length} Files Selected` 
            : "All Indexed Files"}
        </span>
      </div>

      {/* Connectivity Status & Actions */}
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Backend Status indicator */}
          <div className="flex items-center space-x-1.5" title={backendOnline ? "Backend Server Online" : "Backend Server Offline"}>
            <Server className={`w-3.5 h-3.5 ${backendOnline ? 'text-emerald-400' : 'text-rose-400'}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          </div>

          {/* Ollama status indicator */}
          <div className="flex items-center space-x-1.5" title={ollamaOnline ? "Ollama Mistral Online" : "Ollama Mistral Offline"}>
            <Cpu className={`w-3.5 h-3.5 ${ollamaOnline ? 'text-purple-400' : 'text-rose-400'}`} />
            <span className={`w-1.5 h-1.5 rounded-full ${ollamaOnline ? 'bg-purple-500 animate-pulse' : 'bg-rose-500'}`} />
          </div>

          {/* DB Chunks Count */}
          <div className="flex items-center space-x-1.5" title="Indexed chunks in Vector DB">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded font-outfit font-bold">
              {dbCount} Chunks
            </span>
          </div>
        </div>

        {/* Settings gear trigger */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-all"
          title="Open Settings"
        >
          <Settings className="w-4 h-4 hover:rotate-45 transition-transform" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
