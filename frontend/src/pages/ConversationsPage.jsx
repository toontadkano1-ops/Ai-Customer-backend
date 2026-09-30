import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  User,
  Clock,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
  Send,
  LifeBuoy,
  RefreshCw,
  PlusCircle,
  Archive,
  Bot
} from 'lucide-react';
import { chatService } from '../services/chatService.js';
import { Badge } from '../components/common/Badge.jsx';
import { SentimentIndicator } from '../components/common/SentimentIndicator.jsx';
import { Button } from '../components/common/Button.jsx';
import { MessageBubble } from '../components/chatbot/MessageBubble.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const ConversationsPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [convLoading, setConvLoading] = useState(false);

  // Agent live reply state
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await chatService.getConversations();
      if (res.success) {
        setConversations(res.data);
        if (res.data.length > 0 && !selectedId) {
          setSelectedId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchDetail = async (id) => {
    if (!id) return;
    try {
      setConvLoading(true);
      const res = await chatService.getConversationById(id);
      if (res.success) {
        setSelectedConversation(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch conversation detail:', err);
    } finally {
      setConvLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId);
    }
  }, [selectedId]);

  const handleSendAgentReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedId || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await chatService.replyToConversation(selectedId, replyText);
      if (res.success) {
        setReplyText('');
        await fetchDetail(selectedId);
        fetchConversations();
      }
    } catch (err) {
      alert('Failed to send reply: ' + err.message);
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedId) return;
    try {
      const res = await chatService.updateConversationStatus(selectedId, newStatus);
      if (res.success) {
        setSelectedConversation(prev => prev ? { ...prev, status: newStatus } : null);
        fetchConversations();
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleEscalateSession = async () => {
    if (!selectedId) return;
    try {
      const res = await chatService.escalate({
        conversation_id: selectedId,
        reason: 'Agent escalated conversation from Customer Interaction console'
      });
      if (res.success) {
        alert(`Conversation escalated! Priority Ticket #${res.ticket_id.slice(0, 8)} created.`);
        fetchDetail(selectedId);
        fetchConversations();
      }
    } catch (err) {
      alert('Escalation failed: ' + err.message);
    }
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch =
      c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      c.last_message?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toLowerCase().includes(search.toLowerCase());

    const matchesSentiment = sentimentFilter === 'all' || (c.last_sentiment || 'neutral') === sentimentFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesSentiment && matchesStatus;
  });

  // Calculate quick metrics
  const activeCount = conversations.filter(c => c.status === 'active').length;
  const escalatedCount = conversations.filter(c => c.status === 'escalated').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header with KPI highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1C2242]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
            Customer Interaction Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-channel customer dialogues, sentiment monitoring, and direct agent intervention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="purple" size="md">
            {activeCount} Active Sessions
          </Badge>
          {escalatedCount > 0 && (
            <Badge variant="danger" size="md">
              {escalatedCount} Escalated
            </Badge>
          )}
          <Button variant="secondary" size="sm" onClick={fetchConversations} icon={RefreshCw}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
        {/* Left Column: Conversation Sessions List with Filters */}
        <div className="rounded-2xl border border-[#1C2242] bg-[#0D0F22]/90 backdrop-blur-xl overflow-hidden flex flex-col shadow-xl">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-[#1C2242] bg-[#0A0C1B]/90 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer, text, or ID..."
                className="w-full bg-[#070814] border border-[#1C2242] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center justify-between gap-1 text-xs sm:text-sm">
              <div className="flex items-center gap-1 overflow-x-auto">
                {['all', 'active', 'escalated', 'closed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-colors ${
                      statusFilter === st
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-950/50'
                        : 'text-slate-300 hover:text-white bg-[#141836]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="bg-[#070814] border border-[#1C2242] rounded-lg px-2.5 py-1 text-xs sm:text-sm text-slate-200 focus:outline-none font-medium"
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No matching customer interactions.
              </div>
            ) : (
              filteredConversations.map((c) => {
                const isSelected = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full text-left p-4 transition-colors flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-brand-600/15 border-l-2 border-brand-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-bold text-slate-100 truncate">
                        {c.customer_name}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-1">
                      {c.last_message || 'Session started'}
                    </p>

                    <div className="flex items-center justify-between mt-1 pt-1">
                      <SentimentIndicator sentiment={c.last_sentiment} />
                      <Badge
                        variant={c.status === 'escalated' ? 'danger' : c.status === 'closed' ? 'default' : 'primary'}
                        size="sm"
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Interaction Transcript & Agent Live Intervention */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Transcript Header with Actions */}
              <div className="p-4 border-b border-slate-800 bg-dark-surface/90 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    {selectedConversation.customer?.name}
                    <span className="text-xs sm:text-sm font-normal text-slate-300">({selectedConversation.customer?.email})</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    Session: <span className="font-mono text-slate-200 font-semibold">#{selectedConversation.id.slice(0, 8)}</span> • Status:{' '}
                    <span className="capitalize text-brand-400 font-bold">{selectedConversation.status}</span>
                  </p>
                </div>

                {/* Agent Action Buttons */}
                <div className="flex items-center gap-2">
                  {selectedConversation.status !== 'escalated' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEscalateSession}
                      className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 text-xs"
                      icon={LifeBuoy}
                    >
                      Escalate to Ticket
                    </Button>
                  )}

                  {selectedConversation.status === 'active' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateStatus('closed')}
                      className="text-xs"
                      icon={Archive}
                    >
                      Close Session
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateStatus('active')}
                      className="text-xs"
                      icon={RefreshCw}
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              </div>

              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {convLoading ? (
                  <div className="text-center py-12 text-slate-500 text-xs">Loading interaction transcript...</div>
                ) : (
                  (selectedConversation.messages || []).map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))
                )}
              </div>

              {/* Direct Agent Reply Bar */}
              <form onSubmit={handleSendAgentReply} className="p-4 border-t border-slate-800 bg-dark-surface/90 flex items-center gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official agent response directly to customer..."
                  disabled={sendingReply}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />

                <Button type="submit" size="sm" loading={sendingReply} icon={Send}>
                  Send as Agent
                </Button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select an interaction on the left to inspect conversation and intervene.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
