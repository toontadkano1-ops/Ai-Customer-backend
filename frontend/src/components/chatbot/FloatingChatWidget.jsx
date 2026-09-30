import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Minus, Sparkles, ShieldCheck, Send } from 'lucide-react';
import { ChatWindow } from './ChatWindow.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { CXLogo } from '../common/CXLogo.jsx';

export const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };

    window.addEventListener('open-customer-live-chat', handleOpen);
    return () => window.removeEventListener('open-customer-live-chat', handleOpen);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Box */}
      {isOpen && !isMinimized && (
        <div className="w-[460px] max-w-[calc(100vw-2rem)] h-[640px] max-h-[calc(100vh-6rem)] mb-4 rounded-3xl border border-[#1C2242] bg-[#0A0C1B]/95 backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#0E1128] via-[#090B1B] to-[#0A0C1B] border-b border-[#1C2242] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CXLogo size="sm" showText={false} />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                  CX Concierge Live Chat
                  <span className="text-[11px] px-2 py-0.5 bg-violet-500/15 text-violet-300 rounded-md font-semibold border border-violet-500/30">
                    Gemini 3.8
                  </span>
                </h3>
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Grounded AI & Live Support
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#141836] rounded-xl transition-colors"
                title="Minimize"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#141836] rounded-xl transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embedded Chat Engine */}
          <div className="flex-1 overflow-hidden p-2">
            <ChatWindow />
          </div>
        </div>
      )}

      {/* Minimized / Closed Launcher Button */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-3.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-2xl shadow-violet-900/40 hover:shadow-violet-800/60 hover:scale-105 active:scale-95 transition-all duration-200 border border-violet-400/40"
        >
          {/* Pulsing glow ring */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0A0C1B]"></span>
          </span>

          <div className="p-2 bg-white/15 rounded-full shadow-inner">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="text-left pr-1">
            <span className="text-sm font-bold block leading-none font-display">Customer Live Chat</span>
            <span className="text-xs text-violet-200 font-semibold leading-tight flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Ask AI or Live Support
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
