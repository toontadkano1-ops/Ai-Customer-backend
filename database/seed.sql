-- ==============================================================================
-- CX Intelligence - Seed Data
-- Multi-Tenant Realistic Seed Records with Valid RFC-4122 Hex UUIDs
-- ==============================================================================

-- 1. BUSINESS
INSERT INTO businesses (id, name, description)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'Apex Cloud Tech', 'Enterprise Cloud & AI Solutions Provider')
ON CONFLICT (id) DO NOTHING;

-- 2. PROFILES (Admins, Support Agents)
-- Password: 'Password123!'
INSERT INTO profiles (id, business_id, full_name, email, password_hash, role)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Elena Rostova (Admin)', 'admin@apex.io', '$2b$10$t.GKFo5ylTGpqmK/vJY.X..bSAAMCb.2/qzgT7xpNeRq8zZGsPpP6', 'admin'),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Marcus Vance (Lead Agent)', 'agent@apex.io', '$2b$10$t.GKFo5ylTGpqmK/vJY.X..bSAAMCb.2/qzgT7xpNeRq8zZGsPpP6', 'agent'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Sophia Chen (Support Specialist)', 'sophia@apex.io', '$2b$10$t.GKFo5ylTGpqmK/vJY.X..bSAAMCb.2/qzgT7xpNeRq8zZGsPpP6', 'agent')
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
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Apex Cloud SLA & Uptime Guarantee', 'Apex Cloud guarantees 99.99% monthly uptime for all Enterprise tier subscriptions. Scheduled maintenance is announced 72 hours in advance and executed during off-peak weekend windows (02:00 - 04:00 UTC). Outages exceeding 0.01% trigger automatic SLA billing credits upon request.', 'Service Level Agreement', true),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Subscription & Refund Terms', 'All subscription plans offer a 30-day money-back guarantee for first-time customers. Renewal charges are non-refundable after 7 days from the invoice date. Annual subscriptions can be cancelled with prorated credits applied to future billing cycles.', 'Billing & Subscriptions', true),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'API Rate Limiting & Quotas', 'Standard REST endpoints permit 1,000 requests per minute per API key. High-throughput endpoints (Telemetry ingestion) permit up to 10,000 req/min. Exceeding rate limits returns HTTP 429 Too Many Requests with a Retry-After header. Dedicated IP pooling is available for Enterprise clients.', 'Technical Documentation', true),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Security Compliance & SOC2 Certification', 'Apex Cloud is SOC 2 Type II certified and ISO 27001 compliant. All customer data at rest is encrypted using AES-256-GCM. In-transit communication is secured via TLS 1.3 with automated certificate rotation every 90 days.', 'Security & Compliance', true)
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCTS / SERVICES CATALOG
INSERT INTO products (id, business_id, name, description, category, price, active)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Apex Cloud Kubernetes Mesh', 'Fully managed auto-scaling Kubernetes cluster with zero-downtime rolling upgrades and multi-region failover.', 'Cloud Infrastructure', 199.00, true),
  ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Enterprise Shield SOC2 Security Suite', 'Continuous intrusion detection, automated compliance scanning, and cryptographic audit log immutability.', 'Security', 349.00, true),
  ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'AI Observability & Trace Engine', 'Real-time distributed tracing with automatic anomaly detection and root cause incident alerts.', 'AI Observability', 149.00, true),
  ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Global API Gateway Accelerator', 'Edge-cached API gateway routing requests across 40 worldwide points of presence with sub-10ms latency.', 'API Gateway', 89.00, true)
ON CONFLICT (id) DO NOTHING;

-- 6. SUPPORT TICKETS
INSERT INTO tickets (id, business_id, customer_id, assigned_agent_id, subject, description, priority, category, status, created_at, updated_at)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Intermittent 502 Bad Gateway during pod autoscaling', 'Our EU-West cluster experienced brief connection drops when autoscaling from 10 to 45 pods.', 'high', 'Infrastructure', 'in_progress', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour'),
  ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'Request for SOC2 Type II compliance audit packet', 'We need the latest SOC2 compliance packet and pentest report for our annual audit.', 'medium', 'Compliance', 'resolved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
  ('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Billing discrepancy on invoice #INV-9284', 'Annual discount code was not reflected on the latest payment cycle.', 'medium', 'Billing', 'open', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 7. TICKET MESSAGES
INSERT INTO ticket_messages (id, ticket_id, sender_id, sender_name, sender_type, content, is_internal, created_at)
VALUES
  ('f1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Alex Mercer', 'customer', 'We noticed 502 errors starting around 14:00 UTC. Here is the ingress log snippet.', false, NOW() - INTERVAL '2 days'),
  ('f1000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Marcus Vance (Lead Agent)', 'agent', 'Internal note: Node group autoscaler scale-up delay was 45s. Adjusting warm standby pool.', true, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
