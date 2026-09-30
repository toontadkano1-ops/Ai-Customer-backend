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
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const Sidebar = () => {
  const { user, business, isAdmin, isAgent, isCustomer } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard, roles: ['admin', 'agent', 'customer'] },
    { name: 'AI Assistant', href: '/assistant', icon: Bot, roles: ['admin', 'agent', 'customer'] },
    { name: 'Conversations', href: '/conversations', icon: MessageSquare, roles: ['admin', 'agent', 'customer'] },
    { name: 'Customers', href: '/customers', icon: Users, roles: ['admin', 'agent'] },
    { name: 'Support Tickets', href: '/tickets', icon: Ticket, roles: ['admin', 'agent', 'customer'] },
    { name: 'Recommendations', href: '/recommendations', icon: Sparkles, roles: ['admin', 'agent', 'customer'] },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen, roles: ['admin', 'agent', 'customer'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'agent'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredNav = navigation.filter(item => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <aside className="w-64 flex-shrink-0 bg-dark-surface border-r border-slate-800 flex flex-col justify-between">
      <div>
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              CX Intelligence
            </span>
            <span className="text-[10px] text-brand-400 font-medium tracking-wide uppercase block -mt-0.5">
              AI Platform
            </span>
          </div>
        </div>

        {/* Tenant Organization Capsule */}
        <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {business?.name || 'Apex Cloud Tech'}
            </p>
            <p className="text-[11px] text-slate-500 truncate capitalize">
              Role: <span className="text-brand-400 font-medium">{user?.role}</span>
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {item.name === 'AI Assistant' && (
                  <span className="ml-auto text-[10px] bg-brand-500/20 text-brand-300 font-semibold px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SOC2 & RLS Active</span>
        </div>
        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono">v1.0</span>
      </div>
    </aside>
  );
};
