import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { useOutletContext } from 'react-router';
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '../lib/constants';

type UploadProps = {
    onComplete?: (base64Data: string) => void;
}

const Upload = ({ onComplete = () => undefined }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const { isSignedIn } = useOutletContext<AuthContext>();

    const clearProgressInterval = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    useEffect(() => () => clearProgressInterval(), []);

    const processFile = (files: FileList | null) => {
        if (!isSignedIn || !files?.length) return;

        const selectedFile = files[0];
        const reader = new FileReader();

        setFile(selectedFile);
        setProgress(0);

        reader.onload = () => {
            const base64Data = String(reader.result ?? '');
            if (!base64Data) return;

            clearProgressInterval();

            progressIntervalRef.current = setInterval(() => {
                setProgress((prevProgress) => {
                    const nextProgress = Math.min(prevProgress + PROGRESS_STEP, 100);

                    if (nextProgress === 100) {
                        clearProgressInterval();
                        setTimeout(() => onComplete(base64Data), REDIRECT_DELAY_MS);
                    }

                    return nextProgress;
                });
            }, PROGRESS_INTERVAL_MS);
        };

        reader.readAsDataURL(selectedFile);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;
        processFile(event.target.files);
        event.target.value = '';
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(false);
        processFile(event.dataTransfer.files);
    };

    return (
        <div className="upload">
            {
                !file ? (
                    <div
                        className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="drop-input"
                            accept=".jpg,.jpeg,.png"
                            disabled={!isSignedIn}
                            onChange={handleFileChange}
                        />

                        <div className="drop-content">
                            <div className="drop-icon">
                                <UploadIcon size={20} />
                            </div>
                            <p>
                                {isSignedIn ? "Click to upload or just drag and drop" : ("Sign in or sign up with Puter to upload")}
                            </p>
                            <p className="help">Maximum file size 50MB</p>
                        </div>
                    </div>
                ) : (
                    <div className="upload-status">
                        <div className="status-content">
                            <div className="status-icon">
                                {
                                    progress === 100 ? (
                                        <CheckCircle2 className="check" />
                                    ) : (
                                        <ImageIcon className="image" />
                                    )
                                }
                            </div>

                            <h3>{file.name}</h3>

                            <div className="progress">
                                <div className="bar" style={{ width: `${progress}%` }} />

                                <p className="status-text">
                                    {progress < 100 ? 'Analyzing Floor Plan...' : 'Redirecting...'}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Upload;