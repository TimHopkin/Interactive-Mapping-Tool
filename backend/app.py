import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from celery import Celery
from dotenv import load_dotenv
from api.routes import register_routes
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from models.models import Base

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure app with secure defaults
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', 'interactive_mapping_tool_local_key'),
    CELERY_BROKER_URL=os.environ.get('REDIS_URL', 'redis://localhost:6379/0'),
    CELERY_RESULT_BACKEND=os.environ.get('REDIS_URL', 'redis://localhost:6379/0'),
    SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/spatial_db'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    AWS_ACCESS_KEY_ID=os.environ.get('AWS_ACCESS_KEY_ID'),
    AWS_SECRET_ACCESS_KEY=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    S3_BUCKET_NAME=os.environ.get('S3_BUCKET_NAME'),
    AWS_REGION=os.environ.get('AWS_REGION', 'us-east-1')
)

# Initialize SQLAlchemy
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

# Create tables if they don't exist
def setup_database():
    try:
        Base.metadata.create_all(bind=engine)
        app.logger.info("Database tables created or already exist")
    except Exception as e:
        app.logger.error(f"Error setting up database: {e}")

# Initialize Celery
celery = Celery(
    app.name,
    broker=app.config['CELERY_BROKER_URL'],
    backend=app.config['CELERY_RESULT_BACKEND']
)
celery.conf.update(app.config)

# Initialize services
from services.data_service import DataService
from services.analysis_service import AnalysisService

data_service = DataService(db_session)
analysis_service = AnalysisService(db_session)

# Register API routes
register_routes(app)

# Example celery task
@celery.task
def analyze_data(data_id, analysis_type, parameters):
    """
    Celery task for asynchronous data analysis
    
    Args:
        data_id: Dataset ID to analyze
        analysis_type: Type of analysis to perform
        parameters: Analysis parameters
        
    Returns:
        Result dictionary
    """
    try:
        # In a real implementation, use the analysis_service to perform the analysis
        from app import analysis_service
        
        # Create an analysis record
        analysis = analysis_service.create_analysis(
            name=f"{analysis_type.capitalize()} Analysis",
            analysis_type=analysis_type,
            dataset_id=data_id,
            user_id="system",  # In real app, would be the authenticated user
            parameters=parameters
        )
        
        # Perform the analysis
        result = analysis_service.perform_analysis(analysis.id)
        
        return {
            "task_id": str(analyze_data.request.id), 
            "data_id": data_id,
            "analysis_id": analysis.id,
            "analysis_type": analysis_type,
            "parameters": parameters,
            "status": "completed",
            "result": result
        }
    except Exception as e:
        # Log the error and return failure
        return {
            "task_id": str(analyze_data.request.id),
            "data_id": data_id,
            "analysis_type": analysis_type,
            "parameters": parameters,
            "status": "failed",
            "error": str(e)
        }

# Database setup for development
@app.before_first_request
def initialize_database():
    setup_database()

# Clean up database session
@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    setup_database()  # Setup database when running standalone
    app.run(host='0.0.0.0', port=5000, debug=True)