import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  isDepartmentForFaculty,
  isFaculty,
} from "@/lib/candidate-options";
import { query } from "@/lib/db";

type ProfileBody = {
  phone?: unknown;
  faculty?: unknown;
  department?: unknown;
  studentId?: unknown;
};

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "candidate") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await query(
    "SELECT id FROM candidates WHERE user_id = $1",
    [session.user.id],
  );

  return NextResponse.json({ complete: (result.rowCount ?? 0) > 0 });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "candidate") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProfileBody;
  try {
    body = (await request.json()) as ProfileBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const phone = readText(body.phone);
  const faculty = readText(body.faculty);
  const department = readText(body.department);
  const studentId = readText(body.studentId).toUpperCase();

  if (!phone || !faculty || !department || !studentId) {
    return NextResponse.json(
      { error: "Please complete all required fields" },
      { status: 400 },
    );
  }

  if (phone.length > 11) {
    return NextResponse.json(
      { error: "Contact number cannot exceed 11 characters" },
      { status: 400 },
    );
  }

  if (!/^\d{6}[A-Z]$/.test(studentId)) {
    return NextResponse.json(
      { error: "Student ID must contain 6 digits followed by one letter" },
      { status: 400 },
    );
  }

  if (!isFaculty(faculty) || !isDepartmentForFaculty(faculty, department)) {
    return NextResponse.json(
      { error: "Select a valid faculty and department" },
      { status: 400 },
    );
  }

  try {
    await query(
      `INSERT INTO candidates
        (user_id, student_id, faculty, department, contact_number)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE
       SET student_id = EXCLUDED.student_id,
           faculty = EXCLUDED.faculty,
           department = EXCLUDED.department,
           contact_number = EXCLUDED.contact_number`,
      [session.user.id, studentId, faculty, department, phone],
    );

    return NextResponse.json({
      success: true,
      message: "Candidate profile completed successfully",
    });
  } catch (error: unknown) {
    console.error("Candidate profile completion error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        { error: "This student ID is already registered" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Unable to complete your profile. Please try again." },
      { status: 500 },
    );
  }
}
