"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import type { BidEvaluation, ScrapedTender } from "@/lib/types/database";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Zap, Radio, ChevronRight, Sparkles } from "lucide-react";
import { AiEvaluationModal } from "@/components/tenders/ai-evaluation-modal";
import { INITIAL_SCRAPED_TENDERS } from "@/lib/mock-data";

interface RealtimeFeedProps {
  initialEvaluations: BidEvaluation[];
}

export function RealtimeFeed({ initialEvaluations }: RealtimeFeedProps) {
  const [evaluations, setEvaluations] = useState<BidEvaluation[]>(initialEvaluations);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  // Modal State
  const [selectedTender, setSelectedTender] = useState<ScrapedTender | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<BidEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("bid-evaluations-realtime-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bid_evaluations",
        },
        (payload) => {
          const newEval = payload.new as BidEvaluation;
          setEvaluations((prev) => [newEval, ...prev]);
          setNewIds((prev) => new Set(prev).add(newEval.id));

          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev);
              next.delete(newEval.id);
              return next;
            });
          }, 6000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleOpenDossier = (evaluation: BidEvaluation) => {
    // Match against scraped tenders or generate fallback
    const matchedTender =
      INITIAL_SCRAPED_TENDERS.find((t) => t.id === evaluation.tender_id) ||
      INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === evaluation.tender_reference) ||
      INITIAL_SCRAPED_TENDERS[0];

    setSelectedTender(matchedTender);
    setSelectedEvaluation(evaluation);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Realtime Bid-Fit Pipeline
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Supabase WebSocket: ACTIVE
        </span>
      </div>

      <AnimatePresence initial={false}>
        {evaluations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl text-zinc-500"
          >
            <Zap className="w-8 h-8 mx-auto mb-3 opacity-40 text-emerald-400" />
            <p className="text-sm font-medium">No evaluations streaming currently.</p>
            <p className="text-xs text-zinc-600 mt-1">
              Select any ISRO tender to trigger an instant AI scan.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {evaluations.slice(0, 8).map((evaluation, index) => {
              const isNew = newIds.has(evaluation.id);

              return (
                <motion.div
                  key={evaluation.id}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  layout
                  onClick={() => handleOpenDossier(evaluation)}
                  className={`cursor-pointer bg-zinc-900/80 hover:bg-zinc-900 border rounded-2xl p-4 transition-all hover:border-zinc-700 ${
                    isNew
                      ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                          {evaluation.tender_reference}
                        </span>
                        {isNew && <Badge variant="success">LIVE UPDATE</Badge>}
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-white truncate mb-2">
                        {evaluation.tender_title || "ISRO Tender Evaluation"}
                      </h4>

                      <div className="flex flex-wrap gap-1.5">
                        {evaluation.tender_mechanical_tolerances_met ? (
                          <Badge variant="success">Tolerances Met</Badge>
                        ) : (
                          <Badge variant="danger">Tolerance Gap</Badge>
                        )}
                        {evaluation.missing_certifications.length === 0 ? (
                          <Badge variant="success">100% Certs</Badge>
                        ) : (
                          <Badge variant="warning">
                            {evaluation.missing_certifications.length} Missing
                          </Badge>
                        )}
                        {evaluation.msme_waivers_applied.length > 0 && (
                          <Badge variant="info">MSME EMD Exemption</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ScoreGauge score={evaluation.final_bid_fit_score} size={60} strokeWidth={5} />
                      <ChevronRight className="w-4 h-4 text-zinc-600 hidden sm:block" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Evaluation Dossier Modal */}
      <AiEvaluationModal
        tender={selectedTender}
        evaluation={selectedEvaluation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
