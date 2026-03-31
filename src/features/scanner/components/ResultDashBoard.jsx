import React, { useState } from 'react';
import { Leaf, Zap, Sprout, ShieldAlert, ActivitySquare, AlertCircle } from 'lucide-react';

import DashboardHeader from './dashboard/DashboardHeader';
import ScoreCard from './dashboard/ScoreCard';
import VisualMarkersCard from './dashboard/VisualMarkersCard';
import TreatmentPathGrid from './dashboard/TreatmentsPathGrid.jsx'; // Assuming you have this component
import TreatmentInfoModal from './TreatmentInfoModal';

export default function ResultsDashboard({ isDark, aiResults, handleNavigate }) {
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    if (!aiResults) return null;

    const confidencePct = Math.round((aiResults.confidence || 0.8) * 100);

    const pathData = {
        Natural: { id: 'Natural', t: 'Natural', d: 'Botanical Repair', icon: <Leaf />, color: 'emerald' },
        Chemical: { id: 'Chemical', t: 'Chemical', d: 'Molecular Science', icon: <Zap />, color: 'blue' },
        Ayurvedic: { id: 'Ayurvedic', t: 'Ayurvedic', d: 'Vedic Wisdom', icon: <Sprout />, color: 'amber' }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-5 duration-700">

            <DashboardHeader />

            {/* Top Grid: Main Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard isDark={isDark} healthScore={aiResults.healthScore} />
                <VisualMarkersCard isDark={isDark} markers={aiResults.markers} />
            </div>

            {/* NEW: Clinical AI Insights Section */}
            <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#121214] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black italic uppercase tracking-tighter text-xl flex items-center gap-2">
                        <ActivitySquare className="text-emerald-500" size={24} />
                        AI Clinical Summary
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10">
                        <ShieldAlert size={12} className="text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">
                            Confidence: {confidencePct}%
                        </span>
                    </div>
                </div>

                <p className={`text-sm font-medium leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "{aiResults.notes || "No additional clinical notes provided by the model."}"
                </p>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">Priority Concerns Detected</p>
                    <div className="flex flex-wrap gap-2">
                        {aiResults.priorityConcerns?.map((concern, idx) => (
                            <div key={idx} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                isDark ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                                <AlertCircle size={12} />
                                {concern}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Treatment Paths */}
            <TreatmentPathGrid
                isDark={isDark}
                pathData={pathData}
                suggestedPath={aiResults.suggestedPath}
                setSelectedTreatment={setSelectedTreatment}
            />

            {/* Mount the Modal Overlay */}
            <TreatmentInfoModal
                isDark={isDark}
                treatment={selectedTreatment}
                onClose={() => setSelectedTreatment(null)}
                onProceed={handleNavigate}
            />
        </div>
    );
}