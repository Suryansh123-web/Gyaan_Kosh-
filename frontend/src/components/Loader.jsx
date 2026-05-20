import React from 'react';
import { motion } from 'framer-motion';

// TypingIndicator represents the AI thinking/typing bubble dots
export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 w-fit backdrop-blur-md">
      <span className="text-xs text-purple-300 font-medium mr-1.5 tracking-wider font-outfit uppercase">Thinking</span>
      <div className="flex space-x-1 items-center h-2">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
};

// Spinner represents a spinning glowing gradient ring
export const Spinner = ({ size = 'md', color = 'purple' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorGradients = {
    purple: 'border-t-purple-500 border-r-purple-300 border-b-indigo-500 border-l-transparent',
    cyan: 'border-t-cyan-400 border-r-teal-300 border-b-blue-500 border-l-transparent',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-solid ${sizeClasses[size]} ${colorGradients[color]}`}
        role="status"
      />
    </div>
  );
};

// SkeletonCard represents loading states for files or source cards
export const SkeletonCard = ({ count = 1 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="p-4 rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden relative"
        >
          {/* Glowing pulse bar */}
          <div className="h-4 bg-white/10 rounded-md w-1/3 animate-pulse mb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" />
            <div className="h-3 bg-white/5 rounded w-4/6 animate-pulse" />
          </div>
          {/* Subtle moving light sheen */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
        </motion.div>
      ))}
    </div>
  );
};

export default { TypingIndicator, Spinner, SkeletonCard };
