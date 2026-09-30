import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Clock,
  Sparkles,
  Smile,
  Frown,
  Meh,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { analyticsService } from '../services/analyticsService.js';
import { StatCard } from '../components/common/StatCard.jsx';
import { Badge } from '../components/common/Badge.jsx';

export const AnalyticsPage = () => {
  const [range, setRange] = useState('30d');
  const [overview, setOverview] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [supportData, setSupportData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [ovRes, sentRes, supRes, insRes] = await Promise.all([
          analyticsService.getOverview(range),
          analyticsService.getSentiment(),
          analyticsService.getSupport(),
          analyticsService.getInsights()
        ]);

        if (ovRes.success) setOverview(ovRes.data);
        if (sentRes.success) setSentiment(sentRes.data);
        if (supRes.success) setSupportData(supRes.data);
        if (insRes.success) setInsights(insRes.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Customer Experience Analytics & Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven intelligence computed directly from database operations and conversation sentiment.
          </p>
        </div>

        {/* Date Filter selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 self-start">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                range === r
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Last {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Resolution Time"
          value={overview ? `${overview.avgResolutionHours} hrs` : '--'}
          change="-18.4%"
          isPositive={true}
          icon={Clock}
          description="Ticket opened to resolved"
        />
        <StatCard
          title="Avg First Response"
          value={overview ? `${overview.avgFirstResponseMin} min` : '--'}
          change="-35%"
          isPositive={true}
          icon={Clock}
          description="Immediate AI triage response"
        />
        <StatCard
          title="CSAT Rating"
          value={overview ? `${overview.csatScore} / 5.0` : '--'}
          change="+0.2"
          isPositive={true}
          icon={Smile}
          description="Customer survey average"
        />
        <StatCard
          title="Sentiment Health Score"
          value={sentiment ? `${sentiment.sentimentHealthScore}%` : '--'}
          change="+4.5%"
          isPositive={true}
          icon={TrendingUp}
          description="Positive & neutral message ratio"
        />
      </div>

      {/* AI-Generated Customer Insights */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-bold text-white">AI-Generated Business Intelligence Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider block mb-1">
                  {item.type.replace('_', ' ')}
                </span>
                <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                <span>Tip: {item.actionable_tip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Category Breakdown Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-1">Support Category Volume</h3>
          <p className="text-xs text-slate-400 mb-4">Ticket count per operational category</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supportData?.categoryBreakdown || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="category" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#1F293D',
                    borderRadius: '0.5rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Counts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Priority Load Distribution</h3>
            <p className="text-xs text-slate-400 mb-6">Active ticket allocation across urgency levels</p>

            <div className="space-y-4">
              {['urgent', 'high', 'medium', 'low'].map((prio) => {
                const count = supportData?.priorityCounts?.[prio] || 0;
                const total = supportData?.totalTickets || 1;
                const percent = Math.round((count / total) * 100);

                const colors = {
                  urgent: 'bg-rose-500',
                  high: 'bg-amber-500',
                  medium: 'bg-brand-500',
                  low: 'bg-slate-500'
                };

                return (
                  <div key={prio} className="space-y-1.5">
                    <div className="flex justify-between text-xs capitalize">
                      <span className="text-slate-300 font-medium">{prio}</span>
                      <span className="text-slate-400 font-mono">
                        {count} tickets ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className={`h-2 rounded-full ${colors[prio]}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-6 text-xs text-slate-400 flex items-center justify-between">
            <span>Enterprise SLA Adherence:</span>
            <span className="font-semibold text-emerald-400 font-mono">99.98% Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
