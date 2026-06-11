import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("tk_user_session");

  if (sessionCookie?.value) {
    try {
      // Try parsing directly then try decoding if needed
      let userObj;
      try {
        userObj = JSON.parse(sessionCookie.value);
      } catch (err) {
        userObj = JSON.parse(decodeURIComponent(sessionCookie.value));
      }

      if (userObj?.email) {
        // Source of truth is database status!
        const isLoggedIn = await db.checkUserLoginStatus(userObj.email);
        if (!isLoggedIn) {
          // If logged out anywhere else in the DB, invalidate local session
          const response = NextResponse.json({ authenticated: false, message: "Session expired elsewhere" }, { status: 401 });
          response.cookies.set("tk_user_session", "", {
            path: "/",
            expires: new Date(0),
            httpOnly: false,
            secure: true,
            sameSite: "none",
          });
          return response;
        }
      }

      return NextResponse.json({ authenticated: true, user: userObj });
    } catch (e: any) {
      return NextResponse.json(
        { authenticated: false, error: e.message },
        { status: 401 },
      );
    }
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("tk_user_session");
  
  if (sessionCookie?.value) {
    try {
      let userObj;
      try {
        userObj = JSON.parse(sessionCookie.value);
      } catch (err) {
        userObj = JSON.parse(decodeURIComponent(sessionCookie.value));
      }
      if (userObj?.userId) {
        await db.logoutUser(userObj.userId);
      }
    } catch (e) {}
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("tk_user_session", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });
  return response;
}
