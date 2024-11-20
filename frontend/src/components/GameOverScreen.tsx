import React, { useEffect, useState } from 'react';
import './GameOverScreen.css';
import { CSSTransition } from 'react-transition-group';
import SoundManager from '../utils/SoundManager';

interface GameOverScreenProps {
  isVictory: boolean;
  playerName: string;
  onPlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ 
  isVictory, 
  playerName, 
  onPlayAgain 
}) => {

  useEffect(() => {
    const playGameOverSounds = async () => {
      await SoundManager.playGameOverSequence(isVictory);
    };

    playGameOverSounds();

    return () => {
      SoundManager.stopAll();
    };
  }, [isVictory]);

  const handlePlayAgain = () => {
    SoundManager.play('buttonClick');
    onPlayAgain();
  };

  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={1000}
      classNames="game-over"
    >
      <div className={`game-over-screen ${isVictory ? 'victory' : 'defeat'}`}>
        <div className="game-over-content">
          <h2 className="game-over-title">
            {isVictory ? 'Victory!' : 'Defeat!'}
          </h2>
          <p className="game-over-message">
            {isVictory 
              ? `Congratulations ${playerName}! You've won the battle!`
              : `Better luck next time ${playerName}! The enemy has prevailed.`
            }
          </p>
          <button 
            className="play-again-button" 
            onClick={handlePlayAgain}
            onMouseEnter={() => SoundManager.play('hover')}
          >
            Play Again
          </button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default GameOverScreen; 