import React, { useState } from 'react';
import { Search, RotateCcw, Database, Layers } from 'lucide-react';
import FileCard from './FileCard';
import { SkeletonCard } from './Loader';
import { EmptyState } from './EmptyState';

export const Sidebar = ({
  documents = [],
  loading = false,
  selectedDocs = [],
  onToggleDoc,
  onSeedKB,
  seeding = false,
}) => {
  const [search, setSearch] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-80 h-[calc(100vh-4rem)] border-r border-white/5 bg-[#030014]/50 backdrop-blur-md flex flex-col flex-shrink-0 z-30">
      {/* Search Header */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search indexed files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl glass-input text-slate-200 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Scope Controls */}
      <div className="px-4 py-3 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] text-slate-400 font-outfit uppercase tracking-widest font-bold">Scope Context</span>
        </div>
        {selectedDocs && selectedDocs.length > 0 && (
          <button
            onClick={() => onToggleDoc('__CLEAR__')}
            className="flex items-center space-x-1 text-[10px] text-purple-400 hover:text-purple-300 font-outfit font-bold uppercase tracking-wider transition-colors px-2 py-1 rounded bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/20"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Scope</span>
          </button>
        )}
      </div>

      {/* Files List Panel */}
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {loading ? (
          <SkeletonCard count={3} />
        ) : documents.length === 0 ? (
          <EmptyState type="documents" />
        ) : filteredDocs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6 font-medium">
            No matching documents found.
          </p>
        ) : (
          filteredDocs.map((doc) => (
            <FileCard
              key={doc}
              name={doc}
              isSelected={selectedDocs.includes(doc)}
              onSelect={() => onToggleDoc(doc)}
            />
          ))
        )}
      </div>

      {/* Seeding Controls Panel */}
      <div className="p-4 border-t border-white/5 bg-white/[0.005]">
        <button
          onClick={onSeedKB}
          disabled={seeding || loading}
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-outfit font-bold uppercase tracking-wider text-xs border border-dashed border-purple-500/30 hover:border-purple-500 text-purple-400 hover:text-purple-300 bg-purple-500/[0.02] hover:bg-purple-500/[0.06] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Database className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
          <span>{seeding ? 'Embedding KB...' : 'Seed Knowledge Base'}</span>
        </button>
        <p className="text-[10px] text-slate-500 text-center mt-2 leading-relaxed">
          Seeds vectors from the backend's local `knowledge_base` folder.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
