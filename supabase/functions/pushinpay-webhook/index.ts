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

    // Optional signature/secret check — Pushin Pay may send the secret as a header or query param
    const url = new URL(req.url);
    const providedSecret =
      req.headers.get("x-webhook-secret") ||
      req.headers.get("x-pushinpay-secret") ||
      url.searchParams.get("secret");

    if (secret && providedSecret && providedSecret !== secret) {
      log("Invalid webhook secret");
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

    log("Payload received:", payload);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const transactionId: string | null =
      payload.id || payload.transaction_id || payload.pushinpay_transaction_id || null;
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

    if (newStatus) {
      const update: Record<string, unknown> = { status: newStatus };
      if (newStatus === "paid") {
        update.paid_at = new Date().toISOString();
        if (payload.payer_name) update.payer_name = payload.payer_name;
        if (payload.payer_national_registration)
          update.payer_national_registration = payload.payer_national_registration;
        if (payload.end_to_end_id) update.end_to_end_id = payload.end_to_end_id;
      }

      const { error: updErr } = await supabase
        .from("orders")
        .update(update)
        .eq("pushinpay_transaction_id", transactionId);

      if (updErr) {
        log("Order update error:", updErr);
        await supabase
          .from("webhook_events")
          .update({ processed: false, error_message: updErr.message })
          .eq("transaction_id", transactionId)
          .order("created_at", { ascending: false })
          .limit(1);
      } else {
        await supabase
          .from("webhook_events")
          .update({ processed: true })
          .eq("transaction_id", transactionId);
      }
    }

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