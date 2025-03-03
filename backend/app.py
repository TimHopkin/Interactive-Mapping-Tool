import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from celery import Celery
from dotenv import load_dotenv
from api.routes import register_routes

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure app
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', 'dev_key'),
    CELERY_BROKER_URL=os.environ.get('REDIS_URL', 'redis://localhost:6379/0'),
    CELERY_RESULT_BACKEND=os.environ.get('REDIS_URL', 'redis://localhost:6379/0'),
    SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/spatial_db'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    AWS_ACCESS_KEY_ID=os.environ.get('AWS_ACCESS_KEY_ID'),
    AWS_SECRET_ACCESS_KEY=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    S3_BUCKET_NAME=os.environ.get('S3_BUCKET_NAME'),
    AWS_REGION=os.environ.get('AWS_REGION', 'us-east-1')
)

# Initialize Celery
celery = Celery(
    app.name,
    broker=app.config['CELERY_BROKER_URL'],
    backend=app.config['CELERY_RESULT_BACKEND']
)
celery.conf.update(app.config)

# Register API routes
register_routes(app)

# Example celery task
@celery.task
def analyze_data(data_id, analysis_type, parameters):
    # Placeholder for data analysis logic
    # In a real implementation, this would perform spatial analysis using libraries
    # like scikit-learn, GDAL, etc.
    return {
        "task_id": str(analyze_data.request.id), 
        "data_id": data_id, 
        "analysis_type": analysis_type,
        "parameters": parameters,
        "status": "completed"
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)