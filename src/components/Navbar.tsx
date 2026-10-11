'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  User,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  PhoneCall,
  LogOut
} from 'lucide-react';
import { useAuth } from '../lib/context/AuthContext';
import { useStore } from '../lib/context/StoreContext';

interface NavbarProps {
  onOpenCart: () => void;
  onScrollToProducts?: () => void;
}

export default function Navbar({ onOpenCart, onScrollToProducts }: NavbarProps) {
  const { role, isStaff, isAdmin, isAuthenticated, profile, logout } = useAuth();
  const { cartCount } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs transition-all">
      {/* Top Store Notice Bar - ข้อความวิ่ง (Smooth Continuous Marquee) */}
      <div className="bg-stone-900 text-stone-300 text-[11px] py-1.5 border-b border-stone-800 overflow-hidden whitespace-nowrap select-none">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-default">
          {/* Loop Item 1 */}
          <div className="flex items-center gap-6 sm:gap-8 px-6 shrink-0 font-medium">
            <span className="text-white font-semibold">
              ✨ ยินดีต้อนรับสู่ Watchara Fusion Society &bull; สินค้าพร้อมส่งจริง จัดส่งรวดเร็วทั่วประเทศ
            </span>
            <span className="text-amber-400 font-bold">&bull;</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <PhoneCall className="w-3 h-3 text-amber-400" /> โทร: 02-123-4567
            </span>
            <span className="text-amber-400 font-bold">&bull;</span>
            <span className="text-stone-300">
              LINE OA: <strong className="text-white font-bold">@retailspace</strong>
            </span>
            <span className="text-amber-400 font-bold">&bull;</span>
            <span className="text-stone-300">
              สต็อกอัปเดตเรียลไทม์ สอบถามและจองผ่านตะกร้า Inquiry Cart ได้ทันที
            </span>
            <span className="text-amber-400 font-bold">&bull;</span>
          </div>

          {/* Loop Item 2 (Seamless loop mirror) */}
          <div className="flex items-center gap-6 sm:gap-8 px-6 shrink-0 font-medium" aria-hidden="true">
            <span className="text-white font-semibold">
              ✨ ยินดีต้อนรับสู่ Watchara Fusion Society &bull; สินค้าพร้อมส่งจริง จัดส่งรวดเร็วทั่วประเทศ
            </span>
            <span className="text-amber-400 font-bold">&bull;</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <PhoneCall className="w-3 h-3 text-amber-400" /> โทร: 02-123-4567
            </span>
            <span className="text-amber-400 font-bold">&bull;</span>
            <span className="text-stone-300">
              LINE OA: <strong className="text-white font-bold">@retailspace</strong>
            </span>
            <span className="text-amber-400 font-bold">&bull;</span>
            <span className="text-stone-300">
              สต็อกอัปเดตเรียลไทม์ สอบถามและจองผ่านตะกร้า Inquiry Cart ได้ทันที
            </span>
            <span className="text-amber-400 font-bold">&bull;</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name: Watchara Fusion Society */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform shrink-0 border border-stone-200 bg-white flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Watchara Fusion Society"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-stone-900 tracking-tight text-base sm:text-lg lg:text-xl">
                  Watchara Fusion Society
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-400 font-semibold tracking-wide uppercase -mt-0.5 hidden sm:block">
                Modern Living &amp; Hardware Store
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-stone-600">
            <Link
              href="/"
              className="text-stone-900 hover:text-stone-700 transition-colors py-1 border-b-2 border-stone-900 font-bold"
            >
              หน้าแรก
            </Link>
            <button
              type="button"
              onClick={onScrollToProducts}
              className="hover:text-stone-900 transition-colors py-1 border-b-2 border-transparent hover:border-stone-300 cursor-pointer"
            >
              หมวดหมู่สินค้า
            </button>
            <button
              type="button"
              onClick={onScrollToProducts}
              className="hover:text-stone-900 transition-colors py-1 border-b-2 border-transparent hover:border-stone-300 cursor-pointer"
            >
              สินค้าทั้งหมด
            </button>
            <a
              href="#about-section"
              className="hover:text-stone-900 transition-colors py-1 border-b-2 border-transparent hover:border-stone-300"
            >
              เกี่ยวกับเรา
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Inquiry Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer"
              aria-label="ตะกร้าสอบถามสินค้า"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">ตะกร้าสอบถาม</span>
              <span className="sm:hidden">ตะกร้า</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-stone-900 bg-amber-400 rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Authentication States */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* 1. If Staff -> Link to /staff ONLY (Cannot access /admin) */}
                {role === 'staff' && (
                  <Link
                    href="/staff"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 transition-colors"
                    title="ไปที่ระบบสต็อกพนักงาน"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span className="hidden lg:inline">ระบบสต็อก (Staff)</span>
                    <span className="lg:hidden">Staff</span>
                  </Link>
                )}

                {/* 2. If Admin -> Link to /admin */}
                {role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-colors"
                    title="ไปที่ระบบแอดมิน"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                    <span className="hidden lg:inline">ระบบแอดมิน (Admin)</span>
                    <span className="lg:hidden">Admin</span>
                  </Link>
                )}

                {/* 3. If Customer -> Show Name Pill */}
                {role === 'customer' && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-stone-100 text-stone-800 border border-stone-200">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span className="truncate max-w-[120px]">{profile.full_name}</span>
                  </div>
                )}

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ออกจากระบบ</span>
                </button>
              </div>
            ) : (
              /* If Guest / Not Logged In */
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors cursor-pointer"
                title="เข้าสู่ระบบ"
              >
                <User className="w-3.5 h-3.5 text-stone-600" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top duration-150">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-stone-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-stone-100 text-stone-900 font-bold"
            >
              หน้าแรก
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToProducts?.();
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              หมวดหมู่สินค้า
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToProducts?.();
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              สินค้าทั้งหมด
            </button>
            <a
              href="#about-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              เกี่ยวกับเรา
            </a>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-stone-100 space-y-2">
                {role === 'staff' && (
                  <Link
                    href="/staff"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-blue-50 text-blue-900 font-bold"
                  >
                    เข้าระบบสต็อกพนักงาน (/staff)
                  </Link>
                )}
                {role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-purple-50 text-purple-900 font-bold"
                  >
                    เข้าระบบแอดมิน (/admin)
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-600 font-bold hover:bg-rose-50"
                >
                  ออกจากระบบ ({profile.full_name})
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-stone-900 bg-stone-100 font-bold"
              >
                เข้าสู่ระบบ (Login)
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
