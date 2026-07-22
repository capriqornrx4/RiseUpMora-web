import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/lib/db";

export const runtime = "nodejs";

async function getCandidateSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "candidate") return null;
  return session;
}

/**
 * GET /api/v1/candidate/check-field?field=phone|studentId&value=...
 *
 * Checks whether a given value is already used by another candidate account.
 * Only `phone` and `studentId` are supported (name duplicates are allowed).
 * Returns { available: true } if no conflict, { available: false } if taken.
 */
export async function GET(request: Request) {
  const session = await getCandidateSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const field = searchParams.get("field");
  const value = (searchParams.get("value") ?? "").trim();

  if (field !== "phone" && field !== "studentId") {
    return NextResponse.json(
      { error: "Invalid field — only 'phone' and 'studentId' can be checked" },
      { status: 400 },
    );
  }

  // Empty values are not checked (they're optional fields)
  if (!value) {
    return NextResponse.json({ available: true });
  }

  const column = field === "phone" ? "contact_number" : "student_id";

  try {
    const result = await query(
      `SELECT 1
         FROM candidates
        WHERE ${column} = $1
          AND user_id != $2
        LIMIT 1`,
      [value, session.user.id],
    );

    return NextResponse.json({ available: (result.rowCount ?? 0) === 0 });
  } catch (error: unknown) {
    console.error("Field uniqueness check error:", error);
    return NextResponse.json(
      { error: "Unable to check field availability" },
      { status: 500 },
    );
  }
}
