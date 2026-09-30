import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Headset,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { CXLogo } from '../components/common/CXLogo.jsx';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('customer'); // 'customer' | 'agent' | 'admin'
  const [businessName, setBusinessName] = useState('Apex Cloud Tech');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Role Configuration
  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      subtitle: 'Customer Portal',
      icon: UserCheck,
      color: 'from-cyan-500 via-sky-600 to-blue-600',
      activeBorder: 'border-cyan-500/70 shadow-cyan-500/30',
      textColor: 'text-cyan-400',
      description: 'Access AI live chat, deploy cloud solutions & track support tickets.'
    },
    {
      id: 'agent',
      title: 'Support Agent',
      subtitle: 'Support Desk',
      icon: Headset,
      color: 'from-emerald-500 via-teal-600 to-cyan-600',
      activeBorder: 'border-emerald-500/70 shadow-emerald-500/30',
      textColor: 'text-emerald-400',
      description: 'Manage customer conversations, resolve support tickets & view interactions.'
    },
    {
      id: 'admin',
      title: 'Administrator',
      subtitle: 'Admin Console',
      icon: Shield,
      color: 'from-violet-600 via-purple-600 to-indigo-600',
      activeBorder: 'border-violet-500/70 shadow-violet-500/30',
      textColor: 'text-violet-400',
      description: 'Manage platform architecture, analytics, Supabase data & AI settings.'
    }
  ];

  // Password strength calculator
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Empty', color: 'bg-slate-700', width: 'w-0' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: 'bg-rose-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { score: 4, text: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Quick Pre-fill Demo Data Helper
  const handlePreFillDemo = (targetRole) => {
    const roleId = targetRole || role;
    setRole(roleId);
    if (roleId === 'customer') {
      setFullName('Alex Mercer');
      setEmail(`customer_${Math.floor(Math.random() * 9000 + 1000)}@acme.com`);
      setPassword('Password123!');
      setBusinessName('Apex Cloud Tech');
    } else if (roleId === 'agent') {
      setFullName('Jordan Vance');
      setEmail(`agent_${Math.floor(Math.random() * 9000 + 1000)}@apex.io`);
      setPassword('Password123!');
      setBusinessName('Apex Cloud Tech');
    } else {
      setFullName('Marcus Sterling');
      setEmail(`admin_${Math.floor(Math.random() * 9000 + 1000)}@apex.io`);
      setPassword('Password123!');
      setBusinessName('Apex Cloud Tech');
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({
        full_name: fullName,
        email,
        password,
        role,
        business_name: businessName
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const activeRoleConfig = roles.find((r) => r.id === role) || roles[0];
  const ActiveIcon = activeRoleConfig.icon;

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#070814] text-slate-100 selection:bg-violet-600 relative overflow-hidden bg-cyber-grid">
      {/* Radiant Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-[130px] pointer-events-none animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none animate-blob animation-delay-2000" />
      <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-4000" />

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Brand & Value Proposition Hero (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Logo with CX Monogram */}
          <CXLogo size="lg" subtitle="Enterprise AI Platform" />

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
              Create your account & experience{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">
                Enterprise AI
              </span>
            </h1>
            <p className="text-base text-slate-300 mt-3 leading-relaxed">
              Deploy autonomous AI support, grounded knowledge concierges, and multi-tenant customer intelligence in minutes.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="space-y-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-[#0D0F22]/80 border border-[#1C2242] backdrop-blur-md flex items-start gap-3.5 hover:border-violet-500/40 transition-colors">
              <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Gemini 3.8 Flash Hybrid AI</h4>
                <p className="text-xs text-slate-300 mt-1 leading-normal">
                  Sub-second grounded RAG answers with citations and proactive ticket escalation.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D0F22]/80 border border-[#1C2242] backdrop-blur-md flex items-start gap-3.5 hover:border-violet-500/40 transition-colors">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Supabase Multi-Tenant Security</h4>
                <p className="text-xs text-slate-300 mt-1 leading-normal">
                  Strict tenant data isolation, encrypted credentials & verified business IDs.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D0F22]/80 border border-[#1C2242] backdrop-blur-md flex items-start gap-3.5 hover:border-violet-500/40 transition-colors">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Real-Time Telemetry & CSAT</h4>
                <p className="text-xs text-slate-300 mt-1 leading-normal">
                  Live sentiment distribution, automated SLA tracking, and resolution analytics.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof Trust Bar */}
          <div className="pt-3 border-t border-[#1C2242] flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              99.98% High Availability
            </span>
            <span>SOC2 Type II Certified</span>
            <span>256-bit AES</span>
          </div>
        </div>

        {/* Right Column: Registration Card (7 cols on lg) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl border border-[#1C2242] bg-[#0D0F22]/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient top highlight */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />

            {/* Header with Quick Pre-fill Demo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">Create Workspace Account</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Select your role to configure workspace privileges.
                </p>
              </div>

              {/* Quick Demo Pre-fill Button */}
              <button
                type="button"
                onClick={() => handlePreFillDemo(role)}
                className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-500/15 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Automatically pre-fill realistic demo data for testing"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Quick Pre-Fill Demo</span>
              </button>
            </div>

            {/* Interactive 3-Role Selection Cards */}
            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2.5">
                Choose Your Role Portal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setRole(r.id);
                        setError(null);
                      }}
                      className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                        isSelected
                          ? `bg-[#141836] text-white shadow-lg ${r.activeBorder} ring-1 ring-violet-500/30`
                          : 'bg-[#070814]/70 border-[#1C2242] text-slate-400 hover:text-slate-200 hover:bg-[#121530]/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2.5">
                        <div
                          className={`p-2.5 rounded-xl bg-gradient-to-br ${r.color} text-white shadow-md ${
                            isSelected ? 'scale-110 shadow-lg' : 'opacity-85'
                          } transition-transform`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className={`w-5 h-5 ${r.textColor}`} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{r.title}</div>
                        <div className="text-xs text-slate-300 font-medium leading-tight mt-0.5">
                          {r.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Role Description Pill */}
              <div className="mt-3 p-3 rounded-xl bg-[#070814] border border-[#1C2242] text-xs sm:text-sm text-slate-200 flex items-center gap-2.5">
                <ActiveIcon className={`w-4 h-4 flex-shrink-0 ${activeRoleConfig.textColor}`} />
                <span className="font-medium">{activeRoleConfig.description}</span>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-[#070814] border border-[#1C2242] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
              </div>

              {/* Organization / Business Name */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200">
                    Organization / Company
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Presets:</span>
                    {['Apex Cloud Tech', 'Acme Global'].map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setBusinessName(name)}
                        className="text-xs text-violet-400 hover:text-violet-300 underline font-medium"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Cloud Tech"
                    className="w-full bg-[#070814] border border-[#1C2242] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password with Show/Hide & Strength Meter */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200">Security Password</label>
                  {password && (
                    <span className="text-xs text-slate-300">
                      Strength:{' '}
                      <span
                        className={`font-bold ${
                          passwordStrength.score >= 3
                            ? 'text-emerald-400'
                            : passwordStrength.score === 2
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {passwordStrength.text}
                      </span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters (e.g. Password123!)"
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

                {/* Password Strength Indicator Bar */}
                {password && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex-1 h-2 bg-[#1C2242] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full ${passwordStrength.width}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-violet-900/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {loading ? (
                  <span>Creating Secure Account...</span>
                ) : (
                  <>
                    <span>Create {activeRoleConfig.title} Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer with Login link */}
            <div className="mt-6 pt-4 border-t border-[#1C2242] flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-300">Already registered?</span>
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 hover:underline"
              >
                <span>Sign in to your portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
