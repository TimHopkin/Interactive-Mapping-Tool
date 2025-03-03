import os
import uuid
import json
from datetime import datetime
import boto3
from werkzeug.utils import secure_filename
import fiona
import geopandas as gpd
import pandas as pd
from shapely.geometry import Point, LineString, Polygon
import rasterio
from rasterio.warp import calculate_default_transform
from models.models import Dataset, Layer, Feature, User

class DataService:
    """Service for handling data upload, storage, and retrieval"""
    
    def __init__(self, db_session, s3_client=None, s3_bucket=None):
        """
        Initialize the DataService
        
        Args:
            db_session: SQLAlchemy database session
            s3_client: boto3 S3 client (optional)
            s3_bucket: S3 bucket name (optional)
        """
        self.db_session = db_session
        self.s3_client = s3_client or boto3.client('s3')
        self.s3_bucket = s3_bucket or os.environ.get('S3_BUCKET_NAME')
        
    def create_dataset(self, name, description, user_id, format=None):
        """
        Create a new dataset record
        
        Args:
            name: Dataset name
            description: Dataset description
            user_id: ID of the user creating the dataset
            format: Format of the dataset (e.g., shapefile, geojson)
            
        Returns:
            Dataset object
        """
        dataset = Dataset(
            name=name,
            description=description,
            user_id=user_id,
            format=format
        )
        self.db_session.add(dataset)
        self.db_session.commit()
        return dataset
    
    def upload_file_to_s3(self, file_object, filename, content_type=None):
        """
        Upload a file to S3
        
        Args:
            file_object: File object to upload
            filename: Name to give the file in S3
            content_type: MIME type of the file (optional)
            
        Returns:
            S3 object URL
        """
        # Generate a unique object key
        object_key = f"uploads/{uuid.uuid4()}/{secure_filename(filename)}"
        
        # Upload to S3
        extra_args = {}
        if content_type:
            extra_args['ContentType'] = content_type
            
        self.s3_client.upload_fileobj(
            file_object,
            self.s3_bucket,
            object_key,
            ExtraArgs=extra_args
        )
        
        # Return the S3 object URL
        return f"https://{self.s3_bucket}.s3.amazonaws.com/{object_key}"
    
    def process_uploaded_files(self, files, dataset_id):
        """
        Process uploaded spatial data files
        
        Args:
            files: List of file objects
            dataset_id: ID of the dataset to associate with the files
            
        Returns:
            Dictionary with processing results
        """
        # This is a simplified implementation
        # In reality, this would need to handle various file formats,
        # validate the files, and properly process them
        
        result = {
            "processed_files": len(files),
            "layers_created": 0,
            "features_created": 0,
            "errors": []
        }
        
        # Get the dataset
        dataset = self.db_session.query(Dataset).get(dataset_id)
        if not dataset:
            raise ValueError(f"Dataset with ID {dataset_id} not found")
        
        # Process each file based on its extension
        for file in files:
            filename = secure_filename(file.filename)
            file_ext = os.path.splitext(filename)[1].lower()
            
            try:
                # Upload to S3
                file_url = self.upload_file_to_s3(file, filename)
                
                # Process based on file type
                if file_ext in ['.geojson', '.json']:
                    # Process GeoJSON
                    self._process_geojson(file, dataset)
                    result["layers_created"] += 1
                elif file_ext == '.shp':
                    # Process Shapefile
                    self._process_shapefile(file, dataset)
                    result["layers_created"] += 1
                elif file_ext in ['.csv', '.txt']:
                    # Process CSV
                    self._process_csv(file, dataset)
                    result["layers_created"] += 1
                elif file_ext in ['.tif', '.tiff']:
                    # Process GeoTIFF
                    self._process_geotiff(file, dataset)
                    result["layers_created"] += 1
                else:
                    result["errors"].append(f"Unsupported file format: {file_ext}")
                    
            except Exception as e:
                result["errors"].append(f"Error processing {filename}: {str(e)}")
        
        return result
    
    def _process_geojson(self, file, dataset):
        """Process a GeoJSON file"""
        # In a real implementation, you would:
        # 1. Parse the GeoJSON
        # 2. Create a Layer
        # 3. Create Features for each feature in the GeoJSON
        # 4. Store in the database
        pass
    
    def _process_shapefile(self, file, dataset):
        """Process a Shapefile"""
        # In a real implementation, you would:
        # 1. Save the shapefile to a temporary location
        # 2. Read it with fiona or geopandas
        # 3. Create a Layer
        # 4. Create Features for each feature in the shapefile
        # 5. Store in the database
        pass
    
    def _process_csv(self, file, dataset):
        """Process a CSV file with geographic coordinates"""
        # In a real implementation, you would:
        # 1. Read the CSV with pandas
        # 2. Identify coordinate columns
        # 3. Convert to GeoDataFrame
        # 4. Create a Layer
        # 5. Create Features for each row
        # 6. Store in the database
        pass
    
    def _process_geotiff(self, file, dataset):
        """Process a GeoTIFF file"""
        # In a real implementation, you would:
        # 1. Save the GeoTIFF to a temporary location
        # 2. Read it with rasterio
        # 3. Create a Layer for the raster
        # 4. Store metadata
        # 5. Potentially convert to vector features if needed
        pass
    
    def get_dataset(self, dataset_id):
        """Get a dataset by ID"""
        return self.db_session.query(Dataset).get(dataset_id)
    
    def get_datasets_for_user(self, user_id):
        """Get all datasets for a user"""
        return self.db_session.query(Dataset).filter(Dataset.user_id == user_id).all()
    
    def get_layer(self, layer_id):
        """Get a layer by ID"""
        return self.db_session.query(Layer).get(layer_id)
    
    def get_layers_for_dataset(self, dataset_id):
        """Get all layers for a dataset"""
        return self.db_session.query(Layer).filter(Layer.dataset_id == dataset_id).all()
    
    def get_features_for_layer(self, layer_id, bbox=None, limit=1000):
        """
        Get features for a layer, optionally filtered by a bounding box
        
        Args:
            layer_id: Layer ID
            bbox: Bounding box tuple (minx, miny, maxx, maxy)
            limit: Maximum number of features to return
            
        Returns:
            List of Feature objects
        """
        query = self.db_session.query(Feature).filter(Feature.layer_id == layer_id)
        
        if bbox:
            # Use PostGIS ST_MakeEnvelope to create a bounding box
            # and ST_Intersects to filter by it
            minx, miny, maxx, maxy = bbox
            query = query.filter(
                "ST_Intersects("
                "geom, "
                f"ST_MakeEnvelope({minx}, {miny}, {maxx}, {maxy}, 4326)"
                ")"
            )
        
        return query.limit(limit).all()
    
    def delete_dataset(self, dataset_id):
        """Delete a dataset and all associated layers and features"""
        dataset = self.get_dataset(dataset_id)
        if not dataset:
            return False
        
        # Delete associated layers and features
        for layer in dataset.layers:
            # Delete features
            self.db_session.query(Feature).filter(Feature.layer_id == layer.id).delete()
            
            # Delete layer
            self.db_session.delete(layer)
        
        # Delete dataset
        self.db_session.delete(dataset)
        self.db_session.commit()
        
        return True