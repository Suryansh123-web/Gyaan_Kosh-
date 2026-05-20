import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = ({ id, message, type = 'success', duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-sky-400" />,
  };

  const borderColors = {
    success: 'border-emerald-500/20 bg-emerald-950/20 shadow-emerald-950/10',
    error: 'border-rose-500/20 bg-rose-950/20 shadow-rose-950/10',
    warning: 'border-amber-500/20 bg-amber-950/20 shadow-amber-950/10',
    info: 'border-sky-500/20 bg-sky-950/20 shadow-sky-950/10',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl min-w-[280px] max-w-sm ${borderColors[type]} pointer-events-auto`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-grow pr-2">
        <p className="text-xs font-semibold text-slate-400 font-outfit uppercase tracking-wider mb-0.5">{type}</p>
        <p className="text-sm text-slate-200 leading-snug">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-white/5"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id}>
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default { Toast, ToastContainer };
