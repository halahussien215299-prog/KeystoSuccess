import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { buildWhatsAppLink } from "@/lib/data";
import { connectToDatabase } from "@/lib/mongodb";
import { BookingModel, IBookingDoc } from "@/models/BookingModel";

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

function getStoredLocalBookings(): BookingItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(content) as BookingItem[];
  } catch (error) {
    console.error("Error reading local bookings file:", error);
    return [];
  }
}

function saveLocalBookings(bookings: BookingItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving local bookings file:", error);
  }
}

async function getLiveBookings(): Promise<BookingItem[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const docs = await BookingModel.find({}).sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          id: d.id,
          name: d.name,
          phone: d.phone,
          department: d.department,
          date: d.date || "",
          message: d.message || "",
          targetNumber: d.targetNumber || "0918536828",
          createdAt: d.createdAt,
          status: d.status,
        }));
      }
    }
  } catch (err) {
    console.warn("MongoDB bookings fetch failed, falling back to local:", err);
  }
  return getStoredLocalBookings();
}

export async function GET() {
  const bookings = await getLiveBookings();
  return NextResponse.json({
    success: true,
    count: bookings.length,
    bookings,
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
      status: "جديد",
    };

    // Save to local file
    const current = getStoredLocalBookings();
    current.unshift(newBooking);
    saveLocalBookings(current);

    // Save to MongoDB Atlas
    try {
      const conn = await connectToDatabase();
      if (conn) {
        await BookingModel.create(newBooking);
      }
    } catch (dbErr) {
      console.error("Error saving booking to MongoDB:", dbErr);
    }

    const whatsappUrl = buildWhatsAppLink(waTarget, {
      name: newBooking.name,
      phone: newBooking.phone,
      department: newBooking.department,
      date: newBooking.date,
      message: newBooking.message,
    });

    return NextResponse.json({
      success: true,
      message: "تم تسجيل طلبك بنجاح، فريقنا سيتواصل معك فوراً.",
      booking: newBooking,
      whatsappUrl,
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

    // Update local file
    const bookings = getStoredLocalBookings();
    const target = bookings.find((b) => b.id === id);
    if (target) {
      target.status = status;
      saveLocalBookings(bookings);
    }

    // Update MongoDB
    try {
      const conn = await connectToDatabase();
      if (conn) {
        await BookingModel.updateOne({ id }, { $set: { status } });
      }
    } catch (dbErr) {
      console.error("Error updating booking status in MongoDB:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الحجز بنجاح.",
      booking: target || { id, status },
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

    // Delete from local file
    let bookings = getStoredLocalBookings();
    bookings = bookings.filter((b) => b.id !== id);
    saveLocalBookings(bookings);

    // Delete from MongoDB
    try {
      const conn = await connectToDatabase();
      if (conn) {
        await BookingModel.deleteOne({ id });
      }
    } catch (dbErr) {
      console.error("Error deleting booking from MongoDB:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الحجز بنجاح.",
    });
  } catch (err: unknown) {
    console.error("Error deleting booking:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء الحذف." },
      { status: 500 }
    );
  }
}
