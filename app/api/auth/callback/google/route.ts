import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;
    const appUrl = (process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL") 
      ? process.env.APP_URL 
      : origin;
    const redirectUri = `${appUrl}/api/auth/callback/google`;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!code) {
      return NextResponse.redirect(new URL("/?auth_error=missing_code", appUrl));
    }

    // Fallback if client credentials are not defined
    if (!clientId || !clientSecret) {
      const fallbackEmail = "devsession@gmail.com";
      const fallbackName = "Developer TemanKecil";
      const user = await db.getOrCreateUser(
        fallbackEmail,
        fallbackName,
        `https://picsum.photos/seed/devsession/100/100`,
        "user",
      );

      const response = NextResponse.redirect(
        new URL("/explore?auth_success=true", appUrl),
      );
      response.cookies.set("tk_user_session", JSON.stringify(user), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "none",
        secure: true,
      });
      return response;
    }

    // Real OAuth Token Exchange
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(
        new URL(`/?auth_error=exchange_failed`, appUrl),
      );
    }

    const { access_token } = await tokenRes.json();
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    if (!userRes.ok) {
      return NextResponse.redirect(
        new URL(`/?auth_error=profile_failed`, appUrl),
      );
    }

    const googleUser = await userRes.json();
    if (!googleUser.email) {
      return NextResponse.redirect(new URL(`/?auth_error=no_email`, appUrl));
    }

    const name = googleUser.name || "Google User";
    const user = await db.getOrCreateUser(
      googleUser.email,
      name,
      googleUser.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      "user",
    );

    const response = NextResponse.redirect(
      new URL("/explore?auth_success=true", appUrl),
    );
    response.cookies.set("tk_user_session", JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "none",
      secure: true,
    });
    return response;
  } catch (error: any) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;
    const appUrl = (process.env.APP_URL && process.env.APP_URL !== "MY_APP_URL") 
      ? process.env.APP_URL 
      : origin;
    return NextResponse.redirect(new URL(`/?auth_error=server_error`, appUrl));
  }
}
