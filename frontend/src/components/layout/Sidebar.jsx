import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Users,
  Ticket,
  Sparkles,
  BookOpen,
  BarChart3,
  Settings,
  ShieldCheck,
  Building2,
  Headphones,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { CXLogo } from '../common/CXLogo.jsx';

export const Sidebar = () => {
  const { user, business } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'agent', 'customer'] },
    { 
      name: 'Customer Live Chat', 
      href: '/assistant', 
      icon: MessageSquare, 
      roles: ['admin', 'agent', 'customer'],
      badge: 'LIVE AI',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    { name: 'Customer Interaction', href: '/conversations', icon: Bot, roles: ['admin', 'agent', 'customer'] },
    { name: 'Support Tickets', href: '/tickets', icon: Ticket, roles: ['admin', 'agent', 'customer'] },
    { name: 'Recommendations', href: '/recommendations', icon: Sparkles, roles: ['admin', 'agent', 'customer'] },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen, roles: ['admin', 'agent', 'customer'] },
    { name: 'Customers', href: '/customers', icon: Users, roles: ['admin', 'agent'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'agent'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredNav = navigation.filter(item => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <aside className="w-72 flex-shrink-0 bg-[#0A0C1B] border-r border-[#1C2242] flex flex-col justify-between backdrop-blur-2xl relative z-20">
      <div>
        {/* Brand header with Original CX Monogram */}
        <div className="h-18 flex items-center px-5 py-4 border-b border-[#1C2242]/80">
          <CXLogo size="md" subtitle="Enterprise Suite" />
        </div>

        {/* Tenant Organization Capsule */}
        <div className="px-4 py-3 mx-3.5 my-3.5 rounded-2xl bg-gradient-to-br from-[#0F122B] to-[#0A0C1B] border border-violet-500/20 flex items-center gap-3 shadow-lg shadow-black/40">
          <div className="h-9 w-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0 text-violet-300">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-100 truncate">
              {business?.name || 'Apex Cloud Tech'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-xs text-violet-300 truncate capitalize font-semibold">
                {user?.role} Portal Active
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1.5 mt-2">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/25 via-purple-600/15 to-transparent text-white border border-violet-500/35 shadow-lg shadow-violet-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-[#121530]/60'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-violet-400 to-purple-500 rounded-r-full shadow-lg shadow-violet-500/50" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400 scale-105' : 'text-slate-400'} transition-transform flex-shrink-0`} />
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-md border ${item.badgeColor || 'bg-violet-500/20 text-violet-300'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#1C2242] bg-[#070814]/70">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">SOC2 & Supabase Guard</span>
          </div>
          <span className="text-[11px] bg-[#141836] border border-[#1C2242] px-2 py-0.5 rounded font-mono text-violet-300 font-bold">v1.2</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1.5 border-t border-[#1C2242]/50">
          <span>AI Engine</span>
          <span className="text-violet-400 font-bold flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Gemini 3.8 Flash
          </span>
        </div>
      </div>
    </aside>
  );
};
