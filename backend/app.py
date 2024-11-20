from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from game_logic import GameState
import logging
import os
from datetime import datetime
from werkzeug.middleware.proxy_fix import ProxyFix

# Assuming the React build files will be in a 'build' directory next to backend
static_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'build'))
app = Flask(__name__, static_folder=static_folder)
# Handle proxy headers from Railway
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Add security headers
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

# Configure logging based on environment
if app.debug:
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.INFO)

# Configure CORS based on environment
if app.debug:
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
else:
    # In production, allow the Railway-provided domain
    CORS(app, resources={
        r"/api/*": {
            "origins": ["*"],  # You might want to restrict this to your Railway domain
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })

game_states = {}
last_cleanup = datetime.now()

def cleanup_old_games():
    """Remove games older than 1 hour"""
    global last_cleanup
    now = datetime.now()
    if (now - last_cleanup).total_seconds() > 3600:  # Cleanup every hour
        for game_id in list(game_states.keys()):
            if hasattr(game_states[game_id], 'last_activity'):
                if (now - game_states[game_id].last_activity).total_seconds() > 3600:
                    del game_states[game_id]
        last_cleanup = now

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for Railway"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/game/new', methods=['POST'])
def new_game():
    try:
        cleanup_old_games()
        game_id = len(game_states)
        game_state = GameState()
        game_state.last_activity = datetime.now()
        game_states[game_id] = game_state
        app.logger.debug(f"Created new game with ID: {game_id}")
        return jsonify({'game_id': game_id})
    except Exception as e:
        app.logger.error(f"Error creating new game: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/game/<int:game_id>/move', methods=['POST'])
def make_move(game_id):
    try:
        app.logger.debug(f"Received move request for game {game_id}")
        app.logger.debug(f"Request data: {request.get_json()}")
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        if 'x' not in data or 'y' not in data:
            return jsonify({'error': 'Missing coordinates'}), 400
            
        x = data['x']
        y = data['y']
        
        if not isinstance(x, int) or not isinstance(y, int):
            return jsonify({'error': 'Coordinates must be integers'}), 400
        
        if game_id not in game_states:
            app.logger.error(f"Game {game_id} not found")
            return jsonify({'error': 'Game not found'}), 404
            
        game = game_states[game_id]
        game.last_activity = datetime.now()
        result = game.make_move(x, y)
        app.logger.debug(f"Move result: {result}")
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error processing move: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

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
