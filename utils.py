import os
import typing

import requests
import yt_dlp
from dotenv import load_dotenv

from models import Video

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def video_url_constructor(video_id):
    return f"https://www.youtube.com/watch?v={video_id}"


def download_audio(urls, ydl_options: typing.Dict):
    with yt_dlp.YoutubeDL(ydl_options) as ydl:
        error_codes = ydl.download(urls)
    print(error_codes)


def get_playlists_from_channel(channel_id: str) -> typing.List[typing.Dict[str, str]]:
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


def get_urls_from_playlist(playlist_id: str) -> typing.List[Video]:
    url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&key={YOUTUBE_API_KEY}"

    response = requests.get(url)
    data = response.json()

    # The playlists are in the `data['items']` list
    for playlist in data["items"]:
        print(playlist["snippet"]["title"])

    return [
        Video(
            i["snippet"]["resourceId"]["videoId"],
            i["snippet"]["title"],
            None,
            [],
            i["snippet"]["playlistId"],
            i["snippet"]["description"],
            video_url_constructor(i["snippet"]["resourceId"]["videoId"]),
        )
        for i in data["items"]
    ]
