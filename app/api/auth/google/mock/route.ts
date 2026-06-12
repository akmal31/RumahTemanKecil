import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email") || "user@gmail.com";
    const name = url.searchParams.get("name") || "Guest User";
    const picture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;
    const appUrl = (process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL") 
      ? process.env.APP_URL 
      : origin;

    const user = await db.getOrCreateUser(email, name, picture, "user");

    const redirectParam = url.searchParams.get("redirect") || "";
    let redirectUrl: URL;
    if (redirectParam) {
      try {
        redirectUrl = new URL(redirectParam, appUrl);
      } catch {
        redirectUrl = new URL(redirectParam.startsWith("/") ? redirectParam : `/${redirectParam}`, appUrl);
      }
      redirectUrl.searchParams.set("auth_success", "true");
    } else {
      redirectUrl = new URL("/explore?auth_success=true", appUrl);
    }
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set("tk_user_session", JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "none",
      secure: true,
    });

    return response;
  } catch (err: any) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;
    const appUrl = (process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL") 
      ? process.env.APP_URL 
      : origin;
    return NextResponse.redirect(new URL("/?auth_error=mock_error", appUrl));
  }
}
