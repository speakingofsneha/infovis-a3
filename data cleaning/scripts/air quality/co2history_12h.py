import pandas as pd
import numpy as np
import os

def process_floor_data(floor_level):
    # Create output directory if it doesn't exist
    output_dir = os.path.join('co2hist', '12hours')
    os.makedirs(output_dir, exist_ok=True)
    
    # Read the CSV
    df = pd.read_csv('rawdata.csv', parse_dates=['created_at'])
    
    # Filter for the specified floor
    df = df[df['floor_level'] == floor_level].copy()
    
    # Filter for June 1st
    df = df[df['created_at'].dt.date == pd.Timestamp('2019-06-01').date()].copy()
    
    # Get the last 12 hours
    last_time = df['created_at'].max()
    start_time = last_time - pd.Timedelta(hours=12)
    
    df = df[df['created_at'] >= start_time].copy()
    
    # Extract hour from timestamp
    df['hour'] = df['created_at'].dt.hour
    
    # Calculate average CO2 for each hour
    hourly_avg = df.groupby('hour')['co2'].mean().round(2)
    
    # Convert to DataFrame with proper column names
    result_df = pd.DataFrame({
        'time': hourly_avg.index,
        'co2': hourly_avg.values
    })
    
    # Save to CSV
    output_file = os.path.join(output_dir, f'co2history_floor{floor_level}.csv')
    result_df.to_csv(output_file, index=False)
    
    print(f"\nCO2 history for Floor {floor_level}:")
    print(result_df)
    print(f"\nData saved to {output_file}")

# Get unique floor levels
df = pd.read_csv('rawdata.csv')
floor_levels = sorted(df['floor_level'].unique())

# Process data for each floor
for floor in floor_levels:
    process_floor_data(floor)
