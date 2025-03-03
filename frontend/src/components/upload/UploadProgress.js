import React from 'react';

const UploadProgress = ({ progress }) => {
  // Calculate color based on progress
  const getProgressColor = (value) => {
    if (value < 30) return '#3498db'; // Blue
    if (value < 70) return '#2ecc71'; // Green
    return '#27ae60'; // Darker green
  };

  return (
    <div 
      className="upload-progress-container" 
      role="progressbar" 
      aria-valuenow={progress} 
      aria-valuemin="0" 
      aria-valuemax="100"
      aria-label={`Upload progress: ${progress}%`}
    >
      <div className="progress-info">
        <span className="progress-label">Uploading files...</span>
        <span className="progress-percentage">{progress}%</span>
      </div>
      
      <div className="progress-track">
        <div 
          className="progress-bar" 
          style={{ 
            width: `${progress}%`,
            backgroundColor: getProgressColor(progress)
          }}
          aria-hidden="true"
        ></div>
      </div>
      
      <div className="progress-status">
        {progress < 100 ? (
          <p className="status-message">Please wait while your files are being uploaded...</p>
        ) : (
          <p className="status-message">Upload complete. Processing your files...</p>
        )}
      </div>
      
      {/* This message is only for screen readers */}
      <div className="sr-only" aria-live="polite">
        {progress < 25 && "Upload started"}
        {progress >= 25 && progress < 50 && "Upload is 25% complete"}
        {progress >= 50 && progress < 75 && "Upload is 50% complete"}
        {progress >= 75 && progress < 100 && "Upload is 75% complete"}
        {progress >= 100 && "Upload is complete, now processing your files"}
      </div>
    </div>
  );
};

export default UploadProgress;