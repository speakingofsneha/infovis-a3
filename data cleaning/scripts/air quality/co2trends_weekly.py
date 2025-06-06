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
    output_dir = os.path.join('co2trends', 'weekly')
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
    
    # Categorize CO2 levels
    df['co2_category'] = df['co2'].apply(categorize_co2)
    
    # Group by week and CO2 category, count occurrences
    weekly_counts = df.groupby(['week_start', 'co2_category']).size().unstack(fill_value=0)
    
    # Calculate percentages
    weekly_percent = weekly_counts.div(weekly_counts.sum(axis=1), axis=0) * 100
    
    # Round percentages to 2 decimal places
    weekly_percent = weekly_percent.round(2)
    
    # Save to CSV
    output_file = os.path.join(output_dir, f'co2trends_floor{floor_level}.csv')
    weekly_percent.to_csv(output_file)
    
    print(f"\nCO2 trends for Floor {floor_level}:") 
    print(weekly_percent)   
    print(f"\nData saved to {output_file}") 

# Get unique floor levels
df = pd.read_csv('rawdata.csv')
floor_levels = sorted(df['floor_level'].unique())

# Process data for each floor
for floor in floor_levels:
    process_floor_data(floor)

