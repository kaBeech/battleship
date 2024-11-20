import unittest
from game_logic import GameState

class TestGameLogic(unittest.TestCase):
    def setUp(self):
        self.game = GameState()

    def test_board_initialization(self):
        self.assertEqual(len(self.game.player_board), 10)
        self.assertEqual(len(self.game.opponent_board), 10)
        self.assertEqual(len(self.game.ships), 5)

    def test_ship_placement(self):
        # Verify all ships are placed
        ship_sizes = [5, 4, 3, 3, 2]
        for ship, expected_size in zip(self.game.ships, ship_sizes):
            self.assertEqual(len(ship['positions']), expected_size)
            
        # Verify ships don't overlap
        ship_positions = []
        for ship in self.game.ships:
            for pos in ship['positions']:
                position = (pos['x'], pos['y'])
                self.assertNotIn(position, ship_positions)
                ship_positions.append(position)

    def test_make_move(self):
        # Test a miss
        x, y = 0, 0
        while self.game.opponent_board[y][x] == 1:  # Find an empty spot
            x = (x + 1) % 10
            if x == 0:
                y = (y + 1) % 10
                
        result = self.game.make_move(x, y)
        self.assertFalse(result['hit'])
        self.assertFalse(result['game_over'])
        self.assertEqual(self.game.opponent_board[y][x], 3)  # 3 represents a miss

    def test_hit_detection(self):
        # Find a ship position
        ship = self.game.ships[0]
        pos = ship['positions'][0]
        
        result = self.game.make_move(pos['x'], pos['y'])
        self.assertTrue(result['hit'])
        self.assertEqual(self.game.opponent_board[pos['y']][pos['x']], 2)  # 2 represents a hit

    def test_game_over(self):
        # Hit all ship positions
        for ship in self.game.ships:
            for pos in ship['positions']:
                result = self.game.make_move(pos['x'], pos['y'])
                if pos == self.game.ships[-1]['positions'][-1]:  # Last position of last ship
                    self.assertTrue(result['game_over'])
                else:
                    self.assertFalse(result['game_over'])

if __name__ == '__main__':
    unittest.main() 