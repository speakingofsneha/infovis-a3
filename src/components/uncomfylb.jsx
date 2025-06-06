import React from 'react';

// static data representing thermal comfort metrics for different building zones
// each entry contains zone name, floor number, comfort percentage, and recent change
const data = [
  { zone: 'Lobby', floor: 0, comfort: 8, change: -6 },
  { zone: 'Manly', floor: 30, comfort: 32, change: 13 },
  { zone: 'Cronulla', floor: 0, comfort: 48, change: -18 },
  { zone: 'Bondi', floor: 0, comfort: 56, change: -21 },
  { zone: 'Shelly', floor: 28, comfort: 68, change: 31 },
  { zone: 'Bondi', floor: 30, comfort: 76, change: -10 },
];

// determines color coding based on thermal comfort percentage
// uses traffic light system: red (poor), yellow (fair), green (good)
function getBarColor(val) {
  if (val <= 32) return 'rgba(230, 80, 80, 0.8)';      // red for poor comfort (≤32%)
  if (val <= 68) return 'rgba(240, 200, 80, 0.8)';      // yellow for fair comfort (33-68%)
  return 'rgba(80, 200, 140, 0.8)';                     // green for good comfort (≥69%)
}

// styling for progress bar container with rounded corners and gray background
const progressBarContainerStyle = {
  display: 'inline-block',
  height: 12,
  width: 160, // fixed width for consistent visual alignment
  background: '#ececec', // light gray background
  borderRadius: 8,
  verticalAlign: 'middle',
  marginLeft: 8,
  marginRight: 2,
  position: 'relative',
  overflow: 'hidden', // ensures fill doesn't exceed container bounds
};

// dynamic styling for progress bar fill based on comfort percentage
const progressFillStyle = (val) => ({
  height: '100%',
  width: `${val}%`, // width represents comfort percentage
  background: getBarColor(val), // color matches comfort level
  borderRadius: 8,
  transition: 'width 0.3s', // smooth animation when values change
  position: 'absolute',
  left: 0,
  top: 0,
});

function UncomfortableSpacesTable() {
  return (
    // main container with white background and rounded corners
    <div style={{
      background: '#fff',
      borderRadius: 5,
      padding: 32,
      maxWidth: 950, // constrain width for better readability
    }}>
      {/* table title with emphasis styling */}
      <div style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: 24, color: '#444' }}>
        Spaces that are uncomfortable
      </div>
      
      {/* data table with full width and collapsed borders */}
      <table style={{fontSize: '1rem', width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr>
            {/* table headers with consistent styling and borders */}
            <th style={thStyle}>Zone Name</th>
            <th style={thStyle}>Floor</th>
            <th style={thStyle}>Thermal comfort</th>
            <th style={{...thStyle, borderRight: '1px solid #e5e7eb'}}>Change</th>
          </tr>
        </thead>
        <tbody>
          {/* dynamically render table rows from data array */}
          {data.map((row, i) => (
            <tr key={i}>
              {/* zone name cell */}
              <td style={{...tdStyle, borderRight: '1px solid #e5e7eb'}}>{row.zone}</td>
              
              {/* floor number cell */}
              <td style={{...tdStyle, borderRight: '1px solid #e5e7eb'}}>{row.floor}</td>
              
              {/* thermal comfort cell with percentage and visual progress bar */}
              <td style={{...tdStyle, borderRight: '1px solid #e5e7eb', paddingRight: 2}}>
                {/* percentage text with color coding */}
                <span style={{
                  fontWeight: 500,
                  color: getBarColor(row.comfort), // text color matches bar color
                  marginRight: 8,
                  minWidth: 32,
                  display: 'inline-block',
                  textAlign: 'right' // right-align numbers for better scanning
                }}>
                  {row.comfort}%
                </span>
                
                {/* progress bar visualization */}
                <span style={progressBarContainerStyle}>
                  <span style={progressFillStyle(row.comfort)} />
                </span>
              </td>
              
              {/* change percentage with + prefix for positive values */}
              <td style={tdStyle}>{row.change > 0 ? `+${row.change}%` : `${row.change}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// consistent header styling with gray background and bold text
const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  background: '#fafbfc', // light gray background for headers
  borderBottom: '2px solid #e5e7eb', // thicker bottom border for separation
  borderRight: '1px solid #e5e7eb',
  fontWeight: 600,
  fontSize: '1rem',
  color: '#444'
};

// consistent cell styling with white background and subtle borders
const tdStyle = {
  padding: '12px 16px',
  fontSize: '1rem',
  color: '#333',
  background: '#fff',
  borderBottom: '1px solid #e5e7eb', // subtle row separation
};

export default UncomfortableSpacesTable;
