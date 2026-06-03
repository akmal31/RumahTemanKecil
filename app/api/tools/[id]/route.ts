import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const updatedUser = await db.updateTool(id, data);
    return NextResponse.json(updatedUser);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const success = await db.deleteTool(id);
    return NextResponse.json({ success });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
