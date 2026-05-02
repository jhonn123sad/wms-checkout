# DOCUMENTAÇÃO TÉCNICA: CHECKOUT BASE VALIDADA

## Visão Geral
Este documento registra o estado funcional validado do sistema de checkout para garantir que futuras alterações de design não quebrem o fluxo crítico de pagamento e persistência de dados.

## Infraestrutura Oficial
- **Rota Oficial:** `/c/:slug` (Público)
- **Tabela Principal:** `public.checkouts`
- **Bucket de Mídia:** `checkout-assets`
- **Edge Function:** `create-pix` (Integração Pushin Pay)

## Regras de Negócio Validadas

### 1. Fluxo de Pix
- O Pix **não depende** de campos do formulário preenchidos.
- A Edge Function `create-pix` utiliza apenas o ID do checkout e o preço para gerar a cobrança.
- O botão de Pix deve estar sempre funcional, mesmo sem formulário ativo.

### 2. Campos do Formulário (Configuração via Admin)
- **`active` (Ativo):** Se `true`, o campo aparece no checkout público. Se `false`, o campo é ocultado.
- **`required` (Obrigatório):** Só é validado se o campo estiver marcado como `active=true`.
- **Persistência:** As configurações de `active` e `required` são salvas no JSON de campos na tabela `checkouts`.

### 3. Mídia e Visual
- **Imagens:** Gerenciadas via bucket `checkout-assets`.
- **Preço:** Deve permanecer posicionado no card principal de checkout, acima do título do formulário.

## O que NÃO alterar em mudanças visuais
- Estrutura de dados do payload enviado para `create-pix`.
- Lógica de validação condicional (`active` && `required`).
- Nome das colunas na tabela `public.checkouts`.
- Configuração de RLS do bucket `checkout-assets`.

## Checklist de Regressão (Executar antes e depois de alterações)
1. [ ] `/c/comunidade-wms` abre corretamente.
2. [ ] Imagem de destaque aparece.
3. [ ] Pix gera com sucesso sem nenhum campo ativo.
4. [ ] Alterar `active/required` no admin persiste após salvar e recarregar.
5. [ ] Campos marcados como ativos aparecem no checkout público.
6. [ ] Campo obrigatório (`required`) só impede o Pix se estiver visível (`active`).
7. [ ] Upload de novas imagens no admin continua funcional.
8. [ ] Preço aparece no bloco correto (dentro do card, acima do formulário).
9. [ ] Nenhuma alteração de CSS ou Layout toca na lógica de `handlePayment`.
