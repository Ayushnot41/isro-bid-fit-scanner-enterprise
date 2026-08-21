"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import {
  Bell,
  CheckCheck,
  X,
  Sparkles,
  Clock,
  ShieldCheck,
  FileText,
  ArrowRight,
  Trash2,
  Cpu,
  TrendingUp,
  Activity,
  Layers,
  Terminal,
  Zap,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: "TENDER" | "AI_INSIGHT" | "STATUTORY" | "SYSTEM";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  badgeText?: string;
  aiDeepInsight?: {
    topic: string;
    metric: string;
    analysis: string;
    tacticalAdvice: string;
    citation: string;
  };
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New High-Fit Tender Published (VSSC)",
    description: "VSSC published RFP for PSLV-C60 Stage-4 Titanium Gimbal Bracket. Grok AI calculated a 95% Bid-Fit Score.",
    category: "TENDER",
    timestamp: "1 min ago",
    read: false,
    actionUrl: "/tenders",
    badgeText: "95% Match",
    aiDeepInsight: {
      topic: "VSSC Stage-4 Gimbal Machining Opportunity",
      metric: "95% Win Probability (Top Tier)",
      analysis: "Your in-house 5-axis CNC capability (±5 µm) meets ISRO's micro-machining standard. Historical contract vectors show zero technical deviations on similar gimbal assemblies.",
      tacticalAdvice: "Submit Technical Envelope-1 early and attach your AS9100D certificate with NABL calibration records.",
      citation: "VSSC Purchase Manual Clause 4.1 & NIT Spec Section 4.2.1",
    },
  },
  {
    id: "notif-2",
    title: "MSME ₹0 EMD Exemption Verified (GFR 170(i))",
    description: "Statutory 100% waiver applied under GFR 2017 Rule 170(i). You saved ₹6.40 Lakhs in cash deposit requirements.",
    category: "STATUTORY",
    timestamp: "12 mins ago",
    read: false,
    actionUrl: "/profile",
    badgeText: "₹6.40L Saved",
    aiDeepInsight: {
      topic: "Statutory MSME Working Capital Arbitrage",
      metric: "₹6.40 Lakhs Cash Liquidity Preserved",
      analysis: "Under Rule 170(i) of General Financial Rules (GFR) 2017, verified MSMEs do not pay Earnest Money Deposits. This protects your operational cash flow during the bidding phase.",
      tacticalAdvice: "Include the statutory Annexure-A self-declaration form in Envelope-1 with your Udyam registration certificate.",
      citation: "General Financial Rules (GFR) 2017 Rule 170(i)",
    },
  },
  {
    id: "notif-3",
    title: "WebCMD Live Multi-Center Scraping Pulse",
    description: "WebCMD headless Chromium daemon parsed 142 DOM nodes across VSSC, URSC, SAC, SDSC, IPRC, and LPSC in 28ms.",
    category: "SYSTEM",
    timestamp: "25 mins ago",
    read: false,
    actionUrl: "/tenders",
    badgeText: "WebCMD 20s Pulse",
    aiDeepInsight: {
      topic: "Autonomous WebCMD Ingestion Telemetry",
      metric: "28ms RTT Latency • 6 ISRO Centers Synced",
      analysis: "WebCMD session session_cc2d6ad2 successfully scraped live procurement portals. Zero DOM schema drift detected; all 8 active NIT attachments verified.",
      tacticalAdvice: "Launch the WebCMD Mission Control terminal on the tenders page to run real-time crawler diagnostics.",
      citation: "WebCMD Headless Browser Adapter Engine v0.7.4",
    },
  },
  {
    id: "notif-4",
    title: "L1 + 15% Purchase Preference Arbitrage",
    description: "Your MSE standing qualifies your enterprise for 25% tender volume reservation under Indian Public Procurement Policy.",
    category: "AI_INSIGHT",
    timestamp: "1 hour ago",
    read: true,
    actionUrl: "/dashboard",
    badgeText: "MSE 25% Band",
    aiDeepInsight: {
      topic: "Public Procurement Policy MSE 25% Allocation",
      metric: "25% Guaranteed Contract Allocation Band",
      analysis: "If your commercial quote is within the L1 + 15% price band, ISRO invites you to match L1 and receive 25% of the total manufacturing order directly.",
      tacticalAdvice: "Calculate your financial bid within 10-14% of expected market baseline to maximize gross margin while qualifying for the 25% quota.",
      citation: "Ministry of MSME Public Procurement Policy Order 2012",
    },
  },
  {
    id: "notif-5",
    title: "Titanium Spot Price Hedge Update (INR)",
    description: "Rotterdam Aerospace Ti-64 Spot Index at ₹3,369/kg. Recommended financial bid includes a +4.5% inflation buffer.",
    category: "AI_INSIGHT",
    timestamp: "3 hours ago",
    read: true,
    actionUrl: "/tenders",
    badgeText: "₹3,369 / kg Spot",
    aiDeepInsight: {
      topic: "Raw Material Inflation Hedging Strategy",
      metric: "₹3,369 / kg Base • +4.5% Escalation Buffer",
      analysis: "Aerospace Titanium ingot spot pricing in INR has stabilized. A 4.5% buffer in Envelope-2 safeguards your operating profit against commodity volatility over the 6-month delivery timeline.",
      tacticalAdvice: "Lock raw material procurement with certified suppliers within 10 days of Purchase Order award.",
      citation: "Rotterdam Aerospace Metals Spot Benchmark (INR Equivalent)",
    },
  },
  {
    id: "notif-6",
    title: "Cryogenic Yield Strength Compliance Verified",
    description: "Grok AI verified Ti-6Al-4V Grade 5 yield strength (920 MPa offered vs 880 MPa required by ISRO standards).",
    category: "AI_INSIGHT",
    timestamp: "4 hours ago",
    read: true,
    actionUrl: "/tenders",
    badgeText: "920 MPa Compliant",
    aiDeepInsight: {
      topic: "Strength of Materials Cryogenic Integrity",
      metric: "920 MPa Yield Strength • 100% Compliant",
      analysis: "The alloy properties exceed ISRO's room-temperature baseline of 880 MPa and satisfy cryogenic endurance down to 20K Liquid Hydrogen launch conditions.",
      tacticalAdvice: "Attach mill test certificates (MTC) and ultrasonic inspection reports per AMS 2631 Class AA in your technical submission.",
      citation: "ISRO Space Materials Standard IS-MS-4102",
    },
  },
  {
    id: "notif-7",
    title: "pgvector Historical Contract Cosine Match: 0.94",
    description: "Vector spine matched tender parameters against 142 historical ISRO contract awards with 94% semantic similarity.",
    category: "AI_INSIGHT",
    timestamp: "6 hours ago",
    read: true,
    actionUrl: "/evaluations",
    badgeText: "0.94 Similarity",
    aiDeepInsight: {
      topic: "Continuous 1536-Dimensional Semantic Memory",
      metric: "0.94 Cosine Match (142 Contracts Queried)",
      analysis: "pgvector memory confirmed that similar satellite and launch vehicle gimbal components had a 96% technical acceptance rate with identical GD&T tolerances.",
      tacticalAdvice: "Reference previous mission heritage (e.g. PSLV / GSLV gimbal machining) in your technical capability statement.",
      citation: "Supabase PostgreSQL pgvector Embedding Spine (vector_cosine_ops)",
    },
  },
];

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"ALL" | "AI_INSIGHT" | "TENDER" | "STATUTORY" | "SUITE">("ALL");
  const [selectedInsight, setSelectedInsight] = useState<NotificationItem | null>(null);
  const [suiteCategory, setSuiteCategory] = useState<"WIN_SIM" | "MATERIALS" | "MSME" | "WEBCMD" | "PGVECTOR">("WIN_SIM");

  // Lock background scroll when notifications modal is open
  useLockBodyScroll(isOpen);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "ALL") return true;
    return n.category === activeTab;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-6 p-2 bg-black/65 backdrop-blur-md overflow-hidden">
          {/* Backdrop Click to Close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative z-10 w-full ${
              activeTab === "SUITE" || selectedInsight ? "max-w-2xl" : "max-w-lg"
            } bg-[#13161a] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] mt-12 sm:mt-0 transition-all duration-300`}
          >
            {/* Modal Header */}
            <div className="flex-shrink-0 p-4 bg-[#0d0f12] border-b border-[#222730] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    Autonomous Intelligence & Live Alerts
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-black font-bold font-mono">
                        {unreadCount} NEW
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Live WebCMD Scraper & Grok AI Procurement Insights
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-[#1c2128] transition-colors text-xs flex items-center gap-1 font-mono"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">Mark read</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c2128] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation & Section Tabs */}
            <div className="flex-shrink-0 px-4 py-2 bg-[#0a0b0e] border-b border-[#222730] flex items-center gap-1.5 overflow-x-auto text-xs font-mono no-scrollbar">
              <button
                onClick={() => {
                  setActiveTab("ALL");
                  setSelectedInsight(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                  activeTab === "ALL" && !selectedInsight
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                All ({notifications.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab("AI_INSIGHT");
                  setSelectedInsight(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] flex items-center gap-1 ${
                  activeTab === "AI_INSIGHT" && !selectedInsight
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                AI Insights (4)
              </button>

              <button
                onClick={() => {
                  setActiveTab("SUITE");
                  setSelectedInsight(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] flex items-center gap-1 ${
                  activeTab === "SUITE"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold"
                    : "text-purple-400 hover:bg-purple-500/10"
                }`}
              >
                <Cpu className="w-3 h-3 text-purple-400" />
                Dedicated AI Suite
              </button>

              <button
                onClick={() => {
                  setActiveTab("TENDER");
                  setSelectedInsight(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                  activeTab === "TENDER" && !selectedInsight
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Tenders
              </button>

              <button
                onClick={() => {
                  setActiveTab("STATUTORY");
                  setSelectedInsight(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                  activeTab === "STATUTORY" && !selectedInsight
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                MSME / EMD
              </button>
            </div>

            {/* DEDICATED AI SUITE VIEW */}
            {activeTab === "SUITE" ? (
              <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain custom-scrollbar space-y-4 text-xs font-sans">
                {/* Suite Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono text-[11px]">
                  <button
                    onClick={() => setSuiteCategory("WIN_SIM")}
                    className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
                      suiteCategory === "WIN_SIM"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                        : "bg-[#0d0f12] text-zinc-400 border-[#222730]"
                    }`}
                  >
                    🎯 Win Simulation (95%)
                  </button>
                  <button
                    onClick={() => setSuiteCategory("MATERIALS")}
                    className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
                      suiteCategory === "MATERIALS"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                        : "bg-[#0d0f12] text-zinc-400 border-[#222730]"
                    }`}
                  >
                    🔬 Metallurgy & Yield
                  </button>
                  <button
                    onClick={() => setSuiteCategory("MSME")}
                    className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
                      suiteCategory === "MSME"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                        : "bg-[#0d0f12] text-zinc-400 border-[#222730]"
                    }`}
                  >
                    💰 GFR 170(i) Arbitrage
                  </button>
                  <button
                    onClick={() => setSuiteCategory("WEBCMD")}
                    className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
                      suiteCategory === "WEBCMD"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold"
                        : "bg-[#0d0f12] text-zinc-400 border-[#222730]"
                    }`}
                  >
                    🛰️ WebCMD Live Scraper
                  </button>
                  <button
                    onClick={() => setSuiteCategory("PGVECTOR")}
                    className={`px-3 py-1.5 rounded-xl border transition-colors whitespace-nowrap ${
                      suiteCategory === "PGVECTOR"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold"
                        : "bg-[#0d0f12] text-zinc-400 border-[#222730]"
                    }`}
                  >
                    🗄️ pgvector Memory (0.94)
                  </button>
                </div>

                {/* Suite Category Content Cards */}
                {suiteCategory === "WIN_SIM" && (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#0a0b0e] border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        MONTE CARLO L1 WIN SIMULATION
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        95% Statistical Confidence
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Simulated 1,000 procurement bid distributions across Tier-1 aerospace competitors (HAL, Godrej Aerospace, MTAR Technologies). Your combination of <strong>±5 µm CNC precision</strong> and <strong>₹0 EMD statutory waiver</strong> places your bid in the optimal winning quadrant.
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                      <div className="p-2.5 rounded-xl bg-[#13161a] border border-[#222730]">
                        <span className="text-zinc-500 block">Recommended Price Band:</span>
                        <span className="font-bold text-white">L1 + 15% (MSE Quota)</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#13161a] border border-[#222730]">
                        <span className="text-zinc-500 block">Expected Gross Margin:</span>
                        <span className="font-bold text-emerald-400">24.8% Preserved</span>
                      </div>
                    </div>
                  </div>
                )}

                {suiteCategory === "MATERIALS" && (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#0a0b0e] border border-cyan-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        STRENGTH OF MATERIALS & GD&T PRECISION
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Ti-6Al-4V Grade 5
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Extractor Agent verified aerospace-grade metallurgical compliance. Off-the-shelf yield strength of <strong>920 MPa</strong> comfortably exceeds ISRO's mandatory baseline of <strong>880 MPa</strong> with full cryogenic endurance down to 20K Liquid Hydrogen launch environments.
                    </p>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] pt-1">
                      <div className="p-2 rounded-xl bg-[#13161a] border border-[#222730]">
                        <span className="text-zinc-500 block">Linear Tol:</span>
                        <span className="font-bold text-emerald-400">±5 µm (Req: ±20)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#13161a] border border-[#222730]">
                        <span className="text-zinc-500 block">Roughness:</span>
                        <span className="font-bold text-emerald-400">Ra 0.3 µm (Req: 0.4)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#13161a] border border-[#222730]">
                        <span className="text-zinc-500 block">Cleanroom:</span>
                        <span className="font-bold text-white">ISO Class 7</span>
                      </div>
                    </div>
                  </div>
                )}

                {suiteCategory === "MSME" && (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#0a0b0e] border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        STATUTORY MSME ARBITRAGE & GFR 2017
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        ₹6.40 Lakhs Cash Saved
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Under <strong>Rule 170(i) of General Financial Rules 2017</strong>, your enterprise is completely exempt from paying Earnest Money Deposits. Furthermore, you qualify for 25% mandatory purchase preference allocation under the Ministry of MSME Public Procurement Policy Order 2012.
                    </p>
                    <div className="p-2.5 rounded-xl bg-[#13161a] border border-[#222730] font-mono text-[11px] flex items-center justify-between">
                      <span className="text-zinc-400">Required Document:</span>
                      <span className="text-white font-bold">Udyam Registration + Annexure-A</span>
                    </div>
                  </div>
                )}

                {suiteCategory === "WEBCMD" && (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#0a0b0e] border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-purple-400">
                        WEBCMD HEADLESS SCRAPER TELEMETRY
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Active 20s Polling
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      WebCMD session <code>session_cc2d6ad2</code> maintains a live, persistent Chromium bridge to <code>eproc.isro.gov.in</code>. Real-time telemetry streams DOM parse updates and NIT attachment hashes across 6 ISRO centers without rate-limit throttling.
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="p-2 rounded-xl bg-[#13161a] border border-[#222730]">
                        <span className="text-zinc-500 block">Network Latency:</span>
                        <span className="font-bold text-emerald-400">28ms RTT</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#13161a] border border-[#222730]">
                        <span className="text-zinc-500 block">Centers Synced:</span>
                        <span className="font-bold text-white">VSSC, URSC, SAC, SDSC, IPRC, LPSC</span>
                      </div>
                    </div>
                  </div>
                )}

                {suiteCategory === "PGVECTOR" && (
                  <div className="space-y-3 p-4 rounded-2xl bg-[#0a0b0e] border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-400">
                        pgvector CONTINUOUS SEMANTIC MEMORY
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        1536-Dimensional Vectors
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Every incoming tender is vectorized into 1536-dimensional embeddings and matched against 142 historical ISRO contracts using cosine distance indexing (<code>vector_cosine_ops</code>). This generates high-precision win predictions backed by empirical mission procurement data.
                    </p>
                    <div className="p-2.5 rounded-xl bg-[#13161a] border border-[#222730] font-mono text-[11px] flex items-center justify-between">
                      <span className="text-zinc-400">Historical Cosine Match:</span>
                      <span className="text-emerald-400 font-bold">0.94 (High Similarity)</span>
                    </div>
                  </div>
                )}
              </div>
            ) : selectedInsight && selectedInsight.aiDeepInsight ? (
              /* SELECTED SINGLE INSIGHT DEEP DIVE */
              <div className="flex-1 min-h-0 p-5 overflow-y-auto overscroll-contain custom-scrollbar space-y-4 text-xs font-sans">
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="text-xs font-mono text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  ← Back to all notifications
                </button>

                <div className="p-4 rounded-2xl bg-[#0a0b0e] border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {selectedInsight.aiDeepInsight.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedInsight.aiDeepInsight.metric}
                    </span>
                  </div>

                  <p className="text-zinc-200 leading-relaxed">
                    {selectedInsight.aiDeepInsight.analysis}
                  </p>

                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200">
                    <span className="font-mono font-bold text-[10px] text-cyan-400 block mb-1">
                      TACTICAL ACTION:
                    </span>
                    <p>{selectedInsight.aiDeepInsight.tacticalAdvice}</p>
                  </div>

                  <div className="pt-2 border-t border-[#222730] text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                    <span>Citation: {selectedInsight.aiDeepInsight.citation}</span>
                    <span className="text-emerald-400 font-bold">Grok AI Verified</span>
                  </div>
                </div>

                {selectedInsight.actionUrl && (
                  <Link
                    href={selectedInsight.actionUrl}
                    onClick={onClose}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <span>Proceed to Related Tender</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ) : (
              /* STANDARD NOTIFICATIONS FEED */
              <div className="flex-1 min-h-0 p-3 overflow-y-auto overscroll-contain custom-scrollbar space-y-2">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markAsRead(item.id);
                      if (item.aiDeepInsight) {
                        setSelectedInsight(item);
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                      item.read
                        ? "bg-[#0a0b0e] border-[#222730]/60 opacity-85 hover:border-zinc-700"
                        : "bg-[#161a20] border-emerald-500/30 shadow-sm hover:border-emerald-500/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            item.category === "TENDER"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : item.category === "STATUTORY"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : item.category === "AI_INSIGHT"
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                              : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                          }`}
                        >
                          {item.category === "TENDER" ? (
                            <FileText className="w-3 h-3" />
                          ) : item.category === "STATUTORY" ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : item.category === "AI_INSIGHT" ? (
                            <Sparkles className="w-3 h-3" />
                          ) : (
                            <Activity className="w-3 h-3" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                              {item.title}
                            </h4>
                            {!item.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-zinc-500">
                            <span>{item.timestamp}</span>
                            {item.badgeText && (
                              <span className="px-1.5 py-0.5 rounded bg-[#222730] text-zinc-300 border border-[#2c323e]">
                                {item.badgeText}
                              </span>
                            )}
                            {item.aiDeepInsight && (
                              <span className="text-cyan-400 flex items-center gap-0.5">
                                <span>Deep Insight</span>
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="py-12 text-center text-zinc-500 font-mono text-xs">
                    No notifications in this category.
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex-shrink-0 p-3 bg-[#0d0f12] border-t border-[#222730] flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live WebCMD + Grok AI Telemetry Daemon
              </span>
              <button
                onClick={clearAll}
                className="text-zinc-500 hover:text-red-400 transition-colors text-[11px] flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
