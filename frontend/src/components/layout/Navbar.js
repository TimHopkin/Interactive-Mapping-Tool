import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { currentTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Close menu when clicking a link
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`main-nav ${currentTheme} ${menuOpen ? 'menu-open' : ''}`} role="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" onClick={closeMenu}>
            <img 
              src="/logo.svg" 
              alt="Interactive Land Analysis Mapping Tool" 
              className="logo-image"
            />
            <span className="logo-text">LandMap</span>
          </Link>
        </div>
        
        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="hamburger"></span>
          <span className="sr-only">Menu</span>
        </button>
        
        <div className={`nav-links ${menuOpen ? 'visible' : ''}`}>
          <ul>
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''} 
                onClick={closeMenu}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                <span className="icon-dashboard" aria-hidden="true"></span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/map" 
                className={isActive('/map') ? 'active' : ''} 
                onClick={closeMenu}
                aria-current={isActive('/map') ? 'page' : undefined}
              >
                <span className="icon-map" aria-hidden="true"></span>
                Map View
              </Link>
            </li>
            <li>
              <Link 
                to="/upload" 
                className={isActive('/upload') ? 'active' : ''} 
                onClick={closeMenu}
                aria-current={isActive('/upload') ? 'page' : undefined}
              >
                <span className="icon-upload" aria-hidden="true"></span>
                Upload Data
              </Link>
            </li>
            <li>
              <Link 
                to="/analysis" 
                className={isActive('/analysis') ? 'active' : ''} 
                onClick={closeMenu}
                aria-current={isActive('/analysis') ? 'page' : undefined}
              >
                <span className="icon-analysis" aria-hidden="true"></span>
                Analysis
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="user-controls">
          <button 
            className="help-button" 
            aria-label="Get help"
          >
            <span className="icon-help" aria-hidden="true"></span>
            <span className="button-text">Help</span>
          </button>
          
          <div className="user-profile">
            <button 
              className="profile-button"
              aria-label="User profile and settings"
            >
              <span className="profile-icon" aria-hidden="true"></span>
              <span className="button-text">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;