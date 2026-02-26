import type {CacheEntry, TranscribeResponse} from "../types";

export async function transcribeVideo(
    file: File,
    onProgress?: (stage: string) => void
): Promise<TranscribeResponse> {
    onProgress?.(`Uploading "${file.name}" (${(file.size / 1024 / 1024).toFixed(1)} MB)...`);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
    }

    onProgress?.("Parsing response...");
    return response.json();
}

export async function getCachedTranscription(hash: string): Promise<CacheEntry | null> {
    const response = await fetch(`/api/cache/${hash}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Cache lookup failed");
    return response.json();
}

export async function saveCachedTranscription(hash: string, data: CacheEntry): Promise<void> {
    const response = await fetch(`/api/cache/${hash}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Cache save failed");
}
