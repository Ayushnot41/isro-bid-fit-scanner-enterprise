"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BidEvaluation, ScrapedTender } from "@/lib/types/database";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  X,
  ExternalLink,
  Printer,
  Download,
  ShieldCheck,
  Wrench,
  Radio,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto selection:bg-emerald-500/30">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0e1115] border border-[#222730] rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#222730] flex items-start justify-between bg-[#13161a]">
              <div className="flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/25">
                    {tender.reference_number}
                  </span>
                  <Badge variant="default" className="text-zinc-300 bg-[#1e232b] border-[#2b333f]">
                    {tender.issuing_center}
                  </Badge>
                  {tender.category && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#0a0b0e] text-zinc-300 border border-[#222730]">
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
                aria-label="Close dialog"
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1c2128] transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#0a0b0e]">
              {/* Score Breakdown Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center p-5 bg-[#13161a] border border-[#222730] rounded-xl shadow-inner">
                <div className="md:col-span-4 flex flex-col items-center justify-center">
                  <ScoreGauge
                    score={evaluation.final_bid_fit_score}
                    size={120}
                    strokeWidth={9}
                    showPercentage
                  />
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                    ISRO STATUTORY FIT
                  </span>
                </div>

                <div className="md:col-span-8 grid grid-cols-2 gap-3">
                  <div className="bg-[#0a0b0e] p-3 rounded-xl border border-[#222730]">
                    <p className="text-[11px] text-zinc-400 font-mono">Contract Value</p>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">
                      {formatCurrency(tender.estimated_value_inr || 0)}
                    </p>
                  </div>

                  <div className="bg-[#0a0b0e] p-3 rounded-xl border border-[#222730]">
                    <p className="text-[11px] text-zinc-400 font-mono">EMD Requirement</p>
                    <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      {evaluation.msme_waivers_applied.length > 0 ? "₹0 (100% MSME Waived)" : formatCurrency(tender.emd_amount_inr || 0)}
                    </p>
                  </div>

                  <div className="bg-[#0a0b0e] p-3 rounded-xl border border-[#222730]">
                    <p className="text-[11px] text-zinc-400 font-mono">Tolerance Match</p>
                    <p className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                      {Math.round(evaluation.tolerance_score ?? 0)}% Compliant
                    </p>
                  </div>

                  <div className="bg-[#0a0b0e] p-3 rounded-xl border border-[#222730]">
                    <p className="text-[11px] text-zinc-400 font-mono">Quality Accreditations</p>
                    <p className="text-sm font-bold text-purple-400 font-mono mt-0.5">
                      {Math.round(evaluation.certification_score ?? 0)}% Verified
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Streaming Text AI Synthesis */}
              <div className="bg-[#13161a] border border-[#222730] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                    Autonomous Intelligence Synthesis (ISRO GCC & Drawing Parser)
                  </h4>
                </div>
                <div className="bg-[#0a0b0e] rounded-xl p-4 border border-[#222730]">
                  <DynamicStreamingText
                    tender={tender}
                    profile={DEMO_VENDOR_PROFILE}
                    fitScore={evaluation.final_bid_fit_score}
                  />
                </div>
              </div>

              {/* GD&T Tolerance Comparison Table */}
              <div className="bg-[#13161a] border border-[#222730] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                    Mechanical Tolerances & GD&T Matrix
                  </h4>
                  <Badge variant={evaluation.tender_mechanical_tolerances_met ? "success" : "danger"}>
                    {evaluation.tender_mechanical_tolerances_met ? "Within Tolerance Limits" : "Deviation Flagged"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                    <span className="text-zinc-500 block text-[11px] font-mono">ISRO Required Linear Tolerance:</span>
                    <span className="font-mono text-white font-semibold mt-0.5 block">
                      {tender.required_tolerances?.linear_tolerance_mm
                        ? `±${(tender.required_tolerances.linear_tolerance_mm * 1000).toFixed(0)} µm`
                        : "Standard Aerospace Spec"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                    <span className="text-zinc-500 block text-[11px] font-mono">Vendor Workshop Capability:</span>
                    <span className="font-mono text-emerald-400 font-semibold mt-0.5 block">
                      ±5 µm (5-Axis CNC Precision)
                    </span>
                  </div>
                </div>
              </div>

              {/* Grok-4.20 Multi-Agent Strength of Materials & Commodity Pricing */}
              <div className="bg-[#13161a] border border-emerald-500/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                      Grok AI Agentic Intelligence (Extractor & Predictor)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    95% Win Probability
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                    <span className="text-zinc-400 block text-[10px] font-mono">STRENGTH OF MATERIALS:</span>
                    <span className="font-bold text-white block mt-1 font-mono">Ti-6Al-4V Grade 5</span>
                    <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">Yield: 920 MPa (Req: 880)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                    <span className="text-zinc-400 block text-[10px] font-mono">COMMODITY SPOT INDEX:</span>
                    <span className="font-bold text-cyan-400 block mt-1 font-mono">Rotterdam Ti-64 ($38.5/kg)</span>
                    <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">Hedge: +4.5% Buffer</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                    <span className="text-zinc-400 block text-[10px] font-mono">STATUTORY MSME PRIVILEGE:</span>
                    <span className="font-bold text-emerald-400 block mt-1 font-mono">100% EMD Waived</span>
                    <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">GFR 2017 Rule 170(i)</span>
                  </div>
                </div>
              </div>

              {/* Recommendations & Statutory Guidance */}
              <div className="bg-[#13161a] border border-[#222730] rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                  Recommended Bidding Strategy
                </h4>
                <ul className="space-y-2">
                  {evaluation.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer with Direct PDF Download & Print */}
            <div className="p-4 border-t border-[#222730] bg-[#13161a] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadDossier}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official PDF Dossier</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-[#1c2128] hover:bg-[#242b35] border border-[#222730] transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                  Close
                </Button>
                {tender.source_url && (
                  <a
                    href={tender.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#1c2128] hover:bg-[#242b35] text-zinc-200 border border-[#222730] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>ISRO e-Procurement Portal</span>
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
