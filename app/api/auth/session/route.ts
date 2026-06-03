import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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
