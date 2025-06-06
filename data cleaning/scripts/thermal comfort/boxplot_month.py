import pandas as pd
import numpy as np
import os

def process_zone_data(input_file='rawdata.csv'):
    """
    Process temperature data for each zone:
    1. Filter for May data
    2. Calculate hourly averages for each zone
    3. Save separate CSV files for each zone in boxplot/month folder
    """
    # Create boxplot/month directory if it doesn't exist
    output_dir = os.path.join('boxplot', 'month')
    os.makedirs(output_dir, exist_ok=True)
    
    print("Loading raw data...")
    # Read the CSV file
    df = pd.read_csv(input_file, parse_dates=['created_at'])
    
    # Filter for May data
    may_df = df[df['created_at'].dt.month == 5].copy()
    
    # Get unique zones
    zones = may_df['zone_id'].unique()
    print(f"\nFound {len(zones)} zones with May data")
    
    # Process each zone
    for zone in zones:
        print(f"\nProcessing Zone {zone}...")
        
        # Filter data for current zone
        zone_df = may_df[may_df['zone_id'] == zone].copy()
        
        # Add hour and day columns
        zone_df['hour'] = zone_df['created_at'].dt.hour
        zone_df['day'] = zone_df['created_at'].dt.dayofweek
        
        # Group by hour and calculate statistics
        hourly_stats = zone_df.groupby('hour').agg({
            'ta': ['mean', 'std', 'min', 'max', 'count']
        }).reset_index()
        
        # Flatten column names
        hourly_stats.columns = ['hour', 'mean', 'std', 'min', 'max', 'count']
        
        # Round numeric columns to 2 decimal places
        numeric_cols = ['mean', 'std', 'min', 'max']
        hourly_stats[numeric_cols] = hourly_stats[numeric_cols].round(2)
        
        # Create output filename
        output_file = os.path.join(output_dir, f'may_zone{zone}.csv')
        
        # Save to CSV
        hourly_stats.to_csv(output_file, index=False)
        print(f"Saved statistics to {output_file}")
        
        # Print some statistics
        print(f"Number of hours with data: {len(hourly_stats)}")
        print(f"Temperature range: {hourly_stats['min'].min():.2f}°C to {hourly_stats['max'].max():.2f}°C")
        print(f"Average temperature: {hourly_stats['mean'].mean():.2f}°C")
        print(f"Total data points: {hourly_stats['count'].sum()}")

if __name__ == "__main__":
    process_zone_data() 