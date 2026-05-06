import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get("PUSHINPAY_API_TOKEN");
    const baseUrl = Deno.env.get("PUSHINPAY_BASE_URL");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!apiToken || !baseUrl || !supabaseUrl || !supabaseKey) {
      console.error("[create-pix-v2] Missing environment variables");
      return new Response(
        JSON.stringify({ error: "CONFIG_MISSING", function_version: "create-pix-v2" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    console.log("[create-pix-v2 input]", body);

    const checkout_slug = body?.checkout_slug;
    if (!checkout_slug) {
      return new Response(
        JSON.stringify({ error: "CHECKOUT_SLUG_REQUIRED", function_version: "create-pix-v2" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rule 3: Buscar o checkout somente em public.checkouts where slug = checkout_slug
    const { data: checkout, error: cError } = await supabase
      .from("checkouts")
      .select("*")
      .eq("slug", checkout_slug)
      .maybeSingle();

    if (cError || !checkout) {
      console.error("[create-pix-v2] Checkout not found:", checkout_slug, cError);
      return new Response(
        JSON.stringify({ error: "CHECKOUT_NOT_FOUND", checkout_slug, function_version: "create-pix-v2" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rule 12: Adicionar logs
    console.log("[create-pix-v2 checkout]", {
      id: checkout.id,
      slug: checkout.slug,
      price: checkout.price,
      priceCents: Math.round(Number(checkout.price) * 100)
    });

    // Rule 7: Calcular priceCents
    const priceCents = Math.round(Number(checkout.price) * 100);
    const publicAccessToken = crypto.randomUUID();

    // Rule 8: Criar order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        checkout_id: checkout.id,
        amount_cents: priceCents,
        status: "created",
        public_access_token: publicAccessToken,
        customer_name: body?.customer_name || null,
        customer_email: body?.customer_email || null,
        customer_phone: body?.customer_phone || null,
        customer_cpf: body?.customer_cpf ? String(body.customer_cpf).replace(/\D/g, "") : null,
        metadata: {
          checkout_slug: checkout.slug,
          checkout_id: checkout.id,
          checkout_price: checkout.price,
          price_cents: priceCents,
          function_version: "create-pix-v2",
          form_data: body.form_data || {}
        }
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("[create-pix-v2] Order creation error:", orderError);
      return new Response(
        JSON.stringify({ error: "DB_ERROR_ORDER", function_version: "create-pix-v2" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rule 9: Enviar para Pushin Pay
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    const webhookUrl = `https://${projectRef}.supabase.co/functions/v1/pushinpay-webhook`;
    const cleanBase = baseUrl.replace(/\/+$/, "");
    
    const ppResp = await fetch(`${cleanBase}/pix/cashIn`, {
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

    const ppResult = await ppResp.json().catch(() => ({}));

    if (!ppResp.ok) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return new Response(
        JSON.stringify({ error: `PUSHINPAY_ERROR_${ppResp.status}`, details: ppResult, function_version: "create-pix-v2" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const qrCode = ppResult.qr_code;
    const qrCodeBase64 = ppResult.qr_code_base64;
    const transactionId = ppResult.id ? String(ppResult.id) : null;

    // Rule 10: Atualizar order
    await supabase
      .from("orders")
      .update({
        pushinpay_transaction_id: transactionId,
        pix_qr_code: qrCode,
        pix_qr_code_base64: qrCodeBase64,
        status: "waiting_payment",
      })
      .eq("id", order.id);

    // Rule 11: Retornar obrigatoriamente
    return new Response(
      JSON.stringify({
        function_version: "create-pix-v2",
        orderId: order.id,
        accessToken: publicAccessToken,
        status: "waiting_payment",
        amount_cents: priceCents,
        checkout_id: checkout.id,
        checkout_slug: checkout.slug,
        checkout_price_used: Number(checkout.price),
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[create-pix-v2] Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "UNHANDLED_ERROR", message: String(err), function_version: "create-pix-v2" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
