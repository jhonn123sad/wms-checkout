# Plano de Rotação de Chaves — MVP

## Estado atual

O sistema de checkout está validado e funcionando.

Checkpoint validado:
mvp-pagamento-validado-2026-05-07

Fluxo validado:
- /c/$slug
- public.checkouts
- public.checkout_fields
- CheckoutPageContent
- create-pix
- pushinpay-webhook
- get-order-status
- redirect final

Supabase correto:
rqassaxkbntpcwhvevyi

## Chaves identificadas

### 1. SUPABASE_PUBLISHABLE_KEY

Uso:
- frontend
- src/integrations/supabase/client.ts

Risco:
- baixo
- chave pública

Ação:
- não rotacionar agora
- manter enquanto estiver apontando para rqassaxkbntpcwhvevyi

### 2. SUPABASE_SERVICE_ROLE_KEY

Uso:
- Edge Functions
- create-pix
- get-order-status
- pushinpay-webhook
- client.server.ts, se aplicável

Risco:
- crítico
- ignora RLS
- não pode ficar exposta

Ação futura:
- rotacionar com cuidado
- atualizar secrets das Edge Functions
- redeployar functions
- testar create-pix
- testar webhook
- testar get-order-status

### 3. PUSHINPAY_API_TOKEN

Uso:
- create-pix
- create-pix-v2, se ainda existir

Risco:
- alto
- acesso financeiro

Ação futura:
- verificar no painel PushinPay se houve exposição real
- se rotacionar, atualizar secret na Supabase
- redeployar create-pix
- testar geração de Pix

### 4. PUSHINPAY_WEBHOOK_SECRET

Uso:
- pushinpay-webhook
- validação de origem do webhook

Risco:
- médio/alto

Ação futura:
- só rotacionar junto com configuração no painel PushinPay
- atualizar secret na Supabase
- redeployar pushinpay-webhook
- fazer pagamento de teste
- confirmar status paid

## Ordem segura para rotação futura

1. Criar novo checkpoint antes da rotação.
2. Rotacionar SUPABASE_SERVICE_ROLE_KEY no Supabase.
3. Atualizar secret SUPABASE_SERVICE_ROLE_KEY nas Edge Functions.
4. Redeployar Edge Functions.
5. Testar:
   - create-pix
   - get-order-status
   - pushinpay-webhook

6. Rotacionar PUSHINPAY_API_TOKEN, se necessário.
7. Atualizar secret PUSHINPAY_API_TOKEN.
8. Redeployar create-pix.
9. Testar geração de Pix.

10. Rotacionar PUSHINPAY_WEBHOOK_SECRET, se necessário.
11. Atualizar secret no painel PushinPay.
12. Atualizar secret no Supabase.
13. Redeployar pushinpay-webhook.
14. Fazer pagamento real de teste.
15. Confirmar paid e redirect.

## Regras

- Nunca colocar service_role no frontend.
- Nunca colocar secret key no frontend.
- Nunca alterar /c/$slug durante rotação.
- Nunca alterar CheckoutPageContent durante rotação.
- Nunca alterar banco/RLS durante rotação.
- Rotacionar uma chave por vez.
- Testar uma etapa por vez.
- Se quebrar, voltar ao checkpoint validado.

## Não executar agora

Este documento é apenas plano.
Nenhuma chave deve ser rotacionada nesta etapa.
