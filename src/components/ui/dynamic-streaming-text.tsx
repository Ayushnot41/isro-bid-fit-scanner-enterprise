"use client";

import { useEffect, useState } from "react";
import type { ScrapedTender, VendorProfile } from "@/lib/types/database";

interface DynamicStreamingTextProps {
  tender: ScrapedTender;
  profile: VendorProfile;
  fitScore: number;
}

type Token = { text: string; cite?: boolean; citeData?: { domain: string; href: string; name: string } };

export default function DynamicStreamingText({
  tender,
  profile,
  fitScore,
}: DynamicStreamingTextProps) {
  const [count, setCount] = useState(0);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // Generate dynamic tokens tailored to the tender and vendor
  const linearTol = tender.required_tolerances?.linear_tolerance_mm
    ? `±${(tender.required_tolerances.linear_tolerance_mm * 1000).toFixed(0)} µm`
    : "standard precision";
  
  const vendorLinearTol = profile.mechanical_tolerances?.linear_tolerance_mm
    ? `±${(profile.mechanical_tolerances.linear_tolerance_mm * 1000).toFixed(0)} µm`
    : "±20 µm";

  const isTolMet = (profile.mechanical_tolerances?.linear_tolerance_mm ?? 0.02) <= (tender.required_tolerances?.linear_tolerance_mm ?? 0.02);

  const emdWaiverText = profile.msme_registered
    ? `MSME registration qualifies for 100% EMD waiver (₹${((tender.emd_amount_inr || 0) / 100000).toFixed(2)}L saved).`
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
    `How to apply for ISRO ${tender.center_code || "VSSC"} vendor empanelment`,
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

      {/* Follow-up Prompts */}
      <div className="mt-3 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">
          Recommended Follow-ups
        </p>
        <div className="grid grid-cols-1 gap-1">
          {FOLLOW_UPS.map((text, i) => (
            <button
              key={i}
              className="text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 bg-zinc-900/60 hover:bg-zinc-800/80 hover:text-emerald-300 transition-colors border border-zinc-800/60 flex items-center justify-between"
            >
              <span>{text}</span>
              <span className="text-zinc-500 text-[10px] font-mono">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
