import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const jwtSecret = process.env.NEXTAUTH_SECRET || "default_secret";
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const { userId, hashCheck } = decoded;

    // Fetch user to verify the hash hasn't changed (prevents token reuse)
    const userRes = await query("SELECT password_hash FROM users WHERE id = $1", [userId]);
    if (userRes.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentHash = userRes.rows[0].password_hash;
    
    // Check if the hash matches the snippet in the token. 
    // If it doesn't match, it means the password was already changed.
    if (currentHash.substring(0, 15) !== hashCheck) {
      return NextResponse.json({ error: "This invitation link has already been used" }, { status: 400 });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 10);

    // Update the password in the database
    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [newPasswordHash, userId]);

    return NextResponse.json({ success: true, message: "Account setup successfully!" });

  } catch (error: any) {
    console.error("Setup account error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
