"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileSearch,
  ClipboardCheck,
  UserCircle,
  Rocket,
  LogOut,
  Radio,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tenders", label: "ISRO Tenders", icon: FileSearch, badge: "LIVE" },
  { href: "/evaluations", label: "Evaluations Dossiers", icon: ClipboardCheck },
  { href: "/profile", label: "Capability Matrix", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col z-40">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/40"
          >
            <Rocket className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
              ISRO Bid-Fit
            </h1>
            <p className="text-[11px] font-mono text-zinc-500">Enterprise SaaS</p>
          </div>
        </Link>
      </div>

      {/* Gateway Live Monitor Card */}
      <div className="mx-4 my-3 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            ISRO E-PROC
          </span>
          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-mono text-[9px] rounded font-bold">
            24/7 SYNC
          </span>
        </div>
        <p className="text-[11px] text-zinc-400">
          Scraping eproc.isro.gov.in
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors relative",
                  isActive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-400 font-mono">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & Sign Out */}
      <div className="p-4 border-t border-zinc-800/80 space-y-2">
        <a
          href="https://eproc.isro.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
