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
      return NextResponse.redirect(new URL("/", req.url));
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
    return NextResponse.redirect(new URL("/", req.url));
  }
}
