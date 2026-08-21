"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { BidEvaluation, ScrapedTender } from "@/lib/types/database";
import Link from "next/link";
import { AiEvaluationModal } from "@/components/tenders/ai-evaluation-modal";
import { INITIAL_SCRAPED_TENDERS } from "@/lib/mock-data";
import { ChevronRight, FileText } from "lucide-react";

interface RecentEvaluationsProps {
  evaluations: BidEvaluation[];
}

export function RecentEvaluations({ evaluations }: RecentEvaluationsProps) {
  const [selectedEval, setSelectedEval] = useState<BidEvaluation | null>(null);
  const [selectedTender, setSelectedTender] = useState<ScrapedTender | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (evaluation: BidEvaluation) => {
    const matchedTender =
      INITIAL_SCRAPED_TENDERS.find((t) => t.id === evaluation.tender_id) ||
      INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === evaluation.tender_reference) ||
      INITIAL_SCRAPED_TENDERS[0];

    setSelectedEval(evaluation);
    setSelectedTender(matchedTender);
    setModalOpen(true);
  };

  return (
    <>
      <Card className="bg-zinc-900/90 border border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Recent Evaluation Dossiers
            </CardTitle>
            <Link
              href="/evaluations"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              View Vault ({evaluations.length}) →
            </Link>
          </div>
        </CardHeader>

        <div className="space-y-2.5">
          {evaluations.slice(0, 5).map((evaluation, index) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.04,
              }}
              onClick={() => handleRowClick(evaluation)}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/60 border border-zinc-800/60 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 truncate transition-colors">
                  {evaluation.tender_title || evaluation.tender_reference}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500 font-mono">
                  <span>{evaluation.tender_reference}</span>
                  <span>•</span>
                  <span>{formatDate(evaluation.evaluated_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-16 sm:w-24 hidden xs:block">
                  <Progress value={evaluation.final_bid_fit_score} />
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
                  {Math.round(evaluation.final_bid_fit_score)}%
                </Badge>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
            </motion.div>
          ))}

          {evaluations.length === 0 && (
            <p className="text-center text-zinc-500 py-6 text-sm">
              No evaluations yet
            </p>
          )}
        </div>
      </Card>

      {/* Detail Dossier Modal */}
      <AiEvaluationModal
        tender={selectedTender}
        evaluation={selectedEval}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
