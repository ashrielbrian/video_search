"""
    Gets a message from a local MQ
"""
import os
import pickle
import json
import time

import db
import queue_handler
import whisper_transcribe
from models import Video, Segment
from batch.bootstrap_logs import setup_logging
from utils import combine_batch_segment

logger = setup_logging("transcribe_logger", "data/transcribe.log")

TRANSCRIBE_QUEUE_NAME = "transcribe"
EMBEDDING_QUEUE_NAME = "embedding"

queue = None


def transcribe_video(video: Video):
    if isinstance(video, bytes):
        video = pickle.loads(video)

    if not video.audio_file:
        logger.warn(f"No audio file found - failed to transcribe video: {video}")
        return

    global queue

    video.transcription_file = f"data/transcriptions/{video.title}.json".replace(
        ":", "_"
    )

    if os.path.isfile(video.transcription_file):
        logger.info(
            f"Already transcribed with whisper. Using existing transcription file.."
        )
        with open(video.transcription_file, "r") as f:
            result = json.load(f)
    else:
        logger.info(f"Transcribing with Whisper {video.title}..")
        start = time.time()
        result = whisper_transcribe.transcribe(video.audio_file)
        logger.info(f"Transcribing wtih Whisper took {(time.time() - start):2f}s")

        with open(video.transcription_file, "w") as f:
            json.dump(result, f, indent=4)

    video.segments = list(combine_batch_segment(result["segments"]))
    video.transcription = result["text"]

    queue.publish(video, "", EMBEDDING_QUEUE_NAME)
    logger.info(f"Done uploading to db. Completed transcription for {video.title}")


if __name__ == "__main__":
    consumer_handler = queue_handler.VideoQueueConsumer(TRANSCRIBE_QUEUE_NAME)
    queue = queue_handler.VideoQueueHandler(EMBEDDING_QUEUE_NAME)

    try:
        consumer_handler.start_consuming(TRANSCRIBE_QUEUE_NAME, transcribe_video)
    except KeyboardInterrupt:
        logger.info("Request to end consuming received. Stopping queue...")
        consumer_handler.stop_consuming()
        queue.close()
    except Exception as e:
        logger.exception(e)
