import React from 'react';
import AgentCard from './AgentCard';
import { ArrowRight } from 'lucide-react';

function Connector({ active, done, darkMode }) {
  return (
    <div className="hidden sm:flex flex-col items-center justify-center w-14 flex-shrink-0 relative">
      {/* Line */}
      <div className={`h-0.5 w-full rounded-full transition-all duration-700 relative overflow-hidden
        ${done ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : darkMode ? 'bg-white/10' : 'bg-black/10'}
      `}>
        {/* Moving dot */}
        {active && (
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-400"
            style={{
              animation: 'connectFlow 1.4s linear infinite',
              boxShadow: '0 0 8px 3px rgba(124,58,237,0.7)',
            }}
          />
        )}
      </div>

      {/* Arrow icon */}
      <ArrowRight
        size={14}
        className={`mt-1 transition-colors duration-500 ${
          done ? 'text-cyan-400' : active ? 'text-purple-400 animate-pulse' : darkMode ? 'text-gray-700' : 'text-gray-300'
        }`}
      />
    </div>
  );
}

export default function AgentPipeline({ agents, topic, darkMode }) {
  const activeId   = agents.find(a => a.status === 'processing')?.id ?? null;
  const completeIds = agents.filter(a => a.status === 'complete').map(a => a.id);
  const allDone    = agents.every(a => a.status === 'complete');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Agent Pipeline
          </h3>
          {topic && (
            <p className={`text-xs mt-0.5 truncate max-w-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Topic: <span className="text-purple-400 font-medium">{topic}</span>
            </p>
          )}
        </div>
        {allDone && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-semibold">All agents complete</span>
          </div>
        )}
      </div>

      {/* Cards + connectors */}
      <div className="flex items-stretch gap-2 sm:gap-0">
        {agents.map((agent, idx) => (
          <React.Fragment key={agent.id}>
            <div className="flex-1 min-w-0">
              <AgentCard agent={agent} darkMode={darkMode} />
            </div>
            {idx < agents.length - 1 && (
              <Connector
                active={activeId === agent.id + 1}
                done={completeIds.includes(agent.id) && completeIds.includes(agent.id + 1)}
                darkMode={darkMode}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile step indicator */}
      <div className="sm:hidden flex justify-center gap-2 mt-4">
        {agents.map(a => (
          <div
            key={a.id}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              a.status === 'complete'   ? 'bg-green-400' :
              a.status === 'processing' ? 'bg-purple-400 animate-pulse' :
              darkMode ? 'bg-white/10' : 'bg-black/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
