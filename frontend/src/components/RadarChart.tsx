import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    olympusData: number[]; // Ensure order: [Bouffe, Ambiance, Projets, Respect]
    beesData: number[];
    maxVal?: number;
}

export const RadarChart: React.FC<Props> = ({ olympusData, beesData, maxVal = 10 }) => {
    const size = 280;
    const center = size / 2;
    const radius = center - 60; // Extra Padding for labels to not cut off
    const angleSlice = (Math.PI * 2) / 4; // 4 axes

    // Labels for the axes
    const labels = ['Bouffe', 'Ambiance', 'Projets', 'Respect'];

    // Calculate coordinates for a given value on an axis
    const getCoordinatesForValue = (val: number, index: number) => {
        const r = (val / maxVal) * radius;
        const a = angleSlice * index - Math.PI / 2; // Start from top (-90deg)
        return {
            x: center + r * Math.cos(a),
            y: center + r * Math.sin(a)
        };
    };

    // Generate SVG path strings
    const getPathString = (data: number[]) => {
        return data.map((val, i) => {
            const pos = getCoordinatesForValue(val, i);
            return `${i === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`;
        }).join(' ') + ' Z';
    };

    const olympusPath = getPathString(olympusData);
    const beesPath = getPathString(beesData);

    return (
        <div className="flex justify-center items-center w-full">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glowBlack" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Draw the 4 concentric background webs (25%, 50%, 75%, 100%) */}
                {[0.25, 0.5, 0.75, 1].map((scale, i) => {
                    const r = radius * scale;
                    const bgPath = labels.map((_, idx) => {
                        const a = angleSlice * idx - Math.PI / 2;
                        const px = center + r * Math.cos(a);
                        const py = center + r * Math.sin(a);
                        return `${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
                    }).join(' ') + ' Z';

                    return (
                        <path key={i} d={bgPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    );
                })}

                {/* Draw axes */}
                {labels.map((_, i) => {
                    const { x, y } = getCoordinatesForValue(maxVal, i);
                    return (
                        <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                    );
                })}

                {/* Draw Labels */}
                {labels.map((label, i) => {
                    const { x, y } = getCoordinatesForValue(maxVal * 1.25, i); // Push labels slightly out
                    return (
                        <text
                            key={label}
                            x={x}
                            y={y}
                            fill="rgba(255,255,255,1)"
                            fontSize="10"
                            fontWeight="700"
                            letterSpacing="1.5px"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            className="font-base uppercase filter drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                        >
                            {label}
                        </text>
                    );
                })}

                {/* Olympus Polygon */}
                <motion.path
                    d={olympusPath}
                    fill="rgba(228, 192, 66, 0.3)" // olympusGold with opacity
                    stroke="#E4C042"
                    strokeWidth="2.5"
                    filter="url(#glowGold)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, d: olympusPath }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                />

                {/* Bees Polygon */}
                <motion.path
                    d={beesPath}
                    fill="rgba(10, 10, 10, 0.4)" // Dark/Anthracite with opacity
                    stroke="#000000"
                    strokeWidth="2.5"
                    filter="url(#glowBlack)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, d: beesPath }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
            </svg>
        </div>
    );
};
