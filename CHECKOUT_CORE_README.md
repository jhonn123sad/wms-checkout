 # CHECKOUT CORE - DOCUMENTAÇÃO TÉCNICA
 
 ## Fluxo do Checkout
 1. **Página de Checkout (`/c/:slug`)**: Captura dados do cliente e UTMs. Chama a function `create-pix`.
 2. **Geração de Pix (`create-pix`)**: Edge Function que valida dados, cria pedido no banco com `public_access_token`, chama API Pushin Pay e retorna QR Code + token.
 3. **Página de Pagamento (`/pagamento/:orderId?token=...`)**: Recebe o ID do pedido e o token de acesso público via query string.
 4. **Consulta de Dados (`get-order-payment-data`)**: Recupera QR Code e valor validando o token fornecido contra o banco.
 5. **Polling de Status (`get-order-status`)**: Frontend consulta recorrentemente o status do pedido validando o token.
 6. **Webhook (`pushinpay-webhook`)**: Recebe notificação da Pushin Pay, valida assinatura e atualiza pedido para `paid`.
 7. **Redirecionamento**: `get-order-status` detecta status `paid` e retorna `thank_you_url`, frontend redireciona o usuário.
 
 ## Arquivos Core Protegidos (NÃO ALTERAR SEM TESTE)
 - `supabase/functions/create-pix/index.ts`
 - `supabase/functions/pushinpay-webhook/index.ts`
 - `supabase/functions/get-order-payment-data/index.ts`
 - `supabase/functions/get-order-status/index.ts`
 - `src/routes/c.$slug.tsx`
 - `src/routes/pagamento.$orderId.tsx`
 
 ## O que pode ser alterado com segurança
 - Estilos CSS e classes Tailwind (desde que não alterem IDs ou seletores lógicos).
 - Textos de interface e headlines.
 - Adição de novos logs ou pixels de rastreamento.
 
 ## Checklist de Regressão (Obrigatório após qualquer alteração)
 - [ ] Acessar `/c/:slug` (ex: `/c/cadastro-completo`) e verificar se carrega dados do projeto.
 - [ ] Preencher formulário e clicar em "Gerar Pix".
 - [ ] Validar se redireciona para `/pagamento/:orderId?token=...` com token na URL.
 - [ ] Verificar se o QR Code e o valor correto aparecem na tela de pagamento.
 - [ ] Realizar pagamento real ou via simulador e verificar se o status muda para "Pagamento confirmado" automaticamente.
 - [ ] Confirmar se ocorre o redirecionamento final para a página de obrigado.
 
 ---
 **AVISO: A segurança do checkout depende do `public_access_token`. Nunca remova a validação de token nas Edge Functions.**