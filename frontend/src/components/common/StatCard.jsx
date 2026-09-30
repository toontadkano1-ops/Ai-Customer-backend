import React from 'react';

export const StatCard = ({ title, value, change, isPositive, icon: Icon, description, trendLabel }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-slate-700 transition-all duration-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
        {change !== undefined && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>

      {(description || trendLabel) && (
        <p className="mt-1 text-xs text-slate-500">
          {description || trendLabel}
        </p>
      )}
    </div>
  );
};
