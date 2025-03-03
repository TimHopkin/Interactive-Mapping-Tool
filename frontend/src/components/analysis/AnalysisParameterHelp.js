import React from 'react';

const AnalysisParameterHelp = ({ parameter, onClose }) => {
  if (!parameter) return null;
  
  return (
    <div className="parameter-help-overlay" role="dialog" aria-labelledby="parameter-help-title" aria-modal="true">
      <div className="parameter-help-modal">
        <div className="modal-header">
          <h2 id="parameter-help-title">Help: {parameter.label}</h2>
          <button 
            className="close-modal" 
            onClick={onClose}
            aria-label={`Close help for ${parameter.label}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="parameter-explanation">
            <p>{parameter.description}</p>
            
            {/* Additional information based on parameter name */}
            {parameter.name === 'algorithm' && (
              <div className="algorithm-details">
                <h3>Algorithm Options</h3>
                
                <div className="option-card">
                  <h4>K-Means</h4>
                  <p>Partitions data into a specified number of clusters by minimizing the distance from each point to its cluster center.</p>
                  <h5>When to use:</h5>
                  <ul>
                    <li>You know approximately how many groups you want</li>
                    <li>Your clusters are expected to be roughly circular in shape</li>
                    <li>You want fast results for large datasets</li>
                  </ul>
                </div>
                
                <div className="option-card">
                  <h4>DBSCAN</h4>
                  <p>Density-Based Spatial Clustering of Applications with Noise. Groups points based on density without requiring a pre-specified number of clusters.</p>
                  <h5>When to use:</h5>
                  <ul>
                    <li>You don't know how many clusters to expect</li>
                    <li>Your clusters may have irregular shapes</li>
                    <li>You want to identify and exclude outliers automatically</li>
                  </ul>
                </div>
              </div>
            )}
            
            {parameter.name === 'n_clusters' && (
              <div className="parameter-guide">
                <h3>Choosing the Number of Clusters</h3>
                <p>This parameter determines how many groups the K-Means algorithm will divide your data into.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>Start Small</h4>
                    <p>Begin with 2-5 clusters and increase as needed based on your data complexity.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Domain Knowledge</h4>
                    <p>Use your understanding of the data to guide your choice. For example, if analyzing land use, you might choose clusters based on expected categories like residential, commercial, and industrial.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Evaluate Results</h4>
                    <p>Try several values and compare the results to find the most meaningful grouping for your analysis goals.</p>
                  </div>
                </div>
                
                <div className="visual-guide" aria-hidden="true">
                  <div className="clusters-visualization">
                    <div className="cluster-example">
                      <div className="cluster-viz cluster-3">
                        <span>3 clusters</span>
                        <svg width="100" height="60" viewBox="0 0 100 60">
                          <circle cx="30" cy="30" r="20" fill="#4285f4" fillOpacity="0.6" />
                          <circle cx="70" cy="30" r="20" fill="#ea4335" fillOpacity="0.6" />
                          <circle cx="50" cy="15" r="15" fill="#fbbc05" fillOpacity="0.6" />
                        </svg>
                      </div>
                      <p>Broader groupings, good for general patterns</p>
                    </div>
                    
                    <div className="cluster-example">
                      <div className="cluster-viz cluster-5">
                        <span>5 clusters</span>
                        <svg width="100" height="60" viewBox="0 0 100 60">
                          <circle cx="20" cy="20" r="15" fill="#4285f4" fillOpacity="0.6" />
                          <circle cx="50" cy="20" r="15" fill="#ea4335" fillOpacity="0.6" />
                          <circle cx="80" cy="20" r="15" fill="#fbbc05" fillOpacity="0.6" />
                          <circle cx="30" cy="45" r="15" fill="#34a853" fillOpacity="0.6" />
                          <circle cx="70" cy="45" r="15" fill="#5f6368" fillOpacity="0.6" />
                        </svg>
                      </div>
                      <p>More detailed groupings, better for specific analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {parameter.name === 'eps' && (
              <div className="parameter-guide">
                <h3>Epsilon (Neighborhood Size)</h3>
                <p>Defines the radius within which points are considered neighbors in the DBSCAN algorithm.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>Scale Dependence</h4>
                    <p>The appropriate value depends on the scale and density of your data.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Data Units</h4>
                    <p>For geographic data in decimal degrees, small values like 0.001-0.01 might be appropriate. For data in meters, values might be in tens or hundreds.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Experimentation</h4>
                    <p>Start with a small value and increase gradually until meaningful clusters emerge.</p>
                  </div>
                </div>
                
                <div className="visual-guide" aria-hidden="true">
                  <div className="eps-visualization">
                    <div className="eps-example">
                      <div className="eps-viz eps-small">
                        <span>Small Epsilon</span>
                        <svg width="100" height="60" viewBox="0 0 100 60">
                          <circle cx="30" cy="30" r="3" fill="#4285f4" />
                          <circle cx="38" cy="35" r="3" fill="#4285f4" />
                          <circle cx="25" cy="25" r="3" fill="#4285f4" />
                          <circle cx="33" cy="22" r="3" fill="#4285f4" />
                          <circle cx="32" cy="32" r="8" stroke="#4285f4" fill="none" strokeDasharray="2,2" />
                          
                          <circle cx="70" cy="30" r="3" fill="#ea4335" />
                          <circle cx="78" cy="35" r="3" fill="#ea4335" />
                          <circle cx="65" cy="25" r="3" fill="#ea4335" />
                          <circle cx="73" cy="32" r="3" fill="#ea4335" />
                          <circle cx="72" cy="32" r="8" stroke="#ea4335" fill="none" strokeDasharray="2,2" />
                        </svg>
                      </div>
                      <p>Creates more, smaller clusters</p>
                    </div>
                    
                    <div className="eps-example">
                      <div className="eps-viz eps-large">
                        <span>Large Epsilon</span>
                        <svg width="100" height="60" viewBox="0 0 100 60">
                          <circle cx="30" cy="30" r="3" fill="#4285f4" />
                          <circle cx="38" cy="35" r="3" fill="#4285f4" />
                          <circle cx="25" cy="25" r="3" fill="#4285f4" />
                          <circle cx="33" cy="22" r="3" fill="#4285f4" />
                          <circle cx="70" cy="30" r="3" fill="#4285f4" />
                          <circle cx="78" cy="35" r="3" fill="#4285f4" />
                          <circle cx="65" cy="25" r="3" fill="#4285f4" />
                          <circle cx="73" cy="32" r="3" fill="#4285f4" />
                          <circle cx="50" cy="30" r="30" stroke="#4285f4" fill="none" strokeDasharray="2,2" />
                        </svg>
                      </div>
                      <p>Merges points into fewer, larger clusters</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {parameter.name === 'min_samples' && (
              <div className="parameter-guide">
                <h3>Minimum Samples</h3>
                <p>The minimum number of points required to form a dense region (including the point itself) in the DBSCAN algorithm.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>Density Control</h4>
                    <p>Higher values require denser groupings to form clusters and will identify more points as noise.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Typical Values</h4>
                    <p>The default is often 4 or 5, providing a good balance. For sparse data, consider lower values.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Noise Sensitivity</h4>
                    <p>To reduce sensitivity to noise or outliers, increase this value.</p>
                  </div>
                </div>
              </div>
            )}
            
            {parameter.name === 'distance' && (
              <div className="parameter-guide">
                <h3>Buffer Distance</h3>
                <p>The distance in meters to create buffer zones around features.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>Common Values</h4>
                    <ul>
                      <li><strong>100-500m:</strong> Typical for infrastructure impact zones</li>
                      <li><strong>400m:</strong> Approximately a 5-minute walk</li>
                      <li><strong>800m:</strong> Approximately a 10-minute walk</li>
                      <li><strong>1000m:</strong> Common for service area analysis</li>
                    </ul>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Considerations</h4>
                    <p>Choose distances based on your analysis goals and real-world relevance. For example, regulations might specify particular buffer distances for environmental protection zones.</p>
                  </div>
                </div>
                
                <div className="visual-guide" aria-hidden="true">
                  <div className="buffer-visualization">
                    <svg width="200" height="100" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="5" fill="#34a853" />
                      <circle cx="100" cy="50" r="20" fill="none" stroke="#34a853" strokeWidth="2" />
                      <circle cx="100" cy="50" r="40" fill="none" stroke="#4285f4" strokeWidth="2" />
                      <circle cx="100" cy="50" r="60" fill="none" stroke="#ea4335" strokeWidth="2" />
                      
                      <line x1="100" y1="50" x2="160" y2="50" stroke="#333" strokeDasharray="2,2" />
                      <text x="130" y="45" fontSize="10" fill="#333">Buffer Distance</text>
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            {parameter.name === 'segments' && (
              <div className="parameter-guide">
                <h3>Buffer Segments</h3>
                <p>The number of line segments used to approximate curved edges in buffer polygons.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>Visual Quality vs. Performance</h4>
                    <p>Higher values create smoother, more visually appealing buffers but increase processing time and file size.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Recommended Values</h4>
                    <ul>
                      <li><strong>8-16:</strong> Good balance for most applications</li>
                      <li><strong>24-32:</strong> Higher quality for presentation or publication</li>
                      <li><strong>48-64:</strong> Very high quality, but may impact performance</li>
                    </ul>
                  </div>
                </div>
                
                <div className="visual-guide" aria-hidden="true">
                  <div className="segments-visualization">
                    <div className="segments-example">
                      <div className="segments-viz segments-8">
                        <span>8 segments</span>
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <polygon points="40,10 61,20 70,40 61,60 40,70 19,60 10,40 19,20" fill="none" stroke="#4285f4" strokeWidth="2" />
                          <circle cx="40" cy="40" r="3" fill="#4285f4" />
                        </svg>
                      </div>
                      <p>Faster processing, more angular</p>
                    </div>
                    
                    <div className="segments-example">
                      <div className="segments-viz segments-32">
                        <span>32 segments</span>
                        <svg width="80" height="80" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="30" fill="none" stroke="#4285f4" strokeWidth="2" />
                          <circle cx="40" cy="40" r="3" fill="#4285f4" />
                        </svg>
                      </div>
                      <p>Smoother appearance, larger files</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {parameter.name === 'preserve_attributes' && (
              <div className="parameter-guide">
                <h3>Preserve Attributes</h3>
                <p>When enabled, the resulting features will contain attribute data from both input datasets.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>When to Enable</h4>
                    <ul>
                      <li>You need to analyze characteristics from both datasets in the intersection result</li>
                      <li>You want to maintain information for identification or classification</li>
                      <li>You plan to use the intersection result for further analysis</li>
                    </ul>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>When to Disable</h4>
                    <ul>
                      <li>You only need the geometric intersection</li>
                      <li>You want to minimize the output file size</li>
                      <li>The attributes from input datasets aren't relevant to your analysis</li>
                    </ul>
                  </div>
                </div>
                
                <div className="attribute-example">
                  <h4>Example</h4>
                  <div className="attribute-table">
                    <div className="table-header">
                      <div className="table-cell">With Attributes Preserved:</div>
                    </div>
                    <div className="table-row">
                      <div className="table-cell">
                        <strong>From Dataset 1:</strong> zone_type = "residential", zone_id = "R-12"
                      </div>
                    </div>
                    <div className="table-row">
                      <div className="table-cell">
                        <strong>From Dataset 2:</strong> flood_risk = "high", elevation = "32m"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {parameter.name === 'radius' && (
              <div className="parameter-guide">
                <h3>Point Radius</h3>
                <p>The influence radius of each point in pixels. Controls how far each point's effect spreads in the heatmap.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>Effect on Visualization</h4>
                    <p>Larger radius values create a smoother, more generalized heatmap. Smaller values show more localized patterns.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Recommended Values</h4>
                    <ul>
                      <li><strong>10-20:</strong> Show detailed, localized patterns</li>
                      <li><strong>20-30:</strong> Good balance for most applications</li>
                      <li><strong>30-50:</strong> Show broader trends, smooth out local variations</li>
                    </ul>
                  </div>
                </div>
                
                <div className="visual-guide" aria-hidden="true">
                  <div className="radius-visualization">
                    <div className="radius-example">
                      <div className="radius-viz radius-small">
                        <span>Small Radius</span>
                        <svg width="100" height="60" viewBox="0 0 100 60">
                          <circle cx="30" cy="30" r="3" fill="#4285f4" />
                          <circle cx="38" cy="35" r="3" fill="#4285f4" />
                          <circle cx="25" cy="25" r="3" fill="#4285f4" />
                          <circle cx="33" cy="22" r="3" fill="#4285f4" />
                          <circle cx="30" cy="30" r="8" fill="url(#smallGrad)" />
                          
                          <circle cx="70" cy="30" r="3" fill="#4285f4" />
                          <circle cx="78" cy="35" r="3" fill="#4285f4" />
                          <circle cx="65" cy="25" r="3" fill="#4285f4" />
                          <circle cx="73" cy="32" r="3" fill="#4285f4" />
                          <circle cx="70" cy="30" r="8" fill="url(#smallGrad)" />
                        </svg>
                      </div>
                      <p>More defined hotspots, less overlap</p>
                    </div>
                    
                    <div className="radius-example">
                      <div className="radius-viz radius-large">
                        <span>Large Radius</span>
                        <svg width="100" height="60" viewBox="0 0 100 60">
                          <defs>
                            <radialGradient id="smallGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                              <stop offset="0%" style={{stopColor:'#ea4335', stopOpacity:0.8}} />
                              <stop offset="100%" style={{stopColor:'#ea4335', stopOpacity:0}} />
                            </radialGradient>
                            <radialGradient id="largeGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                              <stop offset="0%" style={{stopColor:'#ea4335', stopOpacity:0.8}} />
                              <stop offset="100%" style={{stopColor:'#ea4335', stopOpacity:0}} />
                            </radialGradient>
                          </defs>
                          <circle cx="30" cy="30" r="3" fill="#4285f4" />
                          <circle cx="38" cy="35" r="3" fill="#4285f4" />
                          <circle cx="25" cy="25" r="3" fill="#4285f4" />
                          <circle cx="33" cy="22" r="3" fill="#4285f4" />
                          <circle cx="70" cy="30" r="3" fill="#4285f4" />
                          <circle cx="78" cy="35" r="3" fill="#4285f4" />
                          <circle cx="65" cy="25" r="3" fill="#4285f4" />
                          <circle cx="73" cy="32" r="3" fill="#4285f4" />
                          <circle cx="30" cy="30" r="20" fill="url(#largeGrad)" />
                          <circle cx="70" cy="30" r="20" fill="url(#largeGrad)" />
                        </svg>
                      </div>
                      <p>Smoother, broader patterns with more blending</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {parameter.name === 'intensity' && (
              <div className="parameter-guide">
                <h3>Intensity</h3>
                <p>Controls the strength of each point's influence in the heatmap. Higher values create more intense, vivid representations.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>Effect on Visualization</h4>
                    <p>Higher intensity values make patterns more prominent and visible, especially useful for datasets with fewer points.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Recommended Values</h4>
                    <ul>
                      <li><strong>0.1-0.3:</strong> Subtle, less pronounced patterns</li>
                      <li><strong>0.4-0.6:</strong> Balanced visualization for most datasets</li>
                      <li><strong>0.7-1.0:</strong> Strong, vivid patterns, good for sparse data</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {parameter.name === 'gradient' && (
              <div className="parameter-guide">
                <h3>Color Gradient</h3>
                <p>The color scheme used to represent different density levels in the heatmap.</p>
                
                <div className="gradient-options">
                  <div className="gradient-option">
                    <h4>Default (Red-Yellow)</h4>
                    <div className="gradient-preview default-gradient" aria-hidden="true"></div>
                    <p>Standard heat visualization from yellow (low) to red (high). Provides good contrast and is intuitive for most users.</p>
                  </div>
                  
                  <div className="gradient-option">
                    <h4>Blues</h4>
                    <div className="gradient-preview blues-gradient" aria-hidden="true"></div>
                    <p>Monochromatic blue scale. Good for water-related features and more accessible for people with red-green color blindness.</p>
                  </div>
                  
                  <div className="gradient-option">
                    <h4>Spectral</h4>
                    <div className="gradient-preview spectral-gradient" aria-hidden="true"></div>
                    <p>Multi-color gradient from blue to red. Provides more visual differentiation for showing fine variations in density.</p>
                  </div>
                  
                  <div className="gradient-option">
                    <h4>Accessible (Yellow-Purple)</h4>
                    <div className="gradient-preview accessible-gradient" aria-hidden="true"></div>
                    <p>Color-blind friendly gradient designed to be distinguishable for most types of color vision deficiency.</p>
                  </div>
                </div>
                
                <div className="accessibility-note">
                  <h4>Accessibility Considerations</h4>
                  <p>When creating visualizations that need to be accessible to users with color vision deficiencies:</p>
                  <ul>
                    <li>The "Blues" or "Accessible" gradients are generally more distinguishable</li>
                    <li>Avoid relying solely on the red-green spectrum if possible</li>
                    <li>Consider providing alternative ways to access the data (e.g., data tables)</li>
                  </ul>
                </div>
              </div>
            )}
            
            {parameter.name === 'opacity' && (
              <div className="parameter-guide">
                <h3>Opacity</h3>
                <p>The transparency level of the heatmap. Lower values allow underlying map features to be more visible.</p>
                
                <div className="guidance-points">
                  <div className="guidance-point">
                    <h4>Effect on Visualization</h4>
                    <p>Adjusting opacity helps balance the visibility of the heatmap with the underlying base map.</p>
                  </div>
                  
                  <div className="guidance-point">
                    <h4>Recommended Values</h4>
                    <ul>
                      <li><strong>0.1-0.3:</strong> Subtle overlay that keeps base map details clearly visible</li>
                      <li><strong>0.4-0.6:</strong> Balanced visualization showing both heatmap and key map features</li>
                      <li><strong>0.7-0.9:</strong> Prominent heatmap where base map is less important</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
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

export default AnalysisParameterHelp;