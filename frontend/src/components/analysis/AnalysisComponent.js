import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUserPreferences } from '../../context/UserPreferencesContext';
import AnalysisMethodExplainer from './AnalysisMethodExplainer';
import AnalysisParameterHelp from './AnalysisParameterHelp';

const AnalysisComponent = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [analysisType, setAnalysisType] = useState('');
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [results, setResults] = useState(null);
  const [showExplainer, setShowExplainer] = useState(false);
  const [showParameterHelp, setShowParameterHelp] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const announcerRef = useRef(null);
  const { preferences } = useUserPreferences();

  // Analysis types options with accessibility descriptions
  const analysisOptions = [
    { 
      value: 'clustering', 
      label: 'Clustering Analysis', 
      description: 'Groups similar features together based on spatial proximity and attributes. Useful for identifying patterns and hotspots in your data.',
      params: [
        { 
          name: 'algorithm', 
          label: 'Algorithm', 
          type: 'select', 
          description: 'The mathematical approach used to form clusters',
          options: [
            { value: 'kmeans', label: 'K-Means', description: 'Groups data into a specified number of clusters, minimizing the distance from each point to its cluster center.' },
            { value: 'dbscan', label: 'DBSCAN', description: 'Finds clusters of high density separated by areas of low density, without requiring a pre-specified number of clusters.' }
          ] 
        },
        { 
          name: 'n_clusters', 
          label: 'Number of Clusters', 
          type: 'number', 
          min: 2, 
          max: 20, 
          description: 'The number of groups to divide your data into. Start with a smaller number (2-5) and adjust based on results.',
          showIf: { param: 'algorithm', value: 'kmeans' } 
        },
        { 
          name: 'eps', 
          label: 'Epsilon (neighborhood size)', 
          type: 'number', 
          step: 0.01,
          min: 0.01,
          description: 'The maximum distance between two points to be considered neighbors. Smaller values create more, smaller clusters.',
          showIf: { param: 'algorithm', value: 'dbscan' } 
        },
        { 
          name: 'min_samples', 
          label: 'Minimum Samples', 
          type: 'number', 
          min: 1,
          description: 'The minimum number of points required to form a dense region. Higher values make the algorithm more selective.',
          showIf: { param: 'algorithm', value: 'dbscan' } 
        }
      ] 
    },
    { 
      value: 'buffer', 
      label: 'Buffer Analysis', 
      description: 'Creates zones around features at a specified distance. Useful for proximity analysis like identifying areas within a certain distance of roads, rivers, or facilities.',
      params: [
        { 
          name: 'distance', 
          label: 'Buffer Distance (meters)', 
          type: 'number', 
          min: 0,
          description: 'The distance in meters to create the buffer zone around each feature. Larger values create wider buffer areas.' 
        },
        { 
          name: 'segments', 
          label: 'Buffer Segments', 
          type: 'number', 
          min: 4, 
          max: 64,
          description: 'The number of line segments used to approximate curved edges. Higher values create smoother buffers but increase processing time.' 
        },
        {
          name: 'dissolve',
          label: 'Dissolve Overlapping Buffers',
          type: 'checkbox',
          description: 'When checked, overlapping buffer areas will be merged into a single feature. Useful for creating service coverage areas.'
        }
      ] 
    },
    { 
      value: 'intersection', 
      label: 'Intersection Analysis', 
      description: 'Finds areas where different spatial datasets overlap. Essential for identifying where two or more conditions are met simultaneously, such as areas that are both forested and on steep slopes.',
      params: [
        { 
          name: 'target_dataset', 
          label: 'Target Dataset', 
          type: 'select', 
          description: 'The second dataset to intersect with your selected dataset. The result will show areas where both datasets overlap.',
          options: [] // This will be populated with available datasets
        },
        {
          name: 'preserve_attributes',
          label: 'Preserve Attributes from Both Datasets',
          type: 'checkbox',
          description: 'When checked, the resulting features will contain attributes from both input datasets. Otherwise, only geometry will be preserved.'
        }
      ] 
    },
    { 
      value: 'heatmap', 
      label: 'Heatmap Generation', 
      description: 'Creates density-based visualizations to identify concentrations and patterns in point data. Perfect for visualizing population density, incident locations, or any point-based phenomenon.',
      params: [
        { 
          name: 'radius', 
          label: 'Point Radius', 
          type: 'number', 
          min: 1,
          description: 'The influence radius of each point in pixels. Larger values create a smoother, more generalized heatmap.'
        },
        { 
          name: 'intensity', 
          label: 'Intensity', 
          type: 'number', 
          min: 0.1, 
          max: 1, 
          step: 0.1,
          description: 'The strength of each point\'s influence. Higher values create more intense, vivid heatmaps.'
        },
        { 
          name: 'gradient', 
          label: 'Color Gradient', 
          type: 'select', 
          description: 'The color scheme used to represent different density levels.',
          options: [
            { value: 'default', label: 'Default (Red-Yellow)', description: 'Standard heat gradient from yellow (low) to red (high)' },
            { value: 'blues', label: 'Blues', description: 'Blue gradient suitable for water-related data or for better color-blindness accessibility' },
            { value: 'spectral', label: 'Spectral', description: 'Multi-color gradient from blue to red, good for showing fine variations in density' },
            { value: 'accessible', label: 'Accessible (Yellow-Purple)', description: 'Color-blind friendly gradient that works well for most types of color vision deficiency' }
          ] 
        },
        {
          name: 'opacity',
          label: 'Opacity',
          type: 'number',
          min: 0.1,
          max: 1,
          step: 0.1,
          description: 'The transparency level of the heatmap. Lower values allow underlying map features to be more visible.'
        }
      ] 
    }
  ];

  // Fetch available datasets on component mount
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        // This endpoint needs to be implemented in the backend
        const response = await axios.get('/api/data/datasets');
        setDatasets(response.data);
      } catch (error) {
        console.error('Failed to fetch datasets:', error);
        announceToScreenReader('Error loading datasets. Please try again later.');
        
        // Set mock data for development
        setDatasets([
          { id: '1', name: 'Land Use 2023', description: 'Current land use classifications for the region' },
          { id: '2', name: 'Population Data', description: 'Census population data by district' },
          { id: '3', name: 'Infrastructure Map', description: 'Roads, utilities and public buildings' }
        ]);
      }
    };

    fetchDatasets();
  }, []);

  // Poll for task status when taskId is available
  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/analysis/status/${taskId}`);
        setAnalysisStatus(response.data.status);
        
        if (response.data.state === 'SUCCESS') {
          setResults(response.data.result);
          clearInterval(interval);
          announceToScreenReader('Analysis completed successfully. Results are now available.');
        } else if (response.data.state === 'FAILURE') {
          announceToScreenReader('Analysis failed. Please check the error message and try again.');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking task status:', error);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId]);

  const handleAnalysisTypeChange = (e) => {
    const selectedType = e.target.value;
    setAnalysisType(selectedType);
    
    // Reset parameters when analysis type changes
    const initialParams = {};
    const selectedAnalysis = analysisOptions.find(option => option.value === selectedType);
    
    if (selectedAnalysis) {
      selectedAnalysis.params.forEach(param => {
        if (param.type === 'select' && param.options.length > 0) {
          initialParams[param.name] = param.options[0].value;
        } else if (param.type === 'number') {
          initialParams[param.name] = param.min || 0;
        } else if (param.type === 'checkbox') {
          initialParams[param.name] = false;
        } else {
          initialParams[param.name] = '';
        }
      });
      
      // Announce to screen readers
      announceToScreenReader(`Analysis type changed to ${selectedAnalysis.label}. ${selectedAnalysis.description}`);
    }
    
    setParameters(initialParams);
  };

  const handleParameterChange = (paramName, value) => {
    setParameters(prevParams => ({
      ...prevParams,
      [paramName]: value
    }));
    
    const selectedAnalysis = analysisOptions.find(option => option.value === analysisType);
    if (selectedAnalysis) {
      const changedParam = selectedAnalysis.params.find(param => param.name === paramName);
      if (changedParam) {
        if (changedParam.type === 'select') {
          const option = changedParam.options.find(opt => opt.value === value);
          if (option) {
            announceToScreenReader(`${changedParam.label} set to ${option.label}.`);
          }
        } else if (changedParam.type === 'checkbox') {
          announceToScreenReader(`${changedParam.label} ${value ? 'enabled' : 'disabled'}.`);
        } else {
          announceToScreenReader(`${changedParam.label} set to ${value}.`);
        }
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!selectedDataset) {
      errors.dataset = 'Please select a dataset';
    }
    
    if (!analysisType) {
      errors.analysisType = 'Please select an analysis type';
    }
    
    // Validate specific parameters
    const selectedAnalysis = analysisOptions.find(option => option.value === analysisType);
    if (selectedAnalysis) {
      selectedAnalysis.params.forEach(param => {
        // Skip validation for parameters that aren't visible based on showIf conditions
        if (param.showIf && parameters[param.showIf.param] !== param.showIf.value) {
          return;
        }
        
        if (param.type === 'number') {
          const value = parameters[param.name];
          if (value === undefined || value === null || value === '') {
            errors[param.name] = `${param.label} is required`;
          } else if (param.min !== undefined && value < param.min) {
            errors[param.name] = `${param.label} must be at least ${param.min}`;
          } else if (param.max !== undefined && value > param.max) {
            errors[param.name] = `${param.label} must be at most ${param.max}`;
          }
        } else if (param.type === 'select' && param.options.length > 0) {
          if (!parameters[param.name]) {
            errors[param.name] = `Please select a ${param.label.toLowerCase()}`;
          }
        }
      });
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorMessages = Object.values(validationErrors).join('. ');
      announceToScreenReader(`Form has errors: ${errorMessages}`);
      return;
    }
    
    setLoading(true);
    setTaskId(null);
    setResults(null);
    setAnalysisStatus('Starting analysis...');
    announceToScreenReader('Analysis starting. This may take a few moments to complete.');
    
    try {
      // This endpoint needs to be implemented in the backend
      const response = await axios.post('/api/analysis/start', {
        dataset_id: selectedDataset,
        analysis_type: analysisType,
        parameters: parameters
      });
      
      setTaskId(response.data.task_id);
      setAnalysisStatus('Analysis in progress...');
      announceToScreenReader('Analysis is now running. You will be notified when it completes.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setAnalysisStatus(`Analysis failed: ${errorMessage}`);
      announceToScreenReader(`Analysis failed: ${errorMessage}`);
      setLoading(false);
    }
  };

  // Announce messages to screen readers
  const announceToScreenReader = (message) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  };

  // Determine which parameters to show based on the selected analysis type
  const getVisibleParameters = () => {
    const selectedAnalysis = analysisOptions.find(option => option.value === analysisType);
    if (!selectedAnalysis) return [];
    
    return selectedAnalysis.params.filter(param => {
      if (!param.showIf) return true;
      return parameters[param.showIf.param] === param.showIf.value;
    });
  };

  // Get the current analysis method description
  const getCurrentAnalysisDescription = () => {
    const selectedAnalysis = analysisOptions.find(option => option.value === analysisType);
    return selectedAnalysis ? selectedAnalysis.description : '';
  };

  // Update intersection analysis target dataset options
  useEffect(() => {
    if (analysisType === 'intersection') {
      const analysisIndex = analysisOptions.findIndex(option => option.value === 'intersection');
      if (analysisIndex >= 0) {
        const paramIndex = analysisOptions[analysisIndex].params.findIndex(p => p.name === 'target_dataset');
        if (paramIndex >= 0) {
          const datasetOptions = datasets
            .filter(d => d.id !== selectedDataset) // Exclude the selected dataset
            .map(d => ({ value: d.id, label: d.name, description: d.description }));
          
          analysisOptions[analysisIndex].params[paramIndex].options = datasetOptions;
          
          // Set default value if available
          if (datasetOptions.length > 0 && (!parameters.target_dataset || !datasetOptions.find(o => o.value === parameters.target_dataset))) {
            handleParameterChange('target_dataset', datasetOptions[0].value);
          }
        }
      }
    }
  }, [datasets, selectedDataset, analysisType]);

  // Get the selected dataset name for display
  const getSelectedDatasetName = () => {
    const dataset = datasets.find(d => d.id === selectedDataset);
    return dataset ? dataset.name : '';
  };

  return (
    <div className="analysis-component">
      {/* Screen reader announcer */}
      <div 
        ref={announcerRef}
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
      
      <div className="analysis-container">
        <h2 id="analysis-heading">Spatial Analysis</h2>
        
        <div className="analysis-intro">
          <p>
            Transform your spatial data into actionable insights using our suite of analysis tools.
            Select a dataset, choose an analysis method, and customize parameters to fit your needs.
          </p>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          aria-labelledby="analysis-heading"
          noValidate
        >
          <div className="form-group">
            <label 
              htmlFor="dataset"
              className={validationErrors.dataset ? 'error' : ''}
            >
              Select Dataset <span aria-hidden="true">*</span>
              <span className="required-indicator sr-only">required</span>
            </label>
            <select
              id="dataset"
              className={`${preferences.textSize !== 'default' ? preferences.textSize : ''} ${validationErrors.dataset ? 'error-input' : ''}`}
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              required
              aria-required="true"
              aria-invalid={!!validationErrors.dataset}
              aria-describedby={validationErrors.dataset ? 'dataset-error' : undefined}
              disabled={loading}
            >
              <option value="">-- Select a dataset --</option>
              {datasets.map(dataset => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </option>
              ))}
            </select>
            {validationErrors.dataset && (
              <div id="dataset-error" className="error-message" role="alert">
                {validationErrors.dataset}
              </div>
            )}
            {selectedDataset && (
              <div className="selected-dataset-info">
                {datasets.find(d => d.id === selectedDataset)?.description}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label 
              htmlFor="analysisType"
              className={validationErrors.analysisType ? 'error' : ''}
            >
              Analysis Type <span aria-hidden="true">*</span>
              <span className="required-indicator sr-only">required</span>
            </label>
            <select
              id="analysisType"
              className={`${preferences.textSize !== 'default' ? preferences.textSize : ''} ${validationErrors.analysisType ? 'error-input' : ''}`}
              value={analysisType}
              onChange={handleAnalysisTypeChange}
              required
              aria-required="true"
              aria-invalid={!!validationErrors.analysisType}
              aria-describedby={validationErrors.analysisType ? 'analysis-type-error' : 'analysis-type-help'}
              disabled={loading}
            >
              <option value="">-- Select an analysis type --</option>
              {analysisOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validationErrors.analysisType && (
              <div id="analysis-type-error" className="error-message" role="alert">
                {validationErrors.analysisType}
              </div>
            )}
            <div id="analysis-type-help" className="help-text">
              {analysisType ? getCurrentAnalysisDescription() : 'Select the type of analysis you want to perform on your data.'}
            </div>
            
            {analysisType && (
              <button 
                type="button"
                className="info-button"
                onClick={() => setShowExplainer(true)}
                aria-label={`Learn more about ${analysisOptions.find(opt => opt.value === analysisType)?.label}`}
              >
                Learn more about this analysis
              </button>
            )}
          </div>
          
          {analysisType && (
            <div className="analysis-parameters">
              <h3>Analysis Parameters</h3>
              <p className="parameters-help">
                Customize these parameters to fine-tune your analysis. Hover over the help icon or use the information button for detailed explanations.
              </p>
              
              {getVisibleParameters().map(param => (
                <div className="form-group" key={param.name}>
                  <div className="parameter-header">
                    <label 
                      htmlFor={param.name}
                      className={validationErrors[param.name] ? 'error' : ''}
                    >
                      {param.label}
                      {param.type !== 'checkbox' && <span aria-hidden="true">*</span>}
                      <span className="required-indicator sr-only">{param.type !== 'checkbox' ? 'required' : 'optional'}</span>
                    </label>
                    <button 
                      type="button"
                      className="parameter-help-button"
                      onClick={() => {
                        setShowParameterHelp({
                          name: param.name,
                          label: param.label,
                          description: param.description
                        });
                      }}
                      aria-label={`Help for ${param.label}`}
                    >
                      <span aria-hidden="true">?</span>
                    </button>
                  </div>
                  
                  {param.type === 'select' ? (
                    <select
                      id={param.name}
                      className={`${preferences.textSize !== 'default' ? preferences.textSize : ''} ${validationErrors[param.name] ? 'error-input' : ''}`}
                      value={parameters[param.name] || ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      disabled={loading}
                      aria-invalid={!!validationErrors[param.name]}
                      aria-describedby={validationErrors[param.name] ? `${param.name}-error` : `${param.name}-help`}
                    >
                      {param.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : param.type === 'number' ? (
                    <div className="number-input-container">
                      <input
                        type="number"
                        id={param.name}
                        className={`${preferences.textSize !== 'default' ? preferences.textSize : ''} ${validationErrors[param.name] ? 'error-input' : ''}`}
                        value={parameters[param.name] || ''}
                        onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
                        min={param.min}
                        max={param.max}
                        step={param.step || 1}
                        disabled={loading}
                        aria-invalid={!!validationErrors[param.name]}
                        aria-describedby={validationErrors[param.name] ? `${param.name}-error` : `${param.name}-help`}
                      />
                      {param.min !== undefined && param.max !== undefined && (
                        <div className="range-indicator">
                          Range: {param.min} to {param.max}
                        </div>
                      )}
                    </div>
                  ) : param.type === 'checkbox' ? (
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id={param.name}
                        checked={parameters[param.name] || false}
                        onChange={(e) => handleParameterChange(param.name, e.target.checked)}
                        disabled={loading}
                        aria-describedby={`${param.name}-help`}
                      />
                      <span className="checkbox-label">{param.description}</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      id={param.name}
                      className={`${preferences.textSize !== 'default' ? preferences.textSize : ''} ${validationErrors[param.name] ? 'error-input' : ''}`}
                      value={parameters[param.name] || ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      disabled={loading}
                      aria-invalid={!!validationErrors[param.name]}
                      aria-describedby={validationErrors[param.name] ? `${param.name}-error` : `${param.name}-help`}
                    />
                  )}
                  
                  {validationErrors[param.name] && (
                    <div id={`${param.name}-error`} className="error-message" role="alert">
                      {validationErrors[param.name]}
                    </div>
                  )}
                  
                  <div id={`${param.name}-help`} className="help-text">
                    {param.description}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="primary-button run-button"
              disabled={loading || !selectedDataset || !analysisType}
              aria-busy={loading}
            >
              {loading ? 'Running Analysis...' : 'Run Analysis'}
            </button>
            
            <button
              type="button"
              className="secondary-button reset-button"
              onClick={() => {
                setParameters({});
                setAnalysisType('');
                setAnalysisStatus(null);
                setResults(null);
                setTaskId(null);
                setValidationErrors({});
              }}
              disabled={loading || (!analysisType && !selectedDataset)}
            >
              Reset Form
            </button>
          </div>
        </form>
        
        {analysisStatus && (
          <div 
            className="analysis-status"
            role="status"
            aria-live="polite"
          >
            <h3>Analysis Status</h3>
            <p>{analysisStatus}</p>
            {taskId && !results && (
              <div className="loading-progress">
                <div className="loading-spinner" aria-hidden="true"></div>
                <p className="progress-text">Your analysis is running. This may take a moment...</p>
              </div>
            )}
          </div>
        )}
        
        {results && (
          <div 
            className="analysis-results"
            role="region"
            aria-label="Analysis results"
          >
            <h3>Analysis Results: {analysisOptions.find(opt => opt.value === analysisType)?.label}</h3>
            <div className="result-summary">
              <p>
                <strong>Dataset:</strong> {getSelectedDatasetName()}<br />
                <strong>Analysis Type:</strong> {analysisOptions.find(opt => opt.value === analysisType)?.label}<br />
                <strong>Completed:</strong> {new Date().toLocaleString()}
              </p>
            </div>
            
            <div className="result-data">
              <h4>Output Statistics</h4>
              <div className="result-stats">
                {results.statistics && Object.entries(results.statistics).map(([key, value]) => (
                  <div className="stat-item" key={key}>
                    <div className="stat-label">{key.replace(/_/g, ' ')}</div>
                    <div className="stat-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="result-visualization">
              <h4>Visualization Preview</h4>
              <div className="visualization-placeholder" aria-label="Visualization of analysis results">
                {results.output_layers && results.output_layers.length > 0 ? (
                  <img 
                    src="/placeholder-map-result.png" 
                    alt={`${analysisType} analysis result visualization`} 
                    className="result-preview-image"
                  />
                ) : (
                  <p>No visualization available for this analysis.</p>
                )}
              </div>
            </div>
            
            <div className="result-actions">
              <button 
                onClick={() => {
                  window.location.href = `/map?analysis=${taskId}`;
                }}
                className="primary-button add-to-map-btn"
                aria-label="Add these results to the interactive map view"
              >
                View on Map
              </button>
              
              <button 
                onClick={() => {
                  // Mock export functionality
                  announceToScreenReader("Exporting results. Your download will begin shortly.");
                }}
                className="secondary-button export-btn"
                aria-label="Export these results to a file"
              >
                Export Results
              </button>
              
              <button
                onClick={() => {
                  setResults(null);
                  setTaskId(null);
                  setAnalysisStatus(null);
                  announceToScreenReader("Results cleared. You can now run a new analysis.");
                }}
                className="text-button clear-btn"
                aria-label="Clear these results and start a new analysis"
              >
                Clear Results
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Analysis Method Explainer Modal */}
      {showExplainer && analysisType && (
        <AnalysisMethodExplainer 
          analysisType={analysisType}
          options={analysisOptions.find(opt => opt.value === analysisType)}
          onClose={() => setShowExplainer(false)}
        />
      )}
      
      {/* Parameter Help Modal */}
      {showParameterHelp && (
        <AnalysisParameterHelp
          parameter={showParameterHelp}
          onClose={() => setShowParameterHelp(false)}
        />
      )}
    </div>
  );
};

export default AnalysisComponent;