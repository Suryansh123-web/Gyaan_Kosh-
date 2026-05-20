import React from 'react';
import { FileText, FileSpreadsheet, FileCode, File, CheckCircle2, ChevronRight } from 'lucide-react';

export const FileCard = ({ 
  name, 
  isSelected, 
  onSelect,
}) => {
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'docx':
      case 'doc':
        return <FileCode className="w-5 h-5 text-blue-400" />;
      case 'txt':
        return <FileText className="w-5 h-5 text-sky-400" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.08)]'
          : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10'
      }`}
    >
      <div className="flex items-center space-x-3 truncate">
        <div className={`p-2 rounded-lg transition-colors ${
          isSelected ? 'bg-purple-500/15' : 'bg-white/5 group-hover:bg-white/10'
        }`}>
          {getFileIcon(name)}
        </div>
        <div className="truncate flex flex-col justify-center">
          <span className={`text-sm truncate font-medium ${
            isSelected ? 'text-purple-200' : 'text-slate-300 group-hover:text-slate-200'
          }`}>
            {name}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-outfit mt-0.5 font-bold">
            {name.split('.').pop() || 'file'}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        {isSelected ? (
          <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 animate-scale-in" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
        )}
      </div>
    </div>
  );
};

export default FileCard;
