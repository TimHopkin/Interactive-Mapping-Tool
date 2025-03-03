import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Get initial theme preference (system, light, dark)
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Default to system preference
    return 'system';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [currentTheme, setCurrentTheme] = useState('light'); // Actual applied theme

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    // Set initial value
    handleChange();
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  // Update current theme when theme preference changes
  useEffect(() => {
    if (theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(isDarkMode ? 'dark' : 'light');
    } else {
      setCurrentTheme(theme);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Apply theme to the document
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [theme, currentTheme]);

  const value = {
    theme,
    setTheme,
    currentTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};