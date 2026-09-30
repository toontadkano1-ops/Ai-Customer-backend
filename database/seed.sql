-- ==============================================================================
-- CX Intelligence - Seed Data
-- Multi-Tenant Realistic Seed Records
-- ==============================================================================

-- 1. BUSINESS
INSERT INTO businesses (id, name, description)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Apex Cloud Tech', 'Enterprise Cloud & AI Solutions Provider')
ON CONFLICT (id) DO NOTHING;

-- 2. PROFILES (Admins, Support Agents)
-- Passwords: 'Password123!' hashed with bcrypt (salt 10)
-- $2a$10$wO3b4Q9y0x5o9Qy1i.7g..3H8G1e5U0Uf6uH8pS7yVj0A5E2E2K2a
INSERT INTO profiles (id, business_id, full_name, email, password_hash, role)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Elena Rostova (Admin)', 'admin@apex.io', '$2b$10$E5z7cTshvIe5YvY.FzNxeOIq0uS9gW.r2bKqN1XvA8C.Qj4aA2u2q', 'admin'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Marcus Vance (Lead Agent)', 'agent@apex.io', '$2b$10$E5z7cTshvIe5YvY.FzNxeOIq0uS9gW.r2bKqN1XvA8C.Qj4aA2u2q', 'agent'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Sophia Chen (Support Specialist)', 'sophia@apex.io', '$2b$10$E5z7cTshvIe5YvY.FzNxeOIq0uS9gW.r2bKqN1XvA8C.Qj4aA2u2q', 'agent')
ON CONFLICT (id) DO NOTHING;

-- 3. CUSTOMERS
INSERT INTO customers (id, business_id, name, email, preferences)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Alex Mercer', 'customer@acme.com', '{"interests": ["Cloud Infrastructure", "Kubernetes", "High Availability"], "preferred_channel": "web_chat", "notifications": true}'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Diana Prince', 'diana@themyscira.org', '{"interests": ["AI Observability", "Security Monitoring"], "preferred_channel": "email", "notifications": false}'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Carlos Mendez', 'carlos@fintechflow.com', '{"interests": ["FinTech Compliance", "Audit Logs", "API Gateway"], "preferred_channel": "web_chat", "notifications": true}')
ON CONFLICT (id) DO NOTHING;

-- 4. KNOWLEDGE ARTICLES (For grounding RAG Chatbot)
INSERT INTO knowledge_articles (id, business_id, title, content, category, published)
VALUES
  ('k0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Apex Cloud SLA & Uptime Guarantee', 'Apex Cloud guarantees 99.99% monthly uptime for all Enterprise tier subscriptions. Scheduled maintenance is announced 72 hours in advance and executed during off-peak weekend windows (02:00 - 04:00 UTC). Outages exceeding 0.01% trigger automatic SLA billing credits upon request.', 'Service Level Agreement', true),
  ('k0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Subscription & Refund Terms', 'All subscription plans offer a 30-day money-back guarantee for first-time customers. Renewal charges are non-refundable after 7 days from the invoice date. Annual subscriptions can be cancelled with prorated credits applied to future billing cycles.', 'Billing & Subscriptions', true),
  ('k0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'API Rate Limiting & Quotas', 'Standard REST endpoints permit 1,000 requests per minute per API key. High-throughput endpoints (Telemetry ingestion) permit up to 10,000 req/min. Exceeding rate limits returns HTTP 429 Too Many Requests with a Retry-After header. Dedicated IP pooling is available for Enterprise clients.', 'Technical Documentation', true),
  ('k0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Security Compliance & SOC2 Certification', 'Apex Cloud is SOC 2 Type II certified and ISO 27001 compliant. All customer data at rest is encrypted using AES-256-GCM. In-transit communication is secured via TLS 1.3 with automated certificate rotation every 90 days.', 'Security & Compliance', true)
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCTS / SERVICES CATALOG
INSERT INTO products (id, business_id, name, description, category, price, active)
VALUES
  ('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Apex Cloud Kubernetes Mesh', 'Fully managed auto-scaling Kubernetes cluster with zero-downtime rolling upgrades and multi-region failover.', 'Cloud Infrastructure', 199.00, true),
  ('p0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Enterprise Shield SOC2 Security Suite', 'Continuous intrusion detection, automated compliance scanning, and cryptographic audit log immutability.', 'Security', 349.00, true),
  ('p0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'AI Observability & Trace Engine', 'Real-time distributed tracing with automatic anomaly detection and root cause incident alerts.', 'AI Observability', 149.00, true),
  ('p0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Global API Gateway Accelerator', 'Edge-cached API gateway routing requests across 40 worldwide points of presence with sub-10ms latency.', 'API Gateway', 89.00, true)
ON CONFLICT (id) DO NOTHING;

-- 6. SUPPORT TICKETS
INSERT INTO tickets (id, business_id, customer_id, assigned_agent_id, subject, description, priority, category, status, created_at, updated_at)
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Intermittent 502 Bad Gateway during pod autoscaling', 'Our EU-West cluster experienced brief connection drops when autoscaling from 10 to 45 pods.', 'high', 'Infrastructure', 'in_progress', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour'),
  ('t0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'Request for SOC2 Type II compliance audit packet', 'We need the latest SOC2 compliance packet and pentest report for our annual audit.', 'medium', 'Compliance', 'resolved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
  ('t0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Billing discrepancy on invoice #INV-9284', 'Annual discount code was not reflected on the latest payment cycle.', 'medium', 'Billing', 'open', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 7. TICKET MESSAGES
INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_name, sender_type, content, is_internal, created_at)
VALUES
  ('m0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Alex Mercer', 'customer', 'We noticed 502 errors starting around 14:00 UTC. Here is the ingress log snippet.', false, NOW() - INTERVAL '2 days'),
  ('m0000000-0000-0000-0000-000000000002', 't0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Marcus Vance (Lead Agent)', 'agent', 'Internal note: Node group autoscaler scale-up delay was 45s. Adjusting warm standby pool.', true, NOW() - INTERVAL '1 day'),
  ('m0000000-0000-0000-0000-000000000003', 't0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Marcus Vance (Lead Agent)', 'agent', 'Hi Alex, we identified the target capacity buffer bottleneck and applied a warm-standby patch.', false, NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- 8. CONVERSATIONS & MESSAGES
INSERT INTO conversations (id, business_id, customer_id, status, created_at, updated_at)
VALUES
  ('v0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'active', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '10 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_type, content, sentiment, intent, created_at)
VALUES
  ('x0000000-0000-0000-0000-000000000001', 'v0000000-0000-0000-0000-000000000001', 'customer', 'Hello! Could you tell me what SLA guarantee Apex Cloud provides for Enterprise workloads?', 'neutral', 'sla_inquiry', NOW() - INTERVAL '3 hours'),
  ('x0000000-0000-0000-0000-000000000002', 'v0000000-0000-0000-0000-000000000001', 'assistant', 'Apex Cloud guarantees 99.99% monthly uptime for all Enterprise tier subscriptions with automatic SLA billing credits if downtime thresholds are exceeded.', 'positive', 'sla_inquiry_response', NOW() - INTERVAL '3 hours' + INTERVAL '30 seconds'),
  ('x0000000-0000-0000-0000-000000000003', 'v0000000-0000-0000-0000-000000000001', 'customer', 'That is great. We are also setting up multi-region clusters, can you suggest best products?', 'positive', 'product_recommendation', NOW() - INTERVAL '10 minutes')
ON CONFLICT (id) DO NOTHING;

-- 9. AI ANALYSIS
INSERT INTO ai_analysis (id, message_id, sentiment, confidence, intent, keywords)
VALUES
  ('z0000000-0000-0000-0000-000000000001', 'x0000000-0000-0000-0000-000000000001', 'neutral', 0.942, 'sla_inquiry', '["sla", "uptime", "enterprise"]'::jsonb),
  ('z0000000-0000-0000-0000-000000000003', 'x0000000-0000-0000-0000-000000000003', 'positive', 0.985, 'product_recommendation', '["great", "multi-region", "clusters", "suggest"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 10. RECOMMENDATIONS
INSERT INTO recommendations (id, customer_id, product_id, reason, created_at)
VALUES
  ('r0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Recommended based on your interest in Kubernetes cluster orchestration and auto-scaling.', NOW() - INTERVAL '1 hour'),
  ('r0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 'Matches your high-availability monitoring needs with real-time distributed tracing.', NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

-- 11. FEEDBACK
INSERT INTO feedback (id, customer_id, conversation_id, rating, comment, created_at)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'v0000000-0000-0000-0000-000000000001', 5, 'Super fast response and precise citation of SLA terms!', NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;
