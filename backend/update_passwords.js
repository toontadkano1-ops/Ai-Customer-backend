import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const validHash = bcrypt.hashSync('Password123!', 10);
  console.log('Generated fresh bcrypt hash for Password123!:', validHash);

  // 1. Update profiles for customer@acme.com and sophia@apex.io
  const updates = [
    { email: 'customer@acme.com', full_name: 'Alex Mercer (Customer)', role: 'customer' },
    { email: 'sophia@apex.io', full_name: 'Sophia Chen (Support Specialist)', role: 'agent' },
    { email: 'admin@apex.io', full_name: 'Elena Rostova (Admin)', role: 'admin' },
    { email: 'agent@apex.io', full_name: 'Marcus Vance (Lead Agent)', role: 'agent' }
  ];

  for (const item of updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ password_hash: validHash, full_name: item.full_name, role: item.role })
      .eq('email', item.email)
      .select();

    if (error) {
      console.error(`Error updating profile ${item.email}:`, error.message);
    } else {
      console.log(`Updated profile ${item.email}:`, data.length > 0 ? 'SUCCESS' : 'NOT FOUND (will insert)');
      if (data.length === 0) {
        // Insert if not found
        const { error: insertErr } = await supabase
          .from('profiles')
          .insert({
            business_id: 'a0000000-0000-0000-0000-000000000001',
            email: item.email,
            full_name: item.full_name,
            role: item.role,
            password_hash: validHash
          });
        if (insertErr) console.error(`Insert failed for ${item.email}:`, insertErr.message);
        else console.log(`Inserted profile for ${item.email}`);
      }
    }
  }

  // 2. Also ensure customers table has Alex Mercer
  const { data: custData, error: custErr } = await supabase
    .from('customers')
    .select('*')
    .eq('email', 'customer@acme.com');

  console.log('Customer in customers table:', custData);

  // Check all profiles after update
  const { data: allProfiles } = await supabase.from('profiles').select('email, role, full_name');
  console.log('All profiles now in Supabase:', allProfiles);
}

run();
