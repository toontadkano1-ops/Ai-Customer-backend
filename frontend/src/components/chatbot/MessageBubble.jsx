import React from 'react';
import { Bot, User, BookOpen, AlertCircle } from 'lucide-react';
import { SentimentIndicator } from '../common/SentimentIndicator.jsx';

export const MessageBubble = ({ message, onActionClick }) => {
  const isAssistant = message.sender_type === 'assistant';

  return (
    <div className={`flex gap-3 my-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-brand-500/20">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[78%] flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        {/* Message bubble card */}
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isAssistant
              ? 'bg-slate-900 border border-slate-800 text-slate-100 shadow-sm'
              : 'bg-brand-600 text-white shadow-md shadow-brand-600/10'
          }`}
        >
          {/* Main message text */}
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Grounding Source references */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1 mb-1">
                <BookOpen className="w-3 h-3 text-brand-400" />
                Grounded in Approved Documentation:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.sources.map((src, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20 text-[11px]"
                  >
                    {src.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Uncertainty notice */}
          {message.is_uncertain && (
            <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
              <span>
                This response communicates policy uncertainty to prevent inaccurate assumptions. A human specialist is ready to assist.
              </span>
            </div>
          )}
        </div>

        {/* Metadata footer: Sentiment & Intent indicator */}
        <div className="mt-1 flex items-center gap-2 px-1 text-[11px] text-slate-500">
          <span>{new Date(message.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {message.sentiment && (
            <SentimentIndicator sentiment={message.sentiment} confidence={message.confidence} />
          )}
          {message.intent && (
            <span className="bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-400">
              intent: {message.intent}
            </span>
          )}
        </div>

        {/* Suggested Next Actions */}
        {message.suggested_actions && message.suggested_actions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.suggested_actions.map((action, i) => (
              <button
                key={i}
                onClick={() => onActionClick && onActionClick(action)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 hover:bg-brand-600/30 text-slate-300 hover:text-white border border-slate-700 hover:border-brand-500/40 transition-colors"
              >
                {action} →
              </button>
            ))}
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-300 border border-slate-700">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
