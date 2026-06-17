import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMetaEvent } from "@/lib/meta-tracker";

// Helper to update password_hash on guest user creations
async function setTemporaryGuestPassword(userId: string) {
  try {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.hash("TemanKecil123!", 10);
    const p = (db as any).getPool ? (db as any).getPool() : null;
    if (p) {
      await p.query("UPDATE users SET password_hash = $1 WHERE user_id = $2", [hash, userId]);
    } else {
      const memoryDb = (global as any).memoryDb || { users: [] };
      const matchedIdx = memoryDb.users.findIndex((u: any) => u.userId === userId);
      if (matchedIdx >= 0) {
        memoryDb.users[matchedIdx].passwordHash = hash;
      }
    }
  } catch (err) {
    console.error("Error setting guest password in webhook:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    let referenceId = "";
    let status = "";
    let trxId = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      referenceId = (formData.get("reference_id") as string) || (formData.get("reference") as string) || "";
      status = (formData.get("status") as string) || "";
      trxId = (formData.get("trx_id") as string) || "";
    } else {
      const body = await req.json().catch(() => ({}));
      referenceId = body.reference_id || body.reference || "";
      status = body.status || "";
      trxId = body.trx_id || "";
    }

    if (!referenceId) {
      return NextResponse.json({ success: false, error: "Reference ID is required." }, { status: 400 });
    }

    // Check if status is successful (berhasil or completed or success)
    if (
      status.toLowerCase() !== "berhasil" &&
      status.toLowerCase() !== "completed" &&
      status.toLowerCase() !== "success"
    ) {
      return NextResponse.json({ success: true, message: `Ignored status: ${status}` });
    }

    // Check if transaction is already completed to prevent duplicate credits allocation
    const transactions = await db.getTransactions();
    const existingTx = transactions.find((t) => t.id === referenceId);
    if (existingTx && existingTx.status === "completed") {
      return NextResponse.json({ success: true, message: "Transaction already processed." });
    }

    // Mark transaction as paid (completed) in DB
    const tx = await db.completeTransaction(referenceId);
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
        content_ids: [tx.id],
      },
      req.url
    );

    // Get or Create user based on email (attaches credit package securely)
    const user = await db.getOrCreateUser(
      tx.email,
      tx.name,
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    );

    if (user) {
      // Add credits
      const currentCredit = user.credit || 0;
      const newCredit = currentCredit + tx.credits;
      await db.updateUser(user.userId, { credit: newCredit });

      // Automatically setting a default temporary password if the user was newly created without one
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

      if (isNewUserWithoutPassword) {
        await setTemporaryGuestPassword(user.userId);
      }
    }

    return NextResponse.json({ success: true, message: "Transaction completed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
