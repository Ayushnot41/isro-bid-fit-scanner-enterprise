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
} from "lucide-react";
import { useClerk, UserButton } from "@clerk/nextjs";

const navItems = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/tenders", label: "ISRO Tenders", icon: FileSearch, badge: "LIVE" },
  { href: "/evaluations", label: "Evaluations Vault", icon: ClipboardCheck },
  { href: "/profile", label: "Capability Matrix", icon: Sliders },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

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
            <Rocket className="w-5 h-5" />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                ISRO Bid-Fit
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                PRO
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-500 tracking-wide uppercase">
              Procurement HUD
            </p>
          </div>
        </Link>
      </div>

      {/* Gateway Live Status Pill */}
      <div className="mx-3.5 my-3 p-3 rounded-xl bg-[#13161a] border border-[#222730] text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            eproc.isro.gov.in
          </span>
          <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 font-mono text-[9px] rounded font-bold">
            LIVE
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 inline" />
          Autonomous Scraper Active
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative",
                  isActive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 shadow-sm shadow-emerald-950/20"
                    : "text-zinc-400 hover:text-white hover:bg-[#181c22] border border-transparent"
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

      {/* Footer Info & Sign Out */}
      <div className="p-3.5 border-t border-[#222730] space-y-1.5 bg-[#0a0b0e]">
        <a
          href="https://eproc.isro.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-[#13161a] transition-colors"
        >
          <span className="font-mono text-[10px]">Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex items-center gap-2.5 px-3 py-2">
          <UserButton
            afterSignOutUrl="/login"
            appearance={{
              elements: {
                avatarBox: "w-7 h-7",
              },
            }}
          />
          <button
            onClick={() => signOut({ redirectUrl: "/login" })}
            className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
