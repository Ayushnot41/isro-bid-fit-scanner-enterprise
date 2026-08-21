"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, Building2, Mail, Lock, FileCheck, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [udyamNumber, setUdyamNumber] = useState("UDYAM-KR-03-00");
  const [category, setCategory] = useState<"MICRO" | "SMALL" | "MEDIUM">("SMALL");
  const [step, setStep] = useState<"DETAILS" | "VERIFY_EMAIL">("DETAILS");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("VERIFY_EMAIL");
    }, 600);
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    document.cookie = "demo_session=true; path=/; max-age=86400";
    document.cookie = "user_role=VENDOR; path=/; max-age=86400";
    setTimeout(() => {
      router.push("/profile");
    }, 500);
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

      <div className="relative z-10 w-full max-w-lg bg-[#0e1115] border border-[#222730] rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors">
            <Shield className="w-3.5 h-3.5" />
            Empaneled Supplier Onboarding
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Register Aerospace Enterprise
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Connect your CNC Workshop, AS9100D & Udyam MSME status
          </p>
        </div>

        {step === "DETAILS" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. AeroPrecision Dynamics Pvt. Ltd."
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Official Procurement Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="procurement@aeroprecision.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300">Udyam MSME Number</label>
                <input
                  type="text"
                  value={udyamNumber}
                  onChange={(e) => setUdyamNumber(e.target.value)}
                  placeholder="UDYAM-KR-03-0012345"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-emerald-300 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300">MSME Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
                >
                  <option value="MICRO">Micro (&lt; ₹1 Cr / ₹5 Cr)</option>
                  <option value="SMALL">Small (&lt; ₹10 Cr / ₹50 Cr)</option>
                  <option value="MEDIUM">Medium (&lt; ₹50 Cr / ₹250 Cr)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Qualifies for 100% EMD Fee Exemption under GFR 170(i)</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
            >
              {loading ? "Registering..." : "Continue to Email Verification"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#0a0b0e] border border-emerald-500/30 text-xs space-y-1 font-mono">
              <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verification Email Dispatched</span>
              </p>
              <p className="text-zinc-400 text-[11px]">
                Please enter the 6-digit confirmation code sent to <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-300">Enter 6-Digit Code:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="e.g. 749201"
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
              {loading ? "Verifying..." : "Verify & Complete Onboarding"}
            </Button>

            <button
              type="button"
              onClick={() => setStep("DETAILS")}
              className="w-full text-center text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              ← Edit company details
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-[#222730] text-center text-xs text-zinc-500 font-mono">
          <span>Already registered? </span>
          <Link href="/login" className="text-emerald-400 hover:underline font-bold">
            Sign In to Account
          </Link>
        </div>
      </div>
    </div>
  );
}
