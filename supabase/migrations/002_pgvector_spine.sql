-- Migration 002: pgvector Continuous Vector Spine for Historical Tender Memory
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS tender_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id TEXT NOT NULL,
  reference_number TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  issuing_center TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tender_embeddings_vector_idx 
ON tender_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Vector Cosine Similarity Search Function
CREATE OR REPLACE FUNCTION match_historical_tenders(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  reference_number TEXT,
  title TEXT,
  issuing_center TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tender_embeddings.id,
    tender_embeddings.reference_number,
    tender_embeddings.title,
    tender_embeddings.issuing_center,
    1 - (tender_embeddings.embedding <=> query_embedding) AS similarity
  FROM tender_embeddings
  WHERE 1 - (tender_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
