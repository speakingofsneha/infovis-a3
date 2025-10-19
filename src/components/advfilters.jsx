import React, { useState } from 'react';
import '../styles/analytics.scss';

/* Note: This component is not fully functional- the drop downs are there but does not actually filter data for the 
uncomfylb table (due to time constraints) to provide the user an understanding of the application would work (if fully functional).
The data shown in the table is filtered for time range last month (may) compared to its previous month, for only weekdays and working hours. 
The temperature considered too cold is 21°c and too hot is 25°c (Default filtering). You can refer to /infovis-a3/data/comfort_leaderboard.csv to understand how I got the data in the table. 
*/ 

// simple svg icon for the filter button - keeping it inline since it's small and specific to this component
const FilterIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="filter-icon">
    <path d="M2 4h12M4 8h8M6 12h4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// dropdown arrow icon - also inline since it's tightly coupled to the dropdown component
const DownArrow = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="dropdown-arrow">
    <path d="M6 8l4 4 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// wrapper component to handle the custom dropdown styling
// we need this because native select elements are notoriously hard to style consistently across browsers
function Dropdown({ children, className, ...props }) {
  return (
    <div className="dropdown-wrapper">
      {/* spread props to allow passing through all select attributes like defaultValue, onChange etc */}
      <select {...props} className={`dropdown ${className || ''}`}>
        {children}
      </select>
      {/* positioned absolutely within the wrapper to overlay the default arrow */}
      <DownArrow />
    </div>
  );
}

function AdvancedFilters() {
  // track whether advanced filters are shown - starts collapsed for cleaner initial ui
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="advanced-filters">
      {/* top section always visible - contains basic filters and toggle button */}
      <div className={`top-bar ${showAdvanced ? 'expanded' : 'collapsed'}`}>
        <div className="top-row">
          {/* time range selector - most commonly used filter so it's prominent */}
          <div className="field-group">
            <label className="field-label">Time range</label>
            <Dropdown defaultValue="last-month">
              <option value="last-month">Last month</option>
              <option value="last-quarter">Last quarter</option>
            </Dropdown>
          </div>
          
          {/* visual separator to group related fields */}
          <div className="separator">/</div>
          
          {/* comparison period - pairs naturally with time range */}
          <div className="field-group">
            <label className="field-label">Compare with previous</label>
            <Dropdown defaultValue="month">
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
            </Dropdown>
          </div>
        </div>
        
        {/* toggle button positioned on the right for easy access */}
        <button
          className="toggle-button"
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <FilterIcon />
          {/* dynamic text based on current state */}
          {showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'}
        </button>
      </div>
      
      {/* advanced section only renders when needed - keeps dom clean */}
      {showAdvanced && (
        <div className="advanced-content">
          {/* second row for schedule-related filters */}
          <div className="advanced-row">
            {/* days of week gets wider field since the options are longer */}
            <div className="field-group field-group--wide">
              <label className="field-label">Days of the week</label>
              <Dropdown defaultValue="weekdays">
                <option value="weekdays">Weekdays (mon-fri)</option>
                <option value="weekends">Weekends (sat-sun)</option>
                <option value="all">All days</option>
              </Dropdown>
            </div>
            
            <div className="separator">/</div>
            
            {/* operating hours pairs logically with days of week */}
            <div className="field-group">
              <label className="field-label">Operating hours</label>
              <Dropdown defaultValue="9-5">
                <option value="9-5">9 am- 5pm</option>
                <option value="8-6">8 am- 6pm</option>  
                <option value="all">All hours</option>
              </Dropdown>
            </div>
          </div>
          
          {/* temperature controls get their own row since they're conceptually different */}
          <div className="temperature-row">
            {/* smaller fields since temperature values are short */}
            <div className="field-group field-group--small">
              <label className="field-label">Too cold below</label>
              <Dropdown defaultValue="21">
                <option value="21">21°c</option>
                <option value="20">20°c</option>
                <option value="19">19°c</option>
                <option value="18">18°c</option>
                <option value="17">17°c</option>
              </Dropdown>
            </div>
            
            <div className="separator">/</div>
            
            <div className="field-group field-group--small">
              <label className="field-label">Too hot above</label>
              <Dropdown defaultValue="25">
                <option value="25">25°c</option>
                <option value="26">26°c</option>
                <option value="27">27°c</option>
                <option value="28">28°c</option>
                <option value="29">29°c</option>
              </Dropdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;
