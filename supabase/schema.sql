-- =========================================================================
-- Retail Product Showcase & Dynamic Inventory
-- Supabase PostgreSQL Schema & Row Level Security (RLS) Setup
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. ENUMS & PROFILES TABLE (RBAC)
-- =========================================================================
create type public.user_role as enum ('customer', 'staff', 'admin');

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role public.user_role default 'customer'::public.user_role not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.profiles is 'Stores user profile metadata and role-based access control (RBAC).';

-- Enable RLS
alter table public.profiles enable row level security;

-- Security definer functions for safe role checks without recursion
create or replace function public.current_user_role()
returns public.user_role as $$
declare
  _role public.user_role;
begin
  select role into _role from public.profiles where id = auth.uid();
  return coalesce(_role, 'customer'::public.user_role);
end;
$$ language plpgsql security definer stable;

create or replace function public.is_admin()
returns boolean as $$
begin
  return (public.current_user_role() = 'admin');
end;
$$ language plpgsql security definer stable;

create or replace function public.is_staff_or_admin()
returns boolean as $$
begin
  return (public.current_user_role() in ('staff', 'admin'));
end;
$$ language plpgsql security definer stable;

-- Trigger to create profile automatically on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'customer'::public.user_role),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profiles Policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Staff and Admin can view all profiles" on public.profiles;
create policy "Staff and Admin can view all profiles"
  on public.profiles for select
  using (public.is_staff_or_admin());

drop policy if exists "Users can update own profile info" on public.profiles;
create policy "Users can update own profile info"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Admins can manage all profiles" on public.profiles;
create policy "Admins can manage all profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- =========================================================================
-- 2. CATEGORIES TABLE (Fixed & Dynamic Custom Categories)
-- =========================================================================
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  is_custom boolean default false not null, -- true = หมวดหมู่ย่อยในกลุ่ม "อื่นๆ" ที่แอดมินสร้างขึ้น
  is_active boolean default true not null,
  display_order integer default 0 not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.categories is 'Product categories. is_custom=true represents dynamic categories managed under "Other".';

alter table public.categories enable row level security;

-- Categories Policies
drop policy if exists "Public can view active categories" on public.categories;
create policy "Public can view active categories"
  on public.categories for select
  using (is_active = true);

drop policy if exists "Staff can view all categories" on public.categories;
create policy "Staff can view all categories"
  on public.categories for select
  using (public.is_staff_or_admin());

drop policy if exists "Admin full access on categories" on public.categories;
create policy "Admin full access on categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- =========================================================================
-- 3. PRODUCTS TABLE
-- =========================================================================
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  sku text unique,
  price numeric(10, 2) not null default 0 check (price >= 0),
  cost_price numeric(10, 2) default 0 check (cost_price >= 0), -- Sensitive: staff/admin only
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  category_id uuid references public.categories(id) on delete set null,
  images text[] default '{}'::text[],
  tags text[] default '{}'::text[],
  staff_notes text, -- Sensitive: staff/admin only
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.products is 'Catalog of products with pricing, inventory quantity, and staff notes.';

-- Performance Indexes
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_products_price on public.products(price);

alter table public.products enable row level security;

-- Products Policies
-- Public can only view active products
drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
  on public.products for select
  using (is_active = true);

-- Staff can view all products including inactive ones
drop policy if exists "Staff can view all products" on public.products;
create policy "Staff can view all products"
  on public.products for select
  using (public.is_staff_or_admin());

-- Staff can update stock quantity directly
drop policy if exists "Staff can update stock quantity" on public.products;
create policy "Staff can update stock quantity"
  on public.products for update
  using (public.is_staff_or_admin())
  with check (public.is_staff_or_admin());

-- Admin has full CRUD access on products
drop policy if exists "Admin full access on products" on public.products;
create policy "Admin full access on products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- =========================================================================
-- 4. PUBLIC VIEW (Hides cost_price and staff_notes from Public/Customer)
-- =========================================================================
create or replace view public.products_public with (security_invoker = true) as
select
  id,
  name,
  description,
  sku,
  price,
  stock_quantity,
  category_id,
  images,
  tags,
  is_active,
  created_at,
  updated_at
from public.products
where is_active = true;

comment on view public.products_public is 'Customer-facing view that automatically strips cost_price and staff_notes.';
grant select on public.products_public to anon, authenticated;

-- =========================================================================
-- 5. STOCK AUDIT LOG TABLE
-- =========================================================================
create table if not exists public.stock_logs (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  previous_stock integer not null,
  new_stock integer not null,
  delta integer not null,
  changed_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.stock_logs enable row level security;

drop policy if exists "Staff and admin can view stock logs" on public.stock_logs;
create policy "Staff and admin can view stock logs"
  on public.stock_logs for select
  using (public.is_staff_or_admin());

drop policy if exists "Staff and admin can insert stock logs" on public.stock_logs;
create policy "Staff and admin can insert stock logs"
  on public.stock_logs for insert
  with check (public.is_staff_or_admin());

-- Auto update timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at_column();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.update_updated_at_column();

-- =========================================================================
-- 6. SEED DATA (Standard Categories & Dynamic Subcategories)
-- =========================================================================
insert into public.categories (name, slug, is_custom, is_active, display_order, description) values
  ('เครื่องครัว', 'kitchenware', false, true, 1, 'อุปกรณ์ทำอาหาร มีด กระทะ หม้อ และของใช้ในครัวระดับพรีเมียม'),
  ('ของใช้ในบ้าน', 'home-essentials', false, true, 2, 'อุปกรณ์ทำความสะอาด จัดระเบียบบ้าน และของใช้จำเป็น'),
  ('อุปกรณ์ทำสวน', 'gardening', false, true, 3, 'กระถางต้นไม้ กรรไกรตัดแต่งกิ่ง ดินปลูก และอุปกรณ์ดูแลสวน'),
  ('เครื่องมือช่าง', 'tools-hardware', false, true, 4, 'สว่านไร้สาย ไขควง คีม และชุดเครื่องมือช่างคุณภาพสูง'),
  ('อุปกรณ์แต่งบ้าน', 'home-decor', false, true, 5, 'โคมไฟสไตล์มินิมอล แจกัน ภาพติดผนัง และพรมตกแต่ง'),
  ('Gadgets', 'gadgets', false, true, 6, 'อุปกรณ์สมาร์ทโฮม เซนเซอร์ โคมไฟอัจฉริยะ และแกดเจ็ตไลฟ์สไตล์'),
  -- หมวดหมู่อื่นๆ (Dynamic Custom Categories ที่แอดมินสร้าง)
  ('แคมป์ปิ้ง & เอาท์ดอร์', 'camping-outdoor', true, true, 10, 'เต็นท์ โต๊ะพับ เก้าอี้สนาม และอุปกรณ์เดินป่า'),
  ('อุปกรณ์สัตว์เลี้ยง', 'pet-supplies', true, true, 11, 'ชามอาหารสัตว์ ที่นอน และของเล่นน้องหมาน้องแมว')
on conflict (slug) do nothing;
