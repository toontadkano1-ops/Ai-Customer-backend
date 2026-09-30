import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  icon: Icon
}) => {
  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 active:scale-[0.98]',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-[0.98]',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 active:scale-[0.98]',
    outline: 'border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white bg-transparent',
    ghost: 'hover:bg-slate-800 text-slate-300 hover:text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm rounded-lg font-semibold',
    md: 'px-4 py-2.5 text-sm sm:text-base rounded-xl font-bold',
    lg: 'px-6 py-3 text-base sm:text-lg rounded-2xl font-bold'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
