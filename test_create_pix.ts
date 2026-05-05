const resp = await fetch("https://rqassaxkbntpcwhvevyi.supabase.co/functions/v1/create-pix", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ checkout_slug: "receitas-praticas" })
});

const data = await resp.json();
console.log(JSON.stringify(data, null, 2));
