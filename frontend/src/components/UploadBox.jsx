import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, AlertTriangle, FileText, ArrowRight, Loader2 } from 'lucide-react';

export const UploadBox = ({ onUploadStart, onUploadSuccess, onUploadError }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt', 'xlsx', 'xls'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      setErrorMsg(`Unsupported file type (.${extension}). Allowed: PDF, DOCX, TXT, XLSX`);
      setUploadState('error');
      return false;
    }
    return true;
  };

  const triggerUpload = async (file) => {
    if (!validateFile(file)) return;

    setFileName(file.name);
    setUploadState('uploading');
    setProgress(15);
    onUploadStart(file.name);

    // Simulate progress while uploading to API
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await onUploadSuccess(file);
      clearInterval(progressInterval);
      setProgress(100);
      setUploadState('success');
      setTimeout(() => {
        setUploadState('idle');
        setProgress(0);
        setFileName('');
      }, 3000);
    } catch (err) {
      clearInterval(progressInterval);
      setErrorMsg(err.message || 'File processing failed');
      setUploadState('error');
      onUploadError(file.name, err.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      triggerUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept=".pdf,.docx,.doc,.txt,.xlsx,.xls"
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => uploadState === 'idle' && fileInputRef.current?.click()}
        className={`w-full rounded-2xl border border-dashed transition-all p-6 text-center select-none cursor-pointer flex flex-col items-center justify-center min-h-[180px] ${
          isDragActive
            ? 'border-purple-400 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-[1.01]'
            : uploadState === 'uploading'
            ? 'border-purple-500/30 bg-white/[0.01] cursor-wait'
            : uploadState === 'success'
            ? 'border-emerald-500/40 bg-emerald-500/5'
            : uploadState === 'error'
            ? 'border-rose-500/40 bg-rose-500/5'
            : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02] glass-panel glass-panel-hover'
        }`}
      >
        <AnimatePresence mode="wait">
          {uploadState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mb-4 text-purple-400">
                <UploadCloud className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 font-outfit mb-1">
                Drag & drop document here
              </h3>
              <p className="text-xs text-slate-400 mb-3 max-w-[240px]">
                or click to browse from explorer
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold font-outfit">
                <span>PDF</span>
                <span>•</span>
                <span>DOCX</span>
                <span>•</span>
                <span>TXT</span>
                <span>•</span>
                <span>XLSX</span>
              </div>
            </motion.div>
          )}

          {uploadState === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xs flex flex-col items-center"
            >
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-4" />
              <div className="flex items-center space-x-2 mb-2 w-full truncate justify-center">
                <FileText className="w-4 h-4 text-purple-300 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-200 truncate">{fileName}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-purple-300 font-bold font-outfit uppercase tracking-widest">
                Processing vectors... {progress}%
              </span>
            </motion.div>
          )}

          {uploadState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-3 text-emerald-400">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-semibold text-emerald-300 font-outfit mb-1">
                Upload Successful
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px] mb-1">
                {fileName}
              </p>
              <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">
                Vectors generated successfully
              </p>
            </motion.div>
          )}

          {uploadState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center mb-3 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-rose-300 font-outfit mb-1">
                Process Failed
              </h3>
              <p className="text-xs text-slate-400 max-w-[240px] mb-3 leading-snug">
                {errorMsg}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadState('idle');
                }}
                className="flex items-center space-x-1 py-1.5 px-3 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs text-slate-200 transition-all font-medium"
              >
                <span>Try Again</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadBox;
