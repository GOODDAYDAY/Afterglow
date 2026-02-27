<div align="center">

# Afterglow

**Turn any video into an interactive shadowing workstation.**

AI-powered smart segmentation · Single-sentence looping · Hands-free hotkeys · 100% local & offline

[![License](https://img.shields.io/badge/license-CC-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-19-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/fastapi-0.115+-green.svg)](https://fastapi.tiangolo.com/)

[English](README.md) | [中文](README.zh-CN.md)

</div>

---

## What is Afterglow?

Afterglow is a **local-first language learning player** designed
for [shadowing](https://en.wikipedia.org/wiki/Speech_shadowing) practice. Drop in any video file, and Afterglow will:

1. **Transcribe** it into timestamped sentences using [Faster-Whisper](https://github.com/SYSTRAN/faster-whisper)
2. **Segment** the speech into logical sentence boundaries
3. **Play** each sentence with configurable looping and gap pauses — so you can listen, pause, and repeat

No cloud APIs. No subscriptions. Everything runs on your machine.

---

## Demo

<p align="center">
  <img src="docs/images/1. overview.gif" alt="Afterglow overview" width="720" />
</p>

---

## Features

| Feature                  | Description                                                                   |
|--------------------------|-------------------------------------------------------------------------------|
| **AI Transcription**     | Powered by Faster-Whisper (base model, ~143 MB). Auto-downloads on first run. |
| **Single-Sentence Loop** | Repeat current sentence 1 / 2 / 3 / 5 / ∞ times before advancing.             |
| **Smart Gap**            | Auto-pause between sentences — giving you time to shadow.                     |
| **Hotkeys**              | `Space` play/pause · `Enter` replay · `←→` prev/next · `↑↓` speed             |
| **Segment Merge**        | Combine broken segments with one click.                                       |
| **Subtitle Blocker**     | Hide embedded subtitles so you rely on your ears.                             |
| **Smart Caching**        | SHA-256 file hash → skip re-transcription on reload.                          |
| **Playback Speed**       | 0.3× to 3.0× in 0.1× steps.                                                   |

### Playback Mode Matrix

|              | Gap OFF                   | Gap ON                         |
|--------------|---------------------------|--------------------------------|
| **Loop OFF** | Normal continuous play    | Auto-pause after each sentence |
| **Loop ON**  | Repeat N times, then next | Repeat → pause → repeat cycle  |

---

## Quick Start

### Prerequisites

- **Python** 3.13+
- **Node.js** 22+ (with npm)

### One-Click Launch (Windows)

```bash
git clone https://github.com/your-username/Afterglow.git
cd Afterglow
start.bat
```

The script installs dependencies, finds free ports, starts both services, and opens your browser.

### Manual Launch (Any OS)

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

Then open `http://localhost:5173` in your browser.

---

## Project Structure

```
Afterglow/
├── frontend/                # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # UI components (VideoPlayer, TranscriptPanel, ...)
│   │   ├── hooks/           # Custom hooks (useShadowPlayer, useHotkeys, ...)
│   │   ├── services/        # API client & file hashing
│   │   └── types/           # TypeScript interfaces
│   └── vite.config.ts
│
├── backend/                 # FastAPI + Faster-Whisper
│   ├── app/
│   │   ├── routers/         # /api/transcribe, /api/cache
│   │   └── services/        # Whisper model wrapper
│   └── requirements.txt
│
├── docs/                    # Requirements & plans
├── start.bat                # Windows launcher
└── README.md
```

**Runtime data** is stored in `~/.afterglow/`:

```
~/.afterglow/
├── cache/       # Transcription cache (JSON, keyed by SHA-256)
└── models/      # Whisper model files (auto-downloaded)
```

---

## API Reference

| Method | Endpoint            | Description                                  |
|--------|---------------------|----------------------------------------------|
| `POST` | `/api/transcribe`   | Upload video file → get timestamped segments |
| `GET`  | `/api/cache/{hash}` | Retrieve cached transcription by file hash   |
| `PUT`  | `/api/cache/{hash}` | Store transcription result in cache          |

---

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React 19, TypeScript, Vite 7, CSS3 |
| Backend    | Python 3.13, FastAPI, Uvicorn      |
| ASR Engine | Faster-Whisper (CTranslate2)       |
| Caching    | SHA-256 hash → local JSON files    |

---

## Roadmap

- [x] Core video player with transcript panel
- [x] AI transcription (Faster-Whisper)
- [x] Single-sentence loop & smart gap
- [x] Hotkey controls
- [x] Segment merging
- [x] Transcription caching
- [ ] Recording & playback comparison
- [ ] Pronunciation scoring
- [ ] Desktop app packaging (Electron / Tauri)

---

## License

This project is licensed under the [CC License](LICENSE).

---

<div align="center">
  <sub>Built for language learners who believe in deliberate practice.</sub>
</div>
