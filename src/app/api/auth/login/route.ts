import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, generateSessionToken } from "@/lib/auth-store";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال اسم المستخدم وكلمة المرور" },
        { status: 400 }
      );
    }

    const isValid = verifyCredentials(username.trim(), password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const token = generateSessionToken(username.trim());
    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      username: username.trim()
    });

    response.cookies.set({
      name: "mafteeh_admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "lax"
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع في الخادم" },
      { status: 500 }
    );
  }
}
