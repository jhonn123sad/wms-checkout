/**
 * CORE DE PAGAMENTO — V2.0.9-TEST
 * FORCE TEST: HARDCODED RESPONSE TO VERIFY DEPLOY
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  return new Response(JSON.stringify({
    message: "IF YOU SEE THIS, DEPLOY 2.0.9-TEST IS ACTIVE",
    amount_cents: 9999,
    version: "2.0.9-TEST"
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
