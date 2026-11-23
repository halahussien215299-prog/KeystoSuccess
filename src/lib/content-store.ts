import fs from "fs";
import path from "path";
import { SiteContent, getInitialContent } from "./content-types";

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
