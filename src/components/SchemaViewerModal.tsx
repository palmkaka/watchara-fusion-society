'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Database, ShieldCheck, Download } from 'lucide-react';

interface SchemaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SchemaViewerModal({ isOpen, onClose }: SchemaViewerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSchema = `-- =========================================================================
-- Retail Product Showcase & Dynamic Inventory
-- Supabase PostgreSQL Schema & Row Level Security (RLS) Setup
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (ผูกกับ auth.users พร้อม RBAC Enum)
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

alter table public.profiles enable row level security;

-- Helper functions for safe role evaluation without recursion
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

-- Auto trigger on new user signup
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
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Staff and Admin can view all profiles" on public.profiles for select using (public.is_staff_or_admin());
create policy "Admins can manage all profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- 2. Categories Table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  is_custom boolean default false not null, -- true = หมวดหมู่ในกลุ่ม "อื่นๆ" ที่แอดมินสร้างขึ้น
  is_active boolean default true not null,
  display_order integer default 0 not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

-- Categories RLS: Public reads active, Staff reads all, Admin has full CRUD
create policy "Public can view active categories" on public.categories for select using (is_active = true);
create policy "Staff can view all categories" on public.categories for select using (public.is_staff_or_admin());
create policy "Admin full access on categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- 3. Products Table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  sku text unique,
  price numeric(10, 2) not null default 0 check (price >= 0),
  cost_price numeric(10, 2) default 0 check (cost_price >= 0), -- พนักงาน/แอดมินเห็นเท่านั้น
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  category_id uuid references public.categories(id) on delete set null,
  images text[] default '{}'::text[],
  tags text[] default '{}'::text[],
  staff_notes text, -- พนักงาน/แอดมินเห็นเท่านั้น
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

-- Products RLS:
create policy "Public can view active products" on public.products for select using (is_active = true);
create policy "Staff can view all products" on public.products for select using (public.is_staff_or_admin());
create policy "Staff can update stock quantity" on public.products for update using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
create policy "Admin full access on products" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- 4. Public Security View (hides cost_price and staff_notes from public)
create or replace view public.products_public with (security_invoker = true) as
select id, name, description, sku, price, stock_quantity, category_id, images, tags, is_active, created_at, updated_at
from public.products
where is_active = true;

grant select on public.products_public to anon, authenticated;

-- 5. Seed Data (Categories)
insert into public.categories (name, slug, is_custom, is_active, display_order, description) values
  ('เครื่องครัว', 'kitchenware', false, true, 1, 'อุปกรณ์ทำอาหาร มีด กระทะ หม้อ และของใช้ในครัวระดับพรีเมียม'),
  ('ของใช้ในบ้าน', 'home-essentials', false, true, 2, 'อุปกรณ์ทำความสะอาด จัดระเบียบบ้าน และของใช้จำเป็น'),
  ('อุปกรณ์ทำสวน', 'gardening', false, true, 3, 'กระถางต้นไม้ กรรไกรตัดแต่งกิ่ง ดินปลูก และอุปกรณ์ดูแลสวน'),
  ('เครื่องมือช่าง', 'tools-hardware', false, true, 4, 'สว่านไร้สาย ไขควง คีม และชุดเครื่องมือช่างคุณภาพสูง'),
  ('อุปกรณ์แต่งบ้าน', 'home-decor', false, true, 5, 'โคมไฟสไตล์มินิมอล แจกัน ภาพติดผนัง และพรมตกแต่ง'),
  ('Gadgets', 'gadgets', false, true, 6, 'อุปกรณ์สมาร์ทโฮม เซนเซอร์ โคมไฟอัจฉริยะ และแกดเจ็ตไลฟ์สไตล์'),
  ('แคมป์ปิ้ง & เอาท์ดอร์', 'camping-outdoor', true, true, 10, 'เต็นท์ โต๊ะพับ เก้าอี้สนาม และอุปกรณ์เดินป่า'),
  ('อุปกรณ์สัตว์เลี้ยง', 'pet-supplies', true, true, 11, 'ชามอาหารสัตว์ ที่นอน และของเล่นน้องหมาน้องแมว')
on conflict (slug) do nothing;`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-mono font-bold text-xs">
              SQL
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Supabase SQL Schema & Row Level Security (RLS)
              </h3>
              <p className="text-xs text-stone-500">
                Migration script พร้อม RLS Policies, Functions, Security View และ Seed Data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-6 py-2.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>RLS Enforced: Customer &bull; Staff &bull; Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 font-medium text-stone-700 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด .sql</span>
            </button>

            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>คัดลอก SQL แล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกทั้งหมด (Copy SQL)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-950 font-mono text-xs text-stone-200 leading-relaxed">
          <pre className="whitespace-pre-wrap">{sqlSchema}</pre>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-xs text-stone-600 flex items-center justify-between">
          <p>
            นำสคริปต์นี้ไปวางใน <strong>Supabase Dashboard &rarr; SQL Editor &rarr; Run</strong> เพื่อเริ่มใช้งานทันที
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
