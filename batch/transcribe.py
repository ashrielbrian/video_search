"""
    Gets a message from a local MQ
"""

import pickle
import logging
import json
import time

import db
import queue_handler
import whisper_transcribe
from models import Video, Segment

logging.basicConfig()

TRANSCRIBE_QUEUE_NAME = "transcribe"
EMBEDDING_QUEUE_NAME = "embedding"

queue = None


def transcribe_video(video: Video):
    if isinstance(video, bytes):
        video = pickle.loads(video)

    if not video.audio_file:
        logging.warn(f"No audio file found - failed to transcribe video: {video}")
        return

    global queue

    logging.info(f"Transcribing with Whisper {video.title}..")
    start = time.time()
    result = whisper_transcribe.transcribe(video.audio_file)
    logging.info(f"Transcribing wtih Whisper took {(time.time() - start):2f}s")

    video.segments = [
        Segment(
            id=s["id"],
            start=s["start"],
            end=s["end"],
            text=s["text"],
            tokens=s["tokens"],
            emb=None,
        )
        for s in result["segments"]
    ]
    video.transcription = result["text"]
    video.transcription_file = f"data/transcriptions/{video.title}.json".replace(
        ":", "_"
    )

    with open(video.transcription_file, "w") as f:
        json.dump(result, f, indent=4)

    logging.info("Uploading video details and segments to database..")
    db.insert_video_details(
        {
            "id": video.video_id,
            "title": video.title,
            "transcription": video.transcription,
            "playlist_id": video.playlist_id,
            "channel_id": video.channel_id,
            "channel_title": video.channel_title,
            "description": video.description,
        }
    )
    db.insert_segments(video)

    logging.info(f"Done uploading to db. Completed transcription for {video.title}")
    queue.publish(video, "", EMBEDDING_QUEUE_NAME)


if __name__ == "__main__":

    consumer_handler = queue_handler.VideoQueueConsumer(TRANSCRIBE_QUEUE_NAME)
    queue = queue_handler.VideoQueueHandler(EMBEDDING_QUEUE_NAME)

    try:
        consumer_handler.start_consuming(TRANSCRIBE_QUEUE_NAME, transcribe_video)
    except KeyboardInterrupt:
        logging.info("Request to end consuming received. Stopping queue...")
        consumer_handler.stop_consuming()
        queue.close()
