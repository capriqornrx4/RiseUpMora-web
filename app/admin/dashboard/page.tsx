import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  let totalCompanies = "--";
  let totalCandidates = "--";
  let interviewsScheduled = "--";

  try {
    const companiesResult = await query("SELECT COUNT(*) FROM companies");
    const candidatesResult = await query("SELECT COUNT(*) FROM candidates");
    const allocationsResult = await query("SELECT COUNT(*) FROM allocations");

    totalCompanies = companiesResult.rows[0].count.toString();
    totalCandidates = candidatesResult.rows[0].count.toString();
    interviewsScheduled = allocationsResult.rows[0].count.toString();
  } catch (error) {
    console.error("Error fetching stats:", error);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#002454]">Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#002454]/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-[#002454]/60">Total Companies</p>
          <p className="mt-2 text-3xl font-extrabold text-[#1688b2]">{totalCompanies}</p>
        </div>
        <div className="rounded-2xl border border-[#002454]/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-[#002454]/60">Total Candidates</p>
          <p className="mt-2 text-3xl font-extrabold text-[#1688b2]">{totalCandidates}</p>
        </div>
        <div className="rounded-2xl border border-[#002454]/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-[#002454]/60">Interviews Scheduled</p>
          <p className="mt-2 text-3xl font-extrabold text-[#1688b2]">{interviewsScheduled}</p>
        </div>
      </div>
    </div>
  );
}
