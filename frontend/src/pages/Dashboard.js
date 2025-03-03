import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [datasets, setDatasets] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // These endpoints need to be implemented in the backend
        const [datasetsResponse, analysesResponse] = await Promise.all([
          axios.get('/api/data/datasets'),
          axios.get('/api/analysis/recent')
        ]);
        
        setDatasets(datasetsResponse.data);
        setRecentAnalyses(analysesResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Set mock data for demonstration
        setDatasets([
          { id: 1, name: 'Land Use 2023', created_at: '2023-01-15', file_count: 3 },
          { id: 2, name: 'Population Data', created_at: '2023-01-10', file_count: 1 },
          { id: 3, name: 'Infrastructure Map', created_at: '2023-01-05', file_count: 5 }
        ]);
        
        setRecentAnalyses([
          { id: 1, name: 'Clustering Analysis', dataset: 'Land Use 2023', created_at: '2023-01-16', status: 'complete' },
          { id: 2, name: 'Buffer Analysis', dataset: 'Infrastructure Map', created_at: '2023-01-14', status: 'complete' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard loading">
        <h2>Dashboard</h2>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <div className="dashboard-actions">
        <Link to="/upload" className="dashboard-action">
          <div className="action-icon">📤</div>
          <div className="action-label">Upload Data</div>
        </Link>
        
        <Link to="/map" className="dashboard-action">
          <div className="action-icon">🗺️</div>
          <div className="action-label">View Map</div>
        </Link>
        
        <Link to="/analysis" className="dashboard-action">
          <div className="action-icon">📊</div>
          <div className="action-label">Analyze Data</div>
        </Link>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Your Datasets</h3>
          
          {datasets.length === 0 ? (
            <p>No datasets found. <Link to="/upload">Upload your first dataset</Link>.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Files</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map(dataset => (
                  <tr key={dataset.id}>
                    <td>{dataset.name}</td>
                    <td>{new Date(dataset.created_at).toLocaleDateString()}</td>
                    <td>{dataset.file_count}</td>
                    <td>
                      <div className="actions-menu">
                        <Link to={`/map?dataset=${dataset.id}`}>View</Link>
                        <Link to={`/analysis?dataset=${dataset.id}`}>Analyze</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="dashboard-section">
          <h3>Recent Analyses</h3>
          
          {recentAnalyses.length === 0 ? (
            <p>No analyses found. <Link to="/analysis">Run your first analysis</Link>.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dataset</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentAnalyses.map(analysis => (
                  <tr key={analysis.id}>
                    <td>{analysis.name}</td>
                    <td>{analysis.dataset}</td>
                    <td>{new Date(analysis.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${analysis.status}`}>
                        {analysis.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-menu">
                        <Link to={`/map?analysis=${analysis.id}`}>View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;