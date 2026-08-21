"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { VendorProfile } from "@/lib/types/database";
import {
  Save,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Wrench,
  Building2,
  Sparkles,
  Sliders,
  TrendingUp,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Factory,
} from "lucide-react";
import { DEMO_VENDOR_PROFILE } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────────────────────

const COMMON_AERO_CERTS = [
  "AS9100D",
  "ISO9001:2015",
  "NABL",
  "ISO 14644-1",
  "IPC-A-610 Class 3",
  "ASME Section VIII",
  "NADCAP (Welding)",
  "NADCAP (NDT)",
  "ITAR Compliant",
  "MIL-SPEC",
];

const MANUFACTURING_CAPABILITIES = [
  "5-Axis CNC Machining",
  "3-Axis CNC Milling",
  "CNC Turning / Swiss Lathe",
  "Titanium Aerospace Fabrication",
  "Inconel Precision Machining",
  "Carbon Fiber Composite Bonding",
  "Autoclave Curing",
  "Cleanroom Assembly (Class 10k)",
  "CMM Inspection",
  "Non-Destructive Testing (NDT)",
  "Vibration Proofing",
  "Electronic Assembly (SMT/THT)",
  "Precision Honing & Lapping",
  "Sheet Metal Fabrication",
  "Vacuum Brazing",
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface SimulationResult {
  tender_id: string;
  tender_reference: string;
  tender_title: string;
  issuing_center: string;
  estimated_value_inr: number;
  final_bid_fit_score: number;
  tolerance_met: boolean;
  missing_certs: string[];
  msme_waivers_applied: string[];
  is_qualified: boolean;
}

interface Simulation {
  total_tenders: number;
  qualified_tenders_count: number;
  qualification_rate: string;
  average_fit_score: number;
  total_accessible_value_inr: number;
  results: SimulationResult[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      : score >= 60
      ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
      : "text-red-400 bg-red-500/10 border-red-500/30";
  return (
    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg border ${color}`}>
      {score}%
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [profile, setProfile] = useState<VendorProfile>(DEMO_VENDOR_PROFILE);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [simLoading, setSimLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load profile on mount ──────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
            triggerSimulation(data.profile);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fallback
      }
      setProfile(DEMO_VENDOR_PROFILE);
      triggerSimulation(DEMO_VENDOR_PROFILE);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounced simulation ───────────────────────────────────────────────────

  const triggerSimulation = useCallback((currentProfile: VendorProfile) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSimLoading(true);
      try {
        const res = await fetch("/api/profile/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentProfile),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.simulation) setSimulation(data.simulation);
        }
      } catch {
        // silent
      } finally {
        setSimLoading(false);
      }
    }, 300);
  }, []);

  // ── Profile updaters ───────────────────────────────────────────────────────

  const updateField = (field: string, value: unknown) => {
    setProfile((prev) => {
      const updated = { ...prev, [field]: value } as VendorProfile;
      triggerSimulation(updated);
      return updated;
    });
  };

  const updateTolerance = (param: string, value: unknown) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        mechanical_tolerances: {
          ...prev.mechanical_tolerances,
          [param]: value,
        },
      } as VendorProfile;
      triggerSimulation(updated);
      return updated;
    });
  };

  const toggleCert = (cert: string) => {
    setProfile((prev) => {
      const exists = prev.certifications.includes(cert);
      const newCerts = exists
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert];
      const updated = { ...prev, certifications: newCerts };
      triggerSimulation(updated);
      return updated;
    });
  };

  const toggleCapability = (cap: string) => {
    setProfile((prev) => {
      const caps = prev.manufacturing_capabilities || [];
      const exists = caps.includes(cap);
      const newCaps = exists ? caps.filter((c) => c !== cap) : [...caps, cap];
      const updated = { ...prev, manufacturing_capabilities: newCaps };
      triggerSimulation(updated);
      return updated;
    });
  };

  // ── Save handler ───────────────────────────────────────────────────────────

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Computed values ────────────────────────────────────────────────────────

  const linTolMm = profile.mechanical_tolerances?.linear_tolerance_mm ?? 0.005;
  const linTolUm = Math.round(linTolMm * 1000);
  const raMm = profile.mechanical_tolerances?.surface_roughness_ra_um ?? 0.3;
  const cncAxis = profile.mechanical_tolerances?.cnc_axis_count ?? 5;
  const caps = profile.manufacturing_capabilities || [];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 max-w-5xl mx-auto selection:bg-emerald-500/30">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#0e1115] border border-[#222730] rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Vendor Capability Matrix
            </h1>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Configure precision tolerances, aerospace accreditations, and MSME privileges for the Bid-Fit scoring engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold font-mono"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Synced to Vault</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white border-0"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save &amp; Sync Matrix</span>
          </Button>
        </div>
      </div>

      {/* ── Live Simulation Bar ──────────────────────────────────────────────── */}
      <div className="bg-[#13161a] border border-[#222730] rounded-2xl overflow-hidden shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#222730]">
          {[
            {
              icon: <Target className="w-3 h-3 text-emerald-400" />,
              label: "QUALIFIED TENDERS",
              value: simLoading ? "…" : `${simulation?.qualified_tenders_count ?? 0}`,
              sub: "Opportunities",
              color: "text-white",
            },
            {
              icon: <TrendingUp className="w-3 h-3 text-cyan-400" />,
              label: "QUALIFICATION RATE",
              value: simLoading ? "…" : (simulation?.qualification_rate ?? "0%"),
              sub: `of ${simulation?.total_tenders ?? 0} tenders`,
              color: "text-cyan-400",
            },
            {
              icon: <BarChart3 className="w-3 h-3 text-purple-400" />,
              label: "AVG BID-FIT SCORE",
              value: simLoading ? "…" : `${simulation?.average_fit_score ?? 0}%`,
              sub: "Weighted fit",
              color: "text-purple-400",
            },
            {
              icon: <Sparkles className="w-3 h-3 text-amber-400" />,
              label: "ACCESSIBLE VALUE",
              value: simLoading ? "…" : formatCurrency(simulation?.total_accessible_value_inr ?? 0),
              sub: "Contract pipeline",
              color: "text-emerald-400",
            },
          ].map((tile, i) => (
            <div key={i} className="p-4 space-y-0.5">
              <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono mb-1">
                {tile.icon}
                <span>{tile.label}</span>
                {simLoading && i === 0 && (
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-zinc-600 ml-auto" />
                )}
              </div>
              <p className={`text-lg font-bold font-mono ${tile.color}`}>{tile.value}</p>
              <p className="text-[10px] text-zinc-600 font-mono">{tile.sub}</p>
            </div>
          ))}
        </div>

        {/* Tender breakdown toggle */}
        {simulation && simulation.results.length > 0 && (
          <div className="border-t border-[#222730]">
            <button
              onClick={() => setShowBreakdown((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-[#0e1115] transition-colors"
            >
              <span className="font-mono">
                {simulation.qualified_tenders_count} qualified · {simulation.total_tenders - simulation.qualified_tenders_count} gaps — view breakdown
              </span>
              {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {simulation.results.map((r) => (
                      <div
                        key={r.tender_id}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
                          r.is_qualified
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-red-500/15 bg-red-500/5"
                        }`}
                      >
                        {r.is_qualified ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] text-zinc-500">{r.tender_reference}</span>
                            <ScoreBadge score={r.final_bid_fit_score} />
                            {r.msme_waivers_applied.length > 0 && (
                              <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded-md font-mono">
                                EMD Waiver
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-300 mt-0.5 truncate">{r.tender_title}</p>
                          <p className="text-zinc-500 text-[10px]">{r.issuing_center}</p>
                          {r.missing_certs.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                              <span className="text-amber-400 text-[10px]">Missing: {r.missing_certs.join(", ")}</span>
                            </div>
                          )}
                          {!r.tolerance_met && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-2.5 h-2.5 text-red-400 shrink-0" />
                              <span className="text-red-400 text-[10px]">Tolerance gap — tighten slider to qualify</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-zinc-500 font-mono">Value</p>
                          <p className="text-xs text-white font-mono">{formatCurrency(r.estimated_value_inr)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Section 1: GD&T Sliders ─────────────────────────────────────────── */}
      <div className="bg-[#13161a] border border-[#222730] p-6 rounded-2xl space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Precision Machining &amp; GD&amp;T Specifications</h2>
        </div>
        <p className="text-xs text-zinc-400 -mt-3">Evaluated directly against ISRO technical engineering drawings</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Linear Tolerance */}
          <div className="space-y-3 bg-[#0a0b0e] p-4 rounded-xl border border-[#222730]">
            <div className="flex justify-between items-start">
              <label className="text-xs font-semibold text-zinc-300">Linear Tolerance</label>
              <span className="text-emerald-400 font-mono text-xs font-bold">±{linTolUm} µm</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={linTolUm}
              onChange={(e) => {
                const um = parseInt(e.target.value);
                updateTolerance("linear_tolerance_mm", um / 1000);
              }}
              className="w-full accent-emerald-500 cursor-pointer h-1.5"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>±1 µm (Ultra)</span>
              <span>±50 µm (General)</span>
            </div>
            <p className="text-[10px] text-zinc-600">
              ISRO PSLV gimbal spec: ≤±5 µm · Satellite bus: ≤±10 µm
            </p>
          </div>

          {/* Surface Roughness */}
          <div className="space-y-3 bg-[#0a0b0e] p-4 rounded-xl border border-[#222730]">
            <div className="flex justify-between items-start">
              <label className="text-xs font-semibold text-zinc-300">Surface Roughness Ra</label>
              <span className="text-cyan-400 font-mono text-xs font-bold">Ra {raMm} µm</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={3.2}
              step={0.1}
              value={raMm}
              onChange={(e) => updateTolerance("surface_roughness_ra_um", parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-1.5"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>Ra 0.1 (Mirror)</span>
              <span>Ra 3.2 (Milled)</span>
            </div>
            <p className="text-[10px] text-zinc-600">Optical & sealing surfaces: ≤Ra 0.4 µm</p>
          </div>

          {/* CNC Axes */}
          <div className="space-y-3 bg-[#0a0b0e] p-4 rounded-xl border border-[#222730]">
            <div className="flex justify-between items-start">
              <label className="text-xs font-semibold text-zinc-300">CNC Axis Count</label>
              <span className="text-purple-400 font-mono text-xs font-bold">{cncAxis}-Axis</span>
            </div>
            <select
              value={cncAxis}
              onChange={(e) => updateTolerance("cnc_axis_count", parseInt(e.target.value))}
              className="w-full px-3 py-2.5 bg-[#13161a] border border-[#222730] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50 mt-1"
            >
              <option value={3}>3-Axis (Milling / Turning)</option>
              <option value={4}>4-Axis (Multi-Tasking)</option>
              <option value={5}>5-Axis Simultaneous (Aerospace)</option>
            </select>
            <p className="text-[10px] text-zinc-600">Required for PSLV/LVM3 gimbal & actuator brackets</p>
          </div>
        </div>
      </div>

      {/* ── Section 2: Manufacturing Capabilities ───────────────────────────── */}
      <div className="bg-[#13161a] border border-[#222730] p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Factory className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-bold text-white">Manufacturing Capabilities</h2>
        </div>
        <p className="text-xs text-zinc-400 -mt-3">
          Toggle the processes your workshop can execute in-house
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {MANUFACTURING_CAPABILITIES.map((cap) => {
            const active = caps.includes(cap);
            return (
              <button
                key={cap}
                type="button"
                onClick={() => toggleCapability(cap)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  active
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10"
                    : "bg-[#0a0b0e] text-zinc-400 border-[#222730] hover:border-[#303744] hover:text-white"
                }`}
              >
                {active ? "✓ " : "+ "}
                {cap}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 3: Certifications ────────────────────────────────────────── */}
      <div className="bg-[#13161a] border border-[#222730] p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white">Quality Accreditations &amp; Standards</h2>
        </div>
        <p className="text-xs text-zinc-400 -mt-3">Toggle certifications held by your manufacturing units</p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {COMMON_AERO_CERTS.map((cert) => {
            const active = profile.certifications.includes(cert);
            return (
              <button
                key={cert}
                type="button"
                onClick={() => toggleCert(cert)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                    : "bg-[#0a0b0e] text-zinc-400 border-[#222730] hover:border-[#303744] hover:text-white"
                }`}
              >
                {active ? "✓ " : "+ "}
                {cert}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 4: MSME ──────────────────────────────────────────────────── */}
      <div className="bg-[#13161a] border border-[#222730] p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-base font-bold text-white">MSME Public Procurement Privileges</h2>
        </div>
        <p className="text-xs text-zinc-400 -mt-3">
          Enables automated EMD waiver calculations under GFR 2017 Rule 170(i)
        </p>

        <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#0a0b0e] rounded-xl border border-[#222730] hover:border-[#303744] transition-colors">
          <input
            type="checkbox"
            checked={!!profile.msme_registered}
            onChange={(e) => updateField("msme_registered", e.target.checked)}
            className="w-4 h-4 accent-emerald-500 cursor-pointer"
          />
          <div>
            <span className="text-sm font-semibold text-zinc-200">
              Company is registered as MSME (Micro / Small / Medium Enterprise)
            </span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Udyam portal registration required for EMD waiver</p>
          </div>
        </label>

        {profile.msme_registered && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
          >
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 font-mono">
                MSME Classification
              </label>
              <select
                value={profile.msme_category || "small"}
                onChange={(e) => updateField("msme_category", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="micro">Micro Enterprise (Turnover &lt; ₹5 Cr)</option>
                <option value="small">Small Enterprise (Turnover ₹5–50 Cr)</option>
                <option value="medium">Medium Enterprise (Turnover &gt; ₹50 Cr)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 font-mono">
                Udyam Registration Number
              </label>
              <input
                type="text"
                value={profile.msme_udyam_number || ""}
                onChange={(e) => updateField("msme_udyam_number", e.target.value)}
                placeholder="UDYAM-XX-00-0000000"
                className="w-full px-3.5 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 font-mono"
              />
            </div>

            {/* Active waivers hint */}
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {["100% EMD Exemption (GFR 2017)", "25% Purchase Preference", "Turnover Criteria Relaxation"].map((w) => (
                <span
                  key={w}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300"
                >
                  ✓ {w}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Section 5: Company Profile ───────────────────────────────────────── */}
      <div className="bg-[#13161a] border border-[#222730] p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-bold text-white">Company Profile</h2>
        </div>
        <p className="text-xs text-zinc-400 -mt-3">
          Statutory GSTIN and annual turnover for technical eligibility
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Company Legal Name", field: "company_name", value: profile.company_name, type: "text", mono: false },
            { label: "GSTIN", field: "gst_number", value: profile.gst_number || "", type: "text", mono: true },
            { label: "PAN Number", field: "pan_number", value: profile.pan_number || "", type: "text", mono: true },
            { label: "Contact Email", field: "contact_email", value: profile.contact_email || "", type: "email", mono: false },
            { label: "Contact Phone", field: "contact_phone", value: profile.contact_phone || "", type: "tel", mono: true },
            { label: "Annual Turnover (₹)", field: "annual_turnover_inr", value: String(profile.annual_turnover_inr || ""), type: "number", mono: true },
          ].map(({ label, field, value, type, mono }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 font-mono">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) =>
                  updateField(field, type === "number" ? parseInt(e.target.value) || null : e.target.value)
                }
                className={`w-full px-3.5 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 ${mono ? "font-mono" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Save ──────────────────────────────────────────────────────── */}
      <div className="flex justify-end pb-4">
        <Button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white border-0 px-6"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save &amp; Sync Matrix to Vault</span>
        </Button>
      </div>
    </div>
  );
}
