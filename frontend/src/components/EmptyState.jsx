import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Terminal, Book } from 'lucide-react';

export const EmptyState = ({ type = 'chat', onSuggestionClick }) => {
  const chatSuggestions = [
    {
      title: "Synthesize the core message",
      desc: "Summarize the primary objectives, arguments, and conclusions of the document.",
      icon: <Book className="w-5 h-5 text-indigo-400" />,
      query: "What is the main summary and core objective of this document?"
    },
    {
      title: "Scan for key skills & names",
      desc: "Extract technical skills, methodologies, names, or contact points listed.",
      icon: <Terminal className="w-5 h-5 text-purple-400" />,
      query: "What specific skills, tools, and experience are mentioned here?"
    },
    {
      title: "List main takeaways",
      desc: "Generate a bulleted summary of key findings, action items, or major definitions.",
      icon: <Sparkles className="w-5 h-5 text-fuchsia-400" />,
      query: "List the top 5 key takeaways and action points from this document."
    }
  ];

  if (type === 'documents') {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center h-48 border border-white/5 bg-white/[0.01] rounded-xl backdrop-blur-md">
        <BookOpen className="w-8 h-8 text-purple-400/30 mb-3 animate-pulse" />
        <p className="text-sm font-semibold text-slate-300 font-outfit">No documents indexed yet</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
          Upload PDF, DOCX, TXT, or XLSX files to build your vector database.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-12 px-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6"
      >
        <Sparkles className="w-8 h-8 text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl font-extrabold tracking-tight font-outfit bg-gradient-to-r from-white via-slate-200 to-purple-200 bg-clip-text text-transparent mb-3"
      >
        Gyaan Kosh Study Assistant
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base text-slate-400 max-w-md mb-10 leading-relaxed font-sans"
      >
        Your local private study sandbox. Upload files, generate semantic vector embeddings, and search with RAG.
      </motion.p>

      {/* Suggestion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
        {chatSuggestions.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => onSuggestionClick(item.query)}
            className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group glass-panel glass-panel-hover"
          >
            <div className="p-2.5 rounded-lg bg-white/5 w-fit mb-4 group-hover:bg-purple-500/10 group-hover:text-purple-300 transition-colors">
              {item.icon}
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1.5 font-outfit group-hover:text-purple-200 transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
