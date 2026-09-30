# CX Intelligence - Setup & Deployment Guide

This guide walks you through setting up CX Intelligence in development and production environments.

## Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **NPM**: v9.0.0 or higher
- **PostgreSQL / Supabase**: Free tier Supabase project OR local PostgreSQL instance.

---

## 1. Quick Start (Development Mode)

CX Intelligence is configured to run out-of-the-box with an intelligent simulated multi-tenant backend engine if Supabase credentials are not yet configured, allowing full end-to-end testing immediately.

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
2. Configure `.env` if using Supabase or an AI provider (e.g. Google Gemini, OpenAI). If left blank, CX Intelligence runs in local Mock AI mode with fully functional offline embeddings, sentiment classifier, and RAG search.
3. Start the backend:
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:5000`.

### Frontend Setup
1. In a separate terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 2. Supabase Integration
To connect to live Supabase PostgreSQL:
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Execute `database/schema.sql` to create all tables, indexes, and RLS policies.
4. Execute `database/seed.sql` to populate sample multi-tenant business data, knowledge base articles, products, and tickets.
5. In your Supabase Project Settings:
   - Copy **Project URL**
   - Copy **anon / public key**
   - Copy **service_role key** (keep secret, only for backend)
6. Add these to `backend/.env` and `frontend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

---

## 3. Pre-Configured Demo Accounts
The application includes a demo account switcher on the login screen for testing:
- **Admin**: `admin@apex.io` / `Password123!` (Access to settings, full analytics, team, KB)
- **Support Agent**: `agent@apex.io` / `Password123!` (Access to assigned tickets, conversations, sentiment)
- **Customer**: `customer@acme.com` / `Password123!` (Access to live AI assistant, self-service tickets)

---

## 4. Running Automated Tests
- Backend test suite:
  ```bash
  cd backend
  npm test
  ```
- Frontend test suite:
  ```bash
  cd frontend
  npm test
  ```
