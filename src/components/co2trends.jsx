import React from 'react';
import Plot from 'react-plotly.js';

function CO2Trends() {
    const weeks = [
        '2019-01-01', '2019-01-07', '2019-01-14', '2019-01-21', '2019-01-28',
        '2019-02-04', '2019-02-11', '2019-02-18', '2019-02-25',
        '2019-03-04', '2019-03-11', '2019-03-18', '2019-03-25'
    ];

    const weekLabels = [
        'Jan 1','Jan 7', 'Jan 14', 'Jan 21', 'Jan 28',
        'Feb 4', 'Feb 11', 'Feb 18', 'Feb 25',
        'Mar 4', 'Mar 11', 'Mar 18', 'Mar 25'
    ];

    const excellent = [
        93.06, 73.81, 74.40, 74.40, 78.57,
        73.21, 77.98, 65.48, 66.67,
        61.90, 47.02, 67.86, 67.86
    ];

    const fair = [
        6.94, 26.19, 25.60, 25.60, 21.43,
        26.79, 22.02, 34.52, 30.36,
        38.10, 39.29, 30.95, 31.55
    ];

    const needsImprovement = [
        0.00, 0.00, 0.00, 0.00, 0.00,
        0.00, 0.00, 0.00, 2.98,
        0.00, 13.69, 1.19, 0.60
    ];

    const data = [
        {
            x: weeks,
            y: excellent,
            name: 'Excellent',
            type: 'bar',
            marker: { color: '#5ABA8A' }
        },
        {
            x: weeks,
            y: fair,
            name: 'Fair',
            type: 'bar',
            marker: { color: '#FCD566' }
        },
        {
            x: weeks,
            y: needsImprovement,
            name: 'Needs Improvement',
            type: 'bar',
            marker: { color: '#E77D73' }
        }
    ];

    const layout = {
        barmode: 'stack',
        title: {
            text: 'Weekly Air Quality Breakdown (CO₂)',
            x: 0.5
        },
        xaxis: {
            title: 'Week',
            tickvals: weeks,
            ticktext: weekLabels,
            tickangle: 0
        },
        yaxis: {
            title: 'Percent Time',
            range: [0, 100]
        },
        legend: {
            orientation: 'v',
            x: 1.05,
            y: 1
        },
        margin: {
            r: 120
        },
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

export default CO2Trends;
