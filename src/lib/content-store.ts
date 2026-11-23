import fs from "fs";
import path from "path";
import { SiteContent, getInitialContent } from "./content-types";
import { connectToDatabase } from "./mongodb";
import { SiteContentModel } from "@/models/SiteContentModel";

export * from "./content-types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

export function readSiteContent(): SiteContent {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CONTENT_FILE)) {
      const initial = getInitialContent();
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(CONTENT_FILE, "utf8");
    return JSON.parse(raw) as SiteContent;
  } catch (error) {
    console.error("Error reading site-content.json:", error);
    return getInitialContent();
  }
}

export async function getLiveSiteContent(): Promise<SiteContent> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await SiteContentModel.findOne({ identifier: "main_content" }).lean();
      if (doc && doc.data) {
        return doc.data as SiteContent;
      }
    }
  } catch (err) {
    console.warn("MongoDB content fetch failed, using fallback:", err);
  }
  return readSiteContent();
}

export function saveSiteContent(content: SiteContent): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error saving site-content.json:", error);
    return false;
  }
}

export async function saveLiveSiteContent(content: SiteContent): Promise<boolean> {
  // Always save to local JSON file for local persistence/cache
  saveSiteContent(content);

  try {
    const conn = await connectToDatabase();
    if (conn) {
      await SiteContentModel.updateOne(
        { identifier: "main_content" },
        { $set: { identifier: "main_content", data: content, updatedAt: new Date() } },
        { upsert: true }
      );
      return true;
    }
  } catch (err) {
    console.error("Error saving content to MongoDB:", err);
  }
  return true;
}
