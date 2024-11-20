import React, { useState, useEffect } from 'react';
import Board from './Board';
import { GameState, Position, Board as BoardType, CellState, Ship } from '../types/types';
import './Game.css';
import SoundManager from '../utils/SoundManager';
import VolumeControl from './VolumeControl';
import BattleshipAI from '../utils/BattleshipAI';
import DifficultySelector from './DifficultySelector';
import { Difficulty } from '../utils/BattleshipAI';
import GameSetup, { GameSettings } from './GameSetup';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './Transitions.css';
import GameOverScreen from './GameOverScreen';
import { API_BASE_URL } from 'config';

const BOARD_SIZE = 10;
const SHIPS = [
  { size: 5, name: 'Carrier' },
  { size: 4, name: 'Battleship' },
  { size: 3, name: 'Cruiser' },
  { size: 3, name: 'Submarine' },
  { size: 2, name: 'Destroyer' }
];

const createEmptyBoard = (): BoardType => {
  return Array(BOARD_SIZE).fill(null).map(() =>
    Array(BOARD_SIZE).fill('empty' as CellState)
  );
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerBoard: createEmptyBoard(),
    opponentBoard: createEmptyBoard(),
    playerShips: [],
    opponentShips: [],
    isPlayerTurn: true,
    gameOver: false
  });
  const [gameId, setGameId] = useState<number | null>(null);
  const [placementPhase, setPlacementPhase] = useState(true);
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [previewCells, setPreviewCells] = useState<Position[]>([]);
  const [isValidPlacement, setIsValidPlacement] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [ai] = useState(() => new BattleshipAI(BOARD_SIZE, difficulty));
  const [aiMovePosition, setAiMovePosition] = useState<Position | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  useEffect(() => {
    document.addEventListener('keydown', handleRotation);
    return () => {
      document.removeEventListener('keydown', handleRotation);
    };
  }, []);

  useEffect(() => {
    SoundManager.init();
  }, []);

  const handleRotation = (event: KeyboardEvent): void => {
    if (event.key === 'r' || event.key === 'R') {
      setIsHorizontal(prev => !prev);
      SoundManager.play('rotate');
    }
  };

  const canPlaceShip = (position: Position, shipSize: number): boolean => {
    if (isHorizontal) {
      if (position.x + shipSize > BOARD_SIZE) return false;
      for (let i = 0; i < shipSize; i++) {
        if (gameState.playerBoard[position.y][position.x + i] !== 'empty') {
          return false;
        }
      }
    } else {
      if (position.y + shipSize > BOARD_SIZE) return false;
      for (let i = 0; i < shipSize; i++) {
        if (gameState.playerBoard[position.y + i][position.x] !== 'empty') {
          return false;
        }
      }
    }
    return true;
  };

  const handlePlaceShip = (position: Position): void => {
    if (!placementPhase || currentShipIndex >= SHIPS.length) return;

    const currentShip = SHIPS[currentShipIndex];
    if (!canPlaceShip(position, currentShip.size)) return;

    const newBoard = [...gameState.playerBoard];
    const shipPositions: Position[] = [];

    for (let i = 0; i < currentShip.size; i++) {
      const pos: Position = isHorizontal
        ? { x: position.x + i, y: position.y }
        : { x: position.x, y: position.y + i };
      newBoard[pos.y][pos.x] = 'ship';
      shipPositions.push(pos);
    }

    const newShip: Ship = {
      positions: shipPositions,
      hits: [],
      sunk: false
    };

    setGameState((prev: GameState) => ({
      ...prev,
      playerBoard: newBoard,
      playerShips: [...prev.playerShips, newShip]
    }));

    SoundManager.play('placement');

    if (currentShipIndex === SHIPS.length - 1) {
      startNewGame().then(() => {
        setPlacementPhase(false);
        setTimeout(() => {
          SoundManager.play('gameStart');
        }, 500);
      });
    } else {
      setCurrentShipIndex(prev => prev + 1);
    }
  };

  const startNewGame = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/game/new`, {
        method: 'POST',
      });
      const data = await response.json();
      console.log("New game created with ID:", data.game_id);
      setGameId(data.game_id);
      setPlacementPhase(true);
      setCurrentShipIndex(0);
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  };

  const handlePlayerMove = async (position: Position): Promise<void> => {
    if (!gameId || !gameState.isPlayerTurn || gameState.gameOver || placementPhase) {
      console.log("Move rejected:", {
        gameId,
        isPlayerTurn: gameState.isPlayerTurn,
        gameOver: gameState.gameOver,
        placementPhase
      });
      return;
    }

    try {
      console.log("Making move:", { gameId, position });
      const response = await fetch(`${API_BASE_URL}/api/game/${gameId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x: position.x,
          y: position.y,
        }),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Move result:", result);

      // Update opponent board based on move result
      const newOpponentBoard = [...gameState.opponentBoard];
      newOpponentBoard[position.y][position.x] = result.hit ? 'hit' : 'miss';

      SoundManager.play(result.hit ? 'hit' : 'miss');

      setGameState((prev: GameState) => ({
        ...prev,
        opponentBoard: newOpponentBoard,
        isPlayerTurn: false,
        gameOver: result.game_over
      }));

      if (result.game_over) {
        setIsVictory(true);
        setShowGameOver(true);
        SoundManager.play('victory');
      } else {
        setTimeout(makeOpponentMove, 1000);
      }
    } catch (error) {
      console.error('Failed to make move:', error);
    }
  };

  const makeOpponentMove = async (): Promise<void> => {
    setIsAiThinking(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const move = ai.makeMove(gameState.playerBoard);
    setAiMovePosition(move);
    setIsAiThinking(false);

    // Show targeting animation
    await new Promise(resolve => setTimeout(resolve, 500));

    const newPlayerBoard = [...gameState.playerBoard];
    const isHit = newPlayerBoard[move.y][move.x] === 'ship';
    newPlayerBoard[move.y][move.x] = isHit ? 'hit' : 'miss';

    ai.updateWithResult(move, isHit);

    SoundManager.play(isHit ? 'hit' : 'miss');

    if (isGameOver(newPlayerBoard)) {
      setIsVictory(false);
      setShowGameOver(true);
      SoundManager.play('defeat');
    }

    setGameState(prev => ({
      ...prev,
      playerBoard: newPlayerBoard,
      isPlayerTurn: true
    }));

    // Reset AI move position after animation
    setTimeout(() => {
      setAiMovePosition(null);
    }, 1200);
  };

  const isGameOver = (board: BoardType): boolean => {
    return !board.some(row =>
      row.some(cell => cell === 'ship')
    );
  };

  const handleBoardHover = (position: Position): void => {
    if (!placementPhase || currentShipIndex >= SHIPS.length) {
      setPreviewCells([]);
      return;
    }

    const currentShip = SHIPS[currentShipIndex];
    const newPreviewCells: Position[] = [];
    let valid = true;

    for (let i = 0; i < currentShip.size; i++) {
      const pos: Position = isHorizontal
        ? { x: position.x + i, y: position.y }
        : { x: position.x, y: position.y + i };

      if (pos.x >= BOARD_SIZE || pos.y >= BOARD_SIZE) {
        valid = false;
        break;
      }

      if (gameState.playerBoard[pos.y]?.[pos.x] !== 'empty') {
        valid = false;
      }

      newPreviewCells.push(pos);
    }

    setPreviewCells(newPreviewCells);
    setIsValidPlacement(valid);
  };

  const handleBoardLeave = (): void => {
    setPreviewCells([]);
  };

  const resetGame = () => {
    ai.reset();
    setPlacementPhase(true);
    setCurrentShipIndex(0);
    setGameState({
      playerBoard: createEmptyBoard(),
      opponentBoard: createEmptyBoard(),
      playerShips: [],
      opponentShips: [],
      isPlayerTurn: true,
      gameOver: false
    });
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    ai.setDifficulty(newDifficulty);
    SoundManager.play('buttonClick');
  };

  const handleStartGame = (gameSettings: GameSettings) => {
    setSettings(gameSettings);
    setGameStarted(true);
    SoundManager.setMuted(!gameSettings.enableSoundEffects);
    setGameState({
      playerBoard: createEmptyBoard(),
      opponentBoard: createEmptyBoard(),
      playerShips: [],
      opponentShips: [],
      isPlayerTurn: true,
      gameOver: false
    });
    setDifficulty(gameSettings.difficulty);
  };

  const handlePlayAgain = () => {
    setShowGameOver(false);
    resetGame();
  };

  return (
    <div className="game-container">
      {!gameStarted ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <div className="game-content">
          <h1 className="game-title">
            Battleship - {settings?.playerName}'s Game
          </h1>
          {!placementPhase && (
            <DifficultySelector
              currentDifficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
            />
          )}

          {placementPhase ? (
            <div className="board-section">
              <div className="placement-info">
                <h2 className="board-title">Place your ships</h2>
                <p className="ship-info">
                  Current ship: {currentShipIndex < SHIPS.length ? SHIPS[currentShipIndex].name : ''}
                </p>
                <p className="rotation-info">
                  Press 'R' to rotate ship (Current: {isHorizontal ? 'Horizontal' : 'Vertical'})
                </p>
              </div>
              <div
                onMouseLeave={handleBoardLeave}
                className="board-wrapper"
              >
                <Board
                  board={gameState.playerBoard}
                  onCellClick={handlePlaceShip}
                  onCellHover={handleBoardHover}
                  previewCells={previewCells}
                  isValidPlacement={isValidPlacement}
                  isPlacementPhase={placementPhase}
                  isAiThinking={isAiThinking}
                  aiMovePosition={aiMovePosition}
                />
              </div>
            </div>
          ) : (
            <div className="boards-container">
              <div className="board-section">
                <h2 className="board-title">Your Board</h2>
                <Board
                  board={gameState.playerBoard}
                  onCellClick={() => { }}
                  isAiThinking={isAiThinking}
                  aiMovePosition={aiMovePosition}
                />
              </div>

              <div className="board-section">
                <h2 className="board-title">Opponent's Board</h2>
                <Board
                  board={gameState.opponentBoard}
                  onCellClick={handlePlayerMove}
                />
              </div>
            </div>
          )}

          {gameState.gameOver && (
            <button
              className="game-button"
              onClick={resetGame}
            >
              Start New Game
            </button>
          )}

          {!placementPhase && (
            <div className={`turn-indicator ${gameState.isPlayerTurn ? 'player-turn' : 'opponent-turn'}`}>
              {gameState.isPlayerTurn ? "Your turn" : "Opponent's turn"}
            </div>
          )}

          <VolumeControl />
        </div>
      )}

      {showGameOver && (
        <GameOverScreen
          isVictory={isVictory}
          playerName={settings?.playerName || 'Player'}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default Game; 
