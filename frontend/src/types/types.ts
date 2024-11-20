export type CellState = 'empty' | 'ship' | 'hit' | 'miss';

export type Position = {
  x: number;
  y: number;
};

export type Ship = {
  positions: Position[];
  hits: Position[];
  sunk: boolean;
};

export type Board = CellState[][];

export type GameState = {
  playerBoard: Board;
  opponentBoard: Board;
  playerShips: Ship[];
  opponentShips: Ship[];
  isPlayerTurn: boolean;
  gameOver: boolean;
};

export interface GameResult {
  hit: boolean;
  game_over: boolean;
} 