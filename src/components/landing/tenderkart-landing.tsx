"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Rocket,
  ShieldCheck,
  Zap,
  ChevronRight,
  Sparkles,
  Layers,
  Wrench,
  Building2,
  Calendar,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Radio,
  FileText,
  BarChart3,
  TrendingUp,
  Cpu,
  RefreshCw,
  Globe,
  Award,
  Clock,
  Filter,
} from "lucide-react";
import { ScoreGauge } from "@/components/ui/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { evaluateBidFit } from "@/lib/evaluation/engine";
import { AiEvaluationModal } from "@/components/tenders/ai-evaluation-modal";
import type { ScrapedTender, BidEvaluation } from "@/lib/types/database";

const QUICK_SEARCH_TAGS = [
  "5-Axis CNC Titanium",
  "Cryogenic Pressure Vessel",
  "Satellite Telemetry & TT&C",
  "Inconel 718 Machining",
  "Cleanroom ISO 7 Assembly",
  "Carbon Fiber Honeycomb",
  "Helium Leak Testing",
];

const PORTALS = [
  { id: "ALL", label: "All Portals (80+)" },
  { id: "ISRO", label: "ISRO e-Procurement" },
  { id: "VSSC", label: "VSSC Trivandrum" },
  { id: "URSC", label: "URSC Bengaluru" },
  { id: "SAC", label: "SAC Ahmedabad" },
  { id: "IPRC", label: "IPRC Mahendragiri" },
  { id: "SDSC", label: "SDSC Sriharikota" },
  { id: "GEM", label: "GeM Aerospace" },
  { id: "CPPP", label: "CPPP Central" },
];

const MODES = [
  { id: "live", label: "Live Tenders", icon: Search },
  { id: "results", label: "Bid Award History", icon: Award },
  { id: "competitors", label: "Competitor Intel", icon: TrendingUp },
  { id: "extractor", label: "BOQ & PDF OCR", icon: Cpu },
];

const HISTORICAL_AWARDS = [
  {
    id: "hist-1",
    reference: "VSSC/L1/2026/089",
    title: "Fabrication of LVM3 Vikas Engine Gimbal Actuator Ring",
    awardedTo: "AeroPrecision India Ltd.",
    awardedValue: 34200000,
    l1Price: "₹3.42 Cr",
    biddersCount: 6,
    winningMargin: "3.8% below estimate",
    status: "Contract Awarded",
    center: "VSSC",
  },
  {
    id: "hist-2",
    reference: "URSC/PSLV/STAGE-2/44",
    title: "Supply of Titanium Alloy Grade 5 Satellite Housing Assemblies",
    awardedTo: "Zenith Space Technologies",
    awardedValue: 71800000,
    l1Price: "₹7.18 Cr",
    biddersCount: 9,
    winningMargin: "5.2% below estimate",
    status: "Contract Awarded",
    center: "URSC",
  },
  {
    id: "hist-3",
    reference: "SAC/PAYLOAD/OPT-02",
    title: "Opto-Mechanical Optical Mirror Mount Assemblies",
    awardedTo: "Bharat Precision Optics Ltd.",
    awardedValue: 18500000,
    l1Price: "₹1.85 Cr",
    biddersCount: 4,
    winningMargin: "2.1% below estimate",
    status: "Contract Awarded",
    center: "SAC",
  },
];

// Motion Variants
const containerFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemSlideUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function AnimatedTicker({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span className="font-mono tabular-nums">
      {prefix}
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function TenderkartLanding() {
  const [activeMode, setActiveMode] = useState<"live" | "results" | "competitors" | "extractor">("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPortal, setSelectedPortal] = useState("ALL");
  const [selectedTender, setSelectedTender] = useState<ScrapedTender | null>(null);
  const [selectedEval, setSelectedEval] = useState<BidEvaluation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [msmeOnly, setMsmeOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filtered live tenders
  const filteredTenders = useMemo(() => {
    return INITIAL_SCRAPED_TENDERS.filter((t) => {
      const matchPortal =
        selectedPortal === "ALL" ||
        (selectedPortal === "ISRO" && (t.issuing_center || "").includes("ISRO")) ||
        t.center_code === selectedPortal ||
        t.reference_number.startsWith(selectedPortal);

      const matchSearch =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.issuing_center || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchMsme = !msmeOnly || (t.emd_amount_inr && t.emd_amount_inr > 0);

      return matchPortal && matchSearch && matchMsme;
    });
  }, [searchQuery, selectedPortal, msmeOnly]);

  const handleInspectTender = (tender: ScrapedTender) => {
    const evaluation = evaluateBidFit(DEMO_VENDOR_PROFILE, tender);
    setSelectedTender(tender);
    setSelectedEval(evaluation);
    setModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <div className="min-h-[100dvh] bg-[#08090a] text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Top Fixed Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 bg-[#08090a]/90 backdrop-blur-md border-b border-[#222730]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 12, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm"
              >
                <Rocket className="w-5 h-5" />
              </motion.div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block leading-none">
                  TenderKart <span className="text-emerald-400">ISRO Pro</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                  Autonomous Procurement Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-300">
            <a href="#discovery-engine" className="hover:text-emerald-400 transition-colors">
              Tender Discovery
            </a>
            <a href="#market-intel" className="hover:text-emerald-400 transition-colors">
              Bid History & L1 Intel
            </a>
            <a href="#capabilities" className="hover:text-emerald-400 transition-colors">
              GD&T Engine
            </a>
            <a href="#portals" className="hover:text-emerald-400 transition-colors">
              80+ Portals
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#13161a] hover:bg-[#181c22] border border-[#222730] transition-colors inline-block"
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/dashboard"
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5"
              >
                <span>Launch Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Search Engine */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden border-b border-[#222730]">
        {/* Subtle Ambient Glow */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div
          variants={containerFade}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-7 text-center relative z-10"
        >
          {/* Live Scraper Gateway Status Pill */}
          <motion.div variants={itemSlideUp} className="inline-block">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#13161a] border border-[#222730] text-xs font-mono shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-zinc-300">Live Gateway:</span>
              <span className="text-emerald-400 font-bold">80+ Portals Synchronized (ISRO, GeM, CPPP)</span>
            </div>
          </motion.div>

          {/* Headline & Subtitle */}
          <motion.div variants={itemSlideUp} className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
              India&apos;s Defense & Aerospace <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Tender Discovery & Bid-Fit Engine
              </span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
              Find, evaluate, and win ISRO, DRDO, and PSU manufacturing contracts. Semantic GD&T tolerance matching, automated MSME GFR 2017 EMD waivers, and competitor L1 pricing history.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={itemSlideUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="bg-[#13161a]/80 backdrop-blur-sm border border-[#222730] p-3 rounded-xl">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Active Tender Value</span>
              <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                <AnimatedTicker end={14850} prefix="₹" suffix=" Cr+" />
              </span>
            </div>
            <div className="bg-[#13161a]/80 backdrop-blur-sm border border-[#222730] p-3 rounded-xl">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Portals Indexed</span>
              <span className="text-sm sm:text-base font-bold text-cyan-400 font-mono">
                <AnimatedTicker end={84} suffix=" Portals" />
              </span>
            </div>
            <div className="bg-[#13161a]/80 backdrop-blur-sm border border-[#222730] p-3 rounded-xl">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Scraper Pulse</span>
              <span className="text-sm sm:text-base font-bold text-purple-400 font-mono">
                20s Latency
              </span>
            </div>
            <div className="bg-[#13161a]/80 backdrop-blur-sm border border-[#222730] p-3 rounded-xl">
              <span className="text-[10px] text-zinc-500 font-mono block uppercase">Verified Vendors</span>
              <span className="text-sm sm:text-base font-bold text-amber-400 font-mono">
                <AnimatedTicker end={1240} suffix="+" />
              </span>
            </div>
          </motion.div>

          {/* Search Studio Card */}
          <motion.div
            variants={itemSlideUp}
            id="discovery-engine"
            className="bg-[#13161a] border border-[#222730] rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 space-y-4 text-left max-w-4xl mx-auto"
          >
            {/* Mode Switcher Tabs with LayoutId */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#222730] scrollbar-none relative">
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const active = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id as any)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                      active ? "text-emerald-300" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="landingModePill"
                        className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/30 rounded-xl"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Semantic Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 80+ portals by alloy (Ti-6Al-4V), RFP reference, tolerance (±5 µm), or center..."
                className="w-full pl-11 pr-28 py-3.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans transition-all"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Search</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </form>

            {/* Trending / Quick Search Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-zinc-500 font-mono mr-1">Trending:</span>
              {QUICK_SEARCH_TAGS.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#0a0b0e] hover:bg-[#181c22] text-zinc-300 hover:text-emerald-300 border border-[#222730] transition-colors"
                >
                  {tag}
                </motion.button>
              ))}
            </div>

            {/* Portal Filters & MSME Waiver Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1 relative">
                {PORTALS.map((portal) => {
                  const active = selectedPortal === portal.id;
                  return (
                    <button
                      key={portal.id}
                      onClick={() => setSelectedPortal(portal.id)}
                      className={`relative px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        active ? "text-emerald-300 font-semibold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="landingPortalPill"
                          className="absolute inset-0 bg-emerald-500/20 border border-emerald-500/40 rounded-lg"
                          transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{portal.label}</span>
                    </button>
                  );
                })}
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#0a0b0e] px-3 py-1.5 rounded-lg border border-[#222730] text-xs select-none">
                <input
                  type="checkbox"
                  checked={msmeOnly}
                  onChange={(e) => setMsmeOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#303744] bg-[#13161a] text-emerald-500 cursor-pointer"
                />
                <span className="text-zinc-300 font-mono text-[11px]">MSME EMD Waived Only</span>
              </label>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Results / Mode View Section with Staggered Animations */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#222730]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {activeMode === "live" && <Search className="w-4 h-4 text-emerald-400" />}
              {activeMode === "results" && <Award className="w-4 h-4 text-amber-400" />}
              {activeMode === "competitors" && <TrendingUp className="w-4 h-4 text-cyan-400" />}
              {activeMode === "extractor" && <Cpu className="w-4 h-4 text-purple-400" />}
              <span>
                {activeMode === "live" && `Live Procurement Opportunities (${filteredTenders.length} Active Tenders)`}
                {activeMode === "results" && "Historical Contract Awards & L1 Price Benchmark"}
                {activeMode === "competitors" && "Aerospace Competitor Win/Loss Intel"}
                {activeMode === "extractor" && "AI BOQ & PDF Specification Extractor"}
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeMode === "live" && "Evaluated in real-time against precision machining capability parameters"}
              {activeMode === "results" && "Recent contract award prices, winner margins, and bidder participation"}
              {activeMode === "competitors" && "Analyze vendor bidding track records across ISRO centers"}
              {activeMode === "extractor" && "Extract engineering drawings and GD&T clauses from heavy tender PDFs"}
            </p>
          </div>

          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Status: Gateway Operational
          </span>
        </div>

        {/* Animated View Container */}
        <AnimatePresence mode="wait">
          {/* MODE 1: Live Tenders Results Grid */}
          {activeMode === "live" && (
            <motion.div
              key="mode-live"
              variants={containerFade}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-4"
            >
              {filteredTenders.map((tender) => {
                const evalResult = evaluateBidFit(DEMO_VENDOR_PROFILE, tender);

                return (
                  <motion.div
                    key={tender.id}
                    variants={itemSlideUp}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="bg-[#13161a] hover:bg-[#161a20] border border-[#222730] hover:border-[#303744] rounded-2xl p-5 transition-colors shadow-md group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Left: Info */}
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/25">
                            {tender.reference_number}
                          </span>
                          <Badge variant="default" className="text-zinc-300 bg-[#1e232b] border-[#2b333f]">
                            {tender.issuing_center}
                          </Badge>
                          {tender.category && (
                            <span className="text-[11px] font-mono text-zinc-400 bg-[#0a0b0e] px-2 py-0.5 rounded border border-[#222730]">
                              {tender.category}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                          {tender.title}
                        </h3>

                        {/* Metadata Details */}
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

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {tender.required_certifications?.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40"
                            >
                              {c}
                            </span>
                          ))}
                          {tender.required_tolerances?.linear_tolerance_mm && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40 flex items-center gap-1">
                              <Wrench className="w-3 h-3" />
                              ±{(tender.required_tolerances.linear_tolerance_mm * 1000).toFixed(0)} µm Machining
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Score Gauge & Action */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#222730]">
                        <div className="flex items-center gap-3">
                          <ScoreGauge
                            score={evalResult.final_bid_fit_score}
                            size={60}
                            strokeWidth={5}
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

                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleInspectTender(tender)}
                            className="text-xs font-semibold shadow-md min-w-[120px]"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Inspect Dossier</span>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredTenders.length === 0 && (
                <div className="text-center py-16 bg-[#13161a] border border-[#222730] rounded-2xl text-zinc-500">
                  <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No tenders matched your active query filters.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* MODE 2: Bid Award History & L1 Price Benchmark */}
          {activeMode === "results" && (
            <motion.div
              key="mode-results"
              variants={containerFade}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3.5">
                {HISTORICAL_AWARDS.map((award) => (
                  <motion.div
                    key={award.id}
                    variants={itemSlideUp}
                    whileHover={{ y: -2 }}
                    className="bg-[#13161a] border border-[#222730] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                          {award.reference}
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">{award.center}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                          {award.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{award.title}</h3>
                      <p className="text-xs text-zinc-400">
                        Winner: <strong className="text-white">{award.awardedTo}</strong> • {award.biddersCount} Total Bids Submitted
                      </p>
                    </div>

                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[#222730]">
                      <span className="text-[11px] text-zinc-400 font-mono block">L1 Winning Value</span>
                      <span className="text-base font-bold text-emerald-400 font-mono block mt-0.5">
                        {award.l1Price}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{award.winningMargin}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* MODE 3: Competitor Intelligence */}
          {activeMode === "competitors" && (
            <motion.div
              key="mode-competitors"
              variants={containerFade}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                {
                  name: "AeroPrecision India Ltd.",
                  won: 14,
                  winRate: "68%",
                  topCenter: "VSSC & LPSC",
                  avgDiscount: "4.2%",
                },
                {
                  name: "Zenith Space Technologies",
                  won: 9,
                  winRate: "53%",
                  topCenter: "URSC",
                  avgDiscount: "6.1%",
                },
                {
                  name: "Bharat Precision Optics Ltd.",
                  won: 18,
                  winRate: "76%",
                  topCenter: "SAC & URSC",
                  avgDiscount: "2.8%",
                },
              ].map((comp) => (
                <motion.div
                  key={comp.name}
                  variants={itemSlideUp}
                  whileHover={{ y: -3 }}
                  className="bg-[#13161a] border border-[#222730] rounded-2xl p-5 space-y-3 shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">{comp.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#0a0b0e] p-2 rounded-xl border border-[#222730]">
                      <span className="text-zinc-500 block text-[10px]">Contracts Won</span>
                      <strong className="text-white text-sm">{comp.won}</strong>
                    </div>
                    <div className="bg-[#0a0b0e] p-2 rounded-xl border border-[#222730]">
                      <span className="text-zinc-500 block text-[10px]">Win Rate</span>
                      <strong className="text-emerald-400 text-sm">{comp.winRate}</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Top Procurement Centers: <span className="text-white">{comp.topCenter}</span>
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* MODE 4: BOQ & PDF Specification Extractor Demo */}
          {activeMode === "extractor" && (
            <motion.div
              key="mode-extractor"
              variants={containerFade}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#13161a] border border-[#222730] rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">
                  Optical Character Recognition & GD&T Drawing Parser
                </h3>
              </div>
              <p className="text-xs text-zinc-400 max-w-xl">
                Upload any complex ISRO NIT, General Conditions of Contract (GCC), or engineering drawing PDF to instantly convert messy clauses into structured technical parameters.
              </p>
              <div className="p-4 bg-[#0a0b0e] rounded-xl border border-[#222730] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">VSSC_CRYOTANK_RFP_SPEC_2026.pdf</p>
                    <p className="text-[10px] text-zinc-500 font-mono">14 Pages • 100% Parsed (Titanium Gr.5, ±5 µm, AS9100D)</p>
                  </div>
                </div>
                <Link
                  href="/tenders"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Test OCR Engine
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Key Architectural Features Grid with Scroll Trigger */}
      <section id="capabilities" className="py-14 px-4 sm:px-6 bg-[#0d0f12] border-t border-b border-[#222730]">
        <div className="max-w-6xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Aerospace & Defense Compliance
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Built to address strict ISRO vendor qualification rules, GFR 2017 statutory requirements, and mechanical GD&T drawing tolerances.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -4, borderColor: "rgba(16, 185, 129, 0.4)" }}
              className="bg-[#13161a] border border-[#222730] rounded-2xl p-6 space-y-3 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">GD&T Tolerance Matching</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Directly cross-references linear tolerances (±1 µm to ±50 µm), Ra surface finish, and 5-axis CNC capability with RFP requirements.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -4, borderColor: "rgba(6, 182, 212, 0.4)" }}
              className="bg-[#13161a] border border-[#222730] rounded-2xl p-6 space-y-3 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">MSME GFR 2017 Privileges</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatically calculates 100% EMD exemptions under Rule 170(i) and flags public procurement purchase preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ y: -4, borderColor: "rgba(168, 85, 247, 0.4)" }}
              className="bg-[#13161a] border border-[#222730] rounded-2xl p-6 space-y-3 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">20-Second Gateway Scraper</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Continuously queries ISRO e-Procurement portals to push fresh RFPs and corrigendum notices before competitors react.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Conversion Banner Section */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#13161a] border border-[#222730] rounded-3xl p-8 sm:p-12 space-y-5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Start Scanning Live ISRO Tenders Today
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Join hundreds of precision engineering vendors scanning live RFPs with automated technical bid-fit dossiers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-md flex items-center gap-2"
              >
                <span>Access Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-[#0a0b0e] hover:bg-[#181c22] border border-[#222730] transition-colors inline-block"
              >
                1-Click Demo Showcase
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-[#222730] text-center text-xs text-zinc-500 font-mono">
        <p>
          ISRO Bid-Fit Scanner Enterprise • Built in compliance with GFR 2017 & ISRO GCC Procurement Guidelines.
        </p>
      </footer>

      {/* Interactive AI Evaluation Modal */}
      <AiEvaluationModal
        tender={selectedTender}
        evaluation={selectedEval}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
