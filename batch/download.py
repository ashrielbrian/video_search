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

TRANSCRIBE_QUEUE_NAME = "transcribe"
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


def main(playlist_id: str):
    queue = queue_handler.VideoQueueHandler(TRANSCRIBE_QUEUE_NAME)
    videos = utils.get_urls_from_playlist(playlist_id)

    for video in videos:
        utils.download_audio([video.url], ydl_options=ydl_options)

        video.audio_file = os.path.join(DEST_PATH, video.title + ".mp3").replace(
            ":", "_"
        )
        queue.publish(video, "", TRANSCRIBE_QUEUE_NAME)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument("--playlist_id", type=str)
    args = parser.parse_args()

    main(args.playlist_id)
