from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import logging
import os
from pathlib import Path
from recommender import df, load_dataset, DATASET_NAME

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize dataset at startup
df = load_dataset()

@app.route('/')
def home():
    dataset_exists = os.path.exists(DATASET_NAME)
    return render_template('index.html', dataset_exists=dataset_exists)

@app.route('/recommend', methods=['POST'])
def recommend():
    logger.info("Received recommendation request")
    
    # Check if dataset is loaded
    global df
    if df is None:
        # Try to load dataset again if it's not loaded
        df = load_dataset()
        
    if df is None:
        error_msg = "Recipe database not loaded. Please ensure the dataset file exists."
        logger.error(error_msg)
        return jsonify({
            'success': False,
            'message': error_msg,
            'recipes': []
        })

    try:
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided in request',
                'recipes': []
            })

        ingredients = data.get('ingredients', '').strip()
        logger.info(f"Received ingredients: {ingredients}")

        # Get sample ingredients from dataset
        sample_ingredients = df['ingredients_name'].head(3).tolist()
        sample_text = ', '.join([ing.split(',')[0] for ing in sample_ingredients])
        
        if not ingredients:
            return jsonify({
                'success': False,
                'message': f'Please provide ingredients. Try ingredients like: {sample_text}',
                'recipes': []
            })

        from recommender import get_top_recipes  # Import here to avoid circular imports
        recipes = get_top_recipes(
            user_ingredients=ingredients,
            flavor=data.get('preference', '').strip(),
            user_cuisine=data.get('cuisine', 'all').strip(),
            user_course=data.get('course', 'all').strip(),
            max_prep_time=data.get('maxPrepTime', 120)
        )

        if not recipes:
            return jsonify({
                'success': False,
                'message': f'No recipes found. Try ingredients from our dataset like: {sample_text}',
                'recipes': []
            })

        return jsonify({
            'success': True,
            'recipes': recipes
        })

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        logger.exception("Full traceback:")
        return jsonify({
            'success': False,
            'message': f'Error processing request: {str(e)}',
            'recipes': []
        })

# Add a health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'dataset_loaded': df is not None,
        'sample_ingredients': df['ingredients_name'].head(3).tolist() if df is not None else []
    })

if __name__ == '__main__':
    # Ensure dataset is loaded before starting the server
    if df is None:
        logger.error("Failed to load dataset. Please check if the dataset file exists.")
    else:
        logger.info(f"Dataset loaded successfully with {len(df)} recipes")
    app.run(debug=True) 