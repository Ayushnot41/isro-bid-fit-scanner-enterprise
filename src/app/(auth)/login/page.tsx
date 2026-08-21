"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Rocket, ShieldCheck, ArrowRight, Lock, Mail, KeyRound, Sparkles, Building2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("supplier@aeroprecision.in");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    document.cookie = "demo_session=true; path=/; max-age=86400; SameSite=Lax";
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 400);
  };

  const handleInstantDemo = () => {
    setIsLoading(true);
    document.cookie = "demo_session=true; path=/; max-age=86400; SameSite=Lax";
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center relative overflow-hidden p-4 font-sans text-zinc-100 selection:bg-emerald-500/30">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-950/40">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-lg tracking-tight font-sans">
                ISRO Bid-Fit
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                PRO
              </span>
            </div>
            <p className="text-zinc-500 text-[11px] font-mono">
              Autonomous Procurement & MSME Intelligence
            </p>
          </div>
        </Link>

        {/* Login Card */}
        <div className="w-full bg-[#0e1115] border border-[#222730] rounded-2xl shadow-2xl shadow-black/80 p-6 sm:p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Supplier Sign In
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Access your Bid-Fit Command Center & Tenders Vault
            </p>
          </div>

          {/* 1-Click Instant Demo MSME Button */}
          <Button
            type="button"
            onClick={handleInstantDemo}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>1-Click Instant Access (AeroPrecision MSME)</span>
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#222730]" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Or Enter Credentials
            </span>
            <div className="flex-1 h-px bg-[#222730]" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supplier Email / Vendor ID</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supplier@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090b0e] border border-[#222730] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans text-xs transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Password / DSC Token</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090b0e] border border-[#222730] text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans text-xs transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#14181f] hover:bg-[#1d232c] border border-[#222730] text-zinc-200 hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Authenticate & Enter HUD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          {/* Footer Info */}
          <div className="pt-2 border-t border-[#222730] flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>New Indian Supplier?</span>
            <Link
              href="/register"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Register MSME</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Return to Public Tenders Terminal
        </Link>
      </div>
    </div>
  );
}
