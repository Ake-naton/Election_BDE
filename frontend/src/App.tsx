import React, { useState } from 'react';
import { OlympusSection } from './components/OlympusSection';
import { BeesSection } from './components/BeesSection';
import { ScoreBoard } from './components/ScoreBoard';

export type Day = 'J1' | 'J2' | 'J3' | 'J4' | 'J5' | 'Global';

const criteriaKeys = ['Bouffe', 'Ambiance', 'Projets', 'Respect'];
const emptyRatings = () => criteriaKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Record<string, number>);

function App() {
  const [selectedDay, setSelectedDay] = useState<Day>('J1');

  // Days State
  const [olympusDays, setOlympusDays] = useState<Record<string, Record<string, number>>>({
    J1: { 'Bouffe': 7, 'Ambiance': 6, 'Projets': 9, 'Respect': 8 }, // Mock initial
    J2: emptyRatings(),
    J3: emptyRatings(),
    J4: emptyRatings(),
    J5: emptyRatings(),
  });

  const [beesDays, setBeesDays] = useState<Record<string, Record<string, number>>>({
    J1: { 'Bouffe': 8, 'Ambiance': 10, 'Projets': 7, 'Respect': 5 }, // Mock initial
    J2: emptyRatings(),
    J3: emptyRatings(),
    J4: emptyRatings(),
    J5: emptyRatings(),
  });

  // Calculate Global
  const getGlobalRatings = (daysState: Record<string, Record<string, number>>) => {
    const global: Record<string, number> = emptyRatings();
    Object.keys(daysState).forEach(dayKey => {
      criteriaKeys.forEach(k => {
        global[k] += daysState[dayKey][k] || 0;
      });
    });
    return global;
  };

  const currentOlympusRatings = selectedDay === 'Global' ? getGlobalRatings(olympusDays) : olympusDays[selectedDay as string];
  const currentBeesRatings = selectedDay === 'Global' ? getGlobalRatings(beesDays) : beesDays[selectedDay as string];

  const olympusScore = criteriaKeys.reduce((sum, k) => sum + (currentOlympusRatings[k] || 0), 0);
  const beesScore = criteriaKeys.reduce((sum, k) => sum + (currentBeesRatings[k] || 0), 0);
  
  // Total limit: 4 criteria * 10 max per day = 40. Global = 200.
  const totalLimit = selectedDay === 'Global' ? 200 : 40;
  // Radar Max Value
  const radarMaxVal = selectedDay === 'Global' ? 50 : 10;

  const handleRatingChange = (team: 'olympus' | 'bees', criteria: string, value: number) => {
    if (selectedDay === 'Global') return; // Read-only in Global view

    if (team === 'olympus') {
      setOlympusDays(prev => ({
        ...prev,
        [selectedDay]: { ...prev[selectedDay], [criteria]: value }
      }));
    } else {
      setBeesDays(prev => ({
        ...prev,
        [selectedDay]: { ...prev[selectedDay], [criteria]: value }
      }));
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-[#050505]">
      {/* Olympus Side */}
      <div className="w-full h-1/2 md:w-1/2 md:h-full relative overflow-y-auto md:overflow-hidden">
        <OlympusSection
          ratings={currentOlympusRatings}
          onRatingChange={(crit, val) => handleRatingChange('olympus', crit, val)}
        />
      </div>

      {/* Bees Side */}
      <div className="w-full h-1/2 md:w-1/2 md:h-full relative overflow-y-auto md:overflow-hidden">
        <BeesSection
          ratings={currentBeesRatings}
          onRatingChange={(crit, val) => handleRatingChange('bees', crit, val)}
        />
      </div>

      {/* Central Interactive Scoreboard w/ Radar Chart */}
      <ScoreBoard
        olympusScore={olympusScore}
        beesScore={beesScore}
        totalLimit={totalLimit}
        radarMaxVal={radarMaxVal}
        olympusRatings={currentOlympusRatings}
        beesRatings={currentBeesRatings}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />
    </div>
  );
}

export default App;
