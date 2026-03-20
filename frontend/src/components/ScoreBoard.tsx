import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart } from './RadarChart';

interface Props {
    olympusScore: number;
    beesScore: number;
    totalLimit?: number;
    olympusRatings: Record<string, number>;
    beesRatings: Record<string, number>;
}

export const ScoreBoard: React.FC<Props> = ({
    olympusScore,
    beesScore,
    totalLimit = 40,
    olympusRatings,
    beesRatings
}) => {
    // Convert dictionaries array in fixed order: 'Bouffe', 'Ambiance', 'Projets', 'Respect'
    const keys = ['Bouffe', 'Ambiance', 'Projets', 'Respect'];
    const olympusData = keys.map(k => olympusRatings[k] || 0);
    const beesData = keys.map(k => beesRatings[k] || 0);

    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6">

            {/* Header Score */}
            <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
                <div className="glass-scoreboard rounded-2xl p-5 flex flex-col items-center min-w-[320px]">
                    <h2 className="text-white font-base font-semibold uppercase tracking-[0.3em] text-xs mb-4 opacity-80 shine-effect">
                        The Arbitrator
                    </h2>

                    <div className="flex items-center justify-between w-full mb-4 px-6">
                        <span className="text-4xl font-olympus text-olympusGold text-glow-gold">{olympusScore}</span>
                        <span className="text-sm font-bold text-white/30 tracking-[0.3em] px-4">VS</span>
                        <span className="text-4xl font-bees font-black text-beesYellow text-glow-yellow">{beesScore}</span>
                    </div>

                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden relative shadow-inner">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-olympusGold via-white to-beesYellow transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            style={{ width: `${Math.min(((olympusScore + beesScore) / totalLimit) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="mt-3 text-white/50 text-xs font-base tracking-widest uppercase">
                        Target: {totalLimit}
                    </div>
                </div>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
                animate={{ y: [5, -5, 5] }} // Counter-bop to the top panel
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
                <div className="glass-scoreboard rounded-3xl p-6 min-w-[360px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 pointer-events-none" />
                    <RadarChart olympusData={olympusData} beesData={beesData} maxVal={10} />
                </div>
            </motion.div>

            {/* Final Global Call To Action */}
            <button className="glass-button px-10 py-4 rounded-full text-white font-base text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:text-white/90 relative overflow-hidden group">
                <span className="relative z-10">Confirmer le vote</span>
                <div className="absolute inset-0 bg-gradient-to-r from-olympusGold/20 to-beesYellow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>

        </div>
    );
};
