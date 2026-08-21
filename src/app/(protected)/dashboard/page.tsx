import { createClient } from "@/lib/supabase/server";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RealtimeFeed } from "@/components/dashboard/realtime-feed";
import { ScoreCard } from "@/components/dashboard/score-card";
import { RecentEvaluations } from "@/components/dashboard/recent-evaluations";
import type { BidEvaluation } from "@/lib/types/database";
import { INITIAL_EVALUATIONS } from "@/lib/mock-data";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Rocket, Shield, Radio } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let evals = INITIAL_EVALUATIONS;

  try {
    const fetchWithTimeout = async () => {
      const supabase = await createClient();
      const { data: dbEvaluations } = await supabase
        .from("bid_evaluations")
        .select("*")
        .order("evaluated_at", { ascending: false })
        .limit(20);

      if (dbEvaluations && dbEvaluations.length > 0) {
        evals = dbEvaluations as BidEvaluation[];
      }
    };

    await Promise.race([
      fetchWithTimeout(),
      new Promise((resolve) => setTimeout(resolve, 150)),
    ]);
  } catch (err) {
    console.warn("Using fallback evaluations:", err);
  }

  const latestEval = evals[0] || null;

  return (
    <div className="space-y-7 max-w-7xl mx-auto selection:bg-emerald-500/30">
      {/* Top Telemetry Command Center Banner */}
      <div className="relative p-6 sm:p-7 rounded-2xl bg-[#0e1115] border border-[#222730] overflow-hidden shadow-xl shadow-black/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-400">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>ISRO Autonomous Procurement Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bid-Fit Command Center
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time tender intelligence matching ISRO engineering drawings with your CNC micron tolerances, AS9100D accreditations, and statutory GFR 2017 MSME waivers.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
            <Link
              href="/tenders"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-950/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Active RFPs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* WebCMD Autonomous Scraper & Grok AI Telemetry Ribbon */}
      <div className="p-4 rounded-2xl bg-[#13161a] border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white">WebCMD Autonomous Daemon</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE 20s PULSE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Session: session_cc2d6ad2 • 6 Centers Monitored (VSSC, URSC, SAC, SDSC, IPRC, LPSC) • OpenRouter Grok AI Live
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <Link
            href="/tenders"
            className="flex-1 md:flex-initial text-center px-3.5 py-1.5 rounded-xl bg-[#1c2128] hover:bg-[#242b35] border border-[#222730] text-zinc-200 text-xs font-mono transition-colors"
          >
            Launch WebCMD Terminal
          </Link>
        </div>
      </div>

      {/* KPI Metrics HUD */}
      <StatsGrid evaluations={evals} />

      {/* Main Content Grid: Featured Bid-Fit + Realtime Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        <div className="lg:col-span-7 space-y-6">
          {latestEval && <ScoreCard evaluation={latestEval} />}
          <RecentEvaluations evaluations={evals} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <RealtimeFeed initialEvaluations={evals} />
        </div>
      </div>
    </div>
  );
}
