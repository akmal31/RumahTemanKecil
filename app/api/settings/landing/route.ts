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
    const list = await db.getLandingPages();
    return NextResponse.json({ success: true, landingPages: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { slug, htmlContent } = await req.json();
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }
    if (!htmlContent) {
      return NextResponse.json({ success: false, error: "HTML Content is required" }, { status: 400 });
    }

    // Clean slug
    let cleanSlug = slug.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
    if (cleanSlug.includes("/")) {
      return NextResponse.json({ success: false, error: "Slug cannot contain nested paths" }, { status: 400 });
    }

    // Reserved paths check
    const reserved = ["admin", "dashboard", "explore", "login", "api", "_next", "favicon.ico"];
    if (reserved.includes(cleanSlug)) {
      return NextResponse.json({ success: false, error: `Slug '${cleanSlug}' is a reserved path name` }, { status: 400 });
    }

    await db.saveLandingPage(cleanSlug, htmlContent);
    return NextResponse.json({ success: true, slug: cleanSlug });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    await db.deleteLandingPage(slug);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
