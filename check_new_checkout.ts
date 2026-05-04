import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('checkouts')
    .select('*, checkout_fields(*)')
    .eq('slug', 'wms-novo-teste')
    .single();

  if (error) {
    console.log('Checkout wms-novo-teste not found or error:', error.message);
    return;
  }

  console.log('Checkout found:', data.title);
  console.log('Design Key:', data.design_key);
  console.log('Fields:', data.checkout_fields.map(f => f.field_name));
}

check();
