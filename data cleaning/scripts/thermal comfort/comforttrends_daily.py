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
    output_dir = os.path.join('comftrends', 'daily')
    os.makedirs(output_dir, exist_ok=True)
    
    # Read the CSV
    df = pd.read_csv('rawdata.csv', parse_dates=['created_at'])
    
    # Filter for the specified floor
    df = df[df['floor_level'] == floor_level].copy()
    
    # Filter for the last week of May
    df = df[df['created_at'].dt.month == 5].copy()
    last_day = df['created_at'].dt.day.max()
    start_day = last_day - 6  # Get 7 days including the last day
    
    df = df[
        (df['created_at'].dt.day >= start_day) & 
        (df['created_at'].dt.day <= last_day)
    ].copy()
    
    # Create date column (just the date part, without time)
    df['date'] = df['created_at'].dt.date
    
    # Categorize temperatures
    df['thermal_comfort'] = df['ta'].apply(categorize_thermal_comfort)
    
    # Group by date and thermal comfort category, count occurrences
    daily_counts = df.groupby(['date', 'thermal_comfort']).size().unstack(fill_value=0)
    
    # Calculate percentages
    daily_percent = daily_counts.div(daily_counts.sum(axis=1), axis=0) * 100
    
    # Round percentages to 2 decimal places
    daily_percent = daily_percent.round(2)
    
    # Save to CSV
    output_file = os.path.join(output_dir, f'comftrends_floor{floor_level}.csv')
    daily_percent.to_csv(output_file)
    
    print(f"\nThermal comfort trends for Floor {floor_level}:")
    print(daily_percent)
    print(f"\nData saved to {output_file}")

# Get unique floor levels
df = pd.read_csv('rawdata.csv')
floor_levels = sorted(df['floor_level'].unique())

# Process data for each floor
for floor in floor_levels:
    process_floor_data(floor)