import React from 'react';

// reusable filter controls component for thermal comfort dashboard
// accepts props for current selections and callback functions for state updates
function FilterControls({ selectedZone, onZoneChange, selectedTimeRange, onTimeRangeChange }) {
  // available building zones for thermal comfort analysis
  // these zones correspond to specific areas with sensor coverage
  const zones = ['26', '27', '30', '47', '48', '50', '51', '52', '244'];
  
  // time range options for historical data analysis
  // provides different temporal granularities for trend analysis
  const timeRanges = [
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' }
  ];

  return (
    // container for filter controls with flexbox layout and bottom margin
    <div className="filter-controls flex gap-4 mb-4">
      {/* zone selection dropdown */}
      <div className="filter-group">
        {/* accessible label with proper association to select element */}
        <label htmlFor="zone-select" className="block text-sm font-medium text-gray-700 mb-1">
          Zone
        </label>
        <select
          id="zone-select"
          value={selectedZone} // controlled component - value from parent state
          onChange={(e) => onZoneChange(e.target.value)} // callback to update parent state
          // css classes for consistent styling with focus states
          className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {/* dynamically generate options from zones array */}
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              Zone {zone} {/* display friendly zone name */}
            </option>
          ))}
        </select>
      </div>

      {/* time range selection dropdown */}
      <div className="filter-group">
        {/* accessible label for time range selection */}
        <label htmlFor="time-range-select" className="block text-sm font-medium text-gray-700 mb-1">
          Time Range
        </label>
        <select
          id="time-range-select"
          value={selectedTimeRange} // controlled component - value from parent state
          onChange={(e) => onTimeRangeChange(e.target.value)} // callback to update parent state
          // consistent styling with zone select for visual cohesion
          className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {/* generate options from timeRanges array with descriptive labels */}
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label} {/* user-friendly display text */}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterControls;
