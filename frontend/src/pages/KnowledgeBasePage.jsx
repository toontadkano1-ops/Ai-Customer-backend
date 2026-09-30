import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Filter, Edit2, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { knowledgeService } from '../services/knowledgeService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';

export const KnowledgeBasePage = () => {
  const { isAdmin, isAgent } = useAuth();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);

  const categories = ['All', 'Service Level Agreement', 'Billing & Subscriptions', 'Technical Documentation', 'Security & Compliance', 'General'];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await knowledgeService.list(search, categoryFilter);
      if (res.success) {
        setArticles(res.data);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory('General');
    setContent('');
    setPublished(true);
    setShowModal(true);
  };

  const openEditModal = (art) => {
    setEditingId(art.id);
    setTitle(art.title);
    setCategory(art.category);
    setContent(art.content);
    setPublished(art.published);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await knowledgeService.update(editingId, { title, category, content, published });
      } else {
        await knowledgeService.create({ title, category, content, published });
      }
      setShowModal(false);
      fetchArticles();
    } catch (err) {
      alert('Failed to save article: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this knowledge article?')) return;
    try {
      await knowledgeService.delete(id);
      fetchArticles();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Business Knowledge Base
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative documents used for Chatbot RAG grounding. Responses strictly adhere to these verified texts.
          </p>
        </div>

        {(isAdmin || isAgent) && (
          <Button onClick={openCreateModal} icon={Plus}>
            Add Article
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, keywords or content..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {articles.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Badge variant="primary" size="sm">
                  {art.category}
                </Badge>
                {art.published ? (
                  <Badge variant="success" size="sm">
                    Published
                  </Badge>
                ) : (
                  <Badge variant="warning" size="sm">
                    Draft
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-white mb-2">{art.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                {art.content}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Updated: {new Date(art.updated_at || art.created_at).toLocaleDateString()}
              </span>

              {(isAdmin || isAgent) && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(art)}
                    className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit article"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-dark-surface border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Knowledge Article' : 'Create Knowledge Article'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apex Cloud SLA & Uptime Guarantee"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  <option value="Service Level Agreement">Service Level Agreement</option>
                  <option value="Billing & Subscriptions">Billing & Subscriptions</option>
                  <option value="Technical Documentation">Technical Documentation</option>
                  <option value="Security & Compliance">Security & Compliance</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Article Content (Grounding Reference for AI)
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter exact business policy, SLA guidelines, or product technical specs..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published_check"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="accent-brand-500"
                />
                <label htmlFor="published_check" className="text-xs text-slate-300 cursor-pointer">
                  Publish immediately (available for Chatbot RAG retrieval)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Save Changes' : 'Publish Article'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
