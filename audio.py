import os
import typing

import requests
import yt_dlp
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
DEST_PATH = "data/ytdl"

ydl_options = {
    "format": "bestaudio/best",
    "outtmpl": DEST_PATH + "/%(title)s.%(ext)s",
    "postprocessors": [
        {
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }
    ],
    # 'progress_hooks': [save_on_finished]
}


def video_url_constructor(video_id):
    return f"https://www.youtube.com/watch?v={video_id}"


def download_audio(urls):
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


def get_urls_from_playlist(playlist_id: str):
    url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&key={YOUTUBE_API_KEY}"

    response = requests.get(url)
    data = response.json()

    # The playlists are in the `data['items']` list
    for playlist in data["items"]:
        print(playlist["snippet"]["title"])

    return [
        video_url_constructor(video["snippet"]["resourceId"]["videoId"])
        for video in data["items"]
    ]


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--playlist_id", type=str)

    args = parser.parse_args()

    urls = get_urls_from_playlist(args.playlist_id)
    print(urls)
    # download_audio(urls)

    # Pipeline:
    # TODO: fetch all related youtube video IDs based on the playlist ID, channel ID
    # TODO: preprocess source video metadata (+ link from the actual MLJ website)
    # TODO: save data into a simple postgres db
    # TODO: download audio clips
    # TODO: transcribe audio clips using Whisper
    # TODO: preprocess transcriptions and clean up
    # TODO: encode transcriptions using a model (e.g. Bert/ada v2)
    # TODO: store embeddings in a vector database with its metadata
