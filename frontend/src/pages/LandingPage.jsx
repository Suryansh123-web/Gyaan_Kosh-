import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Zap, Database, Brain } from 'lucide-react';

export const LandingPage = ({ onEnterWorkspace }) => {
  const features = [
    {
      title: "Semantic Vector RAG",
      desc: "Automatically chunks, hashes, and indexes files into vector space using cosine distance search.",
      icon: <Database className="w-5 h-5 text-purple-400" />
    },
    {
      title: "Private Mistral LLM",
      desc: "Invokes Ollama natively. Your study texts never touch external servers or public clouds.",
      icon: <Brain className="w-5 h-5 text-indigo-400" />
    },
    {
      title: "Context Scoped Querying",
      desc: "Restricts RAG context directly to specific files or search bounds, preventing model hallucinations.",
      icon: <Sparkles className="w-5 h-5 text-fuchsia-400" />
    },
    {
      title: "Multi-Format Parsing",
      desc: "Supports DOCX reports, PDF textbooks, spreadsheet tables, and clean TXT logs effortlessly.",
      icon: <Zap className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030014] overflow-hidden flex flex-col justify-between font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Dynamic Cosmic Glow Backdrop */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 filter blur-[120px] animate-glow-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 filter blur-[120px] animate-glow-slow" style={{ animationDelay: '-4s' }} />

      {/* Floating dots backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015),transparent)] pointer-events-none" />

      {/* Landing Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-outfit font-black text-sm tracking-widest uppercase bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Gyaan Kosh
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-outfit font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
          <span>v1.0.0 Local Sandbox</span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-grow flex flex-col items-center justify-center relative z-10 text-center">
        {/* Glowing badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/[0.03] text-purple-300 text-xs font-outfit uppercase tracking-widest font-extrabold"
        >
          <Brain className="w-3.5 h-3.5 animate-pulse" />
          <span>Next-Generation AI RAG Study Assistant</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight font-outfit mb-6 max-w-3xl leading-[1.1] text-white"
        >
          Your Local Documents,{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            Supercharged by AI
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-slate-400 max-w-xl mb-10 leading-relaxed"
        >
          Gyaan Kosh indexes textbooks, notes, spreadsheets, and files locally. Search, chat, and synthesize answers offline with 100% data safety.
        </motion.p>

        {/* Hero CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20"
        >
          <button
            onClick={onEnterWorkspace}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 py-4 px-8 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-outfit font-bold uppercase tracking-wider text-sm shadow-xl shadow-purple-500/25 hover:scale-[1.03] transition-all cursor-pointer"
          >
            <span>Enter Study Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Features Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] glass-panel glass-panel-hover"
            >
              <div className="p-3 rounded-xl bg-white/5 w-fit mb-4 text-purple-400">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-200 mb-2 font-outfit uppercase tracking-wider">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Landing Footer */}
      <footer className="max-w-6xl mx-auto w-full px-6 py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs relative z-10">
        <p className="font-sans">© 2026 Gyaan Kosh. Designed for local air-gapped sandboxes.</p>
        <div className="flex items-center space-x-4 mt-3 md:mt-0 font-outfit uppercase font-bold tracking-wider">
          <span className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-purple-400/80" />
            <span>Local DB Privacy</span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
