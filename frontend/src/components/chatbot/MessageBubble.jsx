import React from 'react';
import { Bot, User, BookOpen, AlertCircle } from 'lucide-react';
import { SentimentIndicator } from '../common/SentimentIndicator.jsx';

export const MessageBubble = ({ message, onActionClick }) => {
  const isAssistant = message.sender_type === 'assistant';

  return (
    <div className={`flex gap-3 my-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-brand-500/20 ring-1 ring-white/10">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div className={`max-w-[82%] flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        {/* Message bubble card */}
        <div
          className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed ${
            isAssistant
              ? 'bg-slate-900/90 border border-slate-800 text-slate-100 shadow-md backdrop-blur-md'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/15'
          }`}
        >
          {/* Main message text */}
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Grounding Source references */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-xs sm:text-sm">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                Grounded in Approved Documentation:
              </span>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((src, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/15 text-brand-300 border border-brand-500/25 text-xs font-semibold"
                  >
                    {src.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Uncertainty notice */}
          {message.is_uncertain && (
            <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <span>
                This response communicates policy uncertainty to prevent inaccurate assumptions. A human specialist is ready to assist.
              </span>
            </div>
          )}
        </div>

        {/* Metadata footer: Sentiment & Intent indicator */}
        <div className="mt-1.5 flex items-center gap-2.5 px-1.5 text-xs text-slate-400 font-medium">
          <span className="capitalize">{message.sender_type}</span>
          <span>•</span>
          <span>{new Date(message.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {message.sentiment && (
            <>
              <span>•</span>
              <SentimentIndicator sentiment={message.sentiment} size="sm" />
            </>
          )}
        </div>

        {/* Suggested actions chips */}
        {message.suggested_actions && message.suggested_actions.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {message.suggested_actions.map((action, i) => (
              <button
                key={i}
                onClick={() => onActionClick && onActionClick(action)}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold hover:border-brand-500/40 hover:text-white transition-all shadow-sm"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 shadow-md">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
