 # CHECKOUT CORE - DOCUMENTAÇÃO INTERNA
 
 Este documento descreve o núcleo estável do sistema de checkout e integração com Pushin Pay.
 
 ## 🛡️ Core Estável (NÃO ALTERAR SEM TESTE)
 
 Os arquivos abaixo formam o "coração" do pagamento. Qualquer alteração nestes arquivos pode quebrar o fluxo de vendas real.
 
 ### Edge Functions (Backend)
 - `supabase/functions/create-pix/index.ts`: Cria o pedido no banco e gera o Pix na API da Pushin Pay.
 - `supabase/functions/pushinpay-webhook/index.ts`: Recebe confirmações de pagamento (paid) da Pushin Pay.
 - `supabase/functions/get-order-status/index.ts`: Consulta se o pedido já foi pago para redirecionar o usuário.
 - `supabase/functions/get-order-payment-data/index.ts`: Retorna os dados do QR Code para o frontend.
 
 ### Rotas (Frontend)
 - `src/routes/index.tsx`: Captura dados do cliente e inicia a geração do Pix.
 - `src/routes/pagamento.$orderId.tsx`: Exibe o QR Code e faz o polling (verificação automática) do status.
 
 ## 🎨 Áreas Customizáveis (Baixo Risco)
 
 - `src/components/*`: Componentes de UI que não possuem lógica de estado de pagamento.
 - `src/styles.css`: Estilização global e temas.
 - `src/routes/pagamento.demo-preview.tsx`: Apenas visual, não afeta o fluxo real.
 
 ## ✅ Checklist de Regressão (Manual)
 
 Antes de qualquer deploy no Core, realize este teste real:
 1. [ ] Acessar a Home e preencher Nome/CPF.
 2. [ ] Clicar em "Gerar Pix" e verificar se redireciona para `/pagamento/[ID]`.
 3. [ ] Verificar se o QR Code e o botão "Copiar" aparecem corretamente.
 4. [ ] Realizar um pagamento real (ou usar simulador se disponível na Pushin Pay).
 5. [ ] Aguardar na página de pagamento sem dar F5.
 6. [ ] Validar se o status muda para "Pagamento confirmado" automaticamente.
 7. [ ] Validar se ocorre o redirecionamento automático para a página de obrigado.
 
 ## 📋 Configurações Necessárias (Env Vars)
 
 - `PUSHINPAY_API_TOKEN`: Token da conta Pushin Pay.
 - `PUSHINPAY_BASE_URL`: URL da API (Produção ou Sandbox).
 - `THANK_YOU_URL`: URL padrão para redirecionar após o pagamento (caso o produto não tenha uma específica).
 
 ---
 *Este núcleo deve ser mantido estável. Novas funcionalidades devem ser construídas ao redor dele.*