import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCheckout() {
  const { data, error } = await supabase
    .from('checkouts')
    .select('*')
    .eq('slug', 'wms-novo-teste')
    .maybeSingle();

  if (error) {
    console.error('Error fetching checkout:', error);
  } else if (data) {
    console.log('Checkout found:', JSON.stringify(data, null, 2));
  } else {
    console.log('Checkout not found');
  }
}

checkCheckout();
