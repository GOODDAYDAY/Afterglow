import asyncio
import tempfile
from pathlib import Path

from app.services.whisper_service import transcribe
from fastapi import APIRouter, UploadFile, File

router = APIRouter()


@router.post("/transcribe")
async def transcribe_video(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix if file.filename else ".mp4"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = await asyncio.to_thread(transcribe, tmp_path)
    finally:
        Path(tmp_path).unlink(missing_ok=True)

    return result
