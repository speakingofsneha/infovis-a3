import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hours = [...Array(24).keys()].map(h => {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12} ${ampm}`;
});

function Heatmap() {
  const [zData, setZData] = useState(Array.from({ length: 24 }, () => Array(7).fill(null)));

  useEffect(() => {
    d3.csv("data/zone31_norm.csv").then(data => {
      const z = Array.from({ length: 24 }, () => Array(7).fill(null));
      data.forEach(row => {
        const dayIndex = days.indexOf(row.day_name);
        const hourIndex = +row.hour;
        const temp = +row.ta;
        if (dayIndex !== -1 && hourIndex !== -1) {
          z[hourIndex][dayIndex] = temp;
        }
      });
      setZData(z);
    }).catch(error => {
      console.error('Error loading the CSV file:', error);
    });
  }, []);

  const heatmap = {
    x: days,
    y: hours,
    z: zData,
    type: 'heatmap',
    colorscale: [
      [0, '#3F8BEA'],
      [0.2, '#3F8BEA'],
      [0.4, '#28B1B7'],
      [0.6, '#95B295'],
      [0.9, '#ED8F89'],
      [1, '#F8857E']
    ],
    zmin: 22,
    zmax: 26,
    colorbar: {
      title: 'Temperature (°C)',
      titleside: 'right',
      len: 0.5,
      thickness: 15,
      titlefont: { size: 14 },
      tickfont: { size: 12 },
      xpad: 20
    },
    showscale: true,
    hoverongaps: false,
    hovertemplate: '<b>Day:</b> %{x}<br><b>Time:</b> %{y}<br><b>Temp:</b> %{z}°C<br><extra></extra>'
  };

  const layout = {
    title: {
      text: "Avg Temp- Manly",
      x: 0.5,
    },
    xaxis: {
      title: '',
      side: 'bottom',
      tickangle: 0,
      ticktext: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      tickvals: [...Array(days.length).keys()],
      tickfont: { size: 14 },
      automargin: true
    },
    yaxis: {
      title: '',
      autorange: 'reversed',
      tickangle: 0,
      tickvals: [...Array(24).keys()],
      tickfont: { size: 14 },
      automargin: true
    },
    margin: { t: 100, b: 50, l: 100, r: 50 },
    plot_bgcolor: '#f0f0f0',
    height:750,
    width: 670,
    shapes: [
      ...Array(days.length - 1).fill().map((_, i) => ({
        type: 'line',
        x0: i + 0.5,
        x1: i + 0.5,
        y0: -0.5,
        y1: hours.length - 0.5,
        line: {
          color: i === 0 || i === days.length - 2 ? 'white' : 'black',
          width: i === 0 || i === days.length - 2 ? 2 : 0.5
        }
      })),
      ...Array(hours.length - 1).fill().map((_, i) => ({
        type: 'line',
        y0: i + 0.5,
        y1: i + 0.5,
        x0: -0.5,
        x1: days.length - 0.5,
        line: { color: 'black', width: 0.5 }
      }))
    ]
  };

  return (
    <div>
      <Plot data={[heatmap]} layout={layout} />
    </div>
  );
}

export default Heatmap;
