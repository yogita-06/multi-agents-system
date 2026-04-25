import React from 'react';
import { X, Clock, FileText, Trash2, ChevronRight } from 'lucide-react';

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = (Date.now() - new Date(isoString)) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Sidebar({ open, onClose, history, onSelect, onClear, darkMode }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-80 z-30 flex flex-col
        ${darkMode ? 'bg-[#0D0D18] border-r border-white/5' : 'bg-white border-r border-gray-100'}
        shadow-2xl transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div>
          <h2 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Research History</h2>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {history.length} saved {history.length === 1 ? 'report' : 'reports'}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition
            ${darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <FileText size={32} className={darkMode ? 'text-gray-700' : 'text-gray-300'} />
            <p className={`mt-3 text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              No research history yet.
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>
              Start a new search to build your history.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group
                ${darkMode
                  ? 'border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5'
                  : 'border-gray-100 hover:border-purple-300 hover:bg-purple-50'
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  {/* Colored dot */}
                  <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-br from-purple-500 to-cyan-500" />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate leading-tight
                      ${darkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>
                      {item.topic}
                    </p>
                    <div className={`flex items-center gap-2 mt-1 text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      <Clock size={9} />
                      <span>{timeAgo(item.generatedAt)}</span>
                      {item.wordCount > 0 && (
                        <>
                          <span>·</span>
                          <span>{item.wordCount.toLocaleString()} words</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className={`flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5
                    ${darkMode ? 'text-gray-700 group-hover:text-purple-400' : 'text-gray-300 group-hover:text-purple-500'}`}
                />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer — clear button */}
      {history.length > 0 && (
        <div className={`px-4 py-4 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <button
            onClick={onClear}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
              transition border
              ${darkMode
                ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                : 'border-red-200 text-red-500 hover:bg-red-50'
              }`}
          >
            <Trash2 size={14} />
            Clear History
          </button>
        </div>
      )}
    </aside>
  );
}
