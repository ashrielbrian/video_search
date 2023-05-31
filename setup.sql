alter table segment add column embedding vector(1536);

-- similarity search function
create or replace function search_segment (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id varchar,
  title varchar,
  playlist_id varchar,
  channel_title text,
  description text,
  thumbnail text,
  segment_id int8,
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
    video.id,
    video.title,
    video.playlist_id,
    video.channel_title,
    video.description,
    video.thumbnail,
    segment.id,
    segment.text,
    1 - (segment.embedding <=> query_embedding) as similarity,
    segment.start_time,
    segment.end_time
  from segment
  JOIN video
  ON video.id = segment.video_id
  order by (segment.embedding <=> query_embedding)
  limit match_count;
end;
$$;
-- DROP FUNCTION search_segment(vector(1536), float, int);

-- vector index
-- IMPORTANT: lists ~= 4 * sqrt(num_rows)
-- Tried to use lists = 1000 (on expectation of 1M rows), 
-- but insufficient memory on supabase free tier
create index on segment
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- gets the summaries with their associated segment starts for that particular topic
CREATE OR REPLACE FUNCTION get_summary_segments(p_video_id text)
RETURNS TABLE (video_id varchar, "order" integer, title text, summary text, start_segment_id integer, start_time float8, text text)
AS $$
BEGIN
    RETURN QUERY
    SELECT su.*, seg.start_time, seg.text
    FROM (
        SELECT s.video_id, s."order", s.title, s.summary, unnest(start_segment_ids) AS start_segment_id 
        FROM summary s 
        WHERE s.video_id = p_video_id
    ) su
    JOIN segment seg
    ON su.start_segment_id = seg.id AND su.video_id = seg.video_id;
END;
$$ LANGUAGE plpgsql;