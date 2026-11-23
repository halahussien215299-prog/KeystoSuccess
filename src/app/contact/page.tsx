"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  CalendarCheck,
  User,
  Briefcase,
  FileText,
  Calendar,
  ShieldCheck,
  Loader2,
  ChevronLeft
} from "lucide-react";
import { ModernWhatsAppIcon, ModernPhoneIcon } from "@/components/Icons";
import { COMPANY_INFO, DEPARTMENTS } from "@/lib/data";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0].title);
  const [date, setDate] = useState("");
  const [targetNumber, setTargetNumber] = useState(COMPANY_INFO.phones[0].number);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (type: "whatsapp" | "email") => {
    if (!name.trim() || !phone.trim()) {
      alert("يرجى إدخال الاسم ورقم الهاتف على الأقل.");
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
        setSubmitted(true);
        window.dispatchEvent(new CustomEvent("booking-added"));

        if (type === "whatsapp" && data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank");
        } else if (type === "email") {
          const subject = encodeURIComponent(`طلب حجز جديد من ${name} - قسم ${department}`);
          const body = encodeURIComponent(
            `الاسم: ${name}\nالهاتف: ${phone}\nالقسم: ${department}\nالتاريخ: ${date || "-"}\nالرسالة: ${message || "-"}`
          );
          window.location.href = `mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`;
        }
      } else {
        alert(data.error || "حدث خطأ أثناء إرسال الطلب.");
      }
    } catch (err) {
      console.error(err);
      alert("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900" dir="rtl">
      {/* Top Luxury Banner with clearly visible atmospheric background */}
      <section className="relative min-h-[38vh] sm:min-h-[42vh] flex items-center justify-center overflow-hidden py-12 sm:py-16 bg-[#0d233a] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-banner.png"
            alt="تواصل معنا"
            fill
            priority
            className="object-cover object-center opacity-75 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d233a] via-transparent to-[#071524]/40" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0d233a]/90 via-[#0d233a]/55 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-right">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-300 mb-4">
            <Link href="/" className="hover:text-[#c6ae4c] transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#c6ae4c] font-semibold">تواصل معنا</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#091b2c]/90 border border-[#1e3a5f] text-[#c6ae4c] text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-[#c6ae4c]" />
            <span>نحن هنا لمساعدتك على مدار الساعة</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            تواصل معنا <span className="text-[#c6ae4c]">واحجز خدمتك</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-200 max-w-2xl leading-relaxed font-normal">
            أرسل طلب الحجز مباشرة عبر واتساب إلى أحد أرقامنا، أو تواصل معنا بالبريد الإلكتروني والهاتف. فريقنا مستعد دائماً لخدمتك.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-right">
          {/* Right Column: Interactive Booking Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100 mb-6">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                  نموذج طلب الحجز
                </h2>
                <p className="text-xs text-zinc-500">
                  املأ البيانات التالية وسيتم إرسال طلب الحجز مباشرة إلى واتساب الشركة
                </p>
              </div>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold">تم تسجيل طلبك بنجاح!</p>
                  <p className="text-emerald-700 mt-0.5">
                    تم توجيه طلبك وجاري مراجعته من قبل مسؤولي القسم المختص.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  <span>الاسم الكامل *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500"
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
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500 font-mono"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  >
                    {DEPARTMENTS.map((d) => (
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
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                  <ModernWhatsAppIcon size={14} className="text-[#1a8885]" />
                  <span>رقم الواتساب المستلم للحجز</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {COMPANY_INFO.phones.map((p) => {
                    const isSelected = targetNumber === p.number;
                    return (
                      <button
                        key={p.number}
                        type="button"
                        onClick={() => setTargetNumber(p.number)}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
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
                  <span>تفاصيل الطلب</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="اكتب هنا أي تفاصيل عن الخدمة المطلوبة، العنوان، أو الملاحظات..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("whatsapp")}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-[#1a8885] hover:bg-[#157774] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#1a8885]/30 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ModernWhatsAppIcon size={18} className="text-white" />
                  )}
                  <span>إرسال الحجز عبر واتساب</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmit("email")}
                  className="py-3 px-5 rounded-xl font-semibold text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>إرسال بالبريد الإلكتروني</span>
                </button>
              </div>
            </form>
          </div>

          {/* Left Column: Direct Phone & WhatsApp Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 3 WhatsApp Fast Connect Cards */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 shadow-xs">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <ModernWhatsAppIcon size={18} className="text-[#1a8885]" />
                <span>احجز فوراً عبر واتساب</span>
              </h3>
              <p className="text-xs text-zinc-600">
                يمكنك الضغط مباشرة على أي رقم لبدء المحادثة الفورية مع ممثل الخدمة:
              </p>

              <div className="space-y-2.5">
                {COMPANY_INFO.phones.map((p) => (
                  <div
                    key={p.number}
                    className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[11px] text-zinc-500">{p.label}</div>
                      <a
                        href={`tel:${p.number}`}
                        className="font-mono text-xs font-bold text-zinc-900 hover:text-amber-600 transition-colors"
                      >
                        {p.display}
                      </a>
                    </div>
                    <a
                      href={`https://wa.me/${p.waLink}?text=${encodeURIComponent("مرحباً شركة مفاتيح النجاح المحدودة 🔑، أرغب في حجز خدمة والاستفسار عن التفاصيل.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a8885] hover:bg-[#157774] text-white text-xs font-bold transition-all"
                    >
                      <ModernWhatsAppIcon size={14} className="text-white" />
                      <span>واتساب</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Calling Card */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-xs">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>اتصل بنا مباشرة</span>
              </h3>
              <p className="text-xs text-zinc-600">
                الخطوط الهاتفية متاحة طوال ساعات العمل الرسمية لاستقبال استفساراتكم.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {COMPANY_INFO.phones.map((p) => (
                  <a
                    key={p.number}
                    href={`tel:${p.number}`}
                    className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-center transition-colors block"
                  >
                    <span className="block text-[10px] text-zinc-500">{p.label}</span>
                    <span className="font-mono text-xs font-bold text-amber-700 mt-0.5 block">
                      {p.display}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Email & Location & Hours */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-4 text-xs text-zinc-600 shadow-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-zinc-900">البريد الإلكتروني:</div>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-amber-700 font-mono hover:underline font-semibold">
                    {COMPANY_INFO.email}
                  </a>
                  <div className="text-[11px] text-zinc-500 mt-0.5">راسلنا في أي وقت</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-zinc-900">المقر الرئيسي:</div>
                  <p>{COMPANY_INFO.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-zinc-900">ساعات العمل الرسمية:</div>
                  <p className="text-zinc-600">{COMPANY_INFO.workingHours.weekdays}</p>
                  <p className="text-zinc-500">{COMPANY_INFO.workingHours.weekend}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
