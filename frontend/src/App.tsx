import {useCallback, useRef, useState} from "react";
import FileLoader from "./components/FileLoader";
import VideoPlayer from "./components/VideoPlayer";
import TranscriptPanel from "./components/TranscriptPanel";
import SettingsPanel from "./components/SettingsPanel";
import {useFeatureToggle} from "./hooks/useFeatureToggle";
import {transcribeVideo} from "./services/api";
import type {Segment} from "./types";
import "./App.css";

function App() {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState("");
    const [segments, setSegments] = useState<Segment[]>([]);
    const [currentSegmentId, setCurrentSegmentId] = useState<number | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [statusLog, setStatusLog] = useState("");
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const {features, toggle} = useFeatureToggle();

    const handleFileSelect = useCallback(async (file: File, blobUrl: string) => {
        setVideoSrc(blobUrl);
        setFileName(file.name);
        setSegments([]);
        setCurrentSegmentId(null);
        setError(null);

        setStatusLog(`Video loaded: ${file.name}`);

        // Auto-start transcription
        setIsTranscribing(true);
        const startTime = Date.now();
        try {
            setStatusLog("Sending file to ASR service...");

            const result = await transcribeVideo(file, (stage) => {
                setStatusLog(stage);
            });

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            setSegments(result.segments);
            setStatusLog(
                `Done — ${result.segments.length} segments, language: ${result.language}, took ${elapsed}s`
            );
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Transcription failed";
            setError(msg);
            setStatusLog(`Error: ${msg}`);
        } finally {
            setIsTranscribing(false);
        }
    }, []);

    const handleTimeUpdate = useCallback(
        (currentTime: number) => {
            const seg = segments.find(
                (s) => currentTime >= s.start && currentTime < s.end
            );
            setCurrentSegmentId(seg ? seg.id : null);
        },
        [segments]
    );

    const handleSeek = useCallback((time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            videoRef.current.play();
        }
    }, []);

    return (
        <div className="app">
            <header className="app-header">
                <h1>Afterglow</h1>
                <div className="header-actions">
                    <SettingsPanel features={features} onToggle={toggle}/>
                </div>
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
                    <VideoPlayer
                        ref={videoRef}
                        src={videoSrc}
                        onTimeUpdate={handleTimeUpdate}
                    />
                </div>
                <div className="transcript-area">
                    <TranscriptPanel
                        segments={segments}
                        currentSegmentId={currentSegmentId}
                        onSeek={handleSeek}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
