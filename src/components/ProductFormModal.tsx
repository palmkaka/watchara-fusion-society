'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Image as ImageIcon, Tag, FileText, Check } from 'lucide-react';
import { Product } from '../lib/supabase/database.types';
import { useStore } from '../lib/context/StoreContext';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
}

export default function ProductFormModal({
  isOpen,
  productToEdit,
  onClose,
}: ProductFormModalProps) {
  const { categories, addProduct, editProduct } = useStore();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku || '');
      setCategoryId(productToEdit.category_id || categories[0]?.id || '');
      setPrice(productToEdit.price);
      setCostPrice(productToEdit.cost_price || 0);
      setStockQuantity(productToEdit.stock_quantity);
      setDescription(productToEdit.description || '');
      setImageUrl(productToEdit.images?.[0] || '');
      setTagsString(productToEdit.tags?.join(', ') || '');
      setStaffNotes(productToEdit.staff_notes || '');
      setIsActive(productToEdit.is_active);
    } else {
      // Default reset
      setName('');
      setSku('SKU-' + Math.floor(1000 + Math.random() * 9000));
      setCategoryId(categories[0]?.id || '');
      setPrice(990);
      setCostPrice(450);
      setStockQuantity(15);
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80');
      setTagsString('พรีเมียม, สินค้าใหม่');
      setStaffNotes('สั่งสินค้าล็อตใหม่เข้ามา จัดเก็บที่เชลฟ์ A-01');
      setIsActive(true);
    }
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณาระบุชื่อสินค้า');
      return;
    }

    setIsSubmitting(true);
    const tagsArray = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const imagesArray = imageUrl.trim() ? [imageUrl.trim()] : [];

    if (productToEdit) {
      await editProduct(productToEdit.id, {
        name: name.trim(),
        sku: sku.trim() || null,
        category_id: categoryId || null,
        price,
        cost_price: costPrice,
        stock_quantity: stockQuantity,
        description: description.trim() || null,
        images: imagesArray,
        tags: tagsArray,
        staff_notes: staffNotes.trim() || null,
        is_active: isActive,
      });
    } else {
      await addProduct({
        name: name.trim(),
        sku: sku.trim() || null,
        category_id: categoryId || null,
        price,
        cost_price: costPrice,
        stock_quantity: stockQuantity,
        description: description.trim() || null,
        images: imagesArray,
        tags: tagsArray,
        staff_notes: staffNotes.trim() || null,
        is_active: isActive,
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-bold text-stone-900 text-base">
              {productToEdit ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่ในระบบ'}
            </h3>
            <p className="text-xs text-stone-500">
              จัดการรายละเอียดสินค้า สเปก ต้นทุน และบันทึกภายใน
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-700">ชื่อสินค้า *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น ชุดกระทะเคลือบหินอ่อน 24 ซม."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* SKU */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">รหัส SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="เช่น KW-PAN-01"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">หมวดหมู่สินค้า *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.is_custom ? '(กลุ่มอื่นๆ)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Price (Customer) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">
                ราคาขายหน้าร้าน (฿) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-mono font-bold px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Cost Price (Internal) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                <span>ราคาทุนสินค้า (฿) (ภายใน)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50/50 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Initial Stock */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">จำนวนสต็อก *</label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="productActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-stone-900 rounded border-stone-300 focus:ring-stone-900"
              />
              <label htmlFor="productActive" className="text-xs font-semibold text-stone-700 cursor-pointer">
                เปิดแสดงผลหน้าร้าน (Active)
              </label>
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-700">ลิงก์รูปภาพ (Image URL)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Tags */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-700">แท็ก (คั่นด้วยจุลภาค)</label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="เช่น เครื่องครัว, สแตนเลส, มินิมอล"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-stone-700">รายละเอียดสินค้า</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รายละเอียดคุณสมบัติ ขนาด วัสดุ และการใช้งาน..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Staff Notes (Internal) */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>บันทึกภายในสำหรับพนักงาน (Staff Notes)</span>
              </label>
              <textarea
                rows={2}
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="ข้อมูลซัพพลายเออร์, ตำแหน่งเชลฟ์, เงื่อนไขเคลม..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50/50 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{productToEdit ? 'บันทึกการแก้ไข' : 'บันทึกเพิ่มสินค้า'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
