"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { VendorProfile } from "@/lib/types/database";
import { Save, Loader2, CheckCircle2, ShieldCheck, Wrench, Building2, Sparkles, Sliders } from "lucide-react";
import { DEMO_VENDOR_PROFILE } from "@/lib/mock-data";

const COMMON_AERO_CERTS = [
  "AS9100D",
  "ISO9001:2015",
  "NABL",
  "ISO 14644-1",
  "IPC-A-610 Class 3",
  "ASME Section VIII",
  "NADCAP (Welding)",
  "NADCAP (NDT)",
];

export default function ProfilePage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [profile, setProfile] = useState<VendorProfile>(DEMO_VENDOR_PROFILE);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from("vendor_profiles")
        .select("*")
        .single();
      if (data) {
        setProfile(data as VendorProfile);
      }
    } catch (err) {
      console.warn("Using demo vendor profile:", err);
    }
  };

  const updateField = (field: string, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value } as VendorProfile));
  };

  const updateTolerance = (param: string, value: unknown) => {
    setProfile((prev) => ({
      ...prev,
      mechanical_tolerances: {
        ...prev.mechanical_tolerances,
        [param]: value,
      },
    }));
  };

  const toggleCert = (cert: string) => {
    const exists = profile.certifications.includes(cert);
    if (exists) {
      updateField("certifications", profile.certifications.filter((c) => c !== cert));
    } else {
      updateField("certifications", [...profile.certifications, cert]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (user) {
        await supabase
          .from("vendor_profiles")
          .upsert({
            ...profile,
            user_id: user.id,
          });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7 max-w-5xl mx-auto selection:bg-emerald-500/30">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#0e1115] border border-[#222730] rounded-2xl">
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
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold font-mono"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Synced to Vault</span>
            </motion.div>
          )}
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 text-xs">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save & Sync Matrix</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Section 1: Mechanical Tolerances & Workshop Capabilities */}
        <Card className="bg-[#13161a] border-[#222730] p-6 rounded-2xl space-y-4">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-base font-bold text-white">Precision Machining & GD&T Specifications</CardTitle>
            </div>
            <CardDescription className="text-xs text-zinc-400">
              Evaluated directly against ISRO technical engineering drawings
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="space-y-2.5 bg-[#0a0b0e] p-4 rounded-xl border border-[#222730]">
              <label className="block text-xs font-semibold text-zinc-300">
                Linear Machining Tolerance:
                <span className="text-emerald-400 font-mono ml-2">
                  ±{((profile.mechanical_tolerances?.linear_tolerance_mm ?? 0.005) * 1000).toFixed(0)} µm (±{profile.mechanical_tolerances?.linear_tolerance_mm}mm)
                </span>
              </label>
              <input
                type="range"
                min="0.001"
                max="0.050"
                step="0.001"
                value={profile.mechanical_tolerances?.linear_tolerance_mm ?? 0.005}
                onChange={(e) => updateTolerance("linear_tolerance_mm", parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>±1 µm (Ultra Precision)</span>
                <span>±50 µm (General)</span>
              </div>
            </div>

            <div className="space-y-2.5 bg-[#0a0b0e] p-4 rounded-xl border border-[#222730]">
              <label className="block text-xs font-semibold text-zinc-300">
                Surface Roughness (Ra):
                <span className="text-cyan-400 font-mono ml-2">
                  Ra {profile.mechanical_tolerances?.surface_roughness_ra_um ?? 0.3} µm
                </span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3.2"
                step="0.1"
                value={profile.mechanical_tolerances?.surface_roughness_ra_um ?? 0.3}
                onChange={(e) => updateTolerance("surface_roughness_ra_um", parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Ra 0.1 µm (Mirror Finish)</span>
                <span>Ra 3.2 µm (Milled)</span>
              </div>
            </div>

            <div className="space-y-2.5 bg-[#0a0b0e] p-4 rounded-xl border border-[#222730]">
              <label className="block text-xs font-semibold text-zinc-300">
                Simultaneous CNC Axis Count:
                <span className="text-purple-400 font-mono ml-2">
                  {profile.mechanical_tolerances?.cnc_axis_count ?? 5}-Axis Simultaneous
                </span>
              </label>
              <select
                value={profile.mechanical_tolerances?.cnc_axis_count ?? 5}
                onChange={(e) => updateTolerance("cnc_axis_count", parseInt(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#13161a] border border-[#222730] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value={3}>3-Axis Milling / Turning</option>
                <option value={4}>4-Axis Multi-Tasking</option>
                <option value={5}>5-Axis Simultaneous (Aerospace Grade)</option>
              </select>
              <p className="text-[10px] text-zinc-500">Required for PSLV/LVM3 Gimbal brackets</p>
            </div>
          </div>
        </Card>

        {/* Section 2: Quality & Aerospace Certifications */}
        <Card className="bg-[#13161a] border-[#222730] p-6 rounded-2xl space-y-4">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <CardTitle className="text-base font-bold text-white">Quality Accreditations & Standards</CardTitle>
            </div>
            <CardDescription className="text-xs text-zinc-400">
              Toggle certifications held by your manufacturing units
            </CardDescription>
          </CardHeader>

          <div className="flex flex-wrap gap-2.5 pt-2">
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
        </Card>

        {/* Section 3: MSME Statutory Details */}
        <Card className="bg-[#13161a] border-[#222730] p-6 rounded-2xl space-y-4">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <CardTitle className="text-base font-bold text-white">MSME Public Procurement Privileges</CardTitle>
            </div>
            <CardDescription className="text-xs text-zinc-400">
              Enables automated EMD waiver calculations and purchase preference checks under GFR 2017 Rule 170(i)
            </CardDescription>
          </CardHeader>

          <div className="space-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.msme_registered}
                onChange={(e) => updateField("msme_registered", e.target.checked)}
                className="w-4 h-4 rounded border-[#303744] bg-[#0a0b0e] text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-sm font-semibold text-zinc-200">
                Company is registered as MSME (Micro / Small / Medium)
              </span>
            </label>

            {profile.msme_registered && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#222730]">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 font-mono">MSME Classification</label>
                  <select
                    value={profile.msme_category || "small"}
                    onChange={(e) => updateField("msme_category", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0b0e] border border-[#222730] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                  >
                    <option value="micro">Micro Enterprise (Turnover &lt; ₹5 Cr)</option>
                    <option value="small">Small Enterprise (Turnover ₹5 Cr to ₹50 Cr)</option>
                    <option value="medium">Medium Enterprise (Turnover &gt; ₹50 Cr)</option>
                  </select>
                </div>

                <Input
                  label="Udyam Registration Number"
                  value={profile.msme_udyam_number || ""}
                  onChange={(e) => updateField("msme_udyam_number", e.target.value)}
                  placeholder="UDYAM-XX-00-0000000"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Section 4: Company Background */}
        <Card className="bg-[#13161a] border-[#222730] p-6 rounded-2xl space-y-4">
          <CardHeader className="p-0">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-amber-400" />
              <CardTitle className="text-base font-bold text-white">Company Profile</CardTitle>
            </div>
            <CardDescription className="text-xs text-zinc-400">
              Statutory GSTIN and annual turnover for technical eligibility
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <Input
              label="Company Legal Name"
              value={profile.company_name}
              onChange={(e) => updateField("company_name", e.target.value)}
            />
            <Input
              label="GSTIN"
              value={profile.gst_number || ""}
              onChange={(e) => updateField("gst_number", e.target.value)}
            />
            <Input
              label="Annual Turnover (INR)"
              type="number"
              value={profile.annual_turnover_inr || ""}
              onChange={(e) => updateField("annual_turnover_inr", parseInt(e.target.value) || null)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
