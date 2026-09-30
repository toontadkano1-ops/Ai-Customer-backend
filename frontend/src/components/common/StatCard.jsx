import React from 'react';

export const StatCard = ({ title, value, change, isPositive, icon: Icon, description, trendLabel }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1C2242] bg-[#0D0F22]/80 p-5 sm:p-6 backdrop-blur-md hover:border-violet-500/40 transition-all duration-300 group shadow-lg shadow-black/30">
      {/* Subtle top hover accent line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500/0 to-transparent group-hover:via-violet-500/60 transition-all duration-500" />
      
      {/* Top row */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 font-display">{title}</p>
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 border border-violet-500/20 group-hover:scale-110 group-hover:border-violet-500/40 group-hover:bg-violet-500/20 transition-all duration-200">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-3.5 flex items-baseline gap-3">
        <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display tabular-nums">
          {value}
        </p>
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              isPositive 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>

      {/* Subtitle / Description */}
      {(description || trendLabel) && (
        <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          {description || trendLabel}
        </p>
      )}
    </div>
  );
};
