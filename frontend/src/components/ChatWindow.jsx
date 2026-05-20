import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, CornerDownRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SourceCard from './SourceCard';
import { TypingIndicator } from './Loader';
import { EmptyState } from './EmptyState';

export const ChatWindow = ({
  messages = [],
  loading = false,
  onSuggestionClick,
  activeDocument = null,
}) => {
  const bottomRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  // Auto scroll to bottom when messages or loading states change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-10rem)] bg-gradient-to-b from-[#030014]/10 to-[#030014]/60 overflow-y-auto">
      <div className="flex-grow max-w-4xl mx-auto w-full p-6 space-y-6">
        {messages.length === 0 ? (
          <EmptyState type="chat" onSuggestionClick={onSuggestionClick} />
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex space-x-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Icon Avatar */}
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                {/* Content Bubble container */}
                <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Bubble shape */}
                  <div className={`p-4 rounded-2xl border leading-relaxed text-sm ${
                    isUser
                      ? 'bg-gradient-to-tr from-purple-600/80 to-indigo-500/80 border-purple-500/30 text-white rounded-tr-none shadow-[0_4px_15px_rgba(139,92,246,0.1)]'
                      : 'bg-white/5 border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
                  }`}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap font-sans text-slate-100">{message.content}</p>
                    ) : (
                      <div className="prose prose-invert max-w-none text-slate-200 text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Actions details row */}
                  <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-500 px-1 font-outfit font-bold uppercase tracking-wider">
                    <span>{message.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(message.id, message.content)}
                        className="flex items-center space-x-1 hover:text-slate-300 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                    {message.docScope && (
                      <span className="text-purple-400 font-semibold truncate max-w-[120px]">
                        Scope: {message.docScope}
                      </span>
                    )}
                  </div>

                  {/* Sources Accordions */}
                  {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="mt-4 w-full space-y-2 border-t border-white/5 pt-3">
                      <div className="flex items-center space-x-1.5 mb-2 text-purple-400">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-outfit uppercase font-extrabold tracking-wider">
                          Retrieved Vector Chunks
                        </span>
                      </div>
                      <div className="space-y-1.5 w-full">
                        {message.sources.map((src, sIdx) => (
                          <SourceCard
                            key={sIdx}
                            index={sIdx}
                            content={src}
                            docName={message.docScope || activeDocument || 'Indexed Context'}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Icon Avatar */}
                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {/* Typing Loading Indicator bubble */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-4 w-full justify-start"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
