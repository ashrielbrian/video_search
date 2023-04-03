"""
    Gets all the video URLs from a single playlist ID,
    downloads the audio files one by one, saves to a local
    dir, and publishes the location of the audio file to
    a local rabbitmq server.
"""
import os
import argparse

import utils
import queue_handler
from db import get_all_videos
from batch.bootstrap_logs import setup_logging

logger = setup_logging("download_logger", "data/download.log")

TRANSCRIBE_QUEUE_NAME = "transcribe"
DEST_PATH = "data/ytdl"
ydl_options = {
    "format": "bestaudio/best",
    "outtmpl": DEST_PATH + "/%(id)s.%(ext)s",
    "postprocessors": [
        {
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }
    ],
    "restrictfilenames": True
    # 'progress_hooks': [save_on_finished]
}


def main(playlist_id: str):
    queue = queue_handler.VideoQueueHandler(TRANSCRIBE_QUEUE_NAME)
    videos = utils.get_urls_from_playlist(playlist_id)

    # avoid videos that have been processed before
    existing_videos = set(video.video_id for video in get_all_videos())

    for video in videos:
        if video.video_id in existing_videos:
            logger.info(f"Found video ID {video.video_id} ({video.title}). Skipping..")
            continue

        logger.info(f"Downloading ID {video.video_id}: {video.title}")
        utils.download_audio([video.url], ydl_options=ydl_options)
        video.audio_file = os.path.join(DEST_PATH, video.video_id + ".mp3")
        queue.publish(video, "", TRANSCRIBE_QUEUE_NAME)
    logger.info(f"Completed all downloads for ID {playlist_id}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--playlist_id",
        type=str,
        help="Videos from the playlist to download from. E.g. `PLvVtziP2bL61xbH4RV64MrA_Hdk09AvpN`",
    )
    args = parser.parse_args()

    logger.info(f"Downloading videos from the Playlist ID: {args.playlist_id}")
    main(args.playlist_id)
