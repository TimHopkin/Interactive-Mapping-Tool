import React from 'react';
import { Link } from 'react-router-dom';
import DataUploadComponent from '../components/upload/DataUploadComponent';

const DataUpload = () => {
  return (
    <div className="data-upload-page">
      <div className="page-header">
        <h2>Upload Data</h2>
        <p>
          Upload your geospatial data in various formats to analyze and visualize on the map.
          <br />
          Supported formats: Shapefiles, GeoJSON, CSV with coordinates, GeoTIFF, and more.
        </p>
      </div>
      
      <div className="upload-section">
        <DataUploadComponent />
      </div>
      
      <div className="upload-instructions">
        <h3>Upload Guidelines</h3>
        
        <div className="instruction-section">
          <h4>Supported File Formats</h4>
          <ul>
            <li>
              <strong>Shapefile:</strong> Upload .shp, .dbf, .shx, and .prj files together (ideally in a .zip archive)
            </li>
            <li>
              <strong>GeoJSON:</strong> Standard GeoJSON files (.geojson or .json)
            </li>
            <li>
              <strong>CSV:</strong> CSV files with latitude and longitude columns
            </li>
            <li>
              <strong>Raster Data:</strong> GeoTIFF files (.tif or .tiff)
            </li>
            <li>
              <strong>KML:</strong> Keyhole Markup Language files (.kml)
            </li>
          </ul>
        </div>
        
        <div className="instruction-section">
          <h4>CSV File Requirements</h4>
          <p>For CSV files, ensure you have columns for coordinates:</p>
          <ul>
            <li>Latitude and Longitude columns (recommended column names: "lat"/"latitude" and "lon"/"lng"/"longitude")</li>
            <li>Or X and Y columns with a defined coordinate system</li>
          </ul>
          <p>Example CSV format:</p>
          <pre>
            id,name,latitude,longitude,value
            1,"Location A",40.7128,-74.0060,92
            2,"Location B",34.0522,-118.2437,87
          </pre>
        </div>
        
        <div className="instruction-section">
          <h4>File Size Limits</h4>
          <ul>
            <li>Individual files: Maximum 50MB</li>
            <li>Total upload size: Maximum 200MB</li>
            <li>For larger files, please contact support</li>
          </ul>
        </div>
        
        <div className="instruction-section">
          <h4>Tips for Successful Uploads</h4>
          <ul>
            <li>Ensure all files are in the same coordinate system</li>
            <li>For shapefiles, upload all required files (.shp, .dbf, .shx, .prj)</li>
            <li>Make sure your files are properly formatted and not corrupted</li>
            <li>Use descriptive dataset names to easily identify them later</li>
          </ul>
        </div>
      </div>
      
      <div className="page-footer">
        <p>
          After uploading, you can view your data on the <Link to="/map">map</Link> or 
          perform <Link to="/analysis">spatial analysis</Link>.
        </p>
      </div>
    </div>
  );
};

export default DataUpload;