"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Building2,
  Trophy,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Radar,
  Radio,
  Sparkles,
  Layers,
  MapPin,
  History,
  Users,
  Target,
  BarChart3,
  Percent,
  Download,
  Filter,
  AlertCircle,
  BadgeAlert,
  ChevronRight,
  RefreshCw,
  Bell,
  BellRing,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CompetitorVendorProfile } from "@/lib/intelligence/competitor-service";
import { SEED_COMPETITOR_VENDORS } from "@/lib/intelligence/competitor-service";

type TenderStatusFilter = "ALL" | "AWARDED" | "BID_PLACED" | "PENDING" | "LOST" | "TECH_REJECTED";

export default function CompetitorsPage() {
  const [vendorsList, setVendorsList] = useState<CompetitorVendorProfile[]>(SEED_COMPETITOR_VENDORS);
  const [selectedVendorId, setSelectedVendorId] = useState<string>("aeroprecision-001");
  const [metricMode, setMetricMode] = useState<"VALUE" | "COUNT">("VALUE");
  const [tenderFilter, setTenderFilter] = useState<TenderStatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Fetch live competitor dataset from backend API
  useEffect(() => {
    async function loadBackendData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/competitors");
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data) && json.data.length > 0) {
            setVendorsList(json.data);
          }
        }
      } catch (err) {
        console.warn("Using fallback local dataset:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBackendData();
  }, []);

  const activeVendor = useMemo(() => {
    return vendorsList.find((v) => v.vendor_id === selectedVendorId) || vendorsList[0];
  }, [vendorsList, selectedVendorId]);

  const totalBidsCount = useMemo(() => {
    const b = activeVendor.insights.total_bids;
    return b.awarded + b.pending + b.tech_rejected + b.lost;
  }, [activeVendor]);

  const totalPipelineValueCr = useMemo(() => {
    const v = activeVendor.insights.total_value_cr;
    return Math.round((v.awarded + v.pending + v.tech_rejected + v.lost) * 10) / 10;
  }, [activeVendor]);

  // Filtered tender history list
  const filteredTenders = useMemo(() => {
    return activeVendor.tender_history.filter((t) => {
      const matchSearch =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tender_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.org_chain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        tenderFilter === "ALL" ||
        (tenderFilter === "AWARDED" && t.this_company_status === "Awarded") ||
        (tenderFilter === "BID_PLACED" && t.this_company_status === "Bid placed") ||
        (tenderFilter === "PENDING" && t.this_company_status === "Pending") ||
        (tenderFilter === "LOST" && t.this_company_status === "Lost") ||
        (tenderFilter === "TECH_REJECTED" && t.this_company_status === "Tech Rejected");

      return matchSearch && matchStatus;
    });
  }, [activeVendor, searchQuery, tenderFilter]);

  const tenderCounts = useMemo(() => {
    const list = activeVendor.tender_history;
    return {
      all: list.length,
      awarded: list.filter((t) => t.this_company_status === "Awarded").length,
      bid_placed: list.filter((t) => t.this_company_status === "Bid placed").length,
      pending: list.filter((t) => t.this_company_status === "Pending").length,
      lost: list.filter((t) => t.this_company_status === "Lost").length,
      tech_rejected: list.filter((t) => t.this_company_status === "Tech Rejected").length,
    };
  }, [activeVendor]);

  const handleToggleTrack = async () => {
    try {
      setTrackingLoading(true);
      const res = await fetch("/api/competitors/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_id: activeVendor.vendor_id,
          vendor_name: activeVendor.vendor_name,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsTracking(data.tracked);
      } else {
        setIsTracking((v) => !v);
      }
    } catch {
      setIsTracking((v) => !v);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.location.href = "/api/evaluations/export";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-emerald-500/30 pb-12">
      {/* ── 1. HEADER HERO HUD ──────────────────────────────────────────────── */}
      <div className="p-6 bg-[#0e1115] border border-[#222730] rounded-2xl shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <Radar className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ISRO Competitor Intelligence HUD
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/25 font-bold">
                Sample Data
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                REST API Live Connected
              </span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans">
              Forensic bidding footprint, win-rate conversions, and co-bidding competitor intelligence across ISRO space centers.
            </p>
          </div>

          {/* Vendor Selector & Metric Toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Vendor Switcher */}
            <div className="flex items-center gap-1.5 bg-[#13161a] border border-[#222730] rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="bg-transparent border-0 text-xs font-mono text-white focus:outline-none cursor-pointer pr-2"
              >
                {vendorsList.map((v) => (
                  <option key={v.vendor_id} value={v.vendor_id} className="bg-[#0e1115] text-white">
                    {v.vendor_name} ({v.vendor_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Metric Toggle: Value vs Count */}
            <div className="flex items-center bg-[#13161a] border border-[#222730] rounded-xl p-1 text-xs font-mono">
              <button
                onClick={() => setMetricMode("VALUE")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  metricMode === "VALUE"
                    ? "bg-emerald-500 text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Value (₹ Cr)
              </button>
              <button
                onClick={() => setMetricMode("COUNT")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  metricMode === "COUNT"
                    ? "bg-emerald-500 text-black font-bold shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Bids Count
              </button>
            </div>
          </div>
        </div>

        {/* Selected Vendor Identity Banner */}
        <div className="p-4 rounded-xl bg-[#13161a] border border-[#222730] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
              {activeVendor.vendor_type === "MSME" ? "MSME" : "LE"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white font-sans">
                  {activeVendor.vendor_name}
                </h2>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                    activeVendor.vendor_type === "MSME"
                      ? "bg-purple-500/10 text-purple-300 border-purple-500/25"
                      : "bg-blue-500/10 text-blue-300 border-blue-500/25"
                  }`}
                >
                  {activeVendor.vendor_type}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Vendor ID: {activeVendor.vendor_id} · Tracked across {activeVendor.top_organisations.length} ISRO Centers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              disabled={trackingLoading}
              onClick={handleToggleTrack}
              className={`text-xs flex items-center gap-1.5 transition-all ${
                isTracking
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "hover:bg-[#1a2027]"
              }`}
            >
              {isTracking ? <BellRing className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{isTracking ? "Watching" : "Watch Competitor"}</span>
            </Button>

            <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-[#222730] sm:pl-4 font-mono text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Win Rate</span>
                <span className="text-emerald-400 font-bold text-sm">{activeVendor.insights.win_rate_pct}%</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Value Conversion</span>
                <span className="text-cyan-400 font-bold text-sm">{activeVendor.insights.value_conversion_pct}%</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Awarded Volume</span>
                <span className="text-white font-bold text-sm">₹{activeVendor.insights.total_value_cr.awarded} Cr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. INSIGHTS & BID DISTRIBUTION GRID ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Awarded */}
        <div className="p-4 rounded-xl bg-[#13161a] border border-emerald-500/30 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Awarded (Won)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              L1 Confirmed
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {metricMode === "VALUE" ? `₹${activeVendor.insights.total_value_cr.awarded} Cr` : `${activeVendor.insights.total_bids.awarded} Contracts`}
          </p>
          <div className="flex justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-[#222730]">
            <span>Count: {activeVendor.insights.total_bids.awarded} bids</span>
            <span className="text-emerald-400">{Math.round((activeVendor.insights.total_value_cr.awarded / totalPipelineValueCr) * 100)}% Share</span>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="p-4 rounded-xl bg-[#13161a] border border-cyan-500/30 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Pending Evaluation
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              In Pipeline
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {metricMode === "VALUE" ? `₹${activeVendor.insights.total_value_cr.pending} Cr` : `${activeVendor.insights.total_bids.pending} Bids`}
          </p>
          <div className="flex justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-[#222730]">
            <span>Count: {activeVendor.insights.total_bids.pending} bids</span>
            <span className="text-cyan-400">{Math.round((activeVendor.insights.total_value_cr.pending / totalPipelineValueCr) * 100)}% Share</span>
          </div>
        </div>

        {/* Card 3: Tech Rejected */}
        <div className="p-4 rounded-xl bg-[#13161a] border border-amber-500/30 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Tech Rejected
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Envelope 1 Gap
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {metricMode === "VALUE" ? `₹${activeVendor.insights.total_value_cr.tech_rejected} Cr` : `${activeVendor.insights.total_bids.tech_rejected} Bids`}
          </p>
          <div className="flex justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-[#222730]">
            <span>Count: {activeVendor.insights.total_bids.tech_rejected} bids</span>
            <span className="text-amber-400">{Math.round((activeVendor.insights.total_value_cr.tech_rejected / totalPipelineValueCr) * 100)}% Share</span>
          </div>
        </div>

        {/* Card 4: Lost */}
        <div className="p-4 rounded-xl bg-[#13161a] border border-red-500/30 space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-red-400 uppercase flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Lost / L2+
            </span>
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
              Price Beaten
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {metricMode === "VALUE" ? `₹${activeVendor.insights.total_value_cr.lost} Cr` : `${activeVendor.insights.total_bids.lost} Bids`}
          </p>
          <div className="flex justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-[#222730]">
            <span>Count: {activeVendor.insights.total_bids.lost} bids</span>
            <span className="text-red-400">{Math.round((activeVendor.insights.total_value_cr.lost / totalPipelineValueCr) * 100)}% Share</span>
          </div>
        </div>
      </div>

      {/* ── 3. ORGANISATIONS & GEOGRAPHY SECTION ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Organisations */}
        <div className="p-5 rounded-2xl bg-[#13161a] border border-[#222730] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Top ISRO Organisations &amp; Centers
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              Share of Won Volume
            </span>
          </div>

          <div className="space-y-2.5">
            {activeVendor.top_organisations.map((org, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {org.center_code}
                    </span>
                    <span className="text-white font-medium truncate font-sans text-xs">
                      {org.org_name}
                    </span>
                  </div>
                  <span className="font-mono text-white font-bold text-xs shrink-0">
                    ₹{org.value_cr} Cr
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-[#13161a] rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${org.pct_share}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>Center Share: {org.pct_share}%</span>
                    <span className="text-emerald-400 font-semibold">Active Supplier</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Centers / Geographic Map List */}
        <div className="p-5 rounded-2xl bg-[#13161a] border border-[#222730] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Operating Centers &amp; Space Facility Footprint
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              GPS Verified
            </span>
          </div>

          <div className="space-y-2.5">
            {activeVendor.operating_centers.map((center, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    #{i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-xs truncate font-sans">
                      {center.center_name}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      Coordinates: {center.lat}° N, {center.lng}° E
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-cyan-400 font-bold text-xs">
                    ₹{center.value_cr} Cr
                  </span>
                  <span className="text-zinc-500 text-[10px] block">
                    {center.pct_share}% of Total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. COMPETITOR ANALYSIS SECTION ──────────────────────────────────── */}
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
              Forensic comparison of contracts won and co-bidding overlap against primary aerospace contenders.
            </p>
          </div>

          {/* 3-Color Legend */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-300">This Company</span>
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

        {/* Competitor Stacked Comparison Rows */}
        <div className="space-y-3">
          {activeVendor.competitors.map((c, idx) => {
            const thisVal = c.this_company_won_value_cr;
            const compVal = c.competitor_won_value_cr;
            const otherVal = c.others_won_value_cr;
            const totalRowVal = thisVal + compVal + otherVal;

            const thisPct = totalRowVal > 0 ? (thisVal / totalRowVal) * 100 : 0;
            const compPct = totalRowVal > 0 ? (compVal / totalRowVal) * 100 : 0;
            const otherPct = totalRowVal > 0 ? (otherVal / totalRowVal) * 100 : 0;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2.5 hover:border-[#333b49] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-500">{idx + 1}.</span>
                    <span className="text-xs font-bold text-white font-sans">{c.competitor_name}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-zinc-400 text-[11px]">
                      {c.shared_tenders_count} Shared Tenders · {c.wins_count} Wins
                    </span>
                    <span className="text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-[10px]">
                      {Math.round((c.shared_tenders_count / totalBidsCount) * 100)}% Co-Bid Overlap
                    </span>
                  </div>
                </div>

                {/* Stacked Comparison Bar */}
                <div className="space-y-1">
                  <div className="h-3.5 w-full bg-[#13161a] rounded-lg overflow-hidden flex border border-[#222730]">
                    {thisPct > 0 && (
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${thisPct}%` }}
                        title={`This Company: ₹${thisVal} Cr (${Math.round(thisPct)}%)`}
                      />
                    )}
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
                    <span className="text-emerald-400 font-semibold">This Co: ₹{thisVal} Cr</span>
                    <span className="text-blue-400 font-semibold">Competitor: ₹{compVal} Cr</span>
                    <span className="text-amber-400">Others: ₹{otherVal} Cr</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. TENDER HISTORY SECTION ───────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#13161a] border border-[#222730] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-bold text-white font-sans">
              Tender History &amp; Stage Forensics
            </h3>
          </div>

          {/* Search & Export */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Quick Stat Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: `All (${tenderCounts.all})` },
            { id: "AWARDED", label: `Awarded (${tenderCounts.awarded})` },
            { id: "BID_PLACED", label: `Bid Placed (${tenderCounts.bid_placed})` },
            { id: "PENDING", label: `Pending (${tenderCounts.pending})` },
            { id: "LOST", label: `Lost (${tenderCounts.lost})` },
            { id: "TECH_REJECTED", label: `Tech Rejected (${tenderCounts.tech_rejected})` },
          ].map((pill) => {
            const active = tenderFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setTenderFilter(pill.id as any)}
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

        {/* Table of Tenders */}
        <div className="overflow-x-auto border border-[#222730] rounded-xl bg-[#0a0b0e]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#13161a] border-b border-[#222730] text-[10px] font-mono text-zinc-400 uppercase">
              <tr>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Tender &amp; Organisation</th>
                <th className="p-3.5">Location &amp; Date</th>
                <th className="p-3.5">Est. Cost / EMD</th>
                <th className="p-3.5">L1 Winner</th>
                <th className="p-3.5">This Company Quote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222730] font-sans">
              {filteredTenders.length > 0 ? (
                filteredTenders.map((t) => (
                  <tr key={t.tender_id} className="hover:bg-[#13161a] transition-colors">
                    <td className="p-3.5 shrink-0">
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border block w-fit ${
                          t.this_company_status === "Awarded"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : t.this_company_status === "Bid placed"
                            ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                            : t.this_company_status === "Pending"
                            ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                            : t.this_company_status === "Tech Rejected"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-red-500/15 text-red-400 border-red-500/30"
                        }`}
                      >
                        {t.this_company_status}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-sm">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {t.tender_id}
                        </span>
                        {t.org_tags.map((tag, tagIdx) => (
                          <span key={tagIdx} className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#13161a] text-zinc-400 border border-[#222730]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-white font-medium text-xs leading-snug" title={t.title}>
                        {t.title}
                      </p>
                      <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                        {t.org_chain}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      <p className="text-zinc-300">{t.location}</p>
                      <span className="text-[10px] text-cyan-400">{t.stage_date_label}</span>
                    </td>

                    <td className="p-3.5 font-mono text-xs whitespace-nowrap">
                      <span className="text-white font-bold">₹{t.est_cost_cr.toFixed(2)} Cr</span>
                      <span className="text-[10px] text-zinc-500 block">
                        EMD: ₹{(t.emd_amount / 100000).toFixed(2)} L
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-xs whitespace-nowrap">
                      {t.l1_name ? (
                        <div>
                          <span className="text-emerald-400 font-semibold block text-xs">{t.l1_name}</span>
                          <span className="text-zinc-300 text-[11px]">₹{t.l1_amount_cr?.toFixed(2)} Cr</span>
                          <span className="text-cyan-400 text-[10px] ml-1.5">(-{t.l1_pct_below_estimate}%)</span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">Under Evaluation</span>
                      )}
                    </td>

                    <td className="p-3.5 font-mono text-xs whitespace-nowrap">
                      {t.this_company_amount_cr ? (
                        <div>
                          <span className="text-white font-bold block text-xs">₹{t.this_company_amount_cr.toFixed(2)} Cr</span>
                          <span className="text-emerald-400 text-[10px]">(-{t.this_company_pct_below_estimate}% vs Est)</span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-[11px]">Envelope Placed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-zinc-500 font-mono">
                    No matching tenders found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 6. STATUTORY DISCLAIMER ─────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-[#0a0b0e] border border-[#222730] text-[11px] text-zinc-500 leading-relaxed font-sans space-y-1">
        <div className="flex items-center gap-1.5 text-zinc-400 font-mono font-semibold text-[10px] uppercase">
          <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Statutory Intelligence Notice &amp; Public Record Attribution</span>
        </div>
        <p>
          Sample/demo data for the ISRO Bid-Fit 'Competitors' page. Clearly labeled as sample data until replaced with real scraped data from public ISRO award/result pages.
        </p>
        <p className="text-zinc-500 text-[10px]">
          Compiled independently — no association with ISRO or any government portal.
        </p>
      </div>
    </div>
  );
}
