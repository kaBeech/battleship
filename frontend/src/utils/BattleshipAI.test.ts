import BattleshipAI, { Difficulty } from './BattleshipAI';

describe('BattleshipAI', () => {
  let ai: BattleshipAI;
  const boardSize = 10;

  beforeEach(() => {
    ai = new BattleshipAI(boardSize, Difficulty.Medium);
  });

  test('makes valid moves within board boundaries', () => {
    const board = Array(boardSize).fill(Array(boardSize).fill('empty'));
    const move = ai.makeMove(board);
    
    expect(move.x).toBeGreaterThanOrEqual(0);
    expect(move.x).toBeLessThan(boardSize);
    expect(move.y).toBeGreaterThanOrEqual(0);
    expect(move.y).toBeLessThan(boardSize);
  });

  test('updates state correctly after hit', () => {
    const board = Array(boardSize).fill(Array(boardSize).fill('empty'));
    const move = ai.makeMove(board);
    ai.updateWithResult(move, true);
    
    // Make another move - should target adjacent cells
    const nextMove = ai.makeMove(board);
    const isAdjacent = (
      (Math.abs(nextMove.x - move.x) === 1 && nextMove.y === move.y) ||
      (Math.abs(nextMove.y - move.y) === 1 && nextMove.x === move.x)
    );
    
    expect(isAdjacent).toBeTruthy();
  });

  test('difficulty affects move selection', () => {
    const easyAI = new BattleshipAI(boardSize, Difficulty.Easy);
    const expertAI = new BattleshipAI(boardSize, Difficulty.Expert);
    const board = Array(boardSize).fill(Array(boardSize).fill('empty'));
    
    // Expert AI should use pattern-based targeting
    const expertMove = expertAI.makeMove(board);
    expect((expertMove.x + expertMove.y) % 2).toBe(0);
    
    // Easy AI should make random moves
    const easyMove = easyAI.makeMove(board);
    expect(easyMove).toBeDefined();
  });
}); 