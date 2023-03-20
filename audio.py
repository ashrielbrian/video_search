import os
import requests
import yt_dlp
from dotenv import load_dotenv

load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
DEST_PATH = "data/ytdl"

ydl_options = {
    'format': 'bestaudio/best',
    'outtmpl': DEST_PATH + '/%(title)s.%(ext)s',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    # 'progress_hooks': [save_on_finished]
}

    
def video_url_constructor(video_id):
    return f"https://www.youtube.com/watch?v={video_id}"

def download_audio(urls):
    with yt_dlp.YoutubeDL(ydl_options) as ydl:
        error_codes = ydl.download(urls)
    print(error_codes)

def get_urls_from_playlist(playlist_id: str):
    url = f'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&key={YOUTUBE_API_KEY}'

    response = requests.get(url)
    data = response.json()
    
    # The playlists are in the `data['items']` list    
    for playlist in data['items']:
        print(playlist['snippet']['title'])

    return [video_url_constructor(video['snippet']['resourceId']['videoId']) for video in data['items']]


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--playlist_id", type=str)

    args = parser.parse_args()

    urls = get_urls_from_playlist(args.playlist_id)
    print(urls)
    # download_audio(urls)