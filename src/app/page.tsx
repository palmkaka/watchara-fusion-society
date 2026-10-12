'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import RetailHero from '../components/RetailHero';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import InquiryCartDrawer from '../components/InquiryCartDrawer';

import { useStore } from '../lib/context/StoreContext';
import { Product } from '../lib/supabase/database.types';

import {
  Package,
  PhoneCall,
  Mail,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { filteredProducts, resetFilters } = useStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const scrollToProducts = () => {
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900">
      {/* 1. Production Customer Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onScrollToProducts={scrollToProducts}
      />

      {/* 2. Retail Hero Section */}
      <RetailHero onSearchFocus={scrollToProducts} />

      {/* 3. Category & Filter Navigation Bar */}
      <CategoryBar />

      {/* 4. Main Product Catalog Grid (Clean Layout: 2 cols mobile, 4 cols desktop) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
            <Package className="w-12 h-12 stroke-[1] text-stone-300" />
            <h3 className="text-base font-bold text-stone-800">
              ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
            </h3>
            <p className="text-xs text-stone-500 max-w-sm">
              ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูรายการสินค้าทั้งหมด
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              ล้างตัวกรองและแสดงสินค้าทั้งหมด
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={(p) => setViewingProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Production Retail Footer */}
      <footer id="about-section" className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Store Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-white text-lg tracking-tight">
                  Watchara Fusion Society
                </span>
              </div>
              <p className="text-xs leading-relaxed text-stone-400">
                ศูนย์รวมอุปกรณ์เครื่องใช้ ของแต่งบ้าน เครื่องมือช่าง และแกดเจ็ตคุณภาพสูง
                มุ่งมั่นส่งมอบสินค้าที่ตอบโจทย์ชีวิตที่เรียบง่ายและทันสมัย
              </p>
            </div>

            {/* Customer Care */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                บริการลูกค้า
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li>&bull; วิธีสั่งซื้อผ่าน Inquiry Cart</li>
                <li>&bull; การจัดส่งและตรวจสอบสถานะพัสดุ</li>
                <li>&bull; การรับประกันและนโยบายเปลี่ยนคืน</li>
                <li>&bull; ขอใบกำกับภาษีเต็มรูปแบบ</li>
              </ul>
            </div>

            {/* Contact Channels */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                ติดต่อเรา
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>โทร: 02-123-4567 (ทุกวัน 09:00 - 18:00)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>อีเมล: contact@watcharafusion.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>LINE Official: @retailspace</span>
                </li>
              </ul>
            </div>

            {/* Store Hours & Staff Access Link */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                สำหรับเจ้าหน้าที่
              </h4>
              <p className="text-[11px] text-stone-400">
                ระบบจัดการสต็อกสินค้า ต้นทุน และข้อมูลหลังบ้านสำหรับพนักงาน
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>เข้าสู่ระบบหลังบ้าน (Staff/Admin) &rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div>&copy; 2026 Watchara Fusion Society Co., Ltd. สงวนลิขสิทธิ์ทุกประการ</div>
            <div className="flex items-center gap-4">
              <span>นโยบายความเป็นส่วนตัว</span>
              <span>&bull;</span>
              <span>ข้อกำหนดการใช้งาน</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 6. Customer Interactive Modals */}
      <ProductDetailModal
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
      />

      <InquiryCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
