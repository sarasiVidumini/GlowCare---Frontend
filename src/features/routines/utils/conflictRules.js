/**
 * CONFLICT_RULES
 * Logic for the GlowCare Smart Conflict Engine.
 * Cross-references active ingredients with Ayurvedic alternatives.
 */
export const CONFLICT_RULES = [
    {
        trigger: "Retinol",
        incompatibleWith: ["Vitamin C", "Salicylic Acid", "AHA", "BHA", "Glycolic Acid"],
        reason: "Mixing high-concentration acids with retinoids can cause severe skin barrier damage and chronic irritation.",
        alternative: "Sandalwood & Aloe Infusion",
        altType: "Ayurvedic Replacement"
    },
    {
        trigger: "Vitamin C",
        incompatibleWith: ["Copper Peptide", "Benzoyl Peroxide", "Retinol"],
        reason: "These ingredients neutralize each other's effectiveness or cause significant skin flushing.",
        alternative: "Rosehip & Saffron Serum",
        altType: "Natural Bio-Active"
    },
    {
        trigger: "Niacinamide",
        incompatibleWith: ["Vitamin C"],
        reason: "When layered, they can chemically react to form nicotinic acid, causing temporary redness.",
        alternative: "Neem & Turmeric Clarifying Water",
        altType: "Traditional Ayurvedic"
    }
];