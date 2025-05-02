import pandas as pd
import os
import logging
from pathlib import Path
from difflib import SequenceMatcher

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get the absolute path to the dataset
CURRENT_DIR = Path(__file__).parent
DATASET_NAME = "AITRAINX_DATASET_with_flavour.csv"
DATASET_PATH = CURRENT_DIR / DATASET_NAME

def load_dataset():
    """Load and preprocess the dataset"""
    try:
        logger.info(f"Attempting to load dataset from: {DATASET_PATH}")
        
        if not os.path.exists(DATASET_PATH):
            # Try looking in parent directory
            parent_path = CURRENT_DIR.parent / DATASET_NAME
            logger.info(f"Dataset not found, trying parent directory: {parent_path}")
            if os.path.exists(parent_path):
                df = pd.read_csv(parent_path)
            else:
                logger.error(f"Dataset not found in either location: {DATASET_PATH} or {parent_path}")
                return None
        else:
            df = pd.read_csv(DATASET_PATH)
        
        logger.info(f"Dataset loaded successfully with {len(df)} recipes")
        
        # Preprocess the dataset
        df["ingredients_name"] = df["ingredients_name"].fillna("").str.lower()
        df["cuisine"] = df["cuisine"].fillna("").str.lower()
        df["course"] = df["course"].fillna("").str.lower()
        df["name"] = df["name"].fillna("")
        df["flavour"] = df["flavour"].fillna("").str.lower()
        df["description"] = df["description"].fillna("")
        df["instructions"] = df["instructions"].fillna("")
        df["prep_time (in mins)"] = pd.to_numeric(df["prep_time (in mins)"], errors='coerce').fillna(0)
        
        logger.info("Dataset preprocessing completed")
        logger.info(f"Sample ingredients from dataset: {df['ingredients_name'].head().tolist()}")
        
        return df
    except Exception as e:
        logger.error(f"Error loading dataset: {str(e)}")
        logger.exception("Full traceback:")
        return None

# Load the dataset when the module is imported
df = load_dataset()

if df is None:
    logger.error("Failed to load dataset. Please check if the dataset file exists and is accessible.")

def normalize_ingredients(ingredients_str):
    """Clean and normalize ingredients string"""
    if pd.isna(ingredients_str) or not ingredients_str:
        return set()
    
    # Split by comma and clean each ingredient
    ingredients = []
    for item in str(ingredients_str).lower().split(','):
        cleaned = item.strip()
        # Keep the original ingredient format
        if cleaned:
            ingredients.append(cleaned)
    
    logger.info(f"Normalized ingredients: {ingredients}")
    return set(ingredients)

def ingredient_similarity(ing1, ing2):
    """Calculate similarity between two ingredient names"""
    return SequenceMatcher(None, ing1, ing2).ratio()

def find_similar_ingredients(user_ing, recipe_ingredients, threshold=0.85):
    """Find similar ingredients using fuzzy matching"""
    similar_pairs = []
    for u_ing in user_ing:
        for r_ing in recipe_ingredients:
            similarity = ingredient_similarity(u_ing, r_ing)
            if similarity >= threshold:
                similar_pairs.append((u_ing, r_ing, similarity))
    return similar_pairs

def calculate_match_score(row, user_ingredients):
    """Calculate match score based on exact ingredient matches from dataset"""
    recipe_ingredients = normalize_ingredients(row["ingredients_name"])
    if not recipe_ingredients:
        return 0
    
    # Find exact matches
    matched_ingredients = user_ingredients.intersection(recipe_ingredients)
    
    # Calculate match percentage based on user's ingredients found in recipe
    match_percentage = len(matched_ingredients) / len(user_ingredients) * 100
    
    # Only return a score if there's at least one match
    if match_percentage > 0:
        return {
            'score': match_percentage,
            'matched': list(matched_ingredients),
            'total_recipe_ingredients': list(recipe_ingredients)
        }
    return {
        'score': 0,
        'matched': [],
        'total_recipe_ingredients': list(recipe_ingredients)
    }

def get_top_recipes(user_ingredients, user_cuisine="", user_course="", max_prep_time=None, food_type="", flavor=""):
    try:
        logger.info(f"Searching for recipes with ingredients: {user_ingredients}")
        
        if df is None:
            logger.error("Dataset not loaded")
            return []

        # Print first few rows of dataset for debugging
        logger.info("Sample from dataset:")
        logger.info(df[['name', 'ingredients_name']].head())
        
        # Convert user ingredients to lowercase for case-insensitive matching
        user_ingredients_list = [ing.strip().lower() for ing in user_ingredients.split(',')]
        logger.info(f"Processed user ingredients: {user_ingredients_list}")

        # Filter recipes that contain any of the user's ingredients
        matched_recipes = []
        
        for _, recipe in df.iterrows():
            recipe_ingredients = recipe['ingredients_name'].lower()
            matches = []
            
            for user_ing in user_ingredients_list:
                if user_ing in recipe_ingredients:
                    matches.append(user_ing)
            
            if matches:
                match_score = (len(matches) / len(user_ingredients_list)) * 100
                matched_recipes.append({
                    "recipe_name": recipe["name"],
                    "cuisine": recipe["cuisine"],
                    "course": recipe["course"],
                    "ingredients_name": recipe["ingredients_name"],
                    "ingredients_quantity": recipe["ingredients_quantity"],
                    "prep_time (in mins)": recipe["prep_time (in mins)"],
                    "cook_time (in mins)": recipe["cook_time (in mins)"],
                    "instructions": recipe["instructions"],
                    "description": recipe["description"],
                    "image_url": recipe["image_url"],
                    "flavour": recipe["flavour"],
                    "match_score": round(match_score, 1),
                    "matched_ingredients": matches,
                    "all_ingredients": recipe["ingredients_name"].split(',')
                })
        
        # Sort by match score
        matched_recipes.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Take top 10 matches
        top_recipes = matched_recipes[:10]
        
        logger.info(f"Found {len(top_recipes)} matching recipes")
        for recipe in top_recipes:
            logger.info(f"Recipe: {recipe['recipe_name']}, Match: {recipe['match_score']}%, "
                       f"Matched Ingredients: {recipe['matched_ingredients']}")
        
        return top_recipes

    except Exception as e:
        logger.error(f"Error in get_top_recipes: {str(e)}")
        logger.exception("Full traceback:")
        return []

def get_sample_ingredients():
    """Get sample ingredients from the dataset to help users"""
    try:
        if df is not None:
            # Get first ingredient from first 5 recipes
            sample_ingredients = []
            for _, row in df.head(5).iterrows():
                ingredients = normalize_ingredients(row['ingredients_name'])
                if ingredients:
                    sample_ingredients.extend(list(ingredients)[:1])
            return sample_ingredients
        return []
    except Exception as e:
        logger.error(f"Error getting sample ingredients: {str(e)}")
        return [] 