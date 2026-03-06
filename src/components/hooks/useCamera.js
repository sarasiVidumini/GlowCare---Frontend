import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to handle camera stream for GlowCare AI Analysis.
 * Supports light/dark mode transitions and clean resource disposal.
 */
export const useCamera = () => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    // Initialize the camera stream
    const startCamera = useCallback(async () => {
        setError(null);
        setIsReady(false);

        const constraints = {
            video: {
                facingMode: 'user', // Selfie camera for skin analysis
                width: { ideal: 1280 },
                height: { ideal: 720 },
                aspectRatio: { ideal: 1 } // Square aspect ratio fits our reticle better
            },
            audio: false,
        };

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                // Ensure metadata is loaded before signaling readiness
                videoRef.current.onloadedmetadata = () => {
                    setIsReady(true);
                };
            }
        } catch (err) {
            console.error("GlowCare Camera Error:", err);
            setError(err.name === 'NotAllowedError'
                ? "Camera access denied. Please enable permissions."
                : "Could not initialize camera.");
        }
    }, []);

    // Stop the camera and release tracks
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsReady(false);
        }
    }, [stream]);

    // Capture a frame for "Visual Feature Extraction" (OpenCV/TensorFlow)
    const captureFrame = useCallback(() => {
        if (!videoRef.current || !isReady) return null;

        setIsCapturing(true);
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Simulate a brief delay for "processing"
        setTimeout(() => setIsCapturing(false), 500);

        return canvas.toDataURL('image/jpeg', 0.9);
    }, [isReady]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return {
        videoRef,
        isReady,
        isCapturing,
        error,
        startCamera,
        stopCamera,
        captureFrame
    };
};