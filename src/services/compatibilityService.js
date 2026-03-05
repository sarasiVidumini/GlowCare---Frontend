import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/v1/compatibility";

// --- LOCAL SAFETY DATA (BACKUP එකක් විදිහට) ---
const LOCAL_CONFLICTS = {
    "Retinol": ["Vitamin C", "AHA", "BHA", "Salicylic Acid"],
    "Vitamin C": ["Retinol", "AHA", "BHA"],
    "AHA": ["Retinol", "Vitamin C"],
    "BHA": ["Retinol", "Vitamin C"],
    "Salicylic Acid": ["Retinol"]
};

/**
 * Smart Safety Checker
 * 1. මුලින්ම Backend එකෙන් Check කරයි.
 * 2. Backend එක වැඩ නැත්නම් Local Logic එකෙන් Check කරයි.
 */
export const checkProductSafety = async (newName, currentProducts) => {
    try {
        // 1. BACKEND CALL
        // සටහන: currentProducts කියන්නේ Array එකක් [ "Retinol", "AHA" ] වගේ
        const response = await axios.post(`${API_BASE_URL}/validate`, {
            productName: newName,
            routineProducts: currentProducts
        });

        // Backend එකෙන් කෙලින්ම Data එක එවනවා නම්
        if (response.data && response.data.hasConflict) {
            return response.data;
        }

    } catch (error) {
        console.warn("Backend API not reachable, switching to local safety check...");
    }

    // 2. LOCAL FALLBACK LOGIC (Backend වැඩ නැති වෙලාවට හෝ fail වූ විට)
    let foundConflict = null;

    // Routine එකේ තියෙන හැම product එකක්ම අලුත් product එක එක්ක බලනවා
    for (const product of currentProducts) {
        // Case-insensitive check එකක් කරමු (අකුරු කැපිටල්/සිම්පල් ගැටලු නැති වෙන්න)
        const existingProd = product.trim();
        const addingProd = newName.trim();

        if (LOCAL_CONFLICTS[addingProd] && LOCAL_CONFLICTS[addingProd].includes(existingProd)) {
            foundConflict = existingProd;
            break;
        }
    }

    if (foundConflict) {
        return {
            hasConflict: true,
            conflictType: "Ingredient Clash",
            severity: "High",
            reason: `${newName} සහ ${foundConflict} එකට පාවිච්චි කිරීමෙන් ඔබේ සම තදින් රතු වීම හෝ දැවිල්ල ඇති විය හැක.`,
            alternatives: [
                { name: "Hyaluronic Acid", benefit: "Hydrating & Safe" },
                { name: "Niacinamide", benefit: "Soothing" }
            ]
        };
    }

    // කිසිම ගැටලුවක් නැත්නම්
    return { hasConflict: false };
};