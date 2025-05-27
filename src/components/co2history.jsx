import React from 'react';
import Plot from 'react-plotly.js';

function CO2History() {
    const times = [
        '03:00', '04:00', '05:00', '06:00', '07:00', 
        '08:00', '09:00', '10:00', '11:00', '12:00', 
        '13:00', '14:00', '15:00'
    ];

    const co2 = [
        516.25, 510.83, 503.83, 501.92, 500.00,
        547.58, 640.00, 675.08, 713.42, 654.17,
        608.83, 647.25, 649.42
    ];

    const data = [{
        x: times,
        y: co2,
        type: 'scatter',
        mode: 'lines',
        line: { color: '#79D7B3' },
        name: 'CO₂ ppm'
    }];

    const layout = {
        title: {
            text: 'CO₂ History; Last 12 Hours',
            x: 0.5
        },
        xaxis: {
            title: 'Hour of Day',
            tickmode: 'array',
            tickvals: times,
            ticktext: times
        },
        yaxis: {
            title: 'CO₂ Concentration (ppm)',
            range: [400, 800]  
        },
        height: 550,
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

export default CO2History;


