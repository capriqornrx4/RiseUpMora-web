"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type Company = {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/v1/company/getAllCompany");
      const data = await res.json();
      if (data.success) {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (company?: Company) => {
    if (company) {
      setEditingId(company.id);
      setName(company.name);
      setLogoPreview(company.logo_url);
    } else {
      setEditingId(null);
      setName("");
      setLogoPreview(null);
    }
    setLogoFile(null);
    setIsModalOpen(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalLogoUrl = logoPreview;

      // If a new file is selected, upload to Cloudinary first
      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        formData.append("folder", "riseupmora/companies");

        const uploadRes = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        
        if (uploadData.success) {
          finalLogoUrl = uploadData.url;
        } else {
          throw new Error("Logo upload failed");
        }
      }

      const payload = {
        id: editingId,
        name,
        logo_url: finalLogoUrl,
      };

      const url = editingId 
        ? "/api/v1/company/updateCompany" 
        : "/api/v1/company/addCompany";
        
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchCompanies();
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await fetch("/api/v1/company/deleteCompany", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        fetchCompanies();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#002454]">Companies</h1>
          <p className="text-sm text-[#002454]/60">Manage participating companies</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-[#f6c430] px-4 py-2.5 text-sm font-bold text-[#002454] transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Plus size={18} />
          Add Company
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#002454]/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#002454]/5 bg-[#f8fcfe] text-[#002454]/60">
            <tr>
              <th className="px-6 py-4 font-bold">Company</th>
              <th className="px-6 py-4 font-bold">Added On</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#002454]/5">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-[#002454]/50">
                  <Loader2 className="mx-auto animate-spin" />
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-[#002454]/50">
                  No companies found. Add one to get started.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} className="transition-colors hover:bg-[#f8fcfe]/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#002454]/10 bg-gray-50">
                        {company.logo_url ? (
                          <img
                            src={company.logo_url}
                            alt={company.name}
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <Building2 size={20} className="text-[#002454]/30" />
                        )}
                      </div>
                      <span className="font-bold text-[#002454]">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#002454]/70">
                    {new Date(company.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(company)}
                        className="rounded-lg p-2 text-[#33aeda] transition-colors hover:bg-[#33aeda]/10"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002454]/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-6 text-xl font-extrabold text-[#002454]">
              {editingId ? "Edit Company" : "Add Company"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#002454]">
                  Company Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#002454]/10 bg-white px-4 py-2.5 text-[#002454] outline-none focus:border-[#33aeda] focus:ring-2 focus:ring-[#33aeda]/10"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#002454]">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#002454]/10 bg-gray-50">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="h-full w-full object-contain p-1" />
                    ) : (
                      <ImageIcon size={24} className="text-[#002454]/30" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full text-sm text-[#002454]/70 file:mr-4 file:rounded-full file:border-0 file:bg-[#f6c430]/20 file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#002454] hover:file:bg-[#f6c430]/30"
                  />
                </div>
              </div>

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
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
