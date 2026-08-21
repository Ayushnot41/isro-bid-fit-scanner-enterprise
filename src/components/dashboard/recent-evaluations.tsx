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
import { ChevronRight, FileText, ArrowRight } from "lucide-react";

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
      <Card className="bg-[#13161a] border-[#222730] p-5 rounded-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#222730]/80">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Recent Evaluation Dossiers
            </h3>
          </div>
          <Link
            href="/evaluations"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 group"
          >
            <span>View Vault ({evaluations.length})</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="space-y-2 mt-4">
          {evaluations.slice(0, 5).map((evaluation, index) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => handleRowClick(evaluation)}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0a0b0e] hover:bg-[#181c22] border border-[#222730] hover:border-[#303744] transition-all cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate transition-colors">
                  {evaluation.tender_title || evaluation.tender_reference}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500 font-mono">
                  <span>{evaluation.tender_reference}</span>
                  <span>•</span>
                  <span>{formatDate(evaluation.evaluated_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-16 sm:w-20 hidden xs:block">
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
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
            </motion.div>
          ))}

          {evaluations.length === 0 && (
            <p className="text-center text-zinc-500 py-6 text-xs font-mono">
              No evaluations recorded in vault yet.
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
