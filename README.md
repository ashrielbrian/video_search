whisper /home/brian/Downloads/mlj_sermons/1/3003_a-man-called-paul_romans-11.mp3 --model medium --output_dir data

## Getting Started

A `.env` file containing:

```
    YOUTUBE_API_KEY=
    OPENAI_API_KEY=
    SUPABASE_DATABASE_PASSWORD=
    SUPABASE_KEY=
    SUPABASE_URL=https://xyz.supabase.co
```

## Processing videos from a playlist

```
    make batch PLAYLIST_ID=<YOUR_PLAYLIST_ID>,<ANOTHER_PLAYLIST_ID>
```
