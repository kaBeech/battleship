import random
from typing import List, Dict, Tuple

class GameState:
    def __init__(self):
        self.board_size = 10
        self.player_board = [[0 for _ in range(self.board_size)] for _ in range(self.board_size)]
        self.opponent_board = [[0 for _ in range(self.board_size)] for _ in range(self.board_size)]
        self.ships = self._place_ships()

    def _place_ships(self) -> List[Dict]:
        ships = [
            {'size': 5, 'positions': []},  # Carrier
            {'size': 4, 'positions': []},  # Battleship
            {'size': 3, 'positions': []},  # Cruiser
            {'size': 3, 'positions': []},  # Submarine
            {'size': 2, 'positions': []}   # Destroyer
        ]
        
        for ship in ships:
            placed = False
            while not placed:
                x = random.randint(0, self.board_size - 1)
                y = random.randint(0, self.board_size - 1)
                horizontal = random.choice([True, False])
                
                if self._can_place_ship(x, y, ship['size'], horizontal):
                    self._place_ship(x, y, ship['size'], horizontal, ship)
                    placed = True
                    
        return ships

    def _can_place_ship(self, x: int, y: int, size: int, horizontal: bool) -> bool:
        if horizontal:
            if x + size > self.board_size:
                return False
            return all(self.opponent_board[y][x+i] == 0 for i in range(size))
        else:
            if y + size > self.board_size:
                return False
            return all(self.opponent_board[y+i][x] == 0 for i in range(size))

    def _place_ship(self, x: int, y: int, size: int, horizontal: bool, ship: Dict):
        positions = []
        for i in range(size):
            if horizontal:
                self.opponent_board[y][x+i] = 1
                positions.append({'x': x+i, 'y': y})
            else:
                self.opponent_board[y+i][x] = 1
                positions.append({'x': x, 'y': y+i})
        ship['positions'] = positions

    def make_move(self, x: int, y: int) -> Dict:
        if self.opponent_board[y][x] == 1:
            self.opponent_board[y][x] = 2  # Hit
            return {'hit': True, 'game_over': self._check_game_over()}
        else:
            self.opponent_board[y][x] = 3  # Miss
            return {'hit': False, 'game_over': False}

    def _check_game_over(self) -> bool:
        return all(
            all(cell != 1 for cell in row)
            for row in self.opponent_board
        ) 