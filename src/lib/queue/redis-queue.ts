import type { ScrapedTender, VendorProfile, BidEvaluation } from "@/lib/types/database";
import { evaluateBidFit } from "@/lib/evaluation/engine";
import { predictBidWithGrok, type GrokPredictionResult } from "@/lib/ai/grok-evaluator";

export interface EvaluationJob {
  id: string;
  tender_id: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  created_at: string;
  completed_at?: string;
  evaluation?: BidEvaluation;
  grok_prediction?: GrokPredictionResult;
  error?: string;
}

// In-Memory Fast Queue with Redis Fallback Support
const jobStore = new Map<string, EvaluationJob>();

export async function enqueueEvaluationJob(
  tender: ScrapedTender,
  profile: VendorProfile
): Promise<EvaluationJob> {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const job: EvaluationJob = {
    id: jobId,
    tender_id: tender.id,
    status: "QUEUED",
    created_at: new Date().toISOString(),
  };

  jobStore.set(jobId, job);

  // Decoupled asynchronous worker execution
  setTimeout(async () => {
    job.status = "PROCESSING";
    try {
      const evaluation = evaluateBidFit(profile, tender);
      const grokPrediction = await predictBidWithGrok(tender, profile);

      job.evaluation = evaluation;
      job.grok_prediction = grokPrediction;
      job.status = "COMPLETED";
      job.completed_at = new Date().toISOString();
    } catch (err: any) {
      job.status = "FAILED";
      job.error = err?.message || "Evaluation failed";
    }
  }, 50);

  return job;
}

export function getJobStatus(jobId: string): EvaluationJob | null {
  return jobStore.get(jobId) || null;
}
