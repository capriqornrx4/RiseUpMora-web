"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, Calendar, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/admin/dashboard/companies", icon: Building2 },
  { name: "User Management", href: "/admin/dashboard/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f8fcfe]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#002454]/10 bg-white/70 shadow-[0_2rem_5rem_rgba(0,36,84,0.05)] backdrop-blur-xl">
        <div className="flex h-16 items-center px-6 border-b border-[#002454]/10">
          <Link href="/admin/dashboard" className="text-xl font-extrabold text-[#002454]">
            Rise Up <span className="text-[#33aeda]">Admin</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#33aeda]/10 text-[#1688b2]"
                    : "text-[#002454]/70 hover:bg-[#002454]/5 hover:text-[#002454]"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-[#002454]/10 bg-white/50 px-8 backdrop-blur-md">
          <h2 className="text-lg font-bold text-[#002454]">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-[#f6c430] flex items-center justify-center font-bold text-[#002454]">
              A
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
