import { createClient } from "@/lib/supabase/server";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RealtimeFeed } from "@/components/dashboard/realtime-feed";
import { ScoreCard } from "@/components/dashboard/score-card";
import { RecentEvaluations } from "@/components/dashboard/recent-evaluations";
import type { BidEvaluation } from "@/lib/types/database";
import { INITIAL_EVALUATIONS } from "@/lib/mock-data";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Rocket } from "lucide-react";

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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Action Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 border border-zinc-800 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5" />
              ISRO Enterprise Autonomous Scanner
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bid-Fit Command Center
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Autonomous tender intelligence matching ISRO RFPs against your vendor capability matrix in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/tenders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/30 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            Explore Active RFPs
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative ambient glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Metrics */}
      <StatsGrid evaluations={evals} />

      {/* Main Grid: Featured Card + Realtime Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
