import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

type SetupToken = JwtPayload & {
  userId?: string;
  hashCheck?: string;
  purpose?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: unknown;
      password?: unknown;
    };
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const jwtSecret = process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      console.error("Account setup requires NEXTAUTH_SECRET");
      return NextResponse.json(
        { error: "Account setup is temporarily unavailable" },
        { status: 503 },
      );
    }

    let decoded: SetupToken;
    try {
      const payload = jwt.verify(token, jwtSecret);
      if (typeof payload === "string") throw new Error("Invalid token payload");
      decoded = payload as SetupToken;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    const { userId, hashCheck, purpose } = decoded;
    if (!userId || !hashCheck) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const userResult = await query(
      "SELECT password_hash, role FROM users WHERE id = $1",
      [userId],
    );
    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0] as {
      password_hash: string | null;
      role: string;
    };
    if (!user.password_hash || user.password_hash.substring(0, 15) !== hashCheck) {
      return NextResponse.json(
        { error: "This verification link has already been used" },
        { status: 400 },
      );
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 10);

    // Update the password and mark email as verified (only if it hasn't been verified before)
    await query(
      "UPDATE users SET password_hash = $1, email_verified_at = COALESCE(email_verified_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP WHERE id = $2", 
      [newPasswordHash, userId]
    );

    return NextResponse.json({
      success: true,
      role: user.role,
      message: "Email verified and account setup completed",
    });
  } catch (error: unknown) {
    console.error("Setup account error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
