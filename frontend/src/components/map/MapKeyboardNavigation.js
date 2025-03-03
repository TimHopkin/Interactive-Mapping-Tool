import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Component to enable keyboard navigation on maps
const MapKeyboardNavigation = () => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    // Focus event - when map container receives focus
    const handleFocus = () => {
      // Add a visible focus indicator around the map
      map.getContainer().classList.add('map-focused');
    };
    
    // Blur event - when focus leaves the map
    const handleBlur = () => {
      map.getContainer().classList.remove('map-focused');
    };
    
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      // Only handle events when map container is focused
      if (document.activeElement !== map.getContainer()) return;
      
      const panAmount = 100; // pixels to pan per key press
      const zoomAmount = 1; // zoom levels to change per key press
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          map.panBy([0, -panAmount]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          map.panBy([0, panAmount]);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          map.panBy([-panAmount, 0]);
          break;
        case 'ArrowRight':
          e.preventDefault();
          map.panBy([panAmount, 0]);
          break;
        case '+':
        case '=': // Plus key (with or without shift)
          e.preventDefault();
          map.setZoom(map.getZoom() + zoomAmount);
          break;
        case '-':
        case '_': // Minus key (with or without shift)
          e.preventDefault();
          map.setZoom(map.getZoom() - zoomAmount);
          break;
        case 'Home':
          e.preventDefault();
          map.setView(map.options.center, map.options.zoom);
          break;
        default:
          break;
      }
    };
    
    // Make map container focusable
    const container = map.getContainer();
    container.setAttribute('tabindex', '0');
    container.setAttribute('aria-label', 'Interactive map. Use arrow keys to pan, plus/minus to zoom, Home key to reset view.');
    container.setAttribute('role', 'application');
    
    // Add event listeners
    container.addEventListener('focus', handleFocus);
    container.addEventListener('blur', handleBlur);
    container.addEventListener('keydown', handleKeyDown);
    
    // Create and add keyboard instructions element
    const instructionsElement = document.createElement('div');
    instructionsElement.className = 'sr-only';
    instructionsElement.setAttribute('aria-live', 'polite');
    instructionsElement.innerHTML = `
      Keyboard Navigation: Use arrow keys to pan the map.
      Press + to zoom in, - to zoom out, Home to reset view.
    `;
    container.appendChild(instructionsElement);
    
    // Cleanup function
    return () => {
      container.removeEventListener('focus', handleFocus);
      container.removeEventListener('blur', handleBlur);
      container.removeEventListener('keydown', handleKeyDown);
      if (container.contains(instructionsElement)) {
        container.removeChild(instructionsElement);
      }
    };
  }, [map]);
  
  // This component doesn't render anything visible
  return null;
};

export default MapKeyboardNavigation;