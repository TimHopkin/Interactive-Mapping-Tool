import React from 'react';

const AnalysisMethodExplainer = ({ analysisType, options, onClose }) => {
  if (!options) return null;

  // Find example use cases based on analysis type
  const getExampleUseCases = () => {
    switch (analysisType) {
      case 'clustering':
        return [
          {
            title: 'Identifying Business Districts',
            description: 'Cluster commercial establishments to identify distinct business districts within a city.',
            steps: [
              'Upload a dataset containing business locations with coordinates',
              'Use K-Means with 3-5 clusters to start',
              'Analyze the resulting clusters to identify major commercial zones'
            ]
          },
          {
            title: 'Finding Environmental Hotspots',
            description: 'Identify areas with high concentrations of environmental reports or incidents.',
            steps: [
              'Upload environmental incident data with geocoordinates',
              'Use DBSCAN to find areas with unusual concentrations',
              'Adjust epsilon value to refine cluster sizes based on urban vs. rural areas'
            ]
          }
        ];
      case 'buffer':
        return [
          {
            title: 'Service Area Analysis',
            description: 'Determine areas within walking distance of public facilities like schools or parks.',
            steps: [
              'Upload a dataset of facility locations',
              'Create buffers at distances like 400m (5-minute walk) and 800m (10-minute walk)',
              'Dissolve overlapping buffers to create service coverage zones'
            ]
          },
          {
            title: 'Environmental Impact Zones',
            description: 'Create protective buffers around environmentally sensitive areas.',
            steps: [
              'Upload boundaries of protected natural areas',
              'Apply buffers at distances defined by regulations (e.g., 100m)',
              'Use the result to identify areas where development should be restricted'
            ]
          }
        ];
      case 'intersection':
        return [
          {
            title: 'Flood Risk Assessment',
            description: 'Identify properties within flood-prone areas.',
            steps: [
              'Upload property boundary dataset',
              'Upload flood zone dataset',
              'Intersect the two to find properties at risk',
              'Preserve attributes to maintain property information'
            ]
          },
          {
            title: 'Land Use Compliance',
            description: 'Find areas where current land use conflicts with zoning regulations.',
            steps: [
              'Upload current land use dataset',
              'Upload zoning regulation boundaries',
              'Intersect to find areas of potential non-compliance'
            ]
          }
        ];
      case 'heatmap':
        return [
          {
            title: 'Crime Density Analysis',
            description: 'Visualize concentrations of reported crimes to identify hotspots.',
            steps: [
              'Upload crime incident data with coordinates',
              'Generate a heatmap with medium radius and intensity',
              'Use the "Blues" color scheme for better readability'
            ]
          },
          {
            title: 'Population Density Visualization',
            description: 'Create a heatmap showing where people live to identify dense urban centers.',
            steps: [
              'Upload population data with coordinates',
              'Apply a larger radius for a smoother visualization',
              'Use the "Spectral" color scheme to show variations in density'
            ]
          }
        ];
      default:
        return [];
    }
  };

  // Get technical details for each analysis method
  const getTechnicalDetails = () => {
    switch (analysisType) {
      case 'clustering':
        return {
          algorithms: [
            {
              name: 'K-Means',
              description: 'Partitions data into k clusters, minimizing the sum of squared distances to each centroid.',
              strengths: ['Simple and fast', 'Works well with evenly sized, globular clusters', 'Easily interpretable results'],
              limitations: ['Requires specifying the number of clusters in advance', 'Sensitive to outliers', 'Assumes clusters are spherical and similar in size']
            },
            {
              name: 'DBSCAN',
              description: 'Density-Based Spatial Clustering of Applications with Noise. Groups points that are closely packed together.',
              strengths: ['Discovers clusters of arbitrary shapes', 'Automatically identifies noise points', 'Does not require pre-specifying the number of clusters'],
              limitations: ['Sensitive to parameter choices', 'Struggles with clusters of varying densities', 'Can be computationally intensive for large datasets']
            }
          ],
          implementation: 'Uses scikit-learn on the backend for clustering algorithms, combined with PostGIS for spatial operations.'
        };
      case 'buffer':
        return {
          description: 'Creates zones around features at specified distances, using either Euclidean (straight-line) distance or network distance.',
          methods: [
            {
              name: 'Euclidean Buffer',
              description: 'Creates uniform buffers based on straight-line distance from features.',
              applications: ['Quick proximity analysis', 'Environmental protection zones', 'Simple service area approximation']
            },
            {
              name: 'Dissolve Option',
              description: 'Merges overlapping buffer areas into single polygons.',
              applications: ['Creating continuous service areas', 'Eliminating double-counting of overlapping zones']
            }
          ],
          implementation: 'Uses PostGIS ST_Buffer function for efficient spatial calculations, with parameters to control buffer shape and smoothness.'
        };
      case 'intersection':
        return {
          description: 'Calculates the geometric intersection of two datasets, returning only areas where both inputs overlap.',
          methods: [
            {
              name: 'Standard Intersection',
              description: 'Returns the geometric areas common to both input datasets.',
              applications: ['Finding areas affected by multiple conditions', 'Compliance analysis', 'Multi-criteria site selection']
            },
            {
              name: 'Attribute Preservation',
              description: 'Allows keeping attribute data from both input datasets in the result.',
              applications: ['Maintaining property information while identifying risk areas', 'Preserving classification data during overlap analysis']
            }
          ],
          implementation: 'Uses PostGIS ST_Intersection for efficient geometric operations with optimized spatial indexing.'
        };
      case 'heatmap':
        return {
          description: 'Creates density-based visualizations showing concentrations of point data.',
          methods: [
            {
              name: 'Kernel Density Estimation',
              description: 'Uses mathematical functions to spread the influence of each point across an area.',
              parameters: ['Radius controls the spread of influence around each point', 'Intensity adjusts the overall strength of the effect']
            },
            {
              name: 'Color Schemes',
              description: 'Different gradients to represent varying densities.',
              options: [
                'Default (Red-Yellow): Standard heat visualization from yellow (low) to red (high)',
                'Blues: Monochromatic scale good for water-related features and colorblind-friendly',
                'Spectral: Multi-color gradient showing fine variations in density',
                'Accessible: Color-blind friendly gradient that works for most types of color vision deficiency'
              ]
            }
          ],
          implementation: 'Combines server-side density calculations with client-side rendering using heatmap.js and Leaflet.'
        };
      default:
        return {};
    }
  };

  const exampleUseCases = getExampleUseCases();
  const technicalDetails = getTechnicalDetails();

  return (
    <div className="modal-overlay" role="dialog" aria-labelledby="explainer-title" aria-modal="true">
      <div className="explainer-modal">
        <div className="modal-header">
          <h2 id="explainer-title">{options.label} Explained</h2>
          <button 
            className="close-modal" 
            onClick={onClose}
            aria-label="Close explanation"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        
        <div className="modal-content">
          <section className="explainer-section">
            <h3>What is {options.label}?</h3>
            <p className="explainer-description">{options.description}</p>
          </section>
          
          <section className="explainer-section">
            <h3>How It Works</h3>
            <div className="technical-details">
              {analysisType === 'clustering' && (
                <>
                  <p>Clustering groups similar features based on their spatial relationships and attributes. This analysis identifies patterns that might not be immediately visible.</p>
                  
                  <div className="algorithm-cards">
                    {technicalDetails.algorithms.map(algo => (
                      <div className="algorithm-card" key={algo.name}>
                        <h4>{algo.name}</h4>
                        <p>{algo.description}</p>
                        <div className="algo-details">
                          <div className="algo-strengths">
                            <h5>Strengths</h5>
                            <ul>
                              {algo.strengths.map((strength, i) => (
                                <li key={i}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="algo-limitations">
                            <h5>Limitations</h5>
                            <ul>
                              {algo.limitations.map((limitation, i) => (
                                <li key={i}>{limitation}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {analysisType === 'buffer' && (
                <>
                  <p>{technicalDetails.description}</p>
                  
                  <div className="method-cards">
                    {technicalDetails.methods.map(method => (
                      <div className="method-card" key={method.name}>
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                        <div className="method-applications">
                          <h5>Applications</h5>
                          <ul>
                            {method.applications.map((app, i) => (
                              <li key={i}>{app}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="buffer-visual">
                    <div className="visual-container" aria-hidden="true">
                      {/* Simple SVG visualization of buffer analysis */}
                      <svg width="240" height="120" viewBox="0 0 240 120">
                        <circle cx="120" cy="60" r="10" fill="#4285f4" />
                        <circle cx="120" cy="60" r="30" fill="none" stroke="#4285f4" strokeWidth="2" strokeDasharray="3,3" />
                        <circle cx="120" cy="60" r="50" fill="none" stroke="#4285f4" strokeWidth="2" />
                      </svg>
                    </div>
                    <p className="visual-description">Buffer analysis creates zones at specified distances from features, like concentric rings around points or parallel zones along lines.</p>
                  </div>
                </>
              )}
              
              {analysisType === 'intersection' && (
                <>
                  <p>{technicalDetails.description}</p>
                  
                  <div className="intersection-visual">
                    <div className="visual-container" aria-hidden="true">
                      {/* Simple SVG visualization of intersection analysis */}
                      <svg width="240" height="120" viewBox="0 0 240 120">
                        <circle cx="100" cy="60" r="50" fill="#4285f4" fillOpacity="0.5" />
                        <circle cx="140" cy="60" r="50" fill="#ea4335" fillOpacity="0.5" />
                        <path d="M140,60 a50,50 0 0,0 -80,0 a50,50 0 0,0 80,0" fill="#5f6368" fillOpacity="0.8" />
                      </svg>
                    </div>
                    <p className="visual-description">Intersection analysis identifies areas where different datasets overlap, showing where multiple conditions are satisfied simultaneously.</p>
                  </div>
                  
                  <div className="method-cards">
                    {technicalDetails.methods.map(method => (
                      <div className="method-card" key={method.name}>
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                        <div className="method-applications">
                          <h5>Applications</h5>
                          <ul>
                            {method.applications.map((app, i) => (
                              <li key={i}>{app}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {analysisType === 'heatmap' && (
                <>
                  <p>{technicalDetails.description}</p>
                  
                  <div className="heatmap-visual">
                    <div className="visual-container" aria-hidden="true">
                      {/* Simple SVG visualization of heatmap analysis */}
                      <svg width="240" height="120" viewBox="0 0 240 120">
                        <defs>
                          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{stopColor:'#ea4335', stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:'#ea4335', stopOpacity:0}} />
                          </radialGradient>
                          <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{stopColor:'#ea4335', stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:'#ea4335', stopOpacity:0}} />
                          </radialGradient>
                          <radialGradient id="grad3" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{stopColor:'#ea4335', stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:'#ea4335', stopOpacity:0}} />
                          </radialGradient>
                        </defs>
                        <circle cx="80" cy="40" r="5" fill="#4285f4" />
                        <circle cx="100" cy="70" r="5" fill="#4285f4" />
                        <circle cx="130" cy="50" r="5" fill="#4285f4" />
                        <circle cx="150" cy="80" r="5" fill="#4285f4" />
                        <circle cx="170" cy="40" r="5" fill="#4285f4" />
                        <circle cx="80" cy="40" r="25" fill="url(#grad1)" opacity="0.7" />
                        <circle cx="130" cy="50" r="30" fill="url(#grad2)" opacity="0.7" />
                        <circle cx="150" cy="80" r="25" fill="url(#grad3)" opacity="0.7" />
                      </svg>
                    </div>
                    <p className="visual-description">Heatmaps use color gradients to visualize concentrations, with warmer colors typically representing higher densities.</p>
                  </div>
                  
                  <div className="method-cards">
                    {technicalDetails.methods.map(method => (
                      <div className="method-card" key={method.name}>
                        <h4>{method.name}</h4>
                        <p>{method.description}</p>
                        {method.parameters && (
                          <div className="method-parameters">
                            <h5>Parameters</h5>
                            <ul>
                              {method.parameters.map((param, i) => (
                                <li key={i}>{param}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {method.options && (
                          <div className="method-options">
                            <h5>Color Options</h5>
                            <ul>
                              {method.options.map((option, i) => (
                                <li key={i}>{option}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              <p className="implementation-note"><strong>Implementation:</strong> {technicalDetails.implementation}</p>
            </div>
          </section>
          
          <section className="explainer-section">
            <h3>Example Use Cases</h3>
            <div className="use-cases">
              {exampleUseCases.map((example, index) => (
                <div className="use-case-card" key={index}>
                  <h4>{example.title}</h4>
                  <p>{example.description}</p>
                  <div className="use-case-steps">
                    <h5>How to implement:</h5>
                    <ol>
                      {example.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="explainer-section">
            <h3>Tips for Best Results</h3>
            <div className="tips-container">
              {analysisType === 'clustering' && (
                <ul className="tips-list">
                  <li>Start with a smaller number of clusters (2-5) and increase as needed based on results.</li>
                  <li>For K-Means, try running the analysis multiple times with different numbers of clusters to find the optimal grouping.</li>
                  <li>For DBSCAN, experiment with epsilon values to find appropriate neighborhood sizes for your data scale.</li>
                  <li>Clean your data before clustering to remove outliers that might skew results.</li>
                  <li>Consider normalizing attributes if they have different scales or units.</li>
                </ul>
              )}
              
              {analysisType === 'buffer' && (
                <ul className="tips-list">
                  <li>Choose buffer distances that are meaningful for your analysis (e.g., regulatory requirements, walking distances).</li>
                  <li>Use the dissolve option when you want to prevent double-counting of overlapping areas.</li>
                  <li>Higher segment counts create smoother buffers but increase processing time and file size.</li>
                  <li>For walking distance analysis, consider that 400m is approximately a 5-minute walk.</li>
                  <li>Buffer distances are in meters, so adjust accordingly for your geographic context.</li>
                </ul>
              )}
              
              {analysisType === 'intersection' && (
                <ul className="tips-list">
                  <li>Ensure both datasets use the same coordinate reference system for accurate results.</li>
                  <li>Consider simplifying complex polygons before intersection to improve performance.</li>
                  <li>Enable "Preserve Attributes" if you need to analyze characteristics from both input datasets.</li>
                  <li>Clean up topology errors in input datasets to prevent unexpected results.</li>
                  <li>The result will only include areas where both inputs overlap, so areas unique to either dataset will be excluded.</li>
                </ul>
              )}
              
              {analysisType === 'heatmap' && (
                <ul className="tips-list">
                  <li>Adjust the radius based on the density and distribution of your data points.</li>
                  <li>Smaller radius values show more localized patterns, while larger values show broader trends.</li>
                  <li>Use higher intensity values for datasets with fewer points to make patterns more visible.</li>
                  <li>Consider using the "Blues" or "Accessible" color scheme for better visibility and accessibility.</li>
                  <li>Adjust opacity to balance the heatmap visibility with underlying map features.</li>
                </ul>
              )}
            </div>
          </section>
        </div>
        
        <div className="modal-footer">
          <button 
            className="close-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisMethodExplainer;