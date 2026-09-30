import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';
import { FloatingChatWidget } from '../chatbot/FloatingChatWidget.jsx';

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070814] text-slate-100 selection:bg-violet-600 relative">
      {/* Subtle Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-blob" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[150px] pointer-events-none -z-10 animate-blob animation-delay-2000" />
      
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Persistent Customer Live Chat Floating Widget */}
      <FloatingChatWidget />
    </div>
  );
};
