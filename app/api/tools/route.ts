import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const tools = await db.getTools();
  return NextResponse.json(tools);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newTool = await db.createTool(data);
    return NextResponse.json(newTool);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
