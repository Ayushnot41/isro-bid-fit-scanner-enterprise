"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Handshake, ShieldCheck, Sparkles, Building, MapPin, CheckCircle2, ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface PartnerMatch {
  id: string;
  name: string;
  location: string;
  capabilities: string[];
  certifications: string[];
  matchScore: number;
  fillsGap: string;
  status: "VERIFIED_ISRO_SUPPLIER" | "UDYAM_MSME";
}

interface ConsortiumMatcherProps {
  tenderTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const VERIFIED_PARTNERS: PartnerMatch[] = [
  {
    id: "part-1",
    name: "Ananth Aerospace Precision Metrology Ltd.",
    location: "Peenya Industrial Area, Bengaluru",
    capabilities: ["Laser Interferometry", "NABL Accredited Metrology Lab", "CMM 3D Scanning"],
    certifications: ["AS9100 Rev D", "NABL ISO 17025"],
    matchScore: 98,
    fillsGap: "NABL Metrology & Dimensional Calibration",
    status: "VERIFIED_ISRO_SUPPLIER",
  },
  {
    id: "part-2",
    name: "Godrej Space & Strategic Passivation Systems",
    location: "Vikhroli, Mumbai",
    capabilities: ["Titanium Chemical Passivation", "ISO Class 7 Cleanroom", "Nitrogen Vacuum Sealing"],
    certifications: ["AS9100D", "ISO 14644-1"],
    matchScore: 94,
    fillsGap: "ISO Class 7 Cleanroom & Outgassing Passivation",
    status: "VERIFIED_ISRO_SUPPLIER",
  },
  {
    id: "part-3",
    name: "MTAR NDT & Radiographic Inspection Division",
    location: "Balanagar, Hyderabad",
    capabilities: ["ASTM E1742 Radiography", "AMS 2631 Ultrasonic UT", "Dye Penetrant Testing"],
    certifications: ["NADCAP NDT", "ISO 9001:2015"],
    matchScore: 92,
    fillsGap: "Volumetric Radiographic & Ultrasonic NDT",
    status: "UDYAM_MSME",
  },
];

export function ConsortiumMatcher({
  tenderTitle,
  isOpen,
  onClose,
}: ConsortiumMatcherProps) {
  const [selectedPartners, setSelectedPartners] = useState<string[]>(["part-1"]);
  const [consortiumSubmitted, setConsortiumSubmitted] = useState(false);

  useLockBodyScroll(isOpen);

  const togglePartner = (id: string) => {
    setSelectedPartners((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hardware-accelerated overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl bg-[#0e1115] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-4 bg-[#13161a] border-b border-[#222730] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Handshake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  Aerospace Consortium & Joint Venture Matcher
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    ISRO GCC Sec 4.6
                  </span>
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono truncate max-w-md">
                  Target RFP: {tenderTitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c2128] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 p-5 overflow-y-auto overscroll-contain custom-scrollbar space-y-4 text-xs font-sans">
            <div className="p-3.5 rounded-xl bg-[#13161a] border border-[#222730] flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  Autonomous Joint Venture Formation Engine
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  Combine your 5-Axis CNC machining strength with certified Indian partners to achieve a <strong>100% Comprehensive Bid Score</strong> and satisfy all specialized NDT & Cleanroom clauses.
                </p>
              </div>
            </div>

            {/* Partners List */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Empaneled Indian Aerospace Partners:
              </h4>

              {VERIFIED_PARTNERS.map((partner) => {
                const isSelected = selectedPartners.includes(partner.id);
                return (
                  <div
                    key={partner.id}
                    onClick={() => togglePartner(partner.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#141a20] border-emerald-500/50 shadow-md"
                        : "bg-[#0a0b0e] border-[#222730] opacity-80 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-xs">{partner.name}</h5>
                          <span className="px-2 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {partner.matchScore}% Match
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {partner.location}
                        </p>

                        <div className="p-2 rounded-lg bg-[#0d0f12] border border-[#1f242d] text-emerald-300 text-[11px] font-mono flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>Fills Gap: {partner.fillsGap}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {partner.certifications.map((c) => (
                            <span key={c} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#1c2128] text-zinc-300">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex-shrink-0 pt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-3.5 bg-[#13161a] border-t border-[#222730] flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400">
              {selectedPartners.length} Partner(s) Selected for Consortium
            </span>

            <Button
              size="sm"
              onClick={() => {
                setConsortiumSubmitted(true);
                setTimeout(() => {
                  setConsortiumSubmitted(false);
                  onClose();
                }, 1200);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs px-4"
            >
              {consortiumSubmitted ? "Consortium Agreement Generated!" : "Form Consortium & Generate MoU"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
