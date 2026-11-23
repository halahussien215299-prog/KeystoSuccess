import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, getAdminCredentials } from "@/lib/auth-store";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("mafteeh_admin_session")?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({
      authenticated: false
    });
  }

  const creds = getAdminCredentials();
  return NextResponse.json({
    authenticated: true,
    username: creds.username
  });
}
