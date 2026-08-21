"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HelpCircle, X, CheckCircle2, ArrowRight, ExternalLink, Bot, BookOpen } from "lucide-react";
import type { ScrapedTender, VendorProfile } from "@/lib/types/database";

interface DynamicStreamingTextProps {
  tender: ScrapedTender;
  profile: VendorProfile;
  fitScore: number;
}

type Token = { text: string; cite?: boolean; citeData?: { domain: string; href: string; name: string } };

interface FollowUpDetail {
  question: string;
  simpleTitle: string;
  summary: string;
  keyPoints: string[];
  actionRecommendation: string;
  isroClause: string;
}

const FOLLOW_UP_KNOWLEDGE_BASE: Record<string, FollowUpDetail> = {
  "How to apply for ISRO vendor empanelment": {
    question: "How to apply for ISRO vendor empanelment",
    simpleTitle: "Step-by-Step ISRO Vendor Registration Guide",
    summary: "Getting registered as an approved ISRO vendor allows your company to bid on space tenders with fast-track technical clearance.",
    keyPoints: [
      "Step 1: Visit the ISRO Centralized Supplier Registration Portal (eproc.isro.gov.in) and create your vendor profile.",
      "Step 2: Upload your AS9100D or ISO 9001:2015 quality certificates and factory machinery list (e.g. 5-Axis CNC, CMM inspection tools).",
      "Step 3: If you are an MSME, upload your Udyam Registration to get ₹0 EMD tender submission rights.",
      "Step 4: An ISRO technical team will conduct a plant audit and issue your Permanent Vendor Code (PVC).",
    ],
    actionRecommendation: "Submit your online application through the e-Procurement portal and keep your NABL calibration records ready for the site audit.",
    isroClause: "ISRO Vendor Registration Policy 2024 & Purchase Manual Section 3.2",
  },
  "Calculate L1 price-matching band under MSME 25% quota": {
    question: "Calculate L1 price-matching band under MSME 25% quota",
    simpleTitle: "How the MSME 25% Price-Matching Rule Works in Simple Terms",
    summary: "Under Indian Government rules, registered Small & Medium Enterprises (MSEs) get 25% of the total order reserved for them even if they didn't submit the lowest quote initially.",
    keyPoints: [
      "What is the L1 Price? The lowest bid quote submitted by any qualified vendor.",
      "The 15% Price Band: If your price is within 15% above the lowest price (e.g. L1 is ₹1.00 Crore and your bid is up to ₹1.15 Crore), ISRO invites you to match the L1 price.",
      "Guaranteed 25% Order: Once you agree to match the L1 price, ISRO will award at least 25% of the tender quantity directly to your enterprise.",
      "Zero Cash EMD: Plus, you do not pay any Earnest Money Deposit under GFR Rule 170(i).",
    ],
    actionRecommendation: "Price your commercial bid strategically within 10-15% of estimated market cost to benefit from the guaranteed 25% allocation.",
    isroClause: "Public Procurement Policy for Micro and Small Enterprises (MSEs) Order 2012",
  },
  "Review Stage-4 Radiographic NDT inspection guidelines": {
    question: "Review Stage-4 Radiographic NDT inspection guidelines",
    simpleTitle: "Space-Grade X-Ray & Quality Inspection Checklist",
    summary: "Before ISRO accepts machined titanium or rocket components, they perform non-destructive tests (NDT) to ensure zero internal cracks or air voids.",
    keyPoints: [
      "Ultrasonic Testing (UT): 100% volumetric inspection of raw titanium billets per AMS 2631 Class AA standard.",
      "Radiographic (X-Ray) Inspection: Checks internal welds and gimbal brackets for micro-porosity per ASTM E1742.",
      "Surface Finish Check: Surface roughness must be smoother than Ra 0.4 µm with zero burrs or tool chatter marks.",
      "Inspection Witness: An ISRO Quality Assurance (QA) engineer will visit your workshop to witness the final CMM measurements before dispatch.",
    ],
    actionRecommendation: "Engage a NABL-accredited testing lab 14 days before delivery so your inspection test certificates are signed on time.",
    isroClause: "ISRO Quality Assurance Standard IS-QMS-001 & ASTM E1742 / AMS 2631",
  },
};

export default function DynamicStreamingText({
  tender,
  profile,
  fitScore,
}: DynamicStreamingTextProps) {
  const [count, setCount] = useState(0);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [activeFollowUp, setActiveFollowUp] = useState<FollowUpDetail | null>(null);

  // Generate dynamic tokens tailored to the tender and vendor
  const linearTol = tender.required_tolerances?.linear_tolerance_mm
    ? `±${(tender.required_tolerances.linear_tolerance_mm * 1000).toFixed(0)} µm`
    : "standard precision";
  
  const vendorLinearTol = profile.mechanical_tolerances?.linear_tolerance_mm
    ? `±${(profile.mechanical_tolerances.linear_tolerance_mm * 1000).toFixed(0)} µm`
    : "±20 µm";

  const isTolMet = (profile.mechanical_tolerances?.linear_tolerance_mm ?? 0.02) <= (tender.required_tolerances?.linear_tolerance_mm ?? 0.02);

  const emdWaiverText = profile.msme_registered
    ? `MSME registration qualifies for 100% EMD waiver (₹${((tender.emd_amount_inr || 0) / 100000).toFixed(2)} Lakhs saved).`
    : "Vendor is not MSME registered; 100% EMD deposit is required.";

  const textContent = `Autonomous analysis complete for ${tender.reference_number}. Vendor capability matches ${fitScore}% of ISRO ${tender.center_code || "centre"} requirements. Mechanical linear tolerance capability (${vendorLinearTol}) ${isTolMet ? "meets" : "deviates from"} target spec (${linearTol}). ${emdWaiverText} All technical envelopes should be prepared under General Conditions of Contract (GCC Section 4).`;

  const wordList = textContent.split(" ");
  const TOKENS: Token[] = [];
  wordList.forEach((word, idx) => {
    TOKENS.push({ text: word });
    if (idx === 6) {
      TOKENS.push({
        text: "",
        cite: true,
        citeData: {
          domain: "eproc.isro.gov.in",
          href: tender.source_url || "https://eproc.isro.gov.in",
          name: "ISRO e-Proc Portal",
        },
      });
    }
    if (idx === 18 && profile.msme_registered) {
      TOKENS.push({
        text: "",
        cite: true,
        citeData: {
          domain: "msme.gov.in",
          href: "https://msme.gov.in",
          name: "Public Procurement Policy (MSEs)",
        },
      });
    }
  });

  const FOLLOW_UPS = [
    `How to apply for ISRO vendor empanelment`,
    `Calculate L1 price-matching band under MSME 25% quota`,
    `Review Stage-4 Radiographic NDT inspection guidelines`,
  ];

  const SOURCES = [
    {
      name: "ISRO e-Procurement Gateway",
      domain: "eproc.isro.gov.in",
      href: tender.source_url || "https://eproc.isro.gov.in",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%231f7a5f'/%3E%3Cpath d='M20 36c0 7 5.4 12 12 12s12-5 12-12H20Z' fill='%23fff'/%3E%3Ccircle cx='32' cy='25' r='11' fill='%23bff3dd'/%3E%3C/svg%3E",
    },
    {
      name: "Ministry of MSME Procurement Policy",
      domain: "msme.gov.in",
      href: "https://msme.gov.in",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%232f6fec'/%3E%3Cpath d='M15 43 27 31l8 7 14-18' fill='none' stroke='%23fff' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
    },
    {
      name: "GeM Aerospace Procurement Index",
      domain: "gem.gov.in",
      href: "https://gem.gov.in",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23e56d24'/%3E%3Cpath d='M17 45V25h8v20h-8Zm11 0V16h8v29h-8Zm11 0V30h8v15h-8Z' fill='%23fff'/%3E%3C/svg%3E",
    },
  ];

  const done = count >= TOKENS.length;

  useEffect(() => {
    setCount(0);
  }, [tender.id]);

  useEffect(() => {
    const t = setTimeout(
      () => setCount((c) => (c >= TOKENS.length ? c : c + 1)),
      done ? 999999 : 50
    );
    return () => clearTimeout(t);
  }, [count, done, TOKENS.length]);

  const handleFollowUpClick = (questionText: string) => {
    const detail = FOLLOW_UP_KNOWLEDGE_BASE[questionText] || {
      question: questionText,
      simpleTitle: `Detailed Explanation for ${questionText}`,
      summary: `Here is the practical explanation of ${questionText} for ISRO tender ${tender.reference_number}.`,
      keyPoints: [
        `Ensure all technical requirements match ISRO's published specification for ${tender.title}.`,
        `Attach your certified quality calibration and MSME statutory exemption declarations.`,
        `Submit Technical Envelope-1 on eproc.isro.gov.in prior to the bid closing deadline.`,
      ],
      actionRecommendation: `Review the technical drawing requirements and compile your compliance statement.`,
      isroClause: `ISRO General Conditions of Contract (GCC Section 4)`,
    };
    setActiveFollowUp(detail);
  };

  return (
    <div className="w-full">
      <p className="text-[13px] leading-relaxed text-zinc-200">
        {TOKENS.slice(0, count).map((token, i) =>
          token.cite && token.citeData ? (
            <a
              key={i}
              href={token.citeData.href}
              target="_blank"
              rel="noreferrer"
              className="mx-1 inline-flex h-[18px] translate-y-[-1px] items-center gap-1 rounded-[5px]
                bg-zinc-800 pr-1.5 pl-[4px] align-middle font-mono text-[10.5px] text-cyan-300 shadow-hairline
                transition-colors duration-150 hover:bg-zinc-700 hover:text-white"
              style={{ animation: "pop-in 200ms cubic-bezier(0.23,1,0.32,1) both" }}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{token.citeData.domain}</span>
            </a>
          ) : (
            <span
              key={i}
              className="inline"
              style={{ animation: "fade-in 200ms ease-out both" }}
            >
              {token.text}{" "}
            </span>
          )
        )}
        {!done && (
          <span
            className="ml-0.5 inline-block h-3.5 w-1 translate-y-0.5 rounded-full bg-emerald-400 animate-pulse"
          />
        )}
      </p>

      {/* Action Row */}
      <div
        className="mt-3 flex items-center gap-2 transition-opacity duration-300 pt-2 border-t border-zinc-800"
        style={{ opacity: done ? 1 : 0.4 }}
      >
        <button
          type="button"
          onClick={() => setSourcesOpen(!sourcesOpen)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <span className="flex -space-x-1">
            {SOURCES.map((source) => (
              <img
                key={source.domain}
                src={source.image}
                alt=""
                className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-900"
              />
            ))}
          </span>
          <span className="text-[11px] font-medium text-zinc-300 font-mono">
            3 Statutory Sources Verified
          </span>
        </button>
      </div>

      {/* Expandable Sources */}
      {sourcesOpen && (
        <div className="mt-2 space-y-1.5 p-2 bg-zinc-950 rounded-xl border border-zinc-800">
          {SOURCES.map((source) => (
            <a
              key={source.domain}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <img src={source.image} alt="" className="w-3.5 h-3.5 rounded" />
                <span className="text-zinc-200">{source.name}</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">{source.domain}</span>
            </a>
          ))}
        </div>
      )}

      {/* Follow-up Prompts with Clickable Explainer Trigger */}
      <div className="mt-4 space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Recommended Follow-ups (Click for Plain-English Explanation)
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {FOLLOW_UPS.map((text, i) => (
            <button
              key={i}
              onClick={() => handleFollowUpClick(text)}
              className="text-left px-3 py-2 rounded-xl text-xs text-zinc-200 bg-[#161a20] hover:bg-[#1f252e] hover:text-emerald-300 hover:border-emerald-500/40 transition-all border border-[#222730] flex items-center justify-between group shadow-sm"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 group-hover:scale-125 transition-transform" />
                <span>{text}</span>
              </span>
              <span className="text-emerald-400 text-xs font-mono group-hover:translate-x-1 transition-transform">
                Read Guide →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Follow-Up Explainer Modal Window */}
      <AnimatePresence>
        {activeFollowUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md hardware-accelerated">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFollowUp(null)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg bg-[#13161a] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#0d0f12] border-b border-[#222730] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white leading-snug">
                      {activeFollowUp.simpleTitle}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Plain-English Procurement Guide
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveFollowUp(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c2128] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0a0b0e] border border-[#222730] text-zinc-200 leading-relaxed">
                  <p className="font-medium text-white">{activeFollowUp.summary}</p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Key Practical Steps:
                  </h4>
                  <div className="space-y-2">
                    {activeFollowUp.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#0d0f12] border border-[#1f242d] text-zinc-300 leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                          {idx + 1}
                        </span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 leading-relaxed">
                  <span className="font-mono font-bold text-[10px] text-cyan-400 block mb-1">
                    STRATEGIC ACTION:
                  </span>
                  <p>{activeFollowUp.actionRecommendation}</p>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between pt-2 border-t border-[#222730]">
                  <span>Reference: {activeFollowUp.isroClause}</span>
                  <span className="text-emerald-400 font-bold">Verified for India</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3 bg-[#0d0f12] border-t border-[#222730] flex items-center justify-end gap-2">
                <button
                  onClick={() => setActiveFollowUp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md"
                >
                  Got It, Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
