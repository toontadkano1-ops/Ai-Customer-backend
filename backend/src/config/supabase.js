import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

let supabaseClient = null;

if (config.supabase.url && config.supabase.serviceRoleKey) {
  try {
    supabaseClient = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('[Supabase] Initialized with Service Role client');
  } catch (err) {
    console.warn('[Supabase] Initialization failed, using local datastore fallback:', err.message);
  }
} else {
  console.log('[Supabase] No credentials specified in .env. Running in Zero-Config Local Multi-Tenant Store mode.');
}

export const supabase = supabaseClient;
