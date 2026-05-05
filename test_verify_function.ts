const resp = await fetch("https://rqassaxkbntpcwhvevyi.supabase.co/functions/v1/verify-checkout-delivery", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ checkout_id: "01ec2a2f-beb9-4238-8747-48c017d9d948" })
});

const data = await resp.json();
console.log(JSON.stringify(data, null, 2));
