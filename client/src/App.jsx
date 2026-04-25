import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import AgentPipeline from './components/AgentPipeline';
import ReportDisplay from './components/ReportDisplay';
import Sidebar from './components/Sidebar';
import ProgressBar from './components/ProgressBar';
import API_URL from './config';

const SERVER = API_URL;

const INITIAL_AGENTS = [
  { id: 1, name: 'Researcher', icon: '🔍', status: 'waiting', preview: null, color: 'blue' },
  { id: 2, name: 'Analyst',    icon: '🧠', status: 'waiting', preview: null, color: 'purple' },
  { id: 3, name: 'Writer',     icon: '✍️', status: 'waiting', preview: null, color: 'cyan' },
];

function loadHistory() {
  try { return JSON.parse(localStorage.getItem('researchHistory')) || []; }
  catch { return []; }
}

export default function App() {
  const [darkMode,      setDarkMode]      = useState(true);
  const [topic,         setTopic]         = useState('');
  const [phase,         setPhase]         = useState('idle'); // idle | searching | complete | error
  const [agents,        setAgents]        = useState(INITIAL_AGENTS);
  const [progress,      setProgress]      = useState(0);
  const [statusMsg,     setStatusMsg]     = useState('');
  const [report,        setReport]        = useState(null);
  const [currentTopic,  setCurrentTopic]  = useState('');
  const [wordCount,     setWordCount]     = useState(0);
  const [generatedAt,   setGeneratedAt]   = useState(null);
  const [history,       setHistory]       = useState(loadHistory);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [elapsed,       setElapsed]       = useState(0);
  const [estimatedSecs, setEstimatedSecs] = useState(90);

  const esRef    = useRef(null);
  const timerRef = useRef(null);

  // Apply dark/light class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
    document.body.style.background = darkMode ? '#0A0A0F' : '#F0F4FF';
  }, [darkMode]);

  // Elapsed timer
  useEffect(() => {
    if (phase === 'searching') {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const saveHistory = useCallback((item) => {
    setHistory(prev => {
      const deduplicated = prev.filter(h => h.topic !== item.topic);
      const next = [item, ...deduplicated].slice(0, 5);
      localStorage.setItem('researchHistory', JSON.stringify(next));
      return next;
    });
  }, []);

  const startResearch = useCallback((searchTopic) => {
    if (!searchTopic?.trim()) return;

    // Clean up any existing stream
    if (esRef.current) { esRef.current.close(); esRef.current = null; }

    const t = searchTopic.trim();
    setCurrentTopic(t);
    setPhase('searching');
    setAgents(INITIAL_AGENTS);
    setProgress(0);
    setReport(null);
    setWordCount(0);
    setGeneratedAt(null);
    setStatusMsg('Connecting to research agents...');
    setEstimatedSecs(90);

    const es = new EventSource(`${SERVER}/api/research/stream?topic=${encodeURIComponent(t)}`);
    esRef.current = es;

    es.addEventListener('agent-start', (e) => {
      const d = JSON.parse(e.data);
      setAgents(prev => prev.map(a => a.id === d.agent ? { ...a, status: 'processing' } : a));
      setProgress(Math.round(((d.agent - 1) / 3) * 100));
      setStatusMsg(d.message);
      // Rough estimate: each agent ~30s
      setEstimatedSecs((4 - d.agent) * 30);
    });

    es.addEventListener('agent-complete', (e) => {
      const d = JSON.parse(e.data);
      setAgents(prev => prev.map(a =>
        a.id === d.agent ? { ...a, status: 'complete', preview: d.preview } : a
      ));
      setProgress(Math.round((d.agent / 3) * 100));
      setStatusMsg(d.message);
    });

    es.addEventListener('complete', (e) => {
      const d = JSON.parse(e.data);
      setReport(d.report);
      setWordCount(d.wordCount || 0);
      setGeneratedAt(d.generatedAt);
      setPhase('complete');
      setProgress(100);
      setStatusMsg('Research complete!');

      saveHistory({
        id: d.researchId,
        topic: t,
        report: d.report,
        wordCount: d.wordCount || 0,
        generatedAt: d.generatedAt,
      });

      es.close();
      esRef.current = null;
    });

    es.addEventListener('error', (e) => {
      try {
        const d = JSON.parse(e.data);
        setStatusMsg(`Error: ${d.message}`);
      } catch {
        setStatusMsg('An unexpected error occurred.');
      }
      setPhase('error');
      es.close();
      esRef.current = null;
    });

    es.onerror = () => {
      if (esRef.current) {
        setPhase('error');
        setStatusMsg('Connection lost. Check that the server is running on port 3001.');
        es.close();
        esRef.current = null;
      }
    };
  }, [saveHistory]);

  const handleReset = () => {
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    setPhase('idle');
    setTopic('');
    setCurrentTopic('');
    setAgents(INITIAL_AGENTS);
    setProgress(0);
    setReport(null);
    setStatusMsg('');
    setElapsed(0);
  };

  const loadHistoryItem = (item) => {
    setCurrentTopic(item.topic);
    setTopic(item.topic);
    setReport(item.report);
    setWordCount(item.wordCount || 0);
    setGeneratedAt(item.generatedAt || null);
    setAgents(INITIAL_AGENTS.map(a => ({ ...a, status: 'complete' })));
    setPhase('complete');
    setProgress(100);
    setSidebarOpen(false);
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0A0A0F]' : 'bg-[#F0F4FF]'}`}>

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-700/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-grid opacity-100" />
      </div>

      {/* Sidebar + overlay */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        history={history}
        onSelect={loadHistoryItem}
        onClear={() => { setHistory([]); localStorage.removeItem('researchHistory'); }}
        darkMode={darkMode}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Page */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
          onOpenHistory={() => setSidebarOpen(true)}
          historyCount={history.length}
        />

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16 pt-6">

          {/* ── Progress bar + status (during search) ── */}
          {phase === 'searching' && (
            <div className="mb-8 animate-fade-in">
              <ProgressBar value={progress} />
              <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-sm text-purple-400 font-medium">{statusMsg}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>⏱ {fmt(elapsed)} elapsed</span>
                  {estimatedSecs > 0 && <span>~{fmt(Math.max(0, estimatedSecs - elapsed))} remaining</span>}
                </div>
              </div>
            </div>
          )}

          {/* ── Search (idle / error) ── */}
          {(phase === 'idle' || phase === 'error') && (
            <SearchBar
              topic={topic}
              setTopic={setTopic}
              onSearch={() => startResearch(topic)}
              darkMode={darkMode}
            />
          )}

          {/* ── Agent pipeline (searching / complete) ── */}
          {(phase === 'searching' || phase === 'complete') && (
            <div className="mb-8">
              <AgentPipeline agents={agents} topic={currentTopic} darkMode={darkMode} />
            </div>
          )}

          {/* ── Error state ── */}
          {phase === 'error' && (
            <div className="mt-6 p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-center animate-fade-in">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-red-400 text-base mb-5 font-medium">{statusMsg}</p>
              <p className="text-gray-500 text-sm mb-5">
                Make sure the server is running: <code className="text-purple-400">cd server && npm run dev</code>
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition text-white font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ── Final report ── */}
          {phase === 'complete' && report && (
            <ReportDisplay
              report={report}
              topic={currentTopic}
              wordCount={wordCount}
              generatedAt={generatedAt}
              onNewResearch={handleReset}
              darkMode={darkMode}
            />
          )}
        </main>
      </div>
    </div>
  );
}
