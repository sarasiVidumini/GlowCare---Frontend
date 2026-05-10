import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';

export default function Questionnaire({ isDark, questions, answers, setAnswers, onSubmit }) {
    // Check if user answered all dynamic questions
    const isComplete = questions.length > 0 && questions.every(q => answers[q.questionText] !== undefined);

    const handleOptionSelect = (questionText, option) => {
        setAnswers(prev => ({ ...prev, [questionText]: option }));
    };

    return (
        /* -mt-10 pulls the content up, pt-0 removes top padding */
        <div className="max-w-2xl mx-auto -mt-10 pt-0 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">

            {/* Header Section - Adjusted margins and spacing */}
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight leading-none">
                    Digital <span className="text-emerald-500">Assessment.</span>
                </h1>
            </div>

            <div className="space-y-6">
                {questions.map((question) => {
                    const optionsArray = typeof question.options === 'string' ? JSON.parse(question.options) : question.options;

                    return (
                        <div key={question.id} className={`p-6 rounded-[2rem] border transition-all ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40'}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Activity size={18} /></div>
                                <h3 className="font-black uppercase tracking-widest text-[11px]">{question.questionText}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {optionsArray.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => handleOptionSelect(question.questionText, opt)}
                                        className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                            answers[question.questionText] === opt
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg'
                                                : isDark ? 'bg-transparent border-white/10 hover:border-emerald-500/50' : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                disabled={!isComplete}
                onClick={onSubmit}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 ${
                    isComplete ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-xl shadow-emerald-500/20' : 'bg-slate-500/20 text-slate-500 cursor-not-allowed'
                }`}
            >
                Generate AI Analysis <ArrowRight size={16} />
            </button>
        </div>
    );
}