import pandas as pd
import numpy as np
import os

def categorize_co2(co2):
    if co2 <= 600:
        return 'excellent'
    elif co2 <= 1000:
        return 'fair'
    else:
        return 'needs_improvement'

def process_floor_data(floor_level):
    # Create output directory if it doesn't exist
    output_dir = os.path.join('co2trends', 'monthly')
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
    
    # Categorize CO2 levels
    df['co2_category'] = df['co2'].apply(categorize_co2)
    
    # Group by month and CO2 category, count occurrences
    monthly_counts = df.groupby(['month', 'co2_category']).size().unstack(fill_value=0)
    
    # Calculate percentages
    monthly_percent = monthly_counts.div(monthly_counts.sum(axis=1), axis=0) * 100
    
    # Round percentages to 2 decimal places
    monthly_percent = monthly_percent.round(2)
    
    # Save to CSV
    output_file = os.path.join(output_dir, f'co2trends_floor{floor_level}.csv')
    monthly_percent.to_csv(output_file)
    
    print(f"\nCO2 trends for Floor {floor_level}:")
    print(monthly_percent)
    print(f"\nData saved to {output_file}")

# Get unique floor levels
df = pd.read_csv('rawdata.csv')
floor_levels = sorted(df['floor_level'].unique())

# Process data for each floor
for floor in floor_levels:
    process_floor_data(floor) 