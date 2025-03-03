import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalysisComponent = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [analysisType, setAnalysisType] = useState('');
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [results, setResults] = useState(null);

  // Analysis types options
  const analysisOptions = [
    { value: 'clustering', label: 'Clustering Analysis', 
      params: [
        { name: 'algorithm', label: 'Algorithm', type: 'select', 
          options: [
            { value: 'kmeans', label: 'K-Means' },
            { value: 'dbscan', label: 'DBSCAN' }
          ] 
        },
        { name: 'n_clusters', label: 'Number of Clusters', type: 'number', min: 2, max: 20, 
          showIf: { param: 'algorithm', value: 'kmeans' } 
        },
        { name: 'eps', label: 'Epsilon (neighborhood size)', type: 'number', step: 0.01, 
          showIf: { param: 'algorithm', value: 'dbscan' } 
        },
        { name: 'min_samples', label: 'Minimum Samples', type: 'number', min: 1, 
          showIf: { param: 'algorithm', value: 'dbscan' } 
        }
      ] 
    },
    { value: 'buffer', label: 'Buffer Analysis', 
      params: [
        { name: 'distance', label: 'Buffer Distance (meters)', type: 'number', min: 0 },
        { name: 'segments', label: 'Buffer Segments', type: 'number', min: 4, max: 64 }
      ] 
    },
    { value: 'intersection', label: 'Intersection Analysis', 
      params: [
        { name: 'target_dataset', label: 'Target Dataset', type: 'select', 
          options: [] // This will be populated with available datasets
        }
      ] 
    },
    { value: 'heatmap', label: 'Heatmap Generation', 
      params: [
        { name: 'radius', label: 'Point Radius', type: 'number', min: 1 },
        { name: 'intensity', label: 'Intensity', type: 'number', min: 0.1, max: 1, step: 0.1 },
        { name: 'gradient', label: 'Color Gradient', type: 'select', 
          options: [
            { value: 'default', label: 'Default (Red-Yellow)' },
            { value: 'blues', label: 'Blues' },
            { value: 'spectral', label: 'Spectral' }
          ] 
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
        } else if (response.data.state === 'FAILURE') {
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
        } else {
          initialParams[param.name] = '';
        }
      });
    }
    
    setParameters(initialParams);
  };

  const handleParameterChange = (paramName, value) => {
    setParameters(prevParams => ({
      ...prevParams,
      [paramName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDataset || !analysisType) {
      setAnalysisStatus('Please select a dataset and analysis type');
      return;
    }
    
    setLoading(true);
    setTaskId(null);
    setResults(null);
    setAnalysisStatus('Starting analysis...');
    
    try {
      // This endpoint needs to be implemented in the backend
      const response = await axios.post('/api/analysis/start', {
        dataset_id: selectedDataset,
        analysis_type: analysisType,
        parameters: parameters
      });
      
      setTaskId(response.data.task_id);
      setAnalysisStatus('Analysis in progress...');
    } catch (error) {
      setAnalysisStatus(`Analysis failed: ${error.response?.data?.message || error.message}`);
      setLoading(false);
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

  // Update intersection analysis target dataset options
  useEffect(() => {
    if (analysisType === 'intersection') {
      const analysisIndex = analysisOptions.findIndex(option => option.value === 'intersection');
      if (analysisIndex >= 0) {
        const paramIndex = analysisOptions[analysisIndex].params.findIndex(p => p.name === 'target_dataset');
        if (paramIndex >= 0) {
          const datasetOptions = datasets
            .filter(d => d.id !== selectedDataset) // Exclude the selected dataset
            .map(d => ({ value: d.id, label: d.name }));
          
          analysisOptions[analysisIndex].params[paramIndex].options = datasetOptions;
          
          // Set default value if available
          if (datasetOptions.length > 0 && (!parameters.target_dataset || !datasetOptions.find(o => o.value === parameters.target_dataset))) {
            handleParameterChange('target_dataset', datasetOptions[0].value);
          }
        }
      }
    }
  }, [datasets, selectedDataset, analysisType]);

  return (
    <div className="analysis-container">
      <h2>Spatial Analysis</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dataset">Select Dataset</label>
          <select
            id="dataset"
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">-- Select a dataset --</option>
            {datasets.map(dataset => (
              <option key={dataset.id} value={dataset.id}>
                {dataset.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="analysisType">Analysis Type</label>
          <select
            id="analysisType"
            value={analysisType}
            onChange={handleAnalysisTypeChange}
            required
            disabled={loading}
          >
            <option value="">-- Select an analysis type --</option>
            {analysisOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {analysisType && (
          <div className="analysis-parameters">
            <h3>Analysis Parameters</h3>
            
            {getVisibleParameters().map(param => (
              <div className="form-group" key={param.name}>
                <label htmlFor={param.name}>{param.label}</label>
                
                {param.type === 'select' ? (
                  <select
                    id={param.name}
                    value={parameters[param.name] || ''}
                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    disabled={loading}
                  >
                    {param.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : param.type === 'number' ? (
                  <input
                    type="number"
                    id={param.name}
                    value={parameters[param.name] || ''}
                    onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
                    min={param.min}
                    max={param.max}
                    step={param.step || 1}
                    disabled={loading}
                  />
                ) : (
                  <input
                    type="text"
                    id={param.name}
                    value={parameters[param.name] || ''}
                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    disabled={loading}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !selectedDataset || !analysisType}
        >
          {loading ? 'Running Analysis...' : 'Run Analysis'}
        </button>
      </form>
      
      {analysisStatus && (
        <div className="analysis-status">
          <h3>Analysis Status</h3>
          <p>{analysisStatus}</p>
          {taskId && !results && <div className="loading-spinner"></div>}
        </div>
      )}
      
      {results && (
        <div className="analysis-results">
          <h3>Analysis Results</h3>
          {/* Display results based on analysis type */}
          <pre>{JSON.stringify(results, null, 2)}</pre>
          
          <div className="result-actions">
            <button 
              onClick={() => {/* Logic to add result to map */}}
              className="add-to-map-btn"
            >
              Add to Map
            </button>
            <button 
              onClick={() => {/* Logic to export results */}}
              className="export-btn"
            >
              Export Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisComponent;