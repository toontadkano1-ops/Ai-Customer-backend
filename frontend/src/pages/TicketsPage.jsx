import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Clock,
  User,
  Send,
  Lock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Check,
  RotateCcw,
  Shield,
  Layers
} from 'lucide-react';
import { ticketService } from '../services/ticketService.js';
import { customerService } from '../services/customerService.js';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const TicketsPage = () => {
  const { user, isCustomer, isAdmin, isAgent } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // New ticket modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Infrastructure');
  const [newDescription, setNewDescription] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [createPriority, setCreatePriority] = useState('medium');
  const [createLoading, setCreateLoading] = useState(false);

  // Message reply state in detail modal
  const [replyContent, setReplyContent] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketService.list();
      if (res.success) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    if (!isCustomer) {
      try {
        const res = await customerService.list();
        if (res.success && res.data.length > 0) {
          setCustomers(res.data);
          setSelectedCustomer(res.data[0].id);
        }
      } catch (e) {
        console.error('Failed to load customers for ticket assignment:', e);
      }
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchCustomers();
  }, [isCustomer]);

  const openTicketDetail = async (ticketId) => {
    try {
      const res = await ticketService.getById(ticketId);
      if (res.success) {
        setSelectedTicket(res.data);
      }
    } catch (err) {
      alert('Failed to load ticket details: ' + err.message);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const payload = {
        subject: newSubject,
        category: newCategory,
        description: newDescription,
        priority: createPriority
      };

      if (!isCustomer && selectedCustomer) {
        payload.customer_id = selectedCustomer;
      }
      if (selectedAgent) {
        payload.assigned_agent_id = selectedAgent;
      }

      const res = await ticketService.create(payload);

      if (res.success) {
        setShowCreateModal(false);
        setNewSubject('');
        setNewDescription('');
        fetchTickets();
      }
    } catch (err) {
      alert('Error creating ticket: ' + err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await ticketService.update(ticketId, { status: newStatus });
      if (res.success) {
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
        fetchTickets();
      }
    } catch (err) {
      alert('Failed to update ticket: ' + err.message);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedTicket) return;

    setReplyLoading(true);
    try {
      const res = await ticketService.addMessage(selectedTicket.id, {
        content: replyContent,
        is_internal: isInternalNote
      });

      if (res.success) {
        setReplyContent('');
        openTicketDetail(selectedTicket.id);
        fetchTickets();
      }
    } catch (err) {
      alert('Failed to post reply: ' + err.message);
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate ticket counts
  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const urgentCount = tickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Support Ticket Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Prioritize, track, collaborate on internal staff notes, and resolve enterprise support requests.
          </p>
        </div>

        <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
          New Ticket
        </Button>
      </div>

      {/* Ticket Metrics Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Open Tickets</p>
            <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">{openCount}</p>
          </div>
          <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">In Progress</p>
            <p className="text-xl font-bold text-brand-400 font-mono mt-0.5">{inProgressCount}</p>
          </div>
          <span className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
            <RotateCcw className="w-4 h-4" />
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">High / Urgent</p>
            <p className="text-xl font-bold text-rose-400 font-mono mt-0.5">{urgentCount}</p>
          </div>
          <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertCircle className="w-4 h-4" />
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Resolved</p>
            <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{resolvedCount}</p>
          </div>
          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by subject, customer, or ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_for_customer">Waiting for Customer</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority selector */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket Subject</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No tickets found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td
                      onClick={() => openTicketDetail(t.id)}
                      className="py-3.5 px-4 cursor-pointer"
                    >
                      <div className="font-semibold text-slate-100 hover:text-brand-400 transition-colors line-clamp-1">
                        {t.subject}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        #{t.id.slice(0, 8)} • <span className="text-slate-300 font-sans">{t.category}</span>
                      </div>
                    </td>
                    <td
                      onClick={() => openTicketDetail(t.id)}
                      className="py-3.5 px-4 text-slate-300 font-medium cursor-pointer"
                    >
                      {t.customer_name}
                    </td>
                    <td className="py-3.5 px-4">
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
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          t.status === 'open'
                            ? 'warning'
                            : t.status === 'resolved'
                            ? 'success'
                            : 'primary'
                        }
                        size="sm"
                      >
                        {t.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {t.assigned_agent_name}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {!isCustomer && t.status !== 'resolved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(t.id, 'resolved');
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium transition-colors"
                          title="Mark resolved"
                        >
                          ✓ Resolve
                        </button>
                      )}
                      <button
                        onClick={() => openTicketDetail(t.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                      >
                        View Thread →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Timeline Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-dark-surface border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-slate-400">#{selectedTicket.id.slice(0, 8)}</span>
                  <Badge variant="primary" size="sm">{selectedTicket.category}</Badge>
                  <Badge variant={selectedTicket.priority === 'urgent' ? 'danger' : 'warning'} size="sm">
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-white">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customer: <span className="text-slate-200 font-semibold">{selectedTicket.customer_name}</span> ({selectedTicket.customer_email})
                </p>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Status & Assignment controls */}
            {!isCustomer && (
              <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs px-5 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Change Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:border-brand-500 font-medium"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_for_customer">Waiting for Customer</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="text-slate-400">
                  Assigned Agent: <span className="text-brand-300 font-semibold">{selectedTicket.assigned_agent_name}</span>
                </div>
              </div>
            )}

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-100 block mb-1">Customer Description:</span>
                {selectedTicket.description}
              </div>

              {(selectedTicket.messages || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl text-xs space-y-1.5 ${
                    msg.is_internal
                      ? 'bg-amber-950/20 border border-amber-500/30 text-amber-200'
                      : msg.sender_type === 'customer'
                      ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                      : 'bg-brand-950/20 border border-brand-500/30 text-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5">
                      {msg.is_internal && <Lock className="w-3 h-3 text-amber-400" />}
                      {msg.sender_name}
                      {msg.is_internal && <span className="text-amber-400 font-normal">[Internal Note]</span>}
                    </span>
                    <span className="text-slate-500 font-mono">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-3">
              {!isCustomer && (
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="note_type"
                      checked={!isInternalNote}
                      onChange={() => setIsInternalNote(false)}
                      className="accent-brand-500"
                    />
                    Public Customer Reply
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                    <input
                      type="radio"
                      name="note_type"
                      checked={isInternalNote}
                      onChange={() => setIsInternalNote(true)}
                      className="accent-amber-500"
                    />
                    <Lock className="w-3 h-3" />
                    Internal Staff Note
                  </label>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={isInternalNote ? 'Add internal agent note...' : 'Type public reply to customer...'}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <Button type="submit" size="sm" loading={replyLoading} icon={Send}>
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-dark-surface border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Create Support Ticket</h3>
            <p className="text-xs text-slate-400 mb-4">
              AI automatically classifies ticket urgency based on issue description and keywords.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              {!isCustomer && customers.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Select Customer</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Ingress proxy timeout during cluster auto-scaling"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Billing">Billing & Subscription</option>
                    <option value="Compliance">Compliance & SOC2</option>
                    <option value="Security">Security</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Initial Priority</label>
                  <select
                    value={createPriority}
                    onChange={(e) => setCreatePriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain what happened, error codes, and steps to reproduce..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={createLoading}>
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
