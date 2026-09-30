# CX Intelligence - Frontend Web Application

> Enterprise-Grade AI-Powered Customer Experience (CX) Platform Frontend. Built with React 18, Vite, Tailwind CSS, Lucide Icons, and integrated with Google Gemini 3.8 Flash AI.

---

## 🌟 Key Features

1. **AI Concierge Assistant**:
   - Real-time customer chat interface powered by Google Gemini 3.8 Flash Hybrid Engine.
   - Grounded citations from official Knowledge Base and Product Catalog.
   - Sentiment detection with confidence metrics and suggested quick actions.

2. **Customer Interaction Hub**:
   - Live multi-channel conversation view with customer timeline.
   - Direct Agent Live Reply input bar for human-in-the-loop support.
   - 1-click escalation to high-priority support tickets.

3. **Support Ticket Management**:
   - Live KPI metric counters (Open, High Priority, Resolved, Avg Response).
   - 1-click `✓ Resolve` button directly on ticket rows.
   - Customer dropdown mapping and staff-only private internal notes.

4. **Smart Recommendation Engine**:
   - AI-driven product affinity scoring based on user conversation interests.
   - Interactive **Deploy Solution** cloud provisioning pipeline modal.
   - Persistent `Live in Production` status and cluster query shortcuts.

5. **Analytics & Sentiment Intelligence**:
   - Interactive trend charts for customer sentiment distribution, CSAT scores, and ticket volume.
   - Real-time AI operational insights and proactive SLA warning alerts.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **State & Auth**: React Context API + LocalStorage Session Persistence
- **API Client**: Axios with centralized request/response interceptors

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the `frontend` root:
```env
VITE_API_BASE_URL=/api
VITE_APP_NAME=CX Intelligence
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 👥 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@apex.io` | `Password123!` |
| **Agent** | `agent@apex.io` | `Password123!` |
| **Customer** | `customer@acme.com` | `Password123!` |

---

## 📄 License
MIT License
