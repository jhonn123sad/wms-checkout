import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = await supabase
  .from("orders")
  .select(`
    id,
    status,
    checkout_id,
    public_access_token,
    metadata,
    checkouts (
      slug,
      success_redirect_url
    )
  `)
  .order("created_at", { ascending: false })
  .limit(1);

if (error) {
  console.error("Error fetching order:", error);
  process.exit(1);
}

console.log(JSON.stringify(data[0], null, 2));
