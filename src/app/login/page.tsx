'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  ShieldCheck,
  Package,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../lib/context/AuthContext';
import { UserRole } from '../../lib/supabase/database.types';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, register } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & Modals
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Handle Login
  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('กรุณากรอกอีเมล');
      return;
    }

    setIsLoading(true);
    const result = loginWithCredentials(loginEmail, loginPassword);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      return;
    }

    // Success -> redirect according to role
    setSuccessMessage('เข้าสู่ระบบสำเร็จ กำลังนำท่านเข้าสู่ระบบ...');
    setTimeout(() => {
      if (result.role === 'admin') {
        router.push('/admin');
      } else if (result.role === 'staff') {
        router.push('/staff');
      } else {
        router.push('/');
      }
    }, 400);
  };

  // 2. Handle Register (ต้องสมัครสมาชิกก่อนใช้งาน)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('กรุณากรอกชื่อ-นามสกุล');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('กรุณากรอกอีเมล');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setIsLoading(true);
    const result = register({
      email: regEmail,
      password: regPassword,
      full_name: regName,
      phone: regPhone,
      role: regRole,
    });
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      return;
    }

    // Success registration
    setSuccessMessage(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${regName}`);
    setTimeout(() => {
      if (result.role === 'admin') {
        router.push('/admin');
      } else if (result.role === 'staff') {
        router.push('/staff');
      } else {
        router.push('/');
      }
    }, 500);
  };

  // Autofill Demo Account Helper
  const handleAutofill = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-stone-900 font-sans">
      {/* Top Back Link & Logo */}
      <div className="w-full max-w-[440px] mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปยังหน้าร้านค้าปลีก</span>
        </Link>
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
          WATCHARA FUSION SOCIETY
        </span>
      </div>

      {/* Main Login / Register Card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-stone-200/60 border border-stone-200 transition-all">
        {/* Header with Watchara Fusion Logo */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
            {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </h1>
          <p className="text-xs sm:text-[13px] text-stone-500 font-medium">
            {mode === 'login'
              ? 'กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ Watchara Fusion Society'
              : 'กรุณากรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้งานใหม่'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              {errorMessage.includes('สมัครสมาชิก') && mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setMode('register');
                  }}
                  className="block mt-1 text-stone-900 font-bold underline cursor-pointer"
                >
                  คลิกที่นี่เพื่อสมัครสมาชิกทันที &rarr;
                </button>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 block">
                อีเมล
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 stroke-[2]" />
                <input
                  type="email"
                  id="login-email"
                  placeholder="admin@retailspace.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-sm rounded-2xl bg-white border border-stone-300 focus:border-stone-900 focus:ring-4 focus:ring-stone-900/10 focus:outline-none text-stone-900 placeholder:text-stone-400 font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 block">
                  รหัสผ่าน
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 stroke-[2]" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  id="login-password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-12 pr-11 py-3.5 text-sm rounded-2xl bg-stone-50/70 border border-stone-300 focus:bg-white focus:border-stone-900 focus:ring-4 focus:ring-stone-900/10 focus:outline-none text-stone-900 placeholder:text-stone-400 font-medium transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-stone-900/20 transition-all cursor-pointer disabled:opacity-60"
            >
              <span>เข้าสู่ระบบ</span>
              <ArrowRight className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Register Link (ต้องสมัครสมาชิกก่อนใช้งาน) */}
            <div className="text-center pt-1 text-xs text-stone-600 font-medium">
              <span>ยังไม่มีบัญชี? </span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setMode('register');
                }}
                className="font-bold text-stone-900 hover:text-stone-700 underline underline-offset-2 cursor-pointer transition-colors"
              >
                สมัครสมาชิกก่อนใช้งาน
              </button>
            </div>

            {/* Divider */}
            <div className="relative pt-4 pb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-3 bg-white text-stone-400 font-bold uppercase tracking-wider">
                  บัญชีสำหรับทดสอบระบบ (DEMO)
                </span>
              </div>
            </div>

            {/* DEMO ACCOUNTS Container */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center space-y-3">
              <div className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">
                DEMO ACCOUNTS
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Admin Chip */}
                <button
                  type="button"
                  onClick={() => handleAutofill('admin@retailspace.com', 'Retail123!')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700 shadow-2xs transition-all cursor-pointer hover:border-purple-400"
                  title="คลิกเพื่อเลือกบัญชี Admin"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Admin: <strong className="font-bold text-stone-900">admin@retailspace.com</strong></span>
                </button>

                {/* Staff Chip */}
                <button
                  type="button"
                  onClick={() => handleAutofill('staff@retailspace.com', 'Retail123!')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700 shadow-2xs transition-all cursor-pointer hover:border-blue-400"
                  title="คลิกเพื่อเลือกบัญชี Staff"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Staff: <strong className="font-bold text-stone-900">staff@retailspace.com</strong></span>
                </button>
              </div>

              {/* Customer Chip */}
              <div>
                <button
                  type="button"
                  onClick={() => handleAutofill('customer@retailspace.com', 'Retail123!')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700 shadow-2xs transition-all cursor-pointer hover:border-stone-400"
                  title="คลิกเพื่อเลือกบัญชี Customer"
                >
                  <span className="w-2 h-2 rounded-full bg-stone-500" />
                  <span>Customer: <strong className="font-bold text-stone-900">customer@retailspace.com</strong></span>
                </button>
              </div>

              {/* Password Pill */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setLoginPassword('Retail123!')}
                  className="inline-block px-3 py-1 rounded-xl bg-stone-200/80 hover:bg-stone-200 text-stone-700 text-xs font-mono font-bold cursor-pointer transition-colors"
                  title="คลิกเพื่อกรอกรหัสผ่านนี้"
                >
                  Password: Retail123!
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* MODE 2: REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                ชื่อ - นามสกุล <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="เช่น สมศักดิ์ มั่งคั่ง"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-stone-50/70 border border-stone-300 focus:bg-white focus:border-stone-900 focus:outline-none text-stone-900 font-medium"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                อีเมล <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-stone-50/70 border border-stone-300 focus:bg-white focus:border-stone-900 focus:outline-none text-stone-900 font-medium"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                เบอร์โทรศัพท์ (ไม่บังคับ)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="08X-XXX-XXXX"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-stone-50/70 border border-stone-300 focus:bg-white focus:border-stone-900 focus:outline-none text-stone-900 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-stone-50/70 border border-stone-300 focus:bg-white focus:border-stone-900 focus:outline-none text-stone-900 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 p-1 cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-800 block">
                ยืนยันรหัสผ่าน <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-stone-50/70 border border-stone-300 focus:bg-white focus:border-stone-900 focus:outline-none text-stone-900 font-medium"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-stone-800 block">
                เลือกระดับบทบาทการใช้งาน
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setRegRole('customer')}
                  className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    regRole === 'customer'
                      ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <ShoppingBag className={`w-4 h-4 ${regRole === 'customer' ? 'text-amber-400' : 'text-stone-500'}`} />
                  <span>ลูกค้าทั่วไป</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('staff')}
                  className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    regRole === 'staff'
                      ? 'bg-blue-800 border-blue-800 text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Package className={`w-4 h-4 ${regRole === 'staff' ? 'text-blue-200' : 'text-stone-500'}`} />
                  <span>พนักงานสต็อก</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('admin')}
                  className={`py-2 px-1.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    regRole === 'admin'
                      ? 'bg-purple-800 border-purple-800 text-white shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 ${regRole === 'admin' ? 'text-purple-200' : 'text-stone-500'}`} />
                  <span>แอดมิน</span>
                </button>
              </div>
            </div>

            {/* Submit Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-stone-900/20 transition-all cursor-pointer"
            >
              <span>สมัครสมาชิกและเข้าสู่ระบบ</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Back to Login */}
            <div className="text-center pt-2 text-xs text-stone-600 font-medium">
              <span>มีบัญชีอยู่แล้ว? </span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setMode('login');
                }}
                className="font-bold text-stone-900 hover:text-stone-700 underline underline-offset-2 cursor-pointer transition-colors"
              >
                เข้าสู่ระบบที่นี่
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                <HelpCircle className="w-5 h-5 text-stone-700" />
                <span>ช่วยเหลือการลืมรหัสผ่าน</span>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              สำหรับระบบ Demo สามารถใช้รหัสผ่านทดสอบเริ่มต้นได้ทันที:
            </p>

            <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 text-xs font-mono font-bold text-center text-stone-800">
              Retail123!
            </div>

            <p className="text-[11px] text-stone-500">
              กรณีต้องการรีเซ็ตรหัสผ่านจริง กรุณาติดต่อฝ่ายบริการลูกค้า Watchara Fusion Society:
              <br />
              &bull; โทร: 02-123-4567
              <br />
              &bull; LINE Official: @retailspace
            </p>

            <button
              type="button"
              onClick={() => {
                setLoginPassword('Retail123!');
                setIsForgotModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              กรอกรหัสผ่านทดสอบให้อัตโนมัติ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
