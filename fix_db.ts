const SUPABASE_URL = "https://rqassaxkbntpcwhvevyi.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxYXNzYXhrYm50cGN3aHZldnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MTA1OTQsImV4cCI6MjA5MzA4NjU5NH0.whS2aT4JOYXIgrw2VXBToZZ6uMLIGf5CokcfyuyDG9k";

async function insertCheckout() {
  console.log("Checking if checkout exists...");
  const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/checkouts?slug=eq.wms-novo-teste`, {
    headers: {
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${ANON_KEY}`
    }
  });
  const existing = await checkRes.json();
  
  let checkoutId;
  if (existing.length > 0) {
    console.log("Checkout already exists, updating...");
    checkoutId = existing[0].id;
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/checkouts?id=eq.${checkoutId}`, {
      method: "PATCH",
      headers: {
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        title: "WMS Novo Teste",
        subtitle: "Experiência minimalista estilo Apple para sua comunidade premium.",
        price: 47.00,
        cta_text: "Garantir meu acesso",
        media_type: "image",
        media_url: "https://rqassaxkbntpcwhvevyi.supabase.co/storage/v1/object/public/checkout-assets/comunidade-wms/edite_essa_imagem_202604160528.jpeg",
        active: true,
        status: 'published'
      })
    });
    console.log("Update status:", updateRes.status);
  } else {
    console.log("Creating new checkout...");
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/checkouts`, {
      method: "POST",
      headers: {
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        title: "WMS Novo Teste",
        subtitle: "Experiência minimalista estilo Apple para sua comunidade premium.",
        slug: "wms-novo-teste",
        price: 47.00,
        cta_text: "Garantir meu acesso",
        media_type: "image",
        media_url: "https://rqassaxkbntpcwhvevyi.supabase.co/storage/v1/object/public/checkout-assets/comunidade-wms/edite_essa_imagem_202604160528.jpeg",
        active: true,
        status: 'published'
      })
    });
    const created = await insertRes.json();
    console.log("Insert status:", insertRes.status);
    if (insertRes.status >= 400) {
      console.error("Insert error body:", JSON.stringify(created, null, 2));
      return;
    }
    checkoutId = created[0].id;
  }

  console.log("Updating fields for checkout:", checkoutId);
  // Delete existing fields first
  await fetch(`${SUPABASE_URL}/rest/v1/checkout_fields?checkout_id=eq.${checkoutId}`, {
    method: "DELETE",
    headers: {
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${ANON_KEY}`
    }
  });

  // Insert standard fields
  const fields = [
    { checkout_id: checkoutId, field_name: "customer_name", field_label: "Nome Completo", required: true, sort_order: 1, active: true },
    { checkout_id: checkoutId, field_name: "customer_email", field_label: "E-mail", required: true, sort_order: 2, active: true },
    { checkout_id: checkoutId, field_name: "customer_phone", field_label: "WhatsApp", required: true, sort_order: 3, active: true }
  ];

  const fieldRes = await fetch(`${SUPABASE_URL}/rest/v1/checkout_fields`, {
    method: "POST",
    headers: {
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(fields)
  });
  console.log("Fields insert status:", fieldRes.status);
}

insertCheckout();
