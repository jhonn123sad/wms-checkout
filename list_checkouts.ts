import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rqassaxkbntpcwhvevyi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYXNzYXhrYm50cGN3aHZldnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MTA1OTQsImV4cCI6MjA5MzA4NjU5NH0.whS2aT4JOYXIgrw2VXBToZZ6uMLIGf5CokcfyuyDG9k";

const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = await supabase
  .from("checkouts")
  .select("id, title, slug")
  .limit(5);

if (error) {
  console.error("Error:", error);
} else {
  console.log(JSON.stringify(data, null, 2));
}
