import os
import typing

from dotenv import load_dotenv
from supabase import create_client

from models import Video, Segment

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase = create_client(url, key)


def insert_video_details(v: typing.Dict):
    data = supabase.table("video").insert(v).execute()
    return data


def get_all_videos(columns="*"):
    data = supabase.table("video").select(columns).execute()
    return [
        Video(
            video_id=v.get("id"),
            title=v.get("title"),
            transcription=v.get("transcription"),
            playlist_id=v.get("playlist_id"),
            description=v.get("description"),
            channel_id=v.get("channel_id"),
            channel_title=v.get("channel_title"),
        )
        for v in data.data
    ]


def insert_segments(video: Video):
    data = (
        supabase.table("segment")
        .upsert(
            [
                {
                    "id": s.id,
                    "video_id": video.video_id,
                    "start_time": s.start,
                    "end_time": s.end,
                    "text": s.text,
                    "tokens": s.tokens,
                }
                for s in video.segments
            ]
        )
        .execute()
    )
    return data


def insert_segment_embeddings(video: Video, segments: typing.List[Segment]):
    data = (
        supabase.table("segment_embedding")
        .upsert(
            [
                {"id": s.id, "video_id": video.video_id, "embedding": s.emb}
                for s in segments
            ]
        )
        .execute()
    )
    return data


def upload_audio_file(bucket_name: str, dest_path: str, source_path: str):
    res = supabase.storage.from_(bucket_name).upload(
        f"{bucket_name}/{dest_path}", source_path, file_options={"x-upsert": "true"}
    )
    print(f"{dest_path} success: {res.is_success}")
    return res.is_success
