# Guia de Criação de Designs de Checkout MVP

Este documento descreve o fluxo oficial para criar e estabilizar novos designs visuais sem quebrar a lógica central do sistema.

## 1. Onde os designs moram
Todos os componentes de design visual ficam em:
`src/components/public/designs/`

## 2. Como criar um novo design
1. **Duplique um design existente**: Use o `DefaultCheckoutDesign.tsx` ou `WmsNovoTesteCheckoutDesign.tsx` como base.
2. **Implemente a UI**: Sinta-se livre para usar Tailwind, seções extras, FAQs, depoimentos, etc.
3. **Mantenha os Handlers**: O componente deve receber e usar obrigatoriamente:
   - `handleSubmit`: Para gerar o Pix.
   - `handleInputChange`: Para salvar dados do formulário.
   - `InlinePixPanel`: O componente que renderiza o QR Code.
   - `checkout`: Dados dinâmicos do banco (title, price, etc).

## 3. Registrar o novo design
1. No arquivo `src/components/public/CheckoutPageContent.tsx`:
   - Importe seu novo componente.
   - Adicione o mapeamento do `design_key` no bloco condicional.
2. No admin (`src/routes/admin.checkouts.$id.tsx`):
   - Adicione o novo `design_key` no `<select>` de designs para que ele possa ser selecionado.

## 4. O que NÃO pode ser alterado
Para manter a estabilidade do MVP, não altere ou reimplemente nos componentes de design:
- A lógica de chamada à API do Pix.
- O funcionamento do Supabase/RLS.
- A estrutura de rotas `/c/:slug`.
- A lógica de campos ativos/obrigatórios (isso deve vir via props).

## 5. Checklist de Lançamento
- [ ] O checkout abre via `/c/:slug`.
- [ ] O Pix é gerado corretamente (botão funciona).
- [ ] O formulário respeita os campos ativos no admin.
- [ ] O redirecionamento pós-pagamento funciona.
- [ ] Layout mobile está sem scroll horizontal.
