import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Lock, Mail, User, Building2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/common/Button.jsx';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [businessName, setBusinessName] = useState('Apex Cloud Tech');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center p-4 bg-dark-bg text-slate-100 selection:bg-brand-500">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-700 items-center justify-center shadow-xl shadow-brand-500/25 mb-3">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create CX Intelligence Account</h1>
          <p className="text-xs text-slate-400 mt-1">
            Get started with AI-driven customer experience operations.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Support Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organization</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-3" icon={ArrowRight}>
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
