/**
 * CORE DE PAGAMENTO — V2.0.3
 * Responsável por criar pedidos e gerar o Pix na Pushin Pay.
 * REGRA: Exige checkout_slug e usa checkouts.price como fonte oficial.
 */
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
      return jsonError("CONFIG_MISSING", 500);
    }

    const body = await req.json().catch(() => ({}));
    
    // Log do input conforme solicitado
    console.log("[create-pix input body]", body);

    const checkout_slug = body?.checkout_slug || null;
    
    if (!checkout_slug) {
      return jsonError("CHECKOUT_SLUG_REQUIRED", 400);
    }

    const customer_name = body?.customer_name ? String(body.customer_name).trim() : null;
    const customer_cpf = body?.customer_cpf ? String(body.customer_cpf).replace(/\D/g, "") : null;
    const customer_phone = body?.customer_phone ? String(body.customer_phone).replace(/\D/g, "") : null;
    const customer_email = body?.customer_email ? String(body.customer_email).trim() : null;
    
    const utm_source = body?.utm_source || body?.utm?.utm_source || null;
    const utm_medium = body?.utm_medium || body?.utm?.utm_medium || null;
    const utm_campaign = body?.utm_campaign || body?.utm?.utm_campaign || null;
    const utm_content = body?.utm_content || body?.utm?.utm_content || null;
    const utm_term = body?.utm_term || body?.utm?.utm_term || null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Busca checkout somente assim: SELECT * FROM public.checkouts WHERE slug = checkout_slug LIMIT 1
    const { data: checkout, error: cError } = await supabase
      .from("checkouts")
      .select("*")
      .eq("slug", checkout_slug)
      .maybeSingle();

    if (cError || !checkout) {
      console.error("[create-pix] Checkout not found for slug:", checkout_slug, cError);
      return jsonError("CHECKOUT_NOT_FOUND", 404);
    }

    // Log do checkout resolvido conforme solicitado
    console.log("[create-pix resolved checkout]", {
      id: checkout.id,
      slug: checkout.slug,
      price: checkout.price
    });

    const isPublished = checkout.active === true || checkout.status === 'published';
    if (!isPublished) {
      return jsonError("CHECKOUT_INACTIVE", 403);
    }

    if (checkout.price === null || checkout.price === undefined || checkout.price < 0) {
      return jsonError("INVALID_PRICE", 400);
    }

    // Calcular: const priceCents = Math.round(Number(checkout.price) * 100)
    const priceCents = Math.round(Number(checkout.price) * 100);
    const expirationMinutes = checkout.pix_expiration_minutes || 30;
    const publicAccessToken = crypto.randomUUID();
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
    
    // Criar order com os dados do checkout encontrado
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        checkout_id: checkout.id,
        customer_name,
        customer_cpf,
        customer_phone,
        customer_email,
        amount_cents: priceCents,
        status: "created",
        expires_at: expiresAt.toISOString(),
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        metadata: { 
          checkout_slug: checkout.slug, 
          checkout_id: checkout.id,
          form_data: body?.form_data || {}
        },
        public_access_token: publicAccessToken,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("[create-pix] Order creation error:", orderError);
      return jsonError("DB_ERROR_ORDER", 500);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
    const webhookUrl = `https://${projectRef}.supabase.co/functions/v1/pushinpay-webhook`;

    const cleanBase = baseUrl.replace(/\/+$/, "");
    const endpoint = `${cleanBase}/pix/cashIn`;
    const reqBody = { 
      value: priceCents, 
      webhook_url: webhookUrl,
      split_rules: []
    };

    const ppResp = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const respText = await ppResp.text();
    let result: any;
    try {
      result = JSON.parse(respText);
    } catch {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return jsonError("API_RESPONSE_INVALID", 502);
    }

    if (!ppResp.ok) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return jsonError(`API_ERROR_${ppResp.status}`, 502, result);
    }

    const qrCode: string | null = result.qr_code ?? null;
    const qrCodeBase64: string | null = result.qr_code_base64 ?? null;
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

    // Retorno JSON conforme solicitado
    return new Response(JSON.stringify({
      orderId: order.id,
      accessToken: publicAccessToken,
      status: "waiting_payment",
      amount_cents: priceCents,
      checkout_id: checkout.id,
      checkout_slug: checkout.slug,
      checkout_price_used: checkout.price,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
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
