const resp = await fetch("https://rqassaxkbntpcwhvevyi.supabase.co/functions/v1/get-order-status", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ 
    orderId: "36391ef0-ebf7-4012-8ca6-ae3cd1a00eae",
    token: "5fa47f3f-4d64-4312-a9fe-c649e5e8485d"
  })
});

const data = await resp.json();
console.log(JSON.stringify(data, null, 2));
