import pickle

import db
import queue_handler
from models import Video
from batch.bootstrap_logs import setup_logging
from oai_embeddings import generate_embeddings_batch

EMBEDDING_QUEUE_NAME = "embedding"


logger = setup_logging("embedding_logger", "data/embedding.log")


def make_embeddings(video: Video):
    if isinstance(video, bytes):
        video = pickle.loads(video)

    logger.info(
        f"Generating embeddings for {video.title}: has {len(video.segments)} embeddings."
    )
    for batch_segments in generate_embeddings_batch(video.segments):
        db.insert_segment_embeddings(video, batch_segments)

    # TODO: add db query to get all embeddings and verify lengths are consistent


if __name__ == "__main__":
    consumer_handler = queue_handler.VideoQueueConsumer(EMBEDDING_QUEUE_NAME)

    try:
        consumer_handler.start_consuming(EMBEDDING_QUEUE_NAME, make_embeddings)
    except KeyboardInterrupt:
        logger.info("Request to end consuming received. Stopping queue...")
        consumer_handler.stop_consuming()
    except Exception as e:
        logger.exception(e)
