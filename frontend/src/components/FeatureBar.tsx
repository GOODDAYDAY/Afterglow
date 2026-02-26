import type {FeatureKey, FeatureToggleConfig, LoopCount, ShadowState} from "../types";
import HotkeyHelp from "./HotkeyHelp";

const LOOP_OPTIONS: LoopCount[] = [1, 2, 3, 5, Infinity];

interface FeatureBarProps {
    features: FeatureToggleConfig;
    onToggle: (key: FeatureKey) => void;
    loopCount: LoopCount;
    onLoopCountChange: (count: LoopCount) => void;
    shadowState: ShadowState;
    currentLoopIteration: number;
    gapRemaining: number;
    playbackRate: number;
}

export default function FeatureBar({
                                       features,
                                       onToggle,
                                       loopCount,
                                       onLoopCountChange,
                                       shadowState,
                                       currentLoopIteration,
                                       gapRemaining,
                                       playbackRate,
                                   }: FeatureBarProps) {
    return (
        <div className="feature-bar">
            <button
                className={`feature-btn ${features.singleLoop ? "active" : ""}`}
                onClick={() => onToggle("singleLoop")}
                title="Single Sentence Loop"
            >
                Loop
            </button>

            {features.singleLoop && (
                <div className="loop-count-selector">
                    {LOOP_OPTIONS.map((n) => (
                        <button
                            key={String(n)}
                            className={`loop-option ${loopCount === n ? "active" : ""}`}
                            onClick={() => onLoopCountChange(n)}
                        >
                            {n === Infinity ? "∞" : n}
                        </button>
                    ))}
                </div>
            )}

            <button
                className={`feature-btn ${features.smartGap ? "active" : ""}`}
                onClick={() => onToggle("smartGap")}
                title="Smart Gap (Pause Between Sentences)"
            >
                Gap
            </button>

            <button
                className={`feature-btn ${features.subtitleBlock ? "active" : ""}`}
                onClick={() => onToggle("subtitleBlock")}
                title="Subtitle Blocker"
            >
                Sub Block
            </button>

            <div className="feature-bar-spacer"/>

            {shadowState === "gapping" && gapRemaining > 0 && (
                <span className="status-badge">Gap: {gapRemaining.toFixed(1)}s</span>
            )}

            {features.singleLoop && currentLoopIteration > 0 && (
                <span className="status-badge">
                    Loop {currentLoopIteration}/{loopCount === Infinity ? "∞" : loopCount}
                </span>
            )}

            <span className="status-badge">{playbackRate.toFixed(1)}×</span>

            <HotkeyHelp/>
        </div>
    );
}
