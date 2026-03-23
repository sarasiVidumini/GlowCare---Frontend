import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FallingLeaves from '../../components/ui/FallingLeaves';
import Questionnaire from './components/Questionnaire';
import ImageCapture from './components/ImageCapture';
import ProcessingOverlay from './components/ProcessingOverlay';
import ResultsDashboard from './components/ResultDashBoard.jsx';

export default function ScannerHub({ isDark }) {
    const navigate = useNavigate();

    // Flow State: 0 = Questions, 1 = Camera, 2 = Results
    const [step, setStep] = useState(0);

    // Data State
    const [answers, setAnswers] = useState({ feel: '', concern: '', exposure: '' });
    const [image, setImage] = useState(null);
    const [aiResults, setAiResults] = useState(null);

    // UI State
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            analyzeData(file);
        }
    };

    const analyzeData = (imageFile) => {
        setIsScanning(true);

        // --- BACKEND INTEGRATION POINT ---
        // TODO: Create a FormData object.
        // formData.append('image', imageFile);
        // formData.append('questionnaire', JSON.stringify(answers));
        // await axios.post('http://localhost:8080/api/ai/analyze', formData)

        // Simulated Progress & Backend Response
        let progress = 0;
        const interval = setInterval(() => {
            progress += 15;
            setScanProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);

                // Simulated Spring Boot Response based on questionnaire logic
                let suggestion = 'Natural';
                if (answers.concern.includes('Acne')) suggestion = 'Chemical';
                if (answers.concern.includes('Texture') || answers.exposure.includes('High')) suggestion = 'Ayurvedic';

                setAiResults({
                    healthScore: 78,
                    suggestedPath: suggestion,
                    markers: {
                        acne: answers.concern.includes('Acne') ? 'High' : 'Low',
                        pigment: answers.exposure.includes('High') ? 'Moderate' : 'Minimal',
                        texture: answers.feel.includes('Dry') ? 'Dehydrated' : 'Balanced'
                    }
                });

                setIsScanning(false);
                setStep(2); // Move to Results
            }
        }, 400);
    };

    const handleNavigate = (pathId) => {
        // Pass the chosen path and the AI data to the Routine Timeline!
        navigate('/timeline', { state: { path: pathId, isDark } });
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-all duration-1000 relative overflow-hidden ${isDark ? 'bg-[#030303] text-white' : 'bg-[#FDFDFD] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />
            <ProcessingOverlay isDark={isDark} isScanning={isScanning} scanProgress={scanProgress} />

            <main className="flex-1 flex items-center justify-center p-6 relative z-10 mt-16">
                <div className="max-w-6xl w-full">
                    {step === 0 && (
                        <Questionnaire isDark={isDark} answers={answers} setAnswers={setAnswers} onNext={() => setStep(1)} />
                    )}

                    {step === 1 && !isScanning && (
                        <ImageCapture isDark={isDark} image={image} handleImageUpload={handleImageUpload} />
                    )}

                    {step === 2 && (
                        <ResultsDashboard isDark={isDark} aiResults={aiResults} handleNavigate={handleNavigate} />
                    )}
                </div>
            </main>
        </div>
    );
}