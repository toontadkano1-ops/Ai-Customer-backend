import React from 'react';
import { ChatWindow } from '../components/chatbot/ChatWindow.jsx';
import { Sparkles } from 'lucide-react';

export const ChatAssistantPage = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            AI Customer Experience Concierge
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test natural language queries against approved knowledge documents with verified uncertainty handling.
          </p>
        </div>
      </div>

      <ChatWindow />
    </div>
  );
};
