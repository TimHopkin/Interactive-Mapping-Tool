import React from 'react';

const FileFormatGuide = () => {
  return (
    <div id="format-guide" className="format-guide" aria-labelledby="format-guide-title">
      <h3 id="format-guide-title">Supported File Formats</h3>
      
      <div className="format-grid">
        <div className="format-card">
          <div className="format-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
            </svg>
          </div>
          <div className="format-info">
            <h4>Shapefile</h4>
            <p>A common geospatial vector data format for GIS software.</p>
            <ul className="format-details">
              <li>Upload <strong>.shp</strong>, <strong>.dbf</strong>, <strong>.shx</strong>, and <strong>.prj</strong> files together</li>
              <li>Ideally, upload as a <strong>.zip</strong> archive containing all files</li>
              <li>Supports points, lines, and polygons</li>
            </ul>
          </div>
        </div>
        
        <div className="format-card">
          <div className="format-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="currentColor"/>
            </svg>
          </div>
          <div className="format-info">
            <h4>GeoJSON</h4>
            <p>An open standard format for representing simple geographical features.</p>
            <ul className="format-details">
              <li>Upload files with <strong>.geojson</strong> or <strong>.json</strong> extension</li>
              <li>Lightweight and human-readable</li>
              <li>Widely supported by web mapping libraries</li>
            </ul>
          </div>
        </div>
        
        <div className="format-card">
          <div className="format-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z" fill="currentColor"/>
            </svg>
          </div>
          <div className="format-info">
            <h4>CSV with Coordinates</h4>
            <p>Simple tabular data with latitude and longitude columns.</p>
            <ul className="format-details">
              <li>Upload files with <strong>.csv</strong> extension</li>
              <li>Must include columns for coordinates (e.g., lat/lon, latitude/longitude)</li>
              <li>Example header: <code>id,name,latitude,longitude,value</code></li>
            </ul>
          </div>
        </div>
        
        <div className="format-card">
          <div className="format-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z" fill="currentColor"/>
            </svg>
          </div>
          <div className="format-info">
            <h4>GeoTIFF</h4>
            <p>A raster file format for storing geospatial data.</p>
            <ul className="format-details">
              <li>Upload files with <strong>.tif</strong> or <strong>.tiff</strong> extension</li>
              <li>Used for satellite imagery, elevation data, classified imagery</li>
              <li>Preserves georeferencing information</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="format-tips">
        <h4>Tips for Successful Uploads</h4>
        <ul>
          <li>For shapefiles, make sure to include all required files (.shp, .dbf, .shx, .prj)</li>
          <li>CSV files must contain columns for coordinates (latitude/longitude)</li>
          <li>Ensure all files use the same coordinate reference system (CRS)</li>
          <li>File size limits: 50MB per file, 200MB total upload</li>
          <li>If your data exceeds size limits, consider splitting it into smaller files</li>
        </ul>
      </div>
      
      <div className="format-example">
        <h4>CSV Example Format</h4>
        <div className="code-snippet" aria-label="Example CSV format with coordinates">
          <pre>
            id,name,latitude,longitude,value
            1,"Location A",40.7128,-74.0060,92
            2,"Location B",34.0522,-118.2437,87
            3,"Location C",41.8781,-87.6298,64
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FileFormatGuide;