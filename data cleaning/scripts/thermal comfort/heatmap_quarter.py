import pandas as pd
import os

# Create output directory if it doesn't exist
os.makedirs(os.path.join('heatmap', 'quarter'), exist_ok=True)

# Load the CSV
df = pd.read_csv('rawdata.csv', parse_dates=['created_at'])

# Get all unique zones
all_zones = set(df['zone_id'].unique())
print("\nAll unique zones:", sorted(all_zones))

# Check each month
for month in range(1, 13):
    month_df = df[df['created_at'].dt.month == month]
    month_zones = set(month_df['zone_id'].unique())
    missing_zones = all_zones - month_zones
    
    if not missing_zones:
        print(f"\nMonth {month} has data for ALL zones!")
    else:
        print(f"\nMonth {month}:")
        print(f"Zones with data: {sorted(month_zones)}")
        print(f"Missing zones: {sorted(missing_zones)}")
        print(f"Total zones with data: {len(month_zones)} out of {len(all_zones)}")

# Filter for last quarter data (March, April, May)
quarter_df = df[df['created_at'].dt.month.isin([3, 4, 5])].copy()
quarter_zones = quarter_df['zone_id'].unique()
print("\nZones with last quarter data:", sorted(quarter_zones))

# Find zones without last quarter data
missing_zones = set(all_zones) - set(quarter_zones)
print("\nZones missing last quarter data:", sorted(missing_zones))

# Process each zone that has last quarter data
for zone in quarter_zones:
    print(f"\nProcessing Zone {zone}...")
    
    # Filter for current zone
    zone_df = quarter_df[quarter_df['zone_id'] == zone].copy()
    
    # Add day of week and hour columns
    zone_df['day'] = zone_df['created_at'].dt.dayofweek
    zone_df['hour'] = zone_df['created_at'].dt.hour
    
    # Group by day and hour to get averages
    result = zone_df.groupby(['day', 'hour'])['ta'].mean().reset_index()
    
    # Map day numbers to day names (0=Monday, 6=Sunday)
    day_map = {0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday',
               4: 'Friday', 5: 'Saturday', 6: 'Sunday'}
    result['day_name'] = result['day'].map(day_map)
    
    # Reorder columns to match desired output
    result = result[['day_name', 'day', 'hour', 'ta']]
    
    # Sort by day and hour
    result = result.sort_values(by=['day', 'hour'])
    
    # Save cleaned result to CSV with zone number in filename
    output_filename = os.path.join('heatmap', 'quarter', f'lastquarter_zone{zone}.csv')
    result.to_csv(output_filename, index=False)
    
    print(f"Normalised CSV saved as '{output_filename}'")
    print(f"Number of days with data: {len(result['day'].unique())}")
    print(f"Number of hours with data: {len(result['hour'].unique())}")
    print(f"Temperature range: {result['ta'].min():.2f}°C to {result['ta'].max():.2f}°C")
    print(f"Average temperature: {result['ta'].mean():.2f}°C")