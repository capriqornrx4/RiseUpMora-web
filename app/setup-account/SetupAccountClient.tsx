"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function SetupAccountClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fcfe] p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h2 className="text-xl font-bold text-red-500">Invalid Link</h2>
          <p className="mt-2 text-[#002454]/70">No invitation token provided. Please check your email link.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/user/setupAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to setup account");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fcfe] p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#002454]/10 bg-white p-8 text-center shadow-[0_2rem_5rem_rgba(0,36,84,0.05)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-[#002454]">Account Setup Complete!</h2>
          <p className="mt-2 text-[#002454]/70">Redirecting you to the login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fcfe] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#002454]/10 bg-white shadow-[0_2rem_5rem_rgba(0,36,84,0.05)]">
        <div className="bg-[#002454] p-8 text-center">
          <h1 className="text-2xl font-extrabold text-white">
            Rise Up <span className="text-[#f6c430]">Mora</span>
          </h1>
          <p className="mt-2 text-[#33aeda]">Secure Account Setup</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-500 text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#002454]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#002454]/10 bg-[#f8fcfe] px-4 py-3 pr-12 text-[#002454] outline-none transition-all focus:border-[#33aeda] focus:ring-2 focus:ring-[#33aeda]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#002454]/40 hover:text-[#002454]/70"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#002454]">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#002454]/10 bg-[#f8fcfe] px-4 py-3 pr-12 text-[#002454] outline-none transition-all focus:border-[#33aeda] focus:ring-2 focus:ring-[#33aeda]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#002454]/40 hover:text-[#002454]/70"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f6c430] py-3.5 font-extrabold text-[#002454] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Password & Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
