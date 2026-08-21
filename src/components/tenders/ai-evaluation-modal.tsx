"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BidEvaluation, ScrapedTender } from "@/lib/types/database";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  X,
  ShieldCheck,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Printer,
  Download,
  FileCheck,
} from "lucide-react";
import DynamicStreamingText from "@/components/ui/dynamic-streaming-text";
import { DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { generateEvaluationPDF } from "@/lib/pdf-generator";

interface AiEvaluationModalProps {
  tender: ScrapedTender | null;
  evaluation: BidEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AiEvaluationModal({
  tender,
  evaluation,
  isOpen,
  onClose,
}: AiEvaluationModalProps) {
  if (!tender || !evaluation) return null;

  const handleDownloadDossier = () => {
    generateEvaluationPDF(tender, evaluation, DEMO_VENDOR_PROFILE);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl shadow-emerald-950/40 flex flex-col overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800 flex items-start justify-between bg-zinc-950/60">
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    {tender.reference_number}
                  </span>
                  <Badge variant="default" className="text-zinc-300 bg-zinc-800">
                    {tender.issuing_center}
                  </Badge>
                  {tender.category && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-300">
                      {tender.category}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {tender.title}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Score Breakdown Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl">
                <div className="md:col-span-4 flex items-center justify-center">
                  <ScoreGauge
                    score={evaluation.final_bid_fit_score}
                    size={130}
                    strokeWidth={10}
                    showPercentage
                  />
                </div>

                <div className="md:col-span-8 grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <p className="text-[11px] text-zinc-400">Contract Estimate</p>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">
                      {formatCurrency(tender.estimated_value_inr || 0)}
                    </p>
                  </div>

                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <p className="text-[11px] text-zinc-400">EMD Requirement</p>
                    <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      {evaluation.msme_waivers_applied.length > 0 ? "₹0 (100% MSME Waived)" : formatCurrency(tender.emd_amount_inr || 0)}
                    </p>
                  </div>

                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <p className="text-[11px] text-zinc-400">Tolerance Match</p>
                    <p className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                      {Math.round(evaluation.tolerance_score ?? 0)}% Met
                    </p>
                  </div>

                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <p className="text-[11px] text-zinc-400">Quality Certifications</p>
                    <p className="text-sm font-bold text-purple-400 font-mono mt-0.5">
                      {Math.round(evaluation.certification_score ?? 0)}% Compliant
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Streaming Text AI Synthesis */}
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <h4 className="text-sm font-semibold text-white">
                    Autonomous Intelligence Synthesis (ISRO GCC & Spec Parser)
                  </h4>
                </div>
                <div className="bg-zinc-900/60 rounded-xl p-4 border border-zinc-800/60">
                  <DynamicStreamingText
                    tender={tender}
                    profile={DEMO_VENDOR_PROFILE}
                    fitScore={evaluation.final_bid_fit_score}
                  />
                </div>
              </div>

              {/* GD&T Tolerance Comparison Table */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                    Mechanical Tolerances & GD&T Matrix
                  </h4>
                  <Badge variant={evaluation.tender_mechanical_tolerances_met ? "success" : "danger"}>
                    {evaluation.tender_mechanical_tolerances_met ? "Within Tolerance Limits" : "Deviation Flagged"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[11px]">ISRO Required Linear Tolerance:</span>
                    <span className="font-mono text-white font-semibold">
                      {tender.required_tolerances?.linear_tolerance_mm
                        ? `±${(tender.required_tolerances.linear_tolerance_mm * 1000).toFixed(0)} µm`
                        : "Standard Aerospace Spec"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[11px]">Vendor Workshop Capability:</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      ±5 µm (5-Axis CNC Precision)
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations & Statutory Guidance */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                  Recommended Bidding Strategy
                </h4>
                <ul className="space-y-2">
                  {evaluation.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer with Direct PDF Download & Print */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadDossier}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Official PDF Dossier
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Close
                </Button>
                {tender.source_url && (
                  <a
                    href={tender.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open on ISRO e-Procurement
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
