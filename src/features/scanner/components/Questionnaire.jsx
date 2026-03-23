import React from 'react';
import { ArrowRight, Activity, Droplets, Sun } from 'lucide-react';

export default function Questionnaire({ isDark, answers, setAnswers, onNext }) {
    const questions = [
        {
            id: 'feel',
            icon: <Droplets size={18} />,
            q: "How does your skin feel by mid-day?",
            options: ["Oily & Shiny", "Tight & Dry", "Normal / Combination", "Sensitive & Red"]
        },
        {
            id: 'concern',
            icon: <Activity size={18} />,
            q: "What is your primary visual concern?",
            options: ["Active Breakouts / Acne", "Dark Spots / Pigmentation", "Uneven Texture / Fine Lines", "General Maintenance"]
        },
        {
            id: 'exposure',
            icon: <Sun size={18} />,
            q: "Average daily sun exposure?",
            options: ["Minimal (Indoors)", "Moderate (1-2 hours)", "High (Outdoor worker)"]
        }
    ];

    const isComplete = answers.feel && answers.concern && answers.exposure;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight">Digital <span className="text-emerald-500">Assessment.</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-2">Establish Subjective Baseline</p>
            </div>

            <div className="space-y-6">
                {questions.map((question) => (
                    <div key={question.id} className={`p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">{question.icon}</div>
                            <h3 className="font-black uppercase tracking-widest text-[11px]">{question.q}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {question.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setAnswers({ ...answers, [question.id]: opt })}
                                    className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                        answers[question.id] === opt
                                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                                            : isDark ? 'bg-transparent border-white/10 hover:border-emerald-500/50' : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                disabled={!isComplete}
                onClick={onNext}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 ${
                    isComplete ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-xl shadow-emerald-500/20' : 'bg-slate-500/20 text-slate-500 cursor-not-allowed'
                }`}
            >
                Proceed to Visual Scan <ArrowRight size={16} />
            </button>
        </div>
    );
}