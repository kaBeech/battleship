from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from game_logic import GameState
import logging
import os

# Assuming the React build files will be in a 'build' directory next to backend
static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'build'))
app = Flask(__name__, static_folder=static_folder)

# Configure logging based on environment
if app.debug:
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.INFO)

# In production, CORS isn't needed since frontend and backend are on same origin
if app.debug:
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

# Serve React App - catch all routes and serve index.html
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Use environment variables for configuration
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=debug)
