import React from 'react';

/**
 * Original CX Intelligence Monogram & Brand Logo
 * Features an intertwined neural-loop "C" and "X" monogram with radiant violet-indigo gradient.
 */
export const CXLogo = ({ size = 'md', showText = true, subtitle = 'Enterprise Suite', className = '' }) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-lg', sub: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Original Geometric CX Neural Monogram */}
      <div className={`relative ${currentSize.icon} flex-shrink-0 group`}>
        {/* Soft Ambient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 opacity-60 blur-md group-hover:opacity-90 transition-opacity" />
        
        {/* Icon Frame */}
        <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-[#1E1B4B] via-[#0F1123] to-[#0A0B14] p-0.5 border border-violet-500/40 shadow-xl shadow-purple-950/50 flex items-center justify-center overflow-hidden">
          {/* Subtle interior glow */}
          <div className="absolute inset-0 bg-radial-at-c from-violet-500/20 via-transparent to-transparent pointer-events-none" />
          
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1.5"
          >
            <defs>
              <linearGradient id="cx-grad-primary" x1="4" y1="8" x2="44" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="45%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
              <linearGradient id="cx-grad-accent" x1="12" y1="36" x2="36" y2="12" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <filter id="cx-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Neural Connection Ring (The "C" Arc) */}
            <path
              d="M 32 14 C 27 10, 14 10, 12 24 C 10 38, 26 40, 32 34"
              stroke="url(#cx-grad-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* The "X" Cross Neural Rays */}
            <path
              d="M 24 16 L 38 34"
              stroke="url(#cx-grad-primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 38 16 L 26 32"
              stroke="url(#cx-grad-accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Core Synapse Nodes */}
            <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" filter="url(#cx-glow)" />
            <circle cx="12" cy="24" r="2" fill="#C084FC" />
            <circle cx="38" cy="16" r="2" fill="#38BDF8" />
            <circle cx="38" cy="34" r="2" fill="#A855F7" />
          </svg>
        </div>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-white font-display ${currentSize.text}`}>
              CX <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">Intelligence</span>
            </span>
          </div>
          {subtitle && (
            <span className={`block font-semibold tracking-wider uppercase text-violet-400/90 ${currentSize.sub}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
