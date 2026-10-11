'use client';

import React from 'react';
import { Search, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { useStore } from '../lib/context/StoreContext';

interface RetailHeroProps {
  onSearchFocus?: () => void;
}

export default function RetailHero({ onSearchFocus }: RetailHeroProps) {
  const { filters, setFilters } = useStore();

  const quickKeywords = ['เครื่องครัว', 'สว่านไร้สาย', 'กระทะ', 'มินิมอล', 'Smart Home', 'แต่งสวน'];

  return (
    <section className="relative bg-gradient-to-b from-stone-100 via-stone-50 to-[#fafaf9] border-b border-stone-200/80 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-stone-200/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 relative">
        <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Slogan - เคาะเว้นระยะห่างบรรทัดสวยงาม ไม่ตัดคำเศษ */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-stone-900 tracking-normal leading-[1.3] sm:leading-[1.35] space-y-3 sm:space-y-4">
            <span className="block">คัดสรรของใช้คุณภาพ</span>
            <span className="block text-stone-800">เพื่อบ้านและการใช้ชีวิตที่เรียบง่าย</span>
          </h1>

          {/* Subtitle with spacious separation */}
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed sm:leading-loose max-w-2xl mx-auto pt-1 sm:pt-2">
            ศูนย์รวมอุปกรณ์เครื่องครัว ของแต่งบ้าน เครื่องมือช่าง และแกดเจ็ตไลฟ์สไตล์ 
            มาตรฐานพรีเมียม สต็อกพร้อมส่งจริง สอบถามและสั่งซื้อง่ายผ่านระบบ Inquiry Cart
          </p>

          {/* Large Hero Search Box */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative shadow-md rounded-2xl bg-white border border-stone-300 focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all">
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหาสินค้า เช่น ชุดมีดทำครัว, สว่านกระแทก, โคมไฟมินิมอล..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                onFocus={onSearchFocus}
                className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base text-stone-900 placeholder-stone-400 rounded-2xl bg-transparent focus:outline-none"
              />
            </div>

            {/* Quick search chips */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-3.5 text-xs text-stone-500">
              <span className="font-semibold text-stone-400">ค้นหายอดนิยม:</span>
              {quickKeywords.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, search: kw }))}
                  className="px-2.5 py-1 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 font-medium transition-colors cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Value Propositions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 sm:pt-16 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-stone-200/80 flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">สต็อกพร้อมส่งจริง</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">อัปเดตเรียลไทม์ ตรวจสอบได้ทันที</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-stone-200/80 flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">สินค้าคัดเกรดคุณภาพ</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">รับประกันสินค้า และดูแลหลังการขาย</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-stone-200/80 flex items-center gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">สอบถาม &amp; จองสะดวกรวดเร็ว</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">สรุปยอดส่งทาง LINE / Chat ทันที</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
