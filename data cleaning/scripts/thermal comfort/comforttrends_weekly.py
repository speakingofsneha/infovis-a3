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
    output_dir = os.path.join('comftrends', 'week')
    os.makedirs(output_dir, exist_ok=True)
    
    # Read the CSV
    df = pd.read_csv('rawdata.csv', parse_dates=['created_at'])
    
    # Filter for the specified floor
    df = df[df['floor_level'] == floor_level].copy()
    
    # Get the last date in the dataset
    last_date = df['created_at'].max()
    
    # Calculate the start date (7 weeks before the last date)
    start_date = last_date - pd.Timedelta(weeks=7)
    
    # Filter for the last 7 weeks
    df = df[df['created_at'] >= start_date].copy()
    
    # Create week column
    df['week_start'] = df['created_at'].dt.to_period('W-SUN').apply(lambda r: r.start_time)
    
    # Categorize temperatures
    df['thermal_comfort'] = df['ta'].apply(categorize_thermal_comfort)
    
    # Group by week and thermal comfort category, count occurrences
    weekly_counts = df.groupby(['week_start', 'thermal_comfort']).size().unstack(fill_value=0)
    
    # Calculate percentages
    weekly_percent = weekly_counts.div(weekly_counts.sum(axis=1), axis=0) * 100
    
    # Round percentages to 2 decimal places
    weekly_percent = weekly_percent.round(2)
    
    # Save to CSV
    output_file = os.path.join(output_dir, f'comftrends_floor{floor_level}.csv')
    weekly_percent.to_csv(output_file)
    
    print(f"\nThermal comfort trends for Floor {floor_level}:")
    print(weekly_percent)
    print(f"\nData saved to {output_file}")

# Get unique floor levels
df = pd.read_csv('rawdata.csv')
floor_levels = sorted(df['floor_level'].unique())

# Process data for each floor
for floor in floor_levels:
    process_floor_data(floor)

