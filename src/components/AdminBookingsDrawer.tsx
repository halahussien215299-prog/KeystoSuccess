"use client";

import React, { useState, useEffect } from "react";
import { Database, RefreshCw, CheckCircle, Clock, X, Eye } from "lucide-react";

interface BookingItem {
  id: string;
  name: string;
  phone: string;
  department: string;
  date?: string;
  message?: string;
  targetNumber: string;
  createdAt: string;
  status: "جديد" | "قيد المراجعة" | "مكتمل";
}

export function AdminBookingsDrawer() {
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchBookings();
    }
    const handler = () => {
      fetchBookings();
    };
    window.addEventListener("booking-added", handler);
    return () => window.removeEventListener("booking-added", handler);
  }, [open]);

  return (
    <>
      {/* Floating Pill on bottom-right to show Full-Stack capabilities */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full bg-white/95 hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200 backdrop-blur-md shadow-lg shadow-zinc-900/10 flex items-center gap-2 text-xs font-mono transition-all duration-200 hover:scale-105 cursor-pointer"
        title="عرض الحجوزات المسجلة في الـ Full-Stack Database"
      >
        <Database className="w-3.5 h-3.5 text-amber-600 stroke-[2]" />
        <span>قاعدة الحجوزات</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </button>

      {/* Drawer Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white border-l border-zinc-200 h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 text-right"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-base font-bold text-zinc-900">
                    الحجوزات المسجلة (Full-Stack)
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    بيانات حية مخزنة عبر API الخادم
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchBookings}
                  disabled={loading}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                  title="تحديث"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin text-amber-600" : ""}`}
                  />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  لا توجد حجوزات مسجلة حالياً.
                </div>
              ) : (
                bookings.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 hover:border-zinc-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900">{item.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "جديد"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-600 flex items-center justify-between">
                      <span className="text-amber-700 font-semibold">{item.department}</span>
                      <span className="font-mono text-zinc-700">{item.phone}</span>
                    </div>

                    {item.date && (
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>التاريخ: {item.date}</span>
                      </div>
                    )}

                    {item.message && (
                      <p className="text-[11px] text-zinc-600 bg-white p-2 rounded-lg border border-zinc-200 leading-relaxed">
                        {item.message}
                      </p>
                    )}

                    <div className="pt-1 text-[10px] text-zinc-400 flex justify-between items-center font-mono">
                      <span>الرقم المستلم: {item.targetNumber}</span>
                      <span>{item.createdAt ? item.createdAt.substring(0, 10) : ""}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="pt-4 border-t border-zinc-100 text-xs text-zinc-600 flex justify-between items-center">
              <span>إجمالي الحجوزات: {bookings.length}</span>
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                قاعدة البيانات متصلة
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
