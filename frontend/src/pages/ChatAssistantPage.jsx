import React from 'react';
import { ChatWindow } from '../components/chatbot/ChatWindow.jsx';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const ChatAssistantPage = () => {
  const { user } = useAuth();

  const samplePrompts = [
    {
      category: 'SLA & Policy',
      prompt: 'What is your Enterprise SLA & uptime guarantee?',
      icon: ShieldCheck
    },
    {
      category: 'Product Advice',
      prompt: 'Recommend best products for Kubernetes auto-scaling',
      icon: Sparkles
    },
    {
      category: 'Billing Terms',
      prompt: 'What are your subscription and refund policies?',
      icon: BookOpen
    },
    {
      category: 'Support Escalation',
      prompt: 'I am experiencing a critical production outage, escalate now',
      icon: Zap
    }
  ];

  const handleSendPreset = (text) => {
    const input = document.querySelector('textarea, input[placeholder*="Ask"], input[placeholder*="Type"]');
    if (input) {
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* High-Tech Concierge Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Gemini 3.8 Flash Hybrid Engine
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                RAG Grounding Online
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-mono text-slate-300 bg-slate-800/80 border border-slate-700/60 font-semibold">
                Latency: ~18ms
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Live AI Concierge
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Real-time conversational assistant grounded in enterprise knowledge documents, verified SLAs, and autonomous ticket escalation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-right shadow-inner">
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-bold">
                Autonomous Deflection
              </span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">
                94.8% SLA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Chat Window + Intelligence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Engine (8 cols on lg) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800/90 bg-slate-900/70 backdrop-blur-xl shadow-2xl p-2 sm:p-4 overflow-hidden">
          <ChatWindow />
        </div>

        {/* Intelligence Side Inspector (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Knowledge Sources Pill */}
          <div className="p-5 rounded-3xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Active Grounding Documents
            </h3>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-200 font-semibold">Enterprise SLA & Uptime Policy</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Indexed
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-200 font-semibold">Terms of Subscription & Refunds</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Indexed
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-200 font-semibold">Cloud Architecture & Products</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Indexed
                </span>
              </div>
            </div>
          </div>

          {/* Quick Query Inspirations */}
          <div className="p-5 rounded-3xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Suggested Test Inquiries
            </h3>
            <div className="space-y-2.5">
              {samplePrompts.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendPreset(p.prompt)}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-brand-500/40 transition-all card-hover group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-400 mb-1">
                      <Icon className="w-3.5 h-3.5 text-brand-400" />
                      <span>{p.category}</span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium group-hover:text-white transition-colors">
                      "{p.prompt}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Autonomous Guardrails Badge */}
          <div className="p-4 sm:p-5 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-md shadow-lg flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sentiment-Triggered Escalation</h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                If negative sentiment or an unresolved inquiry is detected, CX Intelligence automatically generates an escalated ticket in the Support Desk queue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
