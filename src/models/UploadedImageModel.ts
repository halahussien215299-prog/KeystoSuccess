import mongoose, { Schema, Model } from "mongoose";

export interface IUploadedImageDoc {
  filename: string;
  contentType: string;
  data: string; // Base64 data string
  size: number;
  createdAt: Date;
}

const UploadedImageSchema = new Schema<IUploadedImageDoc>(
  {
    filename: { type: String, required: true, unique: true },
    contentType: { type: String, required: true },
    data: { type: String, required: true },
    size: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "uploaded_images" }
);

export const UploadedImageModel: Model<IUploadedImageDoc> =
  mongoose.models.UploadedImage ||
  mongoose.model<IUploadedImageDoc>("UploadedImage", UploadedImageSchema);
