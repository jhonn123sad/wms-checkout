import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { checkout_id } = await req.json().catch(() => ({}));

    if (!checkout_id) {
      return json({ ok: false, code: "CHECKOUT_ID_REQUIRED", message: "ID do checkout é obrigatório." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Buscar o checkout
    const { data: checkout, error: checkoutError } = await supabase
      .from("checkouts")
      .select("id, slug, success_redirect_url")
      .eq("id", checkout_id)
      .maybeSingle();

    if (checkoutError || !checkout) {
      return json({ ok: false, code: "CHECKOUT_NOT_FOUND", message: "Checkout não encontrado." }, 404);
    }

    // 2. Verificar success_redirect_url
    if (!checkout.success_redirect_url) {
      return json({ 
        ok: false, 
        code: "DELIVERY_URL_MISSING", 
        message: "URL de entrega não configurada no checkout.",
        checkout_slug: checkout.slug
      }, 200);
    }

    // 3. Buscar a última order
    const { data: lastOrder, error: orderError } = await supabase
      .from("orders")
      .select("id, status, created_at")
      .eq("checkout_id", checkout_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError || !lastOrder) {
      return json({ 
        ok: false, 
        code: "ORDER_NOT_FOUND", 
        message: "Nenhuma order encontrada para este checkout. Gere um Pix primeiro.",
        success_redirect_url: checkout.success_redirect_url
      }, 200);
    }

    return json({
      ok: true,
      code: "DELIVERY_READY",
      message: "Última order encontrada. Quando for paga, será enviada para a URL de entrega.",
      checkout_id: checkout.id,
      order_id: lastOrder.id,
      order_status: lastOrder.status,
      success_redirect_url: checkout.success_redirect_url
    });

  } catch (err) {
    console.error("[verify-checkout-delivery]", err);
    return json({ ok: false, code: "UNHANDLED_ERROR", message: "Erro interno no servidor." }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
