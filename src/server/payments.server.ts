import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const getSupabaseAdmin = () => createClient(supabaseUrl, supabaseServiceKey);

export async function createPixOrder(data: { customer_name: string; customer_cpf: string }) {
  const apiToken = process.env.PUSHINPAY_API_TOKEN;
  const baseUrl = process.env.PUSHINPAY_BASE_URL;

   if (!apiToken) {
     console.error("[Payments] ERROR: PUSHINPAY_API_TOKEN is missing in environment.");
     throw new Error("CONFIG_MISSING_PUSHINPAY_API_TOKEN");
   }
   if (!baseUrl) {
     console.error("[Payments] ERROR: PUSHINPAY_BASE_URL is missing in environment.");
     throw new Error("CONFIG_MISSING_PUSHINPAY_BASE_URL");
   }

   console.log("[Payments] Secrets validation: OK");
   console.log("[Payments] Base URL:", baseUrl);

  const supabase = getSupabaseAdmin();
  const cleanCpf = data.customer_cpf.replace(/\D/g, "");

  if (cleanCpf.length !== 11) {
    throw new Error("CPF_INVALID");
  }

  // 1. Get first active product (mocking 25,00 for now if table empty)
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("name", "Produto Teste")
    .single();

  const priceCents = product?.price ? Math.round(product.price * 100) : 2500;

  // 2. Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: data.customer_name,
      customer_cpf: cleanCpf,
      amount: priceCents / 100,
      status: "pending"
    })
    .select()
    .single();

  if (orderError || !order) throw new Error("DB_ERROR");

  try {
    // 3. Call Pushin Pay
     const endpoint = `${baseUrl}/pix/cashIn`;
     const body = {
       value: priceCents,
       split_rules: []
     };

     console.log("[Payments] Fetching Pushin Pay:", endpoint);
     console.log("[Payments] Body:", JSON.stringify(body));

     const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        value: priceCents,
        split_rules: []
      })
    });

     const responseText = await response.text();
     console.log("[Payments] HTTP Status:", response.status);
     
     let result;
     try {
       result = JSON.parse(responseText);
     } catch (e) {
       console.error("[Payments] Failed to parse response JSON:", responseText);
       throw new Error("API_RESPONSE_INVALID");
     }

     if (!response.ok) {
       console.error("[Payments] Pushin Pay Error Response:", result);
       throw new Error(`API_ERROR_${response.status}`);
     }

     console.log("[Payments] Pushin Pay Success ID:", result.id);

     // 4. Update order with real data
     // Make sure we update with the data Pushin Pay returns
     const { error: updateError } = await supabase
       .from("orders")
       .update({
         pix_code: result.qr_code,
         pix_qr_code_base64: result.qr_code_base64,
         pushinpay_transaction_id: result.id,
         status: "waiting_payment"
       })
       .eq("id", order.id);

     if (updateError) {
       console.error("[Payments] Error updating order with Pix data:", updateError);
     }
 
     return {
       orderId: order.id,
       status: "waiting_payment",
       amount_cents: priceCents,
       qr_code: result.qr_code,
       qr_code_base64: result.qr_code_base64
     };
  } catch (err) {
    await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
    throw err;
  }
}

export async function getOrderPayment(orderId: string) {
  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!order) throw new Error("NOT_FOUND");

  return {
     orderId: order.id,
     status: order.status,
     amount_cents: Math.round(order.amount * 100),
     qr_code: order.pix_code,
     qr_code_base64: order.pix_qr_code_base64 || null
   };
}