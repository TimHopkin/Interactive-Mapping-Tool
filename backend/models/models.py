from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    """Generate a UUID as string for use as primary key"""
    return str(uuid.uuid4())

class User(Base):
    """User model for authentication and ownership"""
    __tablename__ = 'users'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    datasets = relationship('Dataset', back_populates='user')
    analyses = relationship('Analysis', back_populates='user')

class Dataset(Base):
    """Dataset model for storing uploaded data information"""
    __tablename__ = 'datasets'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    format = Column(String(50))  # e.g., shapefile, geojson, csv
    user_id = Column(String(36), ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    metadata = Column(JSON)  # Stores additional metadata about the dataset
    
    # Relationships
    user = relationship('User', back_populates='datasets')
    layers = relationship('Layer', back_populates='dataset')
    analyses = relationship('Analysis', back_populates='dataset')

class Layer(Base):
    """Layer model for representing individual spatial data layers"""
    __tablename__ = 'layers'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    dataset_id = Column(String(36), ForeignKey('datasets.id'))
    analysis_id = Column(String(36), ForeignKey('analyses.id'), nullable=True)
    layer_type = Column(String(50))  # e.g., vector, raster, heatmap
    geometry_type = Column(String(50))  # e.g., point, line, polygon, multipolygon
    style = Column(JSON)  # Stores style information for rendering
    visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # For vector layers
    geom_field = Column(String(50), default='geom')
    
    # Relationships
    dataset = relationship('Dataset', back_populates='layers')
    analysis = relationship('Analysis', back_populates='output_layers')
    features = relationship('Feature', back_populates='layer')

class Feature(Base):
    """Feature model for storing individual spatial features"""
    __tablename__ = 'features'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    layer_id = Column(String(36), ForeignKey('layers.id'))
    properties = Column(JSON)  # Store non-spatial attributes
    geom = Column(Geometry('GEOMETRY', srid=4326))  # Store spatial geometry
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    layer = relationship('Layer', back_populates='features')

class Analysis(Base):
    """Analysis model for tracking spatial analysis operations"""
    __tablename__ = 'analyses'
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    analysis_type = Column(String(50), nullable=False)  # e.g., buffer, cluster, intersection
    parameters = Column(JSON)  # Store analysis parameters
    status = Column(String(50), default='pending')  # e.g., pending, running, completed, failed
    task_id = Column(String(36))  # For tracking Celery tasks
    user_id = Column(String(36), ForeignKey('users.id'))
    dataset_id = Column(String(36), ForeignKey('datasets.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    result_metadata = Column(JSON)  # Store analysis results metadata
    
    # Relationships
    user = relationship('User', back_populates='analyses')
    dataset = relationship('Dataset', back_populates='analyses')
    output_layers = relationship('Layer', back_populates='analysis')