"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScrapedTender, BidEvaluation } from "@/lib/types/database";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  ExternalLink,
  Loader2,
  Sparkles,
  Calendar,
  Layers,
  Wrench,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  FileCheck2,
  Radio,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AiEvaluationModal } from "./ai-evaluation-modal";
import { PdfUploader } from "./pdf-uploader";
import { DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { evaluateBidFit } from "@/lib/evaluation/engine";

interface TenderListProps {
  tenders: ScrapedTender[];
  evaluations?: BidEvaluation[];
}

const ISRO_CENTERS = [
  { id: "ALL", label: "All Centers" },
  { id: "VSSC", label: "VSSC (Trivandrum)" },
  { id: "URSC", label: "URSC (Bengaluru)" },
  { id: "SAC", label: "SAC (Ahmedabad)" },
  { id: "IPRC", label: "IPRC (Mahendragiri)" },
  { id: "SDSC", label: "SDSC (Sriharikota)" },
  { id: "LPSC", label: "LPSC (Valiamala)" },
];

export function TenderList({ tenders: initialTenders, evaluations = [] }: TenderListProps) {
  const [tenders, setTenders] = useState<ScrapedTender[]>(initialTenders);
  const [selectedCenter, setSelectedCenter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [scraping, setScraping] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");

  // Modal State
  const [activeModalTender, setActiveModalTender] = useState<ScrapedTender | null>(null);
  const [activeModalEvaluation, setActiveModalEvaluation] = useState<BidEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  // Local evaluations map
  const [evaluationsMap, setEvaluationsMap] = useState<Record<string, BidEvaluation>>(() => {
    const map: Record<string, BidEvaluation> = {};
    evaluations.forEach((e) => {
      if (e.tender_id) map[e.tender_id] = e;
    });
    return map;
  });

  const router = useRouter();

  // Automated background live-sync loop
  useEffect(() => {
    if (!autoSync) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/scrape", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          if (data.tenders && data.tenders.length > 0) {
            setTenders(data.tenders);
          }
          const now = new Date();
          setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch {
        // silent continuous retry
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [autoSync]);

  // Instant Filter Logic
  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      const matchCenter =
        selectedCenter === "ALL" ||
        t.center_code === selectedCenter ||
        t.reference_number.startsWith(selectedCenter);
      const matchSearch =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.issuing_center || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchCenter && matchSearch;
    });
  }, [tenders, selectedCenter, searchQuery]);

  const handleEvaluate = async (tender: ScrapedTender) => {
    setEvaluatingId(tender.id);

    try {
      const localEval = evaluateBidFit(DEMO_VENDOR_PROFILE, tender);
      setEvaluationsMap((prev) => ({ ...prev, [tender.id]: localEval }));

      // Open detailed AI Analysis modal immediately
      setActiveModalTender(tender);
      setActiveModalEvaluation(localEval);
      setIsModalOpen(true);

      // Async sync to backend
      fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tender_id: tender.id }),
      }).catch(() => {});
    } catch {
      const fallbackEval = evaluateBidFit(DEMO_VENDOR_PROFILE, tender);
      setActiveModalTender(tender);
      setActiveModalEvaluation(fallbackEval);
      setIsModalOpen(true);
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.tenders && data.tenders.length > 0) {
          setTenders(data.tenders);
        }
        const now = new Date();
        setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.error("Scrape failed:", err);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Sync Status Pill & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${autoSync ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${autoSync ? 'bg-emerald-500' : 'bg-zinc-500'}`} />
          </span>
          <span className="font-semibold text-white">
            ISRO e-Procurement Live Gateway:
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {autoSync ? "SYNCING (20s Pulse)" : "PAUSED"}
          </span>
          <span className="text-zinc-500 hidden sm:inline">• Last sync: {lastSyncTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoSync(!autoSync)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              autoSync
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-zinc-800 text-zinc-400 border-zinc-700"
            }`}
          >
            <Radio className="w-3 h-3 inline mr-1" />
            {autoSync ? "Auto-Sync Active" : "Enable Auto-Sync"}
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tender name, RFP reference, material, or center..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowUploader(!showUploader)}
              className="w-full sm:w-auto text-xs"
            >
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              {showUploader ? "Hide Uploader" : "Upload Custom RFP (PDF)"}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleScrape}
              disabled={scraping}
              className="w-full sm:w-auto text-xs"
            >
              {scraping ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <RefreshCw className="w-4 h-4 text-emerald-400" />
              )}
              {scraping ? "Syncing..." : "Sync ISRO Portal"}
            </Button>
          </div>
        </div>

        {showUploader && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <PdfUploader
              onTenderParsed={(newTender) => {
                const createdTender: ScrapedTender = {
                  id: `custom-tender-${Date.now()}`,
                  reference_number: newTender.reference_number,
                  title: newTender.title,
                  description: "Manually uploaded tender document",
                  issuing_center: "ISRO Headquarter (Custom Ingestion)",
                  center_code: "VSSC",
                  closing_date: new Date(Date.now() + 30 * 86400000).toISOString(),
                  opening_date: null,
                  estimated_value_inr: newTender.estimated_value_inr,
                  emd_amount_inr: 840000,
                  category: newTender.category,
                  required_certifications: newTender.required_certifications,
                  required_tolerances: newTender.required_tolerances,
                  minimum_turnover_inr: 12000000,
                  required_capabilities: ["5-Axis CNC Machining", "Aerospace Fabrication"],
                  source_url: null,
                  pdf_storage_path: null,
                  raw_metadata: {},
                  is_active: true,
                  scraped_at: new Date().toISOString(),
                };
                setTenders((prev) => [createdTender, ...prev]);
                handleEvaluate(createdTender);
              }}
            />
          </motion.div>
        )}

        {/* Center Pill Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {ISRO_CENTERS.map((center) => {
            const active = selectedCenter === center.id;
            return (
              <button
                key={center.id}
                onClick={() => setSelectedCenter(center.id)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? "text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 shadow-sm"
                    : "text-zinc-400 bg-zinc-950/80 border border-zinc-800/80 hover:text-white hover:border-zinc-700"
                }`}
              >
                {center.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tender Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTenders.map((tender, index) => {
          const evalResult = evaluationsMap[tender.id];
          const isEvaluating = evaluatingId === tender.id;

          return (
            <motion.div
              key={tender.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.03, 0.3),
              }}
              className="bg-zinc-900/85 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 transition-all shadow-lg hover:shadow-emerald-950/20 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Tender Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {tender.reference_number}
                    </span>
                    <Badge variant="default" className="text-xs bg-zinc-800 text-zinc-300">
                      {tender.issuing_center}
                    </Badge>
                    {tender.category && (
                      <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                        {tender.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {tender.title}
                  </h3>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <span className="text-zinc-500">Value:</span>
                      <strong className="text-white">{formatCurrency(tender.estimated_value_inr)}</strong>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="text-zinc-500">EMD:</span>
                      <strong className="text-emerald-400">
                        {tender.emd_amount_inr ? formatCurrency(tender.emd_amount_inr) : "Exempted"}
                      </strong>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Closes: {formatDate(tender.closing_date)}</span>
                    </span>
                  </div>

                  {/* Required Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {tender.required_certifications?.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                      >
                        {c}
                      </span>
                    ))}
                    {tender.required_tolerances?.linear_tolerance_mm && (
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40 flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        ±{(tender.required_tolerances.linear_tolerance_mm * 1000).toFixed(0)} µm Machining
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Score Gauge & Action */}
                <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                  {evalResult ? (
                    <div className="flex items-center gap-3">
                      <ScoreGauge
                        score={evalResult.final_bid_fit_score}
                        size={65}
                        strokeWidth={6}
                        showPercentage
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-white font-mono">
                          {Math.round(evalResult.final_bid_fit_score)}% FIT
                        </p>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {evalResult.tender_mechanical_tolerances_met ? "✓ Tolerances Met" : "⚠ Deviation"}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <Button
                    variant={evalResult ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => handleEvaluate(tender)}
                    disabled={isEvaluating}
                    className="min-w-[120px] shadow-md text-xs font-semibold"
                  >
                    {isEvaluating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        {evalResult ? "View Dossier" : "Run Fit Scan"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredTenders.length === 0 && (
          <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-500">
            <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No tenders found matching your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Interactive AI Evaluation Modal */}
      <AiEvaluationModal
        tender={activeModalTender}
        evaluation={activeModalEvaluation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
