import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function BoxPlot({ selectedZone, selectedTimeRange }) {
  // state management for chart data and error handling
  const [traces, setTraces] = useState([]);
  const [layout, setLayout] = useState(null);
  const [error, setError] = useState(null);

  // human-readable time labels instead of 24-hour format numbers
  // makes the chart more user-friendly for facility managers
  const hourLabels = [
    '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM',
    '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  // converts aggregated csv statistics into plotly box plot format
  // using mean ± std dev to approximate quartiles since we don't have raw data points
  function createBoxPlotData(data) {
    console.log('Creating box plot data from:', data);
    
    // ensure all values are numeric for proper calculations
    data.forEach(d => {
      d.hour = +d.hour;
      d.mean = +d.mean;
      d.std = +d.std;
      d.min = +d.min;
      d.max = +d.max;
      d.count = +d.count;
    });

    const boxPlotData = [];
    
    // create separate box plot trace for each hour of the day
    data.forEach(d => {
      if (d.hour >= 0 && d.hour <= 23) {
        boxPlotData.push({
          type: 'box',
          // approximating box plot quartiles using statistical data
          // this is a workaround since we have aggregated data, not raw points
          y: [d.min, d.min, d.mean - d.std, d.mean, d.mean + d.std, d.max, d.max],
          name: hourLabels[d.hour], // friendly hour display
          boxpoints: false, // cleaner look without individual points
          marker: {
            color: '#3D72D5' // consistent blue theme
          },
          line: {
            width: 1.5
          },
          fillcolor: '#3D72D5',
          boxwidth: 0.9,
          showlegend: false, // avoid cluttered legend with 24 entries
          customdata: [[d.mean, d.min, d.max, d.std, d.count]], // for hover tooltips
          // detailed hover information for building operators
          hovertemplate: 
            '<b>Time:</b> %{x}<br>' +
            '<b>Mean Temperature:</b> %{customdata[0]:.1f}°C<br>' +
            '<b>Min:</b> %{customdata[1]:.1f}°C<br>' +
            '<b>Max:</b> %{customdata[2]:.1f}°C<br>' +
            '<b>Std Dev:</b> %{customdata[3]:.1f}°C<br>' +
            '<b>Data Points:</b> %{customdata[4]}<br>' +
            '<extra></extra>'
        });
      }
    });

    return boxPlotData;
  }

  useEffect(() => {
    console.log('Component mounted, starting data load...');

    // plotly layout configuration optimized for thermal comfort analysis
    const layoutConfig = {
      title: {
        text: `Temperature Variability - Zone ${selectedZone}`,
        x: 0.5, // centered title
      },
      yaxis: {
        title: 'Temperature (°C)',
        range: [20, 27], // focused range for hvac comfort zone
        gridcolor: '#E5E5E5',
        zeroline: false
      },
      xaxis: {
        title: '',
        gridcolor: '#E5E5E5',
        zeroline: false
      },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      boxmode: 'group',
      height: 750,
      width: 670,
      margin: { t: 80, b: 60, l: 80, r: 60 },
      // reference lines showing hvac setpoints for context
      shapes: [
        {
          // heating setpoint at 21°C
          type: 'line',
          x0: -0.5,
          x1: 23.5,
          y0: 21,
          y1: 21,
          line: {
            color: 'blue',
            width: 1.5,
            dash: 'dash'
          }
        },
        {
          // cooling setpoint at 25°C
          type: 'line',
          x0: -0.5,
          x1: 23.5,
          y0: 25,
          y1: 25,
          line: {
            color: 'red',
            width: 1.5,
            dash: 'dash'
          }
        }
      ],
      // labels for the setpoint reference lines
      annotations: [
        {
          x: 21,  
          y: 25.3,
          text: 'Cooling Set Point',
          showarrow: false,
          font: {
            color: 'red'
          }
        },
        {
          x: 21,  
          y: 20.7,
          text: 'Heating Set Point',
          showarrow: false,
          font: {
            color: 'blue'
          }
        }
      ]
    };
    setLayout(layoutConfig);

    // dynamic file loading based on user selections
    console.log(`Loading data for zone ${selectedZone} and time range ${selectedTimeRange}`);
    const fileName = selectedTimeRange === 'month' ? `may_zone${selectedZone}.csv` : `lastquarter_zone${selectedZone}.csv`;
    const dataPath = `/infovis-a3/data/thermal%20comfort/boxplot/${selectedTimeRange}/${fileName}`;
    console.log(`Loading data from: ${dataPath}`);
    
    // d3 csv loading with error handling
    d3.csv(dataPath)
      .then(data => {
        console.log('Data loaded successfully:', data);
        const boxPlotData = createBoxPlotData(data);
        setTraces(boxPlotData);
      })
      .catch(error => {
        console.error('Error loading the CSV file:', error);
        setError(error.message);
      });
  }, [selectedZone, selectedTimeRange]); // dependency array ensures re-fetch on prop changes

  // graceful error handling with user-friendly message
  if (error) {
    return <div className="p-4 text-red-600">Error loading data: {error}</div>;
  }

  return (
    <div className="w-full">
      {/* conditional rendering prevents empty chart flash */}
      {traces.length > 0 && layout && (
        <div className="flex justify-center">
          <Plot
            data={traces}
            layout={layout}
            config={{ responsive: true }}
          />
        </div>
      )}
    </div>
  );
}

export default BoxPlot;
