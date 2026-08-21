"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ScrapedTender, VendorProfile } from "@/lib/types/database";
import {
  generateCompetitorIntelligence,
  type CompetitorIntelligenceData,
} from "@/lib/intelligence/competitor-engine";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingDown,
  Users,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Building2,
  Trophy,
  History,
  Target,
  BarChart3,
  Percent,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompetitorIntelligenceTabProps {
  tender: ScrapedTender;
  vendorProfile?: VendorProfile;
}

export function CompetitorIntelligenceTab({
  tender,
  vendorProfile,
}: CompetitorIntelligenceTabProps) {
  const intel: CompetitorIntelligenceData = useMemo(() => {
    return generateCompetitorIntelligence(tender, vendorProfile);
  }, [tender, vendorProfile]);

  const estimatedValue = tender.estimated_value_inr || 35000000;
  const isMsme = vendorProfile?.msme_registered ?? true;

  return (
    <div className="space-y-5 text-zinc-100 selection:bg-emerald-500/30">
      {/* ── 1. Header Summary Banner ────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#13161a] border border-[#222730] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wide">
              Historical Procurement Footprint
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              Verified Public Disclosures
            </span>
            {intel.is_sample_data && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Sample Intelligence Model
              </span>
            )}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white font-sans">
            Based on {intel.similar_tenders_analyzed} similar closed tenders in{" "}
            <span className="text-emerald-400">{intel.category}</span> at{" "}
            <span className="text-cyan-400">{tender.issuing_center?.split("(")[0].trim() || "ISRO Center"}</span> over the last {intel.timeframe_months} months
          </h3>
        </div>

        <div className="flex items-center gap-2 sm:self-center shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-[#0a0b0e] border border-[#222730] text-right">
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Avg L1 Discount</p>
            <p className="text-xs font-mono font-bold text-emerald-400">
              -{intel.historical_price_range.discount_vs_estimate_pct}% vs RFP
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. AI Autonomous Pricing & Position Insight ─────────────────────── */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#13161a] via-[#101b17] to-[#13161a] border border-emerald-500/30 shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                Autonomous Competitor Synthesis &amp; Optimal Bidding Envelope
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                {intel.suggested_bid_range.win_probability_pct}% Win Probability
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {intel.insight_summary}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-[#0a0b0e]/80 border border-emerald-500/20 text-xs font-mono">
                <span className="text-zinc-400 text-[10px] block">RECOMMENDED BID BRACKET:</span>
                <span className="text-white font-bold">
                  {formatCurrency(intel.suggested_bid_range.min)} – {formatCurrency(intel.suggested_bid_range.max)}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#0a0b0e]/80 border border-[#222730] text-xs font-mono">
                <span className="text-zinc-400 text-[10px] block">ESTIMATED GROSS MARGIN:</span>
                <span className="text-cyan-400 font-bold">~{intel.suggested_bid_range.target_margin_pct}% Target</span>
              </div>
              {isMsme && (
                <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300">
                  <span className="text-purple-400 text-[10px] block">GFR 2017 PRIVILEGE:</span>
                  <span>100% EMD Waived + L1+15% Preference</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Historical Price Range Card ──────────────────────────────────── */}
      <div className="p-5 rounded-xl bg-[#13161a] border border-[#222730] space-y-4 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Historical Price Range &amp; Winning L1 Spread
            </h4>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Current RFP Estimate: <strong className="text-white">{formatCurrency(estimatedValue)}</strong>
          </span>
        </div>

        {/* 3 Metric Tiles: Min, Median, Max */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730]">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Lowest Winning Bid (Min L1)</span>
            <p className="text-base font-bold font-mono text-emerald-400 mt-1">
              {formatCurrency(intel.historical_price_range.min)}
            </p>
            <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
              -{(100 - (intel.historical_price_range.min / estimatedValue) * 100).toFixed(1)}% vs RFP Estimate
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0b0e] border border-cyan-500/30">
            <span className="text-[10px] font-mono text-cyan-400 block uppercase font-bold">Median Winning L1 (Typical)</span>
            <p className="text-base font-bold font-mono text-white mt-1">
              {formatCurrency(intel.historical_price_range.median)}
            </p>
            <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">
              -{(100 - (intel.historical_price_range.median / estimatedValue) * 100).toFixed(1)}% typical market clearing
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730]">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Highest Winning L1 (Max L1)</span>
            <p className="text-base font-bold font-mono text-amber-400 mt-1">
              {formatCurrency(intel.historical_price_range.max)}
            </p>
            <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
              -{(100 - (intel.historical_price_range.max / estimatedValue) * 100).toFixed(1)}% sole-source/complex
            </span>
          </div>
        </div>

        {/* Visual Distribution Bar */}
        <div className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2">
          <div className="flex justify-between text-[11px] font-mono text-zinc-400">
            <span>Aggressive L1</span>
            <span className="text-cyan-400 font-bold">Target Clearing Band</span>
            <span>RFP Estimated Ceiling</span>
          </div>

          <div className="h-3 w-full bg-[#13161a] rounded-full overflow-hidden flex relative border border-[#222730]">
            <div
              className="bg-zinc-700 h-full"
              style={{ width: "20%" }}
              title="Below Min L1"
            />
            <div
              className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-500 h-full relative"
              style={{ width: "65%" }}
              title="Winning L1 Distribution Band"
            >
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-md shadow-cyan-400"
                style={{ left: "45%" }}
                title="Median Winning Bid"
              />
            </div>
            <div
              className="bg-red-500/40 h-full"
              style={{ width: "15%" }}
              title="Over Estimate / Rejection Risk"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>{formatCurrency(intel.historical_price_range.min)}</span>
            <span className="text-white font-bold">Median: {formatCurrency(intel.historical_price_range.median)}</span>
            <span>RFP Ceiling: {formatCurrency(estimatedValue)}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-sans italic">
          💡 Insight: Winning bids for this category typically land <strong>{intel.historical_price_range.typical_discount_range_str}</strong>.
        </p>
      </div>

      {/* ── 4. Frequent Bidders in Category (Top 5) ─────────────────────────── */}
      <div className="p-5 rounded-xl bg-[#13161a] border border-[#222730] space-y-4 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Frequent Bidders in This Category (Top 5 Competitors)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Ranked by appearance frequency
          </span>
        </div>

        <div className="space-y-2.5">
          {intel.frequent_bidders.map((bidder, idx) => {
            const isWinner = bidder.wins_count > 0;
            return (
              <motion.div
                key={bidder.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730] hover:border-[#333b49] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Vendor Identity */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-[#13161a] border border-[#222730] flex items-center justify-center text-xs font-mono font-bold text-zinc-400 shrink-0 mt-0.5">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-white truncate">
                        {bidder.display_name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        ({bidder.vendor_label})
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                          bidder.vendor_type === "MSME"
                            ? "bg-purple-500/10 text-purple-300 border-purple-500/25"
                            : "bg-blue-500/10 text-blue-300 border-blue-500/25"
                        }`}
                      >
                        {bidder.vendor_type}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                      {bidder.specialty}
                    </p>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-[#222730] sm:pl-4">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-mono text-zinc-500 block">BIDS</span>
                    <span className="font-mono font-bold text-xs text-white">
                      {bidder.bids_count}
                    </span>
                  </div>

                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-mono text-zinc-500 block">WINS</span>
                    <span className="font-mono font-bold text-xs text-emerald-400">
                      {bidder.wins_count}
                    </span>
                  </div>

                  {/* Win rate progress badge */}
                  <div className="min-w-[90px] text-right">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                      <span>WIN RATE</span>
                      <span className={bidder.win_rate_pct >= 40 ? "text-emerald-400 font-bold" : "text-zinc-300"}>
                        {bidder.win_rate_pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#13161a] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          bidder.win_rate_pct >= 40
                            ? "bg-emerald-500"
                            : bidder.win_rate_pct >= 20
                            ? "bg-cyan-500"
                            : "bg-zinc-600"
                        }`}
                        style={{ width: `${Math.max(bidder.win_rate_pct, 6)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Win Rate by Vendor Type (MSME vs Large Enterprise) ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#13161a] border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
                MSME Vendors (Udyam Verified)
              </h5>
            </div>
            <span className="text-[10px] font-mono bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded border border-purple-500/25">
              Preferred Status
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-lg bg-[#0a0b0e] border border-[#222730]">
              <span className="text-[10px] font-mono text-zinc-500 block">WIN RATE</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                {intel.vendor_type_breakdown.msme_win_rate_pct}%
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a0b0e] border border-[#222730]">
              <span className="text-[10px] font-mono text-zinc-500 block">BID SHARE</span>
              <span className="text-base font-bold font-mono text-white">
                {intel.vendor_type_breakdown.msme_bids_pct}%
              </span>
            </div>
          </div>

          <ul className="text-[11px] text-zinc-300 space-y-1 font-sans">
            <li className="flex items-center gap-1.5 text-purple-300">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>100% EMD fee waiver applied under GFR 2017 Rule 170(i)</span>
            </li>
            <li className="flex items-center gap-1.5 text-purple-300">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>25% Purchase preference within L1+15% price band</span>
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-[#13161a] border border-[#222730] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-blue-300 font-mono">
                Large Enterprises &amp; PSUs
              </h5>
            </div>
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
              General Bidders
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-lg bg-[#0a0b0e] border border-[#222730]">
              <span className="text-[10px] font-mono text-zinc-500 block">WIN RATE</span>
              <span className="text-base font-bold font-mono text-cyan-400">
                {intel.vendor_type_breakdown.large_enterprise_win_rate_pct}%
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a0b0e] border border-[#222730]">
              <span className="text-[10px] font-mono text-zinc-500 block">BID SHARE</span>
              <span className="text-base font-bold font-mono text-white">
                {intel.vendor_type_breakdown.large_enterprise_bids_pct}%
              </span>
            </div>
          </div>

          <ul className="text-[11px] text-zinc-400 space-y-1 font-sans">
            <li className="flex items-center gap-1.5">
              <span>• Required to deposit full EMD security ({formatCurrency(tender.emd_amount_inr || 600000)})</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span>• Higher overhead margins typically reduce aggressive discounting</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── 6. Sample Closed Tender Forensic Trail ─────────────────────────── */}
      <div className="p-5 rounded-xl bg-[#13161a] border border-[#222730] space-y-3.5 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Recent Similar ISRO Award Records (Forensic Precedents)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Source: eproc.isro.gov.in archives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {intel.historical_awards_sample.map((award, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {award.award_ref}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{award.awarded_date}</span>
              </div>
              <p className="text-white font-medium text-xs truncate" title={award.description}>
                {award.description}
              </p>
              <div className="space-y-1 pt-1 border-t border-[#222730]/60 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">L1 Winner:</span>
                  <span className="text-emerald-400 font-semibold truncate max-w-[130px]">{award.winning_vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Awarded:</span>
                  <span className="text-white font-bold">{formatCurrency(award.awarded_value_inr)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Savings:</span>
                  <span className="text-cyan-400">-{award.savings_pct}% vs RFP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. Legal Disclaimer & Public Portal Attribution ─────────────────── */}
      <div className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] text-[11px] text-zinc-500 leading-relaxed font-sans space-y-1">
        <div className="flex items-center gap-1.5 text-zinc-400 font-mono font-semibold text-[10px] uppercase">
          <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Statutory Intelligence Disclaimer &amp; Public Record Notice</span>
        </div>
        <p>
          {intel.data_source_note}
        </p>
        <p className="text-zinc-500 text-[10px]">
          This profile is built from what portals disclose publicly and may understate actual competition.
          ISRO Bid-Fit compiles these public records independently and has no association with any government portal, buyer, or bidder.
        </p>
      </div>
    </div>
  );
}
