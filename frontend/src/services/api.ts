import type {TranscribeResponse} from "../types";

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
