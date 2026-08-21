"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Rocket,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Building2,
  Radio,
} from "lucide-react";

function AuthForm() {
  const [tab, setTab] = useState<"login" | "register" | "admin">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If logging in as admin or vendor with standard credentials
    if (tab === "admin") {
      if (adminKey === "isro-admin" || email.includes("isro.gov.in") || email === "admin@isro.gov.in") {
        document.cookie = "demo_session=true; path=/; max-age=86400";
        document.cookie = "user_role=admin; path=/; max-age=86400";
        router.push("/dashboard");
        router.refresh();
        return;
      }
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback for demo testing
        document.cookie = "demo_session=true; path=/; max-age=86400";
        router.push(redirect);
        router.refresh();
        return;
      }

      document.cookie = "demo_session=true; path=/; max-age=86400";
      router.push(redirect);
      router.refresh();
    } catch {
      document.cookie = "demo_session=true; path=/; max-age=86400";
      router.push(redirect);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
          },
        },
      });

      if (data.user) {
        try {
          await supabase.from("vendor_profiles").insert({
            user_id: data.user.id,
            company_name: companyName || "New Aerospace Vendor",
            contact_email: email,
          });
        } catch {
          // ignore
        }
      }

      document.cookie = "demo_session=true; path=/; max-age=86400";
      router.push("/dashboard");
      router.refresh();
    } catch {
      document.cookie = "demo_session=true; path=/; max-age=86400";
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (type: "vendor" | "admin") => {
    if (type === "admin") {
      setTab("admin");
      setEmail("admin@isro.gov.in");
      setPassword("isroAdmin2026!");
      setAdminKey("isro-admin");
    } else {
      setTab("login");
      setEmail("contracts@aeroprecision.in");
      setPassword("vendorPass2026!");
    }
  };

  const handleLaunchDemo = () => {
    document.cookie = "demo_session=true; path=/; max-age=86400";
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="relative z-10 w-full max-w-md px-4 sm:px-6 selection:bg-emerald-500/30">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-3 shadow-lg shadow-emerald-950/40 text-emerald-400"
        >
          <Rocket className="w-7 h-7" />
        </motion.div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          ISRO Bid-Fit Scanner
        </h1>
        <p className="text-zinc-400 text-xs mt-0.5 font-mono">
          Enterprise Autonomous Procurement Intelligence
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-[#0e1115] border border-[#222730] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80 space-y-5">
        {/* Auth Role / Tab Switcher */}
        <div className="grid grid-cols-3 p-1 bg-[#0a0b0e] rounded-xl border border-[#222730] text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setTab("login"); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              tab === "login"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Vendor Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              tab === "register"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setTab("admin"); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              tab === "admin"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ISRO Admin
          </button>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="flex items-center justify-between p-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-[11px]">
          <span className="text-zinc-400 font-mono">Demo Accounts:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillQuickAccount("vendor")}
              className="px-2 py-0.5 rounded bg-[#181c22] hover:bg-[#222730] text-emerald-300 font-medium font-mono transition-colors"
            >
              Vendor Demo
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount("admin")}
              className="px-2 py-0.5 rounded bg-[#181c22] hover:bg-[#222730] text-purple-300 font-medium font-mono transition-colors"
            >
              ISRO Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        {tab === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Company Legal Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. AeroSpace Dynamics India Pvt. Ltd."
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendor@company.in"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Enterprise Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {tab === "admin" ? "ISRO Officer Email" : "Vendor Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tab === "admin" ? "officer@isro.gov.in" : "contracts@aeroprecision.in"}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {tab === "admin" && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Procurement Security Passcode
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="isro-admin"
                  className="w-full px-3.5 py-2 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 ${
                tab === "admin" ? "bg-purple-600 hover:bg-purple-500" : "bg-emerald-600 hover:bg-emerald-500"
              } active:scale-[0.98] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-md`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{tab === "admin" ? "Authenticate as ISRO Admin" : "Sign In to Vault"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Instant 1-Click Launch Showcase */}
        <div className="pt-2 border-t border-[#222730]">
          <button
            type="button"
            onClick={handleLaunchDemo}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#181c22] hover:bg-[#222730] active:scale-[0.98] text-zinc-200 hover:text-white border border-[#222730] text-xs font-semibold rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>1-Click Demo Showcase (AeroPrecision India)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] bg-[#08090a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <Suspense fallback={<div className="text-zinc-500 text-xs font-mono">Initializing Authentication Vault...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}
