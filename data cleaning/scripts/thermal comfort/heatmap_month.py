import pandas as pd
import os

# Create output directory if it doesn't exist
os.makedirs(os.path.join('heatmap', 'month'), exist_ok=True)

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

# Filter for May data
may_df = df[df['created_at'].dt.month == 5]
may_zones = may_df['zone_id'].unique()
print("\nZones with May data:", sorted(may_zones))

# Find zones without May data
missing_zones = set(all_zones) - set(may_zones)
print("\nZones missing May data:", sorted(missing_zones))

# Process each zone that has May data
for zone in may_zones:
    # Filter for current zone
    zone_df = may_df[may_df['zone_id'] == zone].copy()
    
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
    output_filename = os.path.join('heatmap', 'month', f'may_zone{zone}.csv')
    result.to_csv(output_filename, index=False)
    
    print(f"\nNormalised CSV saved as '{output_filename}'") 