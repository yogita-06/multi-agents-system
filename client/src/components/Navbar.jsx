import React from 'react';
import { Sun, Moon, History, Zap } from 'lucide-react';

export default function Navbar({ darkMode, onToggleDark, onOpenHistory, historyCount }) {
  return (
    <header className="sticky top-0 z-30 w-full">
      {/* Blurred glass bar */}
      <div className={`w-full ${darkMode ? 'bg-[#0A0A0F]/80 border-white/5' : 'bg-white/80 border-black/5'} backdrop-blur-xl border-b`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-lg shadow-lg">
                🔬
              </div>
              {/* Live indicator dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0A0A0F] animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none gradient-text tracking-tight">
                ResearchAI
              </h1>
              <p className={`text-[10px] leading-none mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Multi-Agent Research Assistant
              </p>
            </div>
          </div>

          {/* Center pill — model badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Zap size={12} className="text-purple-400" />
            <span className="text-xs text-purple-300 font-medium">LLaMA-3.3-70B · 3 Agents</span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* History button */}
            <button
              onClick={onOpenHistory}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                }`}
              title="Research history"
            >
              <History size={16} />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Dark/light toggle */}
            <button
              onClick={onToggleDark}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                ${darkMode
                  ? 'text-yellow-400 hover:bg-yellow-400/10'
                  : 'text-purple-600 hover:bg-purple-100'
                }`}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
