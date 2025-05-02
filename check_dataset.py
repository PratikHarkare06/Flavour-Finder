import os
from pathlib import Path
import pandas as pd

def check_dataset():
    """Utility function to check dataset existence and contents"""
    current_dir = Path(__file__).parent
    dataset_name = "AITRAINX_DATASET_with_flavour.csv"
    possible_locations = [
        current_dir / dataset_name,
        current_dir.parent / dataset_name,
        Path(dataset_name)
    ]

    print("Checking dataset locations...")
    
    for location in possible_locations:
        print(f"\nChecking: {location}")
        if os.path.exists(location):
            print("Found dataset!")
            try:
                df = pd.read_csv(location)
                print(f"Successfully loaded dataset with {len(df)} recipes")
                print("\nFirst few ingredients in dataset:")
                print(df['ingredients_name'].head())
                return True
            except Exception as e:
                print(f"Error loading dataset: {str(e)}")
        else:
            print("Not found at this location")
    
    print("\nDataset not found in any location!")
    print("Please ensure the file 'AITRAINX_DATASET_with_flavour.csv' is in one of these locations:")
    for loc in possible_locations:
        print(f"- {loc}")
    return False

if __name__ == "__main__":
    check_dataset() 