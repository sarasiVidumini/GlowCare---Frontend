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

export const INITIAL_DB = {
    Natural: {
        Face: {
            morning: [{name: "Honey Cleanser", stepTime: "07:00 AM"}, {name: "Rose Water Mist", stepTime: "07:15 AM"}, {name: "Aloe Vera Gel", stepTime: "07:30 AM"}],
            night: [{name: "Milk Wash", stepTime: "09:00 PM"}, {name: "Cucumber Toner", stepTime: "09:15 PM"}, {name: "Argan Oil Serum", stepTime: "09:30 PM"}]
        },
        Hair: { morning: [{name: "Rosemary Water", stepTime: "06:30 AM"}], night: [{name: "Coconut Oil Soak", stepTime: "10:00 PM"}] },
        Hands: { morning: [{name: "Lemon Scrub", stepTime: "08:30 AM"}], night: [{name: "Beeswax Wrap", stepTime: "09:45 PM"}] },
        Leg: { morning: [{name: "Dry Brush", stepTime: "06:00 AM"}], night: [{name: "Epsom Salt Soak", stepTime: "08:30 PM"}] }
    },
    Chemical: {
        Face: {
            morning: [{name: "Salicylic Cleanser", stepTime: "07:30 AM"}, {name: "Vitamin C Serum", stepTime: "07:45 AM"}, {name: "SPF 50+", stepTime: "08:30 AM"}],
            night: [{name: "Oil Cleanse", stepTime: "09:00 PM"}, {name: "Retinol 0.5%", stepTime: "09:30 PM"}, {name: "Ceramide Cream", stepTime: "10:00 PM"}]
        },
        Hair: { morning: [{name: "Minoxidil Spray", stepTime: "08:00 AM"}], night: [{name: "Stem Cell Serum", stepTime: "10:00 PM"}] },
        Hands: { morning: [{name: "AHA Cleanser", stepTime: "07:00 AM"}], night: [{name: "Retinoid Cream", stepTime: "10:00 PM"}] },
        Leg: { morning: [{name: "BHA Body Wash", stepTime: "06:30 AM"}], night: [{name: "Lactic Acid Lotion", stepTime: "09:00 PM"}] }
    },
    Ayurvedic: {
        Face: {
            morning: [{name: "Ubtan Wash", stepTime: "06:00 AM"}, {name: "Saffron Mist", stepTime: "06:15 AM"}, {name: "Sandalwood Paste", stepTime: "07:00 AM"}],
            night: [{name: "Triphala Wash", stepTime: "09:30 PM"}, {name: "Kumkumadi Oil", stepTime: "10:00 PM"}]
        },
        Hair: { morning: [{name: "Brahmi Oil", stepTime: "06:00 AM"}], night: [{name: "Bhringraj Oil", stepTime: "09:00 PM"}] },
        Hands: { morning: [{name: "Turmeric Scrub", stepTime: "08:00 AM"}], night: [{name: "Almond Lepa", stepTime: "09:30 PM"}] },
        Leg: { morning: [{name: "Abhyanga Oil", stepTime: "05:30 AM"}], night: [{name: "Ashwagandha Paste", stepTime: "09:00 PM"}] }
    }
};