/**
 * GlowCare Score Calculator
 * Business logic to determine skin health metrics based on AI analysis.
 */

/**
 * Calculates a numerical skin health score (0-100)
 * @param {Object} analysisData
 * @returns {number}
 */
export const calculateSkinScore = (analysisData) => {
    // Start with a perfect score
    let score = 100;

    // 1. Hydration Analysis (e.g., "42%")
    const hydrationValue = parseInt(analysisData.hydration) || 50;
    if (hydrationValue < 30) {
        score -= 25; // Critical dehydration
    } else if (hydrationValue < 60) {
        score -= 12; // Mild dehydration
    }

    // 2. Concerns Penalty
    // Every detected concern (redness, pores, etc.) reduces health score
    const concernsCount = analysisData.concerns?.length || 0;
    score -= (concernsCount * 7);

    // 3. Climate Factor
    // High humidity or extreme heat adds stress to the calculation
    const advice = analysisData.climateAdvice?.toLowerCase() || "";
    if (advice.includes("high humidity") || advice.includes("heat")) {
        score -= 5;
    }

    // Ensure score stays within 0 - 100 range
    return Math.max(0, Math.min(100, score));
};

/**
 * Determines the status label and color theme based on the score
 * @param {number} score
 * @returns {Object} { label, color, feedback }
 */
export const getScoreStatus = (score) => {
    if (score >= 85) {
        return {
            label: "Excellent",
            color: "#10b981", // Emerald-500
            feedback: "Your skin barrier is strong and well-hydrated."
        };
    }
    if (score >= 70) {
        return {
            label: "Good",
            color: "#3b82f6", // Blue-500
            feedback: "Healthy skin, but watch out for minor environmental stressors."
        };
    }
    if (score >= 50) {
        return {
            label: "Fair",
            color: "#f59e0b", // Amber-500
            feedback: "Your skin needs more targeted hydration and protection."
        };
    }
    return {
        label: "Needs Care",
        color: "#ef4444", // Red-500
        feedback: "High sensitivity or dehydration detected. Adjust your routine."
    };
};
