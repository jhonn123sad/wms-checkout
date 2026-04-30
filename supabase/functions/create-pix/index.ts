/**
 * CHECKOUT CORE - NÃO ALTERAR SEM TESTE DE REGRESSÃO
 * Responsável por criar pedidos e gerar o Pix na Pushin Pay.
 */
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
    const project_slug = body?.project_slug || null;
    const customer_name = body?.customer_name ? String(body.customer_name).trim() : null;
    const customer_cpf = body?.customer_cpf ? String(body.customer_cpf).replace(/\D/g, "") : null;
    const customer_phone = body?.customer_phone ? String(body.customer_phone).replace(/\D/g, "") : null;
    const customer_email = body?.customer_email ? String(body.customer_email).trim() : null;
    
    const utm_source = body?.utm_source || body?.utm?.utm_source || null;
    const utm_medium = body?.utm_medium || body?.utm?.utm_medium || null;
    const utm_campaign = body?.utm_campaign || body?.utm?.utm_campaign || null;
    const utm_content = body?.utm_content || body?.utm?.utm_content || null;
    const utm_term = body?.utm_term || body?.utm?.utm_term || null;

    log("Request received:", { project_slug, customer_name, hasCpf: !!customer_cpf, customer_email, customer_phone });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let priceCents = 50;
    let productId = null;
    let currentProjectId = body?.project_id || null;
    let currentOfferId = body?.offer_id || null;
    let expirationMinutes = 30; // Default

    if (project_slug) {
      log("Searching project by slug:", project_slug);
      const { data: project, error: pError } = await supabase
        .from("checkout_projects")
        .select("*")
        .eq("slug", project_slug)
        .eq("active", true)
        .maybeSingle();

      if (pError || !project) {
        log("Project not found or inactive:", pError);
        return jsonError("PROJECT_NOT_FOUND", 404);
      }

      const { data: offer, error: oError } = await supabase
        .from("checkout_offers")
        .select("*")
        .eq("project_id", project.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (oError || !offer) {
        log("Active offer not found for project:", oError);
        return jsonError("OFFER_NOT_FOUND", 404);
      }

      currentProjectId = project.id;
      currentOfferId = offer.id;
      priceCents = offer.price_cents;
      expirationMinutes = project.pix_expiration_minutes || 30;

      // Dynamic Validations
      if (project.collect_name && (!customer_name || customer_name.length < 3)) {
        return jsonError("NAME_REQUIRED", 400);
      }
      if (project.collect_cpf && (!customer_cpf || customer_cpf.length !== 11)) {
        return jsonError("CPF_INVALID", 400);
      }
      if (project.collect_email && (!customer_email || !customer_email.includes("@"))) {
        return jsonError("EMAIL_INVALID", 400);
      }
      if (project.collect_phone && (!customer_phone || customer_phone.length < 10)) {
        return jsonError("PHONE_INVALID", 400);
      }
      
      log("Dynamic validation passed for project:", project.name);
    } else if (currentProjectId && currentOfferId) {
      // Direct ID flow (for backward compatibility if needed)
      log("Using project_id and offer_id directly");
      const { data: offer } = await supabase
        .from("checkout_offers")
        .select("*, project:checkout_projects(*)")
        .eq("id", currentOfferId)
        .eq("project_id", currentProjectId)
        .maybeSingle();

      if (!offer) return jsonError("OFFER_NOT_FOUND", 404);
      priceCents = offer.price_cents;
    } else {
      // Fallback to legacy flow
      log("Fallback to legacy flow (products table)");
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

      priceCents = product?.price_cents ?? 50;
      productId = product?.id ?? null;
    }

    // Create order (status=created) with a secure random access token
    const publicAccessToken = crypto.randomUUID();
    
    // Calculate expires_at
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);
    
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        product_id: productId,
        project_id: currentProjectId,
        offer_id: currentOfferId,
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
        metadata: project_slug ? { project_slug, project_id: currentProjectId } : {},
        public_access_token: publicAccessToken,
      })
      .select()
      .single();

    if (orderError || !order) {
      log("Order insert error:", orderError);
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
      split_rules: [] as unknown[] 
    };

    log("POST", endpoint, "body:", reqBody);
    log("Webhook URL being sent:", webhookUrl);

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
    const transactionId = result.id ? String(result.id).trim() : null;

    log("Pushin Pay ID received:", transactionId);
    log("Order ID:", order.id);

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

    const responsePayload = {
      orderId: order.id,
      accessToken: publicAccessToken,
      status: "waiting_payment",
      amount_cents: priceCents,
      qr_code: qrCode,
      qr_code_base64: qrCodeBase64,
    };

    log("Pix generated successfully, sending response with accessToken:", !!publicAccessToken);

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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