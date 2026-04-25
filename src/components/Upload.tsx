import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { useOutletContext } from 'react-router';
import {
    MAX_UPLOAD_FILE_SIZE_BYTES,
    MAX_UPLOAD_FILE_SIZE_MB,
    PROGRESS_INTERVAL_MS,
    PROGRESS_STEP,
    REDIRECT_DELAY_MS
} from '../lib/constants';

type UploadProps = {
    onComplete?: (base64Data: string) => void;
}

const Upload = ({ onComplete = () => undefined }: UploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const base64DataRef = useRef('');
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

    const { isSignedIn } = useOutletContext<AuthContext>();

    const clearProgressInterval = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const clearRedirectTimeout = () => {
        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
            redirectTimeoutRef.current = null;
        }
    };

    useEffect(() => () => {
        clearProgressInterval();
        clearRedirectTimeout();
    }, []);

    useEffect(() => {
        if (progress !== 100 || !base64DataRef.current) return;

        clearProgressInterval();
        clearRedirectTimeout();

        redirectTimeoutRef.current = setTimeout(() => {
            onComplete(base64DataRef.current);
        }, REDIRECT_DELAY_MS);
    }, [onComplete, progress]);

    const processFile = (files: FileList | null) => {
        if (!isSignedIn || !files?.length) return;

        const selectedFile = files[0];
        clearProgressInterval();
        clearRedirectTimeout();
        base64DataRef.current = '';
        setError(null);

        const isAllowedMimeType = ALLOWED_MIME_TYPES.includes(selectedFile.type);
        if (!isAllowedMimeType) {
            setFile(null);
            setProgress(0);
            setError('Please upload a JPG or PNG image.');
            return;
        }
        if (selectedFile.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
            setFile(null);
            setProgress(0);
            setError(`File is too large. Maximum size is ${MAX_UPLOAD_FILE_SIZE_MB}MB.`);
            return;
        }

        const reader = new FileReader();

        setFile(selectedFile);
        setProgress(0);

        reader.onload = () => {
            const base64Data = String(reader.result ?? '');
            if (!base64Data) return;
            base64DataRef.current = base64Data;

            clearProgressInterval();
            progressIntervalRef.current = setInterval(() => {
                setProgress((prevProgress) => Math.min(prevProgress + PROGRESS_STEP, 100));
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
                            <p className="help">Maximum file size {MAX_UPLOAD_FILE_SIZE_MB}MB</p>
                            {error ? <p className="help">{error}</p> : null}
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