-- Supabase reset script: build user profiles and inventory tables
-- Run this in Supabase SQL editor to remove broken auth sync objects and recreate the schema.

-- Enable UUID generation if not already available
create extension if not exists "pgcrypto";

-- Remove any broken auth sync trigger/function from previous imports
DROP TRIGGER IF EXISTS trigger_auth_users_sync ON auth.users;
DROP FUNCTION IF EXISTS public.sync_auth_user_profile();

-- User profile table linked to auth.users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  cargo text,
  avatar_url text,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.users add column if not exists cargo text;
alter table if exists public.users add column if not exists avatar_url text;

-- Inventory table linked to public.users
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  equipamento text not null,
  codigo text not null,
  setor text not null,
  estado text not null,
  responsavel text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Dashboard view table connected to inventory_items
create table if not exists public.dashboard_items (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  equipamento text not null,
  codigo text not null,
  setor text not null,
  estado text not null,
  responsavel text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (inventory_item_id)
);

-- Trigger function to keep updated_at current
create or replace function public.update_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.update_timestamp_inventory()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_users_updated_at on public.users;
create trigger trigger_users_updated_at
before update on public.users
for each row execute procedure public.update_timestamp();

drop trigger if exists trigger_inventory_items_updated_at on public.inventory_items;
create trigger trigger_inventory_items_updated_at
before update on public.inventory_items
for each row execute procedure public.update_timestamp_inventory();
