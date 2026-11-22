create type app_role as enum ('customer', 'worker', 'admin');
create type order_status as enum ('pending_payment','payment_review','assigned','in_progress','delivered','revision','completed','cancelled');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  role app_role not null default 'customer',
  college_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  base_price integer not null check (base_price >= 0),
  worker_commission integer not null default 80 check (worker_commission between 0 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id),
  worker_id uuid references public.profiles(id),
  service_id uuid references public.services(id),
  status order_status not null default 'pending_payment',
  amount integer not null,
  requirements text,
  upi_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id),
  storage_path text not null,
  kind text not null check (kind in ('requirement','deliverable','payment_proof')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.order_files enable row level security;

create policy "Public services are viewable" on public.services for select using (active = true);
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Customers can view own orders" on public.orders for select using (auth.uid() = customer_id or auth.uid() = worker_id);
