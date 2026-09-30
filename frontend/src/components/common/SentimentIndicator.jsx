import React from 'react';
import { Smile, Meh, Frown, AlertTriangle } from 'lucide-react';
import { Badge } from './Badge.jsx';

export const SentimentIndicator = ({ sentiment = 'neutral', confidence, showEscalation = false }) => {
  const configs = {
    positive: {
      label: 'Positive',
      variant: 'success',
      icon: Smile,
      textColor: 'text-emerald-400'
    },
    neutral: {
      label: 'Neutral',
      variant: 'default',
      icon: Meh,
      textColor: 'text-slate-400'
    },
    negative: {
      label: 'Negative',
      variant: 'danger',
      icon: Frown,
      textColor: 'text-rose-400'
    }
  };

  const current = configs[sentiment.toLowerCase()] || configs.neutral;
  const Icon = current.icon;

  return (
    <div className="inline-flex items-center gap-1.5">
      <Badge variant={current.variant} size="sm">
        <Icon className="w-3.5 h-3.5" />
        <span className="capitalize">{current.label}</span>
        {confidence !== undefined && (
          <span className="opacity-75 font-mono text-[10px]">
            {Math.round(confidence * 100)}%
          </span>
        )}
      </Badge>
      {showEscalation && (
        <Badge variant="warning" size="sm" className="animate-pulse">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span>Escalation Alert</span>
        </Badge>
      )}
    </div>
  );
};
