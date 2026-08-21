"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BidEvaluation, ScrapedTender } from "@/lib/types/database";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Search, ChevronRight, FileText, Download, Trash2, Loader2, RefreshCw, Sparkles, Filter } from "lucide-react";
import { AiEvaluationModal } from "@/components/tenders/ai-evaluation-modal";
import { INITIAL_SCRAPED_TENDERS } from "@/lib/mock-data";

interface EvaluationsVaultProps {
  initialEvaluations: BidEvaluation[];
}

export function EvaluationsVault({ initialEvaluations }: EvaluationsVaultProps) {
  const [evaluations, setEvaluations] = useState<BidEvaluation[]>(initialEvaluations);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"ALL" | "HIGH" | "MODERATE" | "LOW">("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [selectedEval, setSelectedEval] = useState<BidEvaluation | null>(null);
  const [selectedTender, setSelectedTender] = useState<ScrapedTender | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEvals = useMemo(() => {
    return evaluations.filter((e) => {
      const matchSearch =
        searchQuery === "" ||
        (e.tender_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tender_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.issuing_center || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchScore =
        scoreFilter === "ALL" ||
        (scoreFilter === "HIGH" && e.final_bid_fit_score >= 75) ||
        (scoreFilter === "MODERATE" && e.final_bid_fit_score >= 50 && e.final_bid_fit_score < 75) ||
        (scoreFilter === "LOW" && e.final_bid_fit_score < 50);

      return matchSearch && matchScore;
    });
  }, [evaluations, searchQuery, scoreFilter]);

  const handleOpenDossier = (evaluation: BidEvaluation) => {
    const matchedTender =
      INITIAL_SCRAPED_TENDERS.find((t) => t.id === evaluation.tender_id) ||
      INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === evaluation.tender_reference) ||
      INITIAL_SCRAPED_TENDERS[0];

    setSelectedEval(evaluation);
    setSelectedTender(matchedTender);
    setIsModalOpen(true);
  };

  const handleDeleteDossier = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);

    try {
      await fetch(`/api/evaluations/${id}`, { method: "DELETE" });
      setEvaluations((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setEvaluations((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/evaluations");
      if (res.ok) {
        const data = await res.json();
        if (data.evaluations) {
          setEvaluations(data.evaluations);
        }
      }
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    window.location.href = "/api/evaluations/export";
  };

  return (
    <div className="space-y-6">
      {/* Search & Action Bar */}
      <div className="bg-[#13161a] border border-[#222730] p-4 rounded-2xl space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search dossiers by tender title, reference, or ISRO center..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full sm:w-auto text-xs flex items-center gap-1.5 font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              className="w-full sm:w-auto text-xs flex items-center gap-1.5 font-mono"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Vault (CSV)</span>
            </Button>
          </div>
        </div>

        {/* Score Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
          <span className="text-zinc-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-zinc-400" />
            Match Filter:
          </span>
          {(
            [
              { id: "ALL", label: "All Dossiers" },
              { id: "HIGH", label: "High Fit (≥75%)" },
              { id: "MODERATE", label: "Moderate (50-74%)" },
              { id: "LOW", label: "Low Fit (<50%)" },
            ] as const
          ).map((filter) => {
            const active = scoreFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setScoreFilter(filter.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-bold"
                    : "bg-[#0a0b0e] text-zinc-400 border border-[#222730] hover:border-[#303744] hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dossiers Grid (GPU Accelerated, Zero Layout Thrashing) */}
      {filteredEvals.length === 0 ? (
        <div className="text-center py-16 bg-[#13161a] border border-[#222730] rounded-2xl text-zinc-500 font-mono text-xs">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium text-zinc-400">No evaluation dossiers match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvals.map((evaluation) => (
            <div
              key={evaluation.id}
              onClick={() => handleOpenDossier(evaluation)}
              style={{ willChange: "transform, opacity" }}
              className="bg-[#13161a] hover:bg-[#161a20] border border-[#222730] hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-200 cursor-pointer group shadow-md flex flex-col justify-between relative hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/25">
                    {evaluation.tender_reference}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        evaluation.final_bid_fit_score >= 75
                          ? "success"
                          : evaluation.final_bid_fit_score >= 50
                          ? "warning"
                          : "danger"
                      }
                    >
                      {Math.round(evaluation.final_bid_fit_score)}% Match
                    </Badge>

                    <button
                      onClick={(e) => handleDeleteDossier(e, evaluation.id)}
                      disabled={deletingId === evaluation.id}
                      title="Archive dossier"
                      className="text-zinc-500 hover:text-red-400 p-1 rounded-lg hover:bg-[#1f242d] transition-colors"
                    >
                      {deletingId === evaluation.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug mb-3">
                  {evaluation.tender_title || evaluation.tender_reference}
                </h3>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#0a0b0e] border border-[#1f242d] text-center mb-4 font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">TOLERANCE</span>
                    <span className="text-xs font-bold text-white">
                      {Math.round(evaluation.tolerance_score ?? 0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">CERTS</span>
                    <span className="text-xs font-bold text-white">
                      {Math.round(evaluation.certification_score ?? 0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">MSME GFR</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {evaluation.msme_waivers_applied?.length > 0 ? "₹0 EMD" : "Standard"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1f242d] text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {evaluation.issuing_center || "ISRO HQ"} • {formatDate(evaluation.evaluated_at)}
                </span>
                <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Open Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Evaluation Modal */}
      <AiEvaluationModal
        tender={selectedTender}
        evaluation={selectedEval}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
