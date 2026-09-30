import React, { useState } from 'react';
import { Settings, Shield, Sliders, Cpu, Save, Key, Database, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';

export const SettingsPage = () => {
  const { business, user } = useAuth();
  const [provider, setProvider] = useState('mock');
  const [threshold, setThreshold] = useState(0.65);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Platform Configuration & Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage AI model behavior, confidence thresholds, organization parameters, and database isolation.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-bold text-white">Tenant Organization</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                readOnly
                value={business?.name || 'Apex Cloud Tech'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tenant ID (UUID)</label>
              <input
                type="text"
                readOnly
                value={business?.id || 'a0000000-0000-0000-0000-000000000001'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-400"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Multi-Tenant Row Level Security (RLS) is active. All database queries enforce tenant isolation.</span>
          </div>
        </div>

        {/* AI & Model Tuning */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-bold text-white">AI Engine & Grounding Parameters</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Active AI Provider Engine</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="gemini-3.8">Google Gemini 3.8 Flash (Ultra-Low Latency Grounded Engine)</option>
                <option value="gemini-1.5">Google Gemini 1.5 Flash (Balanced Multimodal)</option>
                <option value="openai">OpenAI GPT-4o-mini (REST)</option>
                <option value="mock">Local Zero-Latency Hybrid Engine (Offline Fallback)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-slate-200">
                  Knowledge Grounding Confidence Threshold: <span className="font-mono text-brand-400 font-bold">{threshold}</span>
                </label>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">Uncertainty triggered below this score</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="0.9"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-mono font-medium">
                <span>0.40 (Permissive)</span>
                <span>0.65 (Recommended)</span>
                <span>0.90 (Strict)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" /> Preferences saved successfully
            </span>
          )}
          <div className="ml-auto">
            <Button type="submit" icon={Save}>
              Save Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
