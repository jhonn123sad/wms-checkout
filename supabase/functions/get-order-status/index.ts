/**
 * CORE DE PAGAMENTO — NÃO ALTERAR SEM TESTE DE REGRESSÃO
 * Usado pelo frontend para verificar se o Pix foi pago e obter URL de redirecionamento.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let orderId = "";
    let token = "";
    let simulatePaid = false;

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      orderId = body.orderId || "";
      token = body.token || "";
      simulatePaid = body.simulate_paid === true;
    } else {
      const url = new URL(req.url);
      orderId = url.searchParams.get("orderId") || "";
      token = url.searchParams.get("token") || "";
      simulatePaid = url.searchParams.get("simulate_paid") === "true";
    }

    if (!orderId || !token) {
      return json({ error: "ORDER_ID_AND_TOKEN_REQUIRED" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error } = await supabase
      .from("orders")
      .select("id,status,paid_at,product_id,project_id,checkout_id,public_access_token")
      .eq("id", orderId)
      .maybeSingle();
      
    if (error || !order) return json({ error: "ORDER_NOT_FOUND" }, 404);

    const dbToken = (order.public_access_token || "").trim();
    const providedToken = (token || "").trim();

    if (dbToken !== providedToken) {
      return json({ error: "INVALID_TOKEN" }, 403);
    }

    let finalUrl: string | null = null;
    const currentStatus = simulatePaid ? "paid" : (order.status || "waiting_payment");
    const isPaid = ["paid", "approved", "confirmed", "completed"].includes(currentStatus.toLowerCase());

    if (isPaid) {
      // 1. PRIMEIRO: orders.checkout_id -> checkouts.success_redirect_url
      if (order.checkout_id) {
        const { data: checkout } = await supabase
          .from("checkouts")
          .select("success_redirect_url")
          .eq("id", order.checkout_id)
          .maybeSingle();
        
        if (checkout?.success_redirect_url) {
          finalUrl = checkout.success_redirect_url;
        }
      } 
      
      // 2. SEGUNDO (fallback): orders.product_id -> products.thank_you_url
      if (!finalUrl && order.product_id) {
        const { data: product } = await supabase
          .from("products")
          .select("thank_you_url")
          .eq("id", order.product_id)
          .maybeSingle();
        
        if (product?.thank_you_url) {
          finalUrl = product.thank_you_url;
        }
      }

      // Fallback global de ambiente
      if (!finalUrl) {
        finalUrl = Deno.env.get("THANK_YOU_URL") || null;
      }
    }

    return json({
      orderId: order.id,
      status: currentStatus,
      paid_at: order.paid_at,
      thank_you_url: finalUrl,
      redirect_url: finalUrl,
      // Campos extras para manter compatibilidade com frontend se necessário
      paid: isPaid,
      success_redirect_url: finalUrl
    });
  } catch (err) {
    console.error("[get-order-status]", err);
    return json({ error: "UNHANDLED_ERROR" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
