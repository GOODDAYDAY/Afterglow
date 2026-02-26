import {useCallback, useState} from "react";
import type {FeatureKey, FeatureToggleConfig} from "../types";
import {DEFAULT_FEATURES} from "../types";

const STORAGE_KEY = "afterglow-features";

function loadFeatures(): FeatureToggleConfig {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return {...DEFAULT_FEATURES, ...JSON.parse(stored)};
        }
    } catch {
        // ignore parse errors
    }
    return {...DEFAULT_FEATURES};
}

export function useFeatureToggle() {
    const [features, setFeatures] = useState<FeatureToggleConfig>(loadFeatures);

    const toggle = useCallback((key: FeatureKey) => {
        setFeatures((prev) => {
            const next = {...prev, [key]: !prev[key]};
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return {features, toggle};
}
