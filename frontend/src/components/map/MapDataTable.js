import React, { useState } from 'react';

const MapDataTable = ({ layers, selectedFeature, onClose }) => {
  const [activeTab, setActiveTab] = useState(selectedFeature ? 'feature' : 'layers');
  
  // Extract all features from all layers
  const allFeatures = layers.reduce((acc, layer) => {
    if (layer.data && layer.data.features) {
      return [...acc, ...layer.data.features.map(feature => ({
        ...feature,
        layerName: layer.name,
        layerId: layer.id
      }))];
    }
    return acc;
  }, []);
  
  // Get all unique property keys across all features
  const allPropertyKeys = allFeatures.reduce((keys, feature) => {
    if (feature.properties) {
      Object.keys(feature.properties).forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });
    }
    return keys;
  }, []);
  
  // Get coordinate string for a feature
  const getCoordinateString = (feature) => {
    if (!feature || !feature.geometry) return 'No coordinates';
    
    const { type, coordinates } = feature.geometry;
    
    switch (type) {
      case 'Point':
        return `Lat: ${coordinates[1].toFixed(4)}, Lng: ${coordinates[0].toFixed(4)}`;
      case 'LineString':
        return `${coordinates.length} points, starting at Lat: ${coordinates[0][1].toFixed(4)}, Lng: ${coordinates[0][0].toFixed(4)}`;
      case 'Polygon':
        return `Polygon with ${coordinates[0].length} vertices`;
      default:
        return `Complex ${type} geometry`;
    }
  };
  
  // Get feature type as a human-readable string
  const getFeatureTypeString = (feature) => {
    if (!feature || !feature.geometry) return 'Unknown';
    
    const { type } = feature.geometry;
    
    switch (type) {
      case 'Point':
        return 'Point';
      case 'LineString':
        return 'Line';
      case 'Polygon':
        return 'Polygon';
      case 'MultiPoint':
        return 'Multiple Points';
      case 'MultiLineString':
        return 'Multiple Lines';
      case 'MultiPolygon':
        return 'Multiple Polygons';
      default:
        return type;
    }
  };

  return (
    <div 
      className="map-data-table-container" 
      role="dialog" 
      aria-labelledby="data-table-title"
      aria-modal="true"
    >
      <div className="data-table-header">
        <h2 id="data-table-title">Map Data View</h2>
        <button 
          className="close-table-btn"
          onClick={onClose}
          aria-label="Close data table"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      
      <div className="data-table-tabs" role="tablist">
        <button 
          id="tab-layers"
          className={`tab-btn ${activeTab === 'layers' ? 'active' : ''}`}
          onClick={() => setActiveTab('layers')}
          role="tab"
          aria-selected={activeTab === 'layers'}
          aria-controls="panel-layers"
          tabIndex={activeTab === 'layers' ? 0 : -1}
        >
          Layers Summary
        </button>
        <button 
          id="tab-features"
          className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
          role="tab"
          aria-selected={activeTab === 'features'}
          aria-controls="panel-features"
          tabIndex={activeTab === 'features' ? 0 : -1}
        >
          All Features
        </button>
        <button 
          id="tab-feature"
          className={`tab-btn ${activeTab === 'feature' ? 'active' : ''}`}
          onClick={() => setActiveTab('feature')}
          role="tab"
          aria-selected={activeTab === 'feature'}
          aria-controls="panel-feature"
          tabIndex={activeTab === 'feature' ? 0 : -1}
          disabled={!selectedFeature}
        >
          Selected Feature
        </button>
      </div>
      
      {/* Layers Summary Tab */}
      <div 
        id="panel-layers"
        role="tabpanel"
        aria-labelledby="tab-layers"
        className={`tab-panel ${activeTab === 'layers' ? 'active' : ''}`}
        tabIndex={0}
        hidden={activeTab !== 'layers'}
      >
        <table className="data-table">
          <caption>Summary of active map layers</caption>
          <thead>
            <tr>
              <th scope="col">Layer Name</th>
              <th scope="col">Type</th>
              <th scope="col">Features</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {layers.map(layer => (
              <tr key={layer.id}>
                <th scope="row">{layer.name}</th>
                <td>{layer.type}</td>
                <td>{layer.data && layer.data.features ? layer.data.features.length : 0}</td>
                <td>{layer.description || 'No description available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* All Features Tab */}
      <div 
        id="panel-features"
        role="tabpanel"
        aria-labelledby="tab-features"
        className={`tab-panel ${activeTab === 'features' ? 'active' : ''}`}
        tabIndex={0}
        hidden={activeTab !== 'features'}
      >
        {allFeatures.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <caption>List of all features from active layers</caption>
              <thead>
                <tr>
                  <th scope="col">Layer</th>
                  <th scope="col">Name/ID</th>
                  <th scope="col">Type</th>
                  <th scope="col">Coordinates</th>
                  {allPropertyKeys.slice(0, 5).map(key => (
                    <th key={key} scope="col">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr 
                    key={index}
                    onClick={() => setActiveTab('feature')}
                    className={selectedFeature === feature ? 'selected-row' : ''}
                  >
                    <td>{feature.layerName}</td>
                    <td>{feature.properties?.name || feature.properties?.id || `Feature ${index + 1}`}</td>
                    <td>{getFeatureTypeString(feature)}</td>
                    <td>{getCoordinateString(feature)}</td>
                    {allPropertyKeys.slice(0, 5).map(key => (
                      <td key={key}>{feature.properties?.[key] !== undefined ? feature.properties[key].toString() : '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data-message">No features available in the current map view.</p>
        )}
      </div>
      
      {/* Selected Feature Tab */}
      <div 
        id="panel-feature"
        role="tabpanel"
        aria-labelledby="tab-feature"
        className={`tab-panel ${activeTab === 'feature' ? 'active' : ''}`}
        tabIndex={0}
        hidden={activeTab !== 'feature'}
      >
        {selectedFeature ? (
          <div className="feature-details">
            <h3>
              {selectedFeature.properties?.name || selectedFeature.properties?.id || 'Selected Feature'}
            </h3>
            
            <div className="feature-metadata">
              <p><strong>Geometry Type:</strong> {getFeatureTypeString(selectedFeature)}</p>
              <p><strong>Coordinates:</strong> {getCoordinateString(selectedFeature)}</p>
              <p><strong>Layer:</strong> {selectedFeature.layerName || 'Unknown'}</p>
            </div>
            
            <table className="data-table">
              <caption>Properties of the selected feature</caption>
              <thead>
                <tr>
                  <th scope="col">Property</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedFeature.properties && Object.entries(selectedFeature.properties).map(([key, value]) => (
                  <tr key={key}>
                    <th scope="row">{key}</th>
                    <td>{value !== null && value !== undefined ? value.toString() : 'null'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data-message">No feature is currently selected. Click on a map feature to view its details.</p>
        )}
      </div>
      
      <div className="data-table-footer">
        <p className="data-help-text">
          This table view provides access to all map data in a screen reader-friendly format.
          Use the tabs above to navigate between different views of the data.
        </p>
      </div>
    </div>
  );
};

export default MapDataTable;