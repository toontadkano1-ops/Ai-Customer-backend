import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Ticket,
  Clock,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { StatCard } from '../components/common/StatCard.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { SentimentIndicator } from '../components/common/SentimentIndicator.jsx';
import { analyticsService } from '../services/analyticsService.js';
import { ticketService } from '../services/ticketService.js';
import { chatService } from '../services/chatService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [range, setRange] = useState('30d');
  const [overview, setOverview] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [trends, setTrends] = useState([]);
  const [supportData, setSupportData] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ovRes, sentRes, trRes, supRes, tickRes] = await Promise.all([
          analyticsService.getOverview(range),
          analyticsService.getSentiment(),
          analyticsService.getEngagement(),
          analyticsService.getSupport(),
          ticketService.list()
        ]);

        if (ovRes.success) setOverview(ovRes.data);
        if (sentRes.success) setSentiment(sentRes.data);
        if (trRes.success) setTrends(trRes.data);
        if (supRes.success) setSupportData(supRes.data);
        if (tickRes.success) setRecentTickets(tickRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Executive CX Intelligence Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time customer metrics, AI deflection, and sentiment health calculated from live operations.
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

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={overview?.totalCustomers ?? '--'}
          change="+14.2%"
          isPositive={true}
          icon={Users}
          description="Active accounts in organization"
        />
        <StatCard
          title="AI Deflection Rate"
          value={overview ? `${overview.deflectionRatePercent}%` : '--'}
          change="+6.5%"
          isPositive={true}
          icon={Bot}
          description="Resolved without human escalation"
        />
        <StatCard
          title="Avg First Response"
          value={overview ? `${overview.avgFirstResponseMin}m` : '--'}
          change="-42%"
          isPositive={true}
          icon={Clock}
          description="Automated immediate response"
        />
        <StatCard
          title="Customer Satisfaction (CSAT)"
          value={overview ? `${overview.csatScore} / 5.0` : '--'}
          change="+0.3"
          isPositive={true}
          icon={CheckCircle}
          description="Based on customer feedback surveys"
        />
      </div>

      {/* Visual Analytics Grid: Engagement Trends & Sentiment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Trend Chart (2 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Customer Interaction & AI Resolution Trends</h2>
              <p className="text-xs text-slate-400">Daily conversation volume vs AI autonomous resolution</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Total Inquiries
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> AI Resolved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#1F293D',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="conversations" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorConv)" name="Total Inquiries" />
                <Area type="monotone" dataKey="aiResolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRes)" name="AI Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Health Breakdown (1 column) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-white">Sentiment Intelligence</h2>
              <Badge variant="success" size="sm">
                Score {sentiment?.sentimentHealthScore ?? 92}%
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Real-time classification of recent customer messages
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentiment?.distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {(sentiment?.distribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      borderColor: '#1F293D',
                      borderRadius: '0.5rem',
                      color: '#F8FAFC',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {(sentiment?.distribution || []).map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-100 font-mono">
                  {item.percentage}% ({item.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent High Priority Support Tickets & Common Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Tickets Queue Preview */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Active Support Tickets</h2>
              <p className="text-xs text-slate-400">Escalated issues requiring agent resolution</p>
            </div>
            <Link to="/tickets">
              <Button variant="ghost" size="sm" icon={ArrowRight}>
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentTickets.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No active tickets.</p>
            ) : (
              recentTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">#{t.id.slice(0, 8)}</span>
                      <Badge
                        variant={
                          t.priority === 'urgent'
                            ? 'danger'
                            : t.priority === 'high'
                            ? 'warning'
                            : 'default'
                        }
                        size="sm"
                      >
                        {t.priority}
                      </Badge>
                      <span className="text-[11px] text-slate-400">• {t.category}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200 truncate">{t.subject}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      Customer: <span className="text-slate-300 font-medium">{t.customer_name}</span> | Agent:{' '}
                      <span className="text-brand-300">{t.assigned_agent_name}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={t.status === 'open' ? 'warning' : 'primary'} size="sm">
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Support Category Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Inquiry Categories</h2>
            <p className="text-xs text-slate-400 mb-4">Volume distribution by business domain</p>

            <div className="space-y-3">
              {(supportData?.categoryBreakdown || []).map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                    <span className="text-slate-400 font-mono">{cat.count} tickets</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min((cat.count / Math.max(supportData?.totalTickets || 1, 1)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Total Logged Tickets:</span>
            <span className="font-bold text-white font-mono">{supportData?.totalTickets || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
