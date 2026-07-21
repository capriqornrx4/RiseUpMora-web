import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import PanelistDashboardClient from "./PanelistDashboardClient";

export const dynamic = "force-dynamic";

export default async function PanelistDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "panelist") {
    redirect("/");
  }

  // 1. Get panelist details
  const panelistRes = await query(
    `SELECT p.id as panelist_id, p.panel_number, c.name as company_name, c.logo_url, p.company_id
     FROM panelists p
     JOIN companies c ON p.company_id = c.id
     WHERE p.user_id = $1`,
    [session.user.id]
  );

  if (panelistRes.rowCount === 0) {
    return (
      <div className="p-8 text-center text-[#002454]/60 font-bold bg-white rounded-3xl border border-red-200">
        No panelist profile found for your account. Please contact the administrator.
      </div>
    );
  }

  const panelist = panelistRes.rows[0];

  // 2. Fetch allocations schedule
  const allocationsRes = await query(
    `SELECT a.id as allocation_id, a.candidate_id, u.name as candidate_name, u.email,
            c.student_id, c.department, c.cv_url, a.interview_date, a.time_slot, a.status,
            f.id as feedback_id
     FROM allocations a
     JOIN candidates c ON a.candidate_id = c.id
     JOIN users u ON c.user_id = u.id
     LEFT JOIN feedback f ON f.candidate_id = c.id AND f.company_id = a.company_id
     WHERE a.company_id = $1`,
    [panelist.company_id]
  );
  
  const allocations = allocationsRes.rows;

  // Chronological sort helper
  const parse12hToMinutes = (timeSlotStr: string) => {
    const startPart = timeSlotStr.split(" - ")[0];
    const match = startPart.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hrs = Number(match[1]);
    const mns = Number(match[2]);
    const period = match[3].toUpperCase();
    if (period === "PM" && hrs < 12) hrs += 12;
    if (period === "AM" && hrs === 12) hrs = 0;
    return hrs * 60 + mns;
  };

  allocations.sort((a: any, b: any) => {
    if (!a.interview_date || !b.interview_date) return 0;
    const dateA = new Date(a.interview_date).getTime();
    const dateB = new Date(b.interview_date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return parse12hToMinutes(a.time_slot) - parse12hToMinutes(b.time_slot);
  });

  return (
    <PanelistDashboardClient
      panelist={panelist}
      initialAllocations={allocations}
    />
  );
}
