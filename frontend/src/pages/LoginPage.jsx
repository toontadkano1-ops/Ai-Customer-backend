import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Headset,
  UserCheck,
  AlertCircle,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  Activity,
  Bot,
  BrainCircuit,
  MessageSquareHeart,
  Network
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { CXLogo } from '../components/common/CXLogo.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Role Portal Configurations
  const [selectedPortal, setSelectedPortal] = useState('admin');
  const [email, setEmail] = useState('admin@apex.io');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const portals = {
    admin: {
      id: 'admin',
      name: 'Admin Console',
      roleTitle: 'Enterprise Administrator',
      defaultEmail: 'admin@apex.io',
      icon: Shield,
      gradient: 'from-violet-600 via-purple-600 to-indigo-600',
      activeBorder: 'border-violet-500/70 shadow-violet-500/30',
      badgeColor: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      description: 'System control, Gemini 3.8 AI grounding, and multi-tenant management.',
      perks: ['Full System Analytics', 'RAG Knowledge Ingestion', 'Tenant Access Control']
    },
    agent: {
      id: 'agent',
      name: 'Support Agent Desk',
      roleTitle: 'Support Specialist',
      defaultEmail: 'agent@apex.io',
      icon: Headset,
      gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
      activeBorder: 'border-emerald-500/70 shadow-emerald-500/30',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      description: 'Live customer interactions, sentiment alerts, and ticket resolution.',
      perks: ['Real-time Ticket Queue', 'Customer Sentiment Alerts', 'AI Draft Assistant']
    },
    customer: {
      id: 'customer',
      name: 'Customer Portal',
      roleTitle: 'Customer Account',
      defaultEmail: 'customer@acme.com',
      icon: UserCheck,
      gradient: 'from-cyan-500 via-sky-600 to-blue-600',
      activeBorder: 'border-cyan-500/70 shadow-cyan-500/30',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      description: 'Conversational AI assistant, solution provisioning, and ticket tracking.',
      perks: ['Instant Gemini AI Concierge', 'Live Ticket Tracking', 'Cloud Recommendations']
    }
  };

  const handlePortalSwitch = (portalId) => {
    setSelectedPortal(portalId);
    setEmail(portals[portalId].defaultEmail);
    setPassword('Password123!');
    setError(null);
  };

  const handleQuickDemoLogin = async (portalId) => {
    const target = portals[portalId];
    setSelectedPortal(portalId);
    setEmail(target.defaultEmail);
    setPassword('Password123!');
    setLoading(true);
    setError(null);
    try {
      await login(target.defaultEmail, 'Password123!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const current = portals[selectedPortal];
  const CurrentIcon = current.icon;

  return (
    <div className="min-h-screen w-screen bg-[#070814] text-slate-100 flex flex-col lg:grid lg:grid-cols-12 overflow-x-hidden selection:bg-violet-600 selection:text-white">
      
      {/* ============================================================== */}
      {/* LEFT SECTION: Branding, AI Visual Experience & Hero Narrative */}
      {/* ============================================================== */}
      <div className="relative hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-10 xl:p-16 overflow-hidden bg-gradient-to-br from-[#0D0F22] via-[#090A18] to-[#060710] border-r border-[#1C2242]">
        
        {/* Radiant Ambient Gradient Lighting Orbs */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-violet-600/25 rounded-full blur-[140px] pointer-events-none animate-blob" />
        <div className="absolute top-1/2 -right-32 -translate-y-1/2 w-[480px] h-[480px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-blob animation-delay-4000" />
        
        {/* Subtle Cyber Grid Background Overlay */}
        <div className="absolute inset-0 bg-cyber-grid opacity-70 pointer-events-none" />

        {/* Top Header / Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <CXLogo size="lg" subtitle="Enterprise AI Platform" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span>Gemini 3.8 Flash Hybrid Active</span>
          </div>
        </div>

        {/* Center: Original Abstract AI Neural Interaction Network Illustration */}
        <div className="relative z-10 my-auto py-8">
          <div className="relative max-w-xl mx-auto">
            
            {/* SVG Neural Mesh / Interactive Topology */}
            <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
              <svg viewBox="0 0 600 320" className="w-full h-full filter drop-shadow-[0_0_25px_rgba(139,92,246,0.35)]">
                <defs>
                  <linearGradient id="neural-line-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="neural-line-cyan" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
                  </linearGradient>
                  <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="60%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Ambient Grid Lines */}
                <line x1="80" y1="160" x2="240" y2="80" stroke="url(#neural-line-1)" strokeWidth="1.5" className="animate-dash-stream" />
                <line x1="80" y1="160" x2="220" y2="240" stroke="url(#neural-line-1)" strokeWidth="1.5" />
                <line x1="240" y1="80" x2="380" y2="110" stroke="url(#neural-line-1)" strokeWidth="2" />
                <line x1="220" y1="240" x2="380" y2="220" stroke="url(#neural-line-cyan)" strokeWidth="1.5" className="animate-dash-stream" />
                <line x1="380" y1="110" x2="520" y2="160" stroke="url(#neural-line-1)" strokeWidth="2" />
                <line x1="380" y1="220" x2="520" y2="160" stroke="url(#neural-line-cyan)" strokeWidth="1.5" />
                <line x1="240" y1="80" x2="380" y2="220" stroke="url(#neural-line-1)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
                <line x1="220" y1="240" x2="380" y2="110" stroke="url(#neural-line-cyan)" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />

                {/* Central Synapse Hub Core */}
                <circle cx="300" cy="160" r="45" fill="none" stroke="#8B5CF6" strokeWidth="1" opacity="0.3" />
                <circle cx="300" cy="160" r="30" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash-stream" />
                <circle cx="300" cy="160" r="10" fill="url(#node-glow)" className="animate-neural-pulse" />

                {/* Neural Peripheral Nodes */}
                <circle cx="80" cy="160" r="6" fill="#8B5CF6" />
                <circle cx="80" cy="160" r="14" fill="#8B5CF6" fillOpacity="0.2" className="animate-ping" />
                
                <circle cx="240" cy="80" r="7" fill="#C084FC" />
                <circle cx="220" cy="240" r="6" fill="#38BDF8" />
                <circle cx="380" cy="110" r="7" fill="#A855F7" />
                <circle cx="380" cy="220" r="6" fill="#6366F1" />
                <circle cx="520" cy="160" r="7" fill="#C084FC" />
                <circle cx="520" cy="160" r="16" fill="#A855F7" fillOpacity="0.25" className="animate-pulse" />
              </svg>

              {/* Floating AI Telemetry Badge 1: Customer Sentiment */}
              <div className="absolute -top-3 left-4 xl:left-8 px-4 py-2.5 rounded-2xl bg-[#0F122B]/90 border border-violet-500/30 backdrop-blur-xl shadow-xl shadow-purple-950/40 flex items-center gap-3 animate-blob">
                <div className="h-8 w-8 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center border border-violet-500/30">
                  <MessageSquareHeart className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Sentiment Score</span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">98.4%</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Real-time Intent Detection</p>
                </div>
              </div>

              {/* Floating AI Telemetry Badge 2: Neural Grounding */}
              <div className="absolute -bottom-4 right-4 xl:right-8 px-4 py-2.5 rounded-2xl bg-[#0F122B]/90 border border-indigo-500/30 backdrop-blur-xl shadow-xl shadow-indigo-950/40 flex items-center gap-3 animate-blob animation-delay-2000">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">RAG Grounded</span>
                    <span className="text-[11px] font-bold text-violet-300 bg-violet-500/10 px-1.5 py-0.2 rounded border border-violet-500/20">0.2s SLA</span>
                  </div>
                  <p className="text-[11px] text-slate-300">Live Catalog & Knowledge Base</p>
                </div>
              </div>
            </div>

            {/* Editorial Brand Narrative */}
            <div className="mt-8 text-center xl:text-left">
              <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
                Intelligence Behind Every{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">
                  Customer Interaction.
                </span>
              </h2>
              <p className="mt-3 text-slate-300 text-sm xl:text-base leading-relaxed max-w-xl">
                Transform customer conversations into meaningful experiences with AI-powered insights, intelligent automation, and personalized engagement.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof / Trust Footprint */}
        <div className="relative z-10 pt-6 border-t border-[#1C2242] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Enterprise SOC2 Type II Certified</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              Supabase RLS Guard
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              99.99% Cloud SLA
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SECTION: Elegant Modern Authentication Card */}
      {/* ============================================================== */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-14 relative z-10 bg-[#070814]">
        
        {/* Subtle Top Ambient Glow for mobile and small screens */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none lg:hidden" />
        
        <div className="w-full max-w-md mx-auto">
          
          {/* Mobile / Small Screen Brand Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-block mb-3">
              <CXLogo size="md" subtitle="Enterprise AI" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              Sign in to your enterprise workspace or select a quick demo role.
            </p>
          </div>

          {/* 1-Click Demo Quick Jump Bar */}
          <div className="mb-5 p-3 rounded-2xl bg-[#0D0F22] border border-[#1C2242] backdrop-blur-md flex flex-wrap items-center justify-between gap-2 shadow-lg shadow-black/40">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold pl-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>1-Click Demo Login:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                disabled={loading}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-violet-500/15 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                title="Sign in instantly as Admin"
              >
                <span>⚡ Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('agent')}
                disabled={loading}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                title="Sign in instantly as Support Agent"
              >
                <span>⚡ Agent</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                disabled={loading}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
                title="Sign in instantly as Customer"
              >
                <span>⚡ Customer</span>
              </button>
            </div>
          </div>

          {/* Role Console Switcher Tabs */}
          <div className="mb-5">
            <div className="grid grid-cols-3 gap-2 bg-[#0B0D1E] p-1.5 rounded-2xl border border-[#1C2242]">
              {Object.values(portals).map((portal) => {
                const Icon = portal.icon;
                const isSelected = selectedPortal === portal.id;
                return (
                  <button
                    key={portal.id}
                    type="button"
                    onClick={() => handlePortalSwitch(portal.id)}
                    className={`p-2.5 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? `bg-[#141836] text-white shadow-lg ${portal.activeBorder} font-bold ring-1 ring-violet-500/30`
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#121530]/50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'scale-110 text-violet-400' : 'text-slate-400'
                      } transition-transform`}
                    />
                    <span className="text-xs font-semibold truncate w-full">{portal.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#1C2242] bg-[#0D0F22]/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Top colored accent line for active portal */}
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${current.gradient}`} />

            {/* Active Portal Header Banner */}
            <div className="mb-5 pb-4 border-b border-[#1C2242] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${current.gradient} text-white shadow-md shadow-violet-950/50`}>
                  <CurrentIcon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    {current.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">{current.roleTitle}</p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
                Active Role
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#070814] border border-[#1C2242] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200">
                    Password
                  </label>
                  <span className="text-[11px] text-violet-400 font-mono font-medium">
                    Demo: Password123!
                  </span>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-400 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#070814] border border-[#1C2242] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Options */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#1C2242] bg-[#070814] text-violet-600 focus:ring-violet-500/30 accent-violet-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 font-medium">Remember for 30 days</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Use demo password "Password123!" for any of the 3 pre-configured demo accounts.');
                  }}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-violet-900/40 hover:shadow-violet-800/60 hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* Subtle Button Shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating Session...
                  </span>
                ) : (
                  <>
                    <span>Sign In to {current.roleTitle}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-6 pt-4 border-t border-[#1C2242] flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-400">Need a new account?</span>
              <Link
                to="/register"
                className="text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 hover:underline transition-colors"
              >
                <span>Create Workspace Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bottom Security Assurance Footer */}
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Supabase Auth & RLS Guard
            </span>
            <span>•</span>
            <span className="text-slate-400">Gemini 3.8 Flash Hybrid Engine</span>
          </div>

        </div>
      </div>
    </div>
  );
};
