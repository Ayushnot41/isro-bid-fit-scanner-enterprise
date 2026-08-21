"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { getScoreLabel } from "@/lib/utils";
import type { BidEvaluation } from "@/lib/types/database";
import { Sparkles, ShieldCheck, Wrench, FileCheck, CheckCircle2 } from "lucide-react";
import { getWinProbability } from "@/lib/evaluation-utils";

interface ScoreCardProps {
  evaluation: BidEvaluation;
}

export function ScoreCard({ evaluation }: ScoreCardProps) {
  return (
    <div
      style={{ willChange: "transform, opacity" }}
      className="bg-[#13161a] hover:bg-[#161a20] border border-[#222730] hover:border-emerald-500/30 shadow-xl p-5 rounded-2xl transition-all duration-300 hardware-accelerated"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#222730]/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight font-sans">
            Featured Autonomous Evaluation
          </span>
        </div>
        <Badge
          variant={
            evaluation.final_bid_fit_score >= 75
              ? "success"
              : evaluation.final_bid_fit_score >= 50
              ? "warning"
              : "danger"
          }
        >
          {getScoreLabel(evaluation.final_bid_fit_score)}
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <ScoreGauge score={evaluation.final_bid_fit_score} size={110} strokeWidth={8} />
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              ISRO BID FIT
            </span>
            {(() => {
              const winProb = getWinProbability(evaluation.final_bid_fit_score);
              return (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${winProb.color}`} title={winProb.label}>
                  {winProb.score}% WIN PROBABILITY
                </span>
              );
            })()}
          </div>
        </div>

        <div className="flex-1 w-full min-w-0">
          <h4 className="text-white font-semibold text-sm truncate mb-1">
            {evaluation.tender_title || evaluation.tender_reference}
          </h4>
          <p className="text-xs text-zinc-400 font-mono mb-3">
            Ref: {evaluation.tender_reference}
          </p>

          <div className="space-y-2.5 bg-[#0a0b0e] p-3 rounded-xl border border-[#222730]">
            <ScoreProgressRow
              icon={FileCheck}
              label="Aerospace Quality Accreditations"
              value={evaluation.certification_score}
            />
            <ScoreProgressRow
              icon={Wrench}
              label="5-Axis CNC & Micron Tolerances"
              value={evaluation.tolerance_score}
            />
            <ScoreProgressRow
              icon={ShieldCheck}
              label="MSME GFR 2017 EMD Exemption"
              value={evaluation.msme_score}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreProgressRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | null;
}) {
  const score = value ?? 80;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400 flex items-center gap-1.5 truncate text-[11px]">
          <Icon className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          {label}
        </span>
        <span
          className={`font-semibold font-mono text-xs ml-2 ${
            score >= 75
              ? "text-emerald-400"
              : score >= 50
              ? "text-amber-400"
              : "text-rose-400"
          }`}
        >
          {score.toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-[#181c22] rounded-full overflow-hidden">
        <div
          style={{ width: `${score}%`, transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
          className={`h-full rounded-full ${
            score >= 75
              ? "bg-emerald-500"
              : score >= 50
              ? "bg-amber-500"
              : "bg-rose-500"
          }`}
        />
      </div>
    </div>
  );
}
