import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-200 border-slate-700',
    primary: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs font-bold',
    md: 'px-3 py-1 text-xs sm:text-sm font-bold',
    lg: 'px-3.5 py-1.5 text-sm sm:text-base font-bold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
