'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  Tag,
  Check,
} from 'lucide-react';
import { useStore } from '../lib/context/StoreContext';

export default function CategoryBar() {
  const {
    standardCategories,
    customCategories,
    filters,
    setFilters,
    resetFilters,
    filteredProducts,
    products,
  } = useStore();

  const [isOtherDropdownOpen, setIsOtherDropdownOpen] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const isOtherActive =
    filters.categorySlug === 'other' ||
    customCategories.some((c) => c.slug === filters.categorySlug);

  const selectedCategoryName = () => {
    if (filters.categorySlug === 'all') return 'สินค้าทั้งหมด';
    if (filters.categorySlug === 'other') return 'หมวดหมู่อื่นๆ (ทั้งหมด)';
    const found = [...standardCategories, ...customCategories].find(
      (c) => c.slug === filters.categorySlug
    );
    return found ? found.name : 'หมวดหมู่';
  };

  return (
    <div id="products-catalog" className="bg-white border-b border-stone-200 sticky top-16 sm:top-20 z-20 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Category Navigation Pills */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar flex-1">
            {/* All Products Tab */}
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, categorySlug: 'all' }))}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filters.categorySlug === 'all'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              ทั้งหมด ({products.length})
            </button>

            {/* Standard Fixed Categories */}
            {standardCategories.map((cat) => {
              const isActive = filters.categorySlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, categorySlug: cat.slug }))}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white font-bold shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}

            {/* Dynamic Categories Dropdown ("อื่นๆ") */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOtherDropdownOpen(!isOtherDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                  isOtherActive
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                    : 'bg-stone-100 text-stone-700 border-transparent hover:bg-stone-200'
                }`}
              >
                <span>อื่นๆ</span>
                {customCategories.length > 0 && (
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                    {customCategories.length}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {/* Other categories menu dropdown */}
              {isOtherDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-40 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsOtherDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-stone-100">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      หมวดหมู่ย่อยในกลุ่ม &ldquo;อื่นๆ&rdquo;
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, categorySlug: 'other' }));
                      setIsOtherDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                      filters.categorySlug === 'other' ? 'font-bold text-amber-800 bg-amber-50' : 'text-stone-700'
                    }`}
                  >
                    <span>รวมกลุ่มอื่นๆ ทั้งหมด</span>
                    {filters.categorySlug === 'other' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>

                  {customCategories.map((c) => {
                    const isCurrent = filters.categorySlug === c.slug;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, categorySlug: c.slug }));
                          setIsOtherDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                          isCurrent ? 'font-bold text-amber-800 bg-amber-50' : 'text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Tag className="w-3 h-3 text-stone-400" />
                          <span className="truncate">{c.name}</span>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                showFilterDrawer || filters.inStockOnly || filters.maxPrice < 10000
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ตัวกรอง</span>
              {(filters.inStockOnly || filters.maxPrice < 10000) && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              aria-label="เรียงลำดับสินค้า"
              className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
            >
              <option value="featured">แนะนำ</option>
              <option value="price-asc">ราคา: ต่ำ &rarr; สูง</option>
              <option value="price-desc">ราคา: สูง &rarr; ต่ำ</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilterDrawer && (
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-150">
            {/* Price Range Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-stone-700">
                <span>ราคาสูงสุด:</span>
                <span className="font-bold text-stone-900">
                  ฿{filters.maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
                }
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>฿500</span>
                <span>฿2,500</span>
                <span>฿5,000+</span>
              </div>
            </div>

            {/* In-Stock Only Toggle */}
            <div className="flex flex-col justify-center space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={filters.inStockOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                  }
                  className="w-4 h-4 text-stone-900 rounded border-stone-300 focus:ring-stone-900 cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-stone-700 font-medium cursor-pointer">
                  เฉพาะสินค้าที่มีสต็อกพร้อมส่ง (&gt; 0)
                </label>
              </div>

              {(filters.search || filters.categorySlug !== 'all' || filters.inStockOnly || filters.maxPrice < 10000) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-left text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              )}
            </div>
          </div>
        )}

        {/* Status Line */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-0.5">
          <div>
            หมวดหมู่: <span className="font-semibold text-stone-800">{selectedCategoryName()}</span>
            {filters.search && (
              <span> &bull; ค้นหา &ldquo;<strong className="text-stone-800">{filters.search}</strong>&rdquo;</span>
            )}
          </div>
          <div>
            พบสินค้า <strong className="text-stone-900">{filteredProducts.length}</strong> รายการ
          </div>
        </div>
      </div>
    </div>
  );
}
