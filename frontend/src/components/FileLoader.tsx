import {useRef} from "react";

interface FileLoaderProps {
    onFileSelect: (file: File, blobUrl: string) => void;
    fileName: string;
    statusLog: string;
    isTranscribing: boolean;
}

export default function FileLoader({
                                       onFileSelect,
                                       fileName,
                                       statusLog,
                                       isTranscribing,
                                   }: FileLoaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const blobUrl = URL.createObjectURL(file);
        onFileSelect(file, blobUrl);
    };

    return (
        <div className="file-loader">
            <button
                className="btn"
                onClick={() => inputRef.current?.click()}
                disabled={isTranscribing}
            >
                {fileName ? "Change Video" : "Select Video"}
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="video/*"
                onChange={handleChange}
                hidden
            />
            {statusLog && (
                <span className={`status-log ${isTranscribing ? "status-active" : ""}`}>
          {isTranscribing && <span className="spinner"/>}
                    {statusLog}
        </span>
            )}
        </div>
    );
}
