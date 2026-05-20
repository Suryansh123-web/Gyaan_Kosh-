import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import UploadBox from './components/UploadBox';
import SettingsModal from './components/SettingsModal';
import { ToastContainer } from './components/Toast';
import LandingPage from './pages/LandingPage';
import { 
  uploadFile, 
  askQuestion, 
  getDocuments, 
  seedDatabase, 
  checkHealth 
} from './services/api';

export default function App() {
  const [view, setView] = useState('landing'); // landing | workspace
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  
  const [messages, setMessages] = useState([]);

  // Toggle selection helper for NotebookLM-style multiple scoping
  const handleToggleDoc = (docName) => {
    if (docName === '__CLEAR__') {
      setSelectedDocs([]);
      addToast("Cleared context scope. Searching all files.", "info");
      return;
    }
    
    setSelectedDocs((prev) => {
      if (prev.includes(docName)) {
        const updated = prev.filter((d) => d !== docName);
        if (updated.length === 0) {
          addToast("Cleared context scope. Searching all files.", "info");
        } else {
          addToast(`Deselected "${docName}". ${updated.length} files in scope.`, "info");
        }
        return updated;
      } else {
        const updated = [...prev, docName];
        addToast(`Added "${docName}" to context scope.`, "success");
        return updated;
      }
    });
  };
  const [input, setInput] = useState('');
  const [asking, setAsking] = useState(false);
  
  const [toasts, setToasts] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [dbCount, setDbCount] = useState(0);

  // Add a toast notification helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Ping Backend Health status
  const runHealthCheck = async () => {
    try {
      await checkHealth();
      setBackendOnline(true);
      // Backend is online, let's assume local Ollama Mistral is responsive
      setOllamaOnline(true);
    } catch (err) {
      setBackendOnline(false);
      setOllamaOnline(false);
    }
  };

  // Fetch document lists
  const fetchDocuments = async (silent = false) => {
    if (!silent) setLoadingDocs(true);
    try {
      const res = await getDocuments();
      if (res && res.documents) {
        setDocuments(res.documents);
        // Estimate chunks count based on simple document counts (or retrieve)
        setDbCount(res.documents.length * 8 + 4);
      }
    } catch (err) {
      if (!silent) {
        addToast("Failed to fetch documents from database. Make sure backend is running.", "error");
      }
    } finally {
      if (!silent) setLoadingDocs(false);
    }
  };

  // Periodic health checks and list refresh
  useEffect(() => {
    runHealthCheck();
    const healthInterval = setInterval(runHealthCheck, 8000);
    return () => clearInterval(healthInterval);
  }, []);

  useEffect(() => {
    if (view === 'workspace') {
      fetchDocuments();
    }
  }, [view]);

  // Handle Ask Query
  const handleAsk = async () => {
    if (!input.trim() || asking) return;
    
    const queryText = input;
    setInput('');
    setAsking(true);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append optimistic user bubble
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp,
      docScope: selectedDocs.join(', ') || null
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      if (!backendOnline) {
        throw new Error("Backend server is offline. Check settings and run Flask API.");
      }

      const res = await askQuestion(queryText, selectedDocs);
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append AI bubble
      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        sources: res.sources || [],
        timestamp: aiTimestamp,
        docScope: selectedDocs.join(', ') || null
      };

      setMessages((prev) => [...prev, aiMsg]);
      
      if (res.answer === "Not found in document") {
        addToast("Query returned no matching segments from document.", "warning");
      }
    } catch (err) {
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addToast(err.message || "Failed to ask question", "error");
      
      const errorMsg = {
        id: `ai-${Date.now()}-error`,
        role: 'assistant',
        content: `### ⚠️ Connection Interrupted\n\nI was unable to retrieve an answer from Gyaan Kosh. Please verify:\n1. Your local Flask server is running on \`http://127.0.0.1:5000\`\n2. Ollama local LLM application is active\n3. You have pulled the Mistral model (\`ollama pull mistral\`)`,
        timestamp: aiTimestamp,
        docScope: selectedDocs.join(', ') || null
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setAsking(false);
    }
  };

  // Upload handler callbacks
  const handleUploadStart = (filename) => {
    addToast(`Uploading and embedding: ${filename}...`, "info");
  };

  const handleUploadSuccess = async (file) => {
    try {
      const res = await uploadFile(file);
      addToast(`Document "${file.name}" indexed successfully! generated ${res.chunks} chunks.`, "success");
      await fetchDocuments(true);
    } catch (err) {
      throw new Error(err.response?.data?.error || "CORS or Backend failure during upload");
    }
  };

  const handleUploadError = (filename, error) => {
    addToast(`Failed to parse ${filename}: ${error}`, "error");
  };

  // Database Seeding callback
  const handleSeedKB = async () => {
    setSeeding(true);
    addToast("Scanning knowledge base folder for seed documents...", "info");
    try {
      const res = await seedDatabase();
      addToast(`Knowledge base seeded successfully! Indexed ${res.total_chunks} chunks.`, "success");
      await fetchDocuments(true);
    } catch (err) {
      addToast("Seeding failed. Verify files exist in your local backend `knowledge_base` folder.", "error");
    } finally {
      setSeeding(false);
    }
  };

  // Clear Chat Thread callback
  const handleClearChat = () => {
    if (messages.length === 0) return;
    setMessages([]);
    addToast("Conversation workspace cleared.", "info");
  };

  // Settings Save callback
  const handleSettingsSave = (newUrl) => {
    setIsSettingsOpen(false);
    addToast("Backend server URL updated.", "success");
    runHealthCheck();
    fetchDocuments();
  };

  const handleSuggestionClick = (suggestionPrompt) => {
    setInput(suggestionPrompt);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-slate-100 flex flex-col font-sans select-none overflow-hidden relative">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            className="w-full h-full"
          >
            <LandingPage onEnterWorkspace={() => setView('workspace')} />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full min-h-screen flex flex-col justify-between"
          >
            {/* Navbar Header */}
            <Navbar 
              backendOnline={backendOnline} 
              ollamaOnline={ollamaOnline} 
              dbCount={dbCount} 
              onOpenSettings={() => setIsSettingsOpen(true)}
              activeDocuments={selectedDocs}
            />

            {/* Main Dashboard Layout */}
            <div className="flex-grow flex overflow-hidden">
              {/* Left Column: Sidebar Document Repositories */}
              <Sidebar 
                documents={documents}
                loading={loadingDocs}
                selectedDocs={selectedDocs}
                onToggleDoc={handleToggleDoc}
                onSeedKB={handleSeedKB}
                seeding={seeding}
              />

              {/* Center Column: Chat Viewport Workspace */}
              <main className="flex-grow flex flex-col justify-between relative bg-black/10">
                <ChatWindow 
                  messages={messages}
                  loading={asking}
                  onSuggestionClick={handleSuggestionClick}
                  activeDocument={selectedDocs.join(', ') || null}
                />
                
                <ChatInput 
                  value={input}
                  onChange={setInput}
                  onSubmit={handleAsk}
                  onClearChat={handleClearChat}
                  disabled={asking}
                  placeholder={
                    selectedDocs.length > 0 
                      ? `Ask about ${selectedDocs.length === 1 ? `"${selectedDocs[0]}"` : `${selectedDocs.length} files`}...` 
                      : "Ask a question from all indexed documents..."
                  }
                />
              </main>

              {/* Right Column: Upload Box workspace (Notebook style panel) */}
              <aside className="w-80 h-[calc(100vh-4rem)] border-l border-white/5 bg-[#030014]/30 backdrop-blur-md p-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 font-outfit uppercase tracking-widest">Document Sandbox</h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      Upload textbook PDFs, DOCX essays, spreadsheets, or txt notes. Once uploaded, they are automatically vectorized.
                    </p>
                  </div>
                  <UploadBox 
                    onUploadStart={handleUploadStart}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                  />
                </div>
                <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                  <div className="flex items-center space-x-1.5 text-purple-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-outfit uppercase font-bold tracking-widest">Sandbox guidelines</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Queries are synthesized using local embeddings. Select a document on the left sidebar to scope vector searches down to that specific file context.
                  </p>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Modals & Toast Alerts */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
        backendOnline={backendOnline}
        ollamaOnline={ollamaOnline}
        dbCount={dbCount}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
