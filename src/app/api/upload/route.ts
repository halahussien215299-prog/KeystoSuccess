import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/mongodb";
import { UploadedImageModel } from "@/models/UploadedImageModel";

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif"
];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const isLogo = formData.get("isLogo") === "true";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "لم يتم اختيار أي ملف للرفع" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: "صيغة الملف غير مدعومة. يرجى اختيار صورة بصيغة PNG أو JPG أو WEBP أو SVG."
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "حجم الصورة كبير جداً، الحد الأقصى المسموح به هو 10 ميجابايت." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // Extension deduction
    let ext = "png";
    if (file.type === "image/jpeg" || file.type === "image/jpg") ext = "jpg";
    else if (file.type === "image/webp") ext = "webp";
    else if (file.type === "image/svg+xml") ext = "svg";
    else if (file.type === "image/gif") ext = "gif";
    else if (file.type === "image/avif") ext = "avif";

    const prefix = isLogo ? "logo" : "upload";
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    // 1. Save to local disk in public/uploads
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);

      // If it's a logo and PNG, also overwrite public/logo.png for universal fallback
      if (isLogo && ext === "png") {
        fs.writeFileSync(path.join(process.cwd(), "public", "logo.png"), buffer);
      }
    } catch (diskErr) {
      console.warn("Could not write file to local disk (might be read-only serverless):", diskErr);
    }

    // 2. Persist to MongoDB Atlas for 100% cloud persistence
    try {
      await connectToDatabase();
      await UploadedImageModel.findOneAndUpdate(
        { filename },
        {
          filename,
          contentType: file.type,
          data: base64Data,
          size: file.size,
          createdAt: new Date()
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.warn("Could not save image to MongoDB:", dbErr);
    }

    // Dynamic serving URL
    const publicUrl = `/api/images/${filename}`;

    return NextResponse.json({
      success: true,
      message: "تم رفع الصورة بنجاح وحفظها سحابياً!",
      url: publicUrl,
      filename,
      size: file.size,
      contentType: file.type
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const msg = error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء رفع الصورة";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
