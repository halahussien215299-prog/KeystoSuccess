"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  User,
  Phone,
  Briefcase,
  FileText,
  Mail,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { ModernWhatsAppIcon, ModernPhoneIcon } from "@/components/Icons";
import { useSiteContent } from "@/context/ContentContext";

export function InteractiveBookingModal() {
  const { content } = useSiteContent();
  const company = content.company;
  const departments = content.departments;

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState(departments[0]?.title || "النظافة والخدمات");
  const [date, setDate] = useState("");
  const [targetNumber, setTargetNumber] = useState(company.phones[0]?.number || "0918536828");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ department?: string }>;
      if (customEvent.detail?.department) {
        setDepartment(customEvent.detail.department);
      }
      setSuccessMsg(null);
      setIsOpen(true);
    };

    window.addEventListener("open-booking-modal", handler);
    return () => window.removeEventListener("open-booking-modal", handler);
  }, []);

  const handleSubmit = async (actionType: "whatsapp" | "system") => {
    if (!name.trim() || !phone.trim()) {
      alert("يرجى إدخال الاسم ورقم الهاتف على الأقل للمتابعة.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          department,
          date,
          targetNumber,
          message
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || "تم تسجيل الحجز بنجاح!");
        window.dispatchEvent(new CustomEvent("booking-added"));

        if (actionType === "whatsapp" && data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank");
        }

        setTimeout(() => {
          if (actionType === "whatsapp") {
            setIsOpen(false);
          }
        }, 1500);
      } else {
        alert(data.error || "حدث خطأ أثناء إرسال الحجز.");
      }
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-2xl p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Header */}
        <div className="mb-5 sm:mb-6 text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>حجز خدمة معتمدة</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            نموذج طلب حجز خدمة
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            املأ البيانات وسيقوم فريقنا بتسجيل حجزك والتواصل معك فوراً عبر واتساب.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold">{successMsg}</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                تم حفظ الطلب في قاعدة البيانات وتوليد محادثة الواتساب.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>الاسم الكامل *</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: محمد أحمد"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>رقم التواصل / الواتساب *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="مثال: 0912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>القسم المطلوب</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.title}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>التاريخ المطلوب (اختياري)</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <ModernWhatsAppIcon size={14} className="text-[#1a8885]" />
              <span>اختر رقم الواتساب المستلم للحجز</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {company.phones.map((p) => {
                const isSelected = targetNumber === p.number;
                return (
                  <button
                    key={p.number}
                    type="button"
                    onClick={() => setTargetNumber(p.number)}
                    className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-[10px] text-zinc-500">{p.label}</span>
                    <span className="font-mono text-xs font-bold text-zinc-900 mt-1">
                      {p.display}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>تفاصيل الطلب أو ملاحظات خاصة</span>
            </label>
            <textarea
              rows={3}
              placeholder="اكتب أي تفاصيل إضافية عن نوع الخدمة المطلوبة، العنوان أو الملاحظات..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("whatsapp")}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ModernWhatsAppIcon size={18} className="text-white" />
              )}
              <span>إرسال الحجز عبر واتساب فوراً</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit("system")}
              className="py-3 px-5 rounded-xl font-semibold text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>حفظ في النظام فقط</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
