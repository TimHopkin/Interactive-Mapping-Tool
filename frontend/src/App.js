import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages and components
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import DataUpload from './pages/DataUpload';
import Analysis from './pages/Analysis';
import Navbar from './components/layout/Navbar';
import AccessibilityPanel from './components/accessibility/AccessibilityPanel';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import WelcomeGuide from './components/onboarding/WelcomeGuide';

function App() {
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(() => {
    return localStorage.getItem('welcomeGuideCompleted') !== 'true';
  });

  const dismissWelcomeGuide = () => {
    localStorage.setItem('welcomeGuideCompleted', 'true');
    setShowWelcomeGuide(false);
  };

  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <Router>
          <div className="App">
            <Navbar />
            <AccessibilityPanel />
            <main className="main-content">
              {showWelcomeGuide && <WelcomeGuide onDismiss={dismissWelcomeGuide} />}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/upload" element={<DataUpload />} />
                <Route path="/analysis" element={<Analysis />} />
              </Routes>
            </main>
            <footer className="app-footer">
              <div className="footer-content">
                <p>© 2025 Interactive Land Analysis Mapping Tool</p>
                <div className="footer-links">
                  <a href="/accessibility">Accessibility</a>
                  <a href="/help">Help Resources</a>
                  <a href="/feedback">Provide Feedback</a>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
}

export default App;