"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, ArrowRight, Lock, Mail, CheckCircle2, UserCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("vendor@aeroprecision.in");
  const [password, setPassword] = useState("••••••••••••");
  const [role, setRole] = useState<"VENDOR" | "ADMIN">("VENDOR");
  const [step, setStep] = useState<"CREDENTIALS" | "VERIFY_CODE">("CREDENTIALS");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSendCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    // Simulate secure 2FA email verification dispatch
    setTimeout(() => {
      setLoading(false);
      setStep("VERIFY_CODE");
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    document.cookie = "demo_session=true; path=/; max-age=86400";
    document.cookie = `user_role=${role}; path=/; max-age=86400`;
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  const handleQuickSignIn = (selectedRole: "VENDOR" | "ADMIN") => {
    setLoading(true);
    document.cookie = "demo_session=true; path=/; max-age=86400";
    document.cookie = `user_role=${selectedRole}; path=/; max-age=86400`;
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0e1115] border border-[#222730] rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ISRO GFR 2017 Verified Gateway
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Institutional Sign In
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Access your AI Bid-Fit & Drawing Tolerance Scanner
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0a0b0e] border border-[#222730] text-xs font-mono">
          <button
            type="button"
            onClick={() => setRole("VENDOR")}
            className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === "VENDOR"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aerospace Vendor</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("ADMIN")}
            className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === "ADMIN"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Procurement Admin</span>
          </button>
        </div>

        {step === "CREDENTIALS" ? (
          <form onSubmit={handleSendCredentials} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">
                {role === "VENDOR" ? "Official Work Email" : "ISRO Admin Officer Email"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={role === "VENDOR" ? "vendor@aeroprecision.in" : "officer@isro.gov.in"}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans"
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
                  placeholder="Enter your security password"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 font-mono">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
            >
              {loading ? "Verifying Credentials..." : "Continue to Verification Code"}
            </Button>

            <div className="pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleQuickSignIn(role)}
                className="w-full text-xs font-mono border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                1-Click Fast-Track Sign In ({role === "VENDOR" ? "Aerospace MSME" : "ISRO Officer"})
              </Button>
            </div>
          </form>
        ) : (
          /* STEP 2: 2FA EMAIL VERIFICATION CODE */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#0a0b0e] border border-cyan-500/30 text-xs space-y-1 font-mono">
              <p className="text-cyan-400 font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verification Code Sent</span>
              </p>
              <p className="text-zinc-400 text-[11px]">
                A 6-digit security code was dispatched to <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Enter 6-Digit Code:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="e.g. 582914"
                maxLength={6}
                required
                className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-[#0a0b0e] border border-emerald-500/40 rounded-xl text-emerald-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
            >
              {loading ? "Verifying Token..." : "Authenticate & Launch Mission Control"}
            </Button>

            <button
              type="button"
              onClick={() => setStep("CREDENTIALS")}
              className="w-full text-center text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to credentials
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div className="pt-2 border-t border-[#222730] text-center text-xs text-zinc-500 font-mono">
          <span>New Aerospace Supplier? </span>
          <Link href="/register" className="text-emerald-400 hover:underline font-bold">
            Register Company (Udyam MSME)
          </Link>
        </div>
      </div>
    </div>
  );
}
