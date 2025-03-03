import React, { useState } from 'react';
import axios from 'axios';

const DataUploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setUploadStatus({
        success: false,
        message: 'Please select at least one file to upload.'
      });
      return;
    }

    if (!datasetName.trim()) {
      setUploadStatus({
        success: false,
        message: 'Please provide a dataset name.'
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('name', datasetName);
    formData.append('description', datasetDescription);

    try {
      // This endpoint will need to be implemented in the backend
      const response = await axios.post('/api/data/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });

      setUploadStatus({
        success: true,
        message: 'Files uploaded successfully',
        data: response.data
      });
      
      // Reset form after successful upload
      setFiles([]);
      setDatasetName('');
      setDatasetDescription('');
      
    } catch (error) {
      setUploadStatus({
        success: false,
        message: `Upload failed: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Geospatial Data</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="datasetName">Dataset Name *</label>
          <input
            type="text"
            id="datasetName"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="datasetDescription">Dataset Description</label>
          <textarea
            id="datasetDescription"
            value={datasetDescription}
            onChange={(e) => setDatasetDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="files">Select Files *</label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            accept=".shp,.dbf,.shx,.prj,.geojson,.json,.csv,.tif,.tiff,.zip"
          />
          <small>
            Supported formats: Shapefile (.shp, .dbf, .shx, .prj), GeoJSON, CSV with coordinates, GeoTIFF
          </small>
        </div>
        
        {files.length > 0 && (
          <div className="selected-files">
            <h4>Selected Files:</h4>
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={uploading || files.length === 0 || !datasetName.trim()}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
      </form>
      
      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.success ? 'success' : 'error'}`}>
          <p>{uploadStatus.message}</p>
          {uploadStatus.success && uploadStatus.data && (
            <div>
              <p>Dataset ID: {uploadStatus.data.id}</p>
              <p>Files processed: {uploadStatus.data.processed_files}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataUploadComponent;