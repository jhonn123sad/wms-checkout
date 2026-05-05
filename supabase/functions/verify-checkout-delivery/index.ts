import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const json = (payload: any, status = 200) => 
  new Response(JSON.stringify(payload), { 
    status, 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const checkout_id = body.checkout_id;

    if (!checkout_id) {
      return json({ 
        ok: false, 
        code: "CHECKOUT_ID_REQUIRED", 
        message: "checkout_id required" 
      }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Fetch checkout details
    const { data: checkout, error: checkoutError } = await supabase
      .from("checkouts")
      .select("id, slug, success_redirect_url")
      .eq("id", checkout_id)
      .maybeSingle();

    if (checkoutError) {
      return json({ 
        ok: false, 
        code: "CHECKOUT_QUERY_ERROR", 
        message: checkoutError.message 
      }, 500);
    }

    if (!checkout) {
      return json({ 
        ok: false, 
        code: "CHECKOUT_NOT_FOUND", 
        message: "checkout not found" 
      }, 404);
    }

    if (!checkout.success_redirect_url) {
      return json({ 
        ok: true,
        code: "DELIVERY_URL_MISSING", 
        message: "URL de entrega não configurada no checkout.",
        checkout_id: checkout.id,
        checkout_slug: checkout.slug,
        success_redirect_url: null 
      }, 200);
    }

    // Fetch the last order for this checkout
    const { data: lastOrder, error: orderError } = await supabase
      .from("orders")
      .select("id, status, checkout_id")
      .eq("checkout_id", checkout_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      return json({ 
        ok: false, 
        code: "ORDER_QUERY_ERROR", 
        message: orderError.message,
        success_redirect_url: checkout.success_redirect_url
      }, 500);
    }

    if (!lastOrder) {
      return json({ 
        ok: true,
        code: "ORDER_NOT_FOUND", 
        message: "Nenhuma order encontrada. Gere um Pix primeiro.",
        checkout_id: checkout.id,
        checkout_slug: checkout.slug,
        success_redirect_url: checkout.success_redirect_url
      }, 200);
    }

    return json({ 
      ok: true, 
      code: "DELIVERY_READY", 
      message: "Fluxo de entrega verificado com sucesso.",
      checkout_id: checkout.id,
      checkout_slug: checkout.slug,
      order_id: lastOrder.id,
      order_status: lastOrder.status,
      success_redirect_url: checkout.success_redirect_url,
      redirect_url: checkout.success_redirect_url,
      thank_you_url: checkout.success_redirect_url
    }, 200);

  } catch (err: any) {
    return json({ 
      ok: false, 
      code: "UNHANDLED_ERROR", 
      message: err?.message || "Erro interno no servidor." 
    }, 500);
  }
});
