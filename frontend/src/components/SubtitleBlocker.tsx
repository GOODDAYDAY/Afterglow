import {useCallback, useEffect, useRef, useState} from "react";

const STORAGE_KEY = "afterglow-blocker-height";
const PRESETS = {small: 10, medium: 18, large: 28};
const MIN_HEIGHT = 5;
const MAX_HEIGHT = 50;

interface SubtitleBlockerProps {
    visible: boolean;
}

function loadHeight(): number {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return Number(stored);
    } catch { /* ignore */
    }
    return PRESETS.medium;
}

export default function SubtitleBlocker({visible}: SubtitleBlockerProps) {
    const [heightPct, setHeightPct] = useState(loadHeight);
    const dragging = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(heightPct));
    }, [heightPct]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragging.current || !containerRef.current) return;
        const parent = containerRef.current.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const fromBottom = rect.bottom - e.clientY;
        const pct = Math.round((fromBottom / rect.height) * 100);
        setHeightPct(Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, pct)));
    }, []);

    const onPointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    if (!visible) return null;

    return (
        <div
            ref={containerRef}
            className="subtitle-blocker"
            style={{height: `${heightPct}%`}}
        >
            <div
                className="blocker-handle"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                <span className="blocker-handle-dots">⋯</span>
            </div>
            <div className="blocker-presets">
                {(Object.entries(PRESETS) as [string, number][]).map(([label, val]) => (
                    <button
                        key={label}
                        className={`blocker-preset-btn ${heightPct === val ? "active" : ""}`}
                        onClick={() => setHeightPct(val)}
                    >
                        {label[0].toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}
