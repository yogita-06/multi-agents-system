import React, { useRef, useEffect, useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
  'Artificial Intelligence in Healthcare',
  'Climate Change Solutions 2024',
  'Quantum Computing Applications',
  'Web3 and Blockchain Technology',
  'Space Exploration Milestones',
  'Renewable Energy Innovations',
  'Neuroscience and Brain-Computer Interfaces',
];

export default function SearchBar({ topic, setTopic, onSearch, darkMode }) {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [suggIdx, setSuggIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Animated placeholder typewriter
  useEffect(() => {
    if (focused || topic) return;

    const current = SUGGESTIONS[suggIdx];
    const delay = deleting ? 40 : (charIdx === current.length ? 1800 : 60);

    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setPlaceholder(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setPlaceholder(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setSuggIdx(i => (i + 1) % SUGGESTIONS.length);
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [focused, topic, suggIdx, charIdx, deleting]);

  const handleKey = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 animate-fade-in-up">
      {/* Hero heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">Powered by 3 AI Agents</span>
        </div>
        <h2 className={`text-4xl sm:text-5xl font-bold leading-tight mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          What would you like to{' '}
          <span className="gradient-text">research</span> today?
        </h2>
        <p className={`text-base max-w-xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Enter any topic and our three specialized AI agents will research, analyze, and write
          a professional report — in under 2 minutes.
        </p>
      </div>

      {/* Search input card */}
      <div
        className={`relative rounded-2xl p-1 transition-all duration-300 ${
          focused
            ? 'shadow-[0_0_0_2px_#7C3AED,0_0_40px_rgba(124,58,237,0.3)]'
            : darkMode
              ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
              : 'shadow-[0_0_0_1px_rgba(0,0,0,0.08)] shadow-lg'
        }`}
        style={{
          background: focused
            ? 'linear-gradient(#0F0F1A, #0F0F1A) padding-box, linear-gradient(135deg,#7C3AED,#06B6D4) border-box'
            : undefined,
        }}
      >
        <div className={`flex items-center gap-3 rounded-xl px-5 py-4 ${darkMode ? 'bg-[#0F0F1A]' : 'bg-white'}`}>
          {/* Icon */}
          <div className={`flex-shrink-0 transition-colors ${focused ? 'text-purple-400' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Search size={20} />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            placeholder={focused ? 'Enter any research topic...' : (placeholder || 'Enter any research topic...')}
            className={`flex-1 bg-transparent outline-none text-base font-medium placeholder-opacity-40
              ${darkMode ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
          />

          {/* Typewriter cursor when not focused and no input */}
          {!focused && !topic && (
            <span className="cursor-blink text-purple-500 text-lg leading-none select-none">|</span>
          )}

          {/* Search button */}
          <button
            onClick={onSearch}
            disabled={!topic.trim()}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
              bg-gradient-to-r from-purple-600 to-purple-700
              hover:from-purple-500 hover:to-purple-600
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200
              hover:shadow-[0_0_24px_rgba(124,58,237,0.6)]
              active:scale-95"
          >
            <span>Start Research</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Try:</span>
        {SUGGESTIONS.slice(0, 4).map((s) => (
          <button
            key={s}
            onClick={() => { setTopic(s); setTimeout(onSearch, 100); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200
              ${darkMode
                ? 'border-white/10 text-gray-400 hover:border-purple-500/50 hover:text-purple-300 hover:bg-purple-500/10'
                : 'border-gray-200 text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50'
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="mt-10 flex justify-center gap-8 sm:gap-16">
        {[
          { label: 'AI Agents', value: '3' },
          { label: 'Avg. Report Time', value: '~90s' },
          { label: 'Words Generated', value: '1,000+' },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-bold gradient-text">{value}</div>
            <div className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
