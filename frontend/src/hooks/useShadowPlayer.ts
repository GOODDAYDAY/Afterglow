import {useCallback, useEffect, useRef, useState} from "react";
import type {FeatureToggleConfig, LoopCount, Segment, ShadowState} from "../types";

export interface ShadowPlayerActions {
    currentSegmentId: number | null;
    shadowState: ShadowState;
    currentLoopIteration: number;
    gapRemaining: number;
    playbackRate: number;
    replayCurrent: () => void;
    goToNextSegment: () => void;
    goToPrevSegment: () => void;
    togglePlayPause: () => void;
    speedUp: () => void;
    speedDown: () => void;
    seekToSegment: (segmentId: number) => void;
}

export function useShadowPlayer(
    videoRef: React.RefObject<HTMLVideoElement | null>,
    segments: Segment[],
    features: FeatureToggleConfig,
    loopCount: LoopCount,
): ShadowPlayerActions {
    const [currentSegmentId, setCurrentSegmentId] = useState<number | null>(null);
    const [shadowState, setShadowState] = useState<ShadowState>("idle");
    const [currentLoopIteration, setCurrentLoopIteration] = useState(0);
    const [gapRemaining, setGapRemaining] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1.0);

    // Mutable refs to avoid stale closures
    const segmentsRef = useRef(segments);
    const featuresRef = useRef(features);
    const loopCountRef = useRef(loopCount);
    const currentSegIdRef = useRef<number | null>(null);
    const loopIterRef = useRef(0);
    const gapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const handlingBoundaryRef = useRef(false);

    // Sync refs
    useEffect(() => {
        segmentsRef.current = segments;
    }, [segments]);
    useEffect(() => {
        featuresRef.current = features;
    }, [features]);
    useEffect(() => {
        loopCountRef.current = loopCount;
    }, [loopCount]);

    // Clear only timers, do NOT reset boundary guard
    const clearTimers = useCallback(() => {
        if (gapTimerRef.current) {
            clearTimeout(gapTimerRef.current);
            gapTimerRef.current = null;
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
        setGapRemaining(0);
    }, []);

    // Clear timers AND reset boundary guard (for user-initiated actions only)
    const cancelGap = useCallback(() => {
        clearTimers();
        handlingBoundaryRef.current = false;
    }, [clearTimers]);

    const findSegmentAtTime = useCallback((time: number): Segment | undefined => {
        return segmentsRef.current.find((s) => time >= s.start && time < s.end);
    }, []);

    const findSegmentById = useCallback((id: number): Segment | undefined => {
        return segmentsRef.current.find((s) => s.id === id);
    }, []);

    // Seek to a segment's start and play.
    // Keeps handlingBoundaryRef=true during seek to prevent timeupdate
    // from firing at the old position. Releases guard on 'seeked' event.
    const playSegment = useCallback((seg: Segment) => {
        const video = videoRef.current;
        if (!video) return;
        clearTimers();
        handlingBoundaryRef.current = true;
        video.currentTime = seg.start;
        video.play();
        currentSegIdRef.current = seg.id;
        setCurrentSegmentId(seg.id);
        setShadowState("playing");
        // Release boundary guard only after seek completes
        const onSeeked = () => {
            handlingBoundaryRef.current = false;
            video.removeEventListener("seeked", onSeeked);
        };
        video.addEventListener("seeked", onSeeked);
    }, [videoRef, clearTimers]);

    const startGap = useCallback((duration: number, onDone: () => void) => {
        const video = videoRef.current;
        if (!video) return;
        video.pause();
        setShadowState("gapping");
        setGapRemaining(Math.round(duration * 10) / 10);

        countdownRef.current = setInterval(() => {
            setGapRemaining((prev) => {
                const next = Math.round((prev - 0.1) * 10) / 10;
                return next > 0 ? next : 0;
            });
        }, 100);

        gapTimerRef.current = setTimeout(() => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            setGapRemaining(0);
            gapTimerRef.current = null;
            onDone();
        }, duration * 1000);
    }, [videoRef]);

    const advanceToNext = useCallback((currentSeg: Segment) => {
        const segs = segmentsRef.current;
        const idx = segs.findIndex((s) => s.id === currentSeg.id);
        if (idx < 0 || idx >= segs.length - 1) {
            // Last segment — stop
            setShadowState("paused");
            handlingBoundaryRef.current = false;
            return;
        }
        const nextSeg = segs[idx + 1];
        loopIterRef.current = 0;
        setCurrentLoopIteration(0);
        playSegment(nextSeg);
        // handlingBoundaryRef stays true — playSegment's seeked handler will release it
    }, [playSegment]);

    const handleSegmentEnd = useCallback((seg: Segment) => {
        if (handlingBoundaryRef.current) return;
        handlingBoundaryRef.current = true;

        const f = featuresRef.current;
        const maxLoops = loopCountRef.current;
        const gapDuration = (seg.end - seg.start) * 1.2;

        if (f.singleLoop && f.smartGap) {
            // Loop + Gap: play → gap → replay → gap → ... → advance
            loopIterRef.current++;
            setCurrentLoopIteration(loopIterRef.current);
            if (loopIterRef.current < maxLoops) {
                startGap(gapDuration, () => {
                    playSegment(seg);
                    // boundary guard stays true — seeked handler releases it
                });
            } else {
                startGap(gapDuration, () => advanceToNext(seg));
            }
        } else if (f.singleLoop && !f.smartGap) {
            // Loop only: replay N times → advance
            loopIterRef.current++;
            setCurrentLoopIteration(loopIterRef.current);
            if (loopIterRef.current < maxLoops) {
                playSegment(seg);
                // boundary guard stays true — seeked handler releases it
            } else {
                advanceToNext(seg);
            }
        } else if (!f.singleLoop && f.smartGap) {
            // Gap only: play → gap → advance
            startGap(gapDuration, () => advanceToNext(seg));
        } else {
            // Neither: continuous playback
            handlingBoundaryRef.current = false;
        }
    }, [startGap, playSegment, advanceToNext]);

    // Attach timeupdate listener
    useEffect(() => {
        const video = videoRef.current;
        if (!video || segmentsRef.current.length === 0) return;

        const onTimeUpdate = () => {
            if (handlingBoundaryRef.current) return;

            const time = video.currentTime;

            // FIRST: check if we've passed the end of the current segment.
            // This MUST happen before updating segment tracking, otherwise
            // contiguous segments cause the tracker to jump to the next
            // segment and reset the loop counter — preventing loop/gap
            // from ever firing.
            const curSeg = currentSegIdRef.current !== null
                ? findSegmentById(currentSegIdRef.current)
                : undefined;

            if (curSeg && time >= curSeg.end) {
                const f = featuresRef.current;
                if (f.singleLoop || f.smartGap) {
                    handleSegmentEnd(curSeg);
                    return;
                }
                // Neither feature active — fall through to update tracking
            }

            // THEN: track which segment we're currently in
            const seg = findSegmentAtTime(time);
            if (seg) {
                if (currentSegIdRef.current !== seg.id) {
                    currentSegIdRef.current = seg.id;
                    setCurrentSegmentId(seg.id);
                    loopIterRef.current = 0;
                    setCurrentLoopIteration(0);
                }
                setShadowState("playing");
            }
        };

        video.addEventListener("timeupdate", onTimeUpdate);
        return () => video.removeEventListener("timeupdate", onTimeUpdate);
    }, [videoRef, segments, findSegmentAtTime, findSegmentById, handleSegmentEnd]);

    // Sync playback rate to video element
    useEffect(() => {
        const video = videoRef.current;
        if (video) video.playbackRate = playbackRate;
    }, [videoRef, playbackRate]);

    const togglePlayPause = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        cancelGap();
        if (video.paused) {
            video.play();
            setShadowState("playing");
        } else {
            video.pause();
            setShadowState("paused");
        }
    }, [videoRef, cancelGap]);

    const replayCurrent = useCallback(() => {
        const seg = currentSegIdRef.current !== null
            ? findSegmentById(currentSegIdRef.current)
            : undefined;
        if (seg) {
            cancelGap();
            loopIterRef.current = 0;
            setCurrentLoopIteration(0);
            playSegment(seg);
        }
    }, [findSegmentById, cancelGap, playSegment]);

    const goToNextSegment = useCallback(() => {
        const segs = segmentsRef.current;
        if (segs.length === 0) return;
        cancelGap();
        const idx = currentSegIdRef.current !== null
            ? segs.findIndex((s) => s.id === currentSegIdRef.current)
            : -1;
        const nextIdx = idx < segs.length - 1 ? idx + 1 : idx;
        const nextSeg = segs[nextIdx >= 0 ? nextIdx : 0];
        loopIterRef.current = 0;
        setCurrentLoopIteration(0);
        playSegment(nextSeg);
    }, [cancelGap, playSegment]);

    const goToPrevSegment = useCallback(() => {
        const segs = segmentsRef.current;
        if (segs.length === 0) return;
        cancelGap();
        const idx = currentSegIdRef.current !== null
            ? segs.findIndex((s) => s.id === currentSegIdRef.current)
            : 0;
        const prevIdx = idx > 0 ? idx - 1 : 0;
        loopIterRef.current = 0;
        setCurrentLoopIteration(0);
        playSegment(segs[prevIdx]);
    }, [cancelGap, playSegment]);

    const speedUp = useCallback(() => {
        setPlaybackRate((prev) => {
            const next = Math.round((prev + 0.1) * 10) / 10;
            return Math.min(next, 3.0);
        });
    }, []);

    const speedDown = useCallback(() => {
        setPlaybackRate((prev) => {
            const next = Math.round((prev - 0.1) * 10) / 10;
            return Math.max(next, 0.3);
        });
    }, []);

    const seekToSegment = useCallback((segmentId: number) => {
        const seg = findSegmentById(segmentId);
        if (seg) {
            cancelGap();
            loopIterRef.current = 0;
            setCurrentLoopIteration(0);
            playSegment(seg);
        }
    }, [findSegmentById, cancelGap, playSegment]);

    // Clean up timers on unmount
    useEffect(() => {
        return () => clearTimers();
    }, [clearTimers]);

    return {
        currentSegmentId,
        shadowState,
        currentLoopIteration,
        gapRemaining,
        playbackRate,
        replayCurrent,
        goToNextSegment,
        goToPrevSegment,
        togglePlayPause,
        speedUp,
        speedDown,
        seekToSegment,
    };
}
