# CX Intelligence - AI-Powered Customer Experience Platform

A production-grade, multi-tenant AI-Powered Customer Experience (CX) management platform that integrates grounded conversational AI chatbots, sentiment intelligence, smart product recommendations, automated support ticketing, business knowledge-base management, and real-time operational analytics.

---

## 🚀 Key Features & Modules

### 1. 🤖 Grounded Conversational AI Assistant
- **Context-Aware Dialogue**: Maintains customer conversation history and multi-turn conversational context.
- **Strict Grounding against Knowledge Base**: Prevents hallucinations regarding SLAs, pricing, product availability, or refund policies.
- **Uncertainty Handling**: Communicates uncertainty clearly when a query falls outside approved documentation, offering 1-click human support escalation.
- **Customer Feedback Loop**: Allows 5-star rating surveys and qualitative feedback after conversations.

### 2. 🧠 Real-Time Sentiment & Intent Intelligence
- **Multi-Class NLP Classification**: Evaluates each customer message into `positive`, `neutral`, or `negative` with numerical confidence scores (0.00 – 1.00).
- **Intent Recognition**: Identifies customer goals (`sla_inquiry`, `technical_issue`, `billing_inquiry`, `refund_request`, `product_recommendation`, `complaint`).
- **Urgent Escalation Trigger**: Automatically flags negative sentiment spikes and high-dissatisfaction keywords to prompt priority ticket creation.

### 3. 🎯 Smart Explainable Recommendation Engine
- **Affinity-Driven Matching**: Analyzes customer stated preferences, recent conversation topics, and product categories.
- **Transparent Rationale**: Provides clear explainability for every suggestion (e.g. *"Recommended based on your interest in Kubernetes cluster orchestration and auto-scaling"*).
- **Reliable Fallbacks**: Graceful rule-based ranking if external AI services are unreachable.

### 4. 🎫 Enterprise Support Ticket Management
- **Full Lifecycle Workflow**: `Open` ➔ `In Progress` ➔ `Waiting for Customer` ➔ `Resolved` ➔ `Closed`.
- **AI-Assisted Priority Triage**: Automatically suggests priority (`urgent`, `high`, `medium`, `low`) based on text urgency and sentiment.
- **Role-Gated Internal Notes**: Support agents can write internal staff notes completely shielded from customer view.
- **Seamless Chat Escalation**: Directly convert active AI chat sessions into priority tickets with pre-populated transcripts.

### 5. 📊 Real-Time Operations & Sentiment Analytics
- **Live KPI StatCards**: Total Customers, AI Deflection Rate, Average First Response Time, Average Resolution Time, CSAT Score.
- **Recharts Visualizations**: Interactive Area Charts for interaction vs. resolution volume, Pie Charts for sentiment distribution, and Bar Charts for ticket category load.
- **Date Range Filtering**: 7-day, 30-day, 90-day dynamic windowing.
- **AI Business Insights**: Actionable recommendations generated from aggregated conversation trends.

### 6. 📚 Business Knowledge Base (RAG Source)
- **Authoritative Business Content**: Create, edit, and organize FAQs, SLAs, policies, and technical docs.
- **Real-Time Search & Category Filters**: Search articles by keyword or category.
- **Grounding Source Citations**: Chatbot responses include clickable source badges referencing exact article titles.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router DOM v6, Axios |
| **Backend** | Node.js (ESM), Express.js, MVC Architecture, Helmet, CORS, Morgan, Express Rate Limit |
| **Database & Auth** | Supabase PostgreSQL, Row Level Security (RLS), BCrypt, JWT, Zero-Config Local Fallback Store |
| **AI / NLP** | Modular AI Provider layer (Google Gemini 1.5 Flash, OpenAI GPT-4o-mini, Zero-Latency Local NLP Engine) |
| **Testing** | Node.js Native Test Runner (`node:test`), Supertest |

---

## 📂 Project Structure

```
cx-intelligence/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Badge, StatCard, SentimentIndicator
│   │   │   ├── layout/         # Sidebar, Header, MainLayout, ProtectedRoute
│   │   │   └── chatbot/        # ChatWindow, MessageBubble, FeedbackModal
│   │   ├── pages/              # Dashboard, Assistant, Conversations, Customers,
│   │   │                       # Tickets, Recommendations, KnowledgeBase, Analytics, Settings, Login
│   │   ├── context/            # AuthContext (JWT, session, 1-click role switcher)
│   │   ├── services/           # Axios API domain clients
│   │   ├── routes/             # AppRoutes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/             # env.js, supabase.js
│   │   ├── controllers/        # auth, customer, chat, sentiment, recs, ticket, kb, analytics
│   │   ├── services/           # aiProvider, mockAiService, ragService, sentiment, recs, analytics
│   │   ├── database/           # Universal multi-tenant repository (Supabase + local store fallback)
│   │   ├── middleware/         # authMiddleware, rateLimiter, errorHandler
│   │   ├── validators/         # Zod schemas
│   │   ├── routes/             # REST route modules
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/                  # auth.test.js, chat.test.js, tickets.test.js
│   └── package.json
│
├── database/
│   ├── schema.sql              # PostgreSQL DDL, Foreign Keys, Indexes, RLS Policies
│   ├── seed.sql                # Multi-tenant realistic demo records
│   └── migrations/             # Versioned SQL migrations
│
├── docs/
│   ├── architecture.md         # Mermaid system architecture diagrams & RBAC matrix
│   ├── api-documentation.md    # Complete REST API endpoint contracts
│   └── setup-guide.md          # Setup and configuration guide
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### Step 1: Start Backend
```bash
cd backend
npm install
npm run dev
```
*Backend starts on `http://localhost:5000` with the local zero-config multi-tenant store pre-loaded with seed data.*

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend will be running on `http://localhost:5173`.*

---

## 👥 Demo Logins

The login screen provides **1-click quick-login buttons** for rapid evaluation:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@apex.io` | `Password123!` | Full analytics, team management, KB creation, settings |
| **Support Agent** | `agent@apex.io` | `Password123!` | Ticket assignment, customer replies, internal notes, escalations |
| **Customer** | `customer@acme.com` | `Password123!` | Self-service conversational AI assistant, ticket submission, ratings |

---

## 🧪 Automated Testing

Execute the backend integration test suite:
```bash
cd backend
npm test
```
*Tests cover Authentication, Grounded SLA Inquiry, Uncertainty Fallbacks, Negative Sentiment Escalation, and Automatic Ticket Priority Suggestion.*

---

## 🔐 Security & Multi-Tenancy
- **Row-Level Security (RLS)**: Enforced across all tables (`businesses`, `profiles`, `customers`, `tickets`, `conversations`, `knowledge_articles`).
- **Data Isolation**: All queries enforce strict tenant boundary filtering (`WHERE business_id = $1`).
- **HTTP Hardening**: Helmet (HSTS, CSP, X-Content-Type-Options), CORS validation, and rate limiting on API & Auth routes.
