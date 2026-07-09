"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SiteBackground from "../../site-background";
import SiteHeader from "../../site-header";
import Preloader from "../../preloader";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Preloader />
      <SiteBackground />
      <SiteHeader />

      <main className="relative z-10 flex min-h-[calc(100vh-6.5rem)] items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[#002454]/10 bg-white/70 p-8 shadow-[0_2rem_5rem_rgba(0,36,84,0.08)] backdrop-blur-xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#bf8500]">
              System Access
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#192438]">
              Admin <span className="text-[#d49400]">Login</span>
            </h1>
            <div className="mx-auto my-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-[#f6c430] to-[#33aeda]" />
            <p className="text-sm text-[#192438]/70">
              Sign in to manage the Rise Up Mora platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-bold text-[#002454]"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#002454]/10 bg-white/60 px-4 py-3 text-[#002454] shadow-sm outline-none transition-all placeholder:text-[#002454]/40 focus:border-[#33aeda] focus:bg-white focus:ring-4 focus:ring-[#33aeda]/10 disabled:opacity-50"
                placeholder="admin@riseupmora.lk"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-bold text-[#002454]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#002454]/10 bg-white/60 px-4 py-3 text-[#002454] shadow-sm outline-none transition-all placeholder:text-[#002454]/40 focus:border-[#33aeda] focus:bg-white focus:ring-4 focus:ring-[#33aeda]/10 disabled:opacity-50"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex min-h-[3.25rem] w-full items-center justify-center rounded-[0.85rem] bg-[#f6c430] px-5 text-[0.86rem] font-bold text-[#002454] shadow-[0_0.8rem_1.8rem_rgba(246,196,48,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_1rem_2rem_rgba(246,196,48,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002454] focus-visible:ring-offset-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_0.8rem_1.8rem_rgba(246,196,48,0.22)]"
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
