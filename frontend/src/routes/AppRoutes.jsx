import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout.jsx';
import { ProtectedRoute } from '../components/layout/ProtectedRoute.jsx';
import { DashboardPage } from '../pages/DashboardPage.jsx';
import { ChatAssistantPage } from '../pages/ChatAssistantPage.jsx';
import { ConversationsPage } from '../pages/ConversationsPage.jsx';
import { CustomersPage } from '../pages/CustomersPage.jsx';
import { TicketsPage } from '../pages/TicketsPage.jsx';
import { RecommendationsPage } from '../pages/RecommendationsPage.jsx';
import { KnowledgeBasePage } from '../pages/KnowledgeBasePage.jsx';
import { AnalyticsPage } from '../pages/AnalyticsPage.jsx';
import { SettingsPage } from '../pages/SettingsPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/assistant" element={<ChatAssistantPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/knowledge" element={<KnowledgeBasePage />} />

          {/* Admin & Agent only routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'agent']} />}>
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Admin only routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
