import React, { useState } from 'react';
import { Leaf, Zap, Sprout } from 'lucide-react';

import DashboardHeader from './dashboard/DashboardHeader';
import ScoreCard from './dashboard/ScoreCard';
import VisualMarkersCard from './dashboard/VisualMarkersCard';
import TreatmentPathGrid from './dashboard/TreatmentsPathGrid.jsx';
import TreatmentInfoModal from './TreatmentInfoModal';

export default function ResultsDashboard({ isDark, aiResults, handleNavigate }) {
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    if (!aiResults) return null;

    // Treatment Data Definitions
    const pathData = {
        Natural: {
            id: 'Natural', t: 'Natural', d: 'Botanical Repair', icon: <Leaf />, color: 'emerald',
            info: 'Pure plant-based extracts designed to heal the skin barrier naturally.',
            longInfo: 'The Natural pathway relies on cold-pressed seed oils, botanical extracts, and gentle hydration to repair the acid mantle of your skin without causing micro-tears or chemical burns.',
            benefits: ["Strengthens natural skin barrier", "Eco-friendly and sustainable", "Zero synthetic fragrances or dyes"],
            warnings: ["Results may take 4-6 weeks to become visible", "Patch test required for severe pollen allergies"]
        },
        Chemical: {
            id: 'Chemical', t: 'Chemical', d: 'Molecular Science', icon: <Zap />, color: 'blue',
            info: 'Clinically proven active compounds that target deep cellular repair.',
            longInfo: 'The Chemical pathway utilizes lab-synthesized active ingredients (like AHAs, BHAs, and Retinoids) engineered to penetrate the dermal layers and trigger rapid cellular turnover.',
            benefits: ["Fast, clinically proven results", "Effectively targets stubborn acne & hyperpigmentation", "Stimulates deep collagen production"],
            warnings: ["May cause initial 'purging' or peeling", "Strict daily SPF 50+ application is mandatory"]
        },
        Ayurvedic: {
            id: 'Ayurvedic', t: 'Ayurvedic', d: 'Vedic Wisdom', icon: <Sprout />, color: 'amber',
            info: 'Time-tested herbal remedies focused on long-term detoxification.',
            longInfo: 'The Ayurvedic pathway focuses on balancing your internal doshas using ancient herbal combinations (like Turmeric, Neem, and Sandalwood) to detoxify the blood and clear the skin from the inside out.',
            benefits: ["Deep holistic detoxification", "Reduces chronic inflammation naturally", "Balances overall skin oil production"],
            warnings: ["Strong natural herbal scents", "Requires strict adherence to application techniques (Lepas)"]
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-5 duration-700">

            <DashboardHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScoreCard isDark={isDark} healthScore={aiResults.healthScore} />
                <VisualMarkersCard isDark={isDark} markers={aiResults.markers} />
            </div>

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