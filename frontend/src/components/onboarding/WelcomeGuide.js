import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const WelcomeGuide = ({ onDismiss }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    experienceLevel: 'beginner',
    primaryUse: 'visualization',
    interestAreas: []
  });

  // Guide steps content
  const steps = [
    {
      title: "Welcome to the Land Analysis Mapping Tool",
      content: (
        <>
          <p>This interactive tool helps you analyze land-related data with powerful mapping and analysis features.</p>
          <p>We've designed this with accessibility and usability in mind, so everyone can gain insights from spatial data.</p>
          <p>Let's take a quick tour to get you started.</p>
        </>
      )
    },
    {
      title: "Tell Us About You",
      content: (
        <>
          <p>Helping us understand your experience level and interests will allow us to customize your experience.</p>
          
          <div className="form-group">
            <label htmlFor="experience-level">Your experience with mapping tools:</label>
            <select 
              id="experience-level"
              value={userPreferences.experienceLevel}
              onChange={(e) => setUserPreferences({...userPreferences, experienceLevel: e.target.value})}
            >
              <option value="beginner">Beginner - I'm new to mapping tools</option>
              <option value="intermediate">Intermediate - I've used similar tools before</option>
              <option value="advanced">Advanced - I'm experienced with GIS software</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="primary-use">Your primary use for this tool:</label>
            <select 
              id="primary-use"
              value={userPreferences.primaryUse}
              onChange={(e) => setUserPreferences({...userPreferences, primaryUse: e.target.value})}
            >
              <option value="visualization">Data Visualization</option>
              <option value="analysis">Spatial Analysis</option>
              <option value="planning">Urban/Rural Planning</option>
              <option value="environmental">Environmental Assessment</option>
              <option value="education">Education/Research</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Areas of interest (select all that apply):</label>
            <div className="checkbox-group">
              {['Land Use', 'Environment', 'Demographics', 'Infrastructure', 'Climate'].map(area => (
                <div key={area} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`interest-${area.toLowerCase().replace(' ', '-')}`}
                    checked={userPreferences.interestAreas.includes(area)}
                    onChange={(e) => {
                      const updatedAreas = e.target.checked
                        ? [...userPreferences.interestAreas, area]
                        : userPreferences.interestAreas.filter(item => item !== area);
                      setUserPreferences({...userPreferences, interestAreas: updatedAreas});
                    }}
                  />
                  <label htmlFor={`interest-${area.toLowerCase().replace(' ', '-')}`}>{area}</label>
                </div>
              ))}
            </div>
          </div>
        </>
      )
    },
    {
      title: "Key Features",
      content: (
        <>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">🗺️</div>
              <h3>Interactive Mapping</h3>
              <p>Visualize your data on customizable maps with multiple layer support.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">📊</div>
              <h3>Data Analysis</h3>
              <p>Apply clustering, buffering, and other spatial analyses to derive insights.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">📤</div>
              <h3>Data Upload</h3>
              <p>Import your own datasets in various formats, including shapefiles and GeoJSON.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">🔄</div>
              <h3>Data Integration</h3>
              <p>Combine your data with external sources for comprehensive analysis.</p>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Accessibility Features",
      content: (
        <>
          <p>We've designed this tool to be accessible to everyone. Here are some of the accessibility features available:</p>
          
          <ul className="accessibility-features-list">
            <li>
              <strong>Customizable Display:</strong> Adjust text size, contrast, and color themes to suit your preferences.
            </li>
            <li>
              <strong>Keyboard Navigation:</strong> All features are accessible via keyboard shortcuts.
            </li>
            <li>
              <strong>Screen Reader Support:</strong> We've optimized the interface for screen readers with ARIA attributes.
            </li>
            <li>
              <strong>Reduced Motion Option:</strong> Disable animations for a more comfortable experience.
            </li>
            <li>
              <strong>Text Alternatives:</strong> All images have descriptive alt text and visualizations include data tables.
            </li>
          </ul>
          
          <p>You can access these options anytime through the accessibility panel on the side of the screen.</p>
        </>
      )
    },
    {
      title: "Ready to Get Started?",
      content: (
        <>
          <p>You're all set to begin exploring the Interactive Land Analysis Mapping Tool!</p>
          
          <p>Based on your selections, we recommend starting with:</p>
          
          {userPreferences.experienceLevel === 'beginner' ? (
            <div className="recommendation">
              <h3>For beginners:</h3>
              <ul>
                <li>Check out our <Link to="/help/tutorials">beginner tutorials</Link></li>
                <li>Explore the <Link to="/map">map view</Link> with sample datasets</li>
                <li>Try a guided analysis using the <Link to="/analysis/guided">step-by-step wizard</Link></li>
              </ul>
            </div>
          ) : (
            <div className="recommendation">
              <h3>For experienced users:</h3>
              <ul>
                <li><Link to="/upload">Upload your own data</Link> to get started</li>
                <li>Explore our <Link to="/analysis">advanced analysis tools</Link></li>
                <li>Check out our <Link to="/api-docs">API documentation</Link> for programmatic access</li>
              </ul>
            </div>
          )}
          
          <p>Remember, you can access help resources at any time by clicking the Help button in the navigation bar.</p>
        </>
      )
    }
  ];

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finishGuide = () => {
    // Save user preferences
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    onDismiss();
  };

  // Skip tour function
  const skipTour = () => {
    onDismiss();
  };

  return (
    <div className="welcome-guide-overlay" role="dialog" aria-labelledby="welcome-guide-title">
      <div className="welcome-guide">
        <button className="close-guide" onClick={skipTour} aria-label="Skip tour">
          <span aria-hidden="true">×</span>
        </button>
        
        <div className="guide-progress">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              aria-hidden="true"
            ></div>
          ))}
        </div>
        
        <div className="guide-content">
          <h2 id="welcome-guide-title">{steps[currentStep].title}</h2>
          <div className="step-content">
            {steps[currentStep].content}
          </div>
        </div>
        
        <div className="guide-navigation">
          {currentStep > 0 && (
            <button 
              className="prev-button" 
              onClick={goToPreviousStep}
              aria-label="Go to previous step"
            >
              Back
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button 
              className="next-button" 
              onClick={goToNextStep}
              aria-label="Go to next step"
            >
              Next
            </button>
          ) : (
            <button 
              className="finish-button" 
              onClick={finishGuide}
              aria-label="Finish tour and get started"
            >
              Get Started
            </button>
          )}
          
          {currentStep < steps.length - 1 && (
            <button 
              className="skip-button" 
              onClick={skipTour}
              aria-label="Skip tour"
            >
              Skip Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;