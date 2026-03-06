import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * GlowCare Analysis Store
 * Manages the global state for the Skin AI Engine.
 */
const useAnalysisStore = create(
    persist(
        (set, get) => ({
            // --- State ---
            lastAnalysis: null,       // Stores the most recent scan result object
            isAnalyzing: false,       // Loading state for the scanning UI
            history: [],              // Stores past 10 scans for progress tracking
            error: null,              // Error messages for UI feedback

            // --- Actions ---

            // Toggle analyzing state and clear previous errors
            setAnalyzing: (status) => set({
                isAnalyzing: status,
                error: status ? null : get().error
            }),

            // Save successful analysis results
            setAnalysisResults: (results) => set((state) => ({
                lastAnalysis: results,
                isAnalyzing: false,
                // Prepend to history and keep only the latest 10 records
                history: [
                    { ...results, timestamp: new Date().toISOString() },
                    ...state.history
                ].slice(0, 10),
                error: null,
            })),

            // Set error message if the scan fails
            setError: (message) => set({
                error: message,
                isAnalyzing: false
            }),

            // Clear current view (useful when starting a fresh scan)
            clearAnalysis: () => set({
                lastAnalysis: null,
                error: null
            }),

            // Reset everything (useful for logout)
            resetStore: () => set({
                lastAnalysis: null,
                history: [],
                error: null,
                isAnalyzing: false
            }),
        }),
        {
            name: 'glowcare-analysis-storage', // Key for LocalStorage
            storage: createJSONStorage(() => localStorage),
            // Only persist the results and history, not the loading/error states
            partialize: (state) => ({
                lastAnalysis: state.lastAnalysis,
                history: state.history
            }),
        }
    )
);

export default useAnalysisStore;