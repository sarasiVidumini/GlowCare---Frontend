import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

export default function FallingLeaves({ isDark }) {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        const leafIcons = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100 + '%',
            delay: Math.random() * 12 + 's',
            duration: 18 + Math.random() * 12 + 's',
            size: 8 + Math.random() * 12 + 'px',
            swing: 20 + Math.random() * 30 + 'px'
        }));
        setLeaves(leafIcons);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className="absolute top-[-10%]"
                    style={{
                        left: leaf.left,
                        animation: `leafFall ${leaf.duration} linear infinite`,
                        animationDelay: leaf.delay,
                        '--swing-dist': leaf.swing
                    }}
                >
                    <Leaf
                        size={leaf.size}
                        className={`transition-colors duration-1000 ${
                            isDark ? 'text-emerald-500/20' : 'text-emerald-800/10'
                        }`}
                        style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                    />
                </div>
            ))}
            <style>{`
                @keyframes leafFall {
                    0% { transform: translateY(0vh) rotate(0deg) translateX(0px); opacity: 0; }
                    15% { opacity: 1; }
                    50% { transform: translateY(50vh) rotate(180deg) translateX(var(--swing-dist)); }
                    100% { transform: translateY(110vh) rotate(360deg) translateX(0px); opacity: 0; }
                }
            `}</style>
        </div>
    );
}