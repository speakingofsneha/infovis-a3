import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function Heatmap({ selectedZone, selectedTimeRange }) {
  // state management for heatmap data and configuration
  const [traces, setTraces] = useState([]);
  const [layout, setLayout] = useState(null);
  const [error, setError] = useState(null);

  // day definitions matching python's datetime.dayofweek (0=monday)
  // provides both full names for data matching and abbreviated labels for display
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // generate 24-hour labels in 12-hour am/pm format for better readability
  const hours = [...Array(24).keys()].map(h => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12; // convert 0 to 12 for 12am/12pm
    return `${hour12} ${ampm}`;
  });

  // transforms csv data into 2d array format required by plotly heatmap
  // creates matrix where rows=hours, columns=days, values=temperature
  function createHeatmapData(data) {
    console.log('Creating heatmap data from:', data);
    // initialize 2d array with null values (24 hours x 7 days)
    const z = Array.from({ length: hours.length }, () => Array(days.length).fill(null));
    
    // populate matrix with temperature data from csv
    data.forEach(row => {
      const dayIndex = days.indexOf(row.day_name); // find day column index
      const hourIndex = +row.hour; // convert hour string to number
      const temp = +row.ta; // convert temperature string to number
      
      // only add data if indices are valid
      if (dayIndex !== -1 && hourIndex !== -1) {
        z[hourIndex][dayIndex] = temp;
      }
    });
    return z;
  }

  useEffect(() => {
    console.log('Component mounted, starting data load...');
    
    // define initial heatmap trace with color scale and styling
    const initialTrace = {
      x: days, // x-axis shows days of week
      y: hours, // y-axis shows hours of day
      z: Array.from({ length: hours.length }, () => Array(days.length).fill(null)), // empty data initially
      type: 'heatmap',
      // custom color scale representing temperature ranges from cool to warm
      colorscale: [
        [0, '#3F8BEA'],    // cool blue for 22°c
        [0.2, '#3F8BEA'],  // blue for 22°c
        [0.4, '#28B1B7'],  // teal for 23°c
        [0.6, '#95B295'],  // green for 24°c
        [0.9, '#ED8F89'],  // orange for 25°c
        [1, '#F8857E']     // red for 26°c
      ],
      zmin: 22, // minimum temperature for color scale
      zmax: 26, // maximum temperature for color scale
      colorbar: {
        title: 'Temperature (°C)',
        titleside: 'right',
        len: 0.5, // colorbar height as fraction of plot
        y: 0.5, // center colorbar vertically
        yanchor: 'middle'
      },
      showscale: true,
      hoverongaps: false, // don't show hover on null values
      // custom hover template showing day, time, and temperature
      hovertemplate: '<b>Day:</b> %{x}<br>' +
                    '<b>Time:</b> %{y}<br>' +
                    '<b>Temp:</b> %{z}°C<br>' +
                    '<extra></extra>'
    };

    // configure layout with proper axis settings and grid lines
    const layoutConfig = {
      title: {
        text: `Average temperature - Zone ${selectedZone}`,
        x: 0.5, // center title
        y: 0.95
      },
      xaxis: {
        title: '',
        side: 'bottom',
        tickangle: 0, // horizontal day labels
        tickvals: [...Array(days.length).keys()], // position ticks at each day
        ticktext: dayLabels, // use abbreviated day names
        tickfont: {
          size: 12
        },
        showgrid: false // hide default grid - using custom shapes instead
      },
      yaxis: {
        title: '',
        autorange: 'reversed', // reverse y-axis so midnight is at top
        tickangle: 0,
        tickvals: [...Array(24).keys()], // position ticks at each hour
        tickfont: {
          size: 12
        },
        showgrid: false // hide default grid
      },
      margin: { t: 60, b: 40, l: 60, r: 20 },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      height: 750,
      width: 670,
      // custom grid lines to separate days and hours
      shapes: [
        // vertical lines between days
        ...Array(days.length - 1).fill().map((_, i) => (
          i === 4 // special thick white line after friday to separate weekdays/weekend
          ? {
              type: 'line',
              x0: i + 0.5,
              x1: i + 0.5,
              y0: -0.5,
              y1: hours.length - 0.5,
              line: {
                color: 'white',
                width: 4 // thicker line for weekend separation
              }
            }
          : {
              type: 'line',
              x0: i + 0.5,
              x1: i + 0.5,
              y0: -0.5,
              y1: hours.length - 0.5,
              line: {
                color: 'black',
                width: 0.5 // thin lines between other days
              }
            }
        )),
        // horizontal lines between hours
        ...Array(hours.length - 1).fill().map((_, i) => ({
          type: 'line',
          y0: i + 0.5,
          y1: i + 0.5,
          x0: -0.5,
          x1: days.length - 0.5,
          line: {
            color: 'black',
            width: 0.5 // thin lines between hours
          }
        }))
      ]
    };
    setLayout(layoutConfig);

    // load csv data based on selected zone and time range
    console.log(`Loading data for zone ${selectedZone} and time range ${selectedTimeRange}`);
    const fileName = selectedTimeRange === 'month' ? `lastmonth_zone${selectedZone}.csv` : `lastquarter_zone${selectedZone}.csv`;
    const dataPath = `/data/thermal comfort/heatmap/${selectedTimeRange}/${fileName}`;
    console.log(`Loading data from: ${dataPath}`);
    
    // use d3 to load and parse csv file
    d3.csv(dataPath)
      .then(data => {
        console.log('Data loaded successfully:', data);
        const heatmapData = createHeatmapData(data);
        // update trace with actual data
        setTraces([{ ...initialTrace, z: heatmapData }]);
      })
      .catch(error => {
        console.error('Error loading the CSV file:', error);
        setError(error.message);
      });
  }, [selectedZone, selectedTimeRange]); // re-run when zone or time range changes

  // error state display
  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <div>
      {/* render heatmap when data is loaded */}
      {traces.length > 0 && layout && (
        <Plot
          data={traces}
          layout={layout}
          config={{ responsive: true }}
        />
      )}
    </div>
  );
}

export default Heatmap;
