import { NextResponse } from "next/server";
import { askTenderCoPilot } from "@/lib/ai/tender-copilot";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = body.question || "What are the compliance requirements?";
    const tenderId = body.tender_id || "tender-isro-001";
    const history = body.history || [];

    const tender =
      INITIAL_SCRAPED_TENDERS.find((t) => t.id === tenderId) ||
      INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === tenderId) ||
      INITIAL_SCRAPED_TENDERS[0];

    const reply = await askTenderCoPilot(question, tender, DEMO_VENDOR_PROFILE, history);

    return NextResponse.json({
      success: true,
      question,
      reply,
      tender_reference: tender.reference_number,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Tender CoPilot query failed" }, { status: 500 });
  }
}
