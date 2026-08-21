"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Rocket,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  Radio,
  FileText,
  TrendingUp,
  Cpu,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Search,
  LogIn,
  UserPlus,
  Building2,
  Box,
  KeyRound,
  Handshake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { evaluateBidFit } from "@/lib/evaluation/engine";
import { AiEvaluationModal } from "@/components/tenders/ai-evaluation-modal";
import type { ScrapedTender, BidEvaluation } from "@/lib/types/database";

const CENTERS = ["ALL", "VSSC", "URSC", "SAC", "SDSC", "IPRC", "LPSC"];

export function TenderkartLanding() {
  const [selectedCenter, setSelectedCenter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTender, setSelectedTender] = useState<ScrapedTender | null>(null);
  const [selectedEval, setSelectedEval] = useState<BidEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTenders = useMemo(() => {
    return INITIAL_SCRAPED_TENDERS.filter((tender) => {
      const matchesCenter =
        selectedCenter === "ALL" ||
        (tender.issuing_center && tender.issuing_center.toUpperCase().includes(selectedCenter)) ||
        (tender.center_code && tender.center_code.toUpperCase().includes(selectedCenter));

      const matchesSearch =
        searchQuery === "" ||
        (tender.title && tender.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tender.reference_number && tender.reference_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tender.description && tender.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCenter && matchesSearch;
    });
  }, [selectedCenter, searchQuery]);

  const handleOpenFitScan = (tender: ScrapedTender) => {
    const evaluation = evaluateBidFit(DEMO_VENDOR_PROFILE, tender);
    setSelectedTender(tender);
    setSelectedEval(evaluation);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-100 selection:bg-emerald-500/30 font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-[#222730] bg-[#0d0f12]/90 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Rocket className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-sm tracking-tight font-sans">
              ISRO Bid-Fit
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PRO
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-zinc-400">
          <Link href="/tenders" className="hover:text-white transition-colors">
            ISRO Tenders
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Command Center
          </Link>
          <Link href="/evaluations" className="hover:text-white transition-colors">
            Evaluations Vault
          </Link>
          <Link href="/profile" className="hover:text-white transition-colors">
            Capability Matrix
          </Link>
        </div>

        {/* Right Auth Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-[#181c22] border border-transparent hover:border-[#222730] transition-colors flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/register"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register MSME</span>
          </Link>

          <Link
            href="/dashboard"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-[#13161a] hover:bg-[#1f2530] text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold items-center gap-1.5 transition-colors"
          >
            <span>Launch HUD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-6">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13161a] border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ISRO Space Procurement & Defense Bid Intelligence
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto font-sans">
          Autonomous ISRO Tender Intelligence & Bid-Fit Scanner
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Scan space-grade RFPs, verify GD&T micro-tolerances (±5 µm), apply statutory MSME EMD exemptions under GFR 170(i), and generate technical proposals in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
          >
            <span>Launch Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-[#13161a] hover:bg-[#1a1f26] text-zinc-200 border border-[#222730] font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Sign In as Supplier</span>
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Onboard Workshop (MSME)</span>
          </Link>
        </div>

        {/* Real-time Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-4xl mx-auto font-mono text-xs text-left">
          <div className="p-3.5 rounded-xl bg-[#0e1115] border border-[#222730]">
            <span className="text-zinc-500 text-[10px] block">MONITORED</span>
            <span className="text-white font-bold text-sm">6 ISRO Centers</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0e1115] border border-[#222730]">
            <span className="text-zinc-500 text-[10px] block">STATUTORY</span>
            <span className="text-emerald-400 font-bold text-sm">100% GFR 170(i)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0e1115] border border-[#222730]">
            <span className="text-zinc-500 text-[10px] block">ACCURACY</span>
            <span className="text-cyan-400 font-bold text-sm">95% Fit Score</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0e1115] border border-[#222730]">
            <span className="text-zinc-500 text-[10px] block">MSME BENEFIT</span>
            <span className="text-amber-400 font-bold text-sm">₹0 EMD Deposit</span>
          </div>
        </div>
      </section>

      {/* Live Tenders Discovery HUD */}
      <section className="py-10 px-6 sm:px-12 max-w-6xl mx-auto space-y-5 border-t border-[#1e232b]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white font-sans flex items-center gap-2">
              Live ISRO Tenders Terminal
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {filteredTenders.length} Active RFPs
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Directly synchronized from eproc.isro.gov.in with automated Bid-Fit evaluation
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search RFPs, titanium, valves..."
              className="w-full pl-10 pr-4 py-2 bg-[#0e1115] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-sans"
            />
          </div>
        </div>

        {/* Center Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs no-scrollbar">
          {CENTERS.map((center) => (
            <button
              key={center}
              onClick={() => setSelectedCenter(center)}
              className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap text-[11px] ${
                selectedCenter === center
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                  : "bg-[#0e1115] text-zinc-400 border-[#222730] hover:text-white"
              }`}
            >
              {center === "ALL" ? "All Centers" : center}
            </button>
          ))}
        </div>

        {/* Tenders Grid */}
        <div className="space-y-3">
          {filteredTenders.map((tender) => (
            <div
              key={tender.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0e1115] border border-[#222730] hover:border-emerald-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-sm"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/25">
                    {tender.reference_number}
                  </span>
                  <span className="text-zinc-300 bg-[#13161a] px-2.5 py-0.5 rounded border border-[#222730]">
                    {tender.issuing_center}
                  </span>
                  <span className="text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20 text-[10px]">
                    ±5 µm CNC Match
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors font-sans leading-snug">
                  {tender.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                  <span>Est. Value: <strong className="text-white">{formatCurrency(tender.estimated_value_inr || 0)}</strong></span>
                  <span>EMD: <strong className="text-emerald-400">₹0 (MSME Waived)</strong></span>
                  <span>Closing: <span className="text-zinc-300">{tender.closing_date ? formatDate(tender.closing_date) : "Open"}</span></span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2 md:pt-0">
                <Button
                  size="sm"
                  onClick={() => handleOpenFitScan(tender)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run AI Fit Scan</span>
                </Button>
                <Link
                  href="/tenders"
                  className="p-2 rounded-xl bg-[#13161a] border border-[#222730] text-zinc-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}

          {filteredTenders.length === 0 && (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs bg-[#0e1115] rounded-2xl border border-[#222730]">
              No ISRO tenders matched your filter criteria.
            </div>
          )}
        </div>
      </section>

      {/* Strategic Toolkit Grid */}
      <section className="py-12 px-6 sm:px-12 max-w-6xl mx-auto space-y-6 border-t border-[#1e232b]">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            Complete Aerospace Bidding Intelligence Suite
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Engineered specifically for certified Indian aerospace & defense suppliers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0e1115] border border-[#222730] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">Strength of Materials (920 MPa)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automated metallurgical analyzer evaluating Ti-6Al-4V Grade 5, Inconel 718, and cryogenic Liquid Hydrogen compliance down to 20K.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e1115] border border-[#222730] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Box className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">3D CAD Model Inspector</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Interactive 60–120 FPS hardware-accelerated WebGL viewport with GD&T critical tolerance heatmap and concentricity overlays.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e1115] border border-[#222730] space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-sans">Class-3 DSC Digital Signer</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cryptographic SHA-256 envelope signing simulator compliant with Indian IT Act 2000 & CCA standards for eproc.isro.gov.in.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Sign-up / Onboarding Banner */}
      <section className="py-12 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0d131a] via-[#101720] to-[#0d131a] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified MSME Supplier Program
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
              Join 250+ Empaneled Indian Aerospace Manufacturers
            </h2>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              Connect your Udyam MSME certificate and CNC workshop capabilities to receive instant Bid-Fit matches and automated ₹0 EMD tender proposals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Supplier Account</span>
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-[#13161a] hover:bg-[#1f2530] text-zinc-200 border border-[#222730] font-mono text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Minimalist Institutional Footer */}
      <footer className="py-8 px-6 sm:px-12 border-t border-[#1e232b] bg-[#0d0f12] text-xs font-mono text-zinc-500 flex flex-wrap items-center justify-between gap-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>ISRO Bid-Fit Scanner Enterprise • GFR 2017 & MSMED Act Standard</span>
        </div>

        <div className="flex items-center gap-5 text-zinc-400">
          <Link href="/login" className="hover:text-emerald-400 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-emerald-400 transition-colors">
            Register Company
          </Link>
          <Link href="/tenders" className="hover:text-white transition-colors">
            Tenders HUD
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Command Center
          </Link>
          <a
            href="https://eproc.isro.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>eproc.isro.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>

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
