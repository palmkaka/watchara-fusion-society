'use client';

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Copy,
  Check,
  MessageCircle,
  PhoneCall,
  Send,
  ShoppingBag,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useStore } from '../lib/context/StoreContext';

interface InquiryCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryCartDrawer({ isOpen, onClose }: InquiryCartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartCount, cartTotalEstimate } =
    useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerChannel, setCustomerChannel] = useState<'line' | 'whatsapp' | 'phone'>('line');
  const [generalNote, setGeneralNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate clean formatted text summary
  const generateSummaryText = () => {
    const lines = [
      `🛒 [ใบสอบถามและจองสินค้า - Watchara Fusion Society]`,
      `---------------------------------------`,
      `👤 ข้อมูลลูกค้า:`,
      `• ชื่อ: ${customerName.trim() || 'ไม่ได้ระบุ'}`,
      `• เบอร์โทร/LINE: ${customerPhone.trim() || 'ไม่ได้ระบุ'}`,
      `• ช่องทางสะดวก: ${customerChannel.toUpperCase()}`,
      ...(generalNote.trim() ? [`• หมายเหตุ: ${generalNote.trim()}`] : []),
      `---------------------------------------`,
      `📦 รายการสินค้าที่สนใจ (${cartCount} ชิ้น):`,
    ];

    cart.forEach((item, idx) => {
      lines.push(
        `${idx + 1}. ${item.product.name}`,
        `   รหัส SKU: ${item.product.sku || '-'}`,
        `   จำนวน: ${item.quantity} ชิ้น | ราคา: ฿${(item.product.price * item.quantity).toLocaleString()}`,
        ...(item.customerNote ? [`   โน้ต: ${item.customerNote}`] : [])
      );
    });

    lines.push(
      `---------------------------------------`,
      `💰 ประเมินยอดรวม: ฿${cartTotalEstimate.toLocaleString()} บาท`,
      `📅 วันที่: ${new Date().toLocaleDateString('th-TH')}`,
      `---------------------------------------`,
      `รบกวนเจ้าหน้าที่ตรวจสอบสต็อกและยืนยันยอดด้วยครับ/ค่ะ ขอบคุณครับ`
    );

    return lines.join('\n');
  };

  const handleCopyText = async () => {
    const text = generateSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('คัดลอกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleSendLine = () => {
    const text = generateSummaryText();
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSendWhatsApp = () => {
    const text = generateSummaryText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleSubmitOnline = () => {
    const randomId = 'INQ-' + Math.floor(100000 + Math.random() * 900000);
    setSubmittedInquiryId(randomId);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">ตะกร้าสอบถามสินค้า</h3>
                <p className="text-xs text-stone-500">
                  {cart.length > 0 ? `${cartCount} ชิ้นในรายการ` : 'ยังไม่มีสินค้า'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-200/70 text-stone-500 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen after submission */}
          {submittedInquiryId ? (
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-stone-900">ส่งใบสอบถามสำเร็จ!</h4>
                <p className="text-xs text-stone-500 font-mono">
                  รหัสอ้างอิง: <span className="font-bold text-stone-900">{submittedInquiryId}</span>
                </p>
                <p className="text-xs text-stone-600 max-w-xs pt-2">
                  เจ้าหน้าที่จะติดต่อกลับตามข้อมูลที่ท่านระบุไว้โดยเร็วที่สุด
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmittedInquiryId(null);
                  onClose();
                }}
                className="px-6 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                เสร็จสิ้น / กลับสู่หน้าร้าน
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-3 py-12">
                    <ShoppingBag className="w-12 h-12 stroke-[1]" />
                    <p className="text-xs text-stone-500">ยังไม่มีสินค้าในตะกร้าสอบถาม</p>
                    <button
                      onClick={onClose}
                      className="text-xs font-semibold text-stone-900 underline underline-offset-4"
                    >
                      เลือกดูสินค้าหน้าร้าน
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col gap-2.5"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={item.product.images?.[0] || ''}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-cover bg-stone-200 shrink-0 border border-stone-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] text-stone-400 font-mono">
                            SKU: {item.product.sku || '-'}
                          </p>
                          <div className="text-xs font-bold text-stone-800 pt-0.5">
                            ฿{(item.product.price * item.quantity).toLocaleString()}
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                          title="ลบรายการ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stepper + Item Note */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
                        <div className="flex items-center rounded-lg border border-stone-200 bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-stone-600 hover:bg-stone-100 rounded-l-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono font-bold text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-stone-600 hover:bg-stone-100 rounded-r-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {item.customerNote && (
                          <span className="text-[11px] text-stone-500 italic truncate max-w-[180px]">
                            โน้ต: {item.customerNote}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Inquiry Submission & Summary Form */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-stone-200 bg-stone-50/70 space-y-3.5">
                  {/* Estimated Total */}
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-stone-500">ยอดรวมประเมิน ({cartCount} ชิ้น)</span>
                    <span className="text-base font-extrabold text-stone-900">
                      ฿{cartTotalEstimate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Customer Information Inputs */}
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="ชื่อของคุณ *"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="text-xs px-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                      <input
                        type="text"
                        placeholder="เบอร์โทร / LINE ID *"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="text-xs px-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="หมายเหตุเพิ่มเติมถึงร้านค้า..."
                      value={generalNote}
                      onChange={(e) => setGeneralNote(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  {/* Share & Export Buttons */}
                  <div className="space-y-2 pt-1">
                    {/* Copy Text Summary (Most popular in retail) */}
                    <button
                      onClick={handleCopyText}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                        copied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-900 shadow-xs'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>คัดลอกข้อความสรุปเรียบร้อยแล้ว! (พร้อมส่งแชท)</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>คัดลอกข้อความสรุปเพื่อส่งแชท (Copy Summary)</span>
                        </>
                      )}
                    </button>

                    {/* Social Direct Links */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleSendLine}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ส่งผ่าน LINE</span>
                      </button>

                      <button
                        onClick={handleSendWhatsApp}
                        className="py-2 px-3 rounded-xl text-xs font-semibold bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-green-600" />
                        <span>ส่งผ่าน WhatsApp</span>
                      </button>
                    </div>

                    <button
                      onClick={handleSubmitOnline}
                      className="w-full py-2 px-3 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                    >
                      หรือ ส่งใบสอบถามเข้าระบบออนไลน์โดยตรง
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
