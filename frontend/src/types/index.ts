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
