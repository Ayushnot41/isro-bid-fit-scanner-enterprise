"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BidEvaluation, ScrapedTender } from "@/lib/types/database";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Search, SlidersHorizontal, ChevronRight, Sparkles, ShieldCheck, FileText, Download } from "lucide-react";
import { AiEvaluationModal } from "@/components/tenders/ai-evaluation-modal";
import { INITIAL_SCRAPED_TENDERS } from "@/lib/mock-data";

interface EvaluationsVaultProps {
  initialEvaluations: BidEvaluation[];
}

export function EvaluationsVault({ initialEvaluations }: EvaluationsVaultProps) {
  const [evaluations, setEvaluations] = useState<BidEvaluation[]>(initialEvaluations);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"ALL" | "HIGH" | "MODERATE" | "LOW">("ALL");

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

  const handleExportCSV = () => {
    const headers = "Reference,Title,FitScore,CertScore,ToleranceMet,MSMEWaivers,EvaluatedAt\n";
    const rows = evaluations
      .map(
        (e) =>
          `"${e.tender_reference}","${e.tender_title || ""}",${e.final_bid_fit_score},${e.certification_score},${e.tender_mechanical_tolerances_met},"${e.msme_waivers_applied.join("; ")}",${e.evaluated_at}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `isro_evaluations_vault_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search & Action Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evaluated dossiers by tender title, center, or RFP code..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 transition-all"
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            className="w-full sm:w-auto text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Vault (CSV)
          </Button>
        </div>

        {/* Score Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-zinc-500 font-mono mr-1">Filter Match:</span>
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
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dossiers Grid */}
      {filteredEvals.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-500">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No evaluation dossiers match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvals.map((evaluation, index) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              onClick={() => handleOpenDossier(evaluation)}
              className="bg-zinc-900/85 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all cursor-pointer group shadow-lg hover:shadow-emerald-950/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {evaluation.tender_reference}
                  </span>
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
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-3">
                  {evaluation.tender_title || "ISRO Tender Specification Evaluation"}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {evaluation.tender_mechanical_tolerances_met ? (
                    <Badge variant="success">Tolerances Met</Badge>
                  ) : (
                    <Badge variant="danger">Tolerance Gap</Badge>
                  )}
                  {evaluation.missing_certifications.length === 0 ? (
                    <Badge variant="success">Certs Compliant</Badge>
                  ) : (
                    <Badge variant="warning">{evaluation.missing_certifications.length} Cert Gaps</Badge>
                  )}
                  {evaluation.msme_waivers_applied.length > 0 && (
                    <Badge variant="info">MSME EMD Waived</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
                <span className="text-zinc-500 font-mono">
                  {formatDate(evaluation.evaluated_at)}
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Inspect Full Dossier
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AiEvaluationModal
        tender={selectedTender}
        evaluation={selectedEval}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
