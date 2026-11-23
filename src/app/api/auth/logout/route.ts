import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "تم تسجيل الخروج بنجاح"
  });

  response.cookies.set({
    name: "mafteeh_admin_session",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0
  });

  return response;
}
