import React from 'react';
import { CellState } from '../types/types';
import './Cell.css';
import SoundManager from '../utils/SoundManager';

interface CellProps {
  state: CellState;
  onClick: () => void;
  onMouseEnter?: () => void;
  isPreview?: boolean;
  isValidPlacement?: boolean;
  playHoverSound?: boolean;
  isAIMove?: boolean;
}

const Cell: React.FC<CellProps> = ({ 
  state, 
  onClick, 
  onMouseEnter,
  isPreview = false,
  isValidPlacement = true,
  playHoverSound = true
}: CellProps) => {
  const getClassName = () => {
    if (isPreview) {
      return `cell ${state} ${isValidPlacement ? 'placement-preview' : 'invalid-placement'}`;
    }
    return `cell ${state}`;
  };

  const handleMouseEnter = () => {
    if (playHoverSound) {
      SoundManager.play('hover');
    }
    onMouseEnter?.();
  };

  const handleClick = () => {
    SoundManager.play('buttonClick');
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={getClassName()}
      role="button"
      tabIndex={0}
      aria-label={`Cell ${state}`}
    />
  );
};

export default Cell; 