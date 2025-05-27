import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function Boxplot() {
  const [boxPlotData, setBoxPlotData] = useState([]);

  useEffect(() => {
    d3.csv('data/rawzone31_oct.csv').then(data => {
      if (!data || data.length === 0) {
        console.error("No data found in CSV.");
        return;
      }

      data.forEach(entry => {
        entry.ta = parseFloat(entry.ta);  
        const timestamp = new Date(entry.created_at);
        entry.hour = timestamp.getHours();
      });

      const hourlyData = {};
      for (let h = 0; h < 24; h++) {
        hourlyData[h] = [];
      }

      data.forEach(entry => {
        if (entry.hour >= 0 && entry.hour <= 23) {  
          hourlyData[entry.hour].push(entry.ta);
        }
      });

      const hourLabels = [
        '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM',
        '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
        '6 PM', '7 PM', '8 PM'
      ];
      
      const newBoxPlotData = [];
      for (let h = 0; h <= 20; h++) {
        const hourTemps = hourlyData[h] || [];

        if (hourTemps.length > 0) {
          newBoxPlotData.push({
            type: 'box',
            y: hourTemps,
            name: hourLabels[h],
            boxpoints: false,
            marker: {
              color: '#3D72D5' 
            },
            line: {
              width: 2
            },
            fillcolor: '#3D72D5',
            boxwidth: 0.9
          });
        }
      }
      setBoxPlotData(newBoxPlotData);
    }).catch(error => {
      console.error('Error loading the data:', error);
    });
  }, []);

  const layout = {
    title: {
      text: "Temperature Variability- Manly",
      x: 0.5,
    },
    yaxis: {
      title: 'Degrees (°C)',
      range: [20, 28],  
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
    showlegend: false,
    height:750,
    width: 670,
    shapes: [
      {
        type: 'line',
        x0: -0.5,
        x1: 20.5,
        y0: 21,
        y1: 21,
        line: {
          color: 'blue',
          width: 1.5,
          dash: 'dash'
        }
      },
      {
        type: 'line',
        x0: -0.5,
        x1: 20.5,
        y0: 25,
        y1: 25,
        line: {
          color: 'red',
          width: 1.5,
          dash: 'dash'
        }
      }
    ],
    annotations: [
      {
        x: 18,  
        y: 25.3,
        text: 'Cooling Set Point',
        showarrow: false,
        font: {
          color: 'red'
        }
      },
      {
        x: 18,  
        y: 20.7,
        text: 'Heating Set Point',
        showarrow: false,
        font: {
          color: 'blue'
        }
      }
    ]
  };

  return (
    <div>
      <Plot data={boxPlotData} layout={layout} />
    </div>
  );
}

export default Boxplot;