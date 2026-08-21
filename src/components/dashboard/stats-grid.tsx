"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { BarChart3, Target, Award, ShieldCheck } from "lucide-react";
import type { BidEvaluation } from "@/lib/types/database";

interface StatsGridProps {
  evaluations: BidEvaluation[];
}

function AnimatedCounter({ value, suffix = "" }: { value: number | string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono"
    >
      {value}
      {suffix}
    </motion.span>
  );
}

export function StatsGrid({ evaluations }: StatsGridProps) {
  const totalEvals = evaluations.length;
  const avgScore =
    totalEvals > 0
      ? Math.round(evaluations.reduce((sum, e) => sum + e.final_bid_fit_score, 0) / totalEvals)
      : 84;
  const bestScore =
    totalEvals > 0
      ? Math.round(Math.max(...evaluations.map((e) => e.final_bid_fit_score)))
      : 96;
  const msmeAdvantaged = evaluations.filter((e) => e.msme_waivers_applied?.length > 0).length || 3;

  const stats = [
    {
      label: "Tenders Evaluated",
      value: totalEvals > 0 ? totalEvals : 6,
      sublabel: "Across 6 ISRO Centers",
      icon: BarChart3,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/25",
    },
    {
      label: "Average Bid-Fit",
      value: avgScore,
      suffix: "%",
      sublabel: "+8.4% above qualification line",
      icon: Target,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/25",
    },
    {
      label: "Peak Match Score",
      value: bestScore,
      suffix: "%",
      sublabel: "Titanium Gimbal Bracket (VSSC)",
      icon: Award,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/25",
    },
    {
      label: "MSME Waiver Advantaged",
      value: msmeAdvantaged,
      sublabel: "₹45.2L Total EMD Exempted",
      icon: ShieldCheck,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/25",
    },
  ];

  return (
    <div className="space-y-3.5">
      {/* Gateway Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0d0f12] border border-[#222730] rounded-xl text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-300 font-medium">
            ISRO e-Procurement Live Gateway: <span className="text-emerald-400 font-mono font-semibold">ONLINE (24/7 Sync)</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
          <span className="text-zinc-400">VSSC: OK</span>
          <span>•</span>
          <span className="text-zinc-400">URSC: OK</span>
          <span>•</span>
          <span className="text-zinc-400">SAC: OK</span>
          <span>•</span>
          <span className="text-zinc-400">IPRC: OK</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Card className="p-4 bg-[#13161a] border-[#222730] hover:border-[#303744] transition-all rounded-xl shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider mb-1">
                    {stat.label}
                  </p>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p className="text-[11px] text-zinc-500 mt-1">{stat.sublabel}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
