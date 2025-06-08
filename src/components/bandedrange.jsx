import React from 'react';
import Plot from 'react-plotly.js';

// calculations below are based on the following paper: https://comfort.arup.com/Predicting%20Thermal%20Comfort%20for%20Diverse%20Populations.pdf 
// and lots of perplexity + chatgpt 🙏 

function BandedRange() {
    // array of demographic groups with their comfort temperature centers and colors
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

    // create plotly data traces for each demographic group
    // each trace is a horizontal line showing comfort range (±2°c from center)
    const data = demographics.map((d) => ({
        x: [d.center - 2, d.center + 2], // start and end of comfort range
        y: [d.name, d.name], // horizontal line at demographic name
        mode: 'lines',
        line: { width: 20, color: d.color }, // thick colored line
        name: d.name,
        hoverinfo: 'text',
        hovertext: `${d.name}: ${(d.center-2).toFixed(1)}–${(d.center+2).toFixed(1)} °C`
    }));

    // background colored zones for temperature sensations
    const bgShapes = [
        {
            // cold zone (blue)
            type: 'rect', xref: 'x', yref: 'paper',
            x0: 18, x1: 21, y0: 0, y1: 1,
            fillcolor: 'rgba(100,149,237,0.1)', line: { width: 0 }
        },
        {
            // neutral comfort zone (green)
            type: 'rect', xref: 'x', yref: 'paper',
            x0: 21, x1: 25, y0: 0, y1: 1,
            fillcolor: 'rgba(50,205,50,0.1)', line: { width: 0 }
        },
        {
            // warm/hot zone (red)
            type: 'rect', xref: 'x', yref: 'paper',
            x0: 25, x1: 28, y0: 0, y1: 1,
            fillcolor: 'rgba(255,99,71,0.1)', line: { width: 0 }
        }
    ];

    // text labels for the background zones
    const bgAnnotations = [
        { x: 19.5,  y: 1.02, xref: 'x', yref: 'paper', text: 'Cold Sensation', showarrow: false },
        { x: 23,    y: 1.02, xref: 'x', yref: 'paper', text: 'Neutral Comfort Zone', showarrow: false },
        { x: 26.5,  y: 1.02, xref: 'x', yref: 'paper', text: 'Warm/Hot Sensation', showarrow: false }
    ];

    // plotly layout configuration
    const layout = {
        title: { 
            text: 'Thermal Comfort Ranges by Demographic', 
            font: { size: 22 },
            x: 0.5 // center the title
        },
        xaxis: { 
            title: 'Air Temperature (°C)', 
            range: [18, 28], // temperature range to display
            dtick: 1 // tick marks every 1 degree
        },
        yaxis: {
            title: { text: 'Demographic Group', standoff: 20 },
            automargin: true, // auto adjust margins for labels
            tickfont: { size: 12 }
        },
        shapes: bgShapes, // add background colored zones
        annotations: bgAnnotations, // add zone labels
        margin: { t: 80, b: 100 }, // top and bottom margins
        legend: { orientation: 'h', y: -0.2 }, // horizontal legend below chart
        height: 750,
        width: 1356, // fixed dimensions
        plot_bgcolor: 'white',
        paper_bgcolor: 'white'
    };

    return (
        <div>
            <Plot 
                data={data} 
                layout={layout}
                config={{ responsive: true }} // make chart responsive
            />
        </div>
    );
}

export default BandedRange;
