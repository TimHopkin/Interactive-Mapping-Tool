import React from 'react';
import { Link } from 'react-router-dom';
import AnalysisComponent from '../components/analysis/AnalysisComponent';

const Analysis = () => {
  return (
    <div className="analysis-page">
      <div className="page-header">
        <h2>Spatial Analysis</h2>
        <p>
          Perform various spatial analyses on your uploaded datasets to extract insights and visualize patterns.
        </p>
      </div>
      
      <div className="analysis-section">
        <AnalysisComponent />
      </div>
      
      <div className="analysis-info">
        <h3>Analysis Types</h3>
        
        <div className="analysis-type">
          <h4>Clustering Analysis</h4>
          <p>
            Group similar features together based on spatial proximity and attributes. 
            Useful for identifying patterns and hotspots in your data.
          </p>
          <h5>Available Algorithms:</h5>
          <ul>
            <li>
              <strong>K-Means:</strong> Partitions data into k clusters, minimizing the sum of squared distances to each centroid.
            </li>
            <li>
              <strong>DBSCAN:</strong> Density-based clustering that can find arbitrarily shaped clusters and identify noise points.
            </li>
          </ul>
        </div>
        
        <div className="analysis-type">
          <h4>Buffer Analysis</h4>
          <p>
            Create polygon buffers around points, lines, or polygons at specified distances.
            Useful for proximity analysis, impact assessment, and service area coverage.
          </p>
          <h5>Parameters:</h5>
          <ul>
            <li>
              <strong>Distance:</strong> The buffer distance in meters.
            </li>
            <li>
              <strong>Segments:</strong> Number of line segments used to approximate curved edges (higher values create smoother buffers).
            </li>
          </ul>
        </div>
        
        <div className="analysis-type">
          <h4>Intersection Analysis</h4>
          <p>
            Find areas where different spatial datasets overlap.
            Useful for land use analysis, environmental impact studies, and more.
          </p>
          <h5>Requirements:</h5>
          <ul>
            <li>
              At least two datasets with polygon geometries.
            </li>
          </ul>
        </div>
        
        <div className="analysis-type">
          <h4>Heatmap Generation</h4>
          <p>
            Create density-based visualizations to identify concentrations and patterns in point data.
            Useful for visualizing population density, incident locations, and more.
          </p>
          <h5>Parameters:</h5>
          <ul>
            <li>
              <strong>Radius:</strong> The influence radius of each point (larger values create smoother heatmaps).
            </li>
            <li>
              <strong>Intensity:</strong> The overall intensity of the heatmap.
            </li>
            <li>
              <strong>Gradient:</strong> The color scheme used to represent different density levels.
            </li>
          </ul>
        </div>
      </div>
      
      <div className="page-footer">
        <p>
          After running an analysis, you can view the results on the <Link to="/map">map</Link> or
          export them for use in other applications.
        </p>
      </div>
    </div>
  );
};

export default Analysis;