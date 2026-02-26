import {useState} from "react";

const HOTKEYS = [
    {key: "Space", desc: "Play / Pause"},
    {key: "Enter", desc: "Replay current sentence"},
    {key: "←", desc: "Previous sentence"},
    {key: "→", desc: "Next sentence"},
    {key: "↑", desc: "Speed up (+0.1×)"},
    {key: "↓", desc: "Speed down (-0.1×)"},
];

export default function HotkeyHelp() {
    const [open, setOpen] = useState(false);

    return (
        <div className="hotkey-help-wrapper">
            <button
                className="feature-btn"
                onClick={() => setOpen(!open)}
                title="Keyboard shortcuts"
            >
                ?
            </button>
            {open && (
                <div className="hotkey-help">
                    <div className="hotkey-help-title">Keyboard Shortcuts</div>
                    {HOTKEYS.map((h) => (
                        <div key={h.key} className="hotkey-row">
                            <kbd>{h.key}</kbd>
                            <span>{h.desc}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
