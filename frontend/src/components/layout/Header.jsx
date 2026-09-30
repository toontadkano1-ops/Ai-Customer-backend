import React from 'react';
import { Search, Bell, LogOut, User, CheckCircle2, Shield, Headset, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const Header = () => {
  const { user, logout, switchDemoRole } = useAuth();

  return (
    <header className="h-16 bg-dark-surface border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-80 max-w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tickets, customers, knowledge..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Right controls: Demo Role Switcher + Profile */}
      <div className="flex items-center gap-4">
        {/* Interactive Demo Role Switcher */}
        <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1">
          <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider">
            View As:
          </span>
          <button
            onClick={() => switchDemoRole('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              user?.role === 'admin'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3 h-3" />
            Admin
          </button>
          <button
            onClick={() => switchDemoRole('agent')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              user?.role === 'agent'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Headset className="w-3 h-3" />
            Support Agent
          </button>
          <button
            onClick={() => switchDemoRole('customer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              user?.role === 'customer'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Customer
          </button>
        </div>

        {/* User profile dropdown / logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center font-bold text-xs">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
              {user?.full_name || 'User'}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
          </div>

          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
