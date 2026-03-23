import React, { useEffect } from 'react';

export default function GoogleAuth({ isDark, googleButtonRef, handleGoogleResponse }) {
    useEffect(() => {
        const isWebView = /wv|Version\/[\d\.]+.*Chrome/.test(navigator.userAgent) || (window.innerWidth === 0);

        if (!isWebView) {
            // Load the Google GSI script dynamically
            const script = document.createElement('script');
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.onload = () => {
                if (window.google) {
                    window.google.accounts.id.initialize({
                        client_id: "937933323614-nb2lkq6ulft6amcv41rmhd8gq71qn09e.apps.googleusercontent.com",
                        callback: handleGoogleResponse
                    });

                    // Render the button into the referenced div
                    if (googleButtonRef.current) {
                        window.google.accounts.id.renderButton(googleButtonRef.current, {
                            theme: isDark ? "filled_black" : "outline",
                            size: "large",
                            width: 320,
                            shape: "pill"
                        });
                    }
                }
            };
            document.head.appendChild(script);
        } else {
            console.warn("Google Sign In skipped: Detected Web View environment.");
        }
    }, [isDark, handleGoogleResponse, googleButtonRef]);

    return (
        <div className="w-full flex justify-center flex-col items-center">
            {/* The Google button renders inside this ref */}
            <div ref={googleButtonRef} className="min-h-[40px]"></div>

            {window.innerWidth === 0 && (
                <p className="text-[9px] text-red-400 font-bold mt-2">
                    Google Sign-In requires a standard browser
                </p>
            )}
        </div>
    );
}