import {useEffect, useRef} from "react";
import type {Segment} from "../types";

interface TranscriptPanelProps {
    segments: Segment[];
    currentSegmentId: number | null;
    onSeek: (time: number) => void;
}

export default function TranscriptPanel({
                                            segments,
                                            currentSegmentId,
                                            onSeek,
                                        }: TranscriptPanelProps) {
    const activeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        activeRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
    }, [currentSegmentId]);

    if (segments.length === 0) {
        return (
            <div className="transcript-panel transcript-empty">
                <p>Transcript will appear here after transcription</p>
            </div>
        );
    }

    return (
        <div className="transcript-panel">
            {segments.map((seg) => {
                const isActive = seg.id === currentSegmentId;
                return (
                    <div
                        key={seg.id}
                        ref={isActive ? activeRef : undefined}
                        className={`transcript-segment ${isActive ? "active" : ""}`}
                        onClick={() => onSeek(seg.start)}
                    >
            <span className="segment-time">
              {formatTime(seg.start)}
            </span>
                        <span className="segment-text">{seg.text}</span>
                    </div>
                );
            })}
        </div>
    );
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}
