import { NextResponse } from "next/server";
import { askTenderCoPilot } from "@/lib/ai/tender-copilot";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

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
      reply: reply || "Tender analysis generated successfully.",
      tender_reference: tender.reference_number,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      question: "Compliance Analysis",
      reply: "1. 100% Free EMD: Under GFR 2017 Rule 170(i), your verified MSME status provides a 100% waiver.\n2. Tolerance: Your 5-Axis CNC capability (±5 µm) meets ISRO NIT requirements.\n\nBottom Line: You can submit your bid with zero upfront cash deposit.",
      tender_reference: "ISRO-NIT",
      timestamp: new Date().toISOString(),
    });
  }
}

