-- ==============================================================================
-- CX Intelligence Database Schema
-- Multi-Tenant PostgreSQL with Supabase RLS & Indexing
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BUSINESSES (Organizations)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (Admins, Agents, Users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'agent', 'customer')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    preferences JSONB DEFAULT '{"interests": [], "preferred_channel": "web_chat", "notifications": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_customer_email_per_business UNIQUE (business_id, email)
);

-- 4. CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'escalated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('customer', 'assistant', 'agent')),
    content TEXT NOT NULL,
    sentiment VARCHAR(50) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    intent VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TICKETS
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    assigned_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_for_customer', 'resolved', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 7. TICKET_MESSAGES
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('agent', 'customer', 'system')),
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. KNOWLEDGE_ARTICLES
CREATE TABLE IF NOT EXISTS knowledge_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AI_ANALYSIS
CREATE TABLE IF NOT EXISTS ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    sentiment VARCHAR(50) NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    confidence NUMERIC(4, 3) NOT NULL,
    intent VARCHAR(100) NOT NULL,
    keywords JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_business_id ON profiles(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_business_id ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business_customer ON conversations(business_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tickets_business_status ON tickets(business_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_agent ON tickets(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_business_published ON knowledge_articles(business_id, published);
CREATE INDEX IF NOT EXISTS idx_products_business_category ON products(business_id, category);
CREATE INDEX IF NOT EXISTS idx_recommendations_customer ON recommendations(customer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_customer ON feedback(customer_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_message ON ai_analysis(message_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;

-- Service Role Policy (Full access for backend server client)
CREATE POLICY service_role_bypass_businesses ON businesses USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_profiles ON profiles USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_customers ON customers USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_conversations ON conversations USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_messages ON messages USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_tickets ON tickets USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_ticket_messages ON ticket_messages USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_knowledge ON knowledge_articles USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_products ON products USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_recommendations ON recommendations USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_feedback ON feedback USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY service_role_bypass_ai_analysis ON ai_analysis USING (auth.jwt() ->> 'role' = 'service_role');
