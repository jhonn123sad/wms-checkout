/**
 * CHECKOUT CORE - NÃO ALTERAR SEM TESTE DE REGRESSÃO
 * Responsável por processar as notificações de pagamento da Pushin Pay.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Public webhook — no JWT verification (configured via verify_jwt=false in config.toml)
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const log = (...a: unknown[]) => console.log("[pushinpay-webhook]", ...a);

  try {
    const rawBody = await req.text();
    const secret = Deno.env.get("PUSHINPAY_WEBHOOK_SECRET");

    // Required signature/secret check — Pushin Pay sends the secret as a header or query param
    const url = new URL(req.url);
    const providedSecret =
      req.headers.get("x-webhook-secret") ||
      req.headers.get("x-pushinpay-secret") ||
      url.searchParams.get("secret");

    if (!secret) {
      log("PUSHINPAY_WEBHOOK_SECRET not configured");
      return new Response("Webhook not configured", { status: 500 });
    }
    if (!providedSecret || providedSecret !== secret) {
      log("Invalid or missing webhook secret");
      return new Response("Invalid signature", { status: 401 });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      // Pushin Pay may also send form-encoded data
      const params = new URLSearchParams(rawBody);
      payload = Object.fromEntries(params.entries());
    }

    log("--- WEBHOOK INCOMING ---");
    log("Headers:", Object.fromEntries(req.headers.entries()));
    log("Payload received:", payload);
    log("Payload status:", payload.status);
    log("Payload ID:", payload.id || payload.transaction_id);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const rawId = payload.id || payload.transaction_id || payload.pushinpay_transaction_id || "";
    const transactionId = String(rawId).trim();

    const incomingStatus: string = String(payload.status || "").toLowerCase();

    // Log event
    await supabase.from("webhook_events").insert({
      provider: "pushinpay",
      event_type: incomingStatus || "unknown",
      transaction_id: transactionId,
      payload,
      processed: false,
    });

    if (!transactionId) {
      log("No transaction id in payload");
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Map Pushin Pay status -> internal
    const statusMap: Record<string, string> = {
      paid: "paid",
      approved: "paid",
      completed: "paid",
      expired: "expired",
      canceled: "canceled",
      cancelled: "canceled",
      failed: "failed",
      created: "waiting_payment",
      pending: "waiting_payment",
    };
    const newStatus = statusMap[incomingStatus] || null;

    if (!newStatus) {
      log("Unknown status received:", incomingStatus);
      return new Response(JSON.stringify({ ok: true, message: "status ignored" }));
    }

    const update: Record<string, unknown> = { status: newStatus };
    if (newStatus === "paid") {
      update.paid_at = new Date().toISOString();
      if (payload.payer_name) update.payer_name = payload.payer_name;
      if (payload.payer_national_registration)
        update.payer_national_registration = payload.payer_national_registration;
      if (payload.end_to_end_id) update.end_to_end_id = payload.end_to_end_id;
    }

    log("Searching order with transactionId (case-insensitive):", transactionId);

    // First, find the order using case-insensitive search
    const { data: orderToUpdate, error: findErr } = await supabase
      .from("orders")
      .select("id")
      .ilike("pushinpay_transaction_id", transactionId)
      .maybeSingle();

    if (findErr) {
      log("Error finding order:", findErr);
      return new Response(JSON.stringify({ ok: false, error: findErr.message }), { status: 500 });
    }

    if (!orderToUpdate) {
      log("No order found with transactionId:", transactionId);
      return new Response(JSON.stringify({ ok: true, message: "order not found" }));
    }

    log("Order found! ID:", orderToUpdate.id, "Updating to status:", newStatus);

    const { data: updatedOrder, error: updErr } = await supabase
      .from("orders")
      .update(update)
      .eq("id", orderToUpdate.id)
      .select();

    if (updErr) {
      log("Order update error:", updErr);
      await supabase
        .from("webhook_events")
        .update({ processed: false, error_message: updErr.message })
        .eq("transaction_id", transactionId)
        .order("created_at", { ascending: false })
        .limit(1);
      return new Response(JSON.stringify({ ok: false, error: updErr.message }), { status: 500 });
    }

    if (!updatedOrder || updatedOrder.length === 0) {
      log("No order found with transactionId:", transactionId);
    } else {
      log("Order updated successfully:", updatedOrder[0].id);
    }

    await supabase
      .from("webhook_events")
      .update({ processed: true })
      .eq("transaction_id", transactionId)
      .order("created_at", { ascending: false })
      .limit(1);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[pushinpay-webhook] Unhandled:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});