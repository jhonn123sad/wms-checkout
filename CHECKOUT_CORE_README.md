 # CHECKOUT CORE - DOCUMENTAÇÃO TÉCNICA
 
 ## Fluxo do Checkout
 1. **Página de Checkout (`/c/:slug`)**: Captura dados do cliente e UTMs. Chama a function `create-pix`.
 2. **Geração de Pix (`create-pix`)**: Edge Function que valida dados, cria pedido no banco com `public_access_token`, chama API Pushin Pay e retorna QR Code + token.
 3. **Página de Pagamento (`/pagamento/:orderId?token=...`)**: Recebe o ID do pedido e o token de acesso público via query string.
 4. **Consulta de Dados (`get-order-payment-data`)**: Recupera QR Code e valor validando o token fornecido contra o banco.
 5. **Polling de Status (`get-order-status`)**: Frontend consulta recorrentemente o status do pedido validando o token.
 6. **Webhook (`pushinpay-webhook`)**: Recebe notificação da Pushin Pay, valida assinatura e atualiza pedido para `paid`.
 7. **Redirecionamento**: `get-order-status` detecta status `paid` e retorna `thank_you_url`, frontend redireciona o usuário.
 
## Regras de Proteção do Core Financeiro (CRÍTICO)

Estes arquivos compõem o core financeiro validado e **NÃO DEVEM SER ALTERADOS** sem autorização explícita:

1. `supabase/functions/create-pix/index.ts` (Geração de Pix)
2. `supabase/functions/get-order-status/index.ts` (Status de pagamento)
3. `supabase/functions/pushinpay-webhook/index.ts` (Webhook de confirmação)
4. `src/components/public/CheckoutPageContent.tsx` (Redirecionamento e lógica de checkout)
5. `src/components/checkout/InlinePixPanel.tsx` (Painel Pix e polling)

### Procedimento para Alteração Excepcional
Se for absolutamente necessário mexer neles, avise o usuário explicando:
1. Qual arquivo precisa mudar.
2. Por quê.
3. Qual o risco.
4. Como testar sem quebrar o fluxo de pagamento.

## Checklist de Regressão (Obrigatório)
- [ ] Acessar um checkout (ex: `/c/wms-novo-teste`).
- [ ] Preencher formulário e clicar em "Gerar Pix".
- [ ] Validar se redireciona para a página de pagamento ou abre o painel Pix.
- [ ] Verificar se o QR Code e o valor correto aparecem.
- [ ] Realizar pagamento e verificar se o status muda para "Pago" e redireciona automaticamente para a URL de sucesso configurada no checkout.

---
**AVISO: A segurança do checkout depende do `public_access_token`. Nunca remova a validação de token nas Edge Functions.**
**VERSION: Finance-Core-Stable-2026-05-06**