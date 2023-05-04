import typing
from dataclasses import dataclass


@dataclass
class Segment:
    id: int

    # time in seconds
    start: float
    end: float

    text: str
    tokens: typing.List[int]
    emb: typing.Optional[typing.List[float]] = None


@dataclass
class Video:
    video_id: str
    title: str

    transcription: str
    segments: typing.List[Segment] = None
    playlist_id: typing.Optional[str] = None
    description: str = None
    url: str = None
    channel_id: str = None
    channel_title: str = None
    thumbnail: str = None

    # source files
    audio_file: typing.Optional[str] = None
    transcription_file: typing.Optional[str] = None
