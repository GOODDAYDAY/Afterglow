import json
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

CACHE_DIR = Path.home() / ".afterglow" / "cache"


class CacheData(BaseModel):
    segments: list[dict]
    language: str
    timestamp: float


def _cache_path(file_hash: str) -> Path:
    if not file_hash.isalnum():
        raise HTTPException(status_code=400, detail="Invalid hash")
    return CACHE_DIR / f"{file_hash}.json"


@router.get("/cache/{file_hash}")
async def get_cache(file_hash: str):
    path = _cache_path(file_hash)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Cache not found")
    return json.loads(path.read_text(encoding="utf-8"))


@router.put("/cache/{file_hash}")
async def put_cache(file_hash: str, data: CacheData):
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = _cache_path(file_hash)
    path.write_text(json.dumps(data.model_dump(), ensure_ascii=False), encoding="utf-8")
    return {"status": "ok"}
