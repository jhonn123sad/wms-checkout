# MVP — Arquivos Críticos Bloqueados

Este projeto possui um fluxo de pagamento validado em produção.

## Arquivos que NÃO podem ser alterados sem autorização explícita

- src/integrations/supabase/client.ts
- src/routes/c.$slug.tsx
- src/components/public/CheckoutPageContent.tsx
- src/components/checkout/InlinePixPanel.tsx
- supabase/functions/create-pix/index.ts
- supabase/functions/get-order-status/index.ts
- supabase/functions/pushinpay-webhook/index.ts

## Regras

1. Não alterar o Supabase project ref validado:
   rqassaxkbntpcwhvevyi

2. Não substituir o fluxo de checkout validado:
   /c/$slug → checkouts → checkout_fields → CheckoutPageContent

3. Não criar ou usar sistemas paralelos para o checkout público, como:
   - checkout_projects
   - checkout_offers
   - project_id
   - offer_id
   - /pagamento/$orderId

4. Não alterar o fluxo Pix validado:
   CheckoutPageContent → create-pix → pushinpay-webhook → get-order-status → redirect

5. Qualquer novo design deve ser criado como componente isolado e não pode alterar:
   - src/routes/c.$slug.tsx
   - src/components/public/CheckoutPageContent.tsx
   - supabase/functions/create-pix/index.ts
   - supabase/functions/get-order-status/index.ts
   - supabase/functions/pushinpay-webhook/index.ts

6. Qualquer alteração de admin não pode afetar:
   - /c/$slug
   - create-pix
   - webhook
   - get-order-status
   - CheckoutPageContent

7. Qualquer alteração nesses arquivos críticos exige:
   - justificativa
   - diff antes de aplicar
   - plano de rollback
   - teste isolado

## Checkpoint validado

Estado validado:
mvp-pagamento-validado-2026-05-07

Testado:
- admin lista checkouts reais
- Supabase correto: rqassaxkbntpcwhvevyi
- /c/wms-novo-teste carrega
- Pix gera
- pagamento marca paid
- redirecionamento funciona
