import React, { useRef, useEffect } from 'react';
import { Trash2, ArrowUp } from 'lucide-react';

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onClearChat,
  disabled = false,
  placeholder = "Type your query...",
}) => {
  const textareaRef = useRef(null);

  // Auto-resize height based on text content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full flex items-end space-x-3 p-4 bg-[#030014]/40 border-t border-white/5 backdrop-blur-md">
      {/* Clear conversation button */}
      <button
        onClick={onClearChat}
        className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all flex-shrink-0"
        title="Clear conversation"
      >
        <Trash2 className="w-4.5 h-4.5" />
      </button>

      {/* Input textbox wrapper */}
      <div className="flex-grow relative rounded-2xl border border-white/10 bg-white/[0.02] focus-within:border-purple-500/50 focus-within:bg-white/[0.04] transition-all flex items-end p-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full pl-3 pr-12 py-2 text-sm bg-transparent resize-none text-slate-100 placeholder-slate-500 outline-none border-none max-h-[180px] overflow-y-auto leading-relaxed"
        />

        {/* Action Button: Send message */}
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="absolute right-2 bottom-2 w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 hover:scale-[1.03] transition-all disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowUp className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
