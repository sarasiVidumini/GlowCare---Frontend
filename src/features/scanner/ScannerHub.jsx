import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import FallingLeaves from '../../components/ui/FallingLeaves';
import BodyPartSelector from '../scanner/components/BodyPartSelector.jsx';
import Questionnaire from './components/Questionnaire';
import ProcessingOverlay from './components/ProcessingOverlay';
import ResultsDashboard from './components/ResultDashBoard.jsx';

export default function ScannerHub({ isDark }) {
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [bodyPart, setBodyPart] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [aiResults, setAiResults] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    // 🛡️ HELPER: Guarantees the token is perfectly clean
    const getCleanToken = () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return null;
        return token.replace(/^"|"$/g, '').trim(); // Removes sneaky quotes and spaces
    };

    const handleBodyPartSelect = async (part) => {
        setBodyPart(part);

        try {
            const token = getCleanToken();
            if (!token) throw new Error("No token found");

            const res = await axios.get(`http://localhost:8080/api/v1/analysis/questions/${part}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setQuestions(res.data);
            setStep(1);
        } catch (error) {
            console.error("Failed to fetch questions", error);
            alert("Session Expired or Unauthorized. Please log out and log back in.");
            // Optional: navigate('/'); to force them to login
        }
    };

    const handleAnalyze = async () => {
        setIsScanning(true);
        setScanProgress(20);

        try {
            const token = getCleanToken();
            if (!token) throw new Error("No token found");

            const payload = {
                bodyPart: bodyPart,
                answers: answers
            };

            setScanProgress(50);

            const res = await axios.post('http://localhost:8080/api/v1/analysis/analyze', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setScanProgress(90);

            const parsedResults = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

            setAiResults(parsedResults);
            setScanProgress(100);

            setTimeout(() => {
                setIsScanning(false);
                setStep(2);
            }, 500);

        } catch (error) {
            console.error("Analysis Failed", error);
            alert("AI Analysis failed. Your session may have expired.");
            setIsScanning(false);
        }
    };

    const handleNavigate = (pathId) => {
        navigate('/timeline', { state: { path: pathId, isDark } });
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-all duration-1000 relative overflow-hidden ${isDark ? 'bg-[#030303] text-white' : 'bg-[#FDFDFD] text-slate-900'}`}>
            <FallingLeaves isDark={isDark} />
            <ProcessingOverlay isDark={isDark} isScanning={isScanning} scanProgress={scanProgress} />

            <main className="flex-1 flex items-center justify-center p-6 relative z-10 mt-16">
                <div className="max-w-6xl w-full">
                    {step === 0 && <BodyPartSelector isDark={isDark} onSelect={handleBodyPartSelect} />}
                    {step === 1 && !isScanning && (
                        <Questionnaire
                            isDark={isDark}
                            questions={questions}
                            answers={answers}
                            setAnswers={setAnswers}
                            onSubmit={handleAnalyze}
                        />
                    )}
                    {step === 2 && <ResultsDashboard isDark={isDark} aiResults={aiResults} handleNavigate={handleNavigate} />}
                </div>
            </main>
        </div>
    );
}