"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileSearch,
  ClipboardCheck,
  Sliders,
  Rocket,
  LogOut,
  Radio,
  ExternalLink,
  ShieldCheck,
  Radar,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/tenders", label: "ISRO Tenders", icon: FileSearch, badge: "LIVE" },
  { href: "/evaluations", label: "Evaluations Vault", icon: ClipboardCheck },
  { href: "/competitors", label: "Competitor Intel", icon: Radar, badge: "L1" },
  { href: "/profile", label: "Capability Matrix", icon: Sliders },
  { href: "/jobs", label: "System Health", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    document.cookie = "demo_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "sb-access-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0d0f12] border-r border-[#222730] flex flex-col z-40 selection:bg-emerald-500/30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#222730]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/30 text-emerald-400"
          >
            <Rocket className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">
                ISRO Bid-Fit
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              PROCUREMENT HUD
            </p>
          </div>
        </Link>
      </div>

      {/* Telemetry Status Strip */}
      <div className="px-5 py-3 border-b border-[#222730] bg-[#0a0b0e]">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            EPROC.ISRO.GOV.IN
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
            LIVE
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 font-mono">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          Autonomous Scraper Active
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all relative",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-500/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#13161a]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-400 rounded-r-full"
                  />
                )}
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 text-cyan-400 font-mono border border-cyan-500/20">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info & User Management */}
      <div className="p-3.5 border-t border-[#222730] space-y-2 bg-[#0a0b0e]">
        <a
          href="https://eproc.isro.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-[#13161a] transition-colors"
        >
          <span className="font-mono text-[10px]">Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex items-center justify-between px-2 pt-1 border-t border-[#222730]/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center">
              AP
            </div>
            <span className="text-[11px] font-mono text-zinc-300 truncate max-w-[80px]">MSME Active</span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
