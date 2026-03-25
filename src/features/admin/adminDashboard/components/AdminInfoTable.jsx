import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

export default function AdminInfoTable({ admins, isDark, onUpdate, onDelete }) {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ fullName: '', email: '' });

    const startEdit = (admin) => {
        setEditingId(admin.id);
        setEditForm({ fullName: admin.fullName, email: admin.email });
    };

    const handleSave = (id) => {
        onUpdate({ id, ...editForm });
        setEditingId(null);
    };

    return (
        <div className={`rounded-[2.5rem] p-8 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-40">Identity Directory</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                    <tr className="text-[9px] uppercase tracking-widest opacity-30">
                        <th className="pb-4 pl-4">Personnel</th>
                        <th className="pb-4">System Access</th>
                        <th className="pb-4 text-right pr-4">Control</th>
                    </tr>
                    </thead>
                    <tbody>
                    {admins?.map((admin) => (
                        <motion.tr
                            key={admin.id}
                            layout
                            className={`${isDark ? 'bg-white/[0.03]' : 'bg-slate-50/50'} group transition-all`}
                        >
                            <td className="py-4 pl-4 rounded-l-2xl">
                                {editingId === admin.id ? (
                                    <input
                                        className="bg-transparent border-b border-emerald-500/50 outline-none text-sm w-full"
                                        value={editForm.fullName}
                                        onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                                    />
                                ) : (
                                    <span className="text-sm font-medium">{admin.fullName}</span>
                                )}
                            </td>
                            <td className="py-4">
                                {editingId === admin.id ? (
                                    <input
                                        className="bg-transparent border-b border-emerald-500/50 outline-none text-sm w-full"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    />
                                ) : (
                                    <span className="text-xs opacity-50 font-mono">{admin.email}</span>
                                )}
                            </td>
                            <td className="py-4 pr-4 text-right rounded-r-2xl">
                                <div className="flex justify-end gap-4">
                                    {editingId === admin.id ? (
                                        <>
                                            <button onClick={() => handleSave(admin.id)} className="text-emerald-500"><FiCheck size={16}/></button>
                                            <button onClick={() => setEditingId(null)} className="text-red-400"><FiX size={16}/></button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEdit(admin)} className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity"><FiEdit2 size={14}/></button>
                                            <button onClick={() => onDelete(admin.id)} className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"><FiTrash2 size={14}/></button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}