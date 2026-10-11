'use client';

import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Tag,
  Package,
  Check,
  MessageCircle,
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '../lib/supabase/database.types';
import { useStore } from '../lib/context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenQuickStock?: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
}: ProductDetailModalProps) {
  const { addToCart } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryQuantity, setInquiryQuantity] = useState(1);
  const [customerNote, setCustomerNote] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 4;

  const handleAddToCart = () => {
    addToCart(product, inquiryQuantity, customerNote);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const handleShareLine = () => {
    const text = `สนใจสอบถามสินค้า:\n${product.name}\nรหัส SKU: ${product.sku || '-'}\nราคา: ฿${product.price.toLocaleString()}\nลิงก์: ${window.location.href}`;
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-stone-100 text-stone-500 hover:text-stone-900 backdrop-blur-sm flex items-center justify-center transition-colors shadow-xs cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Images Column */}
            <div className="space-y-4">
              <div className="aspect-square w-full rounded-2xl bg-stone-100 overflow-hidden border border-stone-200 relative">
                {product.images && product.images[selectedImageIndex] ? (
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <Package className="w-16 h-16 stroke-[1]" />
                  </div>
                )}

                {/* Stock Indicator */}
                <div className="absolute top-3 left-3">
                  {isOutOfStock ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-xs">
                      สินค้าหมด
                    </span>
                  ) : isLowStock ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                      สินค้าใกล้หมด (เหลือ {product.stock_quantity})
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-xs">
                      พร้อมส่ง ({product.stock_quantity} ชิ้น)
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImageIndex === idx ? 'border-stone-900 shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Inquiry Actions */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-100 font-medium text-stone-700">
                    {product.category?.name || 'หมวดหมู่ทั่วไป'}
                  </span>
                  <span className="font-mono">SKU: {product.sku || 'N/A'}</span>
                </div>

                {/* Product Name */}
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  {product.name}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                    ฿{product.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-stone-500">ราคารวมภาษีแล้ว</span>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full"
                      >
                        <Tag className="w-3 h-3 text-stone-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="pt-2 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                    รายละเอียดสินค้า
                  </h4>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                    {product.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                  </p>
                </div>
              </div>

              {/* Inquiry Cart Action Box */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-1">
                    <button
                      type="button"
                      disabled={inquiryQuantity <= 1}
                      onClick={() => setInquiryQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-sm shadow-2xs disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-stone-900 text-sm">
                      {inquiryQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInquiryQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Customer Quick Note */}
                  <input
                    type="text"
                    placeholder="หมายเหตุเพิ่มเติม (ถ้ามี เช่น ขอสีดำ)"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>เพิ่มลงในตะกร้าสอบถามแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <span>ใส่ตะกร้าสอบถาม ({inquiryQuantity} ชิ้น)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareLine}
                    className="px-4 py-3 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="ส่งข้อความถามสินค้านี้ทาง LINE"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>สอบถามทาง LINE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
