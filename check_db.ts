import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('checkouts')
    .select('*, checkout_fields(*)')
    .eq('slug', 'comunidade-wms')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Checkout:', data.title);
  console.log('Fields:', data.checkout_fields.map(f => ({ name: f.field_name, label: f.field_label })));
}

check();
