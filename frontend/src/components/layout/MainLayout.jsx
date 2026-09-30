import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-slate-100">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
