from pathlib import Path

from faster_whisper import WhisperModel

MODEL_SIZE = "base"
MODEL_DIR = Path.home() / ".afterglow" / "models"

_model: WhisperModel | None = None


def get_model() -> WhisperModel:
    global _model
    if _model is None:
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        _model = WhisperModel(
            MODEL_SIZE,
            device="auto",
            compute_type="auto",
            download_root=str(MODEL_DIR),
        )
    return _model


def transcribe(audio_path: str) -> dict:
    model = get_model()
    segments_gen, info = model.transcribe(audio_path, beam_size=5)

    segments = []
    for i, seg in enumerate(segments_gen):
        segments.append({
            "id": i,
            "start": round(seg.start, 3),
            "end": round(seg.end, 3),
            "text": seg.text.strip(),
        })

    return {
        "segments": segments,
        "language": info.language,
    }
