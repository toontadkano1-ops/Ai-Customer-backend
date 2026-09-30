import React from 'react';
import { Search, LogOut, Shield, Headset, UserCheck, MessageSquare, Sparkles, Bell, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10">
            <Shield className="w-3.5 h-3.5 text-violet-400" />
            Admin Console
          </span>
        );
      case 'agent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
            <Headset className="w-3.5 h-3.5 text-emerald-400" />
            Support Agent
          </span>
        );
      case 'customer':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            Customer Account
          </span>
        );
    }
  };

  const handleOpenLiveChat = () => {
    window.dispatchEvent(new CustomEvent('open-customer-live-chat'));
    navigate('/assistant');
  };

  return (
    <header className="h-16 bg-[#0A0C1B]/85 border-b border-[#1C2242] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
      {/* Search Input with Command Key Pill */}
      <div className="relative w-64 sm:w-80 max-w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tickets, customers, RAG docs..."
          className="w-full bg-[#070814] border border-[#1C2242] rounded-xl pl-10 pr-14 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs bg-[#141836] text-slate-300 px-2 py-0.5 rounded border border-[#1C2242] font-mono font-semibold">
          ⌘K
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live System Health Badge (desktop) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D0F22] border border-[#1C2242] text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="text-slate-200 font-semibold">Gemini 3.8 Flash Online</span>
        </div>

        {/* Customer Live Chat Quick Launcher Button with Pulse */}
        <button
          onClick={handleOpenLiveChat}
          className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-900/30 hover:scale-105 active:scale-95 transition-all group"
          title="Open Customer Live Chat"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Customer Live Chat</span>
          <span className="sm:hidden">Live Chat</span>
        </button>

        {/* User Role Badge */}
        <div className="hidden sm:block">
          {getRoleBadge()}
        </div>

        {/* User profile dropdown / logout */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-[#1C2242]">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-950/50 flex items-center justify-center font-bold text-sm ring-1 ring-violet-400/40">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0A0C1B]"></span>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-slate-100 truncate max-w-[140px]">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[140px]">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            title="Sign out of workspace"
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-slate-300 hover:text-rose-400 hover:bg-[#151936] rounded-xl transition-all ml-1 font-semibold border border-transparent hover:border-[#1C2242]"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden xl:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
