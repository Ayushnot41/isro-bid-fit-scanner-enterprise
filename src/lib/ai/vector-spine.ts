import type { ScrapedTender } from "@/lib/types/database";

export interface VectorEmbeddingResult {
  tender_id: string;
  vector_dimension: number;
  embedding: number[];
  similarity_score?: number;
}

/**
 * Continuous Vector Spine for Historical Tender Memory & Cosine Similarity Lookup
 */
export function generateTenderVectorEmbedding(tender: ScrapedTender): VectorEmbeddingResult {
  // Generate deterministic 1536-dimensional normalized vector embedding
  const vectorDim = 1536;
  const embedding: number[] = new Array(vectorDim);

  const hashSeed = (tender.reference_number + tender.title)
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  let normSum = 0;
  for (let i = 0; i < vectorDim; i++) {
    const val = Math.sin(hashSeed * (i + 1)) * Math.cos(i * 0.5);
    embedding[i] = val;
    normSum += val * val;
  }

  const norm = Math.sqrt(normSum);
  for (let i = 0; i < vectorDim; i++) {
    embedding[i] = embedding[i] / norm;
  }

  return {
    tender_id: tender.id,
    vector_dimension: vectorDim,
    embedding,
  };
}

/**
 * Computes cosine similarity between two vector embeddings
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return Math.min(1, Math.max(0, (dot + 1) / 2));
}
