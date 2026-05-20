import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check, FileText } from 'lucide-react';

export const SourceCard = ({ index, content, docName = 'Indexed Context' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden backdrop-blur-sm transition-all hover:border-white/10">
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3.5 cursor-pointer bg-white/[0.005] select-none hover:bg-white/[0.01]"
      >
        <div className="flex items-center space-x-3 truncate pr-2">
          <div className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-md font-outfit font-bold uppercase tracking-wider">
            Source {index + 1}
          </div>
          <div className="flex items-center space-x-1.5 truncate text-slate-400 text-xs font-medium">
            <FileText className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{docName || 'Reference Segment'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors"
            title="Copy Source Segment"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <div className="text-slate-500">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-white/5 bg-black/20">
              <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SourceCard;
