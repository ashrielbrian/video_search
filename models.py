from typing import List, Optional
from dataclasses import dataclass


@dataclass
class Segment:
    id: int

    text: str
    tokens: Optional[List[int]] = None

    # time in seconds
    start: Optional[float] = None
    end: Optional[float] = None
    emb: Optional[List[float]] = None


@dataclass
class Video:
    video_id: str
    title: str

    transcription: str
    segments: List[Segment] = None
    playlist_id: Optional[str] = None
    description: str = None
    url: str = None
    channel_id: str = None
    channel_title: str = None
    thumbnail: str = None

    # source files
    audio_file: Optional[str] = None
    transcription_file: Optional[str] = None
