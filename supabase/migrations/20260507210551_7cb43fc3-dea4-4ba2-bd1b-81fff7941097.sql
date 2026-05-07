-- Criação da tabela de seções do checkout
create table if not exists public.checkout_sections (
  id uuid primary key default gen_random_uuid(),
  checkout_id uuid not null references public.checkouts(id) on delete cascade,
  sort_order integer not null default 0,
  section_type text not null,
  content jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index para performance e ordenação
create index if not exists checkout_sections_checkout_id_sort_order_idx
on public.checkout_sections (checkout_id, sort_order);

-- Habilitar RLS
alter table public.checkout_sections enable row level security;

-- Política de leitura pública (apenas ativas)
create policy "Public can read active checkout sections"
on public.checkout_sections
for select
using (active = true);

-- Política para administradores
create policy "Authenticated users can manage checkout sections"
on public.checkout_sections
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');