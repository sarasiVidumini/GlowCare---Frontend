import React, { useRef } from 'react';
import { Camera, ScanFace } from 'lucide-react';

export default function ImageCapture({ isDark, image, handleImageUpload }) {
    const fileInputRef = useRef(null);

    return (
        <div className="space-y-8 text-center animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
            <div>
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight">Visual <span className="text-emerald-500">Extraction.</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-2 text-emerald-500">AI Computer Vision Initialized</p>
            </div>

            <div className={`p-6 rounded-[2rem] border text-left mb-8 ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-emerald-50 border-emerald-100'}`}>
                <h4 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2"><ScanFace size={16} className="text-emerald-500"/> Scan Requirements:</h4>
                <ul className="text-[10px] font-bold opacity-60 uppercase tracking-wider space-y-1 ml-6 list-disc">
                    <li>High-resolution well-lit selfie.</li>
                    <li>No makeup or heavy filters.</li>
                    <li>Ensure face is clearly visible for Acne & Pigmentation mapping.</li>
                </ul>
            </div>

            <div
                onClick={() => fileInputRef.current.click()}
                className={`group relative max-w-xl mx-auto h-[380px] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${isDark ? 'bg-white/[0.02] border-emerald-500/20 hover:border-emerald-500' : 'bg-white border-emerald-500/20 shadow-xl'}`}
            >
                {image ? (
                    <>
                        <img src={image} className="w-full h-full object-cover grayscale opacity-50" alt="Preview" />
                        <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay"></div>
                        <div className="absolute font-black text-2xl uppercase tracking-widest text-white drop-shadow-lg">Image Captured</div>
                    </>
                ) : (
                    <>
                        <div className="p-6 rounded-full bg-emerald-500/10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                            <Camera size={50} strokeWidth={1.5} />
                        </div>
                        <div className="text-center px-6">
                            <p className="text-[12px] font-black uppercase tracking-widest text-emerald-500 mb-1">Upload Optical Data</p>
                            <p className="text-[9px] uppercase opacity-40 font-bold italic tracking-widest text-center">Click to browse • RAW • JPG • PNG</p>
                        </div>
                    </>
                )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>
    );
}