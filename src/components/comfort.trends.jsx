import React from 'react';
import Plot from 'react-plotly.js';

function ComfortTrends() {
    const weeks = [
        '2019-01-01', '2019-01-07', '2019-01-14', '2019-01-21', '2019-01-28',
        '2019-02-04', '2019-02-11', '2019-02-18', '2019-02-25',
        '2019-03-04', '2019-03-11', '2019-03-18', '2019-03-25'
    ];

    // short labels for x-axis
    const weekLabels = [
        'Jan 1','Jan 7', 'Jan 14', 'Jan 21', 'Jan 28',
        'Feb 4', 'Feb 11', 'Feb 18', 'Feb 25',
        'Mar 4', 'Mar 11', 'Mar 18', 'Mar 25'
    ];

    const comfortable = [
        34.72, 44.05, 39.29, 47.02, 33.93,
        46.43, 44.05, 69.64, 75.60,
        55.95, 75.00, 77.98, 81.55
    ];

    const tooHot = [
        65.28, 55.95, 60.71, 52.98, 66.07,
        53.57, 55.95, 30.36, 24.40,
        44.05, 25.00, 22.02, 18.45
    ];

    const tooCold = Array(weeks.length).fill(0); // all 0%

    const data = [
        {
            x: weeks,
            y: comfortable,
            name: 'Comfortable',
            type: 'bar',
            marker: { color: '#FDD07A' }
        },
        {
            x: weeks,
            y: tooHot,
            name: 'Too Hot',
            type: 'bar',
            marker: { color: '#FF7057' }
        },
        {
            x: weeks,
            y: tooCold,
            name: 'Too Cold',
            type: 'bar',
            marker: { color: '#3D72D5' }
        }
    ];

    const layout = {
        barmode: 'stack',
        title: {
            text: 'Weekly Comfort Conditions',
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
            <Plot data={data} layout={layout} />
        </div>
    );
}

export default ComfortTrends;

