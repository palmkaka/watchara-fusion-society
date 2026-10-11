'use client';

import React from 'react';
import { UserCheck, Shield, User, Info, Lock, Eye, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/context/AuthContext';
import { UserRole } from '../lib/supabase/database.types';

export default function RoleSwitcher() {
  const { role, setRole, profile } = useAuth();

  const rolesConfig: { id: UserRole; label: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'customer',
      label: '1. Customer (Public)',
      icon: User,
      color: 'bg-emerald-500',
      desc: 'มุมมองลูกค้าทั่วไป: ดูสินค้าเฉพาะที่ Active ซ่อนต้นทุนและบันทึกภายใน ใช้งานตะกร้าสอบถามสินค้าได้',
    },
    {
      id: 'staff',
      label: '2. Staff (พนักงาน)',
      icon: UserCheck,
      color: 'bg-blue-600',
      desc: 'มุมมองพนักงาน: ตรวจสอบสต็อกคงเหลือ, ดูต้นทุนสินค้า (Cost Price), บันทึกภายใน (Staff Notes) และกดปรับจำนวนสต็อก (Quick Stock) ได้ทันที',
    },
    {
      id: 'admin',
      label: '3. Admin (ผู้ดูแลระบบ)',
      icon: Shield,
      color: 'bg-purple-600',
      desc: 'มุมมองแอดมิน: สิทธิ์เต็มรูปแบบ CRUD เพิ่ม/แก้ไข/ลบ/ซ่อนสินค้า จัดการหมวดหมู่ไดนามิกในกลุ่ม "อื่นๆ" ได้อิสระ',
    },
  ];

  const currentConfig = rolesConfig.find((r) => r.id === role) || rolesConfig[0];

  return (
    <div className="bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Role selector buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              RBAC Role Switcher:
            </span>
            <div className="inline-flex rounded-lg bg-stone-800/90 p-1 border border-stone-700/60">
              {rolesConfig.map((item) => {
                const Icon = item.icon;
                const isActive = role === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setRole(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-stone-100 text-stone-900 font-semibold shadow-sm'
                        : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-900' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Status Description Banner */}
          <div className="flex items-center gap-2 text-xs text-stone-300 bg-stone-800/50 px-3 py-1 rounded-md border border-stone-700/40">
            <span className={`w-2 h-2 rounded-full ${currentConfig.color} shrink-0`} />
            <span className="font-semibold text-stone-200 shrink-0">{profile.full_name}:</span>
            <span className="text-stone-300 truncate max-w-xl">{currentConfig.desc}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
