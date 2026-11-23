"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Briefcase,
  Plane,
  Star,
  Sliders,
  Phone,
  Mail,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  RefreshCw,
  Search,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  Lock,
  KeyRound,
  PhoneCall,
  LogOut,
  Share2,
  Loader2,
  Sparkles
} from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import { SiteContent, getInitialContent } from "@/lib/content-types";
import { BookingItem } from "@/app/api/bookings/route";

type AdminTab = "overview" | "contacts" | "security" | "bookings" | "company" | "departments" | "umrah" | "testimonials" | "hero";

export default function AdminDashboardPage() {
  const { content, updateContent, refreshContent } = useSiteContent();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Auth & credentials state
  const [authChecked, setAuthChecked] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [credsLoading, setCredsLoading] = useState(false);
  const [credsSuccess, setCredsSuccess] = useState<string | null>(null);
  const [credsError, setCredsError] = useState<string | null>(null);

  // Local editable form state
  const [formData, setFormData] = useState<SiteContent>(content);

  // Bookings state
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [bookingSearch, setBookingSearch] = useState<string>("");

  // Selected department in departments tab
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(0);
  const [newServiceName, setNewServiceName] = useState("");
  const [newHeroBg, setNewHeroBg] = useState("");

  // Sync formData with context when content updates
  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  // Check admin session
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthChecked(true);
          setCurrentAdminUser(data.username || "admin");
        } else {
          window.location.href = "/admin/login";
        }
      })
      .catch(() => {
        window.location.href = "/admin/login";
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/admin/login";
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setCredsError("يرجى إدخال كلمة المرور الحالية للتأكيد");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setCredsError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    setCredsLoading(true);
    setCredsError(null);
    setCredsSuccess(null);

    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setCredsSuccess("تم تحديث بيانات الدخول بنجاح!");
        if (newUsername.trim()) {
          setCurrentAdminUser(newUsername.trim());
        }
        setCurrentPassword("");
        setNewUsername("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setCredsError(data.error || "فشل تحديث البيانات");
      }
    } catch {
      setCredsError("تعذر الاتصال بالخادم");
    } finally {
      setCredsLoading(false);
    }
  };

  // Fetch bookings
  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleSaveAll = async (overrideData?: SiteContent) => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const dataToSave = overrideData || formData;
      const res = await updateContent(dataToSave);
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError((res as { success: boolean; error?: string }).error || "فشل الحفظ");
      }
    } catch (e) {
      setSaveError("تعذر الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: "جديد" | "قيد المراجعة" | "مكتمل") => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (e) {
      alert("فشل تحديث حالة الحجز");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الحجز نهائياً؟")) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      alert("فشل حذف الحجز");
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter =
      bookingFilter === "all" || b.status === bookingFilter;
    const matchesSearch =
      b.name.includes(bookingSearch) ||
      b.phone.includes(bookingSearch) ||
      b.department.includes(bookingSearch);
    return matchesFilter && matchesSearch;
  });

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-xs text-zinc-500 font-medium">جاري التحقق من صلاحيات المشرف...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 flex flex-col" dir="rtl">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <LayoutDashboard className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-900 tracking-tight">
                لوحة تحكم مفاتيح النجاح
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono font-semibold">
                Full-Control CMS
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              تحكم كامل في نصوص وخدمات وأرقام وحجوزات كافة الصفحات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {saveSuccess && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ كافة التغييرات على الموقع!</span>
            </div>
          )}

          <button
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 stroke-[2]" />
            )}
            <span>حفظ التعديلات</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:border-zinc-300 transition-colors flex items-center gap-1 text-xs shadow-xs"
            title="معاينة الموقع المباشر"
          >
            <span className="hidden sm:inline font-medium">معاينة الموقع</span>
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* User Session & Logout */}
          <div className="flex items-center gap-2 pr-2 border-r border-zinc-200">
            <div className="text-right hidden md:block">
              <span className="block text-xs font-bold text-zinc-900 font-mono">{currentAdminUser}</span>
              <span className="block text-[10px] text-emerald-600 font-medium">مشرف نشط</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar Tabs + Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-l border-zinc-200 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Nav Group 1: Management & System */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2">
                الإدارة والنظام
              </p>
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                {[
                  { id: "overview", label: "نظرة عامة والتقارير", icon: LayoutDashboard },
                  { id: "bookings", label: "الحجوزات والطلبات", icon: CalendarCheck, count: bookings.filter(b => b.status === "جديد").length },
                  { id: "contacts", label: "أرقام وروابط التواصل", icon: PhoneCall },
                  { id: "security", label: "أمان الحساب وكلمة المرور", icon: KeyRound },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 stroke-[1.75] ${isActive ? "text-amber-600" : "text-zinc-400"}`} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                          {tab.count} جديد
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Nav Group 2: Site Content */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2">
                محتوى صفحات الموقع
              </p>
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                {[
                  { id: "company", label: "بيانات الشركة والتعريف", icon: Building2 },
                  { id: "departments", label: "الأقسام والخدمات الـ 5", icon: Briefcase },
                  { id: "umrah", label: "باقات العمرة المتكاملة", icon: Plane },
                  { id: "testimonials", label: "آراء وتقييمات العملاء", icon: Star },
                  { id: "hero", label: "واجهة الهيرو والإحصائيات", icon: Sliders }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as AdminTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 stroke-[1.75] ${isActive ? "text-amber-600" : "text-zinc-400"}`} />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Quick status in sidebar bottom */}
          <div className="hidden lg:block pt-6 border-t border-zinc-100">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-[11px] text-zinc-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>إصدار اللوحة:</span>
                <span className="font-mono font-semibold text-zinc-800">v2.4 Pro</span>
              </div>
              <div className="flex items-center justify-between">
                <span>الاتصال:</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  مباشر ومحمي
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                    نظرة عامة وإحصائيات الموقع
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    ملخص حي لجميع الحجوزات ونشاطات الأقسام الخمسة والخدمات المتاحة
                  </p>
                </div>
                <button
                  onClick={loadBookings}
                  className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-700 hover:text-zinc-900 flex items-center gap-1.5 self-start shadow-2xs transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingBookings ? "animate-spin" : ""}`} />
                  <span>تحديث البيانات</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs">
                  <div className="text-zinc-500 text-xs font-semibold mb-1">إجمالي الحجوزات</div>
                  <div className="text-3xl font-extrabold text-zinc-900 font-mono">
                    {bookings.length}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">مسجلة في قاعدة البيانات</div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs">
                  <div className="text-amber-800 text-xs mb-1 font-semibold">حجوزات جديدة (قيد الانتظار)</div>
                  <div className="text-3xl font-extrabold text-amber-900 font-mono">
                    {bookings.filter((b) => b.status === "جديد").length}
                  </div>
                  <div className="text-[11px] text-amber-700 mt-1">تحتاج إلى متابعة مع العميل</div>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-xs">
                  <div className="text-blue-800 text-xs mb-1 font-semibold">حجوزات قيد المراجعة</div>
                  <div className="text-3xl font-extrabold text-blue-900 font-mono">
                    {bookings.filter((b) => b.status === "قيد المراجعة").length}
                  </div>
                  <div className="text-[11px] text-blue-700 mt-1">جاري التنسيق مع الفريق</div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
                  <div className="text-emerald-800 text-xs mb-1 font-semibold">طلبات مكتملة</div>
                  <div className="text-3xl font-extrabold text-emerald-900 font-mono">
                    {bookings.filter((b) => b.status === "مكتمل").length}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1">تمت بنجاح ورضا العميل</div>
                </div>
              </div>

              {/* Quick Actions & Recent Bookings Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Bookings (8 cols) */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-amber-600" />
                      <span>أحدث طلبات الحجز المستلمة</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs text-amber-700 font-semibold hover:underline cursor-pointer"
                    >
                      عرض الكل ({bookings.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {bookings.length === 0 ? (
                      <div className="text-center py-8 text-xs text-zinc-400">
                        لا توجد طلبات مسجلة حتى الآن
                      </div>
                    ) : (
                      bookings.slice(0, 4).map((b) => (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70 hover:border-zinc-300 flex items-center justify-between gap-4 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-zinc-900 text-xs">{b.name}</span>
                              <span className="text-[11px] font-mono text-zinc-500">({b.phone})</span>
                            </div>
                            <div className="text-xs text-amber-800 font-medium mt-0.5">{b.department}</div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                b.status === "جديد"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : b.status === "قيد المراجعة"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              }`}
                            >
                              {b.status}
                            </span>
                            <a
                              href={`https://wa.me/249${b.phone.replace(/^0/, "")}?text=${encodeURIComponent(`مرحباً ${b.name}، بخصوص طلبك في شركة مفاتيح النجاح المحدودة لقسم ${b.department}:`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                              title="مراسلة عبر واتساب"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* System & Site Status (4 cols) */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>حالة النظام والصفحات</span>
                  </h3>
                  <div className="space-y-3 text-xs text-zinc-600">
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                      <span>خادم التطبيق:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        يعمل بنجاح (Next.js 16)
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                      <span>الأقسام المفعلة:</span>
                      <span className="font-mono font-bold text-amber-800">5 أقسام كاملة</span>
                    </div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                      <span>أرقام الواتساب:</span>
                      <span className="font-mono text-zinc-700">3 أرقام معتمدة</span>
                    </div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
                      <span>الخدمات التخصصية:</span>
                      <span className="font-mono text-zinc-700">
                        {formData.departments.reduce((acc, d) => acc + d.services.length, 0)} خدمة
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("company")}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>تعديل بيانات وأرقام الشركة</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACTS & SOCIAL */}
          {activeTab === "contacts" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  إدارة أرقام الاتصال وروابط التواصل
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  تحكم كامل في رقم الاتصال المباشر، رقم الواتساب الرئيسي، أرقام فريق العمل، وروابط منصات التواصل
                </p>
              </div>

              {/* Primary Call & Primary WhatsApp Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Primary Call Card */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-amber-600">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">رقم الاتصال المباشر (Primary Call)</h3>
                      <p className="text-[11px] text-zinc-500">يستخدم لزر الاتصال العائم المضيء وأزرار الاتصال السريع</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      رقم الهاتف للاتصال:
                    </label>
                    <input
                      type="text"
                      value={formData.company.primaryPhone || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, primaryPhone: e.target.value }
                        })
                      }
                      placeholder="0918536828"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>مرتبط بزر الاتصال المباشر <code className="font-mono text-amber-800">tel:{formData.company.primaryPhone}</code></span>
                  </div>
                </div>

                {/* Primary WhatsApp Card */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-600">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900">رقم الواتساب الرئيسي (Primary WhatsApp)</h3>
                      <p className="text-[11px] text-zinc-500">يستخدم لزر الواتساب العائم ومحادثات الحجز الفورية</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      رقم الواتساب (مع كود الدولة وبدون + أو أصفار):
                    </label>
                    <input
                      type="text"
                      value={formData.company.primaryWhatsApp || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, primaryWhatsApp: e.target.value }
                        })
                      }
                      placeholder="249918536828"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 pt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>مرتبط بمحادثات واتساب الفورية <code className="font-mono text-emerald-800">wa.me/{formData.company.primaryWhatsApp}</code></span>
                  </div>
                </div>
              </div>

              {/* 3 Department Phone Numbers */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>أرقام هواتف الفريق وممثلي الخدمة الثلاثة</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.company.phones.map((phone, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          اسم/تسمية الرقم ({idx + 1}):
                        </label>
                        <input
                          type="text"
                          value={phone.label}
                          onChange={(e) => {
                            const newPhones = [...formData.company.phones];
                            newPhones[idx] = { ...newPhones[idx], label: e.target.value };
                            setFormData({
                              ...formData,
                              company: { ...formData.company, phones: newPhones }
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          رقم الهاتف المعروض:
                        </label>
                        <input
                          type="text"
                          value={phone.display}
                          onChange={(e) => {
                            const newPhones = [...formData.company.phones];
                            newPhones[idx] = {
                              ...newPhones[idx],
                              display: e.target.value,
                              number: e.target.value
                            };
                            setFormData({
                              ...formData,
                              company: { ...formData.company, phones: newPhones }
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-mono text-zinc-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          رابط الواتساب (waLink):
                        </label>
                        <input
                          type="text"
                          value={phone.waLink}
                          onChange={(e) => {
                            const newPhones = [...formData.company.phones];
                            newPhones[idx] = { ...newPhones[idx], waLink: e.target.value };
                            setFormData({
                              ...formData,
                              company: { ...formData.company, phones: newPhones }
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-mono text-zinc-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links Card */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-amber-600" />
                  <span>روابط منصات التواصل الاجتماعي (Social Media)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      رابط صفحة فيسبوك (Facebook):
                    </label>
                    <input
                      type="url"
                      value={formData.company.socialLinks?.facebook || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            socialLinks: {
                              ...formData.company.socialLinks,
                              facebook: e.target.value
                            }
                          }
                        })
                      }
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      رابط حساب إنستغرام (Instagram):
                    </label>
                    <input
                      type="url"
                      value={formData.company.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            socialLinks: {
                              ...formData.company.socialLinks,
                              instagram: e.target.value
                            }
                          }
                        })
                      }
                      placeholder="https://instagram.com/youraccount"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      رابط حساب إكس / تويتر (X / Twitter):
                    </label>
                    <input
                      type="url"
                      value={formData.company.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            socialLinks: {
                              ...formData.company.socialLinks,
                              twitter: e.target.value
                            }
                          }
                        })
                      }
                      placeholder="https://x.com/youraccount"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      رابط حساب لينكد إن (LinkedIn):
                    </label>
                    <input
                      type="url"
                      value={formData.company.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            socialLinks: {
                              ...formData.company.socialLinks,
                              linkedin: e.target.value
                            }
                          }
                        })
                      }
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      رابط تيك توك (TikTok):
                    </label>
                    <input
                      type="url"
                      value={formData.company.socialLinks?.tiktok || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            socialLinks: {
                              ...formData.company.socialLinks,
                              tiktok: e.target.value
                            }
                          }
                        })
                      }
                      placeholder="https://tiktok.com/@youraccount"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      البريد الإلكتروني الرسمي:
                    </label>
                    <input
                      type="email"
                      value={formData.company.email || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, email: e.target.value }
                        })
                      }
                      placeholder="mafteeh26@gmail.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Save Bar */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleSaveAll()}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white flex items-center gap-2 shadow-md shadow-amber-500/25 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ أرقام وروابط التواصل</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: SECURITY & CREDENTIALS */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
              <div className="pb-4 border-b border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  أمان الحساب وتغيير بيانات الدخول
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  يمكنك هنا تعديل اسم المستخدم وكلمة المرور الخاصة بلوحة التحكم
                </p>
              </div>

              {/* Status Alerts */}
              {credsSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">{credsSuccess}</p>
                    <p className="text-xs text-emerald-700 mt-0.5">يمكنك الآن استخدام بيانات الدخول الجديدة في المرات القادمة.</p>
                  </div>
                </div>
              )}

              {credsError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <p className="font-bold">{credsError}</p>
                  </div>
                </div>
              )}

              {/* Current Status Box */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-500 block">اسم المستخدم الحالي:</span>
                  <span className="text-base font-bold text-zinc-900 font-mono">{currentAdminUser}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-700">جلسة آمنة نشطة</span>
                </div>
              </div>

              {/* Credentials Change Form */}
              <form onSubmit={handleUpdateCredentials} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2 pb-2 border-b border-zinc-100">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>تعديل اليوزر والباسورد</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>كلمة المرور الحالية (مطلوبة لتأكيد الهوية) *</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="أدخل كلمة المرور الحالية..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      اسم المستخدم الجديد (اختياري):
                    </label>
                    <input
                      type="text"
                      placeholder="اتركه فارغاً إن لم ترغب بتغييره"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      كلمة المرور الجديدة (اختياري):
                    </label>
                    <input
                      type="password"
                      placeholder="اتركها فارغة إن لم ترغب بتغييرها"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {newPassword && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      تأكيد كلمة المرور الجديدة:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="أعد إدخال كلمة المرور الجديدة..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={credsLoading}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {credsLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>حفظ بيانات الدخول الجديدة</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج من اللوحة</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: BOOKINGS CRM */}
          {activeTab === "bookings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                    إدارة الحجوزات والطلبات (CRM)
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    استعراض، تحديث الحالة، مراسلة العملاء عبر واتساب، أو حذف الحجوزات
                  </p>
                </div>
                <button
                  onClick={loadBookings}
                  className="px-3.5 py-2 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-700 hover:text-zinc-900 flex items-center gap-1.5 self-start shadow-2xs transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingBookings ? "animate-spin" : ""}`} />
                  <span>تحديث</span>
                </button>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="ابحث بالاسم، رقم الهاتف، أو القسم..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-amber-500 shadow-2xs transition-all"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                  {["all", "جديد", "قيد المراجعة", "مكتمل"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        bookingFilter === st
                          ? "bg-amber-500 text-white shadow-xs font-bold"
                          : "text-zinc-600 hover:text-zinc-900"
                      }`}
                    >
                      {st === "all" ? "الكل" : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table / List */}
              <div className="space-y-3">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/90 text-zinc-500 text-xs shadow-xs">
                    لا توجد طلبات تطابق الفلتر الحالي.
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-zinc-900 text-sm">{b.name}</h3>
                          <span className="font-mono text-xs text-zinc-500">({b.phone})</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === "جديد"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : b.status === "قيد المراجعة"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <div className="text-xs text-zinc-600 flex flex-wrap items-center gap-4">
                          <span className="text-amber-800 font-semibold">{b.department}</span>
                          {b.date && <span>الموعد المطلوب: {b.date}</span>}
                          <span className="text-zinc-400 font-mono text-[11px]">
                            الرقم المستلم: {b.targetNumber}
                          </span>
                        </div>

                        {b.message && (
                          <p className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/70 leading-relaxed mt-2">
                            {b.message}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                        {/* Status Switcher */}
                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleUpdateBookingStatus(
                              b.id,
                              e.target.value as "جديد" | "قيد المراجعة" | "مكتمل"
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-amber-500 shadow-2xs cursor-pointer"
                        >
                          <option value="جديد">جديد</option>
                          <option value="قيد المراجعة">قيد المراجعة</option>
                          <option value="مكتمل">مكتمل</option>
                        </select>

                        {/* Direct WhatsApp to customer */}
                        <a
                          href={`https://wa.me/249${b.phone.replace(/^0/, "")}?text=${encodeURIComponent(`مرحباً ${b.name}، بخصوص طلبك في شركة مفاتيح النجاح المحدودة لقسم (${b.department}):`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب العميل</span>
                        </a>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                          title="حذف الحجز"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COMPANY & CONTACTS */}
          {activeTab === "company" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                    بيانات الشركة ومعلومات التعريف
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    تعديل الاسم التجاري، الشعار، البريد، المقر الرئيسي، وأرقام الهواتف والواتساب المعتمدة
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-6">
                {/* Logo and Brand Icon Live Size Management */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30 border-2 border-amber-300/70 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
                        <Sparkles className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900">إعدادات الشعار والتحكم في الحجم المباشر</h3>
                        <p className="text-xs text-zinc-500">تغيير رابط صورة الشعار والتحكم في حجم العرض الفعلي في الموقع</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Live Preview Box */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-[#0d233a] border border-[#1e3a5f] text-center">
                      <span className="text-[11px] text-zinc-400 mb-2">معاينة الشعار الحية:</span>
                      <div
                        style={{
                          width: `${formData.company.logoSize || 64}px`,
                          height: `${formData.company.logoSize || 64}px`
                        }}
                        className="relative rounded-full overflow-hidden shadow-xl ring-2 ring-[#c6ae4c] transition-all duration-300 mx-auto"
                      >
                        <Image
                          src={formData.company.logoUrl || "/logo.png"}
                          alt="معاينة الشعار"
                          fill
                          className="object-cover scale-110"
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#c6ae4c] mt-2">
                        {formData.company.logoSize || 64}px
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                          مسار أو رابط الشعار (Logo URL):
                        </label>
                        <input
                          type="text"
                          value={formData.company.logoUrl || "/logo.png"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: { ...formData.company, logoUrl: e.target.value }
                            })
                          }
                          className="w-full px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-mono text-zinc-900 outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-zinc-700">
                            حجم الشعار بالبكسل (Logo Size):
                          </label>
                          <span className="text-xs font-mono font-bold text-amber-700">
                            {formData.company.logoSize || 64} بكسل
                          </span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="110"
                          step="2"
                          value={formData.company.logoSize || 64}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: { ...formData.company, logoSize: parseInt(e.target.value) || 64 }
                            })
                          }
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                          <span>صغير (40px)</span>
                          <span>قياسي (64px)</span>
                          <span>كبير (110px)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      اسم الشركة المختصر:
                    </label>
                    <input
                      type="text"
                      value={formData.company.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, name: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 text-sm text-zinc-900 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      الاسم القانوني الكامل:
                    </label>
                    <input
                      type="text"
                      value={formData.company.legalName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, legalName: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 text-sm text-zinc-900 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      الشعار اللفظي (Slogan):
                    </label>
                    <input
                      type="text"
                      value={formData.company.slogan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, slogan: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 text-sm text-zinc-900 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      البريد الإلكتروني الرسمي:
                    </label>
                    <input
                      type="email"
                      value={formData.company.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, email: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 text-sm text-zinc-900 transition-all outline-none font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      الوصف التعريفي للشركة:
                    </label>
                    <textarea
                      rows={3}
                      value={formData.company.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, description: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 text-sm text-zinc-900 transition-all outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      المقر / الدولة:
                    </label>
                    <input
                      type="text"
                      value={formData.company.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: { ...formData.company, location: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 text-sm text-zinc-900 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      ساعات العمل (أيام الأسبوع):
                    </label>
                    <input
                      type="text"
                      value={formData.company.workingHours.weekdays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company: {
                            ...formData.company,
                            workingHours: {
                              ...formData.company.workingHours,
                              weekdays: e.target.value
                            }
                          }
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 text-sm text-zinc-900 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Phone Numbers Management */}
                <div className="pt-6 border-t border-zinc-100 space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span>أرقام الهواتف والواتساب المعتمدة بالموقع</span>
                  </h3>
                  <div className="space-y-3">
                    {formData.company.phones.map((phone, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                      >
                        <div>
                          <span className="block text-[11px] font-semibold text-zinc-600 mb-1">تسمية الرقم:</span>
                          <input
                            type="text"
                            value={phone.label}
                            onChange={(e) => {
                              const newPhones = [...formData.company.phones];
                              newPhones[idx].label = e.target.value;
                              setFormData({
                                ...formData,
                                company: { ...formData.company, phones: newPhones }
                              });
                            }}
                            className="w-full px-3.5 py-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 focus:border-amber-500 outline-none"
                          />
                        </div>
                        <div>
                          <span className="block text-[11px] font-semibold text-zinc-600 mb-1">الرقم المعروض:</span>
                          <input
                            type="text"
                            value={phone.display}
                            onChange={(e) => {
                              const newPhones = [...formData.company.phones];
                              newPhones[idx].display = e.target.value;
                              newPhones[idx].number = e.target.value;
                              setFormData({
                                ...formData,
                                company: { ...formData.company, phones: newPhones }
                              });
                            }}
                            className="w-full px-3.5 py-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 font-mono focus:border-amber-500 outline-none"
                          />
                        </div>
                        <div>
                          <span className="block text-[11px] font-semibold text-zinc-600 mb-1">رقم الواتساب الدولي:</span>
                          <input
                            type="text"
                            value={phone.waLink}
                            onChange={(e) => {
                              const newPhones = [...formData.company.phones];
                              newPhones[idx].waLink = e.target.value;
                              setFormData({
                                ...formData,
                                company: { ...formData.company, phones: newPhones }
                              });
                            }}
                            className="w-full px-3.5 py-2 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-900 font-mono focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => handleSaveAll()}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ بيانات الشركة</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEPARTMENTS & SERVICES */}
          {activeTab === "departments" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  إدارة الأقسام والخدمات التخصصية
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  اختر القسم لتعديل نصوصه وإضافة أو حذف الخدمات الفرعية
                </p>
              </div>

              {/* Department Switcher */}
              <div className="flex flex-wrap gap-2">
                {formData.departments.map((dept, idx) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDeptIndex(idx)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedDeptIndex === idx
                        ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-2xs"
                    }`}
                  >
                    {dept.title}
                  </button>
                ))}
              </div>

              {/* Selected Department Details */}
              {formData.departments[selectedDeptIndex] && (
                <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        عنوان القسم:
                      </label>
                      <input
                        type="text"
                        value={formData.departments[selectedDeptIndex].title}
                        onChange={(e) => {
                          const newDepts = [...formData.departments];
                          newDepts[selectedDeptIndex].title = e.target.value;
                          setFormData({ ...formData, departments: newDepts });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-sm text-zinc-900 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        شارة القسم (Badge):
                      </label>
                      <input
                        type="text"
                        value={formData.departments[selectedDeptIndex].badge}
                        onChange={(e) => {
                          const newDepts = [...formData.departments];
                          newDepts[selectedDeptIndex].badge = e.target.value;
                          setFormData({ ...formData, departments: newDepts });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-sm text-zinc-900 outline-none transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        الوصف المختصر:
                      </label>
                      <input
                        type="text"
                        value={formData.departments[selectedDeptIndex].shortDesc}
                        onChange={(e) => {
                          const newDepts = [...formData.departments];
                          newDepts[selectedDeptIndex].shortDesc = e.target.value;
                          setFormData({ ...formData, departments: newDepts });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-sm text-zinc-900 outline-none transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        الوصف الكامل للقسم:
                      </label>
                      <textarea
                        rows={3}
                        value={formData.departments[selectedDeptIndex].fullDesc}
                        onChange={(e) => {
                          const newDepts = [...formData.departments];
                          newDepts[selectedDeptIndex].fullDesc = e.target.value;
                          setFormData({ ...formData, departments: newDepts });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-sm text-zinc-900 outline-none transition-all resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Sub-services list */}
                  <div className="pt-4 border-t border-zinc-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-zinc-900">
                        الخدمات التخصصية لهذا القسم ({formData.departments[selectedDeptIndex].services.length})
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {formData.departments[selectedDeptIndex].services.map((srv, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200/80"
                        >
                          <input
                            type="text"
                            value={srv}
                            onChange={(e) => {
                              const newDepts = [...formData.departments];
                              newDepts[selectedDeptIndex].services[sIdx] = e.target.value;
                              setFormData({ ...formData, departments: newDepts });
                            }}
                            className="bg-transparent text-sm text-zinc-900 font-medium flex-1 focus:outline-none ml-2"
                          />
                          <button
                            onClick={() => {
                              const newDepts = [...formData.departments];
                              newDepts[selectedDeptIndex].services.splice(sIdx, 1);
                              setFormData({ ...formData, departments: newDepts });
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="حذف الخدمة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add new sub-service input */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="أدخل اسم خدمة جديدة..."
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newServiceName.trim()) return;
                          const newDepts = [...formData.departments];
                          newDepts[selectedDeptIndex].services.push(newServiceName.trim());
                          setFormData({ ...formData, departments: newDepts });
                          setNewServiceName("");
                        }}
                        className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة خدمة</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveAll()}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ تعديلات القسم</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: UMRAH PACKAGES */}
          {activeTab === "umrah" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                    إدارة باقات العمرة المتكاملة
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    تعديل تفاصيل باقات العمرة الاقتصادية والمميزة والـ VIP وإضافة بنود أو باقات جديدة
                  </p>
                </div>
              </div>

              {formData.departments.find(d => d.id === "travel")?.packages?.map((pkg, pIdx) => (
                <div
                  key={pkg.id}
                  className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        عنوان الباقة:
                      </label>
                      <input
                        type="text"
                        value={pkg.title}
                        onChange={(e) => {
                          const newDepts = [...formData.departments];
                          const travel = newDepts.find(d => d.id === "travel");
                          if (travel && travel.packages) {
                            travel.packages[pIdx].title = e.target.value;
                            setFormData({ ...formData, departments: newDepts });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-xs text-zinc-900 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        المدة الزمنية:
                      </label>
                      <input
                        type="text"
                        value={pkg.duration}
                        onChange={(e) => {
                          const newDepts = [...formData.departments];
                          const travel = newDepts.find(d => d.id === "travel");
                          if (travel && travel.packages) {
                            travel.packages[pIdx].duration = e.target.value;
                            setFormData({ ...formData, departments: newDepts });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-xs text-zinc-900 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                        نوع الفندق / الإقامة:
                      </label>
                      <input
                        type="text"
                        value={pkg.hotel}
                        onChange={(e) => {
                          const newDepts = [...formData.departments];
                          const travel = newDepts.find(d => d.id === "travel");
                          if (travel && travel.packages) {
                            travel.packages[pIdx].hotel = e.target.value;
                            setFormData({ ...formData, departments: newDepts });
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-xs text-zinc-900 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      وصف الباقة:
                    </label>
                    <input
                      type="text"
                      value={pkg.desc}
                      onChange={(e) => {
                        const newDepts = [...formData.departments];
                        const travel = newDepts.find(d => d.id === "travel");
                        if (travel && travel.packages) {
                          travel.packages[pIdx].desc = e.target.value;
                          setFormData({ ...formData, departments: newDepts });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-xs text-zinc-900 outline-none transition-all"
                    />
                  </div>

                  {/* Inclusions */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      مشتملات الباقة (بنود منفصلة):
                    </label>
                    <div className="space-y-1.5">
                      {pkg.includes.map((inc, iIdx) => (
                        <div key={iIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={inc}
                            onChange={(e) => {
                              const newDepts = [...formData.departments];
                              const travel = newDepts.find(d => d.id === "travel");
                              if (travel && travel.packages) {
                                travel.packages[pIdx].includes[iIdx] = e.target.value;
                                setFormData({ ...formData, departments: newDepts });
                              }
                            }}
                            className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white outline-none"
                          />
                          <button
                            onClick={() => {
                              const newDepts = [...formData.departments];
                              const travel = newDepts.find(d => d.id === "travel");
                              if (travel && travel.packages) {
                                travel.packages[pIdx].includes.splice(iIdx, 1);
                                setFormData({ ...formData, departments: newDepts });
                              }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف البند"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSaveAll()}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ باقات العمرة</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                    إدارة آراء وتقييمات العملاء
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    تعديل، إضافة أو حذف تجارب العملاء المعروضة على الصفحة الرئيسية
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newTestimonials = [
                      ...formData.testimonials,
                      {
                        id: String(Date.now()),
                        name: "عميل جديد",
                        role: "مدير شركة",
                        department: "المقاولات العامة",
                        text: "تجربة ممتازة وتعامل احترافي ودقة في المواعيد.",
                        rating: 5
                      }
                    ];
                    setFormData({ ...formData, testimonials: newTestimonials });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة رأي جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.testimonials.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => {
                          const updated = [...formData.testimonials];
                          updated[idx].name = e.target.value;
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="font-bold text-zinc-900 text-sm bg-transparent focus:outline-none border-b border-zinc-200 pb-1 w-full ml-3"
                      />
                      <button
                        onClick={() => {
                          const updated = formData.testimonials.filter((_, i) => i !== idx);
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="حذف التقييم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="المسمى الوظيفي"
                        value={t.role}
                        onChange={(e) => {
                          const updated = [...formData.testimonials];
                          updated[idx].role = e.target.value;
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-amber-800 font-medium focus:bg-white outline-none"
                      />
                      <input
                        type="text"
                        placeholder="القسم"
                        value={t.department}
                        onChange={(e) => {
                          const updated = [...formData.testimonials];
                          updated[idx].department = e.target.value;
                          setFormData({ ...formData, testimonials: updated });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 focus:bg-white outline-none"
                      />
                    </div>

                    <textarea
                      rows={3}
                      value={t.text}
                      onChange={(e) => {
                        const updated = [...formData.testimonials];
                        updated[idx].text = e.target.value;
                        setFormData({ ...formData, testimonials: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 resize-none leading-relaxed focus:bg-white outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleSaveAll()}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ آراء العملاء</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: HERO & STATS */}
          {activeTab === "hero" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-zinc-200">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  نصوص واجهة الهيرو والإحصائيات
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  تعديل العناوين الرئيسية، الشارة العلوية، والعدادات الرقمية الأربعة
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    الشارة العلوية (Badge):
                  </label>
                  <input
                    type="text"
                    value={formData.hero.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, badge: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-sm text-zinc-900 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      بداية العنوان:
                    </label>
                    <input
                      type="text"
                      value={formData.hero.titlePrimary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, titlePrimary: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-xs text-zinc-900 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      الكلمة المميزة باللون الذهبي:
                    </label>
                    <input
                      type="text"
                      value={formData.hero.titleHighlight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, titleHighlight: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50/60 border border-amber-200 focus:bg-white focus:border-amber-500 text-xs text-amber-900 font-bold outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                      نهاية العنوان:
                    </label>
                    <input
                      type="text"
                      value={formData.hero.titleSuffix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, titleSuffix: e.target.value }
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-xs text-zinc-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    الوصف الفرعي:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.hero.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, description: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-amber-500 text-sm text-zinc-900 resize-none leading-relaxed outline-none transition-all"
                  />
                </div>

                {/* Hero Multi-Background Slideshow Manager */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-600" />
                      <h3 className="text-sm font-bold text-zinc-900">صور الخلفية المتعددة للهيرو (Slideshow)</h3>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {(formData.hero.backgroundImages || []).length} صور مضافة
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500">
                    يمكنك إضافة أكثر من صورة لخلفية الهيرو، ويقوم الموقع بالتبديل بينها تلقائياً بحركات انسيابية ناعمة.
                  </p>

                  {/* List of images */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {(formData.hero.backgroundImages || []).map((img, bIdx) => (
                      <div
                        key={bIdx}
                        className="group relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-900 h-24 shadow-xs"
                      >
                        <Image
                          src={img}
                          alt={`خلفية ${bIdx + 1}`}
                          fill
                          className="object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2">
                          <span className="text-[10px] font-mono text-white truncate max-w-[80px]">
                            #{bIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = (formData.hero.backgroundImages || []).filter((_, i) => i !== bIdx);
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, backgroundImages: newImgs }
                              });
                            }}
                            className="p-1 rounded-md bg-red-600/90 hover:bg-red-700 text-white transition-colors"
                            title="حذف هذه الصورة"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Image Form */}
                  <div className="pt-3 border-t border-zinc-200/80 space-y-2.5">
                    <label className="block text-xs font-semibold text-zinc-700">
                      إضافة مسار أو رابط صورة جديد:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="مثال: /images/hero-banner.png أو أي رابط خارجي"
                        value={newHeroBg}
                        onChange={(e) => setNewHeroBg(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newHeroBg.trim()) return;
                          const current = formData.hero.backgroundImages || [];
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, backgroundImages: [...current, newHeroBg.trim()] }
                          });
                          setNewHeroBg("");
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0d233a] hover:bg-[#132f4c] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة صورة</span>
                      </button>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-zinc-400">صور سريعة جاهزة:</span>
                      {[
                        { label: "الرئيسية", path: "/images/hero-banner.png" },
                        { label: "السفر والعمرة", path: "/images/travel.png" },
                        { label: "المقاولات", path: "/images/contracting.png" },
                        { label: "النظافة", path: "/images/cleaning.png" },
                        { label: "التسويق", path: "/images/marketing.png" },
                        { label: "التجارة واللوجستيات", path: "/images/trade.png" }
                      ].map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => {
                            const current = formData.hero.backgroundImages || [];
                            if (!current.includes(preset.path)) {
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, backgroundImages: [...current, preset.path] }
                              });
                            }
                          }}
                          className="px-2 py-0.5 rounded-lg bg-white border border-zinc-200 hover:border-amber-400 text-[10px] text-zinc-700 transition-colors"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Slide duration in seconds */}
                    <div className="pt-2 flex items-center gap-3">
                      <label className="text-xs font-semibold text-zinc-700">
                        مدة التبديل التلقائي بين الصور (بالثواني):
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="30"
                        value={formData.hero.slideInterval || 5}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: {
                              ...formData.hero,
                              slideInterval: parseInt(e.target.value) || 5
                            }
                          })
                        }
                        className="w-20 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-bold text-zinc-900 text-center outline-none"
                      />
                      <span className="text-xs text-zinc-500">ثوانٍ لكل صورة</span>
                    </div>
                  </div>
                </div>

                {/* Stats Counters */}
                <div className="pt-4 border-t border-zinc-100 space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>العدادات والإحصائيات الأربعة</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {formData.company.stats.map((stat, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2.5"
                      >
                        <div>
                          <span className="block text-[10px] font-semibold text-zinc-500 mb-1">القيمة الرقمية:</span>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...formData.company.stats];
                              newStats[sIdx].value = e.target.value;
                              setFormData({
                                ...formData,
                                company: { ...formData.company, stats: newStats }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-sm text-zinc-900 font-mono font-bold outline-none"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-zinc-500 mb-1">النص الأساسي:</span>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...formData.company.stats];
                              newStats[sIdx].label = e.target.value;
                              setFormData({
                                ...formData,
                                company: { ...formData.company, stats: newStats }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 outline-none"
                          />
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-zinc-500 mb-1">النص التوضيحي:</span>
                          <input
                            type="text"
                            value={stat.sublabel}
                            onChange={(e) => {
                              const newStats = [...formData.company.stats];
                              newStats[sIdx].sublabel = e.target.value;
                              setFormData({
                                ...formData,
                                company: { ...formData.company, stats: newStats }
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-500 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => handleSaveAll()}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ نصوص الهيرو والإحصائيات</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
