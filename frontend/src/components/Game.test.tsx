import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from './Game';
import { Difficulty } from '../utils/BattleshipAI';

// Mock the SoundManager
jest.mock('../utils/SoundManager', () => ({
  play: jest.fn(),
  init: jest.fn(),
  setMuted: jest.fn(),
}));

describe('Game Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders game setup initially', () => {
    render(<Game />);
    expect(screen.getByText('Battleship Setup')).toBeInTheDocument();
  });

  test('starts game after setup', async () => {
    render(<Game />);
    
    // Fill in setup form
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'Test Player' }
    });
    
    // Start game
    fireEvent.click(screen.getByText('Start Game'));
    
    // Check if game board appears with correct title
    await waitFor(() => {
      expect(screen.getByText('Battleship - Test Player\'s Game')).toBeInTheDocument();
    });
  });

  test('shows placement phase initially', async () => {
    render(<Game />);
    
    // Complete setup
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'Test Player' }
    });
    fireEvent.click(screen.getByText('Start Game'));

    // Check placement phase
    await waitFor(() => {
      expect(screen.getByText('Place your ships')).toBeInTheDocument();
    });
  });
}); 