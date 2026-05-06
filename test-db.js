import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPrices() {
  const { data, error } = await supabase
    .from('checkouts')
    .select('slug, price')
    .in('slug', ['comunidade-wms', 'wms-novo-teste', 'receitas-praticas', 'visagismo-ia']);

  if (error) {
    console.error("Error fetching checkouts:", error);
    return;
  }

  console.log("Database Prices:");
  console.log(JSON.stringify(data, null, 2));
}

checkPrices();
