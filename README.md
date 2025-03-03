# Interactive Land Analysis Mapping Tool

A human-centered, accessible web platform for analyzing and visualizing land-related data through interactive maps and analytical tools.

## Features

- **Data upload and management**: Support for various formats (shapefiles, GeoJSON, CSV, raster files)
- **Interactive mapping**: Visualize and overlay multiple data layers with keyboard navigation support
- **Spatial analysis**: Perform clustering, buffering, intersection, and heatmap generation
- **Data integration**: Combine user-uploaded data with external datasets
- **Accessible interface**: Full screen reader support, keyboard navigation, and color contrast options
- **User-friendly dashboard**: Intuitive controls with comprehensive help documentation

## Human-Centered Design Approach

This tool prioritizes inclusive, accessible design throughout the application:

- **Adaptable interface**: Adjustable text size, color themes, and contrast modes
- **Alternative content representations**: Map data available in interactive tables for screen readers
- **Reduced motion options**: For users with vestibular disorders or motion sensitivity
- **Keyboard navigation**: Complete functionality without requiring a mouse
- **Educational components**: Clear explanations of analysis methods and parameters
- **Progressive onboarding**: Guided introduction to features based on user experience level
- **Plain language**: Clear, concise descriptions avoiding technical jargon

## Tech Stack

### Frontend
- React.js
- Leaflet.js for interactive maps with accessibility enhancements
- D3.js and Plotly.js for data visualization
- ARIA attributes and semantic HTML for screen reader support

### Backend
- Flask API
- Celery for asynchronous processing
- Python-based analysis using scikit-learn, GDAL/OGR

### Database
- PostgreSQL with PostGIS extension for spatial data

### Infrastructure
- Docker and Kubernetes for containerization
- AWS S3 for data storage
- Redis for caching

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.8+
- Docker and Docker Compose
- PostgreSQL with PostGIS

### Installation

1. Clone the repository
2. Set up the frontend:
   ```
   cd frontend
   npm install
   ```
3. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   ```
4. Configure environment variables by copying `.env.example` to `.env` and updating values
5. Start the development environment:
   ```
   docker-compose up
   ```

## Accessibility Features

- **Screen reader optimization**: Semantic structure and ARIA attributes for assistive technology
- **Keyboard navigation**: Full functionality without requiring a mouse or touch input
- **Visual adjustments**: Configurable text size, contrast settings, and color modes
- **Alternative formats**: Data tables as alternatives to visual map representations
- **Focus management**: Clear focus indicators and logical tab order
- **Reduced motion**: Option to minimize animations and transitions
- **Error prevention**: Clear validation and helpful error messages
- **Comprehensive help**: Context-specific guidance throughout the application

## Documentation

See the `docs` directory for detailed documentation:
- User Guide
- API Documentation
- Technical Architecture
- Development Guidelines
- Accessibility Compliance

## License

[MIT License](LICENSE)