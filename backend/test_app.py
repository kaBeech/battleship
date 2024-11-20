import unittest
from app import app
from game_logic import GameState
import json

class TestGameAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_new_game(self):
        response = self.app.post('/api/game/new')
        data = json.loads(response.data)
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('game_id', data)
        self.assertIsInstance(data['game_id'], int)

    def test_make_move(self):
        # Create a new game
        response = self.app.post('/api/game/new')
        data = json.loads(response.data)
        game_id = data['game_id']

        # Make a move
        move_data = {'x': 0, 'y': 0}
        response = self.app.post(
            f'/api/game/{game_id}/move',
            data=json.dumps(move_data),
            content_type='application/json'
        )
        
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('hit', data)
        self.assertIn('game_over', data)
        self.assertIsInstance(data['hit'], bool)
        self.assertIsInstance(data['game_over'], bool)

    def test_invalid_game_id(self):
        move_data = {'x': 0, 'y': 0}
        response = self.app.post(
            '/api/game/999/move',
            data=json.dumps(move_data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 404) 