import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

// Helper to check if requester is an admin
async function isAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("tk_user_session");
  if (!sessionCookie?.value) return false;
  try {
    let userObj;
    try {
      userObj = JSON.parse(sessionCookie.value);
    } catch {
      userObj = JSON.parse(decodeURIComponent(sessionCookie.value));
    }
    return userObj?.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    const list = await db.getTransactions();
    return NextResponse.json({ success: true, transactions: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
