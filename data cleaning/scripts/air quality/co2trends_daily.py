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
    output_dir = os.path.join('co2trends', 'daily')
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
    
    # Categorize CO2 levels
    df['co2_category'] = df['co2'].apply(categorize_co2)
    
    # Group by date and CO2 category, count occurrences
    daily_counts = df.groupby(['date', 'co2_category']).size().unstack(fill_value=0)
    
    # Calculate percentages
    daily_percent = daily_counts.div(daily_counts.sum(axis=1), axis=0) * 100
    
    # Round percentages to 2 decimal places
    daily_percent = daily_percent.round(2)
    
    # Save to CSV
    output_file = os.path.join(output_dir, f'co2trends_floor{floor_level}.csv')
    daily_percent.to_csv(output_file)
    
    print(f"\nCO2 trends for Floor {floor_level}:")
    print(daily_percent)
    print(f"\nData saved to {output_file}")

# Get unique floor levels
df = pd.read_csv('rawdata.csv')
floor_levels = sorted(df['floor_level'].unique())

# Process data for each floor
for floor in floor_levels:
    process_floor_data(floor)
