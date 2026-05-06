import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables");
  Deno.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const slugs = ['comunidade-wms', 'wms-novo-teste', 'visagismo-ia', 'receitas-praticas'];
  
  console.log("Checking checkouts table for slugs:", slugs);
  
  const { data, error } = await supabase
    .from('checkouts')
    .select('id, slug, price, active, status')
    .in('slug', slugs);

  if (error) {
    console.error("Error fetching checkouts:", error);
  } else {
    console.log("Checkouts in DB:");
    console.table(data);
  }

  // Also check if there's any other table that might be confusing the logic
  // or if there's a view named 'checkouts'
}

await checkData();
