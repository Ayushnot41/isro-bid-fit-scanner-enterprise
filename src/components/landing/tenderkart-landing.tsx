"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { evaluateBidFit } from "@/lib/evaluation/engine";
import { AiEvaluationModal } from "@/components/tenders/ai-evaluation-modal";
import type { ScrapedTender, BidEvaluation } from "@/lib/types/database";

export function TenderkartLanding() {
  const [selectedTender, setSelectedTender] = useState<ScrapedTender | null>(null);
  const [selectedEval, setSelectedEval] = useState<BidEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredTenders = INITIAL_SCRAPED_TENDERS.slice(0, 3);

  const handleOpenFitScan = (tender: ScrapedTender) => {
    const evaluation = evaluateBidFit(DEMO_VENDOR_PROFILE, tender);
    setSelectedTender(tender);
    setSelectedEval(evaluation);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-100 selection:bg-emerald-500/30">
      {/* Top Navbar */}
      <header className="h-16 border-b border-[#222730] bg-[#0d0f12]/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Rocket className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-sm tracking-tight">ISRO Bid-Fit</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              PRO
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-400">
          <Link href="/tenders" className="hover:text-white transition-colors">
            ISRO Tenders
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Command Center
          </Link>
          <Link href="/evaluations" className="hover:text-white transition-colors">
            Evaluations
          </Link>
          <Link href="/profile" className="hover:text-white transition-colors">
            Capability Matrix
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>Launch HUD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 sm:px-12 max-w-5xl mx-auto text-center space-y-6">
        {/* Glow & Grid */}
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
          ISRO Space Procurement Intelligence Platform
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Autonomous ISRO Tender Intelligence & Bid-Fit Scanner
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Scan space-grade RFPs, verify GD&T micro-tolerances (±5 µm), apply statutory MSME EMD exemptions under GFR 170(i), and generate technical proposals in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
          >
            <span>Open Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tenders"
            className="px-6 py-3 rounded-xl bg-[#13161a] hover:bg-[#1a1f26] text-zinc-200 border border-[#222730] font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explore 8 Live Tenders</span>
          </Link>
        </div>

        {/* Minimal Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto font-mono text-xs text-left">
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

      {/* 3 Core Architecture Pillars */}
      <section className="py-12 px-6 sm:px-12 max-w-5xl mx-auto space-y-6 border-t border-[#1e232b]">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Designed for Indian Aerospace & Defense Suppliers
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Autonomous end-to-end procurement intelligence pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0e1115] border border-[#222730] hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Live Multi-Center Scraper</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time headless Chromium crawler scraping active RFPs and NIT specifications from VSSC, URSC, SAC, SDSC, IPRC, and LPSC.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e1115] border border-[#222730] hover:border-cyan-500/30 transition-all space-y-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Strength of Materials & GD&T</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automated parser evaluating Ti-6Al-4V Grade 5, Inconel 718, 5-axis CNC micro-tolerances (±5 µm), and cryogenic launch integrity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e1115] border border-[#222730] hover:border-amber-500/30 transition-all space-y-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Statutory MSME Compliance</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              100% EMD fee waiver automation under GFR 2017 Rule 170(i) and L1 + 15% MSE purchase preference volume allocation.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Live Tenders Strip */}
      <section className="py-12 px-6 sm:px-12 max-w-5xl mx-auto space-y-6 border-t border-[#1e232b]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Featured Live ISRO Tenders</h2>
            <p className="text-xs text-zinc-400 font-mono">Live RFPs currently open for vendor bidding</p>
          </div>
          <Link
            href="/tenders"
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Tenders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {featuredTenders.map((tender) => (
            <div
              key={tender.id}
              className="p-4 rounded-xl bg-[#0e1115] border border-[#222730] hover:border-zinc-700 transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {tender.reference_number}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400 bg-[#14181f] px-2 py-0.5 rounded border border-[#222730]">
                    {tender.issuing_center}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {tender.title}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono hidden sm:block">
                  <span className="text-[10px] text-zinc-500 block">EST. VALUE</span>
                  <span className="text-xs font-bold text-white">
                    {formatCurrency(tender.estimated_value_inr || 0)}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleOpenFitScan(tender)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs px-3.5 rounded-xl shadow-md"
                >
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>Run Fit Scan</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clean Minimalist Institutional Footer */}
      <footer className="py-8 px-6 sm:px-12 border-t border-[#1e232b] bg-[#0d0f12] text-xs font-mono text-zinc-500 flex flex-wrap items-center justify-between gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>ISRO Bid-Fit Scanner Enterprise • GFR 2017 & MSMED Act Standard</span>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
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
