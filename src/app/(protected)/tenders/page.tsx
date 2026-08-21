import type { ScrapedTender, BidEvaluation } from "@/lib/types/database";
import { TenderList } from "@/components/tenders/tender-list";
import { INITIAL_SCRAPED_TENDERS, INITIAL_EVALUATIONS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function TendersPage() {
  const tenders: ScrapedTender[] = INITIAL_SCRAPED_TENDERS;
  const evaluations: BidEvaluation[] = INITIAL_EVALUATIONS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto hardware-accelerated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl font-bold text-white font-sans">ISRO Procurement Catalog</h1>
          </div>
          <p className="text-zinc-400 text-sm font-mono">
            Live tender opportunities from VSSC, URSC, SAC, SDSC SHAR, IPRC & LPSC
          </p>
        </div>
      </div>

      <TenderList tenders={tenders} evaluations={evaluations} />
    </div>
  );
}
