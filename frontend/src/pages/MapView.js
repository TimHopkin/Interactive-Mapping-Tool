import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/map/MapComponent';

const MapView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const datasetId = queryParams.get('dataset');
  const analysisId = queryParams.get('analysis');
  
  const [mapLayers, setMapLayers] = useState([]);
  const [activeLayers, setActiveLayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    const fetchMapData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (datasetId) {
          // Fetch layers for a specific dataset
          response = await axios.get(`/api/data/datasets/${datasetId}/layers`);
        } else if (analysisId) {
          // Fetch layers for a specific analysis result
          response = await axios.get(`/api/analysis/${analysisId}/layers`);
        } else {
          // Fetch all available layers
          response = await axios.get('/api/data/layers');
        }
        
        setMapLayers(response.data);
        
        // If there are layers with geographic extents, calculate center and zoom
        if (response.data.length > 0 && response.data[0].extent) {
          const extent = response.data[0].extent;
          setCenter([(extent.north + extent.south) / 2, (extent.east + extent.west) / 2]);
          
          // TODO: Calculate appropriate zoom level based on extent
          setZoom(10);
        }
        
        // Activate all layers by default
        setActiveLayers(response.data.map(layer => layer.id));
        
      } catch (error) {
        console.error('Error fetching map data:', error);
        setError('Failed to load map data. Please try again later.');
        
        // Set mock data for demonstration
        const mockLayers = [
          {
            id: 1,
            name: 'Land Use',
            type: 'geojson',
            // Mock GeoJSON data
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: { name: 'Residential Area', type: 'residential' },
                  geometry: {
                    type: 'Polygon',
                    coordinates: [
                      [
                        [-74.01, 40.71],
                        [-74.01, 40.72],
                        [-74.00, 40.72],
                        [-74.00, 40.71],
                        [-74.01, 40.71]
                      ]
                    ]
                  }
                }
              ]
            },
            style: {
              color: '#ff7800',
              weight: 2,
              opacity: 0.65
            }
          },
          {
            id: 2,
            name: 'Points of Interest',
            type: 'marker',
            position: [-74.005, 40.715],
            popupContent: 'City Center'
          }
        ];
        
        setMapLayers(mockLayers);
        setActiveLayers(mockLayers.map(layer => layer.id));
        setCenter([40.715, -74.005]);
        setZoom(13);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMapData();
  }, [datasetId, analysisId]);

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => {
      if (prev.includes(layerId)) {
        return prev.filter(id => id !== layerId);
      } else {
        return [...prev, layerId];
      }
    });
  };

  // Filter active layers to pass to the map component
  const activeMapLayers = mapLayers.filter(layer => activeLayers.includes(layer.id));

  return (
    <div className="map-view-page">
      <div className="map-controls">
        <h2>Interactive Map</h2>
        
        {loading ? (
          <p>Loading map data...</p>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="layer-controls">
            <h3>Map Layers</h3>
            <ul className="layer-list">
              {mapLayers.map(layer => (
                <li key={layer.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={activeLayers.includes(layer.id)}
                      onChange={() => toggleLayer(layer.id)}
                    />
                    {layer.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="map-container">
        <MapComponent 
          layers={activeMapLayers}
          center={center}
          zoom={zoom}
        />
      </div>
    </div>
  );
};

export default MapView;