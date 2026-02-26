import {useEffect, useRef, useState} from "react";
import type {Segment} from "../types";

interface TranscriptPanelProps {
    segments: Segment[];
    currentSegmentId: number | null;
    onSeek: (segmentId: number) => void;
    onMerge: (mergedSegments: Segment[]) => void;
}

export default function TranscriptPanel({
                                            segments,
                                            currentSegmentId,
                                            onSeek,
                                            onMerge,
                                        }: TranscriptPanelProps) {
    const activeRef = useRef<HTMLDivElement>(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        activeRef.current?.scrollIntoView({behavior: "smooth", block: "center"});
    }, [currentSegmentId]);

    // Clear selection when exiting edit mode
    useEffect(() => {
        if (!editMode) setSelectedIds(new Set());
    }, [editMode]);

    const toggleSelection = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const canMerge = (): boolean => {
        if (selectedIds.size < 2) return false;
        // Check that selected segments are adjacent
        const indices = segments
            .map((s, i) => (selectedIds.has(s.id) ? i : -1))
            .filter((i) => i >= 0)
            .sort((a, b) => a - b);
        for (let i = 1; i < indices.length; i++) {
            if (indices[i] !== indices[i - 1] + 1) return false;
        }
        return true;
    };

    const handleMerge = () => {
        if (!canMerge()) return;
        const selected = segments.filter((s) => selectedIds.has(s.id));
        selected.sort((a, b) => a.start - b.start);

        const merged: Segment = {
            id: selected[0].id,
            start: selected[0].start,
            end: selected[selected.length - 1].end,
            text: selected.map((s) => s.text).join(" "),
        };

        const newSegments = segments
            .filter((s) => !selectedIds.has(s.id))
            .concat(merged)
            .sort((a, b) => a.start - b.start)
            .map((s, i) => ({...s, id: i}));

        setSelectedIds(new Set());
        onMerge(newSegments);
    };

    if (segments.length === 0) {
        return (
            <div className="transcript-panel transcript-empty">
                <p>Transcript will appear here after transcription</p>
            </div>
        );
    }

    return (
        <div className="transcript-panel">
            <div className="transcript-header">
                <button
                    className={`btn btn-sm ${editMode ? "btn-primary" : ""}`}
                    onClick={() => setEditMode(!editMode)}
                >
                    {editMode ? "Done" : "Edit"}
                </button>
                {editMode && canMerge() && (
                    <button className="btn btn-sm btn-primary" onClick={handleMerge}>
                        Merge ({selectedIds.size})
                    </button>
                )}
            </div>
            {segments.map((seg) => {
                const isActive = seg.id === currentSegmentId;
                const isSelected = selectedIds.has(seg.id);
                return (
                    <div
                        key={seg.id}
                        ref={isActive ? activeRef : undefined}
                        className={`transcript-segment ${isActive ? "active" : ""} ${isSelected ? "selected" : ""}`}
                        onClick={() => editMode ? toggleSelection(seg.id) : onSeek(seg.id)}
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
