import pandas as pd
import numpy as np
import os

def categorize_thermal_comfort(ta):
    """
    Categorize temperature based on ASHRAE-55 standards
    Too cold: < 21°C
    Comfortable: 21-26°C
    Too hot: > 26°C
    """
    if ta < 21:
        return 'too_cold'
    elif ta <= 26:
        return 'comfortable'
    else:
        return 'too_hot'

def process_floor_data(floor_level):
    # Create output directory if it doesn't exist
    output_dir = os.path.join('comftrends', 'monthly')
    os.makedirs(output_dir, exist_ok=True)
    
    # Read the CSV
    df = pd.read_csv('rawdata.csv', parse_dates=['created_at'])
    
    # Filter for the specified floor
    df = df[df['floor_level'] == floor_level].copy()
    
    # Filter for specified months (Oct through May)
    target_months = [10, 11, 12, 1, 2, 3, 4, 5]  # October through May
    df = df[df['created_at'].dt.month.isin(target_months)].copy()
    
    # Create month column
    df['month'] = df['created_at'].dt.to_period('M')
    
    # Categorize temperatures
    df['thermal_comfort'] = df['ta'].apply(categorize_thermal_comfort)
    
    # Group by month and thermal comfort category, count occurrences
    monthly_counts = df.groupby(['month', 'thermal_comfort']).size().unstack(fill_value=0)
    
    # Calculate percentages
    monthly_percent = monthly_counts.div(monthly_counts.sum(axis=1), axis=0) * 100
    
    # Round percentages to 2 decimal places
    monthly_percent = monthly_percent.round(2)
    
    # Save to CSV
    output_file = os.path.join(output_dir, f'comftrends_floor{floor_level}.csv')
    monthly_percent.to_csv(output_file)
    
    print(f"\nThermal comfort trends for Floor {floor_level}:")
    print(monthly_percent)
    print(f"\nData saved to {output_file}")

# Get unique floor levels
df = pd.read_csv('rawdata.csv')
floor_levels = sorted(df['floor_level'].unique())

# Process data for each floor
for floor in floor_levels:
    process_floor_data(floor)

