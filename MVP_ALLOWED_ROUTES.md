# MVP — Rotas Permitidas

## Rotas públicas principais

- /c/$slug
  Fluxo validado de checkout público.
  Usa:
  - public.checkouts
  - public.checkout_fields
  - CheckoutPageContent
  - create-pix com checkout_slug

## Rotas administrativas

- /admin
- /admin/checkouts
- /admin/checkouts/$id

## Rotas técnicas/Edge Functions

- create-pix
- get-order-status
- pushinpay-webhook

## Rotas proibidas para o MVP

Não criar, restaurar ou usar fluxo paralelo com:

- /pagamento/$orderId
- checkout_projects
- checkout_offers
- project_id como base do checkout público
- offer_id como base do checkout público

## Regra

Qualquer novo checkout, design ou página de venda deve passar pelo fluxo:

/c/$slug → checkouts → checkout_fields → CheckoutPageContent → create-pix

Não criar arquitetura alternativa.
