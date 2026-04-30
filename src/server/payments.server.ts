import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const getSupabaseAdmin = () => createClient(supabaseUrl, supabaseServiceKey);

export async function createPixOrder(data: { customer_name: string; customer_cpf: string }) {
  const apiToken = process.env.PUSHINPAY_API_TOKEN;
  const baseUrl = process.env.PUSHINPAY_BASE_URL;

  if (!apiToken || !baseUrl) {
    throw new Error("CONFIG_MISSING");
  }

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
    const response = await fetch(`${baseUrl}/pix/cashIn`, {
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

    const result = await response.json();

    if (!response.ok) throw new Error("API_ERROR");

    // 4. Update order with real data
    await supabase
      .from("orders")
      .update({
        pix_code: result.qr_code,
        status: "waiting_payment"
      })
      .eq("id", order.id);

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
    qr_code_base64: null // We'll handle placeholder in UI if base64 not stored
  };
}