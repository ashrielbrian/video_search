-- segment embedding table
CREATE TABLE segment_embedding (
  id int8 NOT NULL,
  video_id varchar NOT NULL,
  embedding vector(1536) NOT NULL,
  PRIMARY KEY (id, video_id),
  CONSTRAINT fk_video_id
    FOREIGN KEY (video_id)
    REFERENCES public.video (id)
);

-- similarity search function
create or replace function match_segment (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  segment_id int8,
  video_id varchar,
  content text,
  similarity float,
  start_time float,
  end_time float
)
language plpgsql
as $$
begin
  return query
  select
    segment_embedding.id,
    segment_embedding.video_id,
    segment.text,
    1 - (segment_embedding.embedding <=> query_embedding) as similarity,
    segment.start_time,
    segment.end_time
  from segment_embedding
  JOIN segment
  ON segment.video_id = segment_embedding.video_id and segment.id = segment_embedding.id
  where 1 - (segment_embedding.embedding <=> query_embedding) > similarity_threshold
  order by similarity desc
  limit match_count;
end;
$$;
-- DROP FUNCTION match_segment(vector(1536), float, int);

-- vector index
-- IMPORTANT: lists ~= 4 * sqrt(num_rows)
-- Tried to use lists = 1000 (on expectation of 1M rows), 
-- but insufficient memory on supabase free tier
create index on segment_embedding 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);