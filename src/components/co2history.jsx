import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function CO2History() {
    // comprehensive state management for all component functionality
    // separating concerns for better maintainability and debugging
    const [selectedTimeRange, setSelectedTimeRange] = useState('12hours');
    const [selectedFloor, setSelectedFloor] = useState('0');
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // floor configuration - using '0' for lobby is more intuitive than 'ground'
    // matches your building's actual floor numbering system
    const floors = ['0', '25', '26', '27', '28', '29', '30'];

    // time range options for different analysis needs
    // 12/24 hour views provide different levels of detail for facility managers
    const timeRanges = [
        { value: '12hours', label: 'Last 12 Hours' },
        { value: '24hours', label: 'Last 24 Hours' }
    ];

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // dynamic file path construction based on user selections
                // follows your established data organization pattern
                const fileName = `co2history_floor${selectedFloor}.csv`;
                const dataPath = `/infovis-a3/data/air quality/history/${selectedTimeRange}/${fileName}`;
                const csvData = await d3.csv(dataPath);
                
                // validate data exists before processing
                if (!csvData || csvData.length === 0) {
                    throw new Error('No data available for the selected parameters');
                }

                // data cleaning to handle duplicate timestamps and missing values
                // important for sensor data which can have irregular collection patterns
                const seen = new Set();
                const filtered = csvData.filter(d => {
                    const t = d.time || d.hour || d.timestamp; // flexible column naming
                    if (!t || seen.has(t)) return false;
                    seen.add(t);
                    return true;
                });
                
                // extract time and co2 values with type conversion
                const times = filtered.map(d => d.time || d.hour || d.timestamp);
                const co2 = filtered.map(d => +d.co2); // ensure numeric values

                // plotly line chart configuration for time series data
                const plotData = [{
                    x: times,
                    y: co2,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#79D7B3' }, // green theme consistent with your dashboard
                    name: 'CO₂ ppm'
                }];

                // comprehensive layout configuration for professional appearance
                const layoutConfig = {
                    title: {
                        // dynamic title reflecting current filter selections
                        text: `CO₂ History; ${timeRanges.find(t => t.value === selectedTimeRange)?.label || ''}${selectedFloor !== 'all' ? ` - Floor ${selectedFloor}` : ''}`,
                        x: 0.5 // centered title
                    },
                    xaxis: {
                        title: 'Hour of Day',
                        tickmode: 'array',
                        // intelligent tick spacing - fewer ticks for 24hr view to prevent crowding
                        tickvals: selectedTimeRange === '24hours' 
                            ? times.filter((_, i) => i % 2 === 0)
                            : times,
                        // convert 24-hour format to user-friendly 12-hour am/pm display
                        ticktext: (selectedTimeRange === '24hours' 
                            ? times.filter((_, i) => i % 2 === 0)
                            : times).map(t => {
                                const hour = parseInt(t);
                                if (hour === 0) return '12 AM';
                                if (hour === 12) return '12 PM';
                                return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
                            }),
                        type: 'category', // categorical x-axis for hour labels
                    },
                    yaxis: {
                        title: 'CO₂ Concentration (ppm)',
                        // dynamic y-axis range with sensible min/max bounds
                        // ensures chart always shows meaningful scale
                        range: [Math.min(...co2, 400), Math.max(...co2, 800)]
                    },
                    height: 550,
                    width: 1356, // wide format suitable for dashboard integration
                    plot_bgcolor: 'white',
                    paper_bgcolor: 'white'
                };

                setData(plotData);
                setLayout(layoutConfig);
                setError(null);
            } catch (error) {
                // comprehensive error handling with user-friendly messages
                setError(error.message);
                setData([]);
                setLayout(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [selectedTimeRange, selectedFloor]); // dependency array ensures data refresh on filter changes

    return (
        <div>
            {/* filter controls section using your established styling patterns */}
            <div className="filter-controls flex gap-4 mb-4">
                {/* time range selection dropdown */}
                <div className="filter-group">
                    <label htmlFor="time-range-select" className="block text-sm font-medium mb-1">
                        Time Range
                    </label>
                    <select
                        id="time-range-select"
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    >
                        {timeRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* floor selection dropdown with friendly naming */}
                <div className="filter-group">
                    <label htmlFor="floor-select" className="block text-sm font-medium mb-1">
                        Floor
                    </label>
                    <select
                        id="floor-select"
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    >
                        {floors.map((floor) => (
                            <option key={floor} value={floor}>
                                {/* user-friendly floor naming */}
                                {floor === '0' ? 'Lobby' : `Floor ${floor}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* chart display area with comprehensive state handling */}
            <div style={{ minHeight: 550, position: 'relative' }}>
                {/* loading state overlay */}
                {isLoading && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'white', zIndex: 2
                    }}>
                        {/* loading indicator could be added here */}
                    </div>
                )}
                
                {/* successful data display */}
                {!isLoading && !error && data.length > 0 && layout && (
                    <Plot 
                        data={data} 
                        layout={layout}
                        config={{ responsive: true }} // responsive design for different screen sizes
                    />
                )}
                
                {/* empty state message */}
                {!isLoading && !error && data.length === 0 && (
                    <div className="text-gray-600 p-4 text-center">
                        No data available for the selected parameters
                    </div>
                )}
                
                {/* error state display */}
                {error && (
                    <div className="text-red-600 mb-4 p-4 bg-red-50 rounded">
                        Error loading data: {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CO2History;
