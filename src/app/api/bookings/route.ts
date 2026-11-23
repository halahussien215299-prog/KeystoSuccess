import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { buildWhatsAppLink } from "@/lib/data";

export interface BookingItem {
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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

function getStoredBookings(): BookingItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initialBookings: BookingItem[] = [
        {
          id: "bk-1001",
          name: "أحمد عبد الله",
          phone: "0912345678",
          department: "النظافة والخدمات",
          date: "2026-11-25",
          message: "طلب تنظيف شامل لفيلا سكنية قبل الانتقال",
          targetNumber: "0918536828",
          createdAt: "2026-11-22T14:30:00Z",
          status: "جديد"
        },
        {
          id: "bk-1002",
          name: "سارة محجوب",
          phone: "0998877665",
          department: "السفر والسياحة وتأشيرات العمرة",
          date: "2026-12-01",
          message: "استفسار عن باقة العمرة المميزة لأسرة مكونة من 4 أفراد",
          targetNumber: "0110061223",
          createdAt: "2026-11-22T16:15:00Z",
          status: "قيد المراجعة"
        }
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialBookings, null, 2), "utf8");
      return initialBookings;
    }
    const content = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(content) as BookingItem[];
  } catch (error) {
    console.error("Error reading bookings file:", error);
    return [];
  }
}

function saveBookings(bookings: BookingItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving bookings file:", error);
  }
}

export async function GET() {
  const bookings = getStoredBookings();
  return NextResponse.json({
    success: true,
    count: bookings.length,
    bookings
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, department, date, message, targetNumber } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "الرجاء إدخال الاسم ورقم الهاتف على الأقل." },
        { status: 400 }
      );
    }

    const assignedNumber = targetNumber || "0918536828";
    const waPhoneMap: Record<string, string> = {
      "0918536828": "249918536828",
      "0110061201": "249110061201",
      "0110061223": "249110061223",
    };
    const waTarget = waPhoneMap[assignedNumber] || "249918536828";

    const newBooking: BookingItem = {
      id: `bk-${Date.now().toString(36)}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      department: department || "عام",
      date: date || "",
      message: message || "",
      targetNumber: assignedNumber,
      createdAt: new Date().toISOString(),
      status: "جديد"
    };

    const currentBookings = getStoredBookings();
    currentBookings.unshift(newBooking);
    saveBookings(currentBookings);

    const whatsappUrl = buildWhatsAppLink(waTarget, {
      name: newBooking.name,
      phone: newBooking.phone,
      department: newBooking.department,
      date: newBooking.date,
      message: newBooking.message
    });

    return NextResponse.json({
      success: true,
      message: "تم تسجيل طلبك بنجاح، فريقنا سيتواصل معك فوراً.",
      booking: newBooking,
      whatsappUrl
    });
  } catch (err: unknown) {
    console.error("Booking submission error:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء معالجة الطلب." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "المعرف والحالة مطلوبان." },
        { status: 400 }
      );
    }

    const bookings = getStoredBookings();
    const target = bookings.find((b) => b.id === id);
    if (!target) {
      return NextResponse.json(
        { success: false, error: "الحجز غير موجود." },
        { status: 404 }
      );
    }

    target.status = status;
    saveBookings(bookings);

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الحجز بنجاح.",
      booking: target
    });
  } catch (err: unknown) {
    console.error("Error updating booking:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء التحديث." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف الحجز مطلوب." },
        { status: 400 }
      );
    }

    let bookings = getStoredBookings();
    const initialCount = bookings.length;
    bookings = bookings.filter((b) => b.id !== id);

    if (bookings.length === initialCount) {
      return NextResponse.json(
        { success: false, error: "الحجز غير موجود." },
        { status: 404 }
      );
    }

    saveBookings(bookings);
    return NextResponse.json({
      success: true,
      message: "تم حذف الحجز بنجاح."
    });
  } catch (err: unknown) {
    console.error("Error deleting booking:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء الحذف." },
      { status: 500 }
    );
  }
}
