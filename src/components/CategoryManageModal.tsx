'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  FolderPlus,
  Lock,
  Tag,
  Check,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../lib/context/StoreContext';
import { Category } from '../lib/supabase/database.types';

interface CategoryManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryManageModal({ isOpen, onClose }: CategoryManageModalProps) {
  const { categories, addCategory, editCategory, deleteCategory } = useStore();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    await addCategory(newCategoryName.trim(), newCategoryDesc.trim());
    setNewCategoryName('');
    setNewCategoryDesc('');
    setIsSubmitting(false);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingName.trim()) return;
    await editCategory(id, { name: editingName.trim() });
    setEditingCatId(null);
  };

  const handleDelete = async (cat: Category) => {
    if (confirm(`คุณต้องการลบหมวดหมู่ "${cat.name}" ใช่หรือไม่?`)) {
      await deleteCategory(cat.id);
    }
  };

  const coreCategories = categories.filter((c) => !c.is_custom);
  const customCategories = categories.filter((c) => c.is_custom);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-purple-700" />
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                จัดการหมวดหมู่ไดนามิก (กลุ่ม "อื่นๆ")
              </h3>
              <p className="text-xs text-stone-500">
                เพิ่ม แก้ไข หรือลบหมวดหมู่ย่อยได้อย่างอิสระ
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

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Add New Custom Category Form */}
          <form
            onSubmit={handleCreate}
            className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-3"
          >
            <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-purple-700" />
              สร้างหมวดหมู่ย่อยใหม่ในกลุ่ม "อื่นๆ"
            </h4>

            <div className="space-y-2">
              <input
                type="text"
                required
                placeholder="ชื่อหมวดหมู่ (เช่น อุปกรณ์แคมป์ปิ้ง, สินค้า DIY)..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-700"
              />
              <input
                type="text"
                placeholder="คำอธิบายหมวดหมู่ (ตัวเลือก)..."
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-700"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newCategoryName.trim()}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>สร้างหมวดหมู่ย่อย</span>
              </button>
            </div>
          </form>

          {/* Dynamic Categories List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              หมวดหมู่ย่อยที่เพิ่มเอง (Dynamic Categories) ({customCategories.length})
            </h4>

            {customCategories.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
                ยังไม่มีหมวดหมู่ไดนามิกที่เพิ่มเอง สามารถเพิ่มได้ที่ช่องด้านบน
              </div>
            ) : (
              <div className="space-y-2">
                {customCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      {editingCatId === cat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-stone-900"
                          />
                          <button
                            onClick={() => handleSaveEdit(cat.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCatId(null)}
                            className="p-1 text-stone-400 hover:bg-stone-200 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-purple-600" />
                            <span>{cat.name}</span>
                            <span className="text-[10px] font-mono text-stone-400">
                              (slug: {cat.slug})
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded-lg transition-colors"
                        title="แก้ไขชื่อ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="ลบหมวดหมู่นี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core Categories List (Locked / Read-only) */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              หมวดหมู่หลักประจำระบบ (Core Categories - ล็อกโครงสร้าง)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {coreCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-100/70 text-xs flex items-center justify-between text-stone-700"
                >
                  <span className="font-medium truncate">{cat.name}</span>
                  <span className="text-[10px] text-stone-400 font-mono">#{cat.display_order}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
