import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("PUSHINPAY_API_TOKEN");
    const baseUrl = Deno.env.get("PUSHINPAY_BASE_URL");

    if (!apiToken || !baseUrl) {
      console.error("Missing PushinPay configuration");
      return jsonError("CONFIG_MISSING", 500);
    }

    const body = await req.json().catch(() => ({}));
    const checkout_slug = body?.checkout_slug || null;
    
    if (!checkout_slug) {
      return jsonError("CHECKOUT_SLUG_REQUIRED", 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: checkout, error: cError } = await supabase
      .from("checkouts")
      .select("*")
      .eq("slug", checkout_slug)
      .maybeSingle();

    if (cError || !checkout) {
      console.error("[create-pix] Checkout not found:", checkout_slug, cError);
      return jsonError("CHECKOUT_NOT_FOUND", 404);
    }

    if (checkout.price === null || checkout.price === undefined) {
      return jsonError("INVALID_PRICE", 400);
    }

    const priceCents = Math.round(Number(checkout.price) * 100);
    const publicAccessToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + (checkout.pix_expiration_minutes || 30));
    
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        checkout_id: checkout.id,
        amount_cents: priceCents,
        status: "created",
        expires_at: expiresAt.toISOString(),
        metadata: { 
          checkout_slug: checkout.slug, 
          checkout_id: checkout.id,
          form_data: body?.form_data || {}
        },
        public_access_token: publicAccessToken,
        customer_name: body?.customer_name || null,
        customer_email: body?.customer_email || null,
        customer_cpf: body?.customer_cpf ? String(body.customer_cpf).replace(/\D/g, "") : null,
        customer_phone: body?.customer_phone ? String(body.customer_phone).replace(/\D/g, "") : null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("[create-pix] Order creation error:", orderError);
      return jsonError("DB_ERROR_ORDER", 500);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    const webhookSecret = Deno.env.get("PUSHINPAY_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("Missing PUSHINPAY_WEBHOOK_SECRET configuration");
      return jsonError("PUSHINPAY_WEBHOOK_SECRET_MISSING", 500);
    }

    const webhookUrl = `https://${projectRef}.supabase.co/functions/v1/pushinpay-webhook?secret=${encodeURIComponent(webhookSecret)}`;

    const cleanBase = baseUrl.replace(/\/+$/, "");
    const endpoint = `${cleanBase}/pix/cashIn`;
    
    const ppResp = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        value: priceCents, 
        webhook_url: webhookUrl,
        split_rules: []
      }),
    });

    const result = await ppResp.json().catch(() => ({}));

    if (!ppResp.ok) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return jsonError(`API_ERROR_${ppResp.status}`, 502, result);
    }

    const qrCode = result.qr_code ?? null;
    const qrCodeBase64 = result.qr_code_base64 ?? null;
    const transactionId = result.id ? String(result.id).trim() : null;

    await supabase
      .from("orders")
      .update({
        pushinpay_transaction_id: transactionId,
        pix_qr_code: qrCode,
        pix_qr_code_base64: qrCodeBase64,
        status: "waiting_payment",
      })
      .eq("id", order.id);

    return new Response(JSON.stringify({
      function_version: "create-pix-v2.1.2",
      orderId: order.id,
      accessToken: publicAccessToken,
      status: "waiting_payment",
      amount_cents: priceCents,
      checkout_id: checkout.id,
      checkout_slug: checkout.slug,
      checkout_price_used: checkout.price,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[create-pix] Unhandled error:", err);
    return jsonError("UNHANDLED_ERROR", 500, { message: String(err) });
  }
});

function jsonError(code: string, status = 400, extra?: unknown) {
  return new Response(
    JSON.stringify({ error: code, details: extra ?? null }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
