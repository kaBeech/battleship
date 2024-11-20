type CellState = 'empty' | 'ship' | 'hit' | 'miss';
type Position = { x: number; y: number };

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
  Expert = 'Expert'
}

class BattleshipAI {
  private boardSize: number;
  private lastHit: Position | null = null;
  private successfulHits: Position[] = [];
  private potentialTargets: Position[] = [];
  private huntingMode: boolean = false;
  private visitedCells: Set<string> = new Set();
  private difficulty: Difficulty;

  constructor(boardSize: number, difficulty: Difficulty = Difficulty.Medium) {
    this.boardSize = boardSize;
    this.difficulty = difficulty;
  }

  private positionToString(pos: Position): string {
    return `${pos.x},${pos.y}`;
  }

  private getAdjacentCells(pos: Position): Position[] {
    const adjacent: Position[] = [
      { x: pos.x - 1, y: pos.y },
      { x: pos.x + 1, y: pos.y },
      { x: pos.x, y: pos.y - 1 },
      { x: pos.x, y: pos.y + 1 }
    ];

    return adjacent.filter(pos => 
      pos.x >= 0 && 
      pos.x < this.boardSize && 
      pos.y >= 0 && 
      pos.y < this.boardSize &&
      !this.visitedCells.has(this.positionToString(pos))
    );
  }

  private addPotentialTargets(pos: Position): void {
    const adjacent = this.getAdjacentCells(pos);
    this.potentialTargets.push(...adjacent);
  }

  private getProbabilityMap(board: CellState[][]): number[][] {
    const probMap: number[][] = Array(this.boardSize).fill(0)
      .map(() => Array(this.boardSize).fill(0));

    // Add higher probability to cells adjacent to hits
    this.successfulHits.forEach(hit => {
      const adjacent = this.getAdjacentCells(hit);
      adjacent.forEach(pos => {
        if (!this.visitedCells.has(this.positionToString(pos))) {
          probMap[pos.y][pos.x] += 3;
        }
      });
    });

    // Add base probability to unchecked cells
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        if (!this.visitedCells.has(this.positionToString({ x, y }))) {
          probMap[y][x] += 1;
        }
      }
    }

    return probMap;
  }

  private getBestMove(probMap: number[][]): Position {
    let maxProb = -1;
    let bestMoves: Position[] = [];

    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        if (probMap[y][x] > maxProb) {
          maxProb = probMap[y][x];
          bestMoves = [{ x, y }];
        } else if (probMap[y][x] === maxProb) {
          bestMoves.push({ x, y });
        }
      }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  private makeRandomMove(): Position {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.boardSize);
      y = Math.floor(Math.random() * this.boardSize);
    } while (this.visitedCells.has(this.positionToString({ x, y })));
    return { x, y };
  }

  private getSmartMove(board: CellState[][]): Position {
    // Expert mode: Use pattern-based targeting
    if (this.difficulty === Difficulty.Expert) {
      const pattern = this.getCheckerboardPattern();
      const validPatternMoves = pattern.filter(pos => 
        !this.visitedCells.has(this.positionToString(pos))
      );
      
      if (validPatternMoves.length > 0) {
        return validPatternMoves[Math.floor(Math.random() * validPatternMoves.length)];
      }
    }

    // Hard mode: Use probability map with ship size consideration
    if (this.difficulty === Difficulty.Hard) {
      const probMap = this.getProbabilityMap(board);
      this.enhanceProbabilityMap(probMap);
      return this.getBestMove(probMap);
    }

    // Medium mode: Mix of random and smart moves
    if (Math.random() < 0.7) {
      const probMap = this.getProbabilityMap(board);
      return this.getBestMove(probMap);
    }

    return this.makeRandomMove();
  }

  private getCheckerboardPattern(): Position[] {
    const pattern: Position[] = [];
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = (y % 2); x < this.boardSize; x += 2) {
        pattern.push({ x, y });
      }
    }
    return pattern;
  }

  private enhanceProbabilityMap(probMap: number[][]): void {
    // Add higher probability for ship-sized patterns
    const shipSizes = [5, 4, 3, 3, 2];
    
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        shipSizes.forEach(size => {
          // Check horizontal placement
          if (x + size <= this.boardSize) {
            let valid = true;
            for (let i = 0; i < size; i++) {
              if (this.visitedCells.has(this.positionToString({ x: x + i, y }))) {
                valid = false;
                break;
              }
            }
            if (valid) {
              for (let i = 0; i < size; i++) {
                probMap[y][x + i] += 1;
              }
            }
          }

          // Check vertical placement
          if (y + size <= this.boardSize) {
            let valid = true;
            for (let i = 0; i < size; i++) {
              if (this.visitedCells.has(this.positionToString({ x, y: y + i }))) {
                valid = false;
                break;
              }
            }
            if (valid) {
              for (let i = 0; i < size; i++) {
                probMap[y + i][x] += 1;
              }
            }
          }
        });
      }
    }
  }

  makeMove(board: CellState[][]): Position {
    let move: Position;

    if (this.difficulty === Difficulty.Easy) {
      move = this.makeRandomMove();
    } else if (this.huntingMode && this.potentialTargets.length > 0) {
      const targetIndex = Math.floor(Math.random() * this.potentialTargets.length);
      move = this.potentialTargets.splice(targetIndex, 1)[0];
    } else {
      move = this.getSmartMove(board);
    }

    this.visitedCells.add(this.positionToString(move));
    return move;
  }

  updateWithResult(move: Position, isHit: boolean): void {
    if (isHit) {
      this.lastHit = move;
      this.successfulHits.push(move);
      this.huntingMode = true;
      this.addPotentialTargets(move);
    } else if (this.potentialTargets.length === 0) {
      this.huntingMode = false;
    }
  }

  reset(): void {
    this.lastHit = null;
    this.successfulHits = [];
    this.potentialTargets = [];
    this.huntingMode = false;
    this.visitedCells.clear();
  }

  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }
}

export default BattleshipAI; 