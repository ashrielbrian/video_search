from typing import Dict
import logging

import whisper
import torch

MODEL = "medium"
model = None


def transcribe(audio_path: str) -> Dict:
    global model

    device = "cuda" if torch.cuda.is_available() else "cpu"

    if not model:
        logging.info(f"Using {device}")
        model = whisper.load_model(MODEL, device=device)

    return model.transcribe(audio_path)
