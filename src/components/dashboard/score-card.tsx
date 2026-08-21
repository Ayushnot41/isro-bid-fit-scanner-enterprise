"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { getScoreLabel } from "@/lib/utils";
import type { BidEvaluation } from "@/lib/types/database";
import { Sparkles, ShieldCheck, Wrench, FileCheck } from "lucide-react";

interface ScoreCardProps {
  evaluation: BidEvaluation;
}

export function ScoreCard({ evaluation }: ScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="bg-zinc-900/90 border border-zinc-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <CardTitle className="text-base font-bold">Featured Evaluation</CardTitle>
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
        </CardHeader>

        <div className="flex flex-col sm:flex-row items-center gap-6 mt-3">
          <div className="flex flex-col items-center">
            <ScoreGauge score={evaluation.final_bid_fit_score} size={110} strokeWidth={8} />
            <span className="text-[11px] font-mono text-zinc-500 mt-1">ISRO BID FIT</span>
          </div>

          <div className="flex-1 w-full">
            <h4 className="text-white font-semibold text-sm line-clamp-1 mb-1">
              {evaluation.tender_title || evaluation.tender_reference}
            </h4>
            <p className="text-xs text-zinc-400 font-mono mb-3">
              Ref: {evaluation.tender_reference}
            </p>

            <div className="space-y-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
              <ScoreProgressRow
                icon={FileCheck}
                label="Aerospace Quality Certifications"
                value={evaluation.certification_score}
              />
              <ScoreProgressRow
                icon={Wrench}
                label="5-Axis & Precision Tolerances"
                value={evaluation.tolerance_score}
              />
              <ScoreProgressRow
                icon={ShieldCheck}
                label="MSME EMD Exemption & Policy"
                value={evaluation.msme_score}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
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
        <span className="text-zinc-400 flex items-center gap-1.5 truncate">
          <Icon className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          {label}
        </span>
        <span
          className={`font-semibold font-mono ml-2 ${
            score >= 75
              ? "text-emerald-400"
              : score >= 50
              ? "text-amber-400"
              : "text-red-400"
          }`}
        >
          {score.toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${
            score >= 75
              ? "bg-emerald-500"
              : score >= 50
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
        />
      </div>
    </div>
  );
}
