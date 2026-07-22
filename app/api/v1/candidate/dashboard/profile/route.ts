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

export async function PATCH(request: Request) {
  const session = await getCandidateSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Track which queries we need to run
  let updateName = false;
  let nameValue = "";

  const candidateUpdates: string[] = [];
  const candidateValues: unknown[] = [];
  let paramIndex = 1;

  // Process and validate only fields that are provided in the body
  if ("name" in body) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
    if (name.length > 200) return NextResponse.json({ error: "Name cannot exceed 200 characters" }, { status: 400 });
    updateName = true;
    nameValue = name;
  }

  if ("phone" in body) {
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    if (phone && !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Phone number must be exactly 10 digits" }, { status: 400 });
    }
    candidateUpdates.push(`contact_number = $${paramIndex++}`);
    candidateValues.push(phone || null);
  }

  if ("studentId" in body) {
    const studentId = typeof body.studentId === "string" ? body.studentId.trim() : "";
    if (studentId && !/^\d{6}[A-Z]$/.test(studentId)) {
      return NextResponse.json({ error: "University ID must be 6 digits followed by 1 uppercase letter" }, { status: 400 });
    }
    candidateUpdates.push(`student_id = $${paramIndex++}`);
    candidateValues.push(studentId || null);
  }

  if ("faculty" in body) {
    const faculty = typeof body.faculty === "string" ? body.faculty.trim() : "";
    if (faculty.length > 200) return NextResponse.json({ error: "Faculty name is too long" }, { status: 400 });
    candidateUpdates.push(`faculty = $${paramIndex++}`);
    candidateValues.push(faculty || null);
  }

  if ("department" in body) {
    const department = typeof body.department === "string" ? body.department.trim() : "";
    if (department.length > 200) return NextResponse.json({ error: "Department name is too long" }, { status: 400 });
    candidateUpdates.push(`department = $${paramIndex++}`);
    candidateValues.push(department || null);
  }

  try {
    if (updateName) {
      await query(
        `UPDATE users SET name = $1 WHERE id = $2`,
        [nameValue, session.user.id],
      );
    }

    if (candidateUpdates.length > 0) {
      candidateValues.push(session.user.id);
      await query(
        `UPDATE candidates
         SET ${candidateUpdates.join(", ")}
         WHERE user_id = $${paramIndex}`,
        candidateValues,
      );
    }

    return NextResponse.json({ success: true, message: "Profile field updated" });
  } catch (error: unknown) {
    console.error("Profile field update error:", error);
    return NextResponse.json(
      { error: "Unable to update profile. Please try again." },
      { status: 500 },
    );
  }
}
