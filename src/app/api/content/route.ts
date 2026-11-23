import { NextRequest, NextResponse } from "next/server";
import { readSiteContent, saveSiteContent, SiteContent } from "@/lib/content-store";

export async function GET() {
  const content = readSiteContent();
  return NextResponse.json({
    success: true,
    content
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const current = readSiteContent();
    const updated: SiteContent = {
      ...current,
      ...body
    };

    const saved = saveSiteContent(updated);
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "تعذر حفظ التغييرات على الخادم" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث محتوى الموقع بنجاح!",
      content: updated
    });
  } catch (err: unknown) {
    console.error("Error updating content:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
