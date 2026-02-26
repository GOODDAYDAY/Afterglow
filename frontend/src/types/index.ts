export interface Segment {
    id: number;
    start: number;
    end: number;
    text: string;
}

export interface TranscribeResponse {
    segments: Segment[];
    language: string;
}

export interface FeatureToggleConfig {
    singleLoop: boolean;
    smartGap: boolean;
    subtitleBlock: boolean;
    pronunciationScore: boolean;
    spacedRepetition: boolean;
    fillInBlank: boolean;
    aiAnalysis: boolean;
}

export const DEFAULT_FEATURES: FeatureToggleConfig = {
    singleLoop: false,
    smartGap: false,
    subtitleBlock: false,
    pronunciationScore: false,
    spacedRepetition: false,
    fillInBlank: false,
    aiAnalysis: false,
};

export type FeatureKey = keyof FeatureToggleConfig;

export type LoopCount = 1 | 2 | 3 | 5 | typeof Infinity;

export type ShadowState = "idle" | "playing" | "gapping" | "paused";

export interface CacheEntry {
    segments: Segment[];
    language: string;
    timestamp: number;
}
