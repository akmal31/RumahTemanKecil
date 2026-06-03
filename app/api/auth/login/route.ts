import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await db.verifyUser(email, password);

    if (user) {
      const response = NextResponse.json({ success: true, user });
      response.cookies.set("tk_user_session", JSON.stringify(user), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "none",
        secure: true,
      });
      return response;
    }
    return NextResponse.json(
      { error: "Email atau password salah" },
      { status: 401 },
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
