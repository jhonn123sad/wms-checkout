import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const json = (payload: any, status = 200) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    const { checkout_id } = await req.json().catch(() => ({}));

    if (!checkout_id) {
      return json({
        ok: false,
        code: "CHECKOUT_ID_REQUIRED",
        message: "ID do checkout é obrigatório.",
      }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: checkout, error: checkoutError } = await supabase
      .from("checkouts")
      .select("id, slug, success_redirect_url")
      .eq("id", checkout_id)
      .maybeSingle();

    if (checkoutError) {
      return json({
        ok: false,
        code: "CHECKOUT_QUERY_ERROR",
        message: checkoutError.message,
      }, 500);
    }

    if (!checkout) {
      return json({
        ok: false,
        code: "CHECKOUT_NOT_FOUND",
        message: "Checkout não encontrado.",
      }, 404);
    }

    if (!checkout.success_redirect_url) {
      return json({
        ok: false,
        code: "DELIVERY_URL_MISSING",
        message: "URL de entrega não configurada.",
        checkout_id: checkout.id,
        checkout_slug: checkout.slug,
      }, 200);
    }

    const { data: lastOrder, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("checkout_id", checkout_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      return json({
        ok: false,
        code: "ORDER_QUERY_ERROR",
        message: orderError.message,
      }, 500);
    }

    if (!lastOrder) {
      return json({
        ok: false,
        code: "ORDER_NOT_FOUND",
        message: "Nenhuma order encontrada para este checkout. Gere um Pix primeiro.",
        checkout_id: checkout.id,
        checkout_slug: checkout.slug,
        success_redirect_url: checkout.success_redirect_url,
      }, 200);
    }

    return json({
      ok: true,
      code: "DELIVERY_READY",
      message: "Última order encontrada. Quando for paga, será enviada para a URL de entrega.",
      checkout_id: checkout.id,
      checkout_slug: checkout.slug,
      order_id: lastOrder.id,
      order_status: lastOrder.status,
      success_redirect_url: checkout.success_redirect_url,
      redirect_url: checkout.success_redirect_url,
      thank_you_url: checkout.success_redirect_url,
    }, 200);

  } catch (err: any) {
    return json({
      ok: false,
      code: "UNHANDLED_ERROR",
      message: err?.message || "Erro interno no servidor.",
    }, 500);
  }
});
