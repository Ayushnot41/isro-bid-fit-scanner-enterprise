"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, ArrowRight, Lock, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("vendor@aeroprecision.in");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    document.cookie = "demo_session=true; path=/; max-age=86400";
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0e1115] border border-[#222730] rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ISRO GFR 2017 Mode
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Vendor Sign In
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Access your AI Bid-Fit & Drawing Tolerance Scanner
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
          >
            {loading ? "Authenticating..." : "Sign In to Mission Control"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleSignIn}
            className="w-full text-xs font-mono border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            1-Click Demo Login (Verified Aerospace MSME)
          </Button>
        </form>

        <div className="pt-2 border-t border-[#222730] text-center text-xs text-zinc-500 font-mono">
          <span>New Aerospace Supplier? </span>
          <Link href="/register" className="text-emerald-400 hover:underline">
            Register Company
          </Link>
        </div>
      </div>
    </div>
  );
}
