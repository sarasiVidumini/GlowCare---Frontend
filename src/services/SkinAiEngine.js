import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, Zap, Thermometer, RefreshCw, Sparkles, Activity } from 'lucide-react';
import useAnalysisStore from '../store/analysisStore';
import { calculateSkinScore, getScoreStatus } from '../utils/scoreCalculator'; // Import the new utility

const SkinAiEngine = () => {
    const {
        lastAnalysis,
        isAnalyzing,
        setAnalyzing,
        setAnalysisResults,
        error,
        setError,
        clearAnalysis
    } = useAnalysisStore();

    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            executeAnalysis(file);
        }
    };

    const executeAnalysis = async (file) => {
        setAnalyzing(true);

        try {
            setTimeout(() => {
                const rawResults = {
                    skinType: "Combination",
                    hydration: "42%",
                    concerns: ["Slight Redness", "Clogged Pores"],
                    climateAdvice: "High humidity detected in Sri Lanka. Use a lightweight gel-based moisturizer."
                };

                // Calculate the score using your utility
                const finalScore = calculateSkinScore(rawResults);
                const status = getScoreStatus(finalScore);

                // Save to Zustand with the calculated score data
                setAnalysisResults({
                    ...rawResults,
                    score: finalScore,
                    statusLabel: status.label,
                    statusColor: status.color
                });
            }, 3000);
        } catch (err) {
            setError("Analysis failed. Please try again.");
        }
    };

    const handleReset = () => {
        setPreviewImage(null);
        clearAnalysis();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-blue-600 w-6 h-6" />
                        <h1 className="text-3xl font-extrabold text-slate-800">GlowCare <span className="text-blue-600">AI Engine</span></h1>
                    </div>
                    <p className="text-slate-500">Precision analysis for climate-aware skin routines</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
                        {!previewImage ? (
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="w-full h-64 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all duration-300 group"
                            >
                                <div className="bg-blue-50 p-4 rounded-full group-hover:scale-110 transition-transform">
                                    <Camera className="w-10 h-10 text-blue-500" />
                                </div>
                                <p className="text-slate-600 font-semibold mt-4">Upload or Take Photo</p>
                                <p className="text-xs text-slate-400 mt-1">Frontal face view works best</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full">
                                <img src={previewImage} alt="Skin Preview" className="w-full h-64 object-cover rounded-3xl shadow-inner" />

                                {isAnalyzing && (
                                    <div className="absolute inset-0 z-10 overflow-hidden rounded-3xl">
                                        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px]"></div>
                                        <div className="w-full h-1.5 bg-blue-400 shadow-[0_0_20px_#60a5fa] animate-scan absolute z-20"></div>
                                    </div>
                                )}

                                <button
                                    onClick={handleReset}
                                    className="mt-6 flex items-center justify-center gap-2 mx-auto text-sm text-slate-400 font-medium hover:text-red-500 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Scan another photo
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                        />
                    </div>

                    {/* Results Section */}
                    <div className="space-y-4">
                        {!lastAnalysis && !isAnalyzing && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8 bg-slate-100/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                <ShieldCheck className="w-16 h-16 mb-4 opacity-10" />
                                <p className="max-w-[200px]">Upload a photo to see your AI-generated skin report</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="animate-pulse space-y-4">
                                <div className="h-24 bg-white rounded-3xl w-full"></div>
                                <div className="h-48 bg-white rounded-3xl w-full"></div>
                            </div>
                        )}

                        {lastAnalysis && !isAnalyzing && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-700">
                                {/* Primary Result Card with Score */}
                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-[2rem] shadow-lg shadow-blue-200 flex justify-between items-start">
                                    <div>
                                        <p className="text-blue-100 text-xs uppercase tracking-[0.1em] font-bold mb-1">Skin Health Score</p>
                                        <h3 className="text-5xl font-black mb-2">{lastAnalysis.score}</h3>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                                            <Activity className="w-3 h-3" />
                                            {lastAnalysis.statusLabel}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-blue-100 text-xs uppercase tracking-[0.1em] font-bold mb-1">Type</p>
                                        <p className="text-xl font-bold">{lastAnalysis.skinType}</p>
                                    </div>
                                </div>

                                {/* Insights Grid */}
                                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center text-sm md:text-base">
                                        <Thermometer className="w-5 h-5 mr-2 text-orange-500" />
                                        Climate-Aware Insight
                                    </h4>
                                    <p className="text-slate-600 text-sm leading-relaxed italic">
                                        "{lastAnalysis.climateAdvice}"
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-3 text-sm md:text-base">Key Skin Concerns</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {lastAnalysis.concerns.map((tag, i) => (
                                            <span key={i} className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
                .animate-scan {
                    animation: scan 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default SkinAiEngine;