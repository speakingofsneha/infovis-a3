import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function CO2History() {
    // state management for component data and ui controls
    const [selectedTimeRange, setSelectedTimeRange] = useState('12hours');
    const [selectedFloor, setSelectedFloor] = useState('0');
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // available floor options for dropdown
    const floors = ['0', '25', '26', '27', '28', '29', '30'];

    // time range filter options
    const timeRanges = [
        { value: '12hours', label: 'Last 12 Hours' },
        { value: '24hours', label: 'Last 24 Hours' }
    ];

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // construct file path based on selected filters
                const fileName = `co2history_floor${selectedFloor}.csv`;
                const dataPath = `/data/air quality/history/${selectedTimeRange}/${fileName}`;
                const csvData = await d3.csv(dataPath);
                if (!csvData || csvData.length === 0) {
                    throw new Error('No data available for the selected parameters');
                }

                // clean data by removing duplicates and empty entries
                const seen = new Set();
                const filtered = csvData.filter(d => {
                    const t = d.time || d.hour || d.timestamp;
                    if (!t || seen.has(t)) return false;
                    seen.add(t);
                    return true;
                });
                const times = filtered.map(d => d.time || d.hour || d.timestamp);
                const co2 = filtered.map(d => +d.co2);

                // create plotly line chart data
                const plotData = [{
                    x: times,
                    y: co2,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#79D7B3' }, // green line color
                    name: 'CO₂ ppm'
                }];

                // configure chart layout and styling
                const layoutConfig = {
                    title: {
                        text: `CO₂ History; ${timeRanges.find(t => t.value === selectedTimeRange)?.label || ''}${selectedFloor !== 'all' ? ` - Floor ${selectedFloor}` : ''}`,
                        x: 0.5 // center title
                    },
                    xaxis: {
                        title: 'Hour of Day',
                        tickmode: 'array',
                        // show every other tick for 24hr view to avoid crowding
                        tickvals: selectedTimeRange === '24hours' 
                            ? times.filter((_, i) => i % 2 === 0)
                            : times,
                        // convert 24hr format to 12hr am/pm format
                        ticktext: (selectedTimeRange === '24hours' 
                            ? times.filter((_, i) => i % 2 === 0)
                            : times).map(t => {
                                const hour = parseInt(t);
                                if (hour === 0) return '12 AM';
                                if (hour === 12) return '12 PM';
                                return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
                            }),
                        type: 'category',
                    },
                    yaxis: {
                        title: 'CO₂ Concentration (ppm)',
                        // dynamic y-axis range based on data with min/max bounds
                        range: [Math.min(...co2, 400), Math.max(...co2, 800)]
                    },
                    height: 550,
                    width: 1356,
                    plot_bgcolor: 'white',
                    paper_bgcolor: 'white'
                };

                setData(plotData);
                setLayout(layoutConfig);
                setError(null);
            } catch (error) {
                setError(error.message);
                setData([]);
                setLayout(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [selectedTimeRange, selectedFloor]); // reload when filters change

    return (
        <div>
            {/* filter controls section */}
            <div className="filter-controls flex gap-4 mb-4">
                {/* time range dropdown */}
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
                {/* floor selection dropdown */}
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
                                {floor === '0' ? 'Lobby' : `Floor ${floor}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* chart display area with loading/error states */}
            <div style={{ minHeight: 550, position: 'relative' }}>
                {/* loading overlay */}
                {isLoading && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'white', zIndex: 2
                    }}>
                    </div>
                )}
                {/* render chart when data is loaded successfully */}
                {!isLoading && !error && data.length > 0 && layout && (
                    <Plot 
                        data={data} 
                        layout={layout}
                        config={{ responsive: true }}
                    />
                )}
                {/* no data message */}
                {!isLoading && !error && data.length === 0 && (
                    <div className="text-gray-600 p-4 text-center">
                        No data available for the selected parameters
                    </div>
                )}
                {/* error message display */}
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
