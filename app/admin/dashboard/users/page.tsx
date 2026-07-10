"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Mail, Building2, BookOpen, ChevronDown, Trash2 } from "lucide-react";

type RoleType = "candidate" | "company_coordinator" | "department_coordinator" | "panelist";

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<RoleType>("candidate");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_id: "",
    department: "",
  });

  const tabs = [
    { id: "candidate", label: "Candidates", icon: BookOpen },
    { id: "company_coordinator", label: "Company Co.", icon: Building2 },
    { id: "department_coordinator", label: "Dept Co.", icon: BookOpen },
    { id: "panelist", label: "Panelists", icon: Building2 },
  ];

  const departments = [
    { group: "Faculty of Engineering (FOE)", options: ["FOE – Chemical and Process Engineering", "FOE – Civil Engineering", "FOE – Computer Science and Engineering", "FOE – Earth Resources Engineering", "FOE – Electrical Engineering", "FOE – Electronic and Telecommunication Engineering", "FOE – Materials Science and Engineering", "FOE – Mechanical Engineering", "FOE – Textile and Apparel Engineering", "FOE – Transport Management and Logistics Engineering"] },
    { group: "Faculty of Information Technology (FOIT)", options: ["FOIT – Information Technology", "FOIT – Computational Mathematics", "FOIT – Interdisciplinary Studies"] },
    { group: "Faculty of Business (FOB)", options: ["FOB – Decision Sciences", "FOB – Industrial Management", "FOB – Management of Technology"] },
  ];

  useEffect(() => {
    fetchUsers(activeTab);
    if (activeTab === "company_coordinator" || activeTab === "panelist") {
      if (companies.length === 0) fetchCompanies();
    }
  }, [activeTab]);

  const fetchUsers = async (role: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/user?role=${role}`);
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/v1/company/getAllCompany");
      const data = await res.json();
      if (data.success) setCompanies(data.companies);
    } catch (error) {
      console.error("Failed to fetch companies");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: activeTab }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Invitation sent successfully!");
        setIsModalOpen(false);
        setFormData({ name: "", email: "", company_id: "", department: "" });
        fetchUsers(activeTab);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/user?id=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        fetchUsers(activeTab);
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      alert("An error occurred while deleting the user.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#002454]">User Management</h1>
          <p className="text-sm text-[#002454]/60">Manage roles and send invitations</p>
        </div>
        
        {activeTab !== "candidate" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#f6c430] px-4 py-2.5 text-sm font-bold text-[#002454] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Plus size={18} />
            Invite {tabs.find(t => t.id === activeTab)?.label}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-xl bg-[#002454]/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as RoleType)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white text-[#002454] shadow-sm"
                : "text-[#002454]/60 hover:text-[#002454]"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl border border-[#002454]/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-[#002454]/5 bg-[#f8fcfe] text-[#002454]/60">
              <tr>
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold">Email</th>
                {activeTab === "candidate" && (
                  <>
                    <th className="px-6 py-4 font-bold">Student ID</th>
                    <th className="px-6 py-4 font-bold">Faculty</th>
                    <th className="px-6 py-4 font-bold">Department</th>
                  </>
                )}
                {(activeTab === "company_coordinator" || activeTab === "panelist") && (
                  <th className="px-6 py-4 font-bold">Company</th>
                )}
                {activeTab === "department_coordinator" && (
                  <th className="px-6 py-4 font-bold">Department</th>
                )}
                {activeTab === "panelist" && (
                  <th className="px-6 py-4 font-bold">Panel #</th>
                )}
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#002454]/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#002454]/50">
                    <Loader2 className="mx-auto animate-spin" size={24} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#002454]/50">
                    No users found for this role.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-[#f8fcfe]/50">
                    <td className="px-6 py-4 font-bold text-[#002454]">{user.name}</td>
                    <td className="px-6 py-4 text-[#002454]/70">{user.email}</td>
                    {activeTab === "candidate" && (
                      <>
                        <td className="px-6 py-4 text-[#002454]/70">{user.student_id}</td>
                        <td className="px-6 py-4 text-[#002454]/70">{user.faculty}</td>
                        <td className="px-6 py-4 text-[#002454]/70">{user.department}</td>
                      </>
                    )}
                    {(activeTab === "company_coordinator" || activeTab === "panelist") && (
                      <td className="px-6 py-4 text-[#002454]/70">{user.company_name}</td>
                    )}
                    {activeTab === "department_coordinator" && (
                      <td className="px-6 py-4 text-[#002454]/70">{user.department}</td>
                    )}
                    {activeTab === "panelist" && (
                      <td className="px-6 py-4 text-[#002454]/70">{user.panel_number}</td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002454]/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-6 text-xl font-extrabold text-[#002454]">
              Invite {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <form onSubmit={handleInvite} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#002454]">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-[#002454]/10 bg-white px-4 py-2.5 text-[#002454] outline-none focus:border-[#33aeda] focus:ring-2 focus:ring-[#33aeda]/10"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#002454]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#002454]/40" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-xl border border-[#002454]/10 bg-white py-2.5 pl-10 pr-4 text-[#002454] outline-none focus:border-[#33aeda] focus:ring-2 focus:ring-[#33aeda]/10"
                    required
                  />
                </div>
              </div>

              {(activeTab === "company_coordinator" || activeTab === "panelist") && (
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#002454]">Assign Company</label>
                  <select
                    value={formData.company_id}
                    onChange={e => setFormData({...formData, company_id: e.target.value})}
                    className="w-full rounded-xl border border-[#002454]/10 bg-white px-4 py-2.5 text-[#002454] outline-none focus:border-[#33aeda] focus:ring-2 focus:ring-[#33aeda]/10"
                    required
                  >
                    <option value="" disabled>Select a company</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "department_coordinator" && (
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#002454]">Department Name</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                      className="flex w-full items-center justify-between rounded-xl border border-[#002454]/10 bg-white px-4 py-2.5 text-left text-[#002454] outline-none focus:border-[#33aeda] focus:ring-2 focus:ring-[#33aeda]/10"
                    >
                      <span className={formData.department ? "truncate text-[#002454]" : "text-[#002454]/60"}>
                        {formData.department ? formData.department.split(" – ")[1] || formData.department : "Select a department"}
                      </span>
                      <ChevronDown size={16} className={`transition-transform ${isDeptDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDeptDropdownOpen && (
                      <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#002454]/10 bg-white p-2 shadow-xl">
                        {departments.map((group, idx) => (
                          <div key={idx} className="mb-2 last:mb-0">
                            <div className="px-3 py-1.5 text-xs font-extrabold uppercase text-[#002454]/50">
                              {group.group}
                            </div>
                            {group.options.map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, department: opt });
                                  setIsDeptDropdownOpen(false);
                                }}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[#f8fcfe] ${formData.department === opt ? "bg-[#f8fcfe] font-bold text-[#002454]" : "text-[#002454]/80"}`}
                              >
                                {opt.split(" – ")[1] || opt}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#002454]/70 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center rounded-xl bg-[#f6c430] px-4 py-2.5 text-sm font-bold text-[#002454] hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
