"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already authenticated
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push("/admin");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      console.error(err);
      setError("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4 relative overflow-hidden" dir="rtl">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back link */}
      <div className="w-full max-w-md mb-4 text-right">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-amber-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>العودة إلى الموقع الرئيسي</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-zinc-900/5 relative z-10 text-right">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 shadow-md shadow-amber-500/20 mb-3">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
              <Image
                src="/logo.png"
                alt="شعار مفاتيح النجاح"
                width={56}
                height={56}
                className="object-cover"
                priority
              />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            لوحة تحكم مفاتيح النجاح
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            سجّل دخولك لإدارة المحتوى، الحجوزات، وأرقام التواصل
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>اسم المستخدم</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>كلمة المرور</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                aria-label="تبديل إظهار كلمة المرور"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            )}
            <span>تسجيل الدخول إلى اللوحة</span>
          </button>
        </form>

        {/* Demo Credentials Notice */}
        <div className="mt-6 pt-4 border-t border-zinc-100 text-center text-[11px] text-zinc-500 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
          <p className="font-semibold text-zinc-700 mb-0.5">بيانات الدخول الافتراضية:</p>
          <p>
            اليوزر: <code className="font-mono text-amber-800 font-bold">admin</code> | الباسورد: <code className="font-mono text-amber-800 font-bold">admin123</code>
          </p>
          <p className="text-[10px] text-zinc-600 mt-1">
            (يمكنك تغيير اليوزر والباسورد من داخل لوحة التحكم بعد الدخول)
          </p>
        </div>
      </div>
    </div>
  );
}
