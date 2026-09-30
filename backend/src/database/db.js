import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

// Realistic initial seed data for local zero-config mode
const generateId = () => {
  return randomUUID ? randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const DEFAULT_HASH = bcrypt.hashSync('Password123!', 10);

const localStore = {
  businesses: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Apex Cloud Tech',
      description: 'Enterprise Cloud & AI Solutions Provider',
      created_at: new Date('2026-01-01').toISOString()
    }
  ],
  profiles: [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      full_name: 'Elena Rostova (Admin)',
      email: 'admin@apex.io',
      password_hash: DEFAULT_HASH,
      role: 'admin',
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      full_name: 'Marcus Vance (Lead Agent)',
      email: 'agent@apex.io',
      password_hash: DEFAULT_HASH,
      role: 'agent',
      created_at: new Date('2026-01-02').toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000003',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      full_name: 'Sophia Chen (Specialist)',
      email: 'sophia@apex.io',
      password_hash: DEFAULT_HASH,
      role: 'agent',
      created_at: new Date('2026-01-03').toISOString()
    }
  ],
  customers: [
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Alex Mercer',
      email: 'customer@acme.com',
      password_hash: DEFAULT_HASH,
      preferences: {
        interests: ['Cloud Infrastructure', 'Kubernetes', 'High Availability'],
        preferred_channel: 'web_chat',
        notifications: true
      },
      created_at: new Date('2026-01-05').toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Diana Prince',
      email: 'diana@themyscira.org',
      password_hash: DEFAULT_HASH,
      preferences: {
        interests: ['AI Observability', 'Security Monitoring'],
        preferred_channel: 'email',
        notifications: false
      },
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Carlos Mendez',
      email: 'carlos@fintechflow.com',
      password_hash: DEFAULT_HASH,
      preferences: {
        interests: ['FinTech Compliance', 'Audit Logs', 'API Gateway'],
        preferred_channel: 'web_chat',
        notifications: true
      },
      created_at: new Date('2026-01-12').toISOString()
    }
  ],
  conversations: [
    {
      id: 'v0000000-0000-0000-0000-000000000001',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      customer_id: 'c0000000-0000-0000-0000-000000000001',
      status: 'active',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 600000).toISOString()
    }
  ],
  messages: [
    {
      id: 'x0000000-0000-0000-0000-000000000001',
      conversation_id: 'v0000000-0000-0000-0000-000000000001',
      sender_type: 'customer',
      content: 'Hello! Could you tell me what SLA guarantee Apex Cloud provides for Enterprise workloads?',
      sentiment: 'neutral',
      intent: 'sla_inquiry',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'x0000000-0000-0000-0000-000000000002',
      conversation_id: 'v0000000-0000-0000-0000-000000000001',
      sender_type: 'assistant',
      content: 'Apex Cloud guarantees 99.99% monthly uptime for all Enterprise tier subscriptions with automatic SLA billing credits if downtime thresholds are exceeded.',
      sentiment: 'positive',
      intent: 'sla_inquiry_response',
      created_at: new Date(Date.now() - 3600000 * 3 + 30000).toISOString()
    },
    {
      id: 'x0000000-0000-0000-0000-000000000003',
      conversation_id: 'v0000000-0000-0000-0000-000000000001',
      sender_type: 'customer',
      content: 'That is great. We are also setting up multi-region clusters, can you suggest best products?',
      sentiment: 'positive',
      intent: 'product_recommendation',
      created_at: new Date(Date.now() - 600000).toISOString()
    }
  ],
  tickets: [
    {
      id: 't0000000-0000-0000-0000-000000000001',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      customer_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_agent_id: 'b0000000-0000-0000-0000-000000000002',
      subject: 'Intermittent 502 Bad Gateway during pod autoscaling',
      description: 'Our EU-West cluster experienced brief connection drops when autoscaling from 10 to 45 pods.',
      priority: 'high',
      category: 'Infrastructure',
      status: 'in_progress',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      resolved_at: null
    },
    {
      id: 't0000000-0000-0000-0000-000000000002',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      customer_id: 'c0000000-0000-0000-0000-000000000002',
      assigned_agent_id: 'b0000000-0000-0000-0000-000000000003',
      subject: 'Request for SOC2 Type II compliance audit packet',
      description: 'We need the latest SOC2 compliance packet and pentest report for our annual audit.',
      priority: 'medium',
      category: 'Compliance',
      status: 'resolved',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      resolved_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 't0000000-0000-0000-0000-000000000003',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      customer_id: 'c0000000-0000-0000-0000-000000000003',
      assigned_agent_id: 'b0000000-0000-0000-0000-000000000002',
      subject: 'Billing discrepancy on invoice #INV-9284',
      description: 'Annual discount code was not reflected on the latest payment cycle.',
      priority: 'medium',
      category: 'Billing',
      status: 'open',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString(),
      resolved_at: null
    }
  ],
  ticket_messages: [
    {
      id: 'm0000000-0000-0000-0000-000000000001',
      ticket_id: 't0000000-0000-0000-0000-000000000001',
      sender_id: 'c0000000-0000-0000-0000-000000000001',
      sender_name: 'Alex Mercer',
      sender_type: 'customer',
      content: 'We noticed 502 errors starting around 14:00 UTC. Here is the ingress log snippet.',
      is_internal: false,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'm0000000-0000-0000-0000-000000000002',
      ticket_id: 't0000000-0000-0000-0000-000000000001',
      sender_id: 'b0000000-0000-0000-0000-000000000002',
      sender_name: 'Marcus Vance (Lead Agent)',
      sender_type: 'agent',
      content: 'Internal note: Node group autoscaler scale-up delay was 45s. Adjusting warm standby pool.',
      is_internal: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'm0000000-0000-0000-0000-000000000003',
      ticket_id: 't0000000-0000-0000-0000-000000000001',
      sender_id: 'b0000000-0000-0000-0000-000000000002',
      sender_name: 'Marcus Vance (Lead Agent)',
      sender_type: 'agent',
      content: 'Hi Alex, we identified the target capacity buffer bottleneck and applied a warm-standby patch.',
      is_internal: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  knowledge_articles: [
    {
      id: 'k0000000-0000-0000-0000-000000000001',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Apex Cloud SLA & Uptime Guarantee',
      content: 'Apex Cloud guarantees 99.99% monthly uptime for all Enterprise tier subscriptions. Scheduled maintenance is announced 72 hours in advance and executed during off-peak weekend windows (02:00 - 04:00 UTC). Outages exceeding 0.01% trigger automatic SLA billing credits upon request.',
      category: 'Service Level Agreement',
      published: true,
      created_at: new Date('2026-01-01').toISOString(),
      updated_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'k0000000-0000-0000-0000-000000000002',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Subscription & Refund Terms',
      content: 'All subscription plans offer a 30-day money-back guarantee for first-time customers. Renewal charges are non-refundable after 7 days from the invoice date. Annual subscriptions can be cancelled with prorated credits applied to future billing cycles.',
      category: 'Billing & Subscriptions',
      published: true,
      created_at: new Date('2026-01-01').toISOString(),
      updated_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'k0000000-0000-0000-0000-000000000003',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'API Rate Limiting & Quotas',
      content: 'Standard REST endpoints permit 1,000 requests per minute per API key. High-throughput endpoints (Telemetry ingestion) permit up to 10,000 req/min. Exceeding rate limits returns HTTP 429 Too Many Requests with a Retry-After header. Dedicated IP pooling is available for Enterprise clients.',
      category: 'Technical Documentation',
      published: true,
      created_at: new Date('2026-01-01').toISOString(),
      updated_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'k0000000-0000-0000-0000-000000000004',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'Security Compliance & SOC2 Certification',
      content: 'Apex Cloud is SOC 2 Type II certified and ISO 27001 compliant. All customer data at rest is encrypted using AES-256-GCM. In-transit communication is secured via TLS 1.3 with automated certificate rotation every 90 days.',
      category: 'Security & Compliance',
      published: true,
      created_at: new Date('2026-01-01').toISOString(),
      updated_at: new Date('2026-01-01').toISOString()
    }
  ],
  products: [
    {
      id: 'p0000000-0000-0000-0000-000000000001',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Apex Cloud Kubernetes Mesh',
      description: 'Fully managed auto-scaling Kubernetes cluster with zero-downtime rolling upgrades and multi-region failover.',
      category: 'Cloud Infrastructure',
      price: 199.00,
      active: true,
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'p0000000-0000-0000-0000-000000000002',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Enterprise Shield SOC2 Security Suite',
      description: 'Continuous intrusion detection, automated compliance scanning, and cryptographic audit log immutability.',
      category: 'Security',
      price: 349.00,
      active: true,
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'p0000000-0000-0000-0000-000000000003',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'AI Observability & Trace Engine',
      description: 'Real-time distributed tracing with automatic anomaly detection and root cause incident alerts.',
      category: 'AI Observability',
      price: 149.00,
      active: true,
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'p0000000-0000-0000-0000-000000000004',
      business_id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Global API Gateway Accelerator',
      description: 'Edge-cached API gateway routing requests across 40 worldwide points of presence with sub-10ms latency.',
      category: 'API Gateway',
      price: 89.00,
      active: true,
      created_at: new Date('2026-01-01').toISOString()
    }
  ],
  recommendations: [
    {
      id: 'r0000000-0000-0000-0000-000000000001',
      customer_id: 'c0000000-0000-0000-0000-000000000001',
      product_id: 'p0000000-0000-0000-0000-000000000001',
      reason: 'Recommended based on your interest in Kubernetes cluster orchestration and auto-scaling.',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'r0000000-0000-0000-0000-000000000002',
      customer_id: 'c0000000-0000-0000-0000-000000000001',
      product_id: 'p0000000-0000-0000-0000-000000000003',
      reason: 'Matches your high-availability monitoring needs with real-time distributed tracing.',
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  feedback: [
    {
      id: 'f0000000-0000-0000-0000-000000000001',
      customer_id: 'c0000000-0000-0000-0000-000000000001',
      conversation_id: 'v0000000-0000-0000-0000-000000000001',
      rating: 5,
      comment: 'Super fast response and precise citation of SLA terms!',
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ],
  ai_analysis: [
    {
      id: 'z0000000-0000-0000-0000-000000000001',
      message_id: 'x0000000-0000-0000-0000-000000000001',
      sentiment: 'neutral',
      confidence: 0.942,
      intent: 'sla_inquiry',
      keywords: ['sla', 'uptime', 'enterprise'],
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'z0000000-0000-0000-0000-000000000003',
      message_id: 'x0000000-0000-0000-0000-000000000003',
      sentiment: 'positive',
      confidence: 0.985,
      intent: 'product_recommendation',
      keywords: ['great', 'multi-region', 'clusters', 'suggest'],
      created_at: new Date(Date.now() - 600000).toISOString()
    }
  ]
};

// Generic DB repository interface
let warnedTables = new Set();

export const db = {
  // Query table with filters
  find: async (table, filter = {}) => {
    if (supabase) {
      try {
        let query = supabase.from(table).select('*');
        for (const [key, val] of Object.entries(filter)) {
          query = query.eq(key, val);
        }
        const { data, error } = await query;
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            if (!warnedTables.has(table)) {
              warnedTables.add(table);
              console.log(`[Supabase Notice] Table "${table}" is not yet created in Supabase. Running in resilient local store mode. To migrate: run database/schema.sql in Supabase SQL editor.`);
            }
          } else {
            throw error;
          }
        } else if (data) {
          return data;
        }
      } catch (err) {
        if (!err.message?.includes('schema cache')) {
          console.warn(`[Supabase Query Warning] ${table}:`, err.message);
        }
      }
    }

    const items = localStore[table] || [];
    return items.filter(item => {
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] !== val) return false;
      }
      return true;
    });
  },

  // Find single record
  findOne: async (table, filter = {}) => {
    if (supabase) {
      try {
        let query = supabase.from(table).select('*');
        for (const [key, val] of Object.entries(filter)) {
          query = query.eq(key, val);
        }
        const { data, error } = await query.limit(1).maybeSingle();
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            // fallback
          } else {
            throw error;
          }
        } else if (data) {
          return data;
        }
      } catch (err) {
        // fallback
      }
    }

    const items = await db.find(table, filter);
    return items.length > 0 ? items[0] : null;
  },

  // Find by ID
  findById: async (table, id) => {
    return db.findOne(table, { id });
  },

  // Insert record
  insert: async (table, item) => {
    const record = {
      id: item.id || generateId(),
      ...item,
      created_at: item.created_at || new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from(table).insert([record]).select().single();
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            // fallback to local
          } else {
            throw error;
          }
        } else if (data) {
          return data;
        }
      } catch (err) {
        // fallback to local
      }
    }

    if (!localStore[table]) localStore[table] = [];
    localStore[table].push(record);
    return record;
  },

  // Update record
  update: async (table, id, updates) => {
    const updatedFields = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from(table).update(updatedFields).eq('id', id).select().single();
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            // fallback
          } else {
            throw error;
          }
        } else if (data) {
          return data;
        }
      } catch (err) {
        // fallback
      }
    }

    const items = localStore[table] || [];
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updatedFields };
    return items[index];
  },

  // Delete record
  delete: async (table, id) => {
    if (supabase) {
      try {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            // fallback
          } else {
            throw error;
          }
        } else {
          return true;
        }
      } catch (err) {
        // fallback
      }
    }

    if (!localStore[table]) return false;
    const initialLen = localStore[table].length;
    localStore[table] = localStore[table].filter(item => item.id !== id);
    return localStore[table].length < initialLen;
  },

  // Query raw for specialized joins/aggregations
  getStore: () => localStore
};
