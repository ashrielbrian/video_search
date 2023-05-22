from db import get_all_videos, get_video_summary
from batch.bootstrap_logs import setup_logging

from summary import generate_summary

logger = setup_logging("download_logger", "data/download.log")


def main():
    videos_id_only = get_all_videos(columns="id")

    for video in videos_id_only:
        video_id = video.video_id

        summaries = get_video_summary(video_id, "order")
        if len(summaries) > 0:
            logger.info(
                f"Skipping {video_id} - already found {summaries} summaries generated."
            )
            continue

        topic_outputs, final_summary = generate_summary(
            video_id, model_name="gpt-3.5-turbo"
        )

        logger.info(f"Successfully completed summaries for {video_id}.")
        logger.info(f"Excerpt of final_summary: {final_summary[:100]}.")
        logger.info(f"Length of topics: {len(topic_outputs)}.")
