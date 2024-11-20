from flask import Flask, request, jsonify
from flask_cors import CORS
from game_logic import GameState
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

game_states = {}

@app.route('/api/game/new', methods=['POST'])
def new_game():
    game_id = len(game_states)
    game_states[game_id] = GameState()
    app.logger.debug(f"Created new game with ID: {game_id}")
    return jsonify({'game_id': game_id})

@app.route('/api/game/<int:game_id>/move', methods=['POST'])
def make_move(game_id):
    app.logger.debug(f"Received move request for game {game_id}")
    app.logger.debug(f"Request data: {request.get_json()}")
    
    data = request.get_json()
    x = data['x']
    y = data['y']
    
    if game_id not in game_states:
        app.logger.error(f"Game {game_id} not found")
        return jsonify({'error': 'Game not found'}), 404
        
    game = game_states[game_id]
    result = game.make_move(x, y)
    app.logger.debug(f"Move result: {result}")
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True) 