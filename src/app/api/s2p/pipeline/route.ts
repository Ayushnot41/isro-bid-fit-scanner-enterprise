import { NextResponse } from "next/server";
import { runS2PPipeline } from "@/lib/ai/s2p-orchestrator";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tenderId = body.tender_id || "tender-isro-001";

    const tender =
      INITIAL_SCRAPED_TENDERS.find((t) => t.id === tenderId) ||
      INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === tenderId) ||
      INITIAL_SCRAPED_TENDERS[0];

    const result = await runS2PPipeline(tender, DEMO_VENDOR_PROFILE);

    // Exact output schema per user specification
    return NextResponse.json({
      tender_id: result.tender_id,
      compliance_risks: result.compliance_risks.map((r) => ({
        risk_level: r.risk_level,
        pdf_citation: r.pdf_citation,
        description: r.description,
      })),
      win_probability: result.win_probability,
      draft_proposal_path: result.draft_proposal_path,
      agent_telemetry: result.agent_telemetry,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "S2P Pipeline failed" }, { status: 500 });
  }
}
