const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/SUPABASE_URL="(.+)"/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY="(.+)"/);

const supabaseUrl = urlMatch ? urlMatch[1] : null;
const supabaseKey = keyMatch ? keyMatch[1] : null;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables");
  process.exit(1);
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
    console.log(JSON.stringify(data, null, 2));
  }
}

checkData();
