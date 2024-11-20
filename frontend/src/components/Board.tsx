import React from 'react';
import Cell from './Cell';
import { Board as BoardType, Position, CellState } from '../types/types';

interface BoardProps {
  board: BoardType;
  onCellClick: (position: Position) => void;
  onCellHover?: (position: Position) => void;
  previewCells?: Position[];
  isValidPlacement?: boolean;
  isPlacementPhase?: boolean;
  isAiThinking?: boolean;
  aiMovePosition?: Position | null;
}

const Board: React.FC<BoardProps> = ({ 
  board, 
  onCellClick, 
  onCellHover,
  previewCells = [], 
  isValidPlacement = true,
  isPlacementPhase = false,
  isAiThinking = false,
  aiMovePosition = null
}: BoardProps) => {
  const isPreviewCell = (x: number, y: number): boolean => {
    return previewCells.some(pos => pos.x === x && pos.y === y);
  };

  const isAiMoveCell = (x: number, y: number): boolean => {
    return aiMovePosition?.x === x && aiMovePosition?.y === y;
  };

  return (
    <div className={`board ${isAiThinking ? 'ai-thinking' : ''}`}>
      {board.map((row: CellState[], y: number) => (
        <div key={y} className="board-row">
          {row.map((cell: CellState, x: number) => (
            <Cell
              key={`${x}-${y}`}
              state={cell}
              onClick={() => onCellClick({ x, y })}
              onMouseEnter={() => onCellHover?.({ x, y })}
              isPreview={isPlacementPhase && isPreviewCell(x, y)}
              isValidPlacement={isValidPlacement}
              isAIMove={isAiMoveCell(x, y)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board; 