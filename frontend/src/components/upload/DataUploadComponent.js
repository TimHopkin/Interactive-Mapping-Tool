import React, { useState, useRef } from 'react';
import axios from 'axios';
import FileFormatGuide from './FileFormatGuide';
import UploadProgress from './UploadProgress';
import { useUserPreferences } from '../../context/UserPreferencesContext';

const DataUploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);
  const { preferences } = useUserPreferences();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    validateFiles(selectedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
    validateFiles(droppedFiles);
    
    // Announce to screen readers
    announceToScreenReader(`${droppedFiles.length} files dropped: ${droppedFiles.map(f => f.name).join(', ')}`);
  };

  const validateFiles = (filesToValidate) => {
    const errors = {};
    const validExtensions = ['.shp', '.dbf', '.shx', '.prj', '.geojson', '.json', '.csv', '.tif', '.tiff', '.zip'];
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    let totalSize = 0;
    
    filesToValidate.forEach(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      totalSize += file.size;
      
      if (!validExtensions.includes(extension)) {
        errors.fileType = `File "${file.name}" has an unsupported format. Please use one of the supported formats.`;
      }
      
      if (file.size > maxFileSize) {
        errors.fileSize = `File "${file.name}" exceeds the 50MB size limit.`;
      }
    });
    
    if (totalSize > 200 * 1024 * 1024) { // 200MB
      errors.totalSize = 'Total upload size exceeds the 200MB limit.';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!datasetName.trim()) {
      errors.name = 'Please provide a dataset name';
    }
    
    if (files.length === 0) {
      errors.files = 'Please select at least one file to upload';
    }
    
    setValidationErrors({...validationErrors, ...errors});
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Announce errors to screen readers
      const errorMessages = Object.values(validationErrors).join('. ');
      announceToScreenReader(`Form has errors: ${errorMessages}`);
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    setUploadProgress(0);

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
          setUploadProgress(percentCompleted);
          
          // Announce progress milestones to screen readers
          if (percentCompleted % 25 === 0) {
            announceToScreenReader(`Upload progress: ${percentCompleted}%`);
          }
        }
      });

      setUploadStatus({
        success: true,
        message: 'Files uploaded successfully',
        data: response.data
      });
      
      // Announce success to screen readers
      announceToScreenReader('Upload completed successfully. You can now view your data on the map or perform analysis.');
      
      // Reset form after successful upload
      setFiles([]);
      setDatasetName('');
      setDatasetDescription('');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setUploadStatus({
        success: false,
        message: `Upload failed: ${errorMessage}`
      });
      
      // Announce error to screen readers
      announceToScreenReader(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const announceToScreenReader = (message) => {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  };

  const toggleFormatGuide = () => {
    setShowFormatGuide(!showFormatGuide);
  };

  const resetForm = () => {
    setFiles([]);
    setDatasetName('');
    setDatasetDescription('');
    setUploadStatus(null);
    setValidationErrors({});
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-component">
      {/* Screen reader announcer */}
      <div 
        id="sr-announcer" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
      
      <div className="upload-container">
        <h2 id="upload-heading">Upload Geospatial Data</h2>
        
        <div className="upload-instructions">
          <p>Upload your spatial data files to analyze and visualize on the map.</p>
          <button 
            type="button" 
            className="format-guide-toggle" 
            onClick={toggleFormatGuide}
            aria-expanded={showFormatGuide}
            aria-controls="format-guide"
          >
            {showFormatGuide ? 'Hide Format Guide' : 'Show Format Guide'}
          </button>
          
          {showFormatGuide && <FileFormatGuide />}
        </div>
        
        <form 
          onSubmit={handleSubmit}
          aria-labelledby="upload-heading" 
          noValidate
        >
          <div className="form-group">
            <label htmlFor="datasetName" className={validationErrors.name ? 'error' : ''}>
              Dataset Name <span aria-hidden="true">*</span>
              <span className="required-indicator sr-only">required</span>
            </label>
            <input
              type="text"
              id="datasetName"
              name="datasetName"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              required
              aria-required="true"
              aria-invalid={!!validationErrors.name}
              aria-describedby={validationErrors.name ? 'name-error' : undefined}
              disabled={uploading}
              className={`${preferences.textSize !== 'default' ? preferences.textSize : ''} ${validationErrors.name ? 'error-input' : ''}`}
            />
            {validationErrors.name && (
              <div id="name-error" className="error-message" role="alert">
                {validationErrors.name}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="datasetDescription">
              Dataset Description
              <span className="optional-indicator">(optional)</span>
            </label>
            <textarea
              id="datasetDescription"
              name="datasetDescription"
              value={datasetDescription}
              onChange={(e) => setDatasetDescription(e.target.value)}
              rows={3}
              disabled={uploading}
              className={preferences.textSize !== 'default' ? preferences.textSize : ''}
              aria-describedby="description-help"
            />
            <div id="description-help" className="help-text">
              Add details about your dataset to help with identification and searching.
            </div>
          </div>
          
          <div 
            className={`file-upload-area ${validationErrors.files ? 'error' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                triggerFileSelect();
              }
            }}
            tabIndex="0"
            role="button"
            aria-describedby="file-instructions file-error"
            aria-invalid={!!validationErrors.files}
          >
            <input
              type="file"
              id="files"
              name="files"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              accept=".shp,.dbf,.shx,.prj,.geojson,.json,.csv,.tif,.tiff,.zip"
              required
              aria-required="true"
              className="file-input sr-only"
              disabled={uploading}
            />
            
            <div className="upload-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" fill="currentColor"/>
              </svg>
            </div>
            
            <div id="file-instructions" className="upload-instructions-text">
              <p>Drag and drop files here or <button type="button" className="file-select-btn" onClick={triggerFileSelect}>select files</button></p>
              <p className="file-types">Supported formats: Shapefile, GeoJSON, CSV, GeoTIFF</p>
            </div>
            
            {validationErrors.files && (
              <div id="file-error" className="error-message" role="alert">
                {validationErrors.files}
              </div>
            )}
            
            {validationErrors.fileType && (
              <div className="error-message" role="alert">
                {validationErrors.fileType}
              </div>
            )}
            
            {validationErrors.fileSize && (
              <div className="error-message" role="alert">
                {validationErrors.fileSize}
              </div>
            )}
            
            {validationErrors.totalSize && (
              <div className="error-message" role="alert">
                {validationErrors.totalSize}
              </div>
            )}
          </div>
          
          {files.length > 0 && (
            <div className="selected-files" aria-live="polite">
              <h3>Selected Files: {files.length}</h3>
              <ul className="file-list" aria-label="List of selected files">
                {files.map((file, index) => (
                  <li key={index} className="file-item">
                    <span className="file-icon" aria-hidden="true"></span>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                    <button 
                      type="button" 
                      className="remove-file" 
                      onClick={() => {
                        const newFiles = [...files];
                        newFiles.splice(index, 1);
                        setFiles(newFiles);
                        validateFiles(newFiles);
                      }}
                      aria-label={`Remove ${file.name}`}
                      disabled={uploading}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {uploading && (
            <UploadProgress progress={uploadProgress} />
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="primary-button upload-button"
              disabled={uploading || files.length === 0}
              aria-busy={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
            
            <button 
              type="button" 
              className="secondary-button reset-button"
              onClick={resetForm}
              disabled={uploading}
            >
              Reset Form
            </button>
          </div>
        </form>
        
        {uploadStatus && (
          <div 
            className={`upload-status ${uploadStatus.success ? 'success' : 'error'}`}
            role="status"
            aria-live="polite"
          >
            <div className="status-icon" aria-hidden="true">
              {uploadStatus.success ? '✓' : '⚠'}
            </div>
            <div className="status-content">
              <h3>{uploadStatus.success ? 'Upload Successful' : 'Upload Failed'}</h3>
              <p>{uploadStatus.message}</p>
              {uploadStatus.success && uploadStatus.data && (
                <div className="upload-details">
                  <p>Dataset ID: {uploadStatus.data.id}</p>
                  <p>Files processed: {uploadStatus.data.processed_files}</p>
                  <div className="upload-actions">
                    <a href={`/map?dataset=${uploadStatus.data.id}`} className="view-data-link">
                      View on Map
                    </a>
                    <a href={`/analysis?dataset=${uploadStatus.data.id}`} className="analyze-data-link">
                      Analyze Data
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUploadComponent;