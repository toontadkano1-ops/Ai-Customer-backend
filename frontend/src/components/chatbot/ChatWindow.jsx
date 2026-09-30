import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, AlertTriangle, LifeBuoy, ThumbsUp, ShieldCheck, RefreshCw, PlusCircle } from 'lucide-react';
import { MessageBubble } from './MessageBubble.jsx';
import { FeedbackModal } from './FeedbackModal.jsx';
import { Button } from '../common/Button.jsx';
import { chatService } from '../../services/chatService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const ChatWindow = ({ initialConversationId }) => {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState(initialConversationId || null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isEscalated, setIsEscalated] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'What is your Enterprise SLA & uptime guarantee?',
    'What are your subscription and refund terms?',
    'Recommend best products for Kubernetes auto-scaling',
    'What are the API rate limits and quotas?'
  ];

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const startNewChat = () => {
    setConversationId(null);
    setIsEscalated(false);
    setError(null);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender_type: 'assistant',
        content: `Hello **${user?.full_name || 'there'}**! I am your **CX Intelligence Assistant**.\n\nI provide instant, verified answers grounded in official business documentation, assist with product recommendations, and can immediately route complex issues to our human engineering team.`,
        sentiment: 'positive',
        intent: 'welcome',
        created_at: new Date().toISOString(),
        suggested_actions: ['Enterprise SLA Policy', 'Subscription & Refund Terms', 'Recommend Products']
      }
    ]);
  };

  // Load existing conversation messages if ID provided
  useEffect(() => {
    const fetchHistory = async () => {
      if (!conversationId) {
        startNewChat();
        return;
      }

      try {
        setLoading(true);
        const res = await chatService.getConversationById(conversationId);
        if (res.success && res.data.messages) {
          setMessages(res.data.messages);
          if (res.data.status === 'escalated') {
            setIsEscalated(true);
          }
        }
      } catch (err) {
        console.error('Failed to load conversation history:', err);
        startNewChat();
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [conversationId]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setError(null);
    setInputMessage('');

    // Append user message optimistically
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      sender_type: 'customer',
      content: text,
      sentiment: 'neutral',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setTyping(true);

    try {
      const payload = {
        message: text
      };
      if (conversationId) {
        payload.conversation_id = conversationId;
      }
      if (user?.role === 'customer') {
        payload.customer_id = user.id;
      }

      const res = await chatService.sendMessage(payload);

      if (res.success) {
        if (!conversationId && res.conversation_id) {
          setConversationId(res.conversation_id);
        }

        // Replace user message with backend version and append assistant response
        setMessages(prev => [
          ...prev.filter(m => m.id !== tempUserMsg.id),
          res.user_message,
          res.message
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send message.');
      // Append fallback assistant reply
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender_type: 'assistant',
          content: 'I apologize, but our AI service is currently experiencing high load. Would you like me to connect you with an on-call human support engineer or open a support ticket?',
          is_uncertain: true,
          suggested_actions: ['Connect with Human Agent', 'Create Support Ticket'],
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleEscalate = async (reason = 'Customer requested human agent escalation') => {
    if (!conversationId) {
      alert('Please send at least one message before escalating.');
      return;
    }

    try {
      setLoading(true);
      const res = await chatService.escalate({
        conversation_id: conversationId,
        reason
      });

      if (res.success) {
        setIsEscalated(true);
        setMessages(prev => [
          ...prev,
          {
            id: 'esc-' + Date.now(),
            sender_type: 'assistant',
            content: `**Support Escalated!** 🚀\nTicket **#${res.ticket_id.slice(0, 8)}** has been dispatched to our priority support queue. An agent is reviewing the full transcript now.`,
            sentiment: 'positive',
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      setError('Escalation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.includes('Human') || action.includes('Escalate') || action.includes('Contact')) {
      handleEscalate('Customer clicked escalation action');
    } else {
      handleSendMessage(action);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-dark-surface/90 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-dark-surface rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white">CX Intelligence AI Concierge</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Gemini 3.8 Flash
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Grounded RAG
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">Context-Aware • Zero Policy Hallucinations</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={startNewChat}
            icon={PlusCircle}
            title="Start fresh conversation"
          >
            New Chat
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFeedbackModal(true)}
            icon={ThumbsUp}
          >
            Feedback
          </Button>

          {!isEscalated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEscalate()}
              className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 font-semibold"
              icon={LifeBuoy}
            >
              Escalate to Human
            </Button>
          ) : (
            <span className="px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <LifeBuoy className="w-4 h-4" /> Ticket Dispatched
            </span>
          )}
        </div>
      </div>

      {/* Suggested Questions Top Bar */}
      <div className="px-6 py-2.5 bg-slate-900/50 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs sm:text-sm flex-shrink-0">
        <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0" />
        <span className="text-slate-300 font-semibold whitespace-nowrap">Suggested Inquiries:</span>
        <div className="flex items-center gap-2 whitespace-nowrap">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onActionClick={handleActionClick} />
        ))}

        {/* Dynamic Typing Indicator */}
        {typing && (
          <div className="flex items-center gap-3 my-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs sm:text-sm text-slate-300 ml-2 font-medium">Grounding against knowledge base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error state alert */}
      {error && (
        <div className="px-6 py-2.5 bg-rose-500/10 border-t border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button
            onClick={() => handleSendMessage()}
            className="text-rose-200 underline hover:text-white ml-2 font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-dark-surface/90 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your question (e.g. SLA terms, refund policy, recommend products)..."
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
          />

          <Button type="submit" disabled={!inputMessage.trim() || loading} icon={Send} size="md">
            Send
          </Button>
        </form>
      </div>

      {/* Customer Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        conversationId={conversationId}
        customerId={user?.id}
      />
    </div>
  );
};
