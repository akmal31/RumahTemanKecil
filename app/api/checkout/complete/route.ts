import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMetaEvent } from "@/lib/meta-tracker";

// Helper to update password_hash on guest user creations
async function setTemporaryGuestPassword(userId: string) {
  try {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("TemanKecil123!", 10);
    // Directly inject hash to the newly created user in PostgreSQL pool
    const p = (db as any).getPool ? (db as any).getPool() : null;
    if (p) {
      await p.query("UPDATE users SET password_hash = $1 WHERE user_id = $2", [hash, userId]);
    } else {
      // Memory db fallback
      const memoryDb = (global as any).memoryDb || { users: [] };
      const matchedIdx = memoryDb.users.findIndex((u: any) => u.userId === userId);
      if (matchedIdx >= 0) {
        memoryDb.users[matchedIdx].passwordHash = hash;
      }
    }
  } catch (err) {
    console.error("Error setting guest password:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Transaction ID is required." }, { status: 400 });
    }

    // Complete transaction in DB
    const tx = await db.completeTransaction(id);
    if (!tx) {
      return NextResponse.json({ success: false, error: "Transaction not found." }, { status: 404 });
    }

    // Fire Meta Conversions API (Purchase) event
    await sendMetaEvent(
      "Purchase",
      { email: tx.email, phone: tx.phone, name: tx.name, userId: tx.email },
      {
        value: Number(tx.amount),
        currency: "IDR",
        content_name: tx.packageName,
        content_category: "Tokens",
        content_ids: [tx.id]
      },
      req.url
    );

    // 1. Get or Create user based on email (creates user if they don't exist)
    const user = await db.getOrCreateUser(
      tx.email,
      tx.name,
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    );

    if (!user) {
      return NextResponse.json({ success: false, error: "Gagal memproses alokasi akun." }, { status: 500 });
    }

    // 2. Add credits
    const currentCredit = user.credit || 0;
    const newCredit = currentCredit + tx.credits;
    await db.updateUser(user.userId, { credit: newCredit });

    // 3. Check if user is newly created or missing password (e.g. checked out from landing page)
    // We check if password_hash exists on database, if not we provision "TemanKecil123!"
    let isNewUserWithoutPassword = false;
    const p = (db as any).getPool ? (db as any).getPool() : null;
    if (p) {
      const uCheck = await p.query("SELECT password_hash FROM users WHERE user_id = $1", [user.userId]);
      if (uCheck.rows.length > 0 && !uCheck.rows[0].password_hash) {
        isNewUserWithoutPassword = true;
      }
    } else {
      const memoryDb = (global as any).memoryDb || { users: [] };
      const uCheck = memoryDb.users.find((u: any) => u.userId === user.userId);
      if (uCheck && !uCheck.passwordHash) {
        isNewUserWithoutPassword = true;
      }
    }

    let temporaryPassword = "";
    if (isNewUserWithoutPassword) {
      temporaryPassword = "TemanKecil123!";
      await setTemporaryGuestPassword(user.userId);
    }

    return NextResponse.json({
      success: true,
      transaction: {
        ...tx,
        temporaryPassword
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
