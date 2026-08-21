"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Building2,
  Share2,
  FileDown,
  Bookmark,
  StickyNote,
  Bell,
  BellRing,
  Radar,
  Radio,
  CheckCircle2,
  Sparkles,
  Layers,
  MapPin,
  History,
  Users,
  Target,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Download,
  Filter,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  AlertCircle,
  Clock,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  VENDOR_PROFILES_STORE,
  ALL_VENDORS_LIST,
  type CompleteVendorProfile,
} from "@/lib/intelligence/vendor-profile-data";
import { InteractiveDonutChart } from "@/components/intelligence/interactive-donut-chart";

type TimeRangeOption = "ALL_TIME" | "LAST_12_MONTHS" | "FY_2025_26" | "FY_2024_25";
type MetricToggle = "AMOUNT" | "COUNT";
type OrgFilterOption = "ALL" | "AWARDED" | "WON";
type TenderStatusFilter = "ALL" | "AWARDED" | "L1 STANDING" | "YET TO OPEN" | "DISCARDED";

export default function VendorProfilePage() {
  const router = useRouter();

  // Selected vendor state
  const [selectedVendorId, setSelectedVendorId] = useState<string>("aeroprecision");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filters & metric toggles
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("ALL_TIME");
  const [metricMode, setMetricMode] = useState<MetricToggle>("AMOUNT");
  const [activeTab, setActiveTab] = useState<"INSIGHTS" | "ORGS" | "COMPETITORS" | "TENDERS">("INSIGHTS");

  // Sub-section filters
  const [orgFilter, setOrgFilter] = useState<OrgFilterOption>("ALL");
  const [tenderStatusFilter, setTenderStatusFilter] = useState<TenderStatusFilter>("ALL");
  const [tenderTableSearch, setTenderTableSearch] = useState("");

  // Watchlist & UI state
  const [isTracking, setIsTracking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);

  // Active vendor data lookup
  const vendor: CompleteVendorProfile = useMemo(() => {
    return VENDOR_PROFILES_STORE[selectedVendorId] || VENDOR_PROFILES_STORE["aeroprecision"];
  }, [selectedVendorId]);

  // Autocomplete search filtered list
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return ALL_VENDORS_LIST;
    return ALL_VENDORS_LIST.filter(
      (v) =>
        v.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.headquarters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.short_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Time-range multiplier for simulation
  const timeMultiplier = useMemo(() => {
    switch (timeRange) {
      case "LAST_12_MONTHS":
        return 0.65;
      case "FY_2025_26":
        return 0.45;
      case "FY_2024_25":
        return 0.55;
      default:
        return 1.0;
    }
  }, [timeRange]);

  // Computed Donut 1: Total Bids Distribution
  const totalBidsDonutData = useMemo(() => {
    const raw = vendor.insights.total_bids;
    if (metricMode === "AMOUNT") {
      const v = vendor.insights.total_value_cr;
      return [
        { label: "Awarded (Won)", value: Math.round(v.awarded * timeMultiplier * 10) / 10, color: "#10b981" },
        { label: "Pending Evaluation", value: Math.round(v.pending * timeMultiplier * 10) / 10, color: "#06b6d4" },
        { label: "Yet to Open", value: Math.round(v.yet_to_open * timeMultiplier * 10) / 10, color: "#a855f7" },
        { label: "Lost / Discarded", value: Math.round(v.lost * timeMultiplier * 10) / 10, color: "#ef4444" },
      ];
    } else {
      return [
        { label: "Awarded (Won)", value: Math.round(raw.awarded * timeMultiplier), color: "#10b981" },
        { label: "Pending Evaluation", value: Math.round(raw.pending * timeMultiplier), color: "#06b6d4" },
        { label: "Yet to Open", value: Math.round(raw.yet_to_open * timeMultiplier), color: "#a855f7" },
        { label: "Lost / Discarded", value: Math.round(raw.lost * timeMultiplier), color: "#ef4444" },
      ];
    }
  }, [vendor, metricMode, timeMultiplier]);

  // Computed Donut 2: Contract Value by Financial Bid
  const contractValueDonutData = useMemo(() => {
    const v = vendor.insights.total_value_cr;
    if (metricMode === "AMOUNT") {
      return [
        { label: "Awarded Value", value: Math.round(v.awarded * timeMultiplier * 10) / 10, color: "#10b981" },
        { label: "Pending Quotes", value: Math.round(v.pending * timeMultiplier * 10) / 10, color: "#06b6d4" },
        { label: "Yet-to-Open Tenders", value: Math.round(v.yet_to_open * timeMultiplier * 10) / 10, color: "#a855f7" },
        { label: "Lost Quotations", value: Math.round(v.lost * timeMultiplier * 10) / 10, color: "#64748b" },
      ];
    } else {
      const b = vendor.insights.total_bids;
      return [
        { label: "Awarded Bids", value: Math.round(b.awarded * timeMultiplier), color: "#10b981" },
        { label: "Pending Bids", value: Math.round(b.pending * timeMultiplier), color: "#06b6d4" },
        { label: "Yet-to-Open Bids", value: Math.round(b.yet_to_open * timeMultiplier), color: "#a855f7" },
        { label: "Lost Bids", value: Math.round(b.lost * timeMultiplier), color: "#64748b" },
      ];
    }
  }, [vendor, metricMode, timeMultiplier]);

  // Total sums for central labels
  const totalBidsSum = useMemo(() => {
    const raw = vendor.insights.total_bids;
    return Math.round((raw.awarded + raw.pending + raw.yet_to_open + raw.lost) * timeMultiplier);
  }, [vendor, timeMultiplier]);

  const totalValueSumCr = useMemo(() => {
    const v = vendor.insights.total_value_cr;
    return Math.round((v.awarded + v.pending + v.yet_to_open + v.lost) * timeMultiplier * 10) / 10;
  }, [vendor, timeMultiplier]);

  // Top Organisations Donut Data
  const topOrgsDonutData = useMemo(() => {
    const colors = ["#10b981", "#06b6d4", "#a855f7", "#3b82f6", "#f59e0b", "#64748b"];
    return vendor.top_organisations.map((org, i) => ({
      label: org.center_code === "OTHER" ? "Other Centers" : org.center_code,
      value: metricMode === "AMOUNT" ? Math.round(org.value_cr * timeMultiplier * 10) / 10 : Math.round(org.bids_count * timeMultiplier),
      color: colors[i % colors.length],
      subtext: org.org_name,
    }));
  }, [vendor, metricMode, timeMultiplier]);

  // Filtered Tender History Table
  const filteredTenders = useMemo(() => {
    return vendor.tender_history.filter((t) => {
      const matchSearch =
        tenderTableSearch === "" ||
        t.title.toLowerCase().includes(tenderTableSearch.toLowerCase()) ||
        t.reference_number.toLowerCase().includes(tenderTableSearch.toLowerCase()) ||
        t.department.toLowerCase().includes(tenderTableSearch.toLowerCase()) ||
        t.primary_competitor.toLowerCase().includes(tenderTableSearch.toLowerCase());

      const matchStatus =
        tenderStatusFilter === "ALL" ||
        (tenderStatusFilter === "AWARDED" && t.status === "AWARDED") ||
        (tenderStatusFilter === "L1 STANDING" && (t.status === "L1 STANDING" || t.status === "EVALUATING")) ||
        (tenderStatusFilter === "YET TO OPEN" && t.status === "YET TO OPEN") ||
        (tenderStatusFilter === "DISCARDED" && t.status === "DISCARDED");

      return matchSearch && matchStatus;
    });
  }, [vendor, tenderTableSearch, tenderStatusFilter]);

  // Quick stat counts for tender status filters
  const tenderCounts = useMemo(() => {
    const list = vendor.tender_history;
    return {
      all: list.length,
      awarded: list.filter((t) => t.status === "AWARDED").length,
      l1_standing: list.filter((t) => t.status === "L1 STANDING" || t.status === "EVALUATING").length,
      yet_to_open: list.filter((t) => t.status === "YET TO OPEN").length,
      discarded: list.filter((t) => t.status === "DISCARDED").length,
    };
  }, [vendor]);

  const handleSelectVendor = (vId: string) => {
    setSelectedVendorId(vId);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleExportCSV = () => {
    window.location.href = "/api/evaluations/export";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-emerald-500/30 pb-12">
      {/* ── 1. HEADER BAR ───────────────────────────────────────────────────── */}
      <div className="p-6 bg-[#0e1115] border border-[#222730] rounded-2xl shadow-xl space-y-5">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#13161a] border border-[#222730] text-xs font-mono text-zinc-400 hover:text-white hover:border-[#333b49] transition-all w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Previous</span>
          </button>

          {/* Global Search Bar with Autocomplete Dropdown */}
          <div ref={searchRef} className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="Search companies (like AeroPrecision, Godrej, L&T, MTAR...)"
              className="w-full pl-10 pr-4 py-2 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
            />

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute left-0 right-0 top-full mt-1.5 bg-[#0e1115] border border-[#222730] rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto"
                >
                  {searchResults.map((v) => (
                    <button
                      key={v.vendor_id}
                      onClick={() => handleSelectVendor(v.vendor_id)}
                      className="w-full p-3 text-left hover:bg-[#161c22] transition-colors flex items-center justify-between border-b border-[#222730]/60 last:border-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-bold ${v.avatar_bg}`}>
                          {v.avatar_text}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white font-sans">{v.vendor_name}</p>
                          <p className="text-[10px] font-mono text-zinc-400">{v.category}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${v.vendor_type === "MSME" ? "bg-purple-500/10 text-purple-300 border-purple-500/25" : "bg-blue-500/10 text-blue-300 border-blue-500/25"}`}>
                        {v.vendor_type}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Company Identity Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-2 border-t border-[#222730]">
          <div className="flex items-start gap-4">
            {/* Avatar Badge */}
            <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-bold font-mono shadow-lg shrink-0 ${vendor.avatar_bg}`}>
              {vendor.avatar_text}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight">
                  {vendor.vendor_name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold">
                  PRO PROFILE
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${vendor.vendor_type === "MSME" ? "bg-purple-500/10 text-purple-300 border-purple-500/25" : "bg-blue-500/10 text-blue-300 border-blue-500/25"}`}>
                  {vendor.vendor_type}
                </span>
                {vendor.is_verified_msme && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/25">
                    <ShieldCheck className="w-3 h-3 text-purple-400" />
                    GFR 2017 Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-sans">
                {vendor.category} · Est. {vendor.established_year} · GSTIN: <span className="font-mono text-zinc-300">{vendor.gstin}</span>
              </p>
              <p className="text-[11px] text-zinc-500 font-sans flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                {vendor.headquarters}
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTracking((v) => !v)}
              className={`text-xs flex items-center gap-1.5 transition-all ${
                isTracking
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "hover:bg-[#1a2027]"
              }`}
            >
              {isTracking ? <BellRing className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{isTracking ? "Tracking Active" : "Track Company"}</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSaved((v) => !v)}
              className="text-xs flex items-center gap-1.5"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "text-amber-400 fill-amber-400" : "text-zinc-400"}`} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setNotesOpen((v) => !v)}
              className="text-xs flex items-center gap-1.5"
            >
              <StickyNote className="w-3.5 h-3.5 text-cyan-400" />
              <span>Notes</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Expandable Notes Drawer */}
        <AnimatePresence>
          {notesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-2 border-t border-[#222730]"
            >
              <div className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-cyan-400" />
                  Vendor Confidential Notes (Local Vault):
                </span>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={`Add private notes regarding ${vendor.vendor_name}'s pricing strategy, past subcontracting performance, or joint venture opportunities...`}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-[#13161a] border border-[#222730] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 font-sans"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Filter Bar: Tabs + Time Range + Metric Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-[#222730]/80">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "INSIGHTS", label: "Insights", icon: BarChart3 },
              { id: "ORGS", label: "Orgs & Geography", icon: MapPin },
              { id: "COMPETITORS", label: "Competitors", icon: Users },
              { id: "TENDERS", label: "Tender History", icon: History },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all border ${
                    active
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                      : "bg-[#0a0b0e] text-zinc-400 border-[#222730] hover:text-white"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Time Range Dropdown & Amount/Count Toggle */}
          <div className="flex items-center gap-3">
            {/* Time Range Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#0a0b0e] border border-[#222730] rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRangeOption)}
                className="bg-transparent border-0 text-xs font-mono text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="ALL_TIME">All Time</option>
                <option value="LAST_12_MONTHS">Last 12 Months</option>
                <option value="FY_2025_26">FY 2025-26</option>
                <option value="FY_2024_25">FY 2024-25</option>
              </select>
            </div>

            {/* Metric Toggle: Amount vs Count */}
            <div className="flex items-center bg-[#0a0b0e] border border-[#222730] rounded-xl p-1 text-xs font-mono">
              <button
                onClick={() => setMetricMode("AMOUNT")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  metricMode === "AMOUNT"
                    ? "bg-emerald-500 text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Amount (₹ Cr)
              </button>
              <button
                onClick={() => setMetricMode("COUNT")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  metricMode === "COUNT"
                    ? "bg-emerald-500 text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Count (Bids)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. COMPETITOR ALERT BANNER ──────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#121922] via-[#0f221e] to-[#121922] border border-cyan-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-md">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans">
              Track Competitors Bidding Against You
            </h4>
            <p className="text-[11px] sm:text-xs text-zinc-300 font-sans mt-0.5">
              Get notified when <strong className="text-cyan-300">{vendor.vendor_name}</strong> participates, wins, loses, or appears in newly published ISRO award results.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsTracking((v) => !v)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all shrink-0 border ${
            isTracking
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : "bg-cyan-500 hover:bg-cyan-400 text-black font-bold border-cyan-400 shadow-md shadow-cyan-500/20"
          }`}
        >
          {isTracking ? "✓ Tracking Active (Watched)" : "+ Track Competitor"}
        </button>
      </div>

      {/* ── 3. INSIGHTS SECTION (Side by Side Donut Charts) ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut A: Total Bid Amount / Counts */}
        <InteractiveDonutChart
          title={metricMode === "AMOUNT" ? "Total Bid Value by Status" : "Total Bid Counts by Status"}
          segments={totalBidsDonutData}
          centerLabel={metricMode === "AMOUNT" ? `₹${totalValueSumCr} Cr` : `${totalBidsSum}`}
          centerSublabel={metricMode === "AMOUNT" ? "Total Pipeline Value" : "Total Bids Submitted"}
          valuePrefix={metricMode === "AMOUNT" ? "₹" : ""}
          valueSuffix={metricMode === "AMOUNT" ? " Cr" : " Bids"}
        />

        {/* Donut B: Contract Value by Financial Bid */}
        <InteractiveDonutChart
          title={metricMode === "AMOUNT" ? "Contract Value by Financial Bid Status" : "Bid Volumes by Financial Result"}
          segments={contractValueDonutData}
          centerLabel={metricMode === "AMOUNT" ? `₹${(Math.round(vendor.insights.total_value_cr.awarded * timeMultiplier * 10) / 10)} Cr` : `${Math.round(vendor.insights.total_bids.awarded * timeMultiplier)} Won`}
          centerSublabel="Awarded Volume"
          valuePrefix={metricMode === "AMOUNT" ? "₹" : ""}
          valueSuffix={metricMode === "AMOUNT" ? " Cr" : " Contracts"}
        />
      </div>

      {/* ── 4. ORGANISATIONS & GEOGRAPHY SECTION ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card A: Top Organisations */}
        <div className="p-5 rounded-2xl bg-[#13161a] border border-[#222730] shadow-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Top ISRO Organisations &amp; Centers
              </h4>
            </div>

            {/* Filter Toggle: Awarded / Won / Bid */}
            <div className="flex items-center bg-[#0a0b0e] border border-[#222730] rounded-lg p-0.5 text-[10px] font-mono">
              {(["ALL", "AWARDED", "WON"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setOrgFilter(mode)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    orgFilter === mode
                      ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {vendor.top_organisations.map((org, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730] flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {org.center_code}
                    </span>
                    <span className="text-white font-medium truncate font-sans text-xs">
                      {org.org_name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 mt-0.5 block">
                    {Math.round(org.bids_count * timeMultiplier)} Tenders Evaluated · {org.share_pct}% Share
                  </span>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-white font-bold text-xs">
                    {metricMode === "AMOUNT" ? `₹${(Math.round(org.value_cr * timeMultiplier * 10) / 10)} Cr` : `${Math.round(org.bids_count * timeMultiplier)} Bids`}
                  </span>
                  <span className="text-[10px] text-emerald-400 block">
                    {org.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card B: Operating Centers / Regions */}
        <div className="p-5 rounded-2xl bg-[#13161a] border border-[#222730] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Operating Centers &amp; Regional Footprint
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {vendor.operating_centers.length} Primary Space Hubs
            </span>
          </div>

          <div className="space-y-2.5 pt-1 max-h-[340px] overflow-y-auto pr-1">
            {vendor.operating_centers.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730] flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold">
                      #{i + 1}
                    </span>
                    <div>
                      <p className="text-white font-medium text-xs truncate font-sans">
                        {c.center_name}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500">
                        {c.location}, {c.state}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-cyan-400 font-bold text-xs">
                    {metricMode === "AMOUNT" ? `₹${(Math.round(c.value_cr * timeMultiplier * 10) / 10)} Cr` : `${Math.round(c.bids_count * timeMultiplier)} Tenders`}
                  </span>
                  <div className="w-20 h-1.5 bg-[#13161a] rounded-full overflow-hidden mt-1 ml-auto">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${c.share_pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. COMPETITOR ANALYSIS SECTION ──────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#13161a] border border-[#222730] shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#222730]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                Head-to-Head Competitor Analysis
              </h3>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Comparison of won contract values and co-bidding frequency in overlapping ISRO procurement categories.
            </p>
          </div>

          {/* 3-Color Legend */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-300">This Vendor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-zinc-300">Competitor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-zinc-300">Others</span>
            </div>
          </div>
        </div>

        {/* Competitor Comparison Rows */}
        <div className="space-y-3">
          {vendor.competitors.map((row, idx) => {
            const vendorVal = Math.round(row.vendor_won_value_cr * timeMultiplier * 10) / 10;
            const compVal = Math.round(row.competitor_won_value_cr * timeMultiplier * 10) / 10;
            const otherVal = Math.round(row.others_value_cr * timeMultiplier * 10) / 10;
            const totalSegmentVal = vendorVal + compVal + otherVal;

            const vendorPct = totalSegmentVal > 0 ? (vendorVal / totalSegmentVal) * 100 : 33;
            const compPct = totalSegmentVal > 0 ? (compVal / totalSegmentVal) * 100 : 33;
            const otherPct = totalSegmentVal > 0 ? (otherVal / totalSegmentVal) * 100 : 34;

            return (
              <div
                key={row.id}
                className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2.5 hover:border-[#333b49] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-500">{idx + 1}.</span>
                    <span className="text-xs font-bold text-white font-sans">{row.competitor_name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${row.competitor_type === "MSME" ? "bg-purple-500/10 text-purple-300 border-purple-500/25" : "bg-blue-500/10 text-blue-300 border-blue-500/25"}`}>
                      {row.competitor_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-zinc-400 text-[11px]">{row.co_bid_count} Co-bids</span>
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                      {row.overlap_pct}% Overlap
                    </span>
                  </div>
                </div>

                {/* Stacked Comparison Bar */}
                <div className="space-y-1">
                  <div className="h-3.5 w-full bg-[#13161a] rounded-lg overflow-hidden flex border border-[#222730]">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${vendorPct}%` }}
                      title={`This Vendor: ₹${vendorVal} Cr (${Math.round(vendorPct)}%)`}
                    />
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${compPct}%` }}
                      title={`Competitor: ₹${compVal} Cr (${Math.round(compPct)}%)`}
                    />
                    <div
                      className="bg-amber-500/80 h-full transition-all"
                      style={{ width: `${otherPct}%` }}
                      title={`Others: ₹${otherVal} Cr (${Math.round(otherPct)}%)`}
                    />
                  </div>

                  {/* Segment value labels */}
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400 px-0.5">
                    <span className="text-emerald-400 font-semibold">Vendor: ₹{vendorVal} Cr</span>
                    <span className="text-blue-400 font-semibold">Competitor: ₹{compVal} Cr</span>
                    <span className="text-amber-400">Others: ₹{otherVal} Cr</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6. TENDER HISTORY SECTION ───────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#13161a] border border-[#222730] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-bold text-white font-sans">
              Complete Tender Bidding History
            </h3>
          </div>

          {/* Search & Export */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={tenderTableSearch}
                onChange={(e) => setTenderTableSearch(e.target.value)}
                placeholder="Search tenders, centers..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 font-sans"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Quick Stat Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: `All (${tenderCounts.all})` },
            { id: "AWARDED", label: `Awarded (${tenderCounts.awarded})` },
            { id: "L1 STANDING", label: `L1 / Active (${tenderCounts.l1_standing})` },
            { id: "YET TO OPEN", label: `Yet to Open (${tenderCounts.yet_to_open})` },
            { id: "DISCARDED", label: `Discarded (${tenderCounts.discarded})` },
          ].map((pill) => {
            const active = tenderStatusFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setTenderStatusFilter(pill.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                    : "bg-[#0a0b0e] text-zinc-400 border-[#222730] hover:text-white"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Table of Individual Tenders */}
        <div className="overflow-x-auto border border-[#222730] rounded-xl bg-[#0a0b0e]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#13161a] border-b border-[#222730] text-[10px] font-mono text-zinc-400 uppercase">
              <tr>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Tender Title &amp; Ref</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Quoted Amount</th>
                <th className="p-3.5">Result</th>
                <th className="p-3.5">Primary Competitor</th>
                <th className="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222730] font-sans">
              {filteredTenders.length > 0 ? (
                filteredTenders.map((t) => (
                  <tr key={t.tender_id} className="hover:bg-[#13161a] transition-colors">
                    <td className="p-3.5 shrink-0">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border block w-fit ${
                          t.status === "AWARDED"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : t.status === "L1 STANDING" || t.status === "EVALUATING"
                            ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                            : t.status === "YET TO OPEN"
                            ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                            : "bg-red-500/15 text-red-400 border-red-500/30"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <span className="font-mono text-[10px] text-zinc-500 block">{t.reference_number}</span>
                      <p className="text-white font-medium text-xs mt-0.5 truncate" title={t.title}>
                        {t.title}
                      </p>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      {t.department}
                    </td>

                    <td className="p-3.5 font-mono text-xs whitespace-nowrap">
                      <span className="text-white font-bold">₹{t.bid_amount_cr} Cr</span>
                      <span className="text-[10px] text-zinc-500 block">({t.rank})</span>
                    </td>

                    <td className="p-3.5 text-[11px] text-zinc-300 whitespace-nowrap">
                      {t.result}
                    </td>

                    <td className="p-3.5 text-[11px] text-zinc-400 max-w-[160px] truncate" title={t.primary_competitor}>
                      {t.primary_competitor}
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                      {t.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-zinc-500 font-mono">
                    No matching tenders found in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 7. FOOTER STATUTORY DISCLAIMER ──────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-[#0a0b0e] border border-[#222730] text-[11px] text-zinc-500 leading-relaxed font-sans space-y-1">
        <div className="flex items-center gap-1.5 text-zinc-400 font-mono font-semibold text-[10px] uppercase">
          <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Statutory Intelligence Disclaimer</span>
        </div>
        <p>
          This profile is built from what portals disclose publicly and may understate actual footprint, since some centers do not release full bidder lists.
          Compiled independently — no association with ISRO or any government portal.
        </p>
      </div>
    </div>
  );
}
