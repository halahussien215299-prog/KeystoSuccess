import fs from "fs";
import path from "path";
import crypto from "crypto";
import { connectToDatabase } from "./mongodb";
import { AdminUserModel, IAdminUserDoc } from "@/models/AdminUserModel";

const DATA_DIR = path.join(process.cwd(), "data");
const AUTH_FILE = path.join(DATA_DIR, "admin-auth.json");

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export function getAdminCredentials(): AdminCredentials {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(AUTH_FILE)) {
      const defaultSalt = crypto.randomBytes(16).toString("hex");
      const defaultCreds: AdminCredentials = {
        username: "admin",
        passwordHash: hashPassword("admin123", defaultSalt),
        salt: defaultSalt,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(AUTH_FILE, JSON.stringify(defaultCreds, null, 2), "utf8");
      return defaultCreds;
    }
    const raw = fs.readFileSync(AUTH_FILE, "utf8");
    return JSON.parse(raw) as AdminCredentials;
  } catch (err) {
    console.error("Error reading admin auth file:", err);
    const salt = crypto.randomBytes(16).toString("hex");
    return {
      username: "admin",
      passwordHash: hashPassword("admin123", salt),
      salt,
      updatedAt: new Date().toISOString()
    };
  }
}

export async function getLiveAdminCredentials(): Promise<AdminCredentials> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const doc = await AdminUserModel.findOne({}).lean();
      if (doc) {
        return {
          username: doc.username,
          passwordHash: doc.passwordHash,
          salt: doc.salt,
          updatedAt: doc.updatedAt,
        };
      }
    }
  } catch (err) {
    console.warn("MongoDB auth fetch failed, falling back to local:", err);
  }
  return getAdminCredentials();
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const creds = await getLiveAdminCredentials();
  if (creds.username !== username) {
    return false;
  }
  const inputHash = hashPassword(password, creds.salt);
  return inputHash === creds.passwordHash;
}

export async function updateAdminCredentials(
  currentPass: string,
  newUsername?: string,
  newPassword?: string
): Promise<{ success: boolean; error?: string }> {
  const creds = await getLiveAdminCredentials();
  const inputHash = hashPassword(currentPass, creds.salt);
  if (inputHash !== creds.passwordHash) {
    return { success: false, error: "كلمة المرور الحالية غير صحيحة" };
  }

  const newSalt = crypto.randomBytes(16).toString("hex");
  const updated: AdminCredentials = {
    username: newUsername && newUsername.trim() ? newUsername.trim() : creds.username,
    passwordHash: newPassword && newPassword.trim() ? hashPassword(newPassword.trim(), newSalt) : creds.passwordHash,
    salt: newPassword && newPassword.trim() ? newSalt : creds.salt,
    updatedAt: new Date().toISOString()
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(AUTH_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving updated credentials locally:", err);
  }

  try {
    const conn = await connectToDatabase();
    if (conn) {
      await AdminUserModel.updateOne(
        {},
        { $set: updated },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error("Error saving updated credentials to MongoDB:", err);
  }

  return { success: true };
}

export function generateSessionToken(username: string): string {
  const secret = process.env.AUTH_SECRET || "mafteeh-alnajah-secret-key-2026";
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64");
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [username, timestampStr, hmac] = decoded.split(":");
    if (!username || !timestampStr || !hmac) return false;

    const secret = process.env.AUTH_SECRET || "mafteeh-alnajah-secret-key-2026";
    const payload = `${username}:${timestampStr}`;
    const expectedHmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (hmac !== expectedHmac) return false;

    // Token expires in 7 days
    const timestamp = parseInt(timestampStr, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > maxAge) return false;

    return true;
  } catch {
    return false;
  }
}
