import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function CO2Trends() {
    // comprehensive state management for all component functionality
    // keeping loading, error, and data states separate for better debugging and user experience
    const [selectedTimeRange, setSelectedTimeRange] = useState('daily');
    const [selectedFloor, setSelectedFloor] = useState('0');
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // building floor configuration - using '0' for lobby makes more sense than 'ground'
    // matches your building's actual numbering system for consistency
    const floors = ['0', '25', '26', '27', '28', '29', '30'];

    // time aggregation options for different analysis granularities
    // daily/weekly/monthly views provide different insights for facility managers
    const timeRanges = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ];

    // utility function for smart date formatting based on selected time range
    // using d3's time formatting for consistent, readable date displays
    const formatDate = (dateStr, timeRange) => {
        const date = new Date(dateStr);
        switch(timeRange) {
            case 'daily':
                return d3.timeFormat('%b %d')(date); // "may 29" format
            case 'weekly':
                return d3.timeFormat('%b %d')(date); // week start date
            case 'monthly':
                return d3.timeFormat('%B')(date); // full month name
            default:
                return dateStr;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // dynamic file path construction following your established data organization
                // url encoding for spaces in path ensures proper file access
                const fileName = `co2trends_floor${selectedFloor}.csv`;
                const dataPath = `/infovis-a3/data/air%20quality/trends/${selectedTimeRange}/${fileName}`;
                const csvData = await d3.csv(dataPath);
                
                // validate data exists before processing - prevents downstream errors
                if (!csvData || csvData.length === 0) {
                    throw new Error('No data available for the selected parameters');
                }

                // smart x-axis label generation based on time range selection
                // different time ranges use different date column names in the csv
                let xLabels;
                if (selectedTimeRange === 'daily') {
                    xLabels = csvData.map(d => formatDate(d.date, 'daily'));
                } else if (selectedTimeRange === 'weekly') {
                    xLabels = csvData.map(d => formatDate(d.week_start, 'weekly'));
                } else { // monthly
                    xLabels = csvData.map(d => formatDate(d.month, 'monthly'));
                }

                // extract percentage values for air quality categories
                // these represent time spent in each co2 range - excellent/fair/needs improvement
                const excellent = csvData.map(d => +d.excellent); // <= 600ppm
                const fair = csvData.map(d => +d.fair); // 600-1000ppm
                const needsImprovement = csvData.map(d => +d.needs_improvement); // > 1000ppm

                // create stacked bar chart data using traffic light color system
                // green/yellow/red for intuitive understanding of air quality levels
                const plotData = [
                    {
                        x: xLabels,
                        y: excellent,
                        name: 'Excellent (<= 600ppm)',
                        type: 'bar',
                        marker: { color: '#5ABA8A' }, // green for good air quality
                        // rich hover templates with color-coded styling for better user experience
                        hovertemplate: '<b style="color: #5ABA8A">%{x}</b><br>' +
                            '<span style="color: #5ABA8A">Excellent: %{y:.1f}%</span><br>' +
                            '<span style="color: #5ABA8A">CO₂ ≤ 600 ppm</span><br>' +
                            '<extra></extra>'
                    },
                    {
                        x: xLabels,
                        y: fair,
                        name: 'Fair (600-1000ppm)',
                        type: 'bar',
                        marker: { color: '#FCD566' }, // yellow for moderate air quality
                        hovertemplate: '<b style="color: #FCD566">%{x}</b><br>' +
                            '<span style="color: #FCD566">Fair: %{y:.1f}%</span><br>' +
                            '<span style="color: #FCD566">CO₂: 600-1000 ppm</span><br>' +
                            '<extra></extra>'
                    },
                    {
                        x: xLabels,
                        y: needsImprovement,
                        name: 'Needs Improvement (> 1000ppm)',
                        type: 'bar',
                        marker: { color: '#E77D73' }, // red for poor air quality
                        hovertemplate: '<b style="color: #E77D73">%{x}</b><br>' +
                            '<span style="color: #E77D73">Needs Improvement: %{y:.1f}%</span><br>' +
                            '<span style="color: #E77D73">CO₂ > 1000 ppm</span><br>' +
                            '<extra></extra>'
                    }
                ];

                // comprehensive layout configuration for professional dashboard appearance
                const layoutConfig = {
                    barmode: 'stack', // stacked bars show 100% breakdown of time spent in each category
                    title: {
                        // dynamic title reflecting current filter selections for context
                        text: `${selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)} Air Quality Breakdown (CO₂)${selectedFloor !== 'all' ? ` - ${selectedFloor === '0' ? 'Lobby' : `Floor ${selectedFloor}`}` : ''}`,
                        x: 0.5 // centered title
                    },
                    hovermode: 'closest', // show hover for nearest data point
                    hoverlabel: {
                        bgcolor: 'white',
                        bordercolor: 'lightgray',
                        font: { size: 14 },
                        align: 'left'
                    },
                    xaxis: {
                        title: selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1),
                        tickangle: 0, // horizontal labels for better readability
                        tickfont: {
                            size: 12
                        }
                    },
                    yaxis: {
                        title: 'Percent Time',
                        range: [0, 100] // fixed percentage scale for consistency
                    },
                    legend: {
                        orientation: 'v', // vertical legend on the right
                        x: 1.05, // positioned outside chart area
                        y: 1
                    },
                    margin: {
                        r: 120 // extra right margin to accommodate legend
                    },
                    height: 750,
                    width: 1356, // wide format optimized for dashboard integration
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
            {/* filter controls section using consistent styling patterns */}
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
                
                {/* floor selection dropdown with user-friendly naming */}
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
                                {/* converting technical floor numbers to user-friendly names */}
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

export default CO2Trends;
