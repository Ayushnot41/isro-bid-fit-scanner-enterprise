"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Building2,
  Trophy,
  TrendingDown,
  ShieldCheck,
  Award,
  CheckCircle2,
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
  BadgeAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VendorIntelligenceProfile {
  id: string;
  name: string;
  category: string;
  type: "MSME" | "Large Enterprise";
  headquarters: string;
  total_bids: number;
  total_wins: number;
  win_rate_pct: number;
  total_awarded_volume_inr: number;
  avg_discount_pct: number;
  centers_active: string[];
  top_specialty: string;
  certifications: string[];
  recent_awards: Array<{
    ref: string;
    center: string;
    title: string;
    value_inr: number;
    year: string;
    status: "WON (L1)" | "PARTICIPATED (L2)" | "PARTICIPATED (L3)";
  }>;
  strengths: string[];
  pricing_behavior: string;
}

const VENDOR_DATABASE: VendorIntelligenceProfile[] = [
  {
    id: "aero-01",
    name: "AeroTech Precision CNC Systems",
    category: "Propulsion & Precision Machining",
    type: "MSME",
    headquarters: "Peenya Industrial Area, Bengaluru, Karnataka",
    total_bids: 14,
    total_wins: 8,
    win_rate_pct: 57,
    total_awarded_volume_inr: 284000000,
    avg_discount_pct: 10.5,
    centers_active: ["VSSC", "LPSC", "IPRC"],
    top_specialty: "5-Axis Titanium Stage-4 Gimbals & Bracketry",
    certifications: ["AS9100D", "ISO9001:2015", "NABL"],
    recent_awards: [
      {
        ref: "VSSC/PUR/2025/T-081",
        center: "VSSC",
        title: "Titanium Ti-6Al-4V PSLV-C59 Control Actuator Mountings",
        value_inr: 29000000,
        year: "Nov 2025",
        status: "WON (L1)",
      },
      {
        ref: "LPSC/HYD/2025/T-019",
        center: "LPSC",
        title: "High-Pressure Hydraulic Servo Actuators for Semi-Cryo",
        value_inr: 49000000,
        year: "Aug 2025",
        status: "WON (L1)",
      },
      {
        ref: "IPRC/MEC/2025/T-044",
        center: "IPRC",
        title: "Cryogenic Valve Inconel 718 Superfinished Spindles",
        value_inr: 56000000,
        year: "Mar 2025",
        status: "PARTICIPATED (L2)",
      },
    ],
    strengths: [
      "Micro-tolerance machining down to ±3 µm linear",
      "Statutory MSME EMD waiver applied on 100% of bids",
      "Direct supplier for Chandrayaan-3 and PSLV C-series",
    ],
    pricing_behavior: "Consistently bids 9%–12% below RFP ceiling; leverages MSME purchase preference aggressively.",
  },
  {
    id: "godrej-02",
    name: "Godrej Aerospace Division",
    category: "Liquid Propulsion & Heavy Space Hardware",
    type: "Large Enterprise",
    headquarters: "Vikhroli, Mumbai, Maharashtra",
    total_bids: 22,
    total_wins: 15,
    win_rate_pct: 68,
    total_awarded_volume_inr: 1420000000,
    avg_discount_pct: 7.2,
    centers_active: ["VSSC", "LPSC", "IPRC", "URSC"],
    top_specialty: "Vikas Engines, CE-20 Cryogenic Thrust Chambers",
    certifications: ["AS9100D", "ISO9001:2015", "NADCAP (Welding)", "NADCAP (NDT)"],
    recent_awards: [
      {
        ref: "LPSC/CRY/2025/T-102",
        center: "LPSC",
        title: "CE-20 Cryogenic Engine Regeneratively Cooled Thrust Chambers",
        value_inr: 185000000,
        year: "Dec 2025",
        status: "WON (L1)",
      },
      {
        ref: "VSSC/PROP/2025/T-055",
        center: "VSSC",
        title: "GSLV Mk-III Vikas Engine Core Liquid Stages",
        value_inr: 340000000,
        year: "Sep 2025",
        status: "WON (L1)",
      },
    ],
    strengths: [
      "Tier-1 primary space contractor with 30+ years ISRO relationship",
      "Full turnkey vacuum brazing and electron-beam welding infrastructure",
    ],
    pricing_behavior: "Stable bidding with moderate discounts (6%–8%); relies on superior technical score and single-source complexity.",
  },
  {
    id: "ananth-03",
    name: "Ananth Technologies Ltd.",
    category: "RF, Avionics & Payload Electronics",
    type: "MSME",
    headquarters: "Whitefield, Bengaluru, Karnataka",
    total_bids: 18,
    total_wins: 11,
    win_rate_pct: 61,
    total_awarded_volume_inr: 580000000,
    avg_discount_pct: 8.5,
    centers_active: ["URSC", "SAC", "NRSC"],
    top_specialty: "Spacecraft Telemetry, Telecommand & X-Band SSPAs",
    certifications: ["ISO9001:2015", "IPC-A-610 Class 3", "NABL"],
    recent_awards: [
      {
        ref: "SAC/ELE/2025/T-047",
        center: "SAC",
        title: "X-Band Solid State Power Amplifiers (SSPA) for Earth Observation",
        value_inr: 41000000,
        year: "Oct 2025",
        status: "WON (L1)",
      },
      {
        ref: "URSC/SAT/2025/T-033",
        center: "URSC",
        title: "NavIC Satellite Navigation Signal Generators",
        value_inr: 72000000,
        year: "Jul 2025",
        status: "WON (L1)",
      },
    ],
    strengths: [
      "Dedicated space-grade electronics assembly cleanroom (Class 10,000)",
      "High win rate for RF & microwave satellite payloads",
    ],
    pricing_behavior: "Targeted aggressive pricing on RF payloads; highly competitive against BEL.",
  },
  {
    id: "mtar-04",
    name: "MTAR Technologies Ltd.",
    category: "Cryogenics & Precision Valve Systems",
    type: "Large Enterprise",
    headquarters: "Balanagar, Hyderabad, Telangana",
    total_bids: 16,
    total_wins: 10,
    win_rate_pct: 62,
    total_awarded_volume_inr: 890000000,
    avg_discount_pct: 7.8,
    centers_active: ["IPRC", "LPSC", "VSSC"],
    top_specialty: "Cryogenic Liquid Hydrogen (LH2) & LOX Valves",
    certifications: ["AS9100D", "ASME Section VIII", "ISO9001:2015"],
    recent_awards: [
      {
        ref: "IPRC/MEC/2025/T-052",
        center: "IPRC",
        title: "LH2/LOX Cryogenic Regulating Valves for LVM3 CE-20",
        value_inr: 58000000,
        year: "Oct 2025",
        status: "WON (L1)",
      },
    ],
    strengths: [
      "Helium mass-spectrometer leak testing at 20K",
      "Specialized in high-pressure Inconel and titanium alloys",
    ],
    pricing_behavior: "Clustered bidding within 7%–9% discount; high win rate on extreme cryogenic tenders.",
  },
  {
    id: "kineco-05",
    name: "Kineco Kaman Composites India",
    category: "Satellite Bus & Composite Structures",
    type: "MSME",
    headquarters: "Pilerne Industrial Estate, Goa",
    total_bids: 11,
    total_wins: 6,
    win_rate_pct: 55,
    total_awarded_volume_inr: 390000000,
    avg_discount_pct: 9.2,
    centers_active: ["URSC", "VSSC"],
    top_specialty: "CFRP Honeycomb Sandwich Satellite Bus & Solar Panels",
    certifications: ["AS9100D", "ISO9001:2015", "ISO 14644-1"],
    recent_awards: [
      {
        ref: "URSC/MME/2025/T-104",
        center: "URSC",
        title: "Carbon Fiber Honeycomb Bus Structure for Earth Observer",
        value_inr: 77000000,
        year: "Sep 2025",
        status: "WON (L1)",
      },
    ],
    strengths: [
      "Class 10,000 cleanroom autoclave composite curing infrastructure",
      "Joint venture with Kaman Aerospace for space structures",
    ],
    pricing_behavior: "Bids 8%–11% below estimate; strong MSME competitive positioning against HAL.",
  },
];

export default function CompetitorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "MSME" | "LARGE">("ALL");
  const [activeVendorId, setActiveVendorId] = useState<string>(VENDOR_DATABASE[0].id);
  const [subTab, setSubTab] = useState<"INSIGHTS" | "AWARDS" | "STRENGTHS">("INSIGHTS");

  const filteredVendors = useMemo(() => {
    return VENDOR_DATABASE.filter((v) => {
      const matchesSearch =
        searchQuery === "" ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.top_specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.headquarters.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "ALL" ||
        (selectedType === "MSME" && v.type === "MSME") ||
        (selectedType === "LARGE" && v.type === "Large Enterprise");

      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const activeVendor = useMemo(() => {
    return VENDOR_DATABASE.find((v) => v.id === activeVendorId) || VENDOR_DATABASE[0];
  }, [activeVendorId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-emerald-500/30">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#0e1115] border border-[#222730] rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Radar className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              ISRO Competitor &amp; Vendor Intelligence Directory
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              L1 RADAR
            </span>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm font-sans">
            Forensic analysis of tracked Indian aerospace suppliers, historical win rates, and statutory MSME price behavior.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-zinc-300 font-mono text-xs bg-[#13161a] border-[#222730]">
            {VENDOR_DATABASE.length} Tracked Suppliers
          </Badge>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
            GFR 2017 Indexed
          </span>
        </div>
      </div>

      {/* ── Search & Filter HUD ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left List of Vendors (Col 1-5) */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#13161a] border border-[#222730] space-y-3 shadow-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor name, center, or specialty..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
              />
            </div>

            {/* Type Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { id: "ALL", label: "All Types" },
                  { id: "MSME", label: "MSME Vendors" },
                  { id: "LARGE", label: "Large Enterprises" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedType(f.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                    selectedType === f.id
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold"
                      : "bg-[#0a0b0e] text-zinc-400 border-[#222730] hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vendors Scroll List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredVendors.map((vendor) => {
              const isSelected = vendor.id === activeVendor.id;
              return (
                <motion.div
                  key={vendor.id}
                  onClick={() => setActiveVendorId(vendor.id)}
                  whileHover={{ x: 2 }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#161c22] border-emerald-500/50 shadow-md shadow-emerald-500/5"
                      : "bg-[#13161a] border-[#222730] hover:border-[#303846]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white font-sans">
                        {vendor.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        {vendor.category}
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                        vendor.type === "MSME"
                          ? "bg-purple-500/10 text-purple-300 border-purple-500/25"
                          : "bg-blue-500/10 text-blue-300 border-blue-500/25"
                      }`}
                    >
                      {vendor.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#222730] text-[10px] font-mono">
                    <div>
                      <span className="text-zinc-500 block">WIN RATE</span>
                      <span className="text-emerald-400 font-bold text-xs">{vendor.win_rate_pct}%</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">TOTAL BIDS</span>
                      <span className="text-white font-bold text-xs">{vendor.total_bids}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">L1 DISCOUNT</span>
                      <span className="text-cyan-400 font-bold text-xs">-{vendor.avg_discount_pct}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Active Profile Dossier (Col 6-12) */}
        <div className="md:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-[#13161a] border border-[#222730] shadow-xl space-y-5">
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#222730]">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                    PROFILE DOSSIER
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded border ${
                      activeVendor.type === "MSME"
                        ? "bg-purple-500/10 text-purple-300 border-purple-500/25"
                        : "bg-blue-500/10 text-blue-300 border-blue-500/25"
                    }`}
                  >
                    {activeVendor.type}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    Active: {activeVendor.centers_active.join(", ")}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-sans">
                  {activeVendor.name}
                </h2>
                <p className="text-xs text-zinc-400 font-sans flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  {activeVendor.headquarters}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">Total ISRO Awards</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {formatCurrency(activeVendor.total_awarded_volume_inr)}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  across {activeVendor.total_wins} awarded contracts
                </span>
              </div>
            </div>

            {/* Performance Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">Win Rate</span>
                <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">
                  {activeVendor.win_rate_pct}%
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {activeVendor.total_wins} of {activeVendor.total_bids} bids
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">Avg L1 Discount</span>
                <span className="text-base font-bold font-mono text-cyan-400 mt-0.5 block">
                  -{activeVendor.avg_discount_pct}%
                </span>
                <span className="text-[10px] font-mono text-zinc-500">vs RFP ceiling</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">Center Footprint</span>
                <span className="text-base font-bold font-mono text-white mt-0.5 block">
                  {activeVendor.centers_active.length} Centers
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {activeVendor.centers_active.join(", ")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0a0b0e] border border-[#222730]">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">Accreditations</span>
                <span className="text-base font-bold font-mono text-purple-300 mt-0.5 block">
                  {activeVendor.certifications.length} Certs
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {activeVendor.certifications[0]}
                </span>
              </div>
            </div>

            {/* Sub-Tabs: Insights, Awards, Strengths */}
            <div className="flex items-center gap-2 border-b border-[#222730] pb-2">
              {[
                { id: "INSIGHTS", label: "Strategic Bidding Behavior" },
                { id: "AWARDS", label: "Historical ISRO Awards" },
                { id: "STRENGTHS", label: "Facility & Quality Accreditations" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSubTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    subTab === t.id
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: Insights */}
            {subTab === "INSIGHTS" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2">
                  <span className="text-xs font-bold font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Commercial Envelope Pricing Behavior:
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {activeVendor.pricing_behavior}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2">
                  <span className="text-xs font-bold font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Core Technical Competency:
                  </span>
                  <p className="text-xs text-zinc-200 font-sans">
                    {activeVendor.top_specialty}
                  </p>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Historical Awards */}
            {subTab === "AWARDS" && (
              <div className="space-y-2.5">
                {activeVendor.recent_awards.map((award, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {award.ref}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {award.center} · {award.year}
                        </span>
                      </div>
                      <p className="text-white font-medium">{award.title}</p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-mono text-zinc-500 block">AWARD VALUE</span>
                      <span className="text-xs font-bold font-mono text-white">
                        {formatCurrency(award.value_inr)}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded block mt-0.5 ${
                          award.status.includes("WON")
                            ? "text-emerald-400 bg-emerald-500/10"
                            : "text-zinc-400 bg-zinc-800"
                        }`}
                      >
                        {award.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-Tab 3: Strengths & Certs */}
            {subTab === "STRENGTHS" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2">
                  <span className="text-xs font-bold font-mono uppercase text-purple-300">
                    Quality Accreditations:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeVendor.certifications.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-mono"
                      >
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0b0e] border border-[#222730] space-y-2">
                  <span className="text-xs font-bold font-mono uppercase text-emerald-400">
                    Operational Strengths &amp; Compliance Notes:
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                    {activeVendor.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Statutory Disclaimer */}
            <div className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730] text-[10px] text-zinc-500 leading-relaxed font-sans">
              This profile is built from what portals disclose publicly and may understate actual competition.
              ISRO Bid-Fit compiles these public records independently and has no association with any government portal, buyer, or bidder.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
