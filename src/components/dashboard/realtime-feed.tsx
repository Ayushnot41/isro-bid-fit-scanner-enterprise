"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import type { BidEvaluation, ScrapedTender } from "@/lib/types/database";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Radio, ChevronRight, Zap } from "lucide-react";
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

  useEffect(() => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      if (!supabaseUrl || supabaseUrl.includes("your-project")) {
        return;
      }

      const supabase = createClient();
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
            if (newEval && newEval.id) {
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
          }
        )
        .subscribe();

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch {}
      };
    } catch (err) {
      console.warn("Supabase realtime skipped:", err);
    }
  }, []);

  const handleOpenDossier = (evaluation: BidEvaluation) => {
    const matchedTender =
      INITIAL_SCRAPED_TENDERS.find((t) => t.id === evaluation.tender_id) ||
      INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === evaluation.tender_reference) ||
      INITIAL_SCRAPED_TENDERS[0];

    setSelectedTender(matchedTender);
    setSelectedEvaluation(evaluation);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between p-3 bg-[#0d0f12] border border-[#222730] rounded-xl">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
            Live Telemetry Stream
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          WebSocket: ACTIVE
        </span>
      </div>

      <AnimatePresence initial={false}>
        {evaluations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-[#13161a] border border-[#222730] rounded-2xl text-zinc-500"
          >
            <Zap className="w-7 h-7 mx-auto mb-2.5 opacity-40 text-emerald-400" />
            <p className="text-xs font-medium">No evaluations streaming currently.</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Select any ISRO tender to trigger an instant AI scan.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2.5">
            {evaluations.slice(0, 8).map((evaluation, index) => {
              const isNew = newIds.has(evaluation.id);

              return (
                <motion.div
                  key={evaluation.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  layout
                  onClick={() => handleOpenDossier(evaluation)}
                  className={`cursor-pointer bg-[#13161a] hover:bg-[#181c22] border rounded-xl p-3.5 transition-all ${
                    isNew
                      ? "border-emerald-500/50 shadow-md shadow-emerald-500/10"
                      : "border-[#222730] hover:border-[#303744]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                          {evaluation.tender_reference}
                        </span>
                        {isNew && <Badge variant="success">NEW</Badge>}
                      </div>

                      <h4 className="text-xs font-semibold text-white truncate mb-1.5">
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
                      <ScoreGauge score={evaluation.final_bid_fit_score} size={54} strokeWidth={4.5} />
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Evaluation Dossier Modal */}
      {selectedTender && selectedEvaluation && (
        <AiEvaluationModal
          tender={selectedTender}
          evaluation={selectedEvaluation}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
