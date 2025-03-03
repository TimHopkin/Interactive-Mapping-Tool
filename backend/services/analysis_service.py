import os
import uuid
import json
from datetime import datetime
import numpy as np
import pandas as pd
import geopandas as gpd
from sklearn.cluster import KMeans, DBSCAN
from shapely.geometry import Point, LineString, Polygon, shape
from shapely.ops import unary_union, cascaded_union
import pyproj
from functools import partial
from shapely.ops import transform
from models.models import Dataset, Layer, Feature, Analysis

class AnalysisService:
    """Service for performing spatial analysis operations"""
    
    def __init__(self, db_session):
        """
        Initialize the AnalysisService
        
        Args:
            db_session: SQLAlchemy database session
        """
        self.db_session = db_session
    
    def create_analysis(self, name, analysis_type, dataset_id, user_id, parameters=None):
        """
        Create a new analysis record
        
        Args:
            name: Analysis name
            analysis_type: Type of analysis (e.g., buffer, cluster)
            dataset_id: Dataset ID to analyze
            user_id: User ID
            parameters: Dict of analysis parameters
            
        Returns:
            Analysis object
        """
        analysis = Analysis(
            name=name,
            analysis_type=analysis_type,
            dataset_id=dataset_id,
            user_id=user_id,
            parameters=parameters or {},
            status='pending'
        )
        self.db_session.add(analysis)
        self.db_session.commit()
        return analysis
    
    def update_analysis_status(self, analysis_id, status, result_metadata=None):
        """
        Update the status of an analysis
        
        Args:
            analysis_id: Analysis ID
            status: New status
            result_metadata: Analysis result metadata (optional)
            
        Returns:
            Updated Analysis object
        """
        analysis = self.db_session.query(Analysis).get(analysis_id)
        if not analysis:
            raise ValueError(f"Analysis with ID {analysis_id} not found")
        
        analysis.status = status
        if status == 'completed':
            analysis.completed_at = datetime.utcnow()
        
        if result_metadata:
            analysis.result_metadata = result_metadata
        
        self.db_session.commit()
        return analysis
    
    def perform_analysis(self, analysis_id):
        """
        Perform the analysis for the given analysis ID
        
        Args:
            analysis_id: Analysis ID
            
        Returns:
            Result metadata
        """
        analysis = self.db_session.query(Analysis).get(analysis_id)
        if not analysis:
            raise ValueError(f"Analysis with ID {analysis_id} not found")
        
        # Update status to running
        self.update_analysis_status(analysis_id, 'running')
        
        try:
            # Get the dataset
            dataset = self.db_session.query(Dataset).get(analysis.dataset_id)
            if not dataset:
                raise ValueError(f"Dataset with ID {analysis.dataset_id} not found")
            
            # Load the features
            # In a real implementation, this would retrieve the actual features from the database
            # and convert them to GeoDataFrame
            
            # Choose analysis method based on type
            if analysis.analysis_type == 'clustering':
                result = self._perform_clustering(analysis, dataset)
            elif analysis.analysis_type == 'buffer':
                result = self._perform_buffer(analysis, dataset)
            elif analysis.analysis_type == 'intersection':
                result = self._perform_intersection(analysis, dataset)
            elif analysis.analysis_type == 'heatmap':
                result = self._perform_heatmap(analysis, dataset)
            else:
                raise ValueError(f"Unsupported analysis type: {analysis.analysis_type}")
            
            # Update status to completed with result metadata
            self.update_analysis_status(analysis_id, 'completed', result)
            
            return result
        except Exception as e:
            # Update status to failed
            self.update_analysis_status(analysis_id, 'failed', {'error': str(e)})
            raise
    
    def _perform_clustering(self, analysis, dataset):
        """
        Perform clustering analysis
        
        Args:
            analysis: Analysis object
            dataset: Dataset object
            
        Returns:
            Result metadata
        """
        # Extract parameters
        algorithm = analysis.parameters.get('algorithm', 'kmeans')
        
        # In a real implementation, you would:
        # 1. Load the features into a GeoDataFrame
        # 2. Extract coordinates or other attributes for clustering
        # 3. Apply the clustering algorithm
        # 4. Create a new layer with the clusters
        # 5. Save the results to the database
        
        # Mock result
        result = {
            'algorithm': algorithm,
            'num_clusters': 3 if algorithm == 'kmeans' else 2,
            'features_per_cluster': [10, 15, 20] if algorithm == 'kmeans' else [25, 20],
            'output_layer_id': str(uuid.uuid4())
        }
        
        return result
    
    def _perform_buffer(self, analysis, dataset):
        """
        Perform buffer analysis
        
        Args:
            analysis: Analysis object
            dataset: Dataset object
            
        Returns:
            Result metadata
        """
        # Extract parameters
        distance = analysis.parameters.get('distance', 100)  # meters
        segments = analysis.parameters.get('segments', 16)
        
        # In a real implementation, you would:
        # 1. Load the features into a GeoDataFrame
        # 2. Apply the buffer operation
        # 3. Create a new layer with the buffered geometries
        # 4. Save the results to the database
        
        # Mock result
        result = {
            'distance': distance,
            'segments': segments,
            'features_processed': 50,
            'output_layer_id': str(uuid.uuid4())
        }
        
        return result
    
    def _perform_intersection(self, analysis, dataset):
        """
        Perform intersection analysis
        
        Args:
            analysis: Analysis object
            dataset: Dataset object
            
        Returns:
            Result metadata
        """
        # Extract parameters
        target_dataset_id = analysis.parameters.get('target_dataset')
        
        # In a real implementation, you would:
        # 1. Load the features from both datasets into GeoDataFrames
        # 2. Perform the spatial intersection
        # 3. Create a new layer with the intersection geometries
        # 4. Save the results to the database
        
        # Mock result
        result = {
            'target_dataset_id': target_dataset_id,
            'features_processed': 30,
            'intersections_found': 12,
            'output_layer_id': str(uuid.uuid4())
        }
        
        return result
    
    def _perform_heatmap(self, analysis, dataset):
        """
        Generate heatmap data
        
        Args:
            analysis: Analysis object
            dataset: Dataset object
            
        Returns:
            Result metadata
        """
        # Extract parameters
        radius = analysis.parameters.get('radius', 25)
        intensity = analysis.parameters.get('intensity', 0.5)
        gradient = analysis.parameters.get('gradient', 'default')
        
        # In a real implementation, you would:
        # 1. Load the point features into a GeoDataFrame
        # 2. Generate heatmap data (e.g., using kernel density estimation)
        # 3. Create a new layer with the heatmap data
        # 4. Save the results to the database
        
        # Mock result
        result = {
            'radius': radius,
            'intensity': intensity,
            'gradient': gradient,
            'points_processed': 100,
            'output_layer_id': str(uuid.uuid4())
        }
        
        return result
    
    def get_analysis(self, analysis_id):
        """Get an analysis by ID"""
        return self.db_session.query(Analysis).get(analysis_id)
    
    def get_analyses_for_user(self, user_id, limit=10):
        """Get recent analyses for a user"""
        return self.db_session.query(Analysis)\
            .filter(Analysis.user_id == user_id)\
            .order_by(Analysis.created_at.desc())\
            .limit(limit)\
            .all()
    
    def get_analyses_for_dataset(self, dataset_id):
        """Get all analyses for a dataset"""
        return self.db_session.query(Analysis)\
            .filter(Analysis.dataset_id == dataset_id)\
            .order_by(Analysis.created_at.desc())\
            .all()