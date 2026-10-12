'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  AlertTriangle,
  History,
  ArrowLeft,
  FileText,
  Minus,
  Plus,
  LogOut,
  UserCheck,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';
import { useStore } from '../../lib/context/StoreContext';
import { Product } from '../../lib/supabase/database.types';

import QuickStockModal from '../../components/QuickStockModal';
import StockLogsModal from '../../components/StockLogsModal';

export default function StaffPage() {
  const router = useRouter();
  const { role, isStaff, isAuthenticated, logout, profile } = useAuth();
  const { products, updateStock } = useStore();

  const [quickStockProduct, setQuickStockProduct] = useState<Product | null>(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  const [searchFilter, setSearchFilter] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Handle Logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // ROUTE PROTECTION: Only authenticated Staff or Admin can access
  if (!isAuthenticated || !isStaff) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 text-stone-900">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-stone-200 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-stone-900">
              พื้นที่เฉพาะพนักงานคลังสินค้า (Staff Only)
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              คุณยังไม่ได้เข้าสู่ระบบ หรือบัญชีปัจจุบันไม่มีสิทธิ์พนักงาน
              กรุณาเข้าสู่ระบบด้วยบัญชีพนักงาน (Staff)
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>เข้าสู่ระบบพนักงาน (Staff Login)</span>
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับไปยังหน้าร้านค้าปลีก</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lowStockCount = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 4).length;
  const outOfStockCount = products.filter((p) => p.stock_quantity <= 0).length;

  const filteredList = products.filter((p) => {
    if (filterLowStock && (p.stock_quantity > 4 || p.stock_quantity === 0)) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      {/* Top Staff Header */}
      <header className="bg-stone-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ดูหน้าร้าน</span>
              </Link>
              <div className="h-4 w-px bg-stone-700 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">
                  RETAIL SPACE INVENTORY
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-900 text-blue-200 border border-blue-700 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Staff Portal (ระบบสต็อกพนักงาน)
                </span>
              </div>
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden md:inline text-xs text-stone-300 font-medium">
                {profile.full_name}
              </span>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800 transition-colors cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Staff Inventory Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500">สินค้าในคลังทั้งหมด</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{products.length} รายการ</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500">สถานะการทำงาน</span>
            <div className="text-sm font-bold text-emerald-700 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              พร้อมอัปเดตสต็อกเรียลไทม์
            </div>
          </div>

          <div
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`p-4 rounded-2xl border shadow-2xs cursor-pointer transition-all ${
              filterLowStock
                ? 'bg-amber-100 border-amber-400'
                : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800">สต็อกใกล้หมด (&le;4)</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-900 mt-1">{lowStockCount} รายการ</div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800">สินค้าหมด (0)</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-900 mt-1">{outOfStockCount} รายการ</div>
          </div>
        </div>

        {/* Action Bar for Staff */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              รายการสต็อกสินค้าและต้นทุน (Inventory Quick Adjust)
            </h3>
            <p className="text-xs text-stone-500">
              พนักงานสามารถตรวจสอบราคาทุน บันทึกภายใน และกดเพิ่ม/ลดจำนวนสต็อกได้ทันที
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLogsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>ประวัติการปรับสต็อก (Stock Logs)</span>
            </button>
          </div>
        </div>

        {/* Search input for Staff */}
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า หรือ SKU ในระบบสต็อก..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full max-w-md px-3.5 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
          {filterLowStock && (
            <button
              onClick={() => setFilterLowStock(false)}
              className="text-xs text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
            >
              แสดงเฉพาะสต็อกใกล้หมด (คลิกเพื่อยกเลิก)
            </button>
          )}
        </div>

        {/* Products Table (Staff view: Inventory + Cost + Notes + Quick Stock ONLY. NO CRUD, NO ADMIN ACTIONS) */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">รูป &amp; สินค้า</th>
                  <th className="p-3.5">หมวดหมู่ / SKU</th>
                  <th className="p-3.5">ราคาขาย</th>
                  <th className="p-3.5">ราคาทุน (Cost Price)</th>
                  <th className="p-3.5">กำไร (%)</th>
                  <th className="p-3.5">สต็อกคงเหลือ</th>
                  <th className="p-3.5 text-right">Quick Stock Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredList.map((product) => {
                  const marginPercent =
                    product.cost_price && product.price > 0
                      ? Math.round(((product.price - product.cost_price) / product.price) * 100)
                      : null;

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Name & Image */}
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={product.images?.[0] || ''}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-stone-900 truncate">{product.name}</div>
                          {product.staff_notes && (
                            <div className="text-[11px] text-amber-700 italic truncate flex items-center gap-1 mt-0.5">
                              <FileText className="w-3 h-3 shrink-0" />
                              <span>{product.staff_notes}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Category & SKU */}
                      <td className="p-3.5 font-mono">
                        <span className="font-sans font-semibold text-stone-700 block">
                          {product.category?.name || '-'}
                        </span>
                        <span className="text-stone-400 text-[11px]">SKU: {product.sku || '-'}</span>
                      </td>

                      {/* Selling Price */}
                      <td className="p-3.5 font-bold text-stone-900 font-mono">
                        ฿{product.price.toLocaleString()}
                      </td>

                      {/* Cost Price */}
                      <td className="p-3.5 font-mono text-amber-900 bg-amber-50/40 font-semibold">
                        ฿{product.cost_price?.toLocaleString() || '0'}
                      </td>

                      {/* Margin % */}
                      <td className="p-3.5 font-mono font-bold text-emerald-700">
                        {marginPercent !== null ? '+' + marginPercent + '%' : '-'}
                      </td>

                      {/* Stock Quantity */}
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                            product.stock_quantity <= 0
                              ? 'bg-rose-100 text-rose-800'
                              : product.stock_quantity <= 4
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.stock_quantity} ชิ้น
                        </span>
                      </td>

                      {/* Quick Stock Controls for Staff */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={product.stock_quantity <= 0}
                            onClick={() => updateStock(product.id, product.stock_quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer"
                            title="ลดสต็อก 1 ชิ้น"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuickStockProduct(product)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 font-mono font-bold text-xs hover:border-stone-900 cursor-pointer"
                            title="คลิกเพื่อระบุตัวเลขโดยตรง"
                          >
                            {product.stock_quantity}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStock(product.id, product.stock_quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-stone-200 hover:bg-stone-300 flex items-center justify-center font-bold cursor-pointer"
                            title="เพิ่มสต็อก 1 ชิ้น"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Quick Stock & Logs Modals */}
      <QuickStockModal
        product={quickStockProduct}
        onClose={() => setQuickStockProduct(null)}
      />

      <StockLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
      />
    </div>
  );
}
