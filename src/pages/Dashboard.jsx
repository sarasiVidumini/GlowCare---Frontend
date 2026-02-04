import React, { useState } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("");

    const activeIngredients = [
        { name: "Salicylic Acid", type: "Chemical", safety: "Safe", clash: "Retinol" },
        { name: "Turmeric Extract", type: "Ayurvedic", safety: "Safe", clash: "None" },
        { name: "Niacinamide", type: "Chemical", safety: "Safe", clash: "Vitamin C" },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Daily Routine Dashboard</h1>
                    <p className="text-slate-500">Track your progress and check ingredient safety.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search ingredients..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-2 ring-skin-primary outline-none"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ingredient Filter Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Filter size={20} className="text-skin-primary" /> Active Ingredients in Your Routine
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="border-b border-slate-50 text-slate-400 text-sm">
                                <th className="pb-4 font-medium">Ingredient</th>
                                <th className="pb-4 font-medium">Type</th>
                                <th className="pb-4 font-medium">Potential Clash</th>
                            </tr>
                            </thead>
                            <tbody>
                            {activeIngredients.map((ing, i) => (
                                <tr key={i} className="border-b border-slate-50 last:border-0">
                                    <td className="py-4 font-bold text-slate-700">{ing.name}</td>
                                    <td className="py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full ${ing.type === 'Ayurvedic' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {ing.type}
                      </span>
                                    </td>
                                    <td className="py-4 text-sm text-skin-clinical flex items-center gap-1">
                                        {ing.clash !== "None" && <AlertCircle size={14} />} {ing.clash}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Morning/Night Progress Tracker */}
                <div className="bg-skin-primary text-white rounded-3xl p-8 shadow-lg shadow-skin-primary/20">
                    <h3 className="text-xl font-bold mb-6">Today's Schedule</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <input type="checkbox" className="w-5 h-5 accent-skin-secondary" />
                            <div>
                                <p className="font-bold">Morning Routine</p>
                                <p className="text-xs opacity-70">Natural Cleanser + Sunscreen</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <input type="checkbox" className="w-5 h-5 accent-skin-secondary" />
                            <div>
                                <p className="font-bold">Night Routine</p>
                                <p className="text-xs opacity-70">Ayurvedic Night Oil</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}