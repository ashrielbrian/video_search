"""
    Uploads mp3 files to Supabase's storage; deletes the files after.

    Gotchas:
    - Increase global storage file limits: by default, it's set at 50mb
    https://app.supabase.com/project/<PROJECT_ID>/settings/storage
"""

import glob
import os
from functools import partial
import concurrent.futures

from db import upload_audio_file


def upload_and_remove(fp, bucket: str, dest_prefix: str = ""):
    fn = fp.rsplit("/", 1)[-1]
    if dest_prefix:
        fn = f"{dest_prefix}/{fn}"

    print(f"Uploading {fp}")
    resp = upload_audio_file(bucket, fn, fp)
    print(f"Removing {fp}")
    os.remove(fp)
    return resp


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--max_workers", type=int, help="No. of threads to use")
    parser.add_argument("--bucket", type=str, help="Destination bucket name")
    parser.add_argument(
        "--prefix", type=str, help="Bucket prefix to prepend to all uploaded files"
    )
    parser.add_argument(
        "--source_dir",
        type=str,
        default="data/ytdl",
        help="Source directory containing the mp3 files to upload.",
    )

    args = parser.parse_args()

    with concurrent.futures.ThreadPoolExecutor(
        max_workers=args.max_workers
    ) as executor:
        futures = []

        glob_pattern = os.path.join(args.source_dir, "**.mp3")
        print(
            f"Total files in {args.source_dir} directory: {len(glob.glob(glob_pattern))}"
        )

        upload_and_remove_with_args = partial(
            upload_and_remove, bucket=args.bucket, dest_prefix=args.prefix
        )

        for fp in glob.glob(glob_pattern):
            future = executor.submit(upload_and_remove_with_args, fp)
            futures.append(future)

        for future in concurrent.futures.as_completed(futures):
            print(future.result())
