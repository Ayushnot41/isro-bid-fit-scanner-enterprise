"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
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
  Sparkles,
  Box,
  Handshake,
  KeyRound,
  Layers,
  Lightbulb,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import DynamicStreamingText from "@/components/ui/dynamic-streaming-text";
import { DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { generateEvaluationPDF } from "@/lib/pdf-generator";
import { Cad3dViewer } from "./cad-3d-viewer";
import { ConsortiumMatcher } from "./consortium-matcher";
import { DscSigner } from "./dsc-signer";
import { VernacularVoiceHud } from "@/components/ui/vernacular-voice-hud";
import { CompetitorIntelligenceTab } from "./competitor-intelligence-tab";
import { DocumentChecklistTab } from "./document-checklist-tab";

interface AiEvaluationModalProps {
  tender: ScrapedTender | null;
  evaluation: BidEvaluation | null;
  isOpen: boolean;
  onClose: () => void;
}

type ModalTab = "OVERVIEW" | "STRATEGY" | "COMPETITORS" | "CHECKLIST";

export function AiEvaluationModal({
  tender,
  evaluation,
  isOpen,
  onClose,
}: AiEvaluationModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("OVERVIEW");
  const [showCad, setShowCad] = useState(false);
  const [showConsortium, setShowConsortium] = useState(false);
  const [showDsc, setShowDsc] = useState(false);

  // Lock background scroll only when modal is genuinely active with valid props
  useLockBodyScroll(Boolean(isOpen && tender && evaluation));

  if (!isOpen || !tender || !evaluation) return null;

  const handleDownloadDossier = () => {
    generateEvaluationPDF(tender, evaluation, DEMO_VENDOR_PROFILE);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden selection:bg-emerald-500/30">
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
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl max-h-[92vh] bg-[#0e1115] border border-[#222730] rounded-2xl shadow-2xl shadow-black/90 flex flex-col overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#222730] bg-[#13161a] flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 pr-2">
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
                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {tender.title}
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-[#1c2128] transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3-Tab Navigation Bar */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#222730]/80 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveTab("OVERVIEW")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all relative ${
                    activeTab === "OVERVIEW"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                      : "text-zinc-400 hover:text-white hover:bg-[#181c22] border border-transparent"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab("STRATEGY")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all relative ${
                    activeTab === "STRATEGY"
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-zinc-400 hover:text-white hover:bg-[#181c22] border border-transparent"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Strategic Recommendations</span>
                </button>

                <button
                  onClick={() => setActiveTab("COMPETITORS")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all relative ${
                    activeTab === "COMPETITORS"
                      ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10"
                      : "text-zinc-400 hover:text-white hover:bg-[#181c22] border border-transparent"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Competitor Intelligence</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    L1 AUDIT
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("CHECKLIST")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all relative ${
                    activeTab === "CHECKLIST"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10"
                      : "text-zinc-400 hover:text-white hover:bg-[#181c22] border border-transparent"
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Document Checklist</span>
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#0a0b0e]">
              {/* ── TAB 1: OVERVIEW ───────────────────────────────────────── */}
              {activeTab === "OVERVIEW" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
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

                  {/* Vernacular Voice HUD Audio Briefing */}
                  <VernacularVoiceHud
                    tenderTitle={tender.title}
                    winProbability={evaluation.final_bid_fit_score}
                    emdSavedLakhs={(tender.emd_amount_inr || 640000) / 100000}
                  />

                  {/* Dynamic Streaming Text AI Synthesis */}
                  <div className="bg-[#13161a] border border-[#222730] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
                        Autonomous Intelligence Synthesis (ISRO GCC &amp; Drawing Parser)
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
                        Mechanical Tolerances &amp; GD&amp;T Matrix
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

                  {/* Grok Multi-Agent Strength of Materials & Commodity Pricing */}
                  <div className="bg-[#13161a] border border-emerald-500/30 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                          Groq AI Agentic Intelligence (Extractor &amp; Predictor)
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {evaluation.final_bid_fit_score}% Win Probability
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
                        <span className="font-bold text-cyan-400 block mt-1 font-mono">₹3,369 / kg (Ti-64 Spot)</span>
                        <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">Hedge: +4.5% Buffer (INR)</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                        <span className="text-zinc-400 block text-[10px] font-mono">STATUTORY MSME PRIVILEGE:</span>
                        <span className="font-bold text-emerald-400 block mt-1 font-mono">₹0 EMD (100% Waived)</span>
                        <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">GFR 2017 Rule 170(i)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 2: STRATEGIC RECOMMENDATIONS ───────────────────────── */}
              {activeTab === "STRATEGY" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="bg-[#13161a] border border-[#222730] rounded-xl p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        High-Value Strategic Bidding Recommendations
                      </h4>
                      <Badge variant="success" className="text-[10px] font-mono">
                        ISRO GCC &amp; MSME Aligned
                      </Badge>
                    </div>

                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5 text-xs text-zinc-200 leading-relaxed p-3 rounded-xl bg-[#0a0b0e] border border-[#1e232b]">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                          1
                        </span>
                        <div>
                          <strong className="text-white block font-sans">Zero-Cash EMD Working Capital Protection:</strong>
                          <span>Attach your valid Udyam Registration certificate in Technical Envelope-1 under GFR 2017 Rule 170(i) to preserve liquidity with ₹0 deposit.</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5 text-xs text-zinc-200 leading-relaxed p-3 rounded-xl bg-[#0a0b0e] border border-[#1e232b]">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                          2
                        </span>
                        <div>
                          <strong className="text-white block font-sans">L1 + 15% MSE Price-Matching Band Leverage:</strong>
                          <span>Under Indian Public Procurement Policy, if your commercial bid falls within 15% of the lowest quote (L1), you are entitled to match L1 and secure 25% of the total contract volume.</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5 text-xs text-zinc-200 leading-relaxed p-3 rounded-xl bg-[#0a0b0e] border border-[#1e232b]">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                          3
                        </span>
                        <div>
                          <strong className="text-white block font-sans">Raw Material Spot Price Inflation Hedge (+4.5%):</strong>
                          <span>Structure your Envelope-2 financial quote with an inflation hedge buffer against global alloy benchmarks to safeguard margins across the delivery cycle.</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5 text-xs text-zinc-200 leading-relaxed p-3 rounded-xl bg-[#0a0b0e] border border-[#1e232b]">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                          4
                        </span>
                        <div>
                          <strong className="text-white block font-sans">14-Day Pre-Dispatch Inspection (PDI) Buffer:</strong>
                          <span>Schedule third-party NABL metrology and CMM 3D sign-off 14 days before delivery to prevent ISRO GCC Clause 14.2 Liquidated Damages (0.5% per week delay penalty).</span>
                        </div>
                      </li>

                      <li className="flex items-start gap-2.5 text-xs text-zinc-200 leading-relaxed p-3 rounded-xl bg-[#0a0b0e] border border-[#1e232b]">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                          5
                        </span>
                        <div>
                          <strong className="text-white block font-sans">ISO Class 7 Cleanroom Nitrogen-Purge Packaging:</strong>
                          <span>Vacuum-seal finished hardware in dual antistatic polyethylene bags with dry nitrogen purge to eliminate orbital outgassing risks and pass stores receiving inspection.</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Advanced Aerospace Tools Ribbon */}
                  <div className="p-4 rounded-xl bg-[#0a0b0e] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Aerospace Bid Accelerators:
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                        3D Model Inspector, Consortium Matcher &amp; Class-3 Digital Signer
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setShowCad(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs transition-colors"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>3D CAD Inspector</span>
                      </button>

                      <button
                        onClick={() => setShowConsortium(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs transition-colors"
                      >
                        <Handshake className="w-3.5 h-3.5" />
                        <span>JV Consortium</span>
                      </button>

                      <button
                        onClick={() => setShowDsc(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Sign with DSC</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 3: COMPETITOR INTELLIGENCE ─────────────────────────── */}
              {activeTab === "COMPETITORS" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CompetitorIntelligenceTab
                    tender={tender}
                    vendorProfile={DEMO_VENDOR_PROFILE}
                  />
                </motion.div>
              )}

              {/* ── TAB 4: DOCUMENT CHECKLIST ─────────────────────────── */}
              {activeTab === "CHECKLIST" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DocumentChecklistTab
                    tender={tender}
                    evaluation={evaluation}
                    vendorProfile={DEMO_VENDOR_PROFILE}
                  />
                </motion.div>
              )}
            </div>

            {/* Modal Footer with Direct PDF Download & Print */}
            <div className="flex-shrink-0 p-4 border-t border-[#222730] bg-[#13161a] flex flex-wrap items-center justify-between gap-3">
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

          {/* 3D CAD Inspector Modal */}
          <Cad3dViewer
            partName={tender.title}
            alloyGrade="Ti-6Al-4V Grade 5 (Aerospace Spec)"
            tolerancesMet={Boolean(evaluation.tender_mechanical_tolerances_met)}
            isOpen={showCad}
            onClose={() => setShowCad(false)}
          />

          {/* Aerospace Consortium Matcher */}
          <ConsortiumMatcher
            tenderTitle={tender.title}
            isOpen={showConsortium}
            onClose={() => setShowConsortium(false)}
          />

          {/* Class-3 DSC Signer */}
          <DscSigner
            tenderReference={tender.reference_number}
            isOpen={showDsc}
            onClose={() => setShowDsc(false)}
          />
        </div>
    </AnimatePresence>
  );
}
