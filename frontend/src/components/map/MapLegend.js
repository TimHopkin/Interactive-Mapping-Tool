import React from 'react';

const MapLegend = ({ layers }) => {
  if (!layers || layers.length === 0) {
    return null;
  }

  // Function to render legend items based on layer type and style
  const renderLegendItems = (layer) => {
    if (!layer.style) return null;
    
    if (layer.style.type === 'categorical' && layer.style.property && layer.style.values) {
      // Handle categorical styling (e.g., land use types with different colors)
      return (
        <div className="legend-group" key={layer.id}>
          <h4 className="legend-layer-name">{layer.name}</h4>
          <div className="legend-items">
            {Object.entries(layer.style.values).map(([value, style]) => (
              <div className="legend-item" key={value}>
                <span 
                  className="legend-color" 
                  style={{ 
                    backgroundColor: style.color || '#ccc',
                    opacity: style.opacity || 1,
                    border: style.weight ? `${style.weight}px solid ${style.color || '#ccc'}` : 'none'
                  }}
                  aria-hidden="true"
                ></span>
                <span className="legend-label">{value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (layer.style.type === 'gradient' && layer.style.property && layer.style.stops) {
      // Handle gradient styling (e.g., population density from low to high values)
      return (
        <div className="legend-group" key={layer.id}>
          <h4 className="legend-layer-name">{layer.name}</h4>
          <div className="legend-gradient">
            <div 
              className="gradient-bar"
              style={{
                background: `linear-gradient(to right, ${layer.style.stops.map(stop => stop.color).join(', ')})`
              }}
              aria-hidden="true"
            ></div>
            <div className="gradient-labels">
              {layer.style.stops.map((stop, index) => (
                <span key={index} className="gradient-label">{stop.value}</span>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // Handle simple styling (e.g., single color for a layer)
      return (
        <div className="legend-group" key={layer.id}>
          <h4 className="legend-layer-name">{layer.name}</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span 
                className="legend-color" 
                style={{ 
                  backgroundColor: typeof layer.style === 'object' ? (layer.style.color || '#ccc') : '#ccc',
                  opacity: typeof layer.style === 'object' ? (layer.style.opacity || 1) : 1
                }}
                aria-hidden="true"
              ></span>
              <span className="legend-label">{layer.name}</span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div 
      className="map-legend" 
      aria-label="Map legend"
      role="region"
    >
      <div className="legend-header">
        <h3 className="legend-title">Legend</h3>
        <button 
          className="collapse-legend"
          aria-label="Collapse legend"
          aria-expanded="true"
        >
          <span aria-hidden="true">−</span>
        </button>
      </div>
      
      <div className="legend-content">
        {layers.map(layer => renderLegendItems(layer))}
      </div>
      
      {/* Screen reader description of the legend */}
      <div className="sr-only" aria-live="polite">
        Map legend showing {layers.length} active layers: 
        {layers.map(layer => {
          if (layer.style && layer.style.type === 'categorical' && layer.style.values) {
            return `${layer.name} with categories: ${Object.keys(layer.style.values).join(', ')}. `;
          } else {
            return `${layer.name}. `;
          }
        })}
      </div>
    </div>
  );
};

export default MapLegend;