"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Shield, Building2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    document.cookie = "demo_session=true; path=/; max-age=86400";
    setTimeout(() => {
      router.push("/profile");
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

      <div className="relative z-10 w-full max-w-md bg-[#0e1115] border border-[#222730] rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            Empaneled Supplier Portal
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Register Aerospace Enterprise
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Onboard your CNC workshop & AS9100D certifications
          </p>
        </div>

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
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-300">Official Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="procurement@company.in"
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
            {loading ? "Registering..." : "Create Supplier Account"}
          </Button>
        </form>

        <div className="pt-2 border-t border-[#222730] text-center text-xs text-zinc-500 font-mono">
          <span>Already registered? </span>
          <Link href="/login" className="text-emerald-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
