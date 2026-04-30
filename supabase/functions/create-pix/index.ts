import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const log = (...a: unknown[]) => console.log("[create-pix]", ...a);

  try {
    const apiToken = Deno.env.get("PUSHINPAY_API_TOKEN");
    const baseUrl = Deno.env.get("PUSHINPAY_BASE_URL");

    log("Token present:", !!apiToken, "Base URL:", baseUrl);

    if (!apiToken) {
      return jsonError("CONFIG_MISSING_PUSHINPAY_API_TOKEN", 500);
    }
    if (!baseUrl) {
      return jsonError("CONFIG_MISSING_PUSHINPAY_BASE_URL", 500);
    }

    const body = await req.json().catch(() => ({}));
    const customer_name = String(body?.customer_name || "").trim();
    const customer_cpf = String(body?.customer_cpf || "").replace(/\D/g, "");
    const utm = body?.utm || {};

    if (customer_name.length < 3) return jsonError("CUSTOMER_NAME_INVALID", 400);
    if (customer_cpf.length !== 11) return jsonError("CPF_INVALID", 400);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get active product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (productError) {
      log("Product fetch error:", productError);
      return jsonError("DB_ERROR_PRODUCT", 500);
    }

    const priceCents = product?.price_cents ?? 2500;
    const productId = product?.id ?? null;

    // Create order (status=created)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        product_id: productId,
        customer_name,
        customer_cpf,
        amount_cents: priceCents,
        status: "created",
        utm_source: utm.utm_source ?? null,
        utm_medium: utm.utm_medium ?? null,
        utm_campaign: utm.utm_campaign ?? null,
        utm_content: utm.utm_content ?? null,
        utm_term: utm.utm_term ?? null,
      })
      .select()
      .single();

    if (orderError || !order) {
      log("Order insert error:", orderError);
      return jsonError("DB_ERROR_ORDER", 500);
    }

    const cleanBase = baseUrl.replace(/\/+$/, "");
    const endpoint = `${cleanBase}/pix/cashIn`;
    const reqBody = { value: priceCents, split_rules: [] as unknown[] };

    log("POST", endpoint, "body:", reqBody);

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
    log("Pushin Pay status:", ppResp.status);

    let result: any;
    try {
      result = JSON.parse(respText);
    } catch {
      log("Invalid JSON from Pushin Pay:", respText.slice(0, 300));
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return jsonError("API_RESPONSE_INVALID", 502);
    }

    if (!ppResp.ok) {
      log("Pushin Pay error response:", result);
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return jsonError(`API_ERROR_${ppResp.status}`, 502, result);
    }

    const qrCode: string | null = result.qr_code ?? null;
    const qrCodeBase64: string | null = result.qr_code_base64 ?? null;
    const transactionId: string | null = result.id ?? null;

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        pushinpay_transaction_id: transactionId,
        pix_qr_code: qrCode,
        pix_qr_code_base64: qrCodeBase64,
        status: "waiting_payment",
      })
      .eq("id", order.id);

    if (updateError) log("Order update error:", updateError);

    return new Response(
      JSON.stringify({
        orderId: order.id,
        status: "waiting_payment",
        amount_cents: priceCents,
        qr_code: qrCode,
        qr_code_base64: qrCodeBase64,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[create-pix] Unhandled:", err);
    return jsonError("UNHANDLED_ERROR", 500, { message: String((err as Error)?.message || err) });
  }
});

function jsonError(code: string, status = 400, extra?: unknown) {
  return new Response(
    JSON.stringify({ error: code, details: extra ?? null }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}