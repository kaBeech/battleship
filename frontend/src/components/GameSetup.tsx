import React, { useState } from 'react';
import { Difficulty } from '../utils/BattleshipAI';
import './GameSetup.css';
import { CSSTransition } from 'react-transition-group';

interface GameSetupProps {
  onStartGame: (settings: GameSettings) => void;
}

export interface GameSettings {
  playerName: string;
  difficulty: Difficulty;
  boardSize: number;
  enableSoundEffects: boolean;
  enableAnimations: boolean;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [settings, setSettings] = useState<GameSettings>({
    playerName: '',
    difficulty: Difficulty.Medium,
    boardSize: 10,
    enableSoundEffects: true,
    enableAnimations: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings.playerName.trim()) {
      onStartGame(settings);
    }
  };

  return (
    <div className="game-setup">
      <CSSTransition
        in={true}
        appear={true}
        timeout={500}
        classNames="fade"
      >
        <h1>Battleship Setup</h1>
      </CSSTransition>
      
      <form onSubmit={handleSubmit} className="setup-form">
        {[
          {
            label: 'Player Name',
            element: (
              <input
                type="text"
                id="playerName"
                value={settings.playerName}
                onChange={(e) => setSettings({ ...settings, playerName: e.target.value })}
                placeholder="Enter your name"
                required
              />
            )
          },
          {
            label: 'Difficulty',
            element: (
              <select
                id="difficulty"
                value={settings.difficulty}
                onChange={(e) => setSettings({ ...settings, difficulty: e.target.value as Difficulty })}
              >
                {Object.values(Difficulty).map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            )
          },
          {
            label: 'Board Size',
            element: (
              <select
                id="boardSize"
                value={settings.boardSize}
                onChange={(e) => setSettings({ ...settings, boardSize: Number(e.target.value) })}
              >
                <option value="8">8x8 (Small)</option>
                <option value="10">10x10 (Classic)</option>
                <option value="12">12x12 (Large)</option>
              </select>
            )
          },
          {
            label: 'Enable Sound Effects',
            element: (
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.enableSoundEffects}
                    onChange={(e) => setSettings({ ...settings, enableSoundEffects: e.target.checked })}
                  />
                  Enable Sound Effects
                </label>
              </div>
            )
          },
          {
            label: 'Enable Animations',
            element: (
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.enableAnimations}
                    onChange={(e) => setSettings({ ...settings, enableAnimations: e.target.checked })}
                  />
                  Enable Animations
                </label>
              </div>
            )
          }
        ].map((item, index) => (
          <CSSTransition
            key={index}
            in={true}
            appear={true}
            timeout={500}
            classNames="fade"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="form-group">
              <label>{item.label}</label>
              {item.element}
            </div>
          </CSSTransition>
        ))}

        <button type="submit" className="start-button">
          Start Game
        </button>
      </form>
    </div>
  );
};

export default GameSetup; 