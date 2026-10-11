'use client';

import React from 'react';
import { X, History, TrendingUp, TrendingDown, Clock, User, Package } from 'lucide-react';
import { useStore } from '../lib/context/StoreContext';

interface StockLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StockLogsModal({ isOpen, onClose }: StockLogsModalProps) {
  const { stockLogs } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                ประวัติการปรับปรุงสต็อก (Stock Audit Logs)
              </h3>
              <p className="text-xs text-stone-500">
                บันทึกการเปลี่ยนแปลงสต็อกสินค้าโดยพนักงานและผู้ดูแลระบบ
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

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-3">
          {stockLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400 space-y-2">
              <Package className="w-10 h-10 stroke-[1] mx-auto text-stone-300" />
              <p>ยังไม่มีประวัติการปรับสต็อกในรอบนี้</p>
              <p className="text-[11px] text-stone-400">
                เมื่อพนักงานหรือแอดมินกด Quick Stock ปรับเพิ่ม/ลดสินค้า ระบบจะบันทึก Log อัตโนมัติที่นี่
              </p>
            </div>
          ) : (
            stockLogs.map((log) => {
              const isIncrease = log.delta > 0;
              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="font-bold text-stone-900 truncate">
                      {log.product_name || `Product #${log.product_id}`}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {new Date(log.created_at).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 font-medium text-stone-700">
                        <User className="w-3 h-3 text-stone-400" />
                        {log.changed_by_name || 'Staff'}
                      </span>
                    </div>
                    {log.note && (
                      <p className="text-[11px] text-stone-600 italic bg-white/70 px-2 py-0.5 rounded border border-stone-200 inline-block">
                        โน้ต: {log.note}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 font-mono font-bold text-sm">
                      <span className="text-stone-400">{log.previous_stock}</span>
                      <span className="text-stone-300">&rarr;</span>
                      <span className="text-stone-900">{log.new_stock}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                        isIncrease
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.delta < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {isIncrease ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isIncrease ? `+${log.delta}` : log.delta} ชิ้น
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
