import React from 'react';
import Plot from 'react-plotly.js';

function BandedRange() {
    const demographics = [
        { name: 'Lean Build',           center: 24.5, color: 'rgba(148,103,189,0.6)' },
        { name: 'Older Male',     center: 23.5, color: 'rgba(44,160,44,0.6)' },
        { name: 'Young Female',   center: 23.5, color: 'rgba(214,39,40,0.6)' },
        { name: 'Mid-aged Male',  center: 22, color: 'rgba(44,62,80,0.6)' },
        { name: 'Heavy Build',          center: 22, color: 'rgba(140,86,75,0.6)' },
        { name: 'Older Female',   center: 24.5, color: 'rgba(255,127,14,0.6)' },
        { name: 'Average Build',        center: 23, color: 'rgba(23,162,184,0.6)' },
        { name: 'Young Male',     center: 22.5, color: 'rgba(31,119,180,0.6)' },
        { name: 'Mid-aged Female',center: 23, color: 'rgba(255,87,51,0.6)' }
    ];

    const data = demographics.map((d) => ({
        x: [d.center - 2, d.center + 2],
        y: [d.name, d.name],
        mode: 'lines',
        line: { width: 20, color: d.color },
        name: d.name,
        hoverinfo: 'text',
        hovertext: `${d.name}: ${(d.center-2).toFixed(1)}–${(d.center+2).toFixed(1)} °C`
    }));

    const bgShapes = [
        {
            type: 'rect', xref: 'x', yref: 'paper',
            x0: 18, x1: 21, y0: 0, y1: 1,
            fillcolor: 'rgba(100,149,237,0.1)', line: { width: 0 }
        },
        {
            type: 'rect', xref: 'x', yref: 'paper',
            x0: 21, x1: 25, y0: 0, y1: 1,
            fillcolor: 'rgba(50,205,50,0.1)', line: { width: 0 }
        },
        {
            type: 'rect', xref: 'x', yref: 'paper',
            x0: 25, x1: 28, y0: 0, y1: 1,
            fillcolor: 'rgba(255,99,71,0.1)', line: { width: 0 }
        }
    ];

    const bgAnnotations = [
        { x: 19.5,  y: 1.02, xref: 'x', yref: 'paper', text: 'Cold Sensation', showarrow: false },
        { x: 23,    y: 1.02, xref: 'x', yref: 'paper', text: 'Neutral Comfort Zone', showarrow: false },
        { x: 26.5,  y: 1.02, xref: 'x', yref: 'paper', text: 'Warm/Hot Sensation', showarrow: false }
    ];

    const layout = {
        title: { 
            text: 'Thermal Comfort Ranges by Demographic', 
            font: { size: 22 },
            x: 0.5
        },
        xaxis: { 
            title: 'Air Temperature (°C)', 
            range: [18, 28], 
            dtick: 1 
        },
        yaxis: {
            title: { text: 'Demographic Group', standoff: 20 },
            automargin: true,
            tickfont: { size: 12 }
        },
        shapes: bgShapes,
        annotations: bgAnnotations,
        margin: { t: 80, b: 100 },
        legend: { orientation: 'h', y: -0.2 },
        height: 750,
        width: 1356,
        plot_bgcolor: 'white',
        paper_bgcolor: 'white'
    };

    return (
        <div>
            <Plot 
                data={data} 
                layout={layout}
                config={{ responsive: true }}
            />
        </div>
    );
}

export default BandedRange;