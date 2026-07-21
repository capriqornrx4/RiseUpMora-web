"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react";
import SiteBackground from "../site-background";

function SetupAccountClientContent() {
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
      <div className="home-page">
        <SiteBackground />
        <main className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[#002454]/10 bg-white/70 p-8 text-center shadow-[0_2rem_5rem_rgba(0,36,84,0.08)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-[#002454]">Invalid Link</h2>
            <div className="mx-auto my-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-red-400 to-orange-400" />
            <p className="text-sm text-[#002454]/70">
              No invitation token provided. Please check your email link and try again.
            </p>
          </div>
        </main>
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
          router.push("/?login=true");
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
      <div className="home-page">
        <SiteBackground />
        <main className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[#002454]/10 bg-white/70 p-8 text-center shadow-[0_2rem_5rem_rgba(0,36,84,0.08)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-[#002454]">Account Setup Complete!</h2>
            <div className="mx-auto my-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#f6c430] to-[#33aeda]" />
            <p className="text-sm text-[#002454]/70">
              Redirecting you to the login page...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <SiteBackground />

      <main className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[#002454]/10 bg-white/70 shadow-[0_2rem_5rem_rgba(0,36,84,0.08)] backdrop-blur-xl">
          {/* Header */}
          <div className="relative overflow-hidden bg-[#002454] px-8 py-10 text-center">
            {/* Decorative circles */}
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#33aeda]/10" />
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-[#f6c430]/10" />
            <div className="absolute right-12 top-4 h-8 w-8 rounded-full bg-[#33aeda]/20" />

            <div className="relative">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <ShieldCheck size={28} className="text-[#33aeda]" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                Rise Up <span className="text-[#f6c430]">Mora</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-[#33aeda]">Secure Account Setup</p>
              <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#f6c430] to-[#33aeda]" />
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-500">
                  <AlertTriangle size={16} className="shrink-0" />
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
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#002454]/10 bg-white/60 px-4 py-3 pr-12 text-[#002454] shadow-sm outline-none transition-all placeholder:text-[#002454]/40 focus:border-[#33aeda] focus:bg-white focus:ring-4 focus:ring-[#33aeda]/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#002454]/40 transition-colors hover:text-[#002454]/70"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="mt-2 text-xs font-medium text-[#002454]/50">
                  Must be at least 6 characters long. Use a mix of letters and numbers for a stronger password.
                </p>
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
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#002454]/10 bg-white/60 px-4 py-3 pr-12 text-[#002454] shadow-sm outline-none transition-all placeholder:text-[#002454]/40 focus:border-[#33aeda] focus:bg-white focus:ring-4 focus:ring-[#33aeda]/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#002454]/40 transition-colors hover:text-[#002454]/70"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-[0.85rem] bg-[#f6c430] px-5 text-[0.86rem] font-bold text-[#002454] shadow-[0_0.8rem_1.8rem_rgba(246,196,48,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_1rem_2rem_rgba(246,196,48,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002454] focus-visible:ring-offset-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_0.8rem_1.8rem_rgba(246,196,48,0.22)]"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Password & Login"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SetupAccountClient() {
  return (
    <Suspense fallback={null}>
      <SetupAccountClientContent />
    </Suspense>
  );
}
