import {forwardRef} from "react";

interface VideoPlayerProps {
    src: string | null;
    onTimeUpdate: (currentTime: number) => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
    ({src, onTimeUpdate}, ref) => {
        if (!src) {
            return (
                <div className="video-placeholder">
                    <p>Select a video file to begin</p>
                </div>
            );
        }

        return (
            <video
                ref={ref}
                className="video-player"
                src={src}
                controls
                onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
            />
        );
    }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
