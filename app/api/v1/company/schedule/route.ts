import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

function addMinutes(timeStr: string, mins: number): string {
  const [hrs, mns] = timeStr.split(":").map(Number);
  let newMns = mns + mins;
  let newHrs = hrs + Math.floor(newMns / 60);
  newMns = newMns % 60;
  newHrs = newHrs % 24;
  return `${String(newHrs).padStart(2, "0")}:${String(newMns).padStart(2, "0")}`;
}

function formatTimeSlot(time24: string): string {
  const [hrs, mns] = time24.split(":").map(Number);
  const period = hrs >= 12 ? "PM" : "AM";
  const hr12 = hrs % 12 === 0 ? 12 : hrs % 12;
  return `${String(hr12).padStart(2, "0")}:${String(mns).padStart(2, "0")} ${period}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "company_coordinator") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // 1. Get coordinator's company_id
    const ccRes = await query(
      "SELECT company_id FROM company_coordinators WHERE user_id = $1",
      [session.user.id]
    );
    if (ccRes.rowCount === 0) {
      return NextResponse.json({ error: "No company associated with this coordinator account" }, { status: 400 });
    }
    const companyId = ccRes.rows[0].company_id;

    const body = await req.json();
    const { action } = body;

    if (action === "initialize") {
      const { date, startTime } = body;
      if (!date || !startTime) {
        return NextResponse.json({ error: "Date and start time are required" }, { status: 400 });
      }

      // Query 1st preference candidates in FCFS order
      const candidatesRes = await query(
        `SELECT id FROM candidates WHERE pref_1 = $1 ORDER BY created_at ASC`,
        [companyId]
      );

      if (candidatesRes.rowCount === 0) {
        return NextResponse.json({ error: "No candidates found who chose this company as their 1st preference" }, { status: 400 });
      }

      await query("BEGIN");
      try {
        for (let i = 0; i < candidatesRes.rows.length; i++) {
          const candidateId = candidatesRes.rows[i].id;
          const start = addMinutes(startTime, i * 30);
          const end = addMinutes(start, 30);
          const timeSlot = `${formatTimeSlot(start)} - ${formatTimeSlot(end)}`;

          await query(
            `INSERT INTO allocations (candidate_id, company_id, interview_date, time_slot, status)
             VALUES ($1, $2, $3, $4, '1')
             ON CONFLICT (candidate_id, company_id) DO UPDATE
             SET interview_date = EXCLUDED.interview_date,
                 time_slot = EXCLUDED.time_slot,
                 status = EXCLUDED.status`,
            [candidateId, companyId, date, timeSlot]
          );
        }
        await query("COMMIT");
      } catch (err) {
        await query("ROLLBACK");
        throw err;
      }

      return NextResponse.json({ success: true, message: "Schedule initialized successfully" });
    } else if (action === "save") {
      const { allocations } = body;
      if (!Array.isArray(allocations)) {
        return NextResponse.json({ error: "Allocations list must be an array" }, { status: 400 });
      }

      // Check duplicates
      const candidateIds = allocations.map((a: any) => a.candidateId);
      if (new Set(candidateIds).size !== candidateIds.length) {
        return NextResponse.json({ error: "Each candidate can only be scheduled once" }, { status: 400 });
      }

      // Get existing allocations maps to preserve panelists, panels, attendance
      const existingRes = await query(
        "SELECT candidate_id, panelist_id, panel_number, attendance FROM allocations WHERE company_id = $1",
        [companyId]
      );
      const existingMap = new Map(existingRes.rows.map((r) => [r.candidate_id, r]));

      await query("BEGIN");
      try {
        // Delete allocations for this company that are no longer in the list
        if (candidateIds.length > 0) {
          await query(
            "DELETE FROM allocations WHERE company_id = $1 AND NOT (candidate_id = ANY($2::uuid[]))",
            [companyId, candidateIds]
          );
        } else {
          await query("DELETE FROM allocations WHERE company_id = $1", [companyId]);
        }

        // Upsert updated list
        for (const alloc of allocations) {
          const existing = existingMap.get(alloc.candidateId);
          const panelistId = existing ? existing.panelist_id : null;
          const panelNumber = existing ? existing.panel_number : null;
          const attendance = existing ? existing.attendance : false;

          await query(
            `INSERT INTO allocations (candidate_id, company_id, interview_date, time_slot, status, panelist_id, panel_number, attendance)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (candidate_id, company_id) DO UPDATE
             SET interview_date = EXCLUDED.interview_date,
                 time_slot = EXCLUDED.time_slot,
                 status = EXCLUDED.status`,
            [alloc.candidateId, companyId, alloc.date, alloc.timeSlot, alloc.status, panelistId, panelNumber, attendance]
          );
        }
        await query("COMMIT");
      } catch (err) {
        await query("ROLLBACK");
        throw err;
      }

      return NextResponse.json({ success: true, message: "Schedule saved successfully" });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Schedule API error:", error);
    return NextResponse.json({ error: error.message || "Failed to process schedule request" }, { status: 500 });
  }
}
