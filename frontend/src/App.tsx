import {useCallback, useMemo, useRef, useState} from "react";
import FileLoader from "./components/FileLoader";
import VideoPlayer from "./components/VideoPlayer";
import TranscriptPanel from "./components/TranscriptPanel";
import FeatureBar from "./components/FeatureBar";
import SubtitleBlocker from "./components/SubtitleBlocker";
import {useFeatureToggle} from "./hooks/useFeatureToggle";
import {useShadowPlayer} from "./hooks/useShadowPlayer";
import {useHotkeys} from "./hooks/useHotkeys";
import {getCachedTranscription, saveCachedTranscription, transcribeVideo} from "./services/api";
import {computeFileHash} from "./services/hash";
import type {LoopCount, Segment} from "./types";
import "./App.css";

function App() {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState("");
    const [segments, setSegments] = useState<Segment[]>([]);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [statusLog, setStatusLog] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loopCount, setLoopCount] = useState<LoopCount>(3);

    const videoRef = useRef<HTMLVideoElement>(null);
    const fileHashRef = useRef<string>("");
    const languageRef = useRef<string>("");

    const {features, toggle} = useFeatureToggle();

    const shadow = useShadowPlayer(videoRef, segments, features, loopCount);

    const hotkeyActions = useMemo(() => ({
        togglePlayPause: shadow.togglePlayPause,
        replayCurrent: shadow.replayCurrent,
        goToPrevSegment: shadow.goToPrevSegment,
        goToNextSegment: shadow.goToNextSegment,
        speedUp: shadow.speedUp,
        speedDown: shadow.speedDown,
    }), [shadow.togglePlayPause, shadow.replayCurrent, shadow.goToPrevSegment, shadow.goToNextSegment, shadow.speedUp, shadow.speedDown]);

    useHotkeys(hotkeyActions);

    const handleFileSelect = useCallback(async (file: File, blobUrl: string) => {
        setVideoSrc(blobUrl);
        setFileName(file.name);
        setSegments([]);
        setError(null);

        setStatusLog("Computing file hash...");
        setIsTranscribing(true);
        const startTime = Date.now();

        try {
            const hash = await computeFileHash(file);
            fileHashRef.current = hash;

            // Check cache
            setStatusLog("Checking cache...");
            const cached = await getCachedTranscription(hash);

            if (cached) {
                setSegments(cached.segments);
                languageRef.current = cached.language;
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                setStatusLog(
                    `Cache hit — ${cached.segments.length} segments, language: ${cached.language}, took ${elapsed}s`
                );
            } else {
                // Cache miss — transcribe
                setStatusLog(`Uploading "${file.name}"...`);
                const result = await transcribeVideo(file, (stage) => {
                    setStatusLog(stage);
                });

                setSegments(result.segments);
                languageRef.current = result.language;

                // Save to cache
                setStatusLog("Saving to cache...");
                await saveCachedTranscription(hash, {
                    segments: result.segments,
                    language: result.language,
                    timestamp: Date.now(),
                });

                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                setStatusLog(
                    `Done — ${result.segments.length} segments, language: ${result.language}, took ${elapsed}s`
                );
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Transcription failed";
            setError(msg);
            setStatusLog(`Error: ${msg}`);
        } finally {
            setIsTranscribing(false);
        }
    }, []);

    const handleMerge = useCallback(async (mergedSegments: Segment[]) => {
        setSegments(mergedSegments);

        // Persist to cache
        if (fileHashRef.current) {
            try {
                await saveCachedTranscription(fileHashRef.current, {
                    segments: mergedSegments,
                    language: languageRef.current,
                    timestamp: Date.now(),
                });
            } catch {
                // Non-critical: cache save failure doesn't block user
            }
        }
    }, []);

    return (
        <div className="app">
            <header className="app-header">
                <h1>Afterglow</h1>
            </header>

            <FileLoader
                onFileSelect={handleFileSelect}
                fileName={fileName}
                statusLog={statusLog}
                isTranscribing={isTranscribing}
            />

            {error && <div className="error-banner">{error}</div>}

            <main className="main-content">
                <div className="video-area">
                    <VideoPlayer ref={videoRef} src={videoSrc}/>
                    <SubtitleBlocker visible={features.subtitleBlock}/>
                    <FeatureBar
                        features={features}
                        onToggle={toggle}
                        loopCount={loopCount}
                        onLoopCountChange={setLoopCount}
                        shadowState={shadow.shadowState}
                        currentLoopIteration={shadow.currentLoopIteration}
                        gapRemaining={shadow.gapRemaining}
                        playbackRate={shadow.playbackRate}
                    />
                </div>
                <div className="transcript-area">
                    <TranscriptPanel
                        segments={segments}
                        currentSegmentId={shadow.currentSegmentId}
                        onSeek={shadow.seekToSegment}
                        onMerge={handleMerge}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
