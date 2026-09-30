import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Lock, Mail, ArrowRight, Shield, Headset, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/common/Button.jsx';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleQuickLogin = async (demoEmail) => {
    setLoading(true);
    setError(null);
    try {
      await login(demoEmail, 'Password123!');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center p-4 bg-dark-bg text-slate-100 selection:bg-brand-500">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-700 items-center justify-center shadow-xl shadow-brand-500/25 mb-3">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">CX Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">
            AI-Powered Customer Experience & Intelligence Platform
          </p>
        </div>

        {/* Demo Quick Selectors */}
        <div className="mb-6 p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Quick Demo Logins</span>
            <span className="text-[10px] text-brand-400 font-mono">Password: Password123!</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@apex.io')}
              className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-left transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <Shield className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200">Admin</span>
              <span className="text-[9px] text-slate-400">admin@apex.io</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('agent@apex.io')}
              className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-left transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <Headset className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200">Support Agent</span>
              <span className="text-[9px] text-slate-400">agent@apex.io</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('customer@acme.com')}
              className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-left transition-all flex flex-col items-center justify-center gap-1 group"
            >
              <UserCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200">Customer</span>
              <span className="text-[9px] text-slate-400">customer@acme.com</span>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" icon={ArrowRight}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
