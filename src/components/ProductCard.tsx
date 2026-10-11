'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Eye,
  Check,
  Package
} from 'lucide-react';
import { Product } from '../lib/supabase/database.types';
import { useStore } from '../lib/context/StoreContext';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetail,
}: ProductCardProps) {
  const { addToCart } = useStore();
  const [justAddedToCart, setJustAddedToCart] = useState(false);

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 4;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAddedToCart(true);
    setTimeout(() => setJustAddedToCart(false), 1200);
  };

  return (
    <div
      onClick={() => onViewDetail(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 hover:border-stone-400 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
    >
      {/* Product Image Box */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden shrink-0">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            <Package className="w-12 h-12 stroke-[1.2]" />
          </div>
        )}

        {/* Category Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          {product.category && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-stone-900/85 backdrop-blur-sm text-white shadow-xs">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Stock Badge (Top Right) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
              สินค้าหมด
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
              เหลือเพียง {product.stock_quantity} ชิ้น
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
              พร้อมส่ง ({product.stock_quantity})
            </span>
          )}
        </div>

        {/* Hover Quick View Trigger Overlay */}
        <div className="absolute inset-0 bg-stone-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-stone-900 text-xs font-bold shadow-md backdrop-blur-xs flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            ดูรายละเอียด
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          {/* SKU & Tags */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>SKU: {product.sku || 'N/A'}</span>
            {product.tags && product.tags.length > 0 && (
              <span className="text-stone-500 font-sans truncate max-w-[80px]">
                #{product.tags[0]}
              </span>
            )}
          </div>

          {/* Product Title (Strict 2-line height for clean grid alignment) */}
          <h3 className="font-bold text-stone-900 text-xs sm:text-sm leading-snug line-clamp-2 h-9 sm:h-10 group-hover:text-stone-700 transition-colors">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-1 leading-relaxed">
            {product.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
          </p>
        </div>

        {/* Bottom Price & Customer Inquiry Button */}
        <div className="pt-2.5 flex items-center justify-between gap-2 border-t border-stone-100 mt-auto">
          <div>
            <div className="text-[10px] text-stone-400 font-medium">ราคา</div>
            <div className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight">
              ฿{product.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Customer Add to Inquiry Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              justAddedToCart
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs active:scale-95'
            }`}
          >
            {justAddedToCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">เพิ่มแล้ว!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>สอบถาม</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
