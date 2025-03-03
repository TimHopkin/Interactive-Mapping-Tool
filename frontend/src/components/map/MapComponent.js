import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import MapKeyboardNavigation from './MapKeyboardNavigation';
import MapAccessibilityControls from './MapAccessibilityControls';
import MapLegend from './MapLegend';
import MapDataTable from './MapDataTable';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const { BaseLayer, Overlay } = LayersControl;

const MapComponent = ({ 
  layers = [], 
  center = [51.505, -0.09], 
  zoom = 13,
  onMapMove = () => {},
  onLayerToggle = () => {}
}) => {
  const [map, setMap] = useState(null);
  const [activeLayers, setActiveLayers] = useState({});
  const [showDataTable, setShowDataTable] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [mapDescription, setMapDescription] = useState('');
  const mapContainerRef = useRef(null);
  const { preferences } = useUserPreferences();

  // Generate accessible map description based on active layers
  useEffect(() => {
    if (!map) return;
    
    const activeLayersList = Object.keys(activeLayers)
      .filter(id => activeLayers[id])
      .map(id => {
        const layer = layers.find(l => l.id === id);
        return layer ? layer.name : '';
      })
      .filter(Boolean);
    
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    
    let description = `Interactive map centered at latitude ${center[0].toFixed(4)} and longitude ${center[1].toFixed(4)}, zoom level ${map.getZoom()}.`;
    
    if (activeLayersList.length > 0) {
      description += ` Showing ${activeLayersList.length} layers: ${activeLayersList.join(', ')}.`;
    } else {
      description += ' No data layers are currently active.';
    }
    
    description += ` Map area covers from ${southWest.lat.toFixed(4)},${southWest.lng.toFixed(4)} to ${northEast.lat.toFixed(4)},${northEast.lng.toFixed(4)}.`;
    
    setMapDescription(description);
  }, [map, center, activeLayers, layers]);

  // When map or layers change, update the view
  useEffect(() => {
    if (!map) return;
    map.setView(center, zoom);
  }, [map, center, zoom]);

  // Apply user preferences to map
  useEffect(() => {
    if (!map) return;
    
    // Apply preferences to map
    if (preferences.textSize !== 'default' || preferences.highContrast) {
      // Update map container styles
      const container = mapContainerRef.current;
      if (container) {
        if (preferences.highContrast) {
          container.classList.add('high-contrast-map');
        } else {
          container.classList.remove('high-contrast-map');
        }
      }
      
      // Force map to refresh to apply styles
      map.invalidateSize();
    }
  }, [map, preferences, preferences.textSize, preferences.highContrast, preferences.mapControls]);

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      // Create accessible popup content
      const popupContentArray = Object.entries(feature.properties)
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`);
      
      const popupContent = `
        <div class="feature-popup" role="dialog" aria-label="Feature information">
          <h3 class="feature-title">${feature.properties.name || 'Feature Details'}</h3>
          <dl class="feature-properties">
            ${popupContentArray.map(item => `
              <div class="property-item">
                <dt>${item.split(':')[0].replace('<strong>', '').replace('</strong>', '')}</dt>
                <dd>${item.split(':')[1]}</dd>
              </div>
            `).join('')}
          </dl>
        </div>
      `;
      
      // Bind popup with accessible markup
      layer.bindPopup(popupContent);
      
      // Add keyboard event handling for accessibility
      layer.on('keypress', (e) => {
        if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
          layer.openPopup();
        }
      });
      
      // Add tabindex to make features focusable
      if (layer.getElement) {
        const element = layer.getElement();
        if (element) {
          element.setAttribute('tabindex', '0');
          element.setAttribute('role', 'button');
          element.setAttribute('aria-label', `${feature.properties.name || 'Unnamed feature'} - Click to view details`);
        }
      }
      
      // Handle click events
      layer.on('click', () => {
        setSelectedFeature(feature);
      });
    }
  };

  const toggleLayer = (layerId, active) => {
    setActiveLayers(prev => {
      const updated = {
        ...prev,
        [layerId]: active
      };
      
      // Call the onLayerToggle callback
      onLayerToggle(updated);
      
      return updated;
    });
  };

  const handleMapMove = () => {
    if (!map) return;
    
    const center = map.getCenter();
    const zoom = map.getZoom();
    const bounds = map.getBounds();
    
    onMapMove({
      center: [center.lat, center.lng],
      zoom,
      bounds: {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      }
    });
  };

  const toggleDataTable = () => {
    setShowDataTable(!showDataTable);
  };

  // Create a ref for the map instance
  const mapRef = useRef(null);
  
  // Use effect to set the map when the ref changes
  useEffect(() => {
    if (mapRef.current) {
      setMap(mapRef.current);
    }
  }, [mapRef]);
  
  return (
    <div className="map-component" ref={mapContainerRef}>
      <div 
        className="sr-only map-description" 
        aria-live="polite"
      >
        {mapDescription}
      </div>
      
      <div className="map-tools">
        <MapAccessibilityControls 
          showTable={showDataTable}
          onToggleTable={toggleDataTable}
        />
      </div>
      
      <div className="map-container" style={{ height: '600px', width: '100%' }}>
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          zoomControl={false}
          attributionControl={true}
          onMoveEnd={handleMapMove}
          // ARIA attributes for accessibility
          aria-label="Interactive map for land analysis"
          role="application"
        >
          {/* Custom position for zoom controls - better UX */}
          <ZoomControl position="topright" />
          
          {/* Keyboard navigation component */}
          {preferences.mapControls.keyboardNavigation && (
            <MapKeyboardNavigation />
          )}
          
          <LayersControl position="topright">
            <BaseLayer checked name="OpenStreetMap Standard">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                aria-label="OpenStreetMap standard view"
              />
            </BaseLayer>
            
            <BaseLayer name="OpenStreetMap Humanitarian">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://www.hotosm.org/">Humanitarian OpenStreetMap Team</a>'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                aria-label="OpenStreetMap humanitarian view - higher contrast for better visibility"
              />
            </BaseLayer>
            
            <BaseLayer name="High Contrast">
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                aria-label="High contrast map view for better visibility"
              />
            </BaseLayer>
            
            <BaseLayer name="Satellite">
              <TileLayer
                attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                aria-label="Satellite imagery view"
              />
            </BaseLayer>
            
            {/* Data layers */}
            {layers.map((layer) => (
              <Overlay 
                key={layer.id} 
                name={layer.name}
                checked={activeLayers[layer.id] || false}
                aria-label={`Toggle ${layer.name} layer visibility`}
              >
                <div
                  onAdd={() => toggleLayer(layer.id, true)}
                  onRemove={() => toggleLayer(layer.id, false)}
                >
                  {layer.type === 'geojson' && layer.data && (
                    <GeoJSON 
                      data={layer.data} 
                      style={layer.style || {}} 
                      onEachFeature={onEachFeature}
                      aria-label={`${layer.name} geospatial data layer`}
                    />
                  )}
                  
                  {layer.type === 'marker' && layer.position && (
                    <Marker 
                      position={layer.position}
                      aria-label={layer.name || 'Map marker'}
                    >
                      <Popup>
                        <div role="dialog" aria-label="Marker information">
                          <h3>{layer.name || 'Location'}</h3>
                          <p>{layer.popupContent || 'Point of interest'}</p>
                          <p>
                            <strong>Coordinates:</strong> {layer.position[0].toFixed(4)}, {layer.position[1].toFixed(4)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </div>
              </Overlay>
            ))}
          </LayersControl>
        </MapContainer>
      </div>
      
      {/* Map legend */}
      <MapLegend 
        layers={layers.filter(layer => activeLayers[layer.id])}
      />
      
      {/* Data table for screen reader users */}
      {showDataTable && (
        <MapDataTable 
          layers={layers.filter(layer => activeLayers[layer.id])}
          selectedFeature={selectedFeature}
          onClose={() => setShowDataTable(false)}
        />
      )}
    </div>
  );
};

export default MapComponent;