import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email") || "user@gmail.com";
    const name = url.searchParams.get("name") || "Guest User";
    const picture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

    const user = await db.getOrCreateUser(email, name, picture, "user");

    const redirectUrl = new URL("/explore?auth_success=true", req.url);
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("tk_user_session", JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "none",
      secure: true,
    });

    return response;
  } catch (err: any) {
    return NextResponse.redirect(new URL("/?auth_error=mock_error", req.url));
  }
}
