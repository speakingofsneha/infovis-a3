import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function ComfortTrends() {
    // state management for component data and user interface controls
    const [selectedTimeRange, setSelectedTimeRange] = useState('daily');
    const [selectedFloor, setSelectedFloor] = useState('0');
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // available building floors - floor 0 represents lobby, others are numbered floors
    const floors = ['0', '25', '26', '27', '28', '29', '30'];

    // time aggregation options for trend analysis - allows users to view data at different granularities
    const timeRanges = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ];

    // utility function to format dates consistently across different time ranges
    // uses d3 time formatting for consistent date display
    const formatDate = (dateStr, timeRange) => {
        const date = new Date(dateStr);
        switch(timeRange) {
            case 'daily':
                return d3.timeFormat('%b %d')(date); // format as "may 29" for daily view
            case 'weekly':
                return d3.timeFormat('%b %d')(date); // format as "may 29" (week start date)
            case 'monthly':
                return d3.timeFormat('%B')(date); // format as "may" for monthly view
            default:
                return dateStr; // fallback to original string if no match
        }
    };

    useEffect(() => {
        // async function to load and process csv data based on user selections
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log('Loading data for:', selectedTimeRange, 'floor:', selectedFloor);
                // construct file path dynamically based on user selections
                const fileName = `comftrends_floor${selectedFloor}.csv`;
                const dataPath = `/infovis-a3/data/thermal comfort/trends/${selectedTimeRange}/${fileName}`;
                console.log('Loading from path:', dataPath);
                
                // use d3.csv to load and parse csv file
                const csvData = await d3.csv(dataPath);
                if (!csvData || csvData.length === 0) {
                    throw new Error('No data available for the selected parameters');
                }
                
                console.log('Loaded CSV data:', csvData);
                
                // process data differently based on time range selection
                // each time range has different column names in the csv
                let xLabels, comfortable;
                
                if (selectedTimeRange === 'daily') {
                    xLabels = csvData.map(d => formatDate(d.date, 'daily'));
                    comfortable = csvData.map(d => +d.comfortable); // convert string to number
                } else if (selectedTimeRange === 'weekly') {
                    xLabels = csvData.map(d => formatDate(d.week_start, 'weekly'));
                    comfortable = csvData.map(d => +d.comfortable);
                } else { // monthly
                    xLabels = csvData.map(d => formatDate(d.month, 'monthly'));
                    comfortable = csvData.map(d => +d.comfortable);
                }

                // calculate derived metrics for thermal comfort breakdown
                // since we only have "comfortable" percentage, we calculate "too hot" as remainder
                // note: this is a simplification - in reality we'd want separate data for too hot/cold
                const tooHot = comfortable.map(comfort => Math.max(0, 100 - comfort));
                const tooCold = comfortable.map(() => 0); // placeholder - no actual data available

                console.log('Processed data:', { xLabels, comfortable, tooHot, tooCold });

                // create plotly stacked bar chart data structure
                const plotData = [
                    {
                        x: xLabels,
                        y: comfortable,
                        name: 'Comfortable (21-25°C)', // 21-25°C is the comfort range; best for transitional weather (may in sydney)
                        type: 'bar',
                        marker: { color: '#FDD07A' } // warm yellow for comfortable conditions
                    },
                    {
                        x: xLabels,
                        y: tooHot,
                        name: 'Too Hot (>25°C)',
                        type: 'bar',
                        marker: { color: '#FF7057' } // red for hot conditions
                    },
                    {
                        x: xLabels,
                        y: tooCold,
                        name: 'Too Cold (<21°C)', 
                        type: 'bar',
                        marker: { color: '#3D72D5' } // blue for cold conditions
                    }
                ];

                // configure chart layout with responsive design and proper styling
                const layoutConfig = {
                    barmode: 'stack', // stack bars to show 100% breakdown of comfort conditions
                    title: {
                        // dynamic title that includes time range and floor information
                        text: `${selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)} Comfort Conditions${selectedFloor !== 'all' ? ` - ${selectedFloor === '0' ? 'Lobby' : `Floor ${selectedFloor}`}` : ''}`,
                        x: 0.5 // center the title
                    },
                    xaxis: {
                        title: selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1),
                        tickangle: 0, // horizontal labels for better readability
                        tickfont: {
                            size: 12 // readable font size for date labels
                        }
                    },
                    yaxis: {
                        title: 'Percent Time',
                        range: [0, 100] // fixed range for percentage data
                    },
                    legend: {
                        orientation: 'v', // vertical legend to save horizontal space
                        x: 1.05, // position legend to the right of chart
                        y: 1
                    },
                    margin: {
                        r: 120, // extra right margin to accommodate legend
                        b: 80 // increased bottom margin for date labels
                    },
                    height: 750,
                    width: 1356, // fixed dimensions for consistent dashboard layout
                    plot_bgcolor: 'white',
                    paper_bgcolor: 'white'
                };

                console.log('Setting plot data and layout');
                setData(plotData);
                setLayout(layoutConfig);
                setError(null);
            } catch (error) {
                console.error('Error loading data:', error);
                setError(error.message);
                // reset state on error to prevent stale data display
                setData([]);
                setLayout(null);
            } finally {
                setIsLoading(false); // always set loading to false regardless of success/failure
            }
        };

        loadData();
    }, [selectedTimeRange, selectedFloor]); // dependency array - re-run when filters change

    return (
        <div>
            {/* filter controls section with accessible form elements */}
            <div className="filter-controls flex gap-4 mb-4">
                {/* time range selection dropdown */}
                <div className="filter-group">
                    <label htmlFor="time-range-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Time Range
                    </label>
                    <select
                        id="time-range-select"
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                        className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {timeRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* floor selection dropdown with special handling for lobby */}
                <div className="filter-group">
                    <label htmlFor="floor-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Floor
                    </label>
                    <select
                        id="floor-select"
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        className="block w-40 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {floors.map((floor) => (
                            <option key={floor} value={floor}>
                                {/* display "lobby" for floor 0, otherwise show floor number */}
                                {floor === '0' ? 'Lobby' : `Floor ${floor}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* chart display area with comprehensive state handling */}
            <div style={{ minHeight: 750, position: 'relative' }}>
                {/* loading state with informative message */}
                {isLoading ? (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'white', zIndex: 2
                    }}>
                        <div className="text-gray-600">Loading chart data...</div>
                    </div>
                ) : error ? (
                    // error state with clear messaging
                    <div className="text-red-600 mb-4 p-4 bg-red-50 rounded">
                        Error loading data: {error}
                    </div>
                ) : data.length > 0 && layout ? (
                    // successful data load - render stacked bar chart
                    <Plot data={data} layout={layout} config={{ responsive: true }} />
                ) : (
                    // empty state message
                    <div className="text-gray-600 p-4 text-center">
                        No data available for the selected parameters
                    </div>
                )}
            </div>
        </div>
    );
}

// Add keyframes for the loading spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

export default ComfortTrends;
