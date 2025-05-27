import React from 'react';

const data = [
  { zone: 'Lobby', floor: 0, comfort: 8, change: -6 },
  { zone: 'Manly', floor: 30, comfort: 32, change: 13 },
  { zone: 'Cronulla', floor: 0, comfort: 48, change: -18 },
  { zone: 'Bondi', floor: 0, comfort: 56, change: -21 },
  { zone: 'Shelly', floor: 28, comfort: 68, change: 31 },
  { zone: 'Bondi', floor: 30, comfort: 76, change: -10 },
];

// Color logic for bars
function getBarColor(val) {
  if (val <= 32) return 'rgba(230, 80, 80, 0.8)';      // Red
  if (val <= 68) return 'rgba(240, 200, 80, 0.8)';      // Yellow
  return 'rgba(80, 200, 140, 0.8)';                     // Green
}

const progressBarContainerStyle = {
  display: 'inline-block',
  height: 12,
  width: 160,
  background: '#ececec',
  borderRadius: 8,
  verticalAlign: 'middle',
  marginLeft: 8,
  marginRight: 2,
  position: 'relative',
  overflow: 'hidden',
};

const progressFillStyle = (val) => ({
  height: '100%',
  width: `${val}%`,
  background: getBarColor(val),
  borderRadius: 8,
  transition: 'width 0.3s',
  position: 'absolute',
  left: 0,
  top: 0,
});

function UncomfortableSpacesTable() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 5,
      padding: 32,
      maxWidth: 950,
    }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: 24, color: '#444' }}>
        Spaces that are uncomfortable
      </div>
      <table style={{fontSize: '1rem', width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr>
            <th style={thStyle}>Zone Name</th>
            <th style={thStyle}>Floor</th>
            <th style={thStyle}>Thermal comfort</th>
            <th style={{...thStyle, borderRight: '1px solid #e5e7eb'}}>Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={{...tdStyle, borderRight: '1px solid #e5e7eb'}}>{row.zone}</td>
              <td style={{...tdStyle, borderRight: '1px solid #e5e7eb'}}>{row.floor}</td>
              <td style={{...tdStyle, borderRight: '1px solid #e5e7eb', paddingRight: 2}}>
                <span style={{
                  fontWeight: 500,
                  color: getBarColor(row.comfort),
                  marginRight: 8,
                  minWidth: 32,
                  display: 'inline-block',
                  textAlign: 'right'
                }}>
                  {row.comfort}%
                </span>
                <span style={progressBarContainerStyle}>
                  <span style={progressFillStyle(row.comfort)} />
                </span>
              </td>
              <td style={tdStyle}>{row.change > 0 ? `+${row.change}%` : `${row.change}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  background: '#fafbfc',
  borderBottom: '2px solid #e5e7eb',
  borderRight: '1px solid #e5e7eb',
  fontWeight: 600,
  fontSize: '1rem',
  color: '#444'
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '1rem',
  color: '#333',
  background: '#fff',
  borderBottom: '1px solid #e5e7eb',
};

export default UncomfortableSpacesTable;
