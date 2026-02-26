import {forwardRef} from "react";

interface VideoPlayerProps {
    src: string | null;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
    ({src}, ref) => {
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
            />
        );
    }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
