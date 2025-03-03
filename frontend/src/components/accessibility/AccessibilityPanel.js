import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { 
    preferences, 
    updateTextSize, 
    updateMotionReduction, 
    updateHighContrast,
    updateScreenReader
  } = useUserPreferences();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accessibility-panel ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="accessibility-toggle"
        onClick={togglePanel}
        aria-label={isOpen ? "Close accessibility panel" : "Open accessibility panel"}
        aria-expanded={isOpen}
      >
        <span className="sr-only">Accessibility</span>
        <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-10h2v5h-2zm0-4h2v2h-2z" fill="currentColor"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="panel-content" role="region" aria-label="Accessibility controls">
          <h3>Accessibility Options</h3>
          
          <div className="control-group">
            <label htmlFor="theme-select">Theme</label>
            <select 
              id="theme-select" 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="system">System Preference</option>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="text-size">Text Size</label>
            <select 
              id="text-size" 
              value={preferences.textSize} 
              onChange={(e) => updateTextSize(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="medium">Medium (1.1x)</option>
              <option value="large">Large (1.2x)</option>
              <option value="x-large">Extra Large (1.4x)</option>
            </select>
          </div>
          
          <div className="control-group checkbox">
            <input 
              type="checkbox" 
              id="high-contrast" 
              checked={preferences.highContrast}
              onChange={(e) => updateHighContrast(e.target.checked)}
            />
            <label htmlFor="high-contrast">High Contrast Mode</label>
          </div>
          
          <div className="control-group checkbox">
            <input 
              type="checkbox" 
              id="reduced-motion" 
              checked={preferences.reducedMotion}
              onChange={(e) => updateMotionReduction(e.target.checked)}
            />
            <label htmlFor="reduced-motion">Reduce Motion</label>
          </div>
          
          <div className="control-group checkbox">
            <input 
              type="checkbox" 
              id="screen-reader" 
              checked={preferences.screenReaderOptimized}
              onChange={(e) => updateScreenReader(e.target.checked)}
            />
            <label htmlFor="screen-reader">Screen Reader Optimized</label>
          </div>
          
          <div className="panel-footer">
            <button 
              className="close-panel" 
              onClick={togglePanel}
              aria-label="Close accessibility panel"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityPanel;