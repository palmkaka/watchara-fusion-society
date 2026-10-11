'use client';

import React, { useState } from 'react';
import { X, Package, Save, Plus, Minus, AlertCircle } from 'lucide-react';
import { Product } from '../lib/supabase/database.types';
import { useStore } from '../lib/context/StoreContext';

interface QuickStockModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickStockModal({ product, onClose }: QuickStockModalProps) {
  const { updateStock } = useStore();

  const [quantity, setQuantity] = useState<number>(product?.stock_quantity ?? 0);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const handleAdjust = (delta: number) => {
    setQuantity((prev) => Math.max(0, prev + delta));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateStock(product.id, quantity, note.trim() || undefined);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-stone-700" />
            <h3 className="font-bold text-stone-900 text-sm">Quick Stock Update</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-stone-900 truncate">{product.name}</h4>
            <p className="text-[11px] text-stone-400 font-mono">SKU: {product.sku || 'N/A'}</p>
          </div>

          {/* Stepper & Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700">จำนวนสต็อกคงเหลือ:</label>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjust(-5)}
                className="px-2.5 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleAdjust(-1)}
                className="p-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 text-center font-mono font-bold text-lg py-1.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900"
              />

              <button
                type="button"
                onClick={() => handleAdjust(1)}
                className="p-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAdjust(5)}
                className="px-2.5 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                +5
              </button>
            </div>
          </div>

          {/* Reason / Note */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-600">
              บันทึกเหตุผลการปรับสต็อก (Staff Note):
            </label>
            <input
              type="text"
              placeholder="เช่น รับของเข้าเพิ่ม, ตรวจนับประจำเดือน, ของชำรุด"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>บันทึกสต็อก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
