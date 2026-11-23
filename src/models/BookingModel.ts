import mongoose, { Schema, Model } from "mongoose";

export interface IBookingDoc {
  id: string;
  name: string;
  phone: string;
  department: string;
  date?: string;
  message?: string;
  targetNumber: string;
  createdAt: string;
  status: "جديد" | "قيد المراجعة" | "مكتمل";
}

const BookingSchema = new Schema<IBookingDoc>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    department: { type: String, default: "عام" },
    date: { type: String, default: "" },
    message: { type: String, default: "" },
    targetNumber: { type: String, default: "0918536828" },
    createdAt: { type: String, default: () => new Date().toISOString() },
    status: {
      type: String,
      enum: ["جديد", "قيد المراجعة", "مكتمل"],
      default: "جديد",
    },
  },
  { collection: "bookings" }
);

export const BookingModel: Model<IBookingDoc> =
  mongoose.models.Booking || mongoose.model<IBookingDoc>("Booking", BookingSchema);
