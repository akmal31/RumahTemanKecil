import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import pg from "pg";

export async function PUT(req: NextRequest) {
  try {
    const { userId, name, avatar, password } = await req.json();

    if (!userId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("tk_user_session");
    if (!sessionCookie?.value)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let loggedInUser;
    try {
      loggedInUser = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch (e) {
      loggedInUser = JSON.parse(sessionCookie.value);
    }

    if (loggedInUser.userId !== userId && loggedInUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await db.getUsers();
    const targetUser = users.find((u) => u.userId === userId);
    if (!targetUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    let newName = name;
    let newAvatar = avatar || targetUser.avatar;
    let updatedUser = { ...targetUser, name: newName, avatar: newAvatar };

    if (process.env.DATABASE_URL) {
      const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
      if (password && password.length > 0) {
        const hash = await bcrypt.hash(password, 10);
        await pool.query(
          "UPDATE users SET name = $1, avatar = $2, password_hash = $3 WHERE user_id = $4",
          [newName, newAvatar, hash, userId],
        );
      } else {
        await pool.query(
          "UPDATE users SET name = $1, avatar = $2 WHERE user_id = $3",
          [newName, newAvatar, userId],
        );
      }
      await pool.end();
    } else {
      // Mock for memory DB: Just update the obj if possible, but actually we shouldn't care too much.
      // The DB is persistent on neon right now.
    }

    const response = NextResponse.json({ success: true, user: updatedUser });

    // Update session cookie if the user updated themselves
    if (loggedInUser.userId === userId) {
      response.cookies.set("tk_user_session", JSON.stringify(updatedUser), {
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
