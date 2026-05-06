import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const FUNCTION_VERSION = "pushinpay-webhook-v2-2026-05-06";

Deno.serve(async (req) => {
  // 10. Handle CORS and OPTIONS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const log = (...a: unknown[]) => console.log(`[${FUNCTION_VERSION}]`, ...a);
  
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let webhookEventId: string | null = null;

  try {
    // 1. Read body
    const rawBody = await req.text();
    
    // 2. Parse body (JSON or text/form-data)
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      const params = new URLSearchParams(rawBody);
      payload = Object.fromEntries(params.entries());
    }

    // 3. Extract transactionId
    const transactionId = String(
      payload.id || 
      payload.transaction_id || 
      payload.pushinpay_transaction_id || 
      ""
    ).trim();

    const incomingStatus = String(payload.status || "unknown").toLowerCase();

    // 4. Insert immediately in public.webhook_events
    const { data: eventData, error: eventErr } = await supabase
      .from("webhook_events")
      .insert({
        provider: "pushinpay",
        event_type: incomingStatus,
        transaction_id: transactionId,
        payload: payload,
        processed: false,
        error_message: null,
      })
      .select("id")
      .single();

    if (eventErr) {
      log("Error creating webhook_event log:", eventErr);
    } else if (eventData) {
      webhookEventId = eventData.id;
    }

    // 5. Validate secret
    const secret = Deno.env.get("PUSHINPAY_WEBHOOK_SECRET");
    const url = new URL(req.url);
    const providedSecret =
      req.headers.get("x-webhook-secret") ||
      req.headers.get("x-pushinpay-secret") ||
      url.searchParams.get("secret");

    // 6. Handle invalid secret
    if (!secret || !providedSecret || providedSecret !== secret) {
      log("INVALID_SECRET provided or missing");
      if (webhookEventId) {
        await supabase
          .from("webhook_events")
          .update({ 
            processed: false, 
            error_message: "INVALID_SECRET" 
          })
          .eq("id", webhookEventId);
      }
      return new Response(
        JSON.stringify({ error: "Unauthorized", code: "INVALID_SECRET", version: FUNCTION_VERSION }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Search order by pushinpay_transaction_id (case-insensitive)
    if (!transactionId) {
      if (webhookEventId) {
        await supabase
          .from("webhook_events")
          .update({ 
            processed: false, 
            error_message: "NO_TRANSACTION_ID" 
          })
          .eq("id", webhookEventId);
      }
      return new Response(
        JSON.stringify({ ok: true, message: "No transaction ID found", version: FUNCTION_VERSION }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: order, error: findErr } = await supabase
      .from("orders")
      .select("id, status")
      .ilike("pushinpay_transaction_id", transactionId)
      .maybeSingle();

    if (findErr) {
      log("Error finding order:", findErr);
      if (webhookEventId) {
        await supabase
          .from("webhook_events")
          .update({ error_message: `DB_FIND_ERROR: ${findErr.message}` })
          .eq("id", webhookEventId);
      }
      return new Response(
        JSON.stringify({ error: findErr.message, version: FUNCTION_VERSION }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!order) {
      log("ORDER_NOT_FOUND:", transactionId);
      if (webhookEventId) {
        await supabase
          .from("webhook_events")
          .update({ 
            processed: false, 
            error_message: "ORDER_NOT_FOUND" 
          })
          .eq("id", webhookEventId);
      }
      return new Response(
        JSON.stringify({ ok: true, message: "Order not found", version: FUNCTION_VERSION }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 8. If order found and status is paid
    if (incomingStatus === "paid") {
      log(`Updating order ${order.id} to paid`);
      const { error: updErr } = await supabase
        .from("orders")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", order.id);

      if (updErr) {
        log("Error updating order:", updErr);
        if (webhookEventId) {
          await supabase
            .from("webhook_events")
            .update({ error_message: `ORDER_UPDATE_ERROR: ${updErr.message}` })
            .eq("id", webhookEventId);
        }
        return new Response(
          JSON.stringify({ error: updErr.message, version: FUNCTION_VERSION }), 
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 9. Update webhook_event to processed
      if (webhookEventId) {
        await supabase
          .from("webhook_events")
          .update({ 
            processed: true, 
            error_message: null 
          })
          .eq("id", webhookEventId);
      }
    } else {
      log(`Status ${incomingStatus} ignored for order ${order.id}`);
      if (webhookEventId) {
        await supabase
          .from("webhook_events")
          .update({ 
            processed: true, 
            error_message: `IGNORED_STATUS: ${incomingStatus}` 
          })
          .eq("id", webhookEventId);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, version: FUNCTION_VERSION }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    log("UNEXPECTED_ERROR:", err);
    if (webhookEventId) {
      await supabase
        .from("webhook_events")
        .update({ error_message: `UNEXPECTED_ERROR: ${String(err)}` })
        .eq("id", webhookEventId);
    }
    return new Response(
      JSON.stringify({ error: String(err), version: FUNCTION_VERSION }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});