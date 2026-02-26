import {useEffect} from "react";

interface HotkeyActions {
    togglePlayPause: () => void;
    replayCurrent: () => void;
    goToPrevSegment: () => void;
    goToNextSegment: () => void;
    speedUp: () => void;
    speedDown: () => void;
}

const HANDLED_KEYS = new Set([" ", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

export function useHotkeys(actions: HotkeyActions) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement).tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            if (!HANDLED_KEYS.has(e.key)) return;

            e.preventDefault();

            switch (e.key) {
                case " ":
                    actions.togglePlayPause();
                    break;
                case "Enter":
                    actions.replayCurrent();
                    break;
                case "ArrowLeft":
                    actions.goToPrevSegment();
                    break;
                case "ArrowRight":
                    actions.goToNextSegment();
                    break;
                case "ArrowUp":
                    actions.speedUp();
                    break;
                case "ArrowDown":
                    actions.speedDown();
                    break;
            }
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [actions]);
}
