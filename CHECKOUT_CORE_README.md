# Checkout Multi-Project Core

Este sistema permite gerenciar múltiplos checkouts independentes usando a mesma base de código.

## Rotas de Admin
- `/admin/login`: Login para administradores.
- `/admin`: Dashboard central.
- `/admin/projects`: Listagem de projetos de checkout.
- `/admin/projects/new`: Criação de novo checkout.
- `/admin/projects/:id`: Edição de checkout existente.

## Rotas Públicas Dinâmicas
- `/c/:slug`: Checkout público configurado via admin.

## Tabelas no Banco de Dados
- `checkout_projects`: Armazena configurações Visuais e de comportamento.
- `checkout_offers`: Armazena preços e descrições de produtos vinculados a projetos.
- `user_roles`: Gerencia permissões (admin/user).

## Como criar um novo checkout
1. Acesse `/admin` e faça login.
2. Vá em **Projetos** e clique em **Novo Projeto**.
3. Defina um **Slug** único (ex: `produto-x`).
4. Configure o preço, headline e cores.
5. Salve. O checkout estará disponível em `sua-url.com/c/produto-x`.

## Segurança
Acesso ao admin é restrito a usuários com `role = 'admin'` na tabela `user_roles`. 
O checkout público respeita as Row Level Security (RLS) para exibir apenas projetos ativos.
