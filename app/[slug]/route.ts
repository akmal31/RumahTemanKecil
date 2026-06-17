import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Prevent matching static or asset paths
    if (
      !slug ||
      slug.includes(".") ||
      ["admin", "dashboard", "explore", "login", "checkout", "api", "static", "_next"].includes(slug)
    ) {
      return new Response("Not Found", { status: 404 });
    }

    const landingPage = await db.getLandingPage(slug);
    if (!landingPage) {
      // If no page matches, redirect to homepage cleanly
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
      const proto = req.headers.get("x-forwarded-proto") || "http";
      const origin = `${proto}://${host}`;
      return NextResponse.redirect(new URL("/", origin));
    }

    // Serve raw, custom-uploaded HTML with proper headers
    return new Response(landingPage.htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const origin = `${proto}://${host}`;
    return NextResponse.redirect(new URL("/", origin));
  }
}
