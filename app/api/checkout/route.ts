import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, phone, packageName, credits, amount, source } = await req.json();
    
    if (!id || !name || !email || !phone || !packageName || !credits || !amount || !source) {
      return NextResponse.json({ success: false, error: "Harap isi semua properti transaksi dengan lengkap." }, { status: 400 });
    }

    // Register pending transaction in DB
    await db.createTransaction({
      id,
      name,
      email,
      phone,
      packageName,
      credits,
      amount,
      source
    });

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
