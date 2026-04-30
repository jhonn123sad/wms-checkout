 /**
  * CORE DE PAGAMENTO — NÃO ALTERAR SEM TESTE DE REGRESSÃO
  * Fornece os dados do QR Code e valor para a página de pagamento.
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
    
    console.log("[get-order-payment-data] Request received:", { 
      method: req.method,
      orderId, 
      hasToken: !!token 
    });

    if (!orderId) {
      return json({ error: "ORDER_ID_REQUIRED" }, 400);
    }
    
    if (!token) {
      return json({ error: "TOKEN_REQUIRED" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: fetchedOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id,status,amount_cents,pix_qr_code,pix_qr_code_base64,expires_at,created_at,public_access_token")
      .eq("id", orderId)
      .maybeSingle();

    if (fetchError || !fetchedOrder) {
      console.error("[get-order-payment-data] Order not found:", orderId, fetchError);
      return json({ error: "ORDER_NOT_FOUND" }, 404);
    }

    const dbToken = (fetchedOrder.public_access_token || "").trim();
    const providedToken = (token || "").trim();
    const isValid = dbToken === providedToken;

    console.log("[get-order-payment-data] Auth details:", {
      orderFound: !!fetchedOrder,
      dbTokenPresent: !!dbToken,
      providedTokenPresent: !!providedToken,
      isValid,
      qr_code_present: !!fetchedOrder.pix_qr_code,
      qr_code_base64_present: !!fetchedOrder.pix_qr_code_base64
    });

    if (!isValid) {
      return json({ error: "INVALID_TOKEN" }, 403);
    }
    
    // Retorna apenas dados mínimos necessários, nunca CPF ou dados sensíveis.
    return json({
      orderId: fetchedOrder.id,
      status: fetchedOrder.status,
      amount_cents: fetchedOrder.amount_cents,
      qr_code: fetchedOrder.pix_qr_code,
      qr_code_base64: fetchedOrder.pix_qr_code_base64,
      expires_at: fetchedOrder.expires_at,
      created_at: fetchedOrder.created_at,
    });
  } catch (err) {
    console.error("[get-order-payment-data]", err);
    return json({ error: "UNHANDLED_ERROR" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}