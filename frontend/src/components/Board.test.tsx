import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';
import { CellState } from '../types/types';

// Mock SoundManager to prevent sound effects during tests
jest.mock('../utils/SoundManager', () => ({
  play: jest.fn()
}));

describe('Board Component', () => {
  const mockBoard: CellState[][] = Array(10).fill(null).map(() => 
    Array(10).fill('empty')
  );
  const mockOnCellClick = jest.fn();
  const mockOnCellHover = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders board with correct number of cells', () => {
    render(
      <Board 
        board={mockBoard} 
        onCellClick={mockOnCellClick}
        onCellHover={mockOnCellHover}
        previewCells={[]}
        isValidPlacement={true}
        isPlacementPhase={false}
        isAiThinking={false}
        aiMovePosition={null}
      />
    );
    
    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(100); // 10x10 board
  });

  test('handles cell clicks', () => {
    render(
      <Board 
        board={mockBoard} 
        onCellClick={mockOnCellClick}
        onCellHover={mockOnCellHover}
        previewCells={[]}
        isValidPlacement={true}
        isPlacementPhase={false}
        isAiThinking={false}
        aiMovePosition={null}
      />
    );
    
    const firstCell = screen.getAllByRole('button')[0];
    fireEvent.click(firstCell);
    expect(mockOnCellClick).toHaveBeenCalledWith({ x: 0, y: 0 });
  });

  test('shows preview cells during placement', () => {
    const previewCells = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
    
    render(
      <Board 
        board={mockBoard}
        onCellClick={mockOnCellClick}
        onCellHover={mockOnCellHover}
        previewCells={previewCells}
        isPlacementPhase={true}
        isValidPlacement={true}
        isAiThinking={false}
        aiMovePosition={null}
      />
    );

    const previewedCells = screen.getAllByRole('button').slice(0, 2);
    previewedCells.forEach((cell: HTMLElement) => {
      expect(cell).toHaveClass('placement-preview');
    });
  });
}); 