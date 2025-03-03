import React from 'react';
import { useUserPreferences } from '../../context/UserPreferencesContext';

const MapAccessibilityControls = ({ showTable, onToggleTable }) => {
  const { preferences, updateMapControls } = useUserPreferences();
  
  const toggleSimplifiedControls = () => {
    updateMapControls({
      simplifiedControls: !preferences.mapControls.simplifiedControls
    });
  };
  
  const toggleLargeButtons = () => {
    updateMapControls({
      largeButtons: !preferences.mapControls.largeButtons
    });
  };
  
  const toggleKeyboardNavigation = () => {
    updateMapControls({
      keyboardNavigation: !preferences.mapControls.keyboardNavigation
    });
  };

  return (
    <div className="map-accessibility-controls" role="group" aria-label="Map accessibility options">
      <div className="control-title" id="map-a11y-title">Map Accessibility</div>
      
      <div className="controls-wrapper">
        <button
          className={`a11y-control-btn ${showTable ? 'active' : ''}`}
          onClick={onToggleTable}
          aria-pressed={showTable}
          aria-label="Show data table view for screen readers"
        >
          <span className="icon-table" aria-hidden="true"></span>
          <span className="btn-text">Data Table</span>
        </button>
        
        <button
          className={`a11y-control-btn ${preferences.mapControls.simplifiedControls ? 'active' : ''}`}
          onClick={toggleSimplifiedControls}
          aria-pressed={preferences.mapControls.simplifiedControls}
          aria-label="Toggle simplified map controls"
        >
          <span className="icon-simplified" aria-hidden="true"></span>
          <span className="btn-text">Simplified</span>
        </button>
        
        <button
          className={`a11y-control-btn ${preferences.mapControls.largeButtons ? 'active' : ''}`}
          onClick={toggleLargeButtons}
          aria-pressed={preferences.mapControls.largeButtons}
          aria-label="Toggle large map control buttons"
        >
          <span className="icon-large-buttons" aria-hidden="true"></span>
          <span className="btn-text">Large Buttons</span>
        </button>
        
        <button
          className={`a11y-control-btn ${preferences.mapControls.keyboardNavigation ? 'active' : ''}`}
          onClick={toggleKeyboardNavigation}
          aria-pressed={preferences.mapControls.keyboardNavigation}
          aria-label="Toggle keyboard navigation"
        >
          <span className="icon-keyboard" aria-hidden="true"></span>
          <span className="btn-text">Keyboard</span>
        </button>
      </div>
      
      <div className="a11y-help">
        <button 
          className="help-icon"
          aria-label="Show map accessibility help"
          aria-expanded="false"
        >
          <span aria-hidden="true">?</span>
        </button>
        <div className="help-tooltip" role="tooltip">
          <h4>Map Accessibility Options</h4>
          <ul>
            <li><strong>Data Table:</strong> View map data in a screen reader-friendly table format</li>
            <li><strong>Simplified:</strong> Reduce visual complexity and distractions</li>
            <li><strong>Large Buttons:</strong> Enlarge map control buttons for easier targeting</li>
            <li><strong>Keyboard:</strong> Enable arrow key navigation and shortcuts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapAccessibilityControls;