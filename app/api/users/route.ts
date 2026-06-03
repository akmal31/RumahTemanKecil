import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const users = await db.getUsers();
  return NextResponse.json(users);
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, ...updates } = data;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const success = await db.updateUser(userId, updates);
    return NextResponse.json({ success });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
