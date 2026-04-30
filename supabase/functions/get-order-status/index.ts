/**
 * CHECKOUT CORE - NÃO ALTERAR SEM TESTE DE REGRESSÃO
 * Usado pelo frontend para verificar se o Pix foi pago e obter URL de redirecionamento.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId") || "";
    const token = url.searchParams.get("token") || "";
    
    if (!orderId || !token) {
      return json({ error: "ORDER_ID_AND_TOKEN_REQUIRED" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error } = await supabase
      .from("orders")
      .select("id,status,paid_at,product_id,public_access_token")
      .eq("id", orderId)
      .eq("public_access_token", token)
      .maybeSingle();
      
    if (error || !order) return json({ error: "ORDER_NOT_FOUND_OR_INVALID_TOKEN" }, 404);

    let thank_you_url: string | null = null;
    if (order.status === "paid" && order.product_id) {
      const { data: product } = await supabase
        .from("products")
        .select("thank_you_url")
        .eq("id", order.product_id)
        .maybeSingle();
      thank_you_url = product?.thank_you_url ?? Deno.env.get("THANK_YOU_URL") ?? null;
    }

    return json({
      orderId: order.id,
      status: order.status,
      paid_at: order.paid_at,
      thank_you_url,
      redirect_url: thank_you_url, // Alias requested by user
    });
  } catch (err) {
    console.error("[get-order-status]", err);
    return json({ error: "UNHANDLED_ERROR" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}