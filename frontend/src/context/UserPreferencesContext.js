import React, { createContext, useContext, useState, useEffect } from 'react';

const UserPreferencesContext = createContext();

export const useUserPreferences = () => useContext(UserPreferencesContext);

export const UserPreferencesProvider = ({ children }) => {
  // Get initial preferences from localStorage or system settings
  const getInitialPreferences = () => {
    const savedPreferences = localStorage.getItem('userPreferences');
    
    if (savedPreferences) {
      return JSON.parse(savedPreferences);
    }
    
    // Default preferences with system settings where possible
    return {
      textSize: 'default',
      highContrast: false,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      screenReaderOptimized: false,
      language: navigator.language.split('-')[0] || 'en',
      mapControls: {
        simplifiedControls: false,
        largeButtons: false,
        keyboardNavigation: true
      }
    };
  };

  const [preferences, setPreferences] = useState(getInitialPreferences);

  // Update text size preference
  const updateTextSize = (size) => {
    setPreferences(prev => ({
      ...prev,
      textSize: size
    }));
  };

  // Update high contrast preference
  const updateHighContrast = (enabled) => {
    setPreferences(prev => ({
      ...prev,
      highContrast: enabled
    }));
  };

  // Update reduced motion preference
  const updateMotionReduction = (enabled) => {
    setPreferences(prev => ({
      ...prev,
      reducedMotion: enabled
    }));
  };

  // Update screen reader optimization preference
  const updateScreenReader = (enabled) => {
    setPreferences(prev => ({
      ...prev,
      screenReaderOptimized: enabled
    }));
  };

  // Update language preference
  const updateLanguage = (language) => {
    setPreferences(prev => ({
      ...prev,
      language
    }));
  };

  // Update map control preferences
  const updateMapControls = (controls) => {
    setPreferences(prev => ({
      ...prev,
      mapControls: {
        ...prev.mapControls,
        ...controls
      }
    }));
  };

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Apply preferences to document
    document.documentElement.setAttribute('data-text-size', preferences.textSize);
    
    if (preferences.highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
    
    if (preferences.reducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    } else {
      document.documentElement.removeAttribute('data-reduced-motion');
    }
    
    if (preferences.screenReaderOptimized) {
      document.documentElement.setAttribute('data-screen-reader', 'true');
    } else {
      document.documentElement.removeAttribute('data-screen-reader');
    }
    
    document.documentElement.setAttribute('lang', preferences.language);
  }, [preferences]);

  const value = {
    preferences,
    updateTextSize,
    updateHighContrast,
    updateMotionReduction,
    updateScreenReader,
    updateLanguage,
    updateMapControls
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};