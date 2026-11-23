import mongoose, { Schema, Model } from "mongoose";
import { SiteContent } from "@/lib/content-types";

export interface ISiteContentDoc {
  identifier: string;
  data: SiteContent;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContentDoc>(
  {
    identifier: { type: String, required: true, unique: true, default: "main_content" },
    data: { type: Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "site_content" }
);

export const SiteContentModel: Model<ISiteContentDoc> =
  mongoose.models.SiteContent || mongoose.model<ISiteContentDoc>("SiteContent", SiteContentSchema);
