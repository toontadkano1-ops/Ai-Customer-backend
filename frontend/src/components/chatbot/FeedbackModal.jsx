import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { chatService } from '../../services/chatService.js';

export const FeedbackModal = ({ isOpen, onClose, conversationId, customerId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await chatService.submitFeedback({
        conversation_id: conversationId,
        customer_id: customerId,
        rating,
        comment
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-dark-surface border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white">Thank you for your feedback!</h3>
            <p className="text-sm text-slate-400 mt-1">Your rating helps improve our AI accuracy and response quality.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Rate your AI Assistant Experience</h3>
              <p className="text-sm text-slate-400 mt-0.5">How helpful was the information provided?</p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Comments or Suggestions (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your thoughts..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Submit Feedback
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
