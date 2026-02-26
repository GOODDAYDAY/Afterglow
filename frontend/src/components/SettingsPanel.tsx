import {useState} from "react";
import type {FeatureKey, FeatureToggleConfig} from "../types";

interface SettingsPanelProps {
    features: FeatureToggleConfig;
    onToggle: (key: FeatureKey) => void;
}

const FEATURE_LABELS: Record<FeatureKey, string> = {
    singleLoop: "Single Sentence Loop",
    smartGap: "Smart Gap (Pause Between Sentences)",
    subtitleBlock: "Subtitle Blocker",
    pronunciationScore: "Pronunciation Scoring",
    spacedRepetition: "Spaced Repetition",
    fillInBlank: "Fill in the Blank",
    aiAnalysis: "AI Analysis",
};

export default function SettingsPanel({features, onToggle}: SettingsPanelProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="btn settings-btn"
                onClick={() => setOpen(!open)}
                title="Settings"
            >
                ⚙
            </button>
            {open && (
                <div className="settings-overlay" onClick={() => setOpen(false)}>
                    <div className="settings-drawer" onClick={(e) => e.stopPropagation()}>
                        <h3>Feature Toggles</h3>
                        {(Object.keys(FEATURE_LABELS) as FeatureKey[]).map((key) => (
                            <label key={key} className="toggle-row">
                                <input
                                    type="checkbox"
                                    checked={features[key]}
                                    onChange={() => onToggle(key)}
                                />
                                <span>{FEATURE_LABELS[key]}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
