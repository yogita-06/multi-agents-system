import React from 'react';

export default function ProgressBar({ value = 0 }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {/* Track */}
      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out shimmer-bar"
          style={{
            width: `${clamped}%`,
            background: 'linear-gradient(90deg, #7C3AED 0%, #9F67FF 40%, #06B6D4 100%)',
            backgroundSize: '200% 100%',
          }}
        />
        {/* Animated glow dot at leading edge */}
        {clamped > 0 && clamped < 100 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_3px_rgba(124,58,237,0.8)] transition-all duration-700"
            style={{ left: `calc(${clamped}% - 6px)` }}
          />
        )}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-600">0%</span>
        <span className="text-[10px] font-bold text-purple-400">{clamped}%</span>
        <span className="text-[10px] text-gray-600">100%</span>
      </div>
    </div>
  );
}
