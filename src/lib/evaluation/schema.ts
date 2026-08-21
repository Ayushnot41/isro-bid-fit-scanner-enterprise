import { z } from "zod";

export const EvaluationInputSchema = z.object({
  tender_id: z.string().uuid(),
});

export const EvaluationResultSchema = z.object({
  evaluation_id: z.string().uuid(),
  user_id: z.string().uuid(),
  tender_reference: z.string(),
  tender_title: z.string().nullable(),
  tender_mechanical_tolerances_met: z.boolean(),
  missing_certifications: z.array(z.string()),
  msme_waivers_applied: z.array(z.string()),
  final_bid_fit_score: z.number().min(0).max(100),
  certification_score: z.number().min(0).max(100),
  tolerance_score: z.number().min(0).max(100),
  msme_score: z.number().min(0).max(100),
  turnover_score: z.number().min(0).max(100),
  capability_score: z.number().min(0).max(100),
  recommendations: z.array(z.string()),
});

export type EvaluationInput = z.infer<typeof EvaluationInputSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
