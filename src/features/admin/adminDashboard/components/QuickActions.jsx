import React from 'react';
import { RotateCcw, ShieldAlert, Zap } from 'lucide-react';

/**
 * QuickActions Component
 * Provides administrative system triggers.
 * * @param {function} onMaintenance - Function to trigger the backend cache reboot
 * @param {boolean} isDark - Current theme state
 */
export default function QuickActions({ onMaintenance, isDark }) {
    return (
        <div className="flex flex-col gap-4">
            <button
                onClick={onMaintenance}
                className="group w-full flex items-center justify-center gap-4 py-6 rounded-[2.5rem] bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-emerald-400 transition-all duration-300 shadow-xl shadow-emerald-500/20 active:scale-95"
            >
                <RotateCcw
                    size={18}
                    className="group-hover:rotate-180 transition-transform duration-700"
                />
                Reboot System Cache
            </button>

            {/* Additional Creative Action (Optional) */}
            <button
                className={`w-full flex items-center justify-center gap-4 py-6 rounded-[2.5rem] border font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 ${
                    isDark
                        ? 'border-white/10 text-white hover:bg-white/5'
                        : 'border-slate-200 text-slate-900 hover:bg-slate-50'
                }`}
            >
                <ShieldAlert size={18} className="text-orange-500" />
                Export Security Logs
            </button>
        </div>
    );
}