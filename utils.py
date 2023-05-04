import os
from typing import List, Dict, Iterator, Any

import requests
import yt_dlp
from dotenv import load_dotenv

from models import Video, Segment

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def video_url_constructor(video_id):
    return f"https://www.youtube.com/watch?v={video_id}"


def download_audio(urls: List[str], ydl_options: Dict):
    with yt_dlp.YoutubeDL(ydl_options) as ydl:
        error_codes = ydl.download(urls)
    print(error_codes)


def get_playlists_from_channel(channel_id: str) -> List[Dict[str, str]]:
    playlists = []

    url = f"https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId={channel_id}&key={YOUTUBE_API_KEY}"

    response = requests.get(url)
    data = response.json()

    if len(data["items"]) > 0:
        playlists.extend(
            [{"id": p["id"], "title": p["snippet"]["title"]} for p in data["items"]]
        )

    while data.get("nextPageToken"):
        url += f"&pageToken={data['nextPageToken']}"
        response = requests.get(url)
        data = response.json()

        if len(data["items"]) > 0:
            playlists.extend(
                [{"id": p["id"], "title": p["snippet"]["title"]} for p in data["items"]]
            )

    return playlists


def make_video_from_dict(d: Dict):
    return Video(
        video_id=d["snippet"]["resourceId"]["videoId"],
        title=d["snippet"]["title"],
        transcription=None,
        segments=[],
        playlist_id=d["snippet"]["playlistId"],
        description=d["snippet"]["description"],
        url=video_url_constructor(d["snippet"]["resourceId"]["videoId"]),
        channel_id=d["snippet"]["channelId"],
        channel_title=d["snippet"]["channelTitle"],
        thumbnail=d["snippet"]["thumbnails"]["standard"]["url"],
    )


def get_urls_from_playlist(playlist_id: str) -> List[Video]:
    url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&key={YOUTUBE_API_KEY}"

    response = requests.get(url)
    data = response.json()

    videos = []
    # The playlists are in the `data['items']` list
    if len(data["items"]) > 0:
        videos.extend([make_video_from_dict(d) for d in data["items"]])

    while data.get("nextPageToken"):
        url += f"&pageToken={data['nextPageToken']}"
        response = requests.get(url)
        data = response.json()

        if len(data["items"]) > 0:
            videos.extend([make_video_from_dict(d) for d in data["items"]])

    return videos


def combine_batch_segment(segments: List[Dict], size=5):
    """Combines raw Whisper segments into larger segment sizes.

    Chooses the start time of the earliest segment, and the end time of the
    latest segment, and concatenates all the texts together with whitespace.

    Used in postprocessing Whisper transcription."""
    for i, batch in enumerate(batch_segments(segments, batch_size=size)):
        if len(batch) > 0:
            yield Segment(
                id=i,
                start=batch[0]["start"],
                end=batch[-1]["end"],
                text=" ".join([segment["text"] for segment in batch]),
                tokens=[token for segment in batch for token in segment["tokens"]],
            )


def batch_segments(segments: List[Any], batch_size=30) -> Iterator[List[Any]]:
    batch = []

    for segment in segments:
        batch.append(segment)

        if len(batch) == batch_size:
            yield batch
            batch = []
    if batch:
        yield batch
