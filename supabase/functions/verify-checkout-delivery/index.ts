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
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const checkout_id = body.checkout_id;

    if (!checkout_id) {
      return json(
        {
          ok: false,
          code: "CHECKOUT_ID_REQUIRED",
          message: "Checkout id required.",
        },
        400
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: checkout, error: checkoutError } = await supabase
      .from("checkouts")
      .select("id, slug, success_redirect_url")
      .eq("id", checkout_id)
      .maybeSingle();

    if (checkoutError) {
      return json(
        {
          ok: false,
          code: "CHECKOUT_QUERY_ERROR",
          message: checkoutError.message,
        },
        500
      );
    }

    if (!checkout) {
      return json(
        {
          ok: false,
          code: "CHECKOUT_NOT_FOUND",
          message: "Checkout not found.",
        },
        404
      );
    }

    const successRedirectUrl = checkout.success_redirect_url || null;

    if (!successRedirectUrl) {
      return json({
        ok: false,
        code: "DELIVERY_URL_MISSING",
        message: "Delivery URL missing.",
        checkout_id: checkout.id,
        checkout_slug: checkout.slug,
        success_redirect_url: null,
      });
    }

    const { data: lastOrder, error: orderError } = await supabase
      .from("orders")
      .select("id, status, created_at, checkout_id")
      .eq("checkout_id", checkout_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      return json(
        {
          ok: false,
          code: "ORDER_QUERY_ERROR",
          message: orderError.message,
          success_redirect_url: successRedirectUrl,
        },
        500
      );
    }

    if (!lastOrder) {
      return json({
        ok: false,
        code: "ORDER_NOT_FOUND",
        message: "No order found. Generate a Pix first.",
        checkout_id: checkout.id,
        checkout_slug: checkout.slug,
        success_redirect_url: successRedirectUrl,
      });
    }

    return json({
      ok: true,
      code: "DELIVERY_READY",
      message: "Delivery ready.",
      checkout_id: checkout.id,
      checkout_slug: checkout.slug,
      order_id: lastOrder.id,
      order_status: lastOrder.status,
      success_redirect_url: successRedirectUrl,
      redirect_url: successRedirectUrl,
      thank_you_url: successRedirectUrl,
    });
  } catch (err) {
    return json(
      {
        ok: false,
        code: "UNHANDLED_ERROR",
        message: err instanceof Error ? err.message : "Internal server error.",
      },
      500
    );
  }
});
