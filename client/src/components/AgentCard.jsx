import React from 'react';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

const COLOR_MAP = {
  blue:   { glow: 'glow-blue',   border: 'border-blue-500/40',   badge: 'bg-blue-500/20 text-blue-300',   ring: 'ring-blue-500/30',   bar: 'from-blue-600 to-blue-400'   },
  purple: { glow: 'glow-purple', border: 'border-purple-500/40', badge: 'bg-purple-500/20 text-purple-300', ring: 'ring-purple-500/30', bar: 'from-purple-600 to-purple-400' },
  cyan:   { glow: 'glow-cyan',   border: 'border-cyan-500/40',   badge: 'bg-cyan-500/20 text-cyan-300',   ring: 'ring-cyan-500/30',   bar: 'from-cyan-600 to-cyan-400'   },
};

const LABEL_MAP = {
  blue:   'Researcher',
  purple: 'Analyst',
  cyan:   'Writer',
};

export default function AgentCard({ agent, darkMode }) {
  const { status, icon, name, preview, color } = agent;
  const c = COLOR_MAP[color] || COLOR_MAP.purple;
  const isWaiting    = status === 'waiting';
  const isProcessing = status === 'processing';
  const isComplete   = status === 'complete';

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-5 glass border transition-all duration-500
        ${isProcessing ? `${c.border} ${c.glow}` : isComplete ? c.border : 'border-white/5'}
        ${isComplete ? 'animate-fade-in' : ''}
      `}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon bubble */}
        <div
          className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl
            ${isProcessing ? c.badge : isComplete ? c.badge : darkMode ? 'bg-white/5' : 'bg-black/5'}
            ${isProcessing ? `ring-2 ${c.ring}` : ''}
            transition-all duration-300
          `}
        >
          {icon}
          {isProcessing && (
            <span className="absolute inset-0 rounded-xl animate-ping opacity-30"
              style={{ background: color === 'blue' ? '#3B82F6' : color === 'purple' ? '#7C3AED' : '#06B6D4' }}
            />
          )}
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
          ${isWaiting    ? 'bg-white/5 text-gray-500' : ''}
          ${isProcessing ? `${c.badge} animate-pulse` : ''}
          ${isComplete   ? 'bg-green-500/15 text-green-400' : ''}
        `}>
          {isWaiting    && <Clock size={10} />}
          {isProcessing && <Loader2 size={10} className="animate-spin" />}
          {isComplete   && <CheckCircle2 size={10} />}
          <span>
            {isWaiting    ? 'Waiting'     : ''}
            {isProcessing ? 'Processing'  : ''}
            {isComplete   ? 'Complete'    : ''}
          </span>
        </div>
      </div>

      {/* Agent name */}
      <div className="mb-1">
        <p className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5
          ${isComplete ? 'text-green-400' : isProcessing
            ? (color === 'blue' ? 'text-blue-400' : color === 'purple' ? 'text-purple-400' : 'text-cyan-400')
            : 'text-gray-600'}
        `}>
          Agent {agent.id} — {LABEL_MAP[color]}
        </p>
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
      </div>

      {/* Preview text */}
      <div className="flex-1 mt-2 min-h-[64px]">
        {isWaiting && (
          <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'} italic`}>
            Waiting for previous agent...
          </p>
        )}
        {isProcessing && (
          <div className="space-y-2">
            {[80, 60, 45].map((w, i) => (
              <div key={i} className={`h-2 rounded-full shimmer-bar ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}
                style={{ width: `${w}%` }} />
            ))}
          </div>
        )}
        {isComplete && preview && (
          <p className={`text-xs leading-relaxed line-clamp-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {preview}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className={`mt-4 h-1 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
        {isWaiting && <div className="h-full w-0" />}
        {isProcessing && (
          <div
            className={`h-full w-3/4 rounded-full bg-gradient-to-r ${c.bar} shimmer-bar`}
            style={{ animation: 'progressBar 2s linear infinite' }}
          />
        )}
        {isComplete && (
          <div className={`h-full w-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-1000`} />
        )}
      </div>
    </div>
  );
}
