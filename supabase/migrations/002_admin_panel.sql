alter type app_role add value if not exists 'super_admin';
alter type app_role add value if not exists 'operations_manager';
alter type app_role add value if not exists 'finance_manager';
alter type app_role add value if not exists 'service_manager';
alter type app_role add value if not exists 'support_admin';

alter table public.services add column if not exists category_id uuid;
alter table public.services add column if not exists image_url text;
alter table public.services add column if not exists delivery_hours integer not null default 24;
alter table public.services add column if not exists urgent_charge integer not null default 0;
alter table public.services add column if not exists featured boolean not null default false;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.service_tiers (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  price integer not null check (price >= 0),
  sort_order integer not null default 0,
  active boolean not null default true,
  unique(service_id, sort_order)
);

create table if not exists public.worker_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  approved boolean not null default false,
  active boolean not null default true,
  skills text[] not null default '{}',
  max_active_orders integer not null default 5,
  availability text not null default 'available'
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  from_status text,
  to_status text not null,
  admin_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  customer_id uuid references public.profiles(id),
  worker_id uuid references public.profiles(id),
  kind text not null check (kind in ('payment','refund','worker_payout','platform_fee')),
  amount integer not null,
  status text not null default 'pending',
  payment_reference text,
  proof_path text,
  verified_by uuid,
  verified_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  order_id uuid references public.orders(id),
  subject text not null,
  description text,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'open' check (status in ('open','in_progress','waiting','resolved','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  admin_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text,
  previous_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.temporary_chats (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  expires_at timestamptz not null,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.temporary_chats(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.service_tiers enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.order_status_history enable row level security;
alter table public.transactions enable row level security;
alter table public.support_tickets enable row level security;
alter table public.audit_logs enable row level security;
alter table public.temporary_chats enable row level security;
alter table public.chat_messages enable row level security;

create policy "Categories are public" on public.categories for select using (active = true);
create policy "Tiers are public for active services" on public.service_tiers for select using (active = true);
create policy "Ticket owners can view" on public.support_tickets for select using (auth.uid() = user_id);
create policy "Chat users can view" on public.temporary_chats for select using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or o.worker_id = auth.uid())));
create policy "Chat messages visible to participants" on public.chat_messages for select using (exists (select 1 from public.temporary_chats c join public.orders o on o.id = c.order_id where c.id = chat_id and (o.customer_id = auth.uid() or o.worker_id = auth.uid())));

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_worker on public.orders(worker_id);
create index if not exists idx_transactions_order on public.transactions(order_id);
create index if not exists idx_support_status on public.support_tickets(status);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);
