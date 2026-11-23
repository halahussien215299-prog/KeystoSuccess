import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "@/lib/mongodb";
import { UploadedImageModel } from "@/models/UploadedImageModel";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    if (!filename || filename.includes("..") || filename.includes("/")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    // 1. Try reading from public/uploads
    const localFilePath = path.join(process.cwd(), "public", "uploads", filename);
    if (fs.existsSync(localFilePath)) {
      const fileBuffer = fs.readFileSync(localFilePath);
      const ext = path.extname(filename).toLowerCase().replace(".", "");
      let contentType = "image/png";
      if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
      else if (ext === "webp") contentType = "image/webp";
      else if (ext === "svg") contentType = "image/svg+xml";
      else if (ext === "gif") contentType = "image/gif";
      else if (ext === "avif") contentType = "image/avif";

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // 2. Try fetching from MongoDB Atlas
    await connectToDatabase();
    const doc = await UploadedImageModel.findOne({ filename });
    if (doc && doc.data) {
      const buffer = Buffer.from(doc.data, "base64");
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": doc.contentType || "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse("Image Not Found", { status: 404 });
  } catch (error) {
    console.error("Error serving uploaded image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
