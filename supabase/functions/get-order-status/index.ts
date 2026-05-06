import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const FUNCTION_VERSION = "get-order-status-stable-2026-05-06";

Deno.serve(async (req) => {
  // 11. Tratar OPTIONS corretamente
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. A função recebe orderId e token
    let orderId = "";
    let token = "";

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      orderId = body.orderId || "";
      token = body.token || "";
    } else {
      const url = new URL(req.url);
      orderId = url.searchParams.get("orderId") || "";
      token = url.searchParams.get("token") || "";
    }

    if (!orderId || !token) {
      return json({ error: "ORDER_ID_AND_TOKEN_REQUIRED" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 2. Buscar a order em public.orders por id = orderId
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, status, paid_at, product_id, checkout_id, public_access_token, amount_cents, metadata")
      .eq("id", orderId)
      .maybeSingle();

    // 4. Se a order não existir, retornar ORDER_NOT_FOUND
    if (error || !order) {
      return json({ error: "ORDER_NOT_FOUND" }, 404);
    }

    // 3. Validar order.public_access_token === token
    // 5. Se o token estiver errado, retornar INVALID_TOKEN
    if ((order.public_access_token || "").trim() !== (token || "").trim()) {
      return json({ error: "INVALID_TOKEN" }, 403);
    }

    const currentStatus = (order.status || "waiting_payment").toLowerCase();
    const isPaid = ["paid", "approved", "confirmed", "completed"].includes(currentStatus);
    const checkoutSlug = order.metadata?.checkout_slug || null;

    // 6. Se a order NÃO estiver paid
    if (!isPaid) {
      return json({
        orderId: order.id,
        status: order.status,
        paid_at: order.paid_at,
        paid: false,
        thank_you_url: null,
        redirect_url: null,
        checkout_id: order.checkout_id,
        checkout_slug: checkoutSlug,
        amount_cents: order.amount_cents,
        function_version: FUNCTION_VERSION
      });
    }

    // 7. Se a order estiver paid, buscar URL nesta ordem:
    let redirectUrl: string | null = null;

    // PRIMEIRA PRIORIDADE: checkouts.success_redirect_url
    if (order.checkout_id) {
      const { data: checkout } = await supabase
        .from("checkouts")
        .select("success_redirect_url")
        .eq("id", order.checkout_id)
        .maybeSingle();
      
      if (checkout?.success_redirect_url) {
        redirectUrl = checkout.success_redirect_url;
      }
    }

    // SEGUNDA PRIORIDADE (Fallback legado): products.thank_you_url
    if (!redirectUrl && order.product_id) {
      const { data: product } = await supabase
        .from("products")
        .select("thank_you_url")
        .eq("id", order.product_id)
        .maybeSingle();
      
      if (product?.thank_you_url) {
        redirectUrl = product.thank_you_url;
      }
    }

    // TERCEIRA PRIORIDADE (Fallback final): Deno.env.get("THANK_YOU_URL")
    if (!redirectUrl) {
      redirectUrl = Deno.env.get("THANK_YOU_URL") || null;
    }

    // 9. Retornar objeto de sucesso
    return json({
      orderId: order.id,
      status: order.status,
      paid: true,
      paid_at: order.paid_at,
      amount_cents: order.amount_cents,
      checkout_id: order.checkout_id,
      checkout_slug: checkoutSlug,
      thank_you_url: redirectUrl,
      redirect_url: redirectUrl,
      function_version: FUNCTION_VERSION
    });

  } catch (err) {
    console.error("[get-order-status] Error:", err);
    return json({ error: "INTERNAL_SERVER_ERROR", message: err.message }, 500);
  }
});

// 10. Todos os retornos precisam ter CORS
function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 
      ...corsHeaders, 
      "Content-Type": "application/json" 
    },
  });
}
