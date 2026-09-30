import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Mail, Tag, MessageSquare, Ticket, Check } from 'lucide-react';
import { customerService } from '../services/customerService.js';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', interests: '' });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.list();
      if (res.success) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const interestsArray = newCustomer.interests
        ? newCustomer.interests.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await customerService.create({
        name: newCustomer.name,
        email: newCustomer.email,
        preferences: {
          interests: interestsArray,
          preferred_channel: 'web_chat',
          notifications: true
        }
      });
      setShowModal(false);
      setNewCustomer({ name: '', email: '', interests: '' });
      fetchCustomers();
    } catch (err) {
      alert('Failed to create customer: ' + err.message);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Customer Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage customer accounts, preferences, interaction logs, and support affinity.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} icon={Plus}>
          Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name or email..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{customer.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{customer.email}</span>
                  </div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-sm shadow-sm">
                  {customer.name.charAt(0)}
                </div>
              </div>

              {/* Interests Tags */}
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Interests & Affinity
                </span>
                <div className="flex flex-wrap gap-2">
                  {(customer.preferences?.interests || []).length > 0 ? (
                    customer.preferences.interests.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">No interests specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-brand-400" />
                {customer.totalConversations || 0} Chats
              </span>
              <span className="flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                {customer.openTickets || 0} Open Tickets
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-dark-surface border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Customer Profile</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="e.g. sarah@enterprise.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Interests / Topic Affinity (comma separated)
                </label>
                <input
                  type="text"
                  value={newCustomer.interests}
                  onChange={(e) => setNewCustomer({ ...newCustomer, interests: e.target.value })}
                  placeholder="e.g. Kubernetes, Observability, SOC2"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Customer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
