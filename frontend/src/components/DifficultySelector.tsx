import React from 'react';
import { Difficulty } from '../utils/BattleshipAI';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const difficultyDescriptions: Record<Difficulty, string> = {
  [Difficulty.Easy]: "Random moves only",
  [Difficulty.Medium]: "Mix of random and strategic moves",
  [Difficulty.Hard]: "Uses probability-based targeting",
  [Difficulty.Expert]: "Advanced targeting with pattern recognition"
};

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange
}) => {
  return (
    <div className="difficulty-selector" style={{ justifySelf: 'center' }}>
      <h3>AI Difficulty</h3>
      <div className="difficulty-buttons">
        {Object.values(Difficulty).map((difficulty) => (
          <button
            key={difficulty}
            className={`difficulty-button ${currentDifficulty === difficulty ? 'active' : ''}`}
            onClick={() => onDifficultyChange(difficulty)}
            title={difficultyDescriptions[difficulty]}
          >
            {difficulty}
          </button>
        ))}
      </div>
      <p className="difficulty-description">
        {difficultyDescriptions[currentDifficulty]}
      </p>
    </div>
  );
};

export default DifficultySelector; 