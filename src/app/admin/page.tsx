'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  EyeOff,
  Eye,
  History,
  FolderPlus,
  ArrowLeft,
  FileText,
  Minus,
  Plus as PlusIcon,
  LogOut,
  ShieldCheck,
  Lock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';
import { useStore } from '../../lib/context/StoreContext';
import { Product } from '../../lib/supabase/database.types';

import ProductFormModal from '../../components/ProductFormModal';
import CategoryManageModal from '../../components/CategoryManageModal';
import QuickStockModal from '../../components/QuickStockModal';
import StockLogsModal from '../../components/StockLogsModal';

export default function AdminPage() {
  const router = useRouter();
  const { role, isAdmin, isAuthenticated, logout, profile } = useAuth();
  const {
    products,
    categories,
    updateStock,
    toggleProductStatus,
    deleteProduct,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'products'>('inventory');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [quickStockProduct, setQuickStockProduct] = useState<Product | null>(null);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  const [searchFilter, setSearchFilter] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Handle Logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // STRICT ROUTE PROTECTION: Only Admin allowed! Staff cannot access Admin!
  if (!isAuthenticated || !isAdmin) {
    const isStaffUser = isAuthenticated && role === 'staff';

    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 text-stone-900">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-stone-200 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-stone-900">
              {isStaffUser ? 'พนักงานไม่สามารถเข้าถึงหน้าแอดมินได้' : 'พื้นที่เฉพาะผู้ดูแลระบบ (Admin Only)'}
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isStaffUser
                ? 'บัญชีของคุณคือ "พนักงานคลังสินค้า (Staff)" จึงไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าใช้งานที่หน้าระบบสต็อกสำหรับพนักงาน'
                : 'คุณยังไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบ (Admin) เพื่อเข้าใช้งาน'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {isStaffUser ? (
              <Link
                href="/staff"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>ไปที่หน้าระบบสต็อกพนักงาน (/staff) &rarr;</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-purple-800 hover:bg-purple-900 flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>เข้าสู่ระบบเป็นแอดมิน (Admin Login)</span>
              </Link>
            )}

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
      {/* Top Admin Header */}
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
                  WATCHARA BACKOFFICE
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 border border-purple-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin
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

      {/* Main Admin Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500">สินค้าทั้งหมด</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{products.length} รายการ</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-xs font-semibold text-stone-500">หมวดหมู่ทั้งหมด</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{categories.length} หมวด</div>
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
            <span className="text-xs font-bold text-rose-800">สินค้าหมด (0)</span>
            <div className="text-2xl font-black text-rose-900 mt-1">{outOfStockCount} รายการ</div>
          </div>
        </div>

        {/* Toolbar & Actions */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              คลังสินค้า &amp; ต้นทุน (Inventory)
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              จัดการรายการสินค้า (CRUD)
            </button>
          </div>

          {/* Action Buttons (SQL Schema Removed) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsLogsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>ประวัติสต็อก (Logs)</span>
            </button>

            <button
              onClick={() => setIsManageCategoriesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-purple-700" />
              <span>จัดการหมวดหมู่อื่นๆ</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductFormOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มสินค้าใหม่</span>
            </button>
          </div>
        </div>

        {/* Search input for admin */}
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า หรือ SKU ในระบบหลังบ้าน..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full max-w-md px-3.5 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900"
          />
        </div>

        {/* Products Table (Admin Full View) */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="p-3.5">สินค้า</th>
                  <th className="p-3.5">หมวดหมู่ / SKU</th>
                  <th className="p-3.5">ราคาขาย</th>
                  <th className="p-3.5">ราคาทุน</th>
                  <th className="p-3.5">กำไรขั้นต้น</th>
                  <th className="p-3.5">สต็อก</th>
                  <th className="p-3.5">ปรับสต็อกเร็ว</th>
                  <th className="p-3.5 text-right">จัดการสินค้า</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredList.map((product) => {
                  const marginPercent =
                    product.cost_price && product.price
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

                      {/* Quick Stock Controls */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={product.stock_quantity <= 0}
                            onClick={() => updateStock(product.id, product.stock_quantity - 1)}
                            className="w-6 h-6 rounded-md bg-stone-200 hover:bg-stone-300 flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setQuickStockProduct(product)}
                            className="px-2 py-0.5 rounded-md bg-white border border-stone-300 font-mono font-bold text-xs hover:border-stone-900 cursor-pointer"
                            title="คลิกเพื่อระบุตัวเลขโดยตรง"
                          >
                            {product.stock_quantity}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStock(product.id, product.stock_quantity + 1)}
                            className="w-6 h-6 rounded-md bg-stone-200 hover:bg-stone-300 flex items-center justify-center font-bold cursor-pointer"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Admin Full CRUD Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleProductStatus(product.id)}
                            className={`p-1.5 rounded-lg border cursor-pointer ${
                              product.is_active
                                ? 'text-stone-400 hover:text-stone-700 border-stone-200'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                            title={product.is_active ? 'ซ่อนจากหน้าร้าน' : 'แสดงหน้าร้าน'}
                          >
                            {product.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                            title="แก้ไขสินค้า"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`ยืนยันการลบสินค้า "${product.name}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                            title="ลบสินค้า"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modals for Backoffice */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        productToEdit={editingProduct}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditingProduct(null);
        }}
      />

      <CategoryManageModal
        isOpen={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
      />

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
