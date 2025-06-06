import React, { useState } from 'react';
import FilterControls from './FilterControls';
import Heatmap from './heatmap';
import BoxPlot from './boxplot';

function ThermalComfortDashboard() {
  // centralized state management for zone and time range selections
  // these values are shared between both visualization components 
  const [selectedZone, setSelectedZone] = useState('8');
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  return (
    <div>
      {/* shared filter controls component that manages user selections, passes current state values and setter functions as props */}
      <FilterControls
        selectedZone={selectedZone}
        onZoneChange={setSelectedZone} // callback to update zone selection
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange} // callback to update time range
      />
      
      {/* container for visualization components arranged side by side */}
      <div className="charts-container">
        {/* heatmap showing temperature patterns across days/hours, receives current selections as props to load appropriate data */}
        <Heatmap selectedZone={selectedZone} selectedTimeRange={selectedTimeRange} />
        
        {/* box plot showing temperature variability by hour, uses same zone and time range selections for consistency */}
        <BoxPlot selectedZone={selectedZone} selectedTimeRange={selectedTimeRange} />
      </div>
    </div>
  );
}

export default ThermalComfortDashboard;
