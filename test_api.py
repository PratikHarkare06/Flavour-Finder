import requests
import json

def test_recipe_api(test_case):
    url = "http://localhost:5000/recommend"
    print(f"\nTesting with parameters: {json.dumps(test_case, indent=2)}")
    
    try:
        response = requests.post(url, json=test_case)
        print("\nAPI Response Status:", response.status_code)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("recipes"):
                print(f"\nFound {len(result['recipes'])} recipes:")
                for recipe in result["recipes"]:
                    print(f"\nRecipe: {recipe['recipe_name']}")
                    print(f"Cuisine: {recipe['cuisine']}")
                    print(f"Course: {recipe['course']}")
                    print(f"Prep Time: {recipe['prep_time (in mins)']} mins")
                    print(f"Match Score: {recipe['match_score']}%")
                    print(f"Matched Ingredients:")
                    print("  Exact:", recipe['matched_ingredients']['exact'])
                    print("  Similar:", recipe['matched_ingredients']['similar'])
            else:
                print("\nNo recipes found!")
                if "message" in result:
                    print("Error:", result["message"])
        else:
            print("\nError Response:", response.text)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Test Case 1: Only ingredients and preference
    test_case1 = {
        "ingredients": "milk,sugar",
        "preference": "sweet"
    }
    test_recipe_api(test_case1)
    
    # Test Case 2: With cuisine only
    test_case2 = {
        "ingredients": "milk,sugar",
        "preference": "sweet",
        "cuisine": "indian",
        "course": "all",
        "maxPrepTime": 120
    }
    test_recipe_api(test_case2)
    
    # Test Case 3: With course only
    test_case3 = {
        "ingredients": "milk,sugar",
        "preference": "sweet",
        "cuisine": "all",
        "course": "dessert",
        "maxPrepTime": 120
    }
    test_recipe_api(test_case3)
    
    # Test Case 4: With prep time only
    test_case4 = {
        "ingredients": "milk,sugar",
        "preference": "sweet",
        "cuisine": "all",
        "course": "all",
        "maxPrepTime": 30
    }
    test_recipe_api(test_case4) 