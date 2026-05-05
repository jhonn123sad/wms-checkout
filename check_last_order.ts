import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rqassaxkbntpcwhvevyi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYXNzYXhrYm50cGN3aHZldnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MTA1OTQsImV4cCI6MjA5MzA4NjU5NH0.whS2aT4JOYXIgrw2VXBToZZ6uMLIGf5CokcfyuyDG9k";

const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = await supabase
  .from("orders")
  .select(`
    id,
    status,
    checkout_id,
    public_access_token,
    metadata
  `)
  .order("created_at", { ascending: false })
  .limit(1);

if (error) {
  console.error("Error fetching order:", error);
  process.exit(1);
}

console.log(JSON.stringify(data[0], null, 2));
