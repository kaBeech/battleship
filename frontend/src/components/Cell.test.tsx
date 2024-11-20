import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cell from './Cell';
import SoundManager from '../utils/SoundManager';

jest.mock('../utils/SoundManager', () => ({
  play: jest.fn()
}));

describe('Cell Component', () => {
  const mockOnClick = jest.fn();
  const mockOnMouseEnter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with correct state class', () => {
    render(
      <Cell 
        state="empty" 
        onClick={mockOnClick}
      />
    );
    expect(screen.getByRole('button')).toHaveClass('cell empty');
  });

  test('handles click events', () => {
    render(
      <Cell 
        state="empty" 
        onClick={mockOnClick}
      />
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalled();
    expect(SoundManager.play).toHaveBeenCalledWith('buttonClick');
  });

  test('shows preview styling during placement', () => {
    render(
      <Cell 
        state="empty" 
        onClick={mockOnClick}
        isPreview={true}
        isValidPlacement={true}
      />
    );
    
    expect(screen.getByRole('button')).toHaveClass('placement-preview');
  });

  test('shows invalid placement styling', () => {
    render(
      <Cell 
        state="empty" 
        onClick={mockOnClick}
        isPreview={true}
        isValidPlacement={false}
      />
    );
    
    expect(screen.getByRole('button')).toHaveClass('invalid-placement');
  });
}); 