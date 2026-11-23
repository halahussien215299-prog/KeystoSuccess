import mongoose, { Schema, Model } from "mongoose";

export interface IAdminUserDoc {
  username: string;
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

const AdminUserSchema = new Schema<IAdminUserDoc>(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { collection: "admin_users" }
);

export const AdminUserModel: Model<IAdminUserDoc> =
  mongoose.models.AdminUser || mongoose.model<IAdminUserDoc>("AdminUser", AdminUserSchema);
