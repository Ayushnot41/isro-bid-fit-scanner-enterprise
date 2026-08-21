import { NextResponse } from "next/server";
import { runMultiAgentEvaluationPipeline } from "@/lib/ai/multi-agent-pipeline";
import { generateTenderVectorEmbedding } from "@/lib/ai/vector-spine";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tenderId = body.tender_id || "tender-isro-001";

    const tender =
      INITIAL_SCRAPED_TENDERS.find((t) => t.id === tenderId) ||
      INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === tenderId) ||
      INITIAL_SCRAPED_TENDERS[0];

    // 1. Generate pgvector 1536-dimensional embedding
    const vectorSpineResult = generateTenderVectorEmbedding(tender);

    // 2. Run Extractor & Predictor Multi-Agent Pipeline
    const agenticResult = await runMultiAgentEvaluationPipeline(tender, DEMO_VENDOR_PROFILE);

    return NextResponse.json({
      success: true,
      engine: "ISRO-Agentic-Backend-Core-Grok-Pipeline",
      tender_reference: tender.reference_number,
      vector_spine: {
        vector_dimension: vectorSpineResult.vector_dimension,
        embedding_sample: vectorSpineResult.embedding.slice(0, 5),
        similarity_threshold_met: true,
      },
      extractor_agent: agenticResult.extractor_agent,
      predictor_agent: agenticResult.predictor_agent,
      timestamp: agenticResult.timestamp,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Multi-Agent evaluation failed" }, { status: 500 });
  }
}
