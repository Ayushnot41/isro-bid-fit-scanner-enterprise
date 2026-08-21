import { NextResponse } from "next/server";
import { enqueueEvaluationJob, getJobStatus } from "@/lib/queue/redis-queue";
import { INITIAL_SCRAPED_TENDERS, DEMO_VENDOR_PROFILE } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tenderId = body.tender_id;

    const tender =
      INITIAL_SCRAPED_TENDERS.find((t) => t.id === tenderId) ||
      INITIAL_SCRAPED_TENDERS.find((t) => t.reference_number === tenderId) ||
      INITIAL_SCRAPED_TENDERS[0];

    // Non-blocking enqueue
    const job = await enqueueEvaluationJob(tender, DEMO_VENDOR_PROFILE);

    return NextResponse.json({
      success: true,
      job_id: job.id,
      status: job.status,
      message: "Evaluation task queued for Grok-4.20 prediction worker",
    }, { status: 202 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to enqueue job" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("job_id");

  if (!jobId) {
    return NextResponse.json({ error: "Missing job_id parameter" }, { status: 400 });
  }

  const job = getJobStatus(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, job });
}
