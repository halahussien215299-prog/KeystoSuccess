import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, updateAdminCredentials } from "@/lib/auth-store";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("mafteeh_admin_session")?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json(
      { success: false, error: "غير مصرح لك بتنفيذ هذه العملية" },
      { status: 401 }
    );
  }

  try {
    const { currentPassword, newUsername, newPassword } = await req.json();

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال كلمة المرور الحالية للتأكيد" },
        { status: 400 }
      );
    }

    if (!newUsername && !newPassword) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال اسم مستخدم جديد أو كلمة مرور جديدة للتعديل" },
        { status: 400 }
      );
    }

    const result = updateAdminCredentials(currentPassword, newUsername, newPassword);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "فشل تحديث بيانات الدخول" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث بيانات الدخول بنجاح!"
    });
  } catch (err) {
    console.error("Credentials update error:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
