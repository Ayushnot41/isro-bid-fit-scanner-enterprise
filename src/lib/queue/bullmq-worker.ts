import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";
import type { ScrapedTender, VendorProfile } from "@/lib/types/database";
import { runMultiAgentEvaluationPipeline, type MultiAgentEvaluationResult } from "@/lib/ai/multi-agent-pipeline";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Lazy connection to Redis
let redisClient: IORedis | null = null;
export function getRedisClient(): IORedis {
  if (!redisClient) {
    redisClient = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      enableOfflineQueue: false,
    });
    redisClient.on("error", () => {
      // Quiet fallback when Redis is running in local embedded mode
    });
  }
  return redisClient;
}

export const ISRO_EVALUATION_QUEUE_NAME = "isro_agentic_evaluations";

export interface BullMQJobData {
  tender: ScrapedTender;
  profile: VendorProfile;
}

/**
 * Creates BullMQ Queue instance
 */
export function createEvaluationQueue(): Queue<BullMQJobData> {
  return new Queue(ISRO_EVALUATION_QUEUE_NAME, {
    connection: getRedisClient(),
  });
}

/**
 * Processes background evaluation jobs using the Multi-Agent Pipeline
 */
export async function processEvaluationJob(
  job: Job<BullMQJobData>
): Promise<MultiAgentEvaluationResult> {
  const { tender, profile } = job.data;
  return await runMultiAgentEvaluationPipeline(tender, profile);
}
