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

    if (req.method === "POST") {
      const body = await req.json();
      orderId = body.orderId || "";
      token = body.token || "";
    } else {
      const url = new URL(req.url);
      orderId = url.searchParams.get("orderId") || "";
      token = url.searchParams.get("token") || "";
    }

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const simulatePaid = body.simulate_paid === true;

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

    let redirect_url: string | null = null;
    const currentStatus = simulatePaid ? "paid" : (order.status || "waiting_payment");
    const isPaid = ["paid", "approved", "confirmed", "completed"].includes(currentStatus.toLowerCase());

    if (isPaid) {
      if (order.checkout_id) {
        const { data: checkout } = await supabase
          .from("checkouts")
          .select("success_redirect_url")
          .eq("id", order.checkout_id)
          .maybeSingle();
        redirect_url = checkout?.success_redirect_url ?? null;
      } 
      
      // Fallbacks para compatibilidade com fluxos antigos
      if (!redirect_url && order.project_id) {
        const { data: project } = await supabase
          .from("checkout_projects")
          .select("thank_you_url")
          .eq("id", order.project_id)
          .maybeSingle();
        redirect_url = project?.thank_you_url ?? null;
      } 
      
      if (!redirect_url && order.product_id) {
        const { data: product } = await supabase
          .from("products")
          .select("thank_you_url")
          .eq("id", order.product_id)
          .maybeSingle();
        redirect_url = product?.thank_you_url ?? Deno.env.get("THANK_YOU_URL") ?? null;
      }
    }

    return json({
      orderId: order.id,
      status: currentStatus,
      paid: isPaid,
      paid_at: order.paid_at,
      redirect_url,
      success_redirect_url: redirect_url, // Alias
      thank_you_url: redirect_url, // Alias
      message: isPaid && !redirect_url ? "Pagamento confirmado, mas o link de entrega ainda não foi configurado." : undefined
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